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
  // Verificar si hay token al cargar
useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('=== INICIALIZANDO CONTEXTO DE AUTENTICACIÓN ===');
        // Verificar tokens directamente en localStorage
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        console.log('Token de acceso disponible:', !!accessToken);
        console.log('Token de refresco disponible:', !!refreshToken);
        
        // Comprobar si el usuario está autenticado
        if (isAuthenticated()) {
          console.log('Usuario autenticado según isAuthenticated()');
          
          // Obtener ID de usuario directamente del token
          const userId = getUserIdFromToken();
          console.log('ID de usuario extraído del token:', userId);
          
          if (userId) {
            console.log('Estableciendo usuario en el contexto con ID:', userId);
            
            // Vamos a establecer el usuario con la información mínima
            setUser({
              _id: userId,
              email: '', // No tenemos el email en el token, pero no es crítico
            });
            
            console.log('Usuario establecido en el contexto');
          } else {
            console.log('No se pudo extraer ID de usuario del token');
          }
        } else {
          console.log('Usuario no autenticado');
        }
        
        console.log('=== FIN INICIALIZACIÓN CONTEXTO DE AUTENTICACIÓN ===');
      } catch (err) {
        console.error('Error en la inicialización de autenticación:', err);
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
      console.log('AuthContext: Iniciando login con', { email: data.email });
      
      const response = await AuthService.login(data);
      console.log('AuthContext: Respuesta de login recibida', response);
      
      if (!response) {
        console.error('AuthContext: No se recibió respuesta del servicio de login');
        setError('Error de comunicación con el servidor');
        setLoading(false);
        return;
      }
      
      // Log completo de la respuesta para depuración
      console.log('AuthContext: Respuesta completa', JSON.stringify(response));
      
      // Verificar cada propiedad necesaria
      if (!response.accessToken) {
        console.error('AuthContext: Token de acceso no encontrado en la respuesta', response);
        setError('Error en la respuesta del servidor: token de acceso no encontrado');
        setLoading(false);
        return;
      }
      
      if (!response.user) {
        console.error('AuthContext: Información de usuario no encontrada en la respuesta', response);
        setError('Error en la respuesta del servidor: información de usuario no encontrada');
        setLoading(false);
        return;
      }
      
      if (!response.user._id) {
        console.error('AuthContext: ID de usuario no encontrado en la respuesta', response.user);
        setError('Error en la respuesta del servidor: ID de usuario no encontrado');
        setLoading(false);
        return;
      }
      
      // Establecer usuario en el contexto
      setUser({
        _id: String(response.user._id),
        email: response.user.email,
      });
      
      console.log('AuthContext: Usuario establecido correctamente', {
        _id: response.user._id,
        email: response.user.email,
      });
      
      // Navegar al dashboard
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('AuthContext: Error en login', error);
      
      let errorMessage = 'Error al iniciar sesión';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
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