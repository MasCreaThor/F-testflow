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
  
  export interface AuthResponse {
    user: {
      _id: string;
      email: string;
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