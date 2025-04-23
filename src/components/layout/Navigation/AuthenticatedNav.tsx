// src/components/layout/Navigation/AuthenticatedNav.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Navigation component for authenticated users in the main layout
 */
const AuthenticatedNav: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  // Toggle profile dropdown
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
  };

  // Go to study space (dashboard)
  const goToStudySpace = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Study Space Button */}
      <button
        onClick={goToStudySpace}
        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium"
      >
        Mi espacio de estudio
      </button>

      {/* Profile Menu */}
      <div className="relative">
        <button
          type="button"
          className="flex items-center max-w-xs rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          id="user-menu-button"
          aria-expanded={isProfileOpen}
          aria-haspopup="true"
          onClick={toggleProfile}
        >
          <span className="sr-only">Abrir menú de usuario</span>
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
            {user?.email.charAt(0).toUpperCase()}
          </div>
        </button>

        {isProfileOpen && (
          <div
            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
            tabIndex={-1}
          >
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              tabIndex={-1}
              onClick={() => setIsProfileOpen(false)}
            >
              Mi Perfil
            </Link>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              tabIndex={-1}
              onClick={() => setIsProfileOpen(false)}
            >
              Dashboard
            </Link>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              tabIndex={-1}
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticatedNav;