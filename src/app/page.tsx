'use client';

import React from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout/MainLayout';
import Button from '@/components/ui/Button/Button';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Home page - Landing page for the application
 */
export default function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Bienvenido a</span>
              <span className="block text-primary-600">TestFlow</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Plataforma para la gestión de aprendizaje y evaluación de conocimientos,
              permitiendo a los usuarios establecer objetivos de estudio y seguir su progreso.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              {!isLoggedIn ? (
                <>
                  <div className="rounded-md shadow">
                    <Link href="/auth/register">
                      <Button size="lg" className="w-full">
                        Comenzar ahora
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link href="/auth/login">
                      <Button variant="outline" size="lg" className="w-full">
                        Iniciar sesión
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="rounded-md shadow">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full">
                      Ir a mi espacio de estudio
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Características</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Una mejor forma de aprender
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              TestFlow ofrece herramientas poderosas para gestionar tu aprendizaje y evaluar tus conocimientos.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Objetivos de Estudio</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Define tus metas de aprendizaje y haz un seguimiento de tu progreso con nuestro sistema de objetivos.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Evaluaciones Personalizadas</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Crea evaluaciones a medida para validar tus conocimientos y mejorar tu rendimiento.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Seguimiento de Progreso</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Visualiza tu progreso con estadísticas detalladas y gráficos intuitivos.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Colaboración</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Comparte objetivos y evaluaciones con otros usuarios para un aprendizaje colaborativo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">¿Listo para comenzar?</span>
            <span className="block text-primary-300">
              {isLoggedIn ? 'Sigue mejorando tu aprendizaje.' : 'Regístrate hoy y mejora tu aprendizaje.'}
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            {!isLoggedIn ? (
              <>
                <div className="inline-flex rounded-md shadow">
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                      Comenzar ahora
                    </Button>
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <Link href="/auth/login">
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-primary-600">
                      Iniciar sesión
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="inline-flex rounded-md shadow">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                    Mi espacio de estudio
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}