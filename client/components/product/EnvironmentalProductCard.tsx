import React from "react";
import { Star } from "lucide-react";
import {
  EnvironmentalBadge,
  EnvironmentalMetrics,
} from "@/components/ui/environmental-badge";

export interface EnvironmentalProduct {
  _id: string;
  product_id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  images: string[];
  rating?: number;
  reviewCount?: number;
  description?: string;
  environmentalMetrics?: EnvironmentalMetrics;
}

interface EnvironmentalProductCardProps {
  product: EnvironmentalProduct;
}

export const EnvironmentalProductCard: React.FC<
  EnvironmentalProductCardProps
> = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <div className="relative mb-4">
        <img
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />

        {/* Environmental Badge - Top Right */}
        {product.environmentalMetrics && (
          <div className="absolute top-2 right-2">
            <EnvironmentalBadge
              metrics={product.environmentalMetrics}
              size="sm"
              showDetails={false}
            />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-3">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {product.title}
        </h3>

        {/* Brand */}
        <p className="text-sm text-gray-600">{product.brand}</p>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
            <Star className="h-4 w-4 fill-current mr-1" />
            <span className="font-medium">
              {(product.rating || 4.5).toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            ({(product.reviewCount || 125).toLocaleString()} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
