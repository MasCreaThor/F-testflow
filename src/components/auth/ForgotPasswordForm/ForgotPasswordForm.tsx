'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import AuthService from '@/services/auth.service';
import { ForgotPasswordRequest } from '@/types/auth.types';

/**
 * Forgot password form component
 */
const ForgotPasswordForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordRequest>({
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = async (data: ForgotPasswordRequest) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      const response = await AuthService.requestPasswordReset(data);
      setSuccess(response.message || 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.');
      reset(); // Clear form
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'
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
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>
      
      <Input
        label="Email"
        type="email"
        id="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email', {
          required: 'El email es requerido',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido',
          },
        })}
      />
      
      <div>
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Enviar Email de Recuperación
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

export default ForgotPasswordForm;