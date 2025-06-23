// Car related types
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
  images: CarImage[];
  location: CarLocation;
  seller: CarSeller;
  status: 'available' | 'sold' | 'reserved';
  isActive: boolean;
  viewCount: number;
  title: string;
  formattedPrice: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarImage {
  url: string;
  alt?: string;
}

export interface CarLocation {
  city: string;
  state: string;
  country: string;
}

export interface CarSeller {
  name: string;
  phone: string;
  email?: string;
}

export interface CarFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: Car['fuelType'];
  transmission: Car['transmission'];
  bodyType: Car['bodyType'];
  color: string;
  description?: string;
  features: string[];
  images: CarImage[];
  location: CarLocation;
  seller: CarSeller;
}

// User related types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  profile: UserProfile;
  fullName: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// API related types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Search and filter types
export interface CarFilters {
  page?: number;
  limit?: number;
  sort?: string;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: Car['fuelType'];
  transmission?: Car['transmission'];
  bodyType?: Car['bodyType'];
  city?: string;
  state?: string;
  search?: string;
}

export interface SearchState {
  filters: CarFilters;
  results: Car[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

// Statistics types
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

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Component prop types
export interface CarCardProps {
  car: Car;
  showActions?: boolean;
  className?: string;
}

export interface FilterSidebarProps {
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
  loading?: boolean;
}

export interface PaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  className?: string;
}

// Constants
export const FUEL_TYPES: Array<{ value: Car['fuelType']; label: string }> = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'cng', label: 'CNG' },
  { value: 'lpg', label: 'LPG' },
];

export const TRANSMISSION_TYPES: Array<{ value: Car['transmission']; label: string }> = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'cvt', label: 'CVT' },
];

export const BODY_TYPES: Array<{ value: Car['bodyType']; label: string }> = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'suv', label: 'SUV' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'wagon', label: 'Wagon' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'van', label: 'Van' },
];

export const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'year', label: 'Year: Old to New' },
  { value: '-year', label: 'Year: New to Old' },
  { value: 'mileage', label: 'Mileage: Low to High' },
  { value: '-mileage', label: 'Mileage: High to Low' },
];

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
