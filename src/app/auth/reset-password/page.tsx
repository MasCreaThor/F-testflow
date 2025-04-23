'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout/AuthLayout';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm/ResetPasswordForm';
import Card from '@/components/ui/Card/Card';
import Link from 'next/link';

/**
 * Reset password page - Procesando token desde URL
 */
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  // Registrar información de depuración si se recibe un token
  useEffect(() => {
    if (token) {
      console.log('Token de restablecimiento recibido en URL');
    } else {
      console.log('No se encontró token en los parámetros de URL');
    }
  }, [token]);
  
  // Check if token exists in URL
  if (!token) {
    return (
      <AuthLayout 
        title="Error al restablecer contraseña" 
        subtitle="El enlace no es válido o ha expirado"
      >
        <Card>
          <div className="text-center p-4">
            <div className="text-red-500 mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 mx-auto" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Enlace inválido o expirado
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              El enlace para restablecer la contraseña es inválido o ha expirado.
              Por favor, solicita un nuevo enlace de restablecimiento.
            </p>
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        </Card>
      </AuthLayout>
    );
  }
  
  return (
    <AuthLayout 
      title="Restablecer contraseña" 
      subtitle="Crea una nueva contraseña para tu cuenta"
    >
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}