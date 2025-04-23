'use client';

import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout/AuthLayout';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm/ForgotPasswordForm';

/**
 * Forgot password page
 */
export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Recuperar contraseña" 
      subtitle="Te enviaremos un enlace para restablecer tu contraseña"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}