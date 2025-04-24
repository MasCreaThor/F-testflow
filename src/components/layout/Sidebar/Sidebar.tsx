'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  /**
   * Whether the sidebar is collapsed
   */
  isCollapsed?: boolean;
  /**
   * Function to toggle sidebar collapse
   */
  onToggle?: () => void;
  /**
   * Whether the sidebar is mobile
   */
  isMobile?: boolean;
  /**
   * Function to close mobile sidebar
   */
  onCloseMobile?: () => void;
}

/**
 * Sidebar component for dashboard layout with collapsible functionality
 */
const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed = false,
  onToggle,
  isMobile = false,
  onCloseMobile 
}) => {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  
  const handleNavigation = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };
  
  // Navigation items with icons and labels
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
    {
      name: 'Mi Perfil',
      href: '/profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Objetivos de Estudio',
      href: '/study-goals',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
    },
    {
      name: 'Estadísticas',
      href: '/statistics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
  ];
  
  return (
    <div 
      className={`bg-white dark:bg-gray-900 h-full transition-all duration-300 ${
        isMobile ? 'w-full' : 'w-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header with Toggle Button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <Link 
              href="/" 
              className="flex items-center space-x-2"
              onClick={handleNavigation}
            >
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">TF</span>
              </div>
              {!isCollapsed && (
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  TestFlow
                </span>
              )}
            </Link>
          )}
          
          {isCollapsed && (
            <div className="mx-auto">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">TF</span>
              </div>
            </div>
          )}
          
          {/* Toggle Button - Only visible on desktop */}
          {!isMobile && onToggle && (
            <button
              onClick={onToggle}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
            >
              {isCollapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={handleNavigation}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className={`${isActive ? 'text-white' : ''} ${isCollapsed ? '' : 'mr-3'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && item.name}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex ${isCollapsed ? 'justify-center w-full' : 'items-center px-3 py-2'} text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md`}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`}
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm7 7V4h3v6h-3z" clipRule="evenodd" />
            </svg>
            {!isCollapsed && "Cerrar Sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;