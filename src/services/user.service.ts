import api from './api';
import { User, UpdateUserRequest } from '@/types/user.types';

/**
 * User service that handles all user related API calls
 */
const UserService = {
  /**
   * Get all users
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  },

  /**
   * Test database connection
   */
  testConnection: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get<{ status: string; message: string }>('/users/test-connection');
    return response.data;
  }
};

export default UserService;