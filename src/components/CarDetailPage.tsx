'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types';
import { formatCurrency, formatNumber, capitalize, formatRelativeTime } from '@/lib/utils';
import { 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  MapPin, 
  Eye, 
  Phone, 
  Mail, 
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarDetailPageProps {
  car: Car;
}

export function CarDetailPage({ car }: CarDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [showContactForm, setShowContactForm] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  const carSpecs = [
    { label: 'Make', value: car.make },
    { label: 'Model', value: car.model },
    { label: 'Year', value: car.year.toString() },
    { label: 'Mileage', value: `${formatNumber(car.mileage)} km` },
    { label: 'Fuel Type', value: capitalize(car.fuelType) },
    { label: 'Transmission', value: capitalize(car.transmission) },
    { label: 'Body Type', value: capitalize(car.bodyType) },
    { label: 'Color', value: capitalize(car.color) },
    { label: 'Status', value: capitalize(car.status) },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/cars" className="hover:text-blue-600">Cars</Link>
            <span>/</span>
            <span className="text-gray-900">{car.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-96 lg:h-[500px]">
                <Image
                  src={car.images[currentImageIndex]?.url || '/placeholder-car.jpg'}
                  alt={car.title}
                  fill
                  className="object-cover"
                />
                
                {car.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {car.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-colors',
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {car.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        'relative w-20 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors',
                        index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                      )}
                    >
                      <Image
                        src={image.url}
                        alt={`${car.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{car.title}</h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(car.price)}
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Eye className="h-4 w-4" />
                  <span>{car.viewCount} views</span>
                  <span>•</span>
                  <span>Listed {formatRelativeTime(car.createdAt)}</span>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <div className="text-sm text-gray-500">Year</div>
                    <div className="font-semibold">{car.year}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Gauge className="h-5 w-5" />
                  <div>
                    <div className="text-sm text-gray-500">Mileage</div>
                    <div className="font-semibold">{formatNumber(car.mileage)} km</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Fuel className="h-5 w-5" />
                  <div>
                    <div className="text-sm text-gray-500">Fuel</div>
                    <div className="font-semibold">{capitalize(car.fuelType)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Settings className="h-5 w-5" />
                  <div>
                    <div className="text-sm text-gray-500">Transmission</div>
                    <div className="font-semibold">{capitalize(car.transmission)}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{car.description}</p>
                </div>
              )}

              {/* Features */}
              {car.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {carSpecs.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">{spec.label}</span>
                      <span className="font-semibold text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Seller</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500">Seller</div>
                  <div className="font-semibold text-gray-900">{car.seller.name}</div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{car.location.city}, {car.location.state}</span>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${car.seller.phone}`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Seller</span>
                </a>
                
                {car.seller.email && (
                  <a
                    href={`mailto:${car.seller.email}`}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email Seller</span>
                  </a>
                )}

                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-3">
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Save to Favorites</span>
                </button>
                
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share Listing</span>
                </button>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Safety Tips</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Meet in a public place</li>
                <li>• Inspect the car thoroughly</li>
                <li>• Verify all documents</li>
                <li>• Never send money in advance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
