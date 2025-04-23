// src/types/auth.types.ts - Versión actualizada
export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
  
  export interface ForgotPasswordRequest {
    email: string;
  }
  
  export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
  }
  
  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }
  
  export interface RefreshTokenRequest {
    refreshToken: string;
  }
  
  // Actualizado para ser más preciso con las propiedades
  export interface AuthResponse {
    user: {
      _id: string;
      email: string;
      // Otras propiedades opcionales que podrían venir del servidor
      lastLogin?: string | Date;
      createdAt?: string | Date;
      updatedAt?: string | Date;
    };
    accessToken: string;
    refreshToken?: string;
  }
  
  export interface TokenPayload {
    sub: string; // userId
    email: string;
    iat: number; // issued at
    exp: number; // expiration
  }