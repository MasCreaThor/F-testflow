import React from 'react';
import Card from '@/components/ui/Card/Card';
import { People } from '@/types/people.types';

interface ActivityCardProps {
  profile: People | null;
  loading: boolean;
}

/**
 * Recent activity card component for the dashboard
 */
const ActivityCard: React.FC<ActivityCardProps> = ({ profile, loading }) => {
  if (loading) {
    return (
      <Card title="Actividad Reciente" className="animate-pulse">
        <div className="p-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  // This would be replaced with real activity data in a production app
  const hasActivities = profile?.studyGoals && profile.studyGoals.length > 0;
  const goalsCount = profile?.studyGoals?.length || 0;
  const lastUpdateDate = profile?.updatedAt 
    ? new Date(profile.updatedAt).toLocaleDateString() 
    : 'fecha desconocida';

  return (
    <Card title="Actividad Reciente">
      <div className="p-4">
        {hasActivities ? (
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Has agregado <span className="font-semibold">{goalsCount}</span> objetivos de estudio
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Última actualización: {lastUpdateDate}
                </p>
              </div>
            </div>
            
            {/* Here you can add more activity items as needed */}
          </div>
        ) : (
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              No hay actividad reciente. <br />
              ¡Comienza a usar la plataforma!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityCard;