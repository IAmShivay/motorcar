import Link from 'next/link';
import Image from 'next/image';
import { Car } from '@/types';
import { formatCurrency, formatNumber, capitalize, generateCarSlug } from '@/lib/utils';
import { Calendar, Gauge, Fuel, Settings, MapPin, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarCardProps {
  car: Car;
  viewMode?: 'grid' | 'list';
  showActions?: boolean;
  className?: string;
}

export function CarCard({ car, viewMode = 'grid', showActions = false, className }: CarCardProps) {
  const carSlug = generateCarSlug(car);
  const primaryImage = car.images[0]?.url || '/placeholder-car.jpg';

  if (viewMode === 'list') {
    return (
      <div className={cn(
        'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200',
        className
      )}>
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-80 md:flex-shrink-0">
            <Link href={`/cars/${carSlug}`}>
              <div className="relative h-48 md:h-full">
                <Image
                  src={primaryImage}
                  alt={car.title}
                  fill
                  className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                />
                {car.status !== 'available' && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
                    {capitalize(car.status)}
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex-1">
                <Link href={`/cars/${carSlug}`}>
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                    {car.title}
                  </h3>
                </Link>
                
                <div className="text-2xl font-bold text-blue-600 mb-4">
                  {formatCurrency(car.price)}
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{car.year}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Gauge className="h-4 w-4" />
                    <span className="text-sm">{formatNumber(car.mileage)} km</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Fuel className="h-4 w-4" />
                    <span className="text-sm">{capitalize(car.fuelType)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">{capitalize(car.transmission)}</span>
                  </div>
                </div>

                {/* Description */}
                {car.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {car.description}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{car.location.city}, {car.location.state}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <Eye className="h-4 w-4" />
                  <span>{car.viewCount} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden',
      className
    )}>
      {/* Image */}
      <Link href={`/cars/${carSlug}`}>
        <div className="relative h-48">
          <Image
            src={primaryImage}
            alt={car.title}
            fill
            className="object-cover"
          />
          {car.status !== 'available' && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
              {capitalize(car.status)}
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {car.images.length} photos
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/cars/${carSlug}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-1">
            {car.title}
          </h3>
        </Link>
        
        <div className="text-xl font-bold text-blue-600 mb-3">
          {formatCurrency(car.price)}
        </div>

        {/* Key Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Gauge className="h-3 w-3" />
              <span>{formatNumber(car.mileage)} km</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Fuel className="h-3 w-3" />
              <span>{capitalize(car.fuelType)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Settings className="h-3 w-3" />
              <span>{capitalize(car.transmission)}</span>
            </div>
          </div>
        </div>

        {/* Location and Views */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{car.location.city}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{car.viewCount}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Link
                href={`/cars/${carSlug}`}
                className="flex-1 bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View Details
              </Link>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
