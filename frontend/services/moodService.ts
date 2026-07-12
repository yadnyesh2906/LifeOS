import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { Mood } from '../types/Mood';

export const moodService = {
  async getMoods(): Promise<ApiResponse<any[]>> {
    const response = await api.get<ApiResponse<any[]>>('/moods');
    return response.data;
  },

  async createMood(mood: any): Promise<ApiResponse<any>> {
    const response = await api.post<ApiResponse<any>>('/moods', mood);
    return response.data;
  },

  async updateMood(id: number, mood: any): Promise<ApiResponse<any>> {
    const response = await api.put<ApiResponse<any>>(`/moods/${id}`, mood);
    return response.data;
  },

  async deleteMood(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/moods/${id}`);
    return response.data;
  },
};

export default moodService;
