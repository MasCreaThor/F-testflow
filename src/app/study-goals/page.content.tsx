'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal/Modal';
import { EmptyState } from '@/components/common';
import { StudyGoalForm, StudyGoalCard } from '@/components/study-goals';
import { Category } from '@/types/category.types';
import { StudyGoal, CreateStudyGoalRequest, UpdateStudyGoalRequest } from '@/types/study-goal.types';
import { CategoryService, StudyGoalService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Página para gestionar objetivos de estudio
 * Versión corregida que respeta la privacidad de los objetivos
 */
export default function StudyGoalsPageContent() {
  const { user } = useAuth();
  const [myStudyGoals, setMyStudyGoals] = useState<StudyGoal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<StudyGoal | null>(null);
  const [processingGoalId, setProcessingGoalId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        setError(null);

        // Obtener categorías
        const categoriesData = await CategoryService.getAllCategories();
        setCategories(categoriesData);

        // Obtener los objetivos de estudio del usuario actual
        const userGoals = await StudyGoalService.getMyStudyGoals();
        setMyStudyGoals(userGoals);
      } catch (err: any) {
        console.error('Error al cargar datos:', err);
        setError(err.message || 'Error al cargar datos. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filtrar objetivos por categoría
  const filteredStudyGoals = categoryFilter 
    ? myStudyGoals.filter(goal => goal.categoryId === categoryFilter)
    : myStudyGoals;

  // Abrir modal para crear nuevo objetivo
  const handleOpenCreateModal = () => {
    setSelectedGoal(null);
    setIsFormModalOpen(true);
  };

  // Abrir modal para editar objetivo
  const handleOpenEditModal = (goal: StudyGoal) => {
    setSelectedGoal(goal);
    setIsFormModalOpen(true);
  };

  // Confirmar eliminación de objetivo
  const handleConfirmDelete = (goal: StudyGoal) => {
    setSelectedGoal(goal);
    setIsDeleteModalOpen(true);
  };

  // Crear o actualizar objetivo
  const handleSubmitForm = async (data: CreateStudyGoalRequest | UpdateStudyGoalRequest) => {
    setIsSubmitting(true);
    try {
      setError(null);
      setSuccess(null);

      if (selectedGoal) {
        // Actualizar objetivo existente
        const updatedGoal = await StudyGoalService.updateStudyGoal(selectedGoal._id, data);
        setMyStudyGoals(prevGoals => 
          prevGoals.map(goal => goal._id === updatedGoal._id ? updatedGoal : goal)
        );
        setSuccess('Objetivo actualizado correctamente');
      } else {
        // Crear nuevo objetivo
        const newGoal = await StudyGoalService.createStudyGoal(data);
        setMyStudyGoals(prevGoals => [...prevGoals, newGoal]);
        setSuccess('Objetivo creado correctamente');
      }

      setIsFormModalOpen(false);
    } catch (err: any) {
      console.error('Error al guardar objetivo:', err);
      setError(err.message || 'Error al guardar objetivo. Intenta de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar objetivo
  const handleDeleteGoal = async () => {
    if (!selectedGoal) return;
    
    try {
      setProcessingGoalId(selectedGoal._id);
      setError(null);
      setSuccess(null);

      await StudyGoalService.deleteStudyGoal(selectedGoal._id);
      
      // Eliminar de la lista de objetivos
      setMyStudyGoals(prevGoals => prevGoals.filter(goal => goal._id !== selectedGoal._id));
      
      setSuccess('Objetivo eliminado correctamente');
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error('Error al eliminar objetivo:', err);
      setError(err.message || 'Error al eliminar objetivo. Intenta de nuevo más tarde.');
    } finally {
      setProcessingGoalId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Mis Objetivos de Estudio
          </h1>
          <Button onClick={handleOpenCreateModal}>
            Crear Nuevo Objetivo
          </Button>
        </div>

        {/* Mensajes de error/éxito */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-3">
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        {loading ? (
          // Estado de carga
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filtro por categoría */}
            <Card title="Filtrar Objetivos">
              <div className="p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-1/2">
                    <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Filtrar por categoría
                    </label>
                    <select
                      id="categoryFilter"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full sm:w-1/2 flex justify-end items-end">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {filteredStudyGoals.length} objetivo(s) encontrado(s)
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Lista de Objetivos */}
            <Card title="Mis Objetivos">
              <div className="p-4">
                {filteredStudyGoals.length === 0 ? (
                  <EmptyState
                    title={categoryFilter ? "No hay objetivos en esta categoría" : "No tienes objetivos de estudio"}
                    description={categoryFilter 
                      ? "No has creado objetivos de estudio en esta categoría." 
                      : "Crea tu primer objetivo de estudio para comenzar a organizar tu aprendizaje."}
                    actionText="Crear Objetivo"
                    onAction={handleOpenCreateModal}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudyGoals.map((goal) => (
                      <StudyGoalCard
                        key={goal._id}
                        studyGoal={goal}
                        onEdit={() => handleOpenEditModal(goal)}
                        onDelete={() => handleConfirmDelete(goal)}
                        isProcessing={processingGoalId === goal._id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Modal para crear/editar objetivo */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedGoal ? "Editar Objetivo de Estudio" : "Crear Objetivo de Estudio"}
        size="md"
      >
        <StudyGoalForm
          studyGoal={selectedGoal || undefined}
          categories={categories}
          onSubmit={handleSubmitForm}
          onCancel={() => setIsFormModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            ¿Estás seguro de que deseas eliminar el objetivo <strong>{selectedGoal?.name}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={processingGoalId !== null}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteGoal}
              isLoading={processingGoalId === selectedGoal?._id}
              disabled={processingGoalId !== null}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}