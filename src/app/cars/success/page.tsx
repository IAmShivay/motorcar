'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Car, Plus, Eye } from 'lucide-react';

export default function CarSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [carId, setCarId] = useState<string | null>(null);
  const [carSlug, setCarSlug] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    
    if (!id && !slug) {
      // If no car info, redirect to cars page
      router.push('/cars');
    } else {
      setCarId(id);
      setCarSlug(slug);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Car Listed Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your car listing has been created and is now live. Potential buyers can now view and contact you about your vehicle.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            {carSlug && (
              <Link
                href={`/cars/${carSlug}`}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <Eye className="h-5 w-5" />
                <span>View Your Listing</span>
              </Link>
            )}
            
            <Link
              href="/cars/new"
              className="w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Add Another Car</span>
            </Link>
            
            <Link
              href="/cars"
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              <Car className="h-5 w-5" />
              <span>Browse All Cars</span>
            </Link>
          </div>
          
          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Your listing is now visible to all users</li>
              <li>• Interested buyers can contact you directly</li>
              <li>• You can edit or delete your listing anytime</li>
              <li>• We'll track views and interest for you</li>
            </ul>
          </div>
          
          {/* Tips */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-900 mb-2">Tips for better results:</h3>
            <ul className="text-sm text-yellow-700 space-y-1 text-left">
              <li>• Add high-quality photos from multiple angles</li>
              <li>• Write a detailed, honest description</li>
              <li>• Respond quickly to buyer inquiries</li>
              <li>• Keep your contact information updated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
