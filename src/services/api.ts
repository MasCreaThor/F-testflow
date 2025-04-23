// src/services/api.ts - Versión corregida
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from '@/utils/token.utils';
import { RefreshTokenRequest, AuthResponse } from '@/types/auth.types';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // Añadido explícitamente header de aceptación
  },
  // Timeout después de 15 segundos (aumentado para dar más tiempo)
  timeout: 15000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Obtener el token de acceso
    const token = getAccessToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Registrar la solicitud para depuración
    console.log(`Realizando solicitud a: ${config.url}`, config);
    
    return config;
  },
  (error) => {
    console.error('Error en la configuración de la solicitud:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  // Manejador de respuestas exitosas
  (response: AxiosResponse) => {
    // Registrar la respuesta para depuración
    console.log(`Respuesta recibida de: ${response.config.url}`, response.data);
    
    // Verificar que la respuesta tenga datos
    if (!response.data) {
      console.error('Respuesta sin datos:', response);
      throw new Error('Respuesta sin datos del servidor');
    }
    
    return response;
  },
  // Manejador de errores
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Verificar si la solicitud no está definida
    if (!originalRequest) {
      console.error('Error de solicitud no definida:', error);
      return Promise.reject(error);
    }
    
    // Registrar el error para depuración
    console.error(`Error en la solicitud a: ${originalRequest.url}`, error);
    
    // Verificar si la respuesta contiene un mensaje de error del servidor
    if (error.response?.data) {
      console.error('Mensaje de error del servidor:', error.response.data);
    }
    
    // Si error es 401 y no already retrying y tenemos refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;
      
      try {
        console.log('Intentando refrescar el token...');
        
        // Obtener el refresh token
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          console.error('No hay refresh token disponible');
          throw new Error('No refresh token available');
        }
        
        // Crear el objeto de solicitud de refresh
        const refreshRequest: RefreshTokenRequest = {
          refreshToken
        };
        
        // Llamar al endpoint de refresh directamente (sin usar la instancia interceptada)
        const response = await axios.post<AuthResponse>(
          `${API_URL}/auth/refresh-token`,
          refreshRequest,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          }
        );
        
        // Registrar respuesta completa para depuración
        console.log('Respuesta completa de refresh token:', response);
        
        // Verificar si la respuesta contiene los datos necesarios
        if (!response.data || !response.data.accessToken) {
          console.error('Respuesta de refresh inválida:', response.data);
          throw new Error('Invalid refresh response');
        }
        
        console.log('Token refrescado exitosamente');
        
        // Almacenar los nuevos tokens
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        setTokens(accessToken, newRefreshToken);
        
        // Reintentar la solicitud original con el nuevo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Error al refrescar el token:', refreshError);
        
        // Si falla el refresh, limpiar tokens y dejar que la app maneje la redirección al login
        removeTokens();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;