'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CarFormData, FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES } from '@/types';
import { Plus, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarFormProps {
  initialData?: Partial<CarFormData>;
  onSubmit: (data: CarFormData) => void;
  loading?: boolean;
  submitButtonText?: string;
}

export function CarForm({ 
  initialData, 
  onSubmit, 
  loading = false, 
  submitButtonText = 'Submit' 
}: CarFormProps) {
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [newFeature, setNewFeature] = useState('');
  const [images, setImages] = useState(initialData?.images || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CarFormData>({
    defaultValues: {
      make: initialData?.make || '',
      model: initialData?.model || '',
      year: initialData?.year || new Date().getFullYear(),
      price: initialData?.price || 0,
      mileage: initialData?.mileage || 0,
      fuelType: initialData?.fuelType || 'petrol',
      transmission: initialData?.transmission || 'manual',
      bodyType: initialData?.bodyType || 'sedan',
      color: initialData?.color || '',
      description: initialData?.description || '',
      location: {
        city: initialData?.location?.city || '',
        state: initialData?.location?.state || '',
        country: initialData?.location?.country || 'India',
      },
      seller: {
        name: initialData?.seller?.name || '',
        phone: initialData?.seller?.phone || '',
        email: initialData?.seller?.email || '',
      },
    },
  });

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      const updatedFeatures = [...features, newFeature.trim()];
      setFeatures(updatedFeatures);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const updatedImages = [...images, { url, alt: '' }];
      setImages(updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const onFormSubmit = (data: CarFormData) => {
    onSubmit({
      ...data,
      features,
      images,
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Make *
            </label>
            <input
              {...register('make', { required: 'Make is required' })}
              type="text"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.make ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="e.g., Maruti Suzuki"
            />
            {errors.make && (
              <p className="mt-1 text-sm text-red-600">{errors.make.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <input
              {...register('model', { required: 'Model is required' })}
              type="text"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.model ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="e.g., Swift"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <select
              {...register('year', { 
                required: 'Year is required',
                valueAsNumber: true 
              })}
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.year ? 'border-red-300' : 'border-gray-300'
              )}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              {...register('price', { 
                required: 'Price is required',
                valueAsNumber: true,
                min: { value: 1, message: 'Price must be greater than 0' }
              })}
              type="number"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.price ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="e.g., 500000"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mileage (km) *
            </label>
            <input
              {...register('mileage', {
                required: 'Mileage is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Mileage cannot be negative' }
              })}
              type="number"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.mileage ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="e.g., 50000"
            />
            {errors.mileage && (
              <p className="mt-1 text-sm text-red-600">{errors.mileage.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <input
              {...register('color', { required: 'Color is required' })}
              type="text"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.color ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="e.g., White"
            />
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type *
            </label>
            <select
              {...register('fuelType', { required: 'Fuel type is required' })}
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.fuelType ? 'border-red-300' : 'border-gray-300'
              )}
            >
              {FUEL_TYPES.map(fuel => (
                <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
              ))}
            </select>
            {errors.fuelType && (
              <p className="mt-1 text-sm text-red-600">{errors.fuelType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmission *
            </label>
            <select
              {...register('transmission', { required: 'Transmission is required' })}
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.transmission ? 'border-red-300' : 'border-gray-300'
              )}
            >
              {TRANSMISSION_TYPES.map(transmission => (
                <option key={transmission.value} value={transmission.value}>
                  {transmission.label}
                </option>
              ))}
            </select>
            {errors.transmission && (
              <p className="mt-1 text-sm text-red-600">{errors.transmission.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Type *
            </label>
            <select
              {...register('bodyType', { required: 'Body type is required' })}
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.bodyType ? 'border-red-300' : 'border-gray-300'
              )}
            >
              {BODY_TYPES.map(body => (
                <option key={body.value} value={body.value}>{body.label}</option>
              ))}
            </select>
            {errors.bodyType && (
              <p className="mt-1 text-sm text-red-600">{errors.bodyType.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="Describe your car's condition, history, and any additional details..."
          />
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Features</h2>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Add a feature (e.g., Air Conditioning, Power Steering)"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          {features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>
        
        <div className="space-y-4">
          <button
            type="button"
            onClick={addImage}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Click to add image URL</p>
            <p className="text-sm text-gray-500">Add up to 10 images</p>
          </button>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Car image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              {...register('location.city', { required: 'City is required' })}
              type="text"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.location?.city ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="e.g., Mumbai"
            />
            {errors.location?.city && (
              <p className="mt-1 text-sm text-red-600">{errors.location.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              {...register('location.state', { required: 'State is required' })}
              type="text"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.location?.state ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="e.g., Maharashtra"
            />
            {errors.location?.state && (
              <p className="mt-1 text-sm text-red-600">{errors.location.state.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Seller Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Seller Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              {...register('seller.name', { required: 'Seller name is required' })}
              type="text"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.seller?.name ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="Your full name"
            />
            {errors.seller?.name && (
              <p className="mt-1 text-sm text-red-600">{errors.seller.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              {...register('seller.phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]?[\d\s\-\(\)]{10,15}$/,
                  message: 'Please enter a valid phone number'
                }
              })}
              type="tel"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.seller?.phone ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="+91 98765 43210"
            />
            {errors.seller?.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.seller.phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Optional)
            </label>
            <input
              {...register('seller.email', {
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              type="email"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
                errors.seller?.email ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="your.email@example.com"
            />
            {errors.seller?.email && (
              <p className="mt-1 text-sm text-red-600">{errors.seller.email.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors',
            loading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {loading ? 'Creating...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
