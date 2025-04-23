import api from './api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  RefreshTokenRequest
} from '@/types/auth.types';
import { setTokens, removeTokens } from '@/utils/token.utils';

/**
 * Authentication service that handles all authentication related API calls
 */
const AuthService = {
  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      
      // Verificar que la respuesta tiene los datos esperados
      if (response.data && response.data.accessToken) {
        // Guardar tokens
        setTokens(
          response.data.accessToken, 
          response.data.refreshToken
        );
        
        return response.data;
      } else {
        console.error('Respuesta incompleta:', response.data);
        throw new Error('Respuesta incompleta del servidor');
      }
    } catch (error) {
      console.error('Error detallado en login:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      
      // Verificar que la respuesta tiene los datos esperados
      if (response.data && response.data.accessToken) {
        // Guardar tokens
        setTokens(
          response.data.accessToken, 
          response.data.refreshToken
        );
        
        return response.data;
      } else {
        console.error('Respuesta incompleta:', response.data);
        throw new Error('Respuesta incompleta del servidor');
      }
    } catch (error) {
      console.error('Error detallado en registro:', error);
      throw error;
    }
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    try {
      // Call backend logout endpoint if needed
      // await api.post('/auth/logout');
      
      // Remove tokens from storage
      removeTokens();
    } catch (error) {
      console.error('Error en logout:', error);
      // Incluso si hay un error, remover los tokens localmente
      removeTokens();
      throw error;
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    try {
      const response = await api.post<{ message: string }>('/auth/request-password-reset', data);
      return response.data;
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    try {
      const response = await api.post<{ message: string }>('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      throw error;
    }
  },

  /**
   * Change password (authenticated)
   */
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    try {
      const response = await api.post<{ message: string }>('/auth/change-password', data);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh-token', data);
      
      if (response.data && response.data.accessToken) {
        setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data;
      } else {
        console.error('Respuesta incompleta en refresh token:', response.data);
        throw new Error('Respuesta incompleta del servidor');
      }
    } catch (error) {
      console.error('Error al refrescar token:', error);
      throw error;
    }
  }
};

export default AuthService;