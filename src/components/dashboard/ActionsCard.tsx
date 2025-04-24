import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card/Card';

interface ActionsCardProps {
  loading: boolean;
}

/**
 * Quick actions card component for the dashboard
 */
const ActionsCard: React.FC<ActionsCardProps> = ({ loading }) => {
  if (loading) {
    return (
      <Card title="Acciones Rápidas" className="animate-pulse">
        <div className="p-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  const actions = [
    {
      name: 'Administrar objetivos de estudio',
      href: '/study-goals',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
        </svg>
      ),
    },
    {
      name: 'Actualizar perfil',
      href: '/profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Ver estadísticas',
      href: '/statistics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
    }
  ];

  return (
    <Card title="Acciones Rápidas">
      <div className="p-4">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {actions.map((action, index) => (
            <li key={index} className="py-2 first:pt-0 last:pb-0">
              <Link 
                href={action.href} 
                className="group flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
              >
                <span className="mr-2 text-gray-400 group-hover:text-primary-600 dark:text-gray-500 dark:group-hover:text-primary-400 transition-colors">
                  {action.icon}
                </span>
                {action.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default ActionsCard;