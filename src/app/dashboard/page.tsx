'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import { 
  WelcomeCard, 
  StatsCard, 
  ActivityCard, 
  ActionsCard,
  UserAvatar
} from '@/components/dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardLayout } from '@/contexts/DashboardLayoutContext';
import PeopleService from '@/services/people.service';
import { People } from '@/types/people.types';

/**
 * Dashboard page - Main page after login
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const { isSidebarCollapsed } = useDashboardLayout();
  
  const [profile, setProfile] = useState<People | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) return;

      try {
        const data = await PeopleService.getPeopleByUserId(user._id);
        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('No se pudo cargar el perfil. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Determine grid classes based on sidebar state
  const getGridClasses = () => {
    // Base classes for all screen sizes
    let classes = 'grid gap-6 ';
    
    // Add responsive classes
    if (isSidebarCollapsed) {
      // When sidebar is collapsed, we can show more columns
      classes += 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    } else {
      // When sidebar is expanded, we have less space
      classes += 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3';
    }
    
    return classes;
  };

  // Render error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        
        {/* User profile summary */}
        {!loading && profile && (
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            <UserAvatar profile={profile} />
          </div>
        )}
      </div>

      {/* Dashboard content */}
      <div className={getGridClasses()}>
        {/* Welcome Card - Full width */}
        <div className="col-span-full">
          <WelcomeCard profile={profile} loading={loading} />
        </div>
        
        {/* Main dashboard cards */}
        <StatsCard profile={profile} loading={loading} />
        <ActivityCard profile={profile} loading={loading} />
        <ActionsCard loading={loading} />
      </div>
    </DashboardLayout>
  );
}