'use client';

import { useState, useEffect } from 'react';
import { useCars } from '@/hooks/useCars';
import { CarFilters } from '@/types';
import { CarCard } from '@/components/CarCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Pagination } from '@/components/Pagination';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Filter, Grid, List, SortAsc } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CarsPage() {
  const [filters, setFilters] = useState<CarFilters>({
    page: 1,
    limit: 12,
    sort: '-createdAt',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const { cars, loading, error, pagination, updateFilters, refetch } = useCars(filters);

  const handleFiltersChange = (newFilters: CarFilters) => {
    const updatedFilters = { ...newFilters, page: 1 }; // Reset to first page when filters change
    setFilters(updatedFilters);
    updateFilters(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    updateFilters(updatedFilters);
  };

  const handleSortChange = (sort: string) => {
    const updatedFilters = { ...filters, sort, page: 1 };
    setFilters(updatedFilters);
    updateFilters(updatedFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Cars</h1>
              <p className="mt-2 text-gray-600">
                {pagination ? `${pagination.total} cars available` : 'Loading cars...'}
              </p>
            </div>
            
            {/* Controls */}
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="year">Year: Old to New</option>
                  <option value="-year">Year: New to Old</option>
                  <option value="mileage">Mileage: Low to High</option>
                  <option value="-mileage">Mileage: High to Low</option>
                </select>
                <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-l-md transition-colors',
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-r-md transition-colors',
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={cn(
            'lg:w-80 lg:flex-shrink-0',
            showFilters ? 'block' : 'hidden lg:block'
          )}>
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              loading={loading}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-600 text-lg mb-4">Error loading cars</div>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={refetch}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-600 text-lg mb-4">No cars found</div>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <>
                {/* Cars Grid/List */}
                <div className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-6'
                )}>
                  {cars.map((car) => (
                    <CarCard
                      key={car._id}
                      car={car}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
