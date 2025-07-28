import React from 'react';
import { Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface Product {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  specifications: string[];
  price: number;
  originalPrice: number;
  discount: number;
  offers: string[];
  assured: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="bg-white border border-flipkart-border rounded-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-24 sm:w-24 sm:h-32 object-contain"
          />
          <div className="flex items-center justify-center mt-2">
            <Button variant="ghost" className="text-xs text-flipkart-text-gray hover:text-flipkart-blue p-0 h-auto">
              Add to Compare
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center bg-flipkart-green text-white px-1.5 py-0.5 rounded text-xs">
                  <span className="font-medium">{product.rating}</span>
                  <Star className="h-3 w-3 ml-0.5 fill-current" />
                </div>
                <span className="text-xs text-flipkart-text-gray">
                  {product.reviewCount.toLocaleString()} Ratings & {Math.floor(product.reviewCount / 10)} Reviews
                </span>
              </div>

              {/* Specifications */}
              <ul className="text-xs text-flipkart-text-gray space-y-0.5 mb-3">
                {product.specifications.map((spec, index) => (
                  <li key={index}>• {spec}</li>
                ))}
              </ul>

              {/* Offers */}
              {product.offers.length > 0 && (
                <div className="space-y-1">
                  {product.offers.map((offer, index) => (
                    <div key={index} className="text-xs text-flipkart-green font-medium">
                      • {offer}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price and Assured */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-xl font-medium text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.assured && (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-flipkart-blue mr-1" />
                    <span className="text-xs text-flipkart-text-gray">Assured</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm text-flipkart-text-gray line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-sm text-flipkart-green font-medium">
                  {discountPercentage}% off
                </span>
              </div>

              <div className="text-xs text-flipkart-green font-medium mt-1">
                Upto ₹{Math.floor(product.price * 0.1).toLocaleString()} Off on Exchange
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
