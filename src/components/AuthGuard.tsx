'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ children, requireAuth = false, redirectTo = '/login' }: AuthGuardProps) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If auth is required but user is not logged in, redirect
  if (requireAuth && !user) {
    if (typeof window !== 'undefined') {
      window.location.href = `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
    return null;
  }

  return <>{children}</>;
}
