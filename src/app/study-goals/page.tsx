'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Modal from '@/components/ui/Modal/Modal';
import { useAuth } from '@/contexts/AuthContext';
import StudyGoalsService from '@/services/study-goals.service';
import PeopleService from '@/services/people.service';
import { StudyGoal } from '@/types/people.types';

/**
 * Study Goals page - Manage study goals
 */
export default function StudyGoalsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([]);
  const [userGoals, setUserGoals] = useState<StudyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [processingGoalId, setProcessingGoalId] = useState<string | null>(null);

  // Setup form for adding a goal
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; description: string }>();

  // Fetch profile and study goals
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        // Fetch all goals
        const allGoals = await StudyGoalsService.getAllStudyGoals();
        setStudyGoals(allGoals);

        // Fetch user profile
        const userProfile = await PeopleService.getPeopleByUserId(user._id);
        setProfile(userProfile);

        // Filter goals that belong to the user
        if (userProfile.studyGoals && userProfile.studyGoals.length > 0) {
          const userGoals = allGoals.filter(goal => 
            userProfile.studyGoals?.includes(goal._id)
          );
          setUserGoals(userGoals);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Add a new goal
  const handleAddGoal = async (data: { name: string; description: string }) => {
    setError(null);
    setSuccess(null);

    try {
      const newGoal = await StudyGoalsService.createStudyGoal(data);
      setStudyGoals([...studyGoals, newGoal]);
      setIsAddModalOpen(false);
      reset();
      setSuccess('Objetivo de estudio creado correctamente');
    } catch (err: any) {
      console.error('Error creating goal:', err);
      setError(err.response?.data?.message || 'Error al crear el objetivo de estudio');
    }
  };

  // Add goal to user profile
  const handleAssignGoal = async (goalId: string) => {
    if (!profile) return;
    
    setProcessingGoalId(goalId);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = await PeopleService.addStudyGoal(profile._id, goalId);
      setProfile(updatedProfile);
      
      // Update user goals list
      const goalToAdd = studyGoals.find(goal => goal._id === goalId);
      if (goalToAdd) {
        setUserGoals([...userGoals, goalToAdd]);
      }
      
      setSuccess('Objetivo de estudio agregado a tu perfil');
    } catch (err: any) {
      console.error('Error assigning goal:', err);
      setError(err.response?.data?.message || 'Error al asignar el objetivo de estudio');
    } finally {
      setProcessingGoalId(null);
    }
  };

  // Remove goal from user profile
  const handleRemoveGoal = async (goalId: string) => {
    if (!profile) return;
    
    setProcessingGoalId(goalId);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = await PeopleService.removeStudyGoal(profile._id, goalId);
      setProfile(updatedProfile);
      
      // Update user goals list
      setUserGoals(userGoals.filter(goal => goal._id !== goalId));
      
      setSuccess('Objetivo de estudio eliminado de tu perfil');
    } catch (err: any) {
      console.error('Error removing goal:', err);
      setError(err.response?.data?.message || 'Error al eliminar el objetivo de estudio');
    } finally {
      setProcessingGoalId(null);
    }
  };

  return (
    <DashboardLayout>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Objetivos de Estudio
        </h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Crear Objetivo
        </Button>
      </header>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-3">
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* My Goals */}
          <Card title="Mis Objetivos de Estudio">
            <div className="p-4">
              {userGoals.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No tienes objetivos de estudio asignados. Agrega algunos de la lista disponible.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {userGoals.map((goal) => (
                    <li key={goal._id} className="py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">
                            {goal.name}
                          </h3>
                          {goal.description && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {goal.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveGoal(goal._id)}
                          isLoading={processingGoalId === goal._id}
                          disabled={processingGoalId === goal._id}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          {/* Available Goals */}
          <Card title="Objetivos Disponibles">
            <div className="p-4">
              {studyGoals.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No hay objetivos de estudio disponibles. Crea uno nuevo.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {studyGoals
                    .filter(goal => !userGoals.some(userGoal => userGoal._id === goal._id))
                    .map((goal) => (
                      <li key={goal._id} className="py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">
                              {goal.name}
                            </h3>
                            {goal.description && (
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {goal.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAssignGoal(goal._id)}
                            isLoading={processingGoalId === goal._id}
                            disabled={processingGoalId === goal._id}
                          >
                            Agregar
                          </Button>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Crear Objetivo de Estudio"
        size="md"
      >
        <form onSubmit={handleSubmit(handleAddGoal)} className="space-y-4">
          <Input
            label="Nombre del Objetivo"
            id="name"
            error={errors.name?.message}
            {...register('name', {
              required: 'El nombre del objetivo es requerido',
            })}
          />
          
          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Descripción
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              rows={3}
              {...register('description')}
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
            >
              Crear Objetivo
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}