import api from './api';
import { ApiResponse } from '../types/ApiResponse';

export const habitService = {
  async getHabits(): Promise<ApiResponse<any[]>> {
    const response = await api.get<ApiResponse<any[]>>('/habits');
    return response.data;
  },

  async getHabitById(id: number): Promise<ApiResponse<any>> {
    const response = await api.get<ApiResponse<any>>(`/habits/${id}`);
    return response.data;
  },

  async createHabit(habit: any): Promise<ApiResponse<any>> {
    const response = await api.post<ApiResponse<any>>('/habits', habit);
    return response.data;
  },

  async updateHabit(id: number, habit: any): Promise<ApiResponse<any>> {
    const response = await api.put<ApiResponse<any>>(`/habits/${id}`, habit);
    return response.data;
  },

  async completeHabit(id: number): Promise<ApiResponse<any>> {
    const response = await api.patch<ApiResponse<any>>(`/habits/${id}/complete`);
    return response.data;
  },

  async deleteHabit(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/habits/${id}`);
    return response.data;
  },
};

export default habitService;
