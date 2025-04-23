// src/services/people.service.ts - ARCHIVO COMPLETO MEJORADO
import { People, CreatePeopleRequest, UpdatePeopleRequest } from '@/types/people.types';

/**
 * People service that handles all people related API calls
 */
const PeopleService = {
  /**
   * Get all people
   */
  getAllPeople: async (): Promise<People[]> => {
    try {
      console.log('Obteniendo todas las personas');
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('No hay token de acceso disponible');
        throw new Error('No hay token de acceso disponible');
      }
      
      const response = await fetch(`${apiUrl}/people`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al obtener personas:', response.status, errorText);
        throw new Error(`Error al obtener personas: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Respuesta del servidor (getAllPeople):', responseText);
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      // Intentar parsear la respuesta
      let responseData = JSON.parse(responseText);
      
      // Verificar si la respuesta tiene un formato anidado
      if (responseData.data && Array.isArray(responseData.data)) {
        console.log('Formato de respuesta anidada detectado, extrayendo data');
        responseData = responseData.data;
      }
      
      // Verificar que sea un array
      if (!Array.isArray(responseData)) {
        console.error('La respuesta no es un array:', responseData);
        throw new Error('Formato de respuesta inesperado');
      }
      
      console.log(`Se obtuvieron ${responseData.length} personas`);
      return responseData;
    } catch (error) {
      console.error('Error en getAllPeople:', error);
      throw error;
    }
  },

  /**
   * Get person by ID
   */
  getPeopleById: async (id: string): Promise<People> => {
    try {
      console.log(`Obteniendo persona con ID: ${id}`);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('No hay token de acceso disponible');
        throw new Error('No hay token de acceso disponible');
      }
      
      const response = await fetch(`${apiUrl}/people/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al obtener persona por ID:', response.status, errorText);
        throw new Error(`Error al obtener persona: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Respuesta del servidor (getPeopleById):', responseText);
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      // Intentar parsear la respuesta
      let responseData = JSON.parse(responseText);
      
      // Verificar si la respuesta tiene un formato anidado
      if (responseData.data && typeof responseData.data === 'object') {
        console.log('Formato de respuesta anidada detectado, extrayendo data');
        responseData = responseData.data;
      }
      
      console.log('Datos de persona obtenidos:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error en getPeopleById:', error);
      throw error;
    }
  },

  /**
   * Get person by user ID - MÉTODO MEJORADO
   */
  getPeopleByUserId: async (userId: string): Promise<People> => {
    try {
      console.log(`=== INICIO: Obteniendo persona para usuario con ID: ${userId} ===`);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');
      
      console.log('URL de API:', apiUrl);
      console.log('Token disponible:', !!accessToken);
      
      if (!accessToken) {
        console.error('No hay token de acceso disponible');
        throw new Error('No hay token de acceso disponible');
      }
      
      console.log(`Haciendo solicitud a: ${apiUrl}/people/user/${userId}`);
      const response = await fetch(`${apiUrl}/people/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      console.log('Estado de respuesta:', response.status);
      console.log('Headers recibidos:', {
        contentType: response.headers.get('Content-Type'),
        contentLength: response.headers.get('Content-Length')
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al obtener persona por user ID:', response.status, errorText);
        throw new Error(`Error al obtener perfil: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Respuesta como texto:', responseText);
      console.log('Longitud de texto:', responseText.length);
      
      if (!responseText || responseText.trim() === '') {
        console.error('Respuesta vacía recibida');
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      // Convertir a JSON con manejo de errores más detallado
      let responseData;
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
      
      // Verificar si la respuesta tiene un formato anidado con data
      if (responseData.data && typeof responseData.data === 'object') {
        console.log('Se detectó estructura con "data" anidado, extrayendo contenido...');
        responseData = responseData.data;
        console.log('Datos extraídos de data:', responseData);
      }
      
      // Validar la estructura básica que esperamos de People
      if (!responseData._id || !responseData.firstName || !responseData.lastName) {
        console.error('Datos de perfil incompletos en la respuesta:', responseData);
        throw new Error('Datos de perfil incompletos en la respuesta');
      }
      
      console.log('Datos de perfil obtenidos con éxito:', {
        id: responseData._id,
        nombre: responseData.firstName,
        apellido: responseData.lastName
      });
      console.log(`=== FIN: Obteniendo persona para usuario con ID: ${userId} ===`);
      
      return responseData;
    } catch (error) {
      console.error(`=== ERROR: Obteniendo persona para usuario con ID: ${userId} ===`, error);
      throw error;
    }
  },

  /**
   * Create person
   */
  createPeople: async (data: CreatePeopleRequest): Promise<People> => {
    try {
      console.log('Creando perfil de persona:', data);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('No hay token de acceso disponible');
        throw new Error('No hay token de acceso disponible');
      }
      
      const response = await fetch(`${apiUrl}/people`, {
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
        console.error('Error al crear persona:', response.status, errorText);
        throw new Error(`Error al crear perfil: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Respuesta del servidor (createPeople):', responseText);
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      // Intentar parsear la respuesta
      let responseData = JSON.parse(responseText);
      
      // Verificar si la respuesta tiene un formato anidado
      if (responseData.data && typeof responseData.data === 'object') {
        console.log('Formato de respuesta anidada detectado, extrayendo data');
        responseData = responseData.data;
      }
      
      console.log('Perfil creado:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error en createPeople:', error);
      throw error;
    }
  },

  /**
   * Update person
   */
  updatePeople: async (id: string, data: UpdatePeopleRequest): Promise<People> => {
    try {
      console.log(`Actualizando persona con ID: ${id}`, data);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('No hay token de acceso disponible');
        throw new Error('No hay token de acceso disponible');
      }
      
      const response = await fetch(`${apiUrl}/people/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al actualizar persona:', response.status, errorText);
        throw new Error(`Error al actualizar perfil: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Respuesta del servidor (updatePeople):', responseText);
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      // Intentar parsear la respuesta
      let responseData = JSON.parse(responseText);
      
      // Verificar si la respuesta tiene un formato anidado
      if (responseData.data && typeof responseData.data === 'object') {
        console.log('Formato de respuesta anidada detectado, extrayendo data');
        responseData = responseData.data;
      }
      
      console.log('Perfil actualizado:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error en updatePeople:', error);
      throw error;
    }
  },

  /**
   * Delete person
   */
  deletePeople: async (id: string): Promise<{ message: string }> => {
    try {
      console.log(`Eliminando persona con ID: ${id}`);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('No hay token de acceso disponible');
        throw new Error('No hay token de acceso disponible');
      }
      
      const response = await fetch(`${apiUrl}/people/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al eliminar persona:', response.status, errorText);
        throw new Error(`Error al eliminar perfil: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Respuesta del servidor (deletePeople):', responseText);
      
      if (!responseText || responseText.trim() === '') {
        return { message: 'Perfil eliminado con éxito' };
      }
      
      // Intentar parsear la respuesta
      let responseData = JSON.parse(responseText);
      
      // Verificar si la respuesta tiene un formato anidado
      if (responseData.data && typeof responseData.data === 'object') {
        console.log('Formato de respuesta anidada detectado, extrayendo data');
        responseData = responseData.data;
      }
      
      return responseData.message 
        ? responseData 
        : { message: 'Perfil eliminado con éxito' };
    } catch (error) {
      console.error('Error en deletePeople:', error);
      throw error;
    }
  },

  /**
   * Add study goal to person
   */
  addStudyGoal: async (peopleId: string, goalId: string): Promise<People> => {
    try {
      console.log(`Añadiendo objetivo de estudio ${goalId} a persona ${peopleId}`);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('No hay token de acceso disponible');
        throw new Error('No hay token de acceso disponible');
      }
      
      const response = await fetch(`${apiUrl}/people/${peopleId}/study-goals/${goalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al añadir objetivo de estudio:', response.status, errorText);
        throw new Error(`Error al añadir objetivo: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Respuesta del servidor (addStudyGoal):', responseText);
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      // Intentar parsear la respuesta
      let responseData = JSON.parse(responseText);
      
      // Verificar si la respuesta tiene un formato anidado
      if (responseData.data && typeof responseData.data === 'object') {
        console.log('Formato de respuesta anidada detectado, extrayendo data');
        responseData = responseData.data;
      }
      
      return responseData;
    } catch (error) {
      console.error('Error en addStudyGoal:', error);
      throw error;
    }
  },

  /**
   * Remove study goal from person
   */
  removeStudyGoal: async (peopleId: string, goalId: string): Promise<People> => {
    try {
      console.log(`Eliminando objetivo de estudio ${goalId} de persona ${peopleId}`);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('No hay token de acceso disponible');
        throw new Error('No hay token de acceso disponible');
      }
      
      const response = await fetch(`${apiUrl}/people/${peopleId}/study-goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al eliminar objetivo de estudio:', response.status, errorText);
        throw new Error(`Error al eliminar objetivo: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Respuesta del servidor (removeStudyGoal):', responseText);
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }
      
      // Intentar parsear la respuesta
      let responseData = JSON.parse(responseText);
      
      // Verificar si la respuesta tiene un formato anidado
      if (responseData.data && typeof responseData.data === 'object') {
        console.log('Formato de respuesta anidada detectado, extrayendo data');
        responseData = responseData.data;
      }
      
      return responseData;
    } catch (error) {
      console.error('Error en removeStudyGoal:', error);
      throw error;
    }
  }
};

export default PeopleService;