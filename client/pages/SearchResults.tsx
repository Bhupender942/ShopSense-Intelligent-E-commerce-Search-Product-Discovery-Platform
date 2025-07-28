import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProductListing } from '@/components/product/ProductListing';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

const PRODUCTS_PER_PAGE = 24;
const TOTAL_RESULTS = 11569;

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const query = searchParams.get('q') || '';
  const totalPages = Math.ceil(TOTAL_RESULTS / PRODUCTS_PER_PAGE);
  
  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);
  
  // Repeat mock products to simulate a full page
  const displayProducts = Array(24).fill(null).map((_, index) => ({
    id: `${index}-${index}`,
    name: query ? `${query} ${index}` : `Product ${index + 1}`,
    image: '', // Placeholder image
    rating: 4.0,
    reviewCount: 100 + index,
    specifications: ['Spec 1', 'Spec 2'],
    price: 9999 + index * 100,
    originalPrice: 12999 + index * 100,
    discount: 23,
    offers: ['Bank Offer', 'Exchange Offer'],
    assured: index % 2 === 0
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, this would trigger an API call
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} />
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
                <Sidebar />
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col">
          <ProductListing
            products={displayProducts}
            totalResults={TOTAL_RESULTS}
            currentPage={currentPage}
            totalPages={totalPages}
            searchQuery={query}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
