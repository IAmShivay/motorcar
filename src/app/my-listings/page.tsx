'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { carApi } from '@/lib/api';
import { Car } from '@/types';
import { CarCard } from '@/components/CarCard';
import { Loading } from '@/components/Loading';
import { Plus, Car as CarIcon, Edit, Trash2, Eye } from 'lucide-react';
import { getErrorMessage, generateCarSlug } from '@/lib/utils';
import { useToastContext } from '@/contexts/ToastContext';

export default function MyListingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const toast = useToastContext();

  // Check if user is authenticated
  useEffect(() => {
    let mounted = true;

    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
          if (mounted) {
            toast.warning('Authentication Required', 'Please log in to view your listings.');
            router.push('/login?redirect=/my-listings');
          }
          return;
        }

        try {
          const parsedUser = JSON.parse(storedUser);
          if (mounted) {
            setUser(parsedUser);
          }
        } catch (error) {
          if (mounted) {
            toast.error('Session Error', 'Invalid session data. Please log in again.');
            router.push('/login?redirect=/my-listings');
          }
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []); // Remove dependencies to prevent loops

  // Fetch user's car listings
  useEffect(() => {
    const fetchMyCars = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        let response;

        try {
          // Try the dedicated my-listings endpoint first
          response = await carApi.getMyCars();
        } catch (apiError: any) {
          console.log('My-listings endpoint not available, using fallback method');

          // Fallback: Get all cars and filter by user
          response = await carApi.getCars({ limit: 100 });

          if (response.success && response.data) {
            // Filter cars by current user's email
            const myCars = response.data.filter((car: any) =>
              car.seller?.email === user.email ||
              car.seller?.name === user.username ||
              car.seller?.name === `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim()
            );

            // Create a response object with filtered data
            response = {
              success: true,
              data: myCars,
              message: 'Cars fetched successfully'
            };
          }
        }

        if (response.success && response.data) {
          setCars(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch listings');
        }
      } catch (err) {
        console.error('Error fetching my listings:', err);
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error('Error Loading Listings', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is available and we haven't attempted fetch yet
    if (user && !fetchAttempted) {
      setFetchAttempted(true);
      fetchMyCars();
    }
  }, [user, fetchAttempted]); // Remove toast from dependencies

  const retryFetch = () => {
    setError(null);
    setFetchAttempted(false);
    setLoading(true);
  };

  const handleDelete = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      setDeletingId(carId);
      const response = await carApi.deleteCar(carId);
      
      if (response.success) {
        // Remove the car from the list
        setCars(cars.filter(car => car._id !== carId));
        toast.success('Listing Deleted', 'Your car listing has been successfully deleted.');
      } else {
        throw new Error(response.message || 'Failed to delete listing');
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error('Delete Failed', errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
              <p className="mt-2 text-gray-600">
                Manage your car listings and track their performance
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0">
              <Link
                href="/cars/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Listing</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loading size="xl" text="Loading your listings..." />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-600 text-lg mb-4">Error loading your listings</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={retryFetch}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <CarIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No listings yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't created any car listings yet. Start by adding your first car to reach potential buyers.
            </p>
            <Link
              href="/cars/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Listing</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <CarIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {cars.reduce((total, car) => total + car.viewCount, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">₹</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{cars.length > 0 ? Math.round(cars.reduce((total, car) => total + car.price, 0) / cars.length / 1000) : 0}K
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div key={car._id} className="relative">
                  <CarCard car={car} />
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Link
                      href={`/cars/${generateCarSlug(car)}`}
                      className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white transition-colors shadow-md"
                      title="View Listing"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    
                    <Link
                      href={`/cars/edit/${car._id}`}
                      className="bg-white/90 backdrop-blur-sm text-blue-600 p-2 rounded-full hover:bg-white transition-colors shadow-md"
                      title="Edit Listing"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(car._id)}
                      disabled={deletingId === car._id}
                      className="bg-white/90 backdrop-blur-sm text-red-600 p-2 rounded-full hover:bg-white transition-colors shadow-md disabled:opacity-50"
                      title="Delete Listing"
                    >
                      {deletingId === car._id ? (
                        <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      car.status === 'available' 
                        ? 'bg-green-100 text-green-800'
                        : car.status === 'sold'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
