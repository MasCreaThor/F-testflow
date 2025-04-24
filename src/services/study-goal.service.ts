// src/services/study-goal.service.ts
import {
    StudyGoal,
    CreateStudyGoalRequest,
    UpdateStudyGoalRequest
  } from '@/types/study-goal.types';
  
  /**
   * Servicio para gestionar objetivos de estudio
   */
  const StudyGoalService = {
    /**
     * Obtiene los objetivos de estudio del usuario actual
     * @param activeOnly Si es true, obtiene solo objetivos activos
     */
    getMyStudyGoals: async (activeOnly: boolean = true): Promise<StudyGoal[]> => {
      try {
        console.log(`Obteniendo mis objetivos de estudio. activeOnly=${activeOnly}`);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          console.error('No hay token de acceso disponible');
          throw new Error('No hay token de acceso disponible');
        }
        
        // Actualizar la URL para usar la nueva ruta
        const url = `${apiUrl}/study-goals/user/goals?activeOnly=${activeOnly}`;
        
        // Resto del código permanece igual...
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error al obtener objetivos de estudio:', response.status, errorText);
          throw new Error(`Error al obtener objetivos: ${response.status}`);
        }
        
        const responseText = await response.text();
        
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
        
        console.log(`Se obtuvieron ${responseData.length} objetivos de estudio del usuario`);
        return responseData;
      } catch (error) {
        console.error('Error en getMyStudyGoals:', error);
        throw error;
      }
    },
  
    /**
     * Obtiene un objetivo de estudio por su ID
     * @param id ID del objetivo
     */
    getStudyGoalById: async (id: string): Promise<StudyGoal> => {
      try {
        console.log(`Obteniendo objetivo de estudio con ID: ${id}`);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          console.error('No hay token de acceso disponible');
          throw new Error('No hay token de acceso disponible');
        }
        
        const response = await fetch(`${apiUrl}/study-goals/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error al obtener objetivo por ID:', response.status, errorText);
          throw new Error(`Error al obtener objetivo: ${response.status}`);
        }
        
        const responseText = await response.text();
        
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
        
        console.log('Datos de objetivo obtenidos:', responseData);
        return responseData;
      } catch (error) {
        console.error('Error en getStudyGoalById:', error);
        throw error;
      }
    },
  
    /**
     * Crea un nuevo objetivo de estudio
     * @param data Datos del objetivo a crear
     */
    createStudyGoal: async (data: CreateStudyGoalRequest): Promise<StudyGoal> => {
      try {
        console.log('Creando objetivo de estudio:', data);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          console.error('No hay token de acceso disponible');
          throw new Error('No hay token de acceso disponible');
        }
        
        const response = await fetch(`${apiUrl}/study-goals`, {
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
          console.error('Error al crear objetivo:', response.status, errorText);
          throw new Error(`Error al crear objetivo: ${response.status}`);
        }
        
        const responseText = await response.text();
        
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
        
        console.log('Objetivo creado:', responseData);
        return responseData;
      } catch (error) {
        console.error('Error en createStudyGoal:', error);
        throw error;
      }
    },
  
    /**
     * Actualiza un objetivo de estudio existente
     * @param id ID del objetivo a actualizar
     * @param data Datos para actualizar
     */
    updateStudyGoal: async (id: string, data: UpdateStudyGoalRequest): Promise<StudyGoal> => {
      try {
        console.log(`Actualizando objetivo de estudio ${id}:`, data);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          console.error('No hay token de acceso disponible');
          throw new Error('No hay token de acceso disponible');
        }
        
        const response = await fetch(`${apiUrl}/study-goals/${id}`, {
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
          console.error('Error al actualizar objetivo:', response.status, errorText);
          throw new Error(`Error al actualizar objetivo: ${response.status}`);
        }
        
        const responseText = await response.text();
        
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
        
        console.log('Objetivo actualizado:', responseData);
        return responseData;
      } catch (error) {
        console.error('Error en updateStudyGoal:', error);
        throw error;
      }
    },
  
    /**
     * Elimina un objetivo de estudio
     * @param id ID del objetivo a eliminar
     */
    deleteStudyGoal: async (id: string): Promise<{ message: string }> => {
      try {
        console.log(`Eliminando objetivo de estudio con ID: ${id}`);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          console.error('No hay token de acceso disponible');
          throw new Error('No hay token de acceso disponible');
        }
        
        const response = await fetch(`${apiUrl}/study-goals/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error al eliminar objetivo:', response.status, errorText);
          throw new Error(`Error al eliminar objetivo: ${response.status}`);
        }
        
        const responseText = await response.text();
        
        // Puede que la respuesta esté vacía o sea un mensaje
        if (!responseText || responseText.trim() === '') {
          return { message: 'Objetivo eliminado con éxito' };
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
          : { message: 'Objetivo eliminado con éxito' };
      } catch (error) {
        console.error('Error en deleteStudyGoal:', error);
        throw error;
      }
    },
  
    /**
     * Obtiene objetivos de estudio por categoría
     * @param categoryId ID de la categoría
     */
    getStudyGoalsByCategory: async (categoryId: string): Promise<StudyGoal[]> => {
      try {
        console.log(`Obteniendo objetivos de estudio para categoría: ${categoryId}`);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          console.error('No hay token de acceso disponible');
          throw new Error('No hay token de acceso disponible');
        }
        
        const response = await fetch(`${apiUrl}/study-goals/category/${categoryId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error al obtener objetivos por categoría:', response.status, errorText);
          throw new Error(`Error al obtener objetivos: ${response.status}`);
        }
        
        const responseText = await response.text();
        
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
        
        console.log(`Se obtuvieron ${responseData.length} objetivos para la categoría`);
        return responseData;
      } catch (error) {
        console.error('Error en getStudyGoalsByCategory:', error);
        throw error;
      }
    }
  };
  
  export default StudyGoalService;