'use client';

import { useState } from 'react';
import { CarFilters, FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
  loading?: boolean;
}

export function FilterSidebar({ filters, onFiltersChange, loading }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    year: true,
    make: true,
    fuel: true,
    transmission: true,
    body: true,
    location: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (key: keyof CarFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit,
      sort: filters.sort,
    });
  };

  const hasActiveFilters = Object.keys(filters).some(
    key => key !== 'page' && key !== 'limit' && key !== 'sort' && filters[key as keyof CarFilters]
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const popularMakes = [
    'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota',
    'Ford', 'Volkswagen', 'Skoda', 'Renault', 'Nissan', 'Kia'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 filter-sidebar">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left text-gray-900"
          >
            <h4 className="font-medium text-gray-900">Price Range</h4>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="Any"
                    value={filters.maxPrice || ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              </div>
              
              {/* Quick Price Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Under 5L', max: 500000 },
                  { label: '5L - 10L', min: 500000, max: 1000000 },
                  { label: '10L - 20L', min: 1000000, max: 2000000 },
                  { label: 'Above 20L', min: 2000000 },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      updateFilter('minPrice', range.min);
                      updateFilter('maxPrice', range.max);
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Year Range */}
        <div>
          <button
            onClick={() => toggleSection('year')}
            className="flex items-center justify-between w-full text-left text-gray-900"
          >
            <h4 className="font-medium text-gray-900">Year</h4>
            {expandedSections.year ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.year && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">From</label>
                <select
                  value={filters.minYear || ''}
                  onChange={(e) => updateFilter('minYear', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">Any</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">To</label>
                <select
                  value={filters.maxYear || ''}
                  onChange={(e) => updateFilter('maxYear', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">Any</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Make */}
        <div>
          <button
            onClick={() => toggleSection('make')}
            className="flex items-center justify-between w-full text-left text-gray-900"
          >
            <h4 className="font-medium text-gray-900">Make</h4>
            {expandedSections.make ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.make && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Search make..."
                value={filters.make || ''}
                onChange={(e) => updateFilter('make', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 text-gray-900 bg-white"
              />
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {popularMakes.map(make => (
                  <button
                    key={make}
                    onClick={() => updateFilter('make', make)}
                    className={cn(
                      'block w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors text-gray-700',
                      filters.make === make && 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {make}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fuel Type */}
        <div>
          <button
            onClick={() => toggleSection('fuel')}
            className="flex items-center justify-between w-full text-left text-gray-900"
          >
            <h4 className="font-medium text-gray-900">Fuel Type</h4>
            {expandedSections.fuel ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.fuel && (
            <div className="mt-3 space-y-2">
              {FUEL_TYPES.map(fuel => (
                <label key={fuel.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="fuelType"
                    value={fuel.value}
                    checked={filters.fuelType === fuel.value}
                    onChange={(e) => updateFilter('fuelType', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{fuel.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Transmission */}
        <div>
          <button
            onClick={() => toggleSection('transmission')}
            className="flex items-center justify-between w-full text-left text-gray-900"
          >
            <h4 className="font-medium text-gray-900">Transmission</h4>
            {expandedSections.transmission ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.transmission && (
            <div className="mt-3 space-y-2">
              {TRANSMISSION_TYPES.map(transmission => (
                <label key={transmission.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="transmission"
                    value={transmission.value}
                    checked={filters.transmission === transmission.value}
                    onChange={(e) => updateFilter('transmission', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{transmission.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Body Type */}
        <div>
          <button
            onClick={() => toggleSection('body')}
            className="flex items-center justify-between w-full text-left text-gray-900"
          >
            <h4 className="font-medium text-gray-900">Body Type</h4>
            {expandedSections.body ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.body && (
            <div className="mt-3 space-y-2">
              {BODY_TYPES.map(body => (
                <label key={body.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="bodyType"
                    value={body.value}
                    checked={filters.bodyType === body.value}
                    onChange={(e) => updateFilter('bodyType', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{body.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <button
            onClick={() => toggleSection('location')}
            className="flex items-center justify-between w-full text-left text-gray-900"
          >
            <h4 className="font-medium text-gray-900">Location</h4>
            {expandedSections.location ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.location && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={filters.city || ''}
                  onChange={(e) => updateFilter('city', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">State</label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={filters.state || ''}
                  onChange={(e) => updateFilter('state', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
