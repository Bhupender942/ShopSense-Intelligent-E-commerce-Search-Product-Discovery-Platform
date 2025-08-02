import React from "react";
import { Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  EnvironmentalBadge,
  EnvironmentalMetrics,
} from "@/components/ui/environmental-badge";

export interface Product {
  id?: string;
  _id?: string;
  product_id?: string;
  name?: string;
  title?: string;
  image?: string;
  images?: string[];
  rating?: number;
  average_rating?: number;
  reviewCount?: number;
  rating_count?: number;
  specifications?: string[];
  price?: number;
  originalPrice?: number;
  original_price?: number;
  discount?: number;
  discount_percentage?: number;
  offers?: string[];
  assured?: boolean;
  brand?: string;
  category?: string;
  subcategory?: string;
  availability?: string;
  popularity_score?: number;
  description?: string;
  environmentalMetrics?: EnvironmentalMetrics;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Normalize product data to handle both frontend and backend structures
  const normalizedProduct = {
    id: product.id || product._id || product.product_id || "",
    name: product.name || product.title || "Product",
    image: product.image || (product.images && product.images[0]) || "",
    rating: product.rating || product.average_rating || 0,
    reviewCount: product.reviewCount || product.rating_count || 0,
    specifications: product.specifications || [],
    price: product.price || 0,
    originalPrice: product.originalPrice || product.original_price || 0,
    discount: product.discount || product.discount_percentage || 0,
    offers: product.offers || [],
    assured: product.assured || false,
    brand: product.brand || "",
    category: product.category || "",
    subcategory: product.subcategory || "",
    description: product.description || "",
    environmentalMetrics: product.environmentalMetrics,
  };

  const discountPercentage =
    normalizedProduct.originalPrice > 0
      ? Math.round(
          ((normalizedProduct.originalPrice - normalizedProduct.price) /
            normalizedProduct.originalPrice) *
            100,
        )
      : 0;

  return (
    <div className="bg-white border border-flipkart-border rounded-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={normalizedProduct.image || "/placeholder.svg"}
            alt={normalizedProduct.name}
            className="w-20 h-24 sm:w-24 sm:h-32 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="flex items-center justify-center mt-2">
            <Button
              variant="ghost"
              className="text-xs text-flipkart-text-gray hover:text-flipkart-blue p-0 h-auto"
            >
              Add to Compare
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {normalizedProduct.name}
              </h3>

              {/* Brand and Category */}
              {(normalizedProduct.brand || normalizedProduct.category) && (
                <div className="text-xs text-gray-500 mb-2">
                  {normalizedProduct.brand && (
                    <span className="mr-2">{normalizedProduct.brand}</span>
                  )}
                  {normalizedProduct.category && (
                    <span>{normalizedProduct.category}</span>
                  )}
                </div>
              )}

              {/* Environmental Badge */}
              {normalizedProduct.environmentalMetrics && (
                <div className="mb-2">
                  <EnvironmentalBadge
                    metrics={normalizedProduct.environmentalMetrics}
                    size="sm"
                    showDetails={false}
                  />
                </div>
              )}

              {/* Description */}
              {normalizedProduct.description && (
                <div className="text-xs text-gray-600 mb-2 overflow-hidden">
                  <div
                    className="line-clamp-2"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {normalizedProduct.description}
                  </div>
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center bg-flipkart-green text-white px-1.5 py-0.5 rounded text-xs">
                  <span className="font-medium">
                    {normalizedProduct.rating.toFixed(1)}
                  </span>
                  <Star className="h-3 w-3 ml-0.5 fill-current" />
                </div>
                <span className="text-xs text-flipkart-text-gray">
                  {normalizedProduct.reviewCount.toLocaleString()} Ratings &{" "}
                  {Math.floor(normalizedProduct.reviewCount / 10)} Reviews
                </span>
              </div>

              {/* Specifications */}
              {normalizedProduct.specifications.length > 0 && (
                <ul className="text-xs text-flipkart-text-gray space-y-0.5 mb-3">
                  {normalizedProduct.specifications
                    .slice(0, 3)
                    .map((spec, index) => (
                      <li key={index}>• {spec}</li>
                    ))}
                </ul>
              )}

              {/* Offers */}
              {normalizedProduct.offers.length > 0 && (
                <div className="space-y-1">
                  {normalizedProduct.offers.slice(0, 2).map((offer, index) => (
                    <div
                      key={index}
                      className="text-xs text-flipkart-green font-medium"
                    >
                      • {offer}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price and Assured */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-xl font-medium text-gray-900">
                  ₹{normalizedProduct.price.toLocaleString()}
                </span>
                {normalizedProduct.assured && (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-flipkart-blue mr-1" />
                    <span className="text-xs text-flipkart-text-gray">
                      Assured
                    </span>
                  </div>
                )}
              </div>

              {normalizedProduct.originalPrice > normalizedProduct.price && (
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm text-flipkart-text-gray line-through">
                    ₹{normalizedProduct.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-flipkart-green font-medium">
                    {discountPercentage}% off
                  </span>
                </div>
              )}

              <div className="text-xs text-flipkart-green font-medium mt-1">
                Upto ₹
                {Math.floor(normalizedProduct.price * 0.1).toLocaleString()} Off
                on Exchange
              </div>

              <div className="text-xs text-flipkart-green font-medium">
                Bank Offer
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
