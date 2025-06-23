import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate car slug for URL
export function generateCarSlug(car: { make: string; model: string; year: number; _id: string }): string {
  const slug = `${car.year}-${car.make}-${car.model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug}-${car._id}`;
}

// Extract car ID from slug
export function extractCarIdFromSlug(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generate meta description for car
export function generateCarMetaDescription(car: {
  year: number;
  make: string;
  model: string;
  price: number;
  mileage: number;
  fuelType: string;
  location: { city: string; state: string };
}): string {
  return `${car.year} ${car.make} ${car.model} for sale in ${car.location.city}, ${car.location.state}. Price: ${formatCurrency(car.price)}, Mileage: ${formatNumber(car.mileage)} km, Fuel: ${capitalize(car.fuelType)}. View details and contact seller.`;
}

// Generate JSON-LD structured data for car
export function generateCarJsonLd(car: {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description?: string;
  images: Array<{ url: string; alt?: string }>;
  seller: { name: string; phone: string };
  location: { city: string; state: string; country: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${car.year} ${car.make} ${car.model}`,
    description: car.description || `${car.year} ${car.make} ${car.model} for sale`,
    brand: {
      '@type': 'Brand',
      name: car.make,
    },
    model: car.model,
    vehicleModelDate: car.year.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.mileage,
      unitCode: 'KMT',
    },
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Person',
        name: car.seller.name,
        telephone: car.seller.phone,
      },
    },
    image: car.images.map(img => img.url),
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/cars/${generateCarSlug(car)}`,
    location: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: car.location.city,
        addressRegion: car.location.state,
        addressCountry: car.location.country,
      },
    },
  };
}

// Local storage helpers
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle storage errors silently
    }
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle storage errors silently
    }
  },
};

// URL helpers
export function buildSearchParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
}

// Error handling
export function getErrorMessage(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function getValidationErrors(error: any): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (error?.response?.data?.errors) {
    error.response.data.errors.forEach((err: { field: string; message: string }) => {
      errors[err.field] = err.message;
    });
  }
  
  return errors;
}
