import React from 'react';
import Link from 'next/link';

/**
 * Footer component for the application
 */
const Footer: React.FC = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">TF</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                TestFlow
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Plataforma para la gestión de aprendizaje y evaluación de conocimientos,
              permitiendo a los usuarios establecer objetivos de estudio y seguir su progreso.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Navegación
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 text-sm"
                >
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link 
                  href="/study-goals" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 text-sm"
                >
                  Objetivos de Estudio
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 text-sm"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-service" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 text-sm"
                >
                  Términos de Servicio
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Copyright Bar */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            &copy; {currentYear} TestFlow. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;