import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Star,
  Tag,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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

interface SidebarProps {
  onFiltersChange?: (filters: FilterState) => void;
  currentFilters?: FilterState;
}

const CATEGORIES = [
  { name: "Clothing", count: 585, icon: "👕" },
  { name: "Books", count: 569, icon: "📚" },
  { name: "Beauty & Personal Care", count: 568, icon: "💄" },
  { name: "Toys & Baby", count: 564, icon: "🧸" },
  { name: "Home & Furniture", count: 558, icon: "🏠" },
  { name: "Sports & Fitness", count: 553, icon: "🏃" },
  { name: "Electronics", count: 543, icon: "📱" },
  { name: "Footwear", count: 539, icon: "👟" },
  { name: "Appliances", count: 521, icon: "🔌" },
];

const SORT_OPTIONS = [
  { value: "popularity_score", label: "Popularity", icon: TrendingUp },
  { value: "price", label: "Price", icon: Tag },
  { value: "average_rating", label: "Rating", icon: Star },
  { value: "discount_percentage", label: "Discount", icon: Tag },
  { value: "date_added", label: "Newest", icon: TrendingUp },
];

const AVAILABILITY_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "limited_stock", label: "Limited Stock" },
];

const GENDER_OPTIONS = [
  { value: "Men", label: "Men" },
  { value: "Women", label: "Women" },
  { value: "Unisex", label: "Unisex" },
  { value: "Kids", label: "Kids" },
];

export const Sidebar: React.FC<SidebarProps> = ({
  onFiltersChange,
  currentFilters,
}) => {
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

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: false,
    price: true,
    rating: true,
    discount: true,
    availability: true,
    gender: true,
    sort: true,
  });

  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load brands from API
  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/autosuggest/categories");
        if (response.ok) {
          const data = await response.json();
          // Extract brands from categories data
          const allBrands =
            data.categories?.flatMap((cat: any) => cat.brands || []) || [];
          setBrands([...new Set(allBrands)]);
        }
      } catch (error) {
        console.error("Failed to load brands:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  // Update filters when currentFilters prop changes
  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    updateFilters({ brands: newBrands });
  };

  const handleAvailabilityToggle = (availability: string) => {
    const newAvailability = filters.availability.includes(availability)
      ? filters.availability.filter((a) => a !== availability)
      : [...filters.availability, availability];
    updateFilters({ availability: newAvailability });
  };

  const handleGenderToggle = (gender: string) => {
    const newGender = filters.gender.includes(gender)
      ? filters.gender.filter((g) => g !== gender)
      : [...filters.gender, gender];
    updateFilters({ gender: newGender });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      brands: [],
      priceRange: [199, 298199],
      rating: 0,
      discount: 0,
      availability: [],
      gender: [],
      sortBy: "popularity_score",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    filters.availability.length +
    filters.gender.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.discount > 0 ? 1 : 0);

  return (
    <div className="w-80 bg-white border-r border-flipkart-border p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {filters.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category} ×
              </Badge>
            ))}
            {filters.brands.map((brand) => (
              <Badge key={brand} variant="secondary" className="text-xs">
                {brand} ×
              </Badge>
            ))}
            {filters.rating > 0 && (
              <Badge variant="secondary" className="text-xs">
                ⭐ {filters.rating}+ ×
              </Badge>
            )}
            {filters.discount > 0 && (
              <Badge variant="secondary" className="text-xs">
                🏷️ {filters.discount}%+ ×
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("categories")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span>Categories</span>
          {expandedSections.categories ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.categories && (
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <div key={category.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.name}`}
                  checked={filters.categories.includes(category.name)}
                  onCheckedChange={() => handleCategoryToggle(category.name)}
                />
                <label
                  htmlFor={`category-${category.name}`}
                  className="text-sm text-gray-700 cursor-pointer flex items-center justify-between w-full"
                >
                  <span className="flex items-center">
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({category.count})
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("brands")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span>Brands</span>
          {expandedSections.brands ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.brands && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {loading ? (
              <div className="text-sm text-gray-500">Loading brands...</div>
            ) : (
              brands.slice(0, 20).map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {brand}
                  </label>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span>Price Range</span>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) =>
                updateFilters({ priceRange: value as [number, number] })
              }
              max={298199}
              min={199}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₹{filters.priceRange[0].toLocaleString()}</span>
              <span>₹{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span>Rating</span>
          {expandedSections.rating ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={() =>
                    updateFilters({
                      rating: filters.rating === rating ? 0 : rating,
                    })
                  }
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="text-sm text-gray-700 cursor-pointer flex items-center"
                >
                  {[...Array(rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-1">& Up</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discount */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("discount")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span>Discount</span>
          {expandedSections.discount ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.discount && (
          <div className="space-y-2">
            {[50, 30, 20, 10].map((discount) => (
              <div key={discount} className="flex items-center space-x-2">
                <Checkbox
                  id={`discount-${discount}`}
                  checked={filters.discount === discount}
                  onCheckedChange={() =>
                    updateFilters({
                      discount: filters.discount === discount ? 0 : discount,
                    })
                  }
                />
                <label
                  htmlFor={`discount-${discount}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {discount}% or more
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("availability")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span>Availability</span>
          {expandedSections.availability ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.availability && (
          <div className="space-y-2">
            {AVAILABILITY_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`availability-${option.value}`}
                  checked={filters.availability.includes(option.value)}
                  onCheckedChange={() => handleAvailabilityToggle(option.value)}
                />
                <label
                  htmlFor={`availability-${option.value}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("gender")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span>Gender</span>
          {expandedSections.gender ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.gender && (
          <div className="space-y-2">
            {GENDER_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`gender-${option.value}`}
                  checked={filters.gender.includes(option.value)}
                  onCheckedChange={() => handleGenderToggle(option.value)}
                />
                <label
                  htmlFor={`gender-${option.value}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("sort")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span>Sort By</span>
          {expandedSections.sort ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.sort && (
          <div className="space-y-2">
            {SORT_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              return (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`sort-${option.value}`}
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={(e) => updateFilters({ sortBy: e.target.value })}
                    className="text-blue-600"
                  />
                  <label
                    htmlFor={`sort-${option.value}`}
                    className="text-sm text-gray-700 cursor-pointer flex items-center"
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {option.label}
                  </label>
                </div>
              );
            })}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="sort-asc"
                  name="sortOrder"
                  value="asc"
                  checked={filters.sortOrder === "asc"}
                  onChange={() => updateFilters({ sortOrder: "asc" })}
                  className="text-blue-600"
                />
                <label
                  htmlFor="sort-asc"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Low to High
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="radio"
                  id="sort-desc"
                  name="sortOrder"
                  value="desc"
                  checked={filters.sortOrder === "desc"}
                  onChange={() => updateFilters({ sortOrder: "desc" })}
                  className="text-blue-600"
                />
                <label
                  htmlFor="sort-desc"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  High to Low
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
