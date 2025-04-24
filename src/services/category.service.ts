// src/services/category.service.ts
import { Category } from '@/types/category.types';

/**
 * Servicio para gestionar categorías
 */
const CategoryService = {
  /**
   * Obtiene todas las categorías
   * @param activeOnly Si es true, obtiene solo categorías activas
   */
  getAllCategories: async (activeOnly: boolean = true): Promise<Category[]> => {
    try {
      console.log(`Obteniendo categorías. activeOnly=${activeOnly}`);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('No hay token de acceso disponible');
        throw new Error('No hay token de acceso disponible');
      }
      
      const url = `${apiUrl}/categories?activeOnly=${activeOnly}`;
      
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
        console.error('Error al obtener categorías:', response.status, errorText);
        throw new Error(`Error al obtener categorías: ${response.status}`);
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
      
      console.log(`Se obtuvieron ${responseData.length} categorías`);
      return responseData;
    } catch (error) {
      console.error('Error en getAllCategories:', error);
      throw error;
    }
  },

  /**
   * Obtiene una categoría por su ID
   * @param id ID de la categoría
   */
  getCategoryById: async (id: string): Promise<Category> => {
    try {
      console.log(`Obteniendo categoría con ID: ${id}`);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('No hay token de acceso disponible');
        throw new Error('No hay token de acceso disponible');
      }
      
      const response = await fetch(`${apiUrl}/categories/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al obtener categoría por ID:', response.status, errorText);
        throw new Error(`Error al obtener categoría: ${response.status}`);
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
      
      console.log('Datos de categoría obtenidos:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error en getCategoryById:', error);
      throw error;
    }
  }
};

export default CategoryService;