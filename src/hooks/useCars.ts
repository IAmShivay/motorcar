import { useState, useEffect, useCallback } from 'react';
import { carApi } from '@/lib/api';
import { Car, CarFilters, Pagination } from '@/types';
import { getErrorMessage } from '@/lib/utils';

interface UseCarsReturn {
  cars: Car[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  refetch: () => void;
  updateFilters: (filters: CarFilters) => void;
}

export function useCars(initialFilters: CarFilters = {}): UseCarsReturn {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<CarFilters>(initialFilters);

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await carApi.getCars(filters);
      
      if (response.success && response.data) {
        setCars(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch cars');
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      let errorMessage = getErrorMessage(err);

      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('Network Error') || err.message.includes('ECONNREFUSED')) {
          errorMessage = 'Unable to connect to server. Please check if the backend is running on port 3001.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else if (err.message.includes('404')) {
          errorMessage = 'API endpoint not found. Please check the server configuration.';
        }
      }

      setError(errorMessage);
      setCars([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: CarFilters) => {
    setFilters(newFilters);
  }, []);

  const refetch = useCallback(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return {
    cars,
    loading,
    error,
    pagination,
    refetch,
    updateFilters,
  };
}

// Hook for single car
interface UseCarReturn {
  car: Car | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCar(carId: string): UseCarReturn {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCar = useCallback(async () => {
    if (!carId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await carApi.getCar(carId);
      
      if (response.success && response.data) {
        setCar(response.data);
      } else {
        throw new Error(response.message || 'Car not found');
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setCar(null);
    } finally {
      setLoading(false);
    }
  }, [carId]);

  const refetch = useCallback(() => {
    fetchCar();
  }, [fetchCar]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  return {
    car,
    loading,
    error,
    refetch,
  };
}
