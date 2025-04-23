// src/components/layout/Navigation/UnauthenticatedNav.tsx
import React from 'react';
import Link from 'next/link';

/**
 * Navigation component for unauthenticated users in the main layout
 */
const UnauthenticatedNav: React.FC = () => {
  return (
    <div className="flex items-center">
      {/* Navigation Links */}
      <div className="hidden md:block">
        <div className="ml-10 flex items-center space-x-4">
          <Link
            href="/"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Inicio
          </Link>
        </div>
      </div>

      {/* Auth Buttons */}
      <div className="ml-4 flex items-center space-x-4">
        <Link
          href="/auth/login"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium"
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/auth/register"
          className="bg-primary-600 text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
};

export default UnauthenticatedNav;