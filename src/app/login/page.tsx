'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { authApi } from '@/lib/api';
import { LoginFormData } from '@/types';
import { Eye, EyeOff, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToastContext } from '@/contexts/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToastContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.push(redirectUrl);
    }
  }, [router, redirectUrl]);

  const onSubmit = async (data: LoginFormData, event?: React.FormEvent) => {
    // Prevent default form submission
    if (event) {
      event.preventDefault();
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Attempting login with:', { email: data.email });

      const response = await authApi.login(data);

      console.log('Login response:', response);

      if (response.success && response.data) {
        // Store tokens safely
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        console.log('Login successful, redirecting to:', redirectUrl);

        // Show success toast
        toast.success('Login Successful', 'Welcome back! You have been logged in successfully.');

        // Force a page refresh and redirect to home page
        setTimeout(() => {
          if (redirectUrl === '/' || redirectUrl === '/my-listings') {
            window.location.href = '/';
          } else {
            router.push(redirectUrl);
          }
        }, 1000); // Longer delay to show toast
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);

      let errorMessage = 'Login failed. Please try again.';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        if (err.message.includes('Network Error')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (err.message.includes('401')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.message.includes('429')) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      toast.error('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MS Motor</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit((data) => onSubmit(data, e))(e);
            }}
            className="space-y-6"
            noValidate
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  type="email"
                  autoComplete="email"
                  className={cn(
                    'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-colors',
                    errors.email ? 'border-red-300 input-error' : 'border-gray-300',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={cn(
                    'appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-colors',
                    errors.password ? 'border-red-300 input-error' : 'border-gray-300',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                {errors.password && (
                  <p className="form-error">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100',
                  loading && 'opacity-50 cursor-not-allowed'
                )}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 rounded-md p-4">
              <p className="text-sm text-gray-600 mb-2">For testing purposes:</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div><strong>Email:</strong> testuser@gmail.com</div>
                <div><strong>Password:</strong> 123456</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
