import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { StudyGoal } from '@/types/study-goal.types';

interface StudyGoalCardProps {
  /**
   * Objetivo de estudio a mostrar
   */
  studyGoal: StudyGoal;
  /**
   * Función a ejecutar al editar
   */
  onEdit?: () => void;
  /**
   * Función a ejecutar al eliminar
   */
  onDelete?: () => void;
  /**
   * Si se está procesando alguna acción
   */
  isProcessing?: boolean;
  /**
   * Si la tarjeta es para mostrar en modo de selección
   */
  selectionMode?: boolean;
  /**
   * Si el objetivo está seleccionado (en modo selección)
   */
  isSelected?: boolean;
  /**
   * Función a ejecutar al seleccionar (en modo selección)
   */
  onSelect?: () => void;
}

/**
 * Tarjeta para mostrar información de un objetivo de estudio
 */
const StudyGoalCard: React.FC<StudyGoalCardProps> = ({
  studyGoal,
  onEdit,
  onDelete,
  isProcessing = false,
  selectionMode = false,
  isSelected = false,
  onSelect
}) => {
  const { name, description, category } = studyGoal;
  
  return (
    <Card
      className={`transition-shadow hover:shadow-md ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
      titleClassName="flex justify-between items-center"
      title={
        <div className="truncate pr-2">
          {name}
        </div>
      }
    >
      <div className="p-4">
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {description}
          </p>
        )}
        
        {category && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm inline-flex items-center mb-4">
            <span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span>
            <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
          </div>
        )}
        
        {selectionMode ? (
          <Button
            variant={isSelected ? "primary" : "outline"}
            onClick={onSelect}
            fullWidth
            disabled={isProcessing}
          >
            {isSelected ? "Seleccionado" : "Seleccionar"}
          </Button>
        ) : (
          <div className="flex justify-end space-x-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                disabled={isProcessing}
              >
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={onDelete}
                disabled={isProcessing}
                isLoading={isProcessing}
              >
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StudyGoalCard;