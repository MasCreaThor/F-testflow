import React, { ReactNode } from 'react';
import Button from '@/components/ui/Button/Button';

interface EmptyStateProps {
  /**
   * Título del estado vacío
   */
  title: string;
  /**
   * Descripción del estado vacío
   */
  description: string;
  /**
   * Texto del botón de acción
   */
  actionText?: string;
  /**
   * Función a ejecutar al hacer clic en el botón
   */
  onAction?: () => void;
  /**
   * Ícono a mostrar (elemento SVG o similar)
   */
  icon?: ReactNode;
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente para mostrar un estado vacío en listas
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-gray-400 dark:text-gray-600">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>
      
      {actionText && onAction && (
        <Button onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;