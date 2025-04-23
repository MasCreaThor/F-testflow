// src/utils/token.utils.ts
import Cookies from 'js-cookie';
import { TokenPayload } from '@/types/auth.types';

// Constants
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Cookie options
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const
};

/**
 * Store tokens in cookies and localStorage for redundancy
 */
export const setTokens = (accessToken: string, refreshToken?: string): void => {
  console.log('Guardando tokens en cookies y localStorage');
  
  // Almacenar en cookies
  try {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, COOKIE_OPTIONS);
    
    if (refreshToken) {
      Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
        ...COOKIE_OPTIONS,
        expires: 30 // 30 days for refresh token
      });
    }
    console.log('Tokens guardados en cookies');
  } catch (error) {
    console.error('Error al guardar tokens en cookies:', error);
  }
  
  // Almacenar también en localStorage como respaldo
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    console.log('Tokens guardados en localStorage');
  } catch (error) {
    console.error('Error al guardar tokens en localStorage:', error);
  }
};

/**
 * Get access token from cookie or localStorage
 */
export const getAccessToken = (): string | undefined => {
  // Intentar obtener de cookies primero
  let token = Cookies.get(ACCESS_TOKEN_KEY);
  
  // Si no está en cookies, intentar localStorage
  if (!token) {
    token = localStorage.getItem(ACCESS_TOKEN_KEY) || undefined;
  }
  
  return token;
};

/**
 * Get refresh token from cookie or localStorage
 */
export const getRefreshToken = (): string | undefined => {
  // Intentar obtener de cookies primero
  let token = Cookies.get(REFRESH_TOKEN_KEY);
  
  // Si no está en cookies, intentar localStorage
  if (!token) {
    token = localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;
  }
  
  return token;
};

/**
 * Remove all tokens from cookies and localStorage
 */
export const removeTokens = (): void => {
  // Eliminar de cookies
  try {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
  } catch (error) {
    console.error('Error al eliminar tokens de cookies:', error);
  }
  
  // Eliminar de localStorage
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error al eliminar tokens de localStorage:', error);
  }
};

/**
 * Check if user is authenticated (has valid tokens)
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token && !isTokenExpired(token);
};

/**
 * Parse JWT token and return payload
 */
export const parseToken = (token: string): TokenPayload | null => {
  try {
    // Verificar que el token existe y tiene formato válido
    if (!token || typeof token !== 'string') {
      return null;
    }
    
    // Dividir el token y verificar que tiene al menos 3 partes
    const parts = token.split('.');
    if (parts.length < 3) {
      return null;
    }
    
    const base64Url = parts[1];
    if (!base64Url) {
      return null;
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Invalid token format', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  // Si no hay token, considerar expirado
  if (!token) return true;
  
  const payload = parseToken(token);
  if (!payload) return true;
  
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

/**
 * Get user ID from token
 */
export const getUserIdFromToken = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;
  
  const payload = parseToken(token);
  return payload?.sub || null;
};