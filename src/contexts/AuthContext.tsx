'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authApi } from '@/lib/api';

// Safe localStorage helpers
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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getStorageItem('accessToken');
        const storedUser = getStorageItem('user');

        if (token && storedUser) {
          // Immediately set user from localStorage to prevent flashing
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Then try to get fresh user data in background
          try {
            const response = await authApi.getMe();
            if (response.success && response.data) {
              setUser(response.data.user);
              // Update localStorage with fresh data
              setStorageItem('user', JSON.stringify(response.data.user));
            }
          } catch (error) {
            // If API call fails, keep the stored user data
            console.warn('Failed to refresh user data:', error);
          }
        }
      } catch (error) {
        // Clear invalid data
        removeStorageItem('accessToken');
        removeStorageItem('refreshToken');
        removeStorageItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        // Store tokens
        setStorageItem('accessToken', response.data.accessToken);
        setStorageItem('refreshToken', response.data.refreshToken);
        setStorageItem('user', JSON.stringify(response.data.user));
        
        // Update state
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authApi.register(userData);
      
      if (response.success && response.data) {
        // Store tokens
        setStorageItem('accessToken', response.data.accessToken);
        setStorageItem('refreshToken', response.data.refreshToken);
        setStorageItem('user', JSON.stringify(response.data.user));
        
        // Update state
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear storage
    removeStorageItem('accessToken');
    removeStorageItem('refreshToken');
    removeStorageItem('user');
    
    // Update state
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setStorageItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
