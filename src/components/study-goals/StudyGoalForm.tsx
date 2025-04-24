'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { Category } from '@/types/category.types';
import { StudyGoal, CreateStudyGoalRequest, UpdateStudyGoalRequest } from '@/types/study-goal.types';

interface StudyGoalFormProps {
  /**
   * Si es un formulario de edición, el objetivo a editar
   */
  studyGoal?: StudyGoal;
  /**
   * Lista de categorías disponibles
   */
  categories: Category[];
  /**
   * Función a ejecutar al enviar el formulario
   */
  onSubmit: (data: CreateStudyGoalRequest | UpdateStudyGoalRequest) => Promise<void>;
  /**
   * Función a ejecutar al cancelar
   */
  onCancel: () => void;
  /**
   * Si se está procesando el formulario
   */
  isSubmitting: boolean;
}

/**
 * Formulario para crear o editar objetivos de estudio
 */
const StudyGoalForm: React.FC<StudyGoalFormProps> = ({
  studyGoal,
  categories,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const isEditMode = !!studyGoal;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CreateStudyGoalRequest | UpdateStudyGoalRequest>({
    defaultValues: {
      name: studyGoal?.name || '',
      description: studyGoal?.description || '',
      categoryId: studyGoal?.categoryId || ''
    }
  });
  
  // Si cambia el objetivo, actualizar el formulario
  useEffect(() => {
    if (studyGoal) {
      setValue('name', studyGoal.name);
      setValue('description', studyGoal.description || '');
      setValue('categoryId', studyGoal.categoryId || '');
    } else {
      reset({
        name: '',
        description: '',
        categoryId: ''
      });
    }
  }, [studyGoal, setValue, reset]);
  
  const handleFormSubmit = async (data: CreateStudyGoalRequest | UpdateStudyGoalRequest) => {
    await onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Nombre del Objetivo *"
        id="name"
        error={errors.name?.message}
        {...register('name', {
          required: 'El nombre del objetivo es requerido',
          maxLength: {
            value: 100,
            message: 'El nombre no puede exceder los 100 caracteres'
          }
        })}
      />
      
      <div className="space-y-1">
        <label 
          htmlFor="description" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Descripción
        </label>
        <textarea
          id="description"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          rows={3}
          {...register('description', {
            maxLength: {
              value: 500,
              message: 'La descripción no puede exceder los 500 caracteres'
            }
          })}
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>
      
      <div className="space-y-1">
        <label 
          htmlFor="categoryId" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Categoría
        </label>
        <select
          id="categoryId"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          {...register('categoryId')}
        >
          <option value="">-- Selecciona una categoría --</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.categoryId.message}
          </p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEditMode ? 'Actualizar' : 'Crear'} Objetivo
        </Button>
      </div>
    </form>
  );
};

export default StudyGoalForm;