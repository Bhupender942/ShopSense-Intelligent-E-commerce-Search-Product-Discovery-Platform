import React from "react";
import { Star, Shield, Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "./ProductCard";

interface ProductCardGridProps {
  product: Product;
  className?: string;
}

export const ProductCardGrid: React.FC<ProductCardGridProps> = ({
  product,
  className = "",
}) => {
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
    <div
      className={`bg-white border border-flipkart-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group ${className}`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={normalizedProduct.image || "/placeholder.svg"}
          alt={normalizedProduct.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />

        {/* Quick Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive" className="text-xs">
              {discountPercentage}% OFF
            </Badge>
          </div>
        )}

        {/* Assured Badge */}
        {normalizedProduct.assured && (
          <div className="absolute bottom-2 left-2">
            <Badge
              variant="secondary"
              className="text-xs bg-blue-100 text-blue-800"
            >
              <Shield className="h-3 w-3 mr-1" />
              Assured
            </Badge>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Brand and Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">
            {normalizedProduct.brand}
          </span>
          <span className="text-xs text-gray-400">
            {normalizedProduct.category}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
          {normalizedProduct.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center bg-flipkart-green text-white px-1.5 py-0.5 rounded text-xs">
            <span className="font-medium">
              {normalizedProduct.rating.toFixed(1)}
            </span>
            <Star className="h-3 w-3 ml-0.5 fill-current" />
          </div>
          <span className="text-xs text-gray-500">
            ({normalizedProduct.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-gray-900">
              ₹{normalizedProduct.price.toLocaleString()}
            </span>
            {normalizedProduct.originalPrice > normalizedProduct.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{normalizedProduct.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Offers */}
          {normalizedProduct.offers.length > 0 && (
            <div className="text-xs text-flipkart-green font-medium">
              {normalizedProduct.offers[0]}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-flipkart-orange hover:bg-orange-600 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
          <Button size="sm" variant="outline" className="px-3">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};
