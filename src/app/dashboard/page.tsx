'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import Card from '@/components/ui/Card/Card';
import { useAuth } from '@/contexts/AuthContext';
import PeopleService from '@/services/people.service';
import { People } from '@/types/people.types';

/**
 * Dashboard page - Main page after login
 */
export default function DashboardPage() {
  const { user } = useAuth();
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

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <Card className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Welcome Card */}
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

          {/* Stats Card */}
          <Card title="Estadísticas">
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 dark:bg-primary-900/30 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Objetivos</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{profile?.studyGoals?.length || 0}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completados</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity Card */}
          <Card title="Actividad Reciente">
            <div className="p-4">
              {profile?.studyGoals?.length ? (
                <ul className="space-y-3">
                  <li className="text-sm text-gray-600 dark:text-gray-400">
                    Has agregado {profile.studyGoals.length} objetivos de estudio
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No hay actividad reciente. ¡Comienza a usar la plataforma!
                </p>
              )}
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card title="Acciones Rápidas">
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <a 
                    href="/study-goals" 
                    className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    Administrar objetivos de estudio
                  </a>
                </li>
                <li>
                  <a 
                    href="/profile" 
                    className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    Actualizar perfil
                  </a>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}