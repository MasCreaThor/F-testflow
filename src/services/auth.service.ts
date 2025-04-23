// src/services/auth.service.ts - ARCHIVO COMPLETO CORREGIDO
import axios, { AxiosError } from 'axios';
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
      console.log('=== INICIO DE DEPURACIÓN EXTENDIDA ===');
      console.log('Datos de login:', { email: data.email, passwordLength: data.password?.length });
      
      // 1. Configuración básica
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      console.log('URL de la API:', apiUrl);
      
      // 2. Construir la URL y los datos
      const url = `${apiUrl}/auth/login`;
      const bodyData = JSON.stringify(data);
      console.log('URL completa:', url);
      console.log('Datos a enviar:', bodyData);
      
      // 3. Configurar opciones de fetch con todos los detalles
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: bodyData,
        mode: 'cors' as RequestMode,
        credentials: 'include' as RequestCredentials,
      };
      console.log('Opciones de fetch:', fetchOptions);
      
      // 4. Realizar la solicitud
      console.log('Realizando solicitud fetch...');
      const response = await fetch(url, fetchOptions);
      
      // 5. Verificar la respuesta HTTP
      console.log('Estado HTTP:', response.status);
      console.log('Headers recibidos:', {
        contentType: response.headers.get('Content-Type'),
        contentLength: response.headers.get('Content-Length')
      });
      
      // Si el estado no es 2xx, hay un error
      if (!response.ok) {
        console.error('Error HTTP:', response.status, response.statusText);
        
        // Intentar obtener detalles del error
        let errorData;
        try {
          const errorText = await response.text();
          console.error('Respuesta de error:', errorText);
          
          try {
            errorData = JSON.parse(errorText);
            console.error('Error parseado:', errorData);
          } catch (parseError) {
            console.error('No se pudo parsear el error como JSON');
            errorData = { message: errorText };
          }
        } catch (readError) {
          console.error('No se pudo leer la respuesta de error:', readError);
          errorData = { message: 'Error desconocido' };
        }
        
        throw new Error(errorData?.message || `Error HTTP: ${response.status}`);
      }
      
      // 6. Leer la respuesta como texto primero para depuración
      let responseText;
      try {
        responseText = await response.text();
        console.log('Respuesta como texto:', responseText);
        console.log('Longitud del texto:', responseText.length);
      } catch (textError) {
        console.error('Error al leer la respuesta como texto:', textError);
        throw new Error('Error al leer la respuesta del servidor');
      }
      
      // 7. Verificar si hay contenido en la respuesta
      if (!responseText || responseText.trim() === '') {
        console.error('Respuesta vacía recibida');
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      // 8. Convertir a JSON con manejo de errores más detallado
      let responseData; // Cambiado de const a let para permitir reasignación
      try {
        // Trim para eliminar posibles espacios o caracteres BOM al inicio
        const trimmedText = responseText.trim();
        
        // Verificar si parece JSON válido
        if (!trimmedText.startsWith('{') && !trimmedText.startsWith('[')) {
          console.error('La respuesta no parece ser JSON válido');
          throw new Error('Formato de respuesta inválido');
        }
        
        responseData = JSON.parse(trimmedText);
        console.log('Respuesta JSON parseada correctamente:', responseData);
        console.log('Tipo de responseData:', typeof responseData);
        console.log('Propiedades en level-1:', Object.keys(responseData));
      } catch (jsonError) {
        console.error('Error al parsear JSON:', jsonError);
        throw new Error('Error al procesar la respuesta del servidor: formato inválido');
      }
      
      // 9. Validación más detallada de la estructura
      console.log('Validando estructura de la respuesta...');
      
      // Validar si la respuesta es la estructura esperada con data anidado
      if (responseData.data && typeof responseData.data === 'object') {
        console.log('Se detectó estructura con "data" anidado, extrayendo contenido...');
        responseData = responseData.data;
        console.log('Datos extraídos de data:', responseData);
      }
      
      // Verificar token de acceso
      if (!responseData.accessToken) {
        console.error('No se encontró accessToken en la respuesta');
        console.log('Estructura de respuesta recibida:', JSON.stringify(responseData, null, 2));
        
        // Buscar el token en otras ubicaciones posibles (respuesta anidada)
        if (responseData.response && responseData.response.accessToken) {
          console.log('Token encontrado en responseData.response');
          responseData = responseData.response;
        } else if (responseData.result && responseData.result.accessToken) {
          console.log('Token encontrado en responseData.result');
          responseData = responseData.result;
        } else if (responseData.user && responseData.token) {
          // Formato alternativo posible
          console.log('Formato alternativo detectado (user + token)');
          responseData = {
            user: responseData.user,
            accessToken: responseData.token,
            refreshToken: responseData.refreshToken
          };
        } else {
          throw new Error('Token de acceso no encontrado en la respuesta');
        }
      }
      
      // Verificar datos de usuario
      if (!responseData.user || !responseData.user._id) {
        console.error('Información de usuario incompleta en la respuesta');
        throw new Error('Información de usuario incompleta en la respuesta');
      }
      
      // 10. Construir respuesta validada
      const validatedResponse: AuthResponse = {
        user: {
          _id: String(responseData.user._id),
          email: responseData.user.email
        },
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken
      };
      
      // 11. Guardar tokens
      try {
        localStorage.setItem('accessToken', validatedResponse.accessToken);
        if (validatedResponse.refreshToken) {
          localStorage.setItem('refreshToken', validatedResponse.refreshToken);
        }
        console.log('Tokens guardados correctamente en localStorage');
      } catch (storageError) {
        console.error('Error al guardar tokens en localStorage:', storageError);
      }
      
      console.log('Login completado exitosamente');
      console.log('=== FIN DE DEPURACIÓN EXTENDIDA ===');
      
      return validatedResponse;
    } catch (error: unknown) {
      console.error('=== ERROR EN LOGIN ===', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Error desconocido durante el inicio de sesión');
      }
    }
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      console.log('Intentando registro con:', { email: data.email });
      
      // 1. Configuración básica
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // 2. Construir la URL y los datos
      const url = `${apiUrl}/auth/register`;
      const bodyData = JSON.stringify(data);
      
      // 3. Configurar opciones de fetch
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: bodyData,
        mode: 'cors' as RequestMode,
        credentials: 'include' as RequestCredentials,
      };
      
      // 4. Realizar la solicitud
      const response = await fetch(url, fetchOptions);
      
      // 5. Verificar la respuesta HTTP
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData?.message || `Error HTTP: ${response.status}`);
      }
      
      // 6. Leer la respuesta como texto primero
      const responseText = await response.text();
      
      // 7. Verificar si hay contenido
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      // 8. Convertir a JSON
      let responseData = JSON.parse(responseText.trim()); // Cambiado de const a let
      
      // 9. Validar si la respuesta tiene estructura anidada
      if (responseData.data && typeof responseData.data === 'object') {
        responseData = responseData.data;
      }
      
      // 10. Verificar tokens y datos de usuario
      if (!responseData.accessToken) {
        if (responseData.response && responseData.response.accessToken) {
          responseData = responseData.response;
        } else if (responseData.result && responseData.result.accessToken) {
          responseData = responseData.result;
        } else if (responseData.user && responseData.token) {
          responseData = {
            user: responseData.user,
            accessToken: responseData.token,
            refreshToken: responseData.refreshToken
          };
        } else {
          throw new Error('Token de acceso no encontrado en la respuesta');
        }
      }
      
      if (!responseData.user || !responseData.user._id) {
        throw new Error('Información de usuario incompleta en la respuesta');
      }
      
      // 11. Construir respuesta validada
      const validatedResponse: AuthResponse = {
        user: {
          _id: String(responseData.user._id),
          email: responseData.user.email
        },
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken
      };
      
      // 12. Guardar tokens
      try {
        localStorage.setItem('accessToken', validatedResponse.accessToken);
        if (validatedResponse.refreshToken) {
          localStorage.setItem('refreshToken', validatedResponse.refreshToken);
        }
      } catch (storageError) {
        console.error('Error al guardar tokens en localStorage:', storageError);
      }
      
      return validatedResponse;
    } catch (error: unknown) {
      console.error('Error detallado en registro:', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Error desconocido durante el registro');
      }
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
      try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } catch (storageError) {
        console.error('Error al eliminar tokens de localStorage:', storageError);
      }
      
      removeTokens();
    } catch (error: unknown) {
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/auth/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData?.message || `Error HTTP: ${response.status}`);
      }
      
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      return JSON.parse(responseText);
    } catch (error: unknown) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Error al solicitar restablecimiento de contraseña');
      }
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData?.message || `Error HTTP: ${response.status}`);
      }
      
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      return JSON.parse(responseText);
    } catch (error: unknown) {
      console.error('Error al restablecer contraseña:', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Error al restablecer contraseña');
      }
    }
  },

  /**
   * Change password (authenticated)
   */
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await fetch(`${apiUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData?.message || `Error HTTP: ${response.status}`);
      }
      
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      return JSON.parse(responseText);
    } catch (error: unknown) {
      console.error('Error al cambiar contraseña:', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Error al cambiar contraseña');
      }
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData?.message || `Error HTTP: ${response.status}`);
      }
      
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      let responseData = JSON.parse(responseText); // Cambiado de const a let
      
      // Verificar tokens y datos de usuario
      if (!responseData.accessToken || !responseData.user) {
        if (responseData.data && typeof responseData.data === 'object') {
          const data = responseData.data;
          if (data.accessToken && data.user) {
            responseData = data; // Aquí estaba el error, intentando reasignar una constante
          }
        }
        
        if (!responseData.accessToken || !responseData.user) {
          throw new Error('Respuesta incompleta del servidor');
        }
      }
      
      // Guardar los nuevos tokens
      try {
        localStorage.setItem('accessToken', responseData.accessToken);
        if (responseData.refreshToken) {
          localStorage.setItem('refreshToken', responseData.refreshToken);
        }
      } catch (storageError) {
        console.error('Error al guardar tokens en localStorage:', storageError);
      }
      
      return responseData;
    } catch (error: unknown) {
      console.error('Error al refrescar token:', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Error al refrescar token');
      }
    }
  }
};

export default AuthService;