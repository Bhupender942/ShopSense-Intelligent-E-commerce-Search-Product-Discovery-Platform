import React, { useState } from 'react';
import { ProductCard, Product } from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface ProductListingProps {
  products: Product[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
}

export const ProductListing: React.FC<ProductListingProps> = ({
  products,
  totalResults,
  currentPage,
  totalPages,
  searchQuery = 'mobiles',
}) => {
  const [sortBy, setSortBy] = useState('Relevance');

  const sortOptions = [
    'Relevance',
    'Popularity',
    'Price -- Low to High',
    'Price -- High to Low',
    'Newest First',
  ];

  const startResult = (currentPage - 1) * 24 + 1;
  const endResult = Math.min(currentPage * 24, totalResults);

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
              Showing {startResult} – {endResult} of {totalResults.toLocaleString()} results for "{searchQuery}"
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
                      ? 'bg-flipkart-blue text-white'
                      : 'text-flipkart-text-gray hover:text-flipkart-blue'
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-4">
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
