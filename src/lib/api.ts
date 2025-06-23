import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Debug logging
console.log('API Base URL:', API_BASE_URL);

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to safely access localStorage
const getStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeStorageItem = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getStorageItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      // Clear token and redirect to login
      removeStorageItem('accessToken');
      removeStorageItem('refreshToken');
      removeStorageItem('user');

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Add more specific error information
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      error.message = 'Network Error: Unable to connect to server';
    }

    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Car API functions
export const carApi = {
  // Get all cars with filtering
  getCars: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    make?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    fuelType?: string;
    transmission?: string;
    bodyType?: string;
    city?: string;
    state?: string;
  }): Promise<PaginatedResponse<Car>> => {
    const response = await api.get('/api/cars', { params });
    return response.data;
  },

  // Get single car
  getCar: async (id: string): Promise<ApiResponse<Car>> => {
    const response = await api.get(`/api/cars/${id}`);
    return response.data;
  },

  // Create new car
  createCar: async (carData: Partial<Car>): Promise<ApiResponse<Car>> => {
    const response = await api.post('/api/cars', carData);
    return response.data;
  },

  // Update car
  updateCar: async (id: string, carData: Partial<Car>): Promise<ApiResponse<Car>> => {
    const response = await api.put(`/api/cars/${id}`, carData);
    return response.data;
  },

  // Delete car
  deleteCar: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/api/cars/${id}`);
    return response.data;
  },

  // Get user's cars
  getMyCars: async (): Promise<ApiResponse<Car[]>> => {
    const response = await api.get('/api/cars/my-listings');
    return response.data;
  },

  // Get car statistics
  getStats: async (): Promise<ApiResponse<CarStats>> => {
    const response = await api.get('/api/cars/stats');
    return response.data;
  },
};

// Auth API functions
export const authApi = {
  // Register
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    };
  }): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: any): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/api/auth/profile', profileData);
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData: {
    profile: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    };
  }): Promise<ApiResponse<User>> => {
    const response = await api.put('/api/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await api.put('/api/auth/password', passwordData);
    return response.data;
  },
};

// Type definitions (these should match your backend models)
export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'lpg';
  transmission: 'manual' | 'automatic' | 'cvt';
  bodyType: 'sedan' | 'hatchback' | 'suv' | 'coupe' | 'convertible' | 'wagon' | 'pickup' | 'van';
  color: string;
  description?: string;
  features: string[];
  images: Array<{
    url: string;
    alt?: string;
  }>;
  location: {
    city: string;
    state: string;
    country: string;
  };
  seller: {
    name: string;
    phone: string;
    email?: string;
  };
  status: 'available' | 'sold' | 'reserved';
  isActive: boolean;
  viewCount: number;
  title: string;
  formattedPrice: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  fullName: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface CarStats {
  overview: {
    totalCars: number;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    avgYear: number;
    avgMileage: number;
  };
  topMakes: Array<{
    _id: string;
    count: number;
    avgPrice: number;
  }>;
  fuelTypeDistribution: Array<{
    _id: string;
    count: number;
  }>;
}
