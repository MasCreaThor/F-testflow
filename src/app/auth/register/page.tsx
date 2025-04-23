'use client';

import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm/RegisterForm';

/**
 * Register page
 */
export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Crear cuenta" 
      subtitle="Regístrate para comenzar"
    >
      <RegisterForm />
    </AuthLayout>
  );
}