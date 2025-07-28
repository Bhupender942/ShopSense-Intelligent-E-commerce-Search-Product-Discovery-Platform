import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = () => {
    const visiblePages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Always show first page
      visiblePages.push(1);

      if (currentPage > 4) {
        visiblePages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }

      if (currentPage < totalPages - 3) {
        visiblePages.push('...');
      }

      // Always show last page if not already included
      if (totalPages > 1) {
        visiblePages.push(totalPages);
      }
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="bg-white border-t border-flipkart-border p-4">
      <div className="flex items-center justify-center space-x-1 overflow-x-auto">
        {/* Previous button */}
        <Button
          variant="ghost"
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-flipkart-text-gray hover:text-flipkart-blue disabled:opacity-50 flex-shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'number' ? (
              <Button
                variant={currentPage === page ? "default" : "ghost"}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm flex-shrink-0 ${
                  currentPage === page
                    ? 'bg-flipkart-blue text-white hover:bg-blue-600'
                    : 'text-flipkart-text-gray hover:text-flipkart-blue hover:bg-blue-50'
                }`}
              >
                {page}
              </Button>
            ) : (
              <span className="px-2 text-flipkart-text-gray">...</span>
            )}
          </React.Fragment>
        ))}

        {/* Next button */}
        <Button
          variant="ghost"
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-flipkart-text-gray hover:text-flipkart-blue disabled:opacity-50 flex-shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* NEXT link */}
        <Button
          variant="ghost"
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2 sm:ml-4 text-flipkart-blue hover:text-blue-600 disabled:opacity-50 flex-shrink-0 text-xs sm:text-sm"
        >
          NEXT
        </Button>
      </div>
    </div>
  );
};
