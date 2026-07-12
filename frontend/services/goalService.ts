import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { Goal } from '../types/Goal';

export const goalService = {
  async getGoals(): Promise<ApiResponse<Goal[]>> {
    const response = await api.get<ApiResponse<Goal[]>>('/goals');
    return response.data;
  },

  async createGoal(goal: Partial<Goal>): Promise<ApiResponse<Goal>> {
    const response = await api.post<ApiResponse<Goal>>('/goals', goal);
    return response.data;
  },

  async updateGoal(id: number, goal: Partial<Goal>): Promise<ApiResponse<Goal>> {
    const response = await api.put<ApiResponse<Goal>>(`/goals/${id}`, goal);
    return response.data;
  },

  async completeGoal(id: number): Promise<ApiResponse<Goal>> {
    const response = await api.patch<ApiResponse<Goal>>(`/goals/${id}/complete`);
    return response.data;
  },

  async deleteGoal(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/goals/${id}`);
    return response.data;
  },
};

export default goalService;
