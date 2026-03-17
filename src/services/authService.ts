import { storage } from '@/utils/storage';
import apiClient from './apiClient';
import { apiEndpoints } from './apis';

export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await apiClient.post(apiEndpoints.auth.login, {
        username,
        password,
      });
      
      const { access, refresh, user } = response.data;
      
      // Store tokens
      await storage.setItem('access_token', access);
      await storage.setItem('refresh_token', refresh);
      await storage.setItem('user_profile', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await apiClient.post(apiEndpoints.auth.register, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await storage.removeItem('access_token');
      await storage.removeItem('refresh_token');
      await storage.removeItem('user_profile');
    } catch (error) {
        console.error('Error logging out', error);
    }
  },

  isAuthenticated: async () => {
    const token = await storage.getItem('access_token');
    return !!token;
  },

  getUserProfile: async () => {
    const profile = await storage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  }
};
