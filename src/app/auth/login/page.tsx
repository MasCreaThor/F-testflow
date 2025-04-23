'use client';

import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout/AuthLayout';
import LoginForm from '@/components/auth/LoginForm/LoginForm';

/**
 * Login page
 */
export default function LoginPage() {
  return (
    <AuthLayout 
      title="Bienvenido a TestFlow" 
      subtitle="Inicia sesión para continuar"
    >
      <LoginForm />
    </AuthLayout>
  );
}