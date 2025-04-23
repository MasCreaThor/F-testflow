'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterRequest } from '@/types/auth.types';

/**
 * Register form component
 */
const RegisterForm: React.FC = () => {
  const { register: registerUser, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterRequest & { confirmPassword: string }>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    clearError();
    setIsSubmitting(true);
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = data;
    
    try {
      await registerUser(registerData);
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
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nombre"
          id="firstName"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register('firstName', {
            required: 'El nombre es requerido',
          })}
        />
        
        <Input
          label="Apellido"
          id="lastName"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register('lastName', {
            required: 'El apellido es requerido',
          })}
        />
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
      
      <Input
        label="Contraseña"
        type="password"
        id="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password', {
          required: 'La contraseña es requerida',
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
          disabled={isSubmitting}
        >
          Registrarse
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Inicia Sesión
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;