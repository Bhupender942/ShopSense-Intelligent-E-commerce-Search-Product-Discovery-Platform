 "use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  ShoppingBag, 
  Package, 
  Star, 
  Filter, 
  TrendingUp, 
  Loader2 
} from "lucide-react";
import { Autosuggest } from "./ui/autosuggest";
import { useProductSearch, useAutosuggest, trackSearchAnalytics } from "@/hooks/use-autosuggest";

// Product interface matching backend structure
interface Product {
  _id: string;
  product_id: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  average_rating: number;
  rating_count: number;
  availability: string;
  images: string[];
  popularity_score: number;
}

interface SearchFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  sortOrder?: string;
}

// Enhanced SearchBar Component
interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (term: string, type?: string) => void;
  className?: string;
  category?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  onSearch,
  className = "",
  category,
}) => {
  const handleSelect = async (selectedQuery: string, type?: string) => {
    setQuery(selectedQuery);
    onSearch(selectedQuery, type);
    
    // Track analytics
    await trackSearchAnalytics(selectedQuery, "search", category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className={`relative w-full max-w-4xl ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <Autosuggest
            value={query}
            onChange={setQuery}
            onSelect={handleSelect}
            placeholder="Search for products, brands, categories and more..."
            className="w-full pl-12 pr-16 py-4 text-lg"
            category={category}
          />
          
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Search className="h-6 w-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const discountPercentage = product.discount_percentage || 0;
  const hasDiscount = discountPercentage > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
        <Package className="h-16 w-16 text-gray-400" />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{Math.round(discountPercentage)}%
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
          {product.category}
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        
        {/* Rating */}
        {product.average_rating > 0 && (
          <div className="flex items-center mb-2">
            <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded text-sm">
              <span className="font-semibold">{product.average_rating.toFixed(1)}</span>
              <Star className="h-3 w-3 ml-1 fill-current" />
            </div>
            <span className="text-gray-500 text-sm ml-2">
              ({product.rating_count?.toLocaleString() || '0'})
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price?.toLocaleString() || '0'}
            </span>
            {hasDiscount && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.original_price?.toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{product.availability || 'In Stock'}</p>
            <p className="text-xs text-blue-600">Free delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Panel Component
const FilterPanel: React.FC<{
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  categories: string[];
  brands: string[];
}> = ({ filters, onFiltersChange, categories, brands }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
      </button>
      
      {isOpen && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category || ""}
                onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <select
                value={filters.brand || ""}
                onChange={(e) => onFiltersChange({ ...filters, brand: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Brands</option>
                {brands.slice(0, 20).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                value={filters.minPrice || ""}
                onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="₹0"
              />
            </div>
            
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy || "popularity_score"}
                onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="popularity_score">Popularity</option>
                <option value="price">Price: Low to High</option>
                <option value="average_rating">Customer Rating</option>
                <option value="discount_percentage">Discount</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Search Demo Component
export default function SearchDemo() {
  const [query, setQuery] = useState<string>("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searched, setSearched] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [correctedQuery, setCorrectedQuery] = useState<string>("");

  const { products, pagination, isLoading, error, searchProducts } = useProductSearch();
  const { suggestions: autoSuggestions, hasTypoCorrection } = useAutosuggest(query, filters.category, 300);

  // Fetch categories and brands on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Detect typo correction
  useEffect(() => {
    if (hasTypoCorrection && autoSuggestions.length > 0) {
      const correctionSuggestion = autoSuggestions.find(s => s.isTypoCorrection);
      if (correctionSuggestion) {
        setCorrectedQuery(correctionSuggestion.query);
      }
    } else {
      setCorrectedQuery("");
    }
  }, [hasTypoCorrection, autoSuggestions]);

  const fetchCategories = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const response = await fetch(`${API_URL}/autosuggest/categories`);
      if (response.ok) {
        const data = await response.json();
        const categoryList: string[] = data.categories?.map((cat: any) => cat.category).filter(Boolean) || [];
        const brandList: string[] = data.categories?.flatMap((cat: any) => cat.brands || []).filter((brand): brand is string => typeof brand === 'string') || [];
        setCategories(categoryList);
        setBrands([...new Set(brandList)]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = useCallback(async (searchTerm: string, type?: string) => {
    setQuery(searchTerm);
    setCorrectedQuery(""); // Clear previous corrections
    
    if (!searchTerm.trim()) {
      setSearched(false);
      // Clear products when search is empty
      await searchProducts({ query: "", page: 1, limit: 0 });
      return;
    }

    setSearched(true);
    const searchParams = {
      query: searchTerm,
      ...filters,
      page: 1,
      limit: 24,
    };

    await searchProducts(searchParams);
    
    // Track search analytics
    await trackSearchAnalytics(searchTerm, "search", filters.category);
  }, [filters, searchProducts]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (query.trim() && searched) {
      // Re-search with new filters only if user has already searched
      handleSearch(query);
    }
  };

  const handleLoadMore = async () => {
    if (!pagination?.hasNext) return;
    
    const searchParams = {
      query: query,
      ...filters,
      page: (pagination?.currentPage || 1) + 1,
      limit: 24,
    };
    
    await searchProducts(searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Smart Search</h1>
            </div>
          </div>
          
          <div className="flex justify-center">
            <SearchBar
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              category={filters.category}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        {searched && query.trim() && (
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories}
            brands={brands}
          />
        )}

        {/* Typo Correction */}
        {searched && correctedQuery && correctedQuery !== query.trim() && (
          <div className="text-center mb-6">
            <span className="text-gray-600">Did you mean: </span>
            <button
              onClick={() => handleSearch(correctedQuery)}
              className="text-blue-600 font-semibold hover:underline"
            >
              {correctedQuery}
            </button>
            ?
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              <span className="text-lg text-gray-600">Searching products...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-red-500 text-lg mb-2">Something went wrong</div>
            <div className="text-gray-600">{error}</div>
          </div>
        )}

        {/* No Results */}
        {searched && !isLoading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No products found for "{query}"
            </h2>
            <p className="text-gray-600 mb-4">
              Try checking your spelling or using different keywords.
            </p>
            <div className="flex items-center justify-center text-sm text-blue-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              Try searching for popular terms like "phone", "laptop", or "shoes"
            </div>
          </div>
        )}

        {/* Results Header */}
        {searched && products.length > 0 && pagination && (
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              Showing {((pagination.currentPage - 1) * 24) + 1}-{Math.min(pagination.currentPage * 24, pagination.totalProducts)} of {pagination.totalProducts.toLocaleString()} results for "{query}"
            </div>
            <div className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
          </div>
        )}

        {/* Product Grid */}
        {searched && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            {pagination?.hasNext && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Loading..." : "Load More Products"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Welcome State */}
        {!searched && !query.trim() && (
          <div className="text-center py-16">
            <Search className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Find exactly what you're looking for
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Start typing in the search bar above to see intelligent suggestions based on products, brands, and categories. Our smart search understands what you're looking for.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <Package className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Smart Suggestions</h3>
                <p className="text-gray-600 text-sm">Get intelligent autocomplete suggestions as you type</p>
              </div>
              <div className="text-center p-6">
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Trending Searches</h3>
                <p className="text-gray-600 text-sm">See what other users are searching for</p>
              </div>
              <div className="text-center p-6">
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Quality Results</h3>
                <p className="text-gray-600 text-sm">Find products with ratings, prices, and detailed information</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}