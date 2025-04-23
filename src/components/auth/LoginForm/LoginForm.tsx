'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { useAuth } from '@/contexts/AuthContext';
import { LoginRequest } from '@/types/auth.types';

/**
 * Login form component
 */
const LoginForm: React.FC = () => {
  const { login, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginRequest) => {
    clearError();
    setIsSubmitting(true);
    
    try {
      await login(data);
    } catch (err) {
      // Error is handled by the auth context
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
      
      <Input
        label="Contraseña"
        type="password"
        id="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password', {
          required: 'La contraseña es requerida',
          minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres',
          },
        })}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
          >
            Recordarme
          </label>
        </div>
        
        <div className="text-sm">
          <Link
            href="/auth/forgot-password"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
      
      <div>
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Iniciar Sesión
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;