'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for protecting routes that require authentication
 * @param redirectTo The route to redirect to if not authenticated
 */
export const useProtectedRoute = (redirectTo: string = '/auth/login') => {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not logged in, redirect
    if (!loading && !isLoggedIn) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, loading, redirectTo, router]);

  return { isLoggedIn, loading };
};

/**
 * Hook for redirecting authenticated users away from specific routes
 * (like login page when already logged in)
 * @param redirectTo The route to redirect to if authenticated
 */
export const usePublicRoute = (redirectTo: string = '/dashboard') => {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and logged in, redirect
    if (!loading && isLoggedIn) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, loading, redirectTo, router]);

  return { isLoggedIn, loading };
};