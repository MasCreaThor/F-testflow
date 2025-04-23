import api from './api';
import { StudyGoal } from '@/types/people.types';

/**
 * Study Goals service that handles all study goals related API calls
 */
const StudyGoalsService = {
  /**
   * Get all study goals
   */
  getAllStudyGoals: async (): Promise<StudyGoal[]> => {
    const response = await api.get<StudyGoal[]>('/study-goals');
    return response.data;
  },

  /**
   * Get study goal by ID
   */
  getStudyGoalById: async (id: string): Promise<StudyGoal> => {
    const response = await api.get<StudyGoal>(`/study-goals/${id}`);
    return response.data;
  },

  /**
   * Create study goal
   */
  createStudyGoal: async (data: { name: string; description?: string }): Promise<StudyGoal> => {
    const response = await api.post<StudyGoal>('/study-goals', data);
    return response.data;
  },

  /**
   * Update study goal
   */
  updateStudyGoal: async (id: string, data: { name?: string; description?: string }): Promise<StudyGoal> => {
    const response = await api.put<StudyGoal>(`/study-goals/${id}`, data);
    return response.data;
  },

  /**
   * Delete study goal
   */
  deleteStudyGoal: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/study-goals/${id}`);
    return response.data;
  }
};

export default StudyGoalsService;