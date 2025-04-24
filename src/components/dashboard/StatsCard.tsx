import React from 'react';
import Card from '@/components/ui/Card/Card';
import { People } from '@/types/people.types';

interface StatsCardProps {
  profile: People | null;
  loading: boolean;
}

/**
 * Statistics card component for the dashboard
 */
const StatsCard: React.FC<StatsCardProps> = ({ profile, loading }) => {
  if (loading) {
    return (
      <Card title="Estadísticas" className="animate-pulse">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg h-20"></div>
            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg h-20"></div>
          </div>
        </div>
      </Card>
    );
  }

  // Calculate completion percentage (in a real app, this would come from actual data)
  const totalGoals = profile?.studyGoals?.length || 0;
  const completedGoals = 0; // Example placeholder, would be real data in production
  const completionPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <Card title="Estadísticas">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-50 dark:bg-primary-900/30 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Objetivos</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalGoals}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completados</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completedGoals}</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progreso total</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{completionPercentage}%</p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;