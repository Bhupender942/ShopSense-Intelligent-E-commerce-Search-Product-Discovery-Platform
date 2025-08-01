import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProductListing } from "@/components/product/ProductListing";
import { QueryUnderstandingPanel } from "@/components/search/QueryUnderstandingPanel";
import { EnhancedProductListing } from "@/components/product/EnhancedProductListing";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/button";
import { Filter, X, Image as ImageIcon, Loader2, Database } from "lucide-react";
import { useProductSearch } from "@/hooks/use-autosuggest";
import { adService } from "@/services/adService";
import { SidebarAds } from "@/components/ads/AdPlacement";

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  discount: number;
  availability: string[];
  gender: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [199, 298199],
    rating: 0,
    discount: 0,
    availability: [],
    gender: [],
    sortBy: "popularity_score",
    sortOrder: "desc",
  });

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const isImageSearch = searchParams.get("imageSearch") === "true";

  // Get image search results from location state
  const imageSearchResults = location.state?.imageSearchResults || [];
  const uploadedImage = location.state?.uploadedImage || null;

  // Use the product search hook to fetch real products
  const { products, pagination, isLoading, error, searchProducts } =
    useProductSearch();

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, category]);

  // Convert filters to search parameters
  const buildSearchParams = () => {
    const params: any = {
      page: currentPage,
      limit: 24,
    };

    // Add query if present
    if (query) params.query = query;
    if (category) params.category = category;

    // Get use_nlp parameter from URL if present
    const useNlp = searchParams.get("use_nlp");
    if (useNlp) params.use_nlp = useNlp;
    // Default to enabled if not specified and we have a query
    else if (query && !params.use_nlp) params.use_nlp = "true";

    // Add filter parameters
    if (filters.categories.length > 0) {
      params.category = filters.categories.join(",");
    }
    if (filters.brands.length > 0) {
      params.brand = filters.brands.join(",");
    }
    if (filters.priceRange[0] !== 199 || filters.priceRange[1] !== 298199) {
      params.minPrice = filters.priceRange[0];
      params.maxPrice = filters.priceRange[1];
    }
    if (filters.rating > 0) {
      params.minRating = filters.rating;
    }
    if (filters.discount > 0) {
      params.minDiscount = filters.discount;
    }
    if (filters.availability.length > 0) {
      params.availability = filters.availability.join(",");
    }
    if (filters.gender.length > 0) {
      params.gender = filters.gender.join(",");
    }
    if (filters.sortBy) {
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;
    }

    return params;
  };

  // Fetch products when query, category, or filters change
  useEffect(() => {
    if (!isImageSearch) {
      const searchParams = buildSearchParams();
      console.log("Searching products with params:", searchParams);
      console.log("Current filters state:", filters);
      searchProducts(searchParams);
    }
  }, [query, category, currentPage, isImageSearch, filters, searchProducts]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearImageSearch = () => {
    // Navigate back to regular search
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("imageSearch");
    window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
    window.location.reload();
  };

  // Test database connection
  const testDatabase = async () => {
    try {
      const response = await fetch("/api/autosuggest/test-products");
      const data = await response.json();
      setTestResult(data);
      console.log("Database test result:", data);
    } catch (error) {
      console.error("Database test failed:", error);
      setTestResult({ error: "Database test failed" });
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterState) => {
    console.log("Filters changed:", newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Determine which products to display
  const displayProducts =
    isImageSearch && imageSearchResults.length > 0
      ? imageSearchResults
      : products;

  // Determine total results count
  const totalResults = isImageSearch
    ? imageSearchResults.length
    : pagination?.totalProducts || 0;

  // Get query understanding data from search results
  const queryUnderstanding =
    !isImageSearch && pagination ? pagination.queryUnderstanding : undefined;

  console.log("SearchResults - pagination:", pagination);
  console.log("SearchResults - queryUnderstanding:", queryUnderstanding);
  console.log("SearchResults - current filters:", filters);

  // Apply inferred filters to the UI filters if we have query understanding results
  useEffect(() => {
    console.log("Query understanding effect triggered:", queryUnderstanding);
    if (
      queryUnderstanding?.usingDerivedFilters &&
      queryUnderstanding.inferredFilters
    ) {
      const newFilters = { ...filters };
      const inferredFilters = queryUnderstanding.inferredFilters;
      let filterChanged = false;

      console.log("Processing inferred filters:", inferredFilters);
      console.log("Current filters:", filters);

      // Update category
      if (inferredFilters.category && newFilters.categories.length === 0) {
        newFilters.categories = [inferredFilters.category];
        filterChanged = true;
        console.log("Added category filter:", inferredFilters.category);
      }

      // Update brand
      if (inferredFilters.brand && newFilters.brands.length === 0) {
        newFilters.brands = [inferredFilters.brand];
        filterChanged = true;
        console.log("Added brand filter:", inferredFilters.brand);
      }

      // Update gender filter
      if (inferredFilters.gender && newFilters.gender.length === 0) {
        // The query understanding system returns "Men", "Women", etc.
        // Map to what the UI expects (which is the same format)
        const gender = inferredFilters.gender;
        newFilters.gender = [gender];
        filterChanged = true;
        console.log("Added gender filter:", gender);
      }

      // Update price range filter
      if (inferredFilters.priceRange) {
        if (inferredFilters.priceRange === "low") {
          // For budget products, set price range to 199-20000
          newFilters.priceRange = [199, 20000];
          filterChanged = true;
          console.log("Added low price range filter");
        } else if (inferredFilters.priceRange === "high") {
          // For premium products, set price range to 50000-max
          newFilters.priceRange = [50000, 298199];
          filterChanged = true;
          console.log("Added high price range filter");
        }
      }

      // Only update filters if something changed
      if (filterChanged) {
        console.log("Applying inferred filters:", newFilters);
        console.log("Original inferred filters:", inferredFilters);
        setFilters(newFilters);
      } else {
        console.log("No filter changes needed");
      }
    } else {
      console.log("No query understanding data or not using derived filters");
    }
  }, [queryUnderstanding]);

  const totalPages = pagination?.totalPages || 1;

  // Get ads for the current search
  const searchAds = adService.getSearchResultsAds(query, category);

  return (
    <div className="min-h-screen bg-flipkart-gray">
      <Header />

      {/* Mobile Filter Button */}
      <div className="md:hidden bg-white border-b border-flipkart-border p-4">
        <Button
          onClick={() => setIsSidebarOpen(true)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>

      <div className="flex relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block bg-white">
          <Sidebar
            onFiltersChange={handleFiltersChange}
            currentFilters={filters}
          />
          {/* Sidebar Ads */}
          <div className="p-4 border-t border-flipkart-border">
            <SidebarAds ads={searchAds.sidebarAds} />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform">
              <div className="flex items-center justify-between p-4 border-b border-flipkart-border">
                <span className="font-semibold">Filters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="overflow-y-auto h-full pb-16">
                <Sidebar
                  onFiltersChange={handleFiltersChange}
                  currentFilters={filters}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {/* Debug Panel - Only show if no query */}
          {!query && !category && !isImageSearch && (
            <div className="bg-yellow-50 border-b border-yellow-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-yellow-800">Debug Panel</h3>
                  <p className="text-sm text-yellow-600">
                    No search query. Test the database connection.
                  </p>
                </div>
                <Button
                  onClick={testDatabase}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Database className="h-4 w-4" />
                  <span>Test DB</span>
                </Button>
              </div>
              {testResult && (
                <div className="mt-2 p-2 bg-white rounded border">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Image Search Results Header */}
          {isImageSearch && uploadedImage && (
            <div className="bg-white border-b border-flipkart-border p-4">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 flex-shrink-0 bg-white rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={uploadedImage}
                    alt="Uploaded image"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-lg text-gray-800">
                      Image Search Results
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Showing similar products based on your uploaded image.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearImageSearch}
                    className="text-sm"
                  >
                    Clear image search
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Query Understanding Panel */}
          {!isLoading && !error && !isImageSearch && query && (
            <div className="px-4 mt-4">
              <QueryUnderstandingPanel
                queryUnderstanding={queryUnderstanding}
                query={query}
              />
            </div>
          )}

          {/* Loading State */}
          {isLoading && !isImageSearch && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Searching products...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isImageSearch && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-2">Error loading products</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
          )}

          {/* Products Display */}
          {!isLoading && !error && (
            <EnhancedProductListing
              products={displayProducts}
              totalResults={totalResults}
              currentPage={currentPage}
              totalPages={totalPages}
              searchQuery={isImageSearch ? "Image Search" : query}
              activeFilters={filters}
              ads={searchAds.productAds}
              onClearFilter={(filterType, value) => {
                const newFilters = { ...filters };

                switch (filterType) {
                  case "category":
                    newFilters.categories = newFilters.categories.filter(
                      (c) => c !== value,
                    );
                    break;
                  case "brand":
                    newFilters.brands = newFilters.brands.filter(
                      (b) => b !== value,
                    );
                    break;
                  case "availability":
                    newFilters.availability = newFilters.availability.filter(
                      (a) => a !== value,
                    );
                    break;
                  case "gender":
                    newFilters.gender = newFilters.gender.filter(
                      (g) => g !== value,
                    );
                    break;
                  case "priceRange":
                    newFilters.priceRange = [199, 298199];
                    break;
                  case "rating":
                    newFilters.rating = 0;
                    break;
                  case "discount":
                    newFilters.discount = 0;
                    break;
                  case "all":
                    newFilters.categories = [];
                    newFilters.brands = [];
                    newFilters.priceRange = [199, 298199];
                    newFilters.rating = 0;
                    newFilters.discount = 0;
                    newFilters.availability = [];
                    newFilters.gender = [];
                    break;
                }

                setFilters(newFilters);
              }}
            />
          )}

          {/* Pagination */}
          {!isImageSearch &&
            !isLoading &&
            !error &&
            pagination &&
            pagination.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

          {/* No Results */}
          {!isLoading &&
            !error &&
            displayProducts.length === 0 &&
            !isImageSearch && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">No products found</p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search terms or browse categories
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
