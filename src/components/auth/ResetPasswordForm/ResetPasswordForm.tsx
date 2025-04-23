'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import AuthService from '@/services/auth.service';
import { ResetPasswordRequest } from '@/types/auth.types';

interface ResetPasswordFormProps {
  token: string;
}

/**
 * Reset password form component
 */
const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ newPassword: string; confirmPassword: string }>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const password = watch('newPassword');
  
  const onSubmit = async (data: { newPassword: string; confirmPassword: string }) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    // Create request object
    const resetRequest: ResetPasswordRequest = {
      token,
      newPassword: data.newPassword,
    };
    
    try {
      const response = await AuthService.resetPassword(resetRequest);
      setSuccess(response.message || 'Contraseña actualizada exitosamente.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Ha ocurrido un error al restablecer la contraseña. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-3 mb-6">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-3 mb-6">
          <p className="text-sm text-green-600 dark:text-green-400">
            {success} Redirigiendo al inicio de sesión...
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Crea una nueva contraseña segura para tu cuenta.
        </p>
      </div>
      
      <Input
        label="Nueva Contraseña"
        type="password"
        id="newPassword"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register('newPassword', {
          required: 'La nueva contraseña es requerida',
          minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres',
          },
        })}
      />
      
      <Input
        label="Confirmar Contraseña"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'La confirmación de contraseña es requerida',
          validate: (value) =>
            value === password || 'Las contraseñas no coinciden',
        })}
      />
      
      <div>
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting || !!success}
        >
          Restablecer Contraseña
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Recordaste tu contraseña?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Volver al Inicio de Sesión
          </Link>
        </p>
      </div>
    </form>
  );
};

export default ResetPasswordForm;