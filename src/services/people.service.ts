import api from './api';
import { People, CreatePeopleRequest, UpdatePeopleRequest } from '@/types/people.types';

/**
 * People service that handles all people related API calls
 */
const PeopleService = {
  /**
   * Get all people
   */
  getAllPeople: async (): Promise<People[]> => {
    const response = await api.get<People[]>('/people');
    return response.data;
  },

  /**
   * Get person by ID
   */
  getPeopleById: async (id: string): Promise<People> => {
    const response = await api.get<People>(`/people/${id}`);
    return response.data;
  },

  /**
   * Get person by user ID
   */
  getPeopleByUserId: async (userId: string): Promise<People> => {
    const response = await api.get<People>(`/people/user/${userId}`);
    return response.data;
  },

  /**
   * Create person
   */
  createPeople: async (data: CreatePeopleRequest): Promise<People> => {
    const response = await api.post<People>('/people', data);
    return response.data;
  },

  /**
   * Update person
   */
  updatePeople: async (id: string, data: UpdatePeopleRequest): Promise<People> => {
    const response = await api.put<People>(`/people/${id}`, data);
    return response.data;
  },

  /**
   * Delete person
   */
  deletePeople: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/people/${id}`);
    return response.data;
  },

  /**
   * Add study goal to person
   */
  addStudyGoal: async (peopleId: string, goalId: string): Promise<People> => {
    const response = await api.post<People>(`/people/${peopleId}/study-goals/${goalId}`);
    return response.data;
  },

  /**
   * Remove study goal from person
   */
  removeStudyGoal: async (peopleId: string, goalId: string): Promise<People> => {
    const response = await api.delete<People>(`/people/${peopleId}/study-goals/${goalId}`);
    return response.data;
  }
};

export default PeopleService;