import React, { useState, useEffect } from "react";
import { ProductCard, Product } from "./ProductCard";
import { ProductCardGrid } from "./ProductCardGrid";
import { LayoutSelector, LayoutType } from "./LayoutSelector";
import {
  AdPlacement,
  TopBanner,
  SponsoredSection,
} from "@/components/ads/AdPlacement";
import { AdBanner as AdBannerType } from "@/components/ads/AdBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Filter, X, Grid3X3, List } from "lucide-react";

interface EnhancedProductListingProps {
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
  ads?: AdBannerType[];
  className?: string;
}

export const EnhancedProductListing: React.FC<EnhancedProductListingProps> = ({
  products,
  totalResults,
  currentPage,
  totalPages,
  searchQuery = "products",
  activeFilters,
  onClearFilter,
  ads = [],
  className = "",
}) => {
  const [currentLayout, setCurrentLayout] = useState<LayoutType>("list");
  const [showFilters, setShowFilters] = useState(false);

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

  const getLayoutClasses = () => {
    switch (currentLayout) {
      case "grid":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
      case "compact":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3";
      case "detailed":
        return "space-y-6";
      default: // list
        return "space-y-4";
    }
  };

  const renderProduct = (product: Product) => {
    switch (currentLayout) {
      case "grid":
        return (
          <ProductCardGrid key={product.id || product._id} product={product} />
        );
      case "compact":
        return (
          <ProductCardGrid
            key={product.id || product._id}
            product={product}
            className="text-xs"
          />
        );
      case "detailed":
        return (
          <ProductCard key={product.id || product._id} product={product} />
        );
      default:
        return (
          <ProductCard key={product.id || product._id} product={product} />
        );
    }
  };

  return (
    <div className={`flex-1 bg-flipkart-gray min-h-screen ${className}`}>
      {/* Top Banner Ad */}
      <TopBanner ads={ads} />

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

          {/* Layout Selector */}
          <LayoutSelector
            currentLayout={currentLayout}
            onLayoutChange={setCurrentLayout}
            totalResults={totalResults}
          />
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

      {/* Sponsored Section */}
      <SponsoredSection ads={ads} />

      {/* Product Grid with Ads */}
      <div className="p-4">
        {products.length > 0 ? (
          <AdPlacement
            products={products.map(renderProduct)}
            ads={ads.filter(
              (ad) => ad.type !== "banner" && ad.type !== "sponsored",
            )}
            adFrequency={8}
            className={getLayoutClasses()}
          />
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
