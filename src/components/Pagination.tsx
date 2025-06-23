import { Pagination as PaginationType } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ pagination, onPageChange, className }: PaginationProps) {
  const { page, totalPages, hasNext, hasPrev } = pagination;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        className={cn(
          'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          hasPrev
            ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }

          const pageNumber = pageNum as number;
          const isCurrentPage = pageNumber === page;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isCurrentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              )}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className={cn(
          'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          hasNext
            ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
        )}
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
