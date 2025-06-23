'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CarForm } from '@/components/CarForm';
import { carApi } from '@/lib/api';
import { CarFormData } from '@/types';
import { generateCarSlug } from '@/lib/utils';

export default function NewCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login?redirect=/cars/new');
    }
  }, [router]);

  const handleSubmit = async (data: CarFormData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Creating car listing with data:', data);

      const response = await carApi.createCar(data);

      console.log('Car creation response:', response);

      if (response.success && response.data) {
        // Generate proper slug for the car detail page
        const carSlug = generateCarSlug(response.data);
        console.log('Car created successfully, redirecting to success page');

        // Redirect to success page with car info
        router.push(`/cars/success?id=${response.data._id}&slug=${carSlug}`);
      } else {
        throw new Error(response.message || 'Failed to create car listing');
      }
    } catch (err: unknown) {
      console.error('Car creation error:', err);

      let errorMessage = 'Failed to create car listing. Please try again.';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        if (err.message.includes('Network Error')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (err.message.includes('401')) {
          errorMessage = 'You must be logged in to create a car listing.';
        } else if (err.message.includes('400')) {
          errorMessage = 'Invalid car data. Please check all required fields.';
        } else if (err.message.includes('413')) {
          errorMessage = 'Images are too large. Please use smaller images.';
        } else if (err.message.includes('429')) {
          errorMessage = 'Too many requests. Please try again later.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sell Your Car</h1>
          <p className="mt-2 text-gray-600">
            Create a detailed listing to attract potential buyers
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Error Creating Car Listing
                </h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <CarForm
          onSubmit={handleSubmit}
          loading={loading}
          submitButtonText="Create Listing"
        />
      </div>
    </div>
  );
}
