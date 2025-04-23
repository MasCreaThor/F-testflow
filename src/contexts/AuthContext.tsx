'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/types/auth.types';
import { User } from '@/types/user.types';
import { isAuthenticated, getAccessToken, getRefreshToken, getUserIdFromToken } from '@/utils/token.utils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoggedIn: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  error: null,
  clearError: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is authenticated
        if (isAuthenticated()) {
          // Attempt to get user data
          const userId = getUserIdFromToken();
          if (userId) {
            // For simplicity, we'll just use the token data for now
            // In a real app, you might want to fetch the full user profile
            setUser({
              _id: userId,
              email: '', // We don't have the email in the token payload in this example
            });
          }
        }
      } catch (err) {
        console.error('Authentication initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user with email and password
   */
  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login(data);
      
      // Verificar que la respuesta tiene la estructura esperada
      if (response && response.user && response.user._id) {
        setUser({
          _id: response.user._id,
          email: response.user.email,
        });
        router.push('/dashboard');
      } else {
        // Si la respuesta no tiene la estructura esperada, establecer un error
        console.error('Respuesta inesperada del servidor:', response);
        setError('Error en la respuesta del servidor');
      }
    } catch (err: any) {
      console.error('Login error details:', err);
      
      // Manejo mejorado de errores
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango de 2xx
        const serverError = err.response.data?.message || 'Error en el servidor';
        setError(serverError);
        console.error('Error de respuesta del servidor:', err.response.data);
      } else if (err.request) {
        // La solicitud se hizo pero no se recibió respuesta
        setError('No se pudo conectar con el servidor');
        console.error('No se recibió respuesta:', err.request);
      } else {
        // Algo sucedió al configurar la solicitud que desencadenó un error
        setError(err.message || 'Error al iniciar sesión');
        console.error('Error al configurar la solicitud:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.register(data);
      
      // Verificar que la respuesta tiene la estructura esperada
      if (response && response.user && response.user._id) {
        setUser({
          _id: response.user._id,
          email: response.user.email,
        });
        router.push('/dashboard');
      } else {
        // Si la respuesta no tiene la estructura esperada, establecer un error
        console.error('Respuesta inesperada del servidor:', response);
        setError('Error en la respuesta del servidor');
      }
    } catch (err: any) {
      console.error('Register error details:', err);
      
      // Manejo mejorado de errores
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango de 2xx
        const serverError = err.response.data?.message || 'Error en el servidor';
        setError(serverError);
        console.error('Error de respuesta del servidor:', err.response.data);
      } else if (err.request) {
        // La solicitud se hizo pero no se recibió respuesta
        setError('No se pudo conectar con el servidor');
        console.error('No se recibió respuesta:', err.request);
      } else {
        // Algo sucedió al configurar la solicitud que desencadenó un error
        setError(err.message || 'Error al registrarse');
        console.error('Error al configurar la solicitud:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setLoading(true);
    
    try {
      await AuthService.logout();
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);