import React from 'react';
import Card from '@/components/ui/Card/Card';
import { People } from '@/types/people.types';

interface WelcomeCardProps {
  profile: People | null;
  loading: boolean;
}

/**
 * Welcome card component for the dashboard
 */
const WelcomeCard: React.FC<WelcomeCardProps> = ({ profile, loading }) => {
  if (loading) {
    return (
      <Card title="Bienvenido" className="col-span-full animate-pulse">
        <div className="p-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Bienvenido"
      className="col-span-full"
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Hola, {profile?.firstName} {profile?.lastName}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Bienvenido a tu dashboard personal. Aquí podrás ver un resumen de tu progreso y actividades recientes.
        </p>
      </div>
    </Card>
  );
};

export default WelcomeCard;