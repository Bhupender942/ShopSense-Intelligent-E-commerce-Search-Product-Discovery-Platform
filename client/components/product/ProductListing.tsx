import React, { useState } from "react";
import { ProductCard, Product } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductListingProps {
  products: Product[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
  activeFilters?: {
    categories?: string[];
    brands?: string[];
    priceRange?: [number, number];
    rating?: number;
    discount?: number;
    availability?: string[];
    gender?: string[];
  };
  onClearFilter?: (filterType: string, value?: string) => void;
}

export const ProductListing: React.FC<ProductListingProps> = ({
  products,
  totalResults,
  currentPage,
  totalPages,
  searchQuery = "mobiles",
  activeFilters,
  onClearFilter,
}) => {
  const [sortBy, setSortBy] = useState("Relevance");

  const sortOptions = [
    "Relevance",
    "Popularity",
    "Price -- Low to High",
    "Price -- High to Low",
    "Newest First",
  ];

  const startResult = (currentPage - 1) * 24 + 1;
  const endResult = Math.min(currentPage * 24, totalResults);

  // Count active filters
  const activeFiltersCount =
    (activeFilters?.categories?.length || 0) +
    (activeFilters?.brands?.length || 0) +
    (activeFilters?.availability?.length || 0) +
    (activeFilters?.gender?.length || 0) +
    (activeFilters?.rating ? 1 : 0) +
    (activeFilters?.discount ? 1 : 0) +
    (activeFilters?.priceRange &&
    (activeFilters.priceRange[0] !== 199 ||
      activeFilters.priceRange[1] !== 298199)
      ? 1
      : 0);

  return (
    <div className="flex-1 bg-flipkart-gray min-h-screen">
      {/* Breadcrumb and Results Info */}
      <div className="bg-white border-b border-flipkart-border px-4 py-3">
        <div className="flex items-center text-xs text-flipkart-text-gray mb-2">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Search Results</span>
          {searchQuery && (
            <>
              <span className="mx-2">›</span>
              <span className="capitalize">{searchQuery}</span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm text-gray-700">
              Showing {startResult} – {endResult} of{" "}
              {totalResults.toLocaleString()} results for "{searchQuery}"
            </span>
          </div>

          {/* Sort By */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-sm text-gray-700">Sort By</span>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option}
                  variant={sortBy === option ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy(option)}
                  className={`text-xs whitespace-nowrap ${
                    sortBy === option
                      ? "bg-flipkart-blue text-white"
                      : "text-flipkart-text-gray hover:text-flipkart-blue"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Active Filters:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Category Filters */}
              {activeFilters?.categories?.map((category) => (
                <Badge
                  key={`category-${category}`}
                  variant="secondary"
                  className="text-xs"
                >
                  {category}
                  {onClearFilter && (
                    <button
                      onClick={() => onClearFilter("category", category)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}

              {/* Brand Filters */}
              {activeFilters?.brands?.map((brand) => (
                <Badge
                  key={`brand-${brand}`}
                  variant="secondary"
                  className="text-xs"
                >
                  {brand}
                  {onClearFilter && (
                    <button
                      onClick={() => onClearFilter("brand", brand)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}

              {/* Price Range Filter */}
              {activeFilters?.priceRange &&
                (activeFilters.priceRange[0] !== 199 ||
                  activeFilters.priceRange[1] !== 298199) && (
                  <Badge variant="secondary" className="text-xs">
                    ₹{activeFilters.priceRange[0].toLocaleString()} - ₹
                    {activeFilters.priceRange[1].toLocaleString()}
                    {onClearFilter && (
                      <button
                        onClick={() => onClearFilter("priceRange")}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                )}

              {/* Rating Filter */}
              {activeFilters?.rating && (
                <Badge variant="secondary" className="text-xs">
                  ⭐ {activeFilters.rating}+ Stars
                  {onClearFilter && (
                    <button
                      onClick={() => onClearFilter("rating")}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              )}

              {/* Discount Filter */}
              {activeFilters?.discount && (
                <Badge variant="secondary" className="text-xs">
                  🏷️ {activeFilters.discount}%+ Off
                  {onClearFilter && (
                    <button
                      onClick={() => onClearFilter("discount")}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              )}

              {/* Availability Filters */}
              {activeFilters?.availability?.map((availability) => (
                <Badge
                  key={`availability-${availability}`}
                  variant="secondary"
                  className="text-xs"
                >
                  {availability}
                  {onClearFilter && (
                    <button
                      onClick={() =>
                        onClearFilter("availability", availability)
                      }
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}

              {/* Gender Filters */}
              {activeFilters?.gender?.map((gender) => (
                <Badge
                  key={`gender-${gender}`}
                  variant="secondary"
                  className="text-xs"
                >
                  {gender}
                  {onClearFilter && (
                    <button
                      onClick={() => onClearFilter("gender", gender)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}

              {/* Clear All Filters */}
              {onClearFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onClearFilter("all")}
                  className="text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="p-4">
        {products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product) => (
              <ProductCard
                key={product.id || product._id || product.product_id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-sm text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
