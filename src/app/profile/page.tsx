'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { authApi } from '@/lib/api';
import { User } from '@/types';
import { useToastContext } from '@/contexts/ToastContext';
import { Loading } from '@/components/Loading';
import { User as UserIcon, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const toast = useToastContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>();

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
          toast.warning('Authentication Required', 'Please log in to view your profile.');
          router.push('/login?redirect=/profile');
          return;
        }

        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Reset form with user data
          reset({
            firstName: parsedUser.profile?.firstName || '',
            lastName: parsedUser.profile?.lastName || '',
            email: parsedUser.email || '',
            phone: parsedUser.profile?.phone || '',
            address: parsedUser.profile?.address || '',
            city: parsedUser.profile?.city || '',
            state: parsedUser.profile?.state || '',
          });
        } catch (error) {
          toast.error('Session Error', 'Invalid session data. Please log in again.');
          router.push('/login?redirect=/profile');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Error', 'Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setSaving(true);

      const updateData = {
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
        }
      };

      const response = await authApi.updateProfile(updateData);

      if (response.success && response.data) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        setEditing(false);
        toast.success('Profile Updated', 'Your profile has been successfully updated.');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      toast.error('Update Failed', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form to original values
    if (user) {
      reset({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: user.profile?.address || '',
        city: user.profile?.city || '',
        state: user.profile?.state || '',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="xl" text="Loading your profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to load your profile information.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.profile?.firstName || user.profile?.lastName 
                    ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
                    : user.username
                  }
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member since {new Date(user.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </div>
              </div>
            </div>
            
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    {...register('firstName', { required: 'First name is required' })}
                    type="text"
                    disabled={!editing}
                    className={cn(
                      'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      !editing ? 'bg-gray-50 text-gray-600' : 'bg-white',
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    )}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    {...register('lastName', { required: 'Last name is required' })}
                    type="text"
                    disabled={!editing}
                    className={cn(
                      'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      !editing ? 'bg-gray-50 text-gray-600' : 'bg-white',
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    )}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    disabled={!editing}
                    className={cn(
                      'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      !editing ? 'bg-gray-50 text-gray-600' : 'bg-white',
                      'border-gray-300'
                    )}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Address
                  </label>
                  <input
                    {...register('address')}
                    type="text"
                    disabled={!editing}
                    className={cn(
                      'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      !editing ? 'bg-gray-50 text-gray-600' : 'bg-white',
                      'border-gray-300'
                    )}
                    placeholder="Enter your address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      disabled={!editing}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        !editing ? 'bg-gray-50 text-gray-600' : 'bg-white',
                        'border-gray-300'
                      )}
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      {...register('state')}
                      type="text"
                      disabled={!editing}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        !editing ? 'bg-gray-50 text-gray-600' : 'bg-white',
                        'border-gray-300'
                      )}
                      placeholder="Enter your state"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4 inline mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <Loading size="sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
