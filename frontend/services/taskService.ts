import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { Task } from '../types/Task';

export const taskService = {
  async getTasks(): Promise<ApiResponse<Task[]>> {
    const response = await api.get<ApiResponse<Task[]>>('/tasks');
    return response.data;
  },

  async createTask(task: Partial<Task>): Promise<ApiResponse<Task>> {
    const response = await api.post<ApiResponse<Task>>('/tasks', task);
    return response.data;
  },

  async updateTask(id: number, task: Partial<Task>): Promise<ApiResponse<Task>> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, task);
    return response.data;
  },

  async completeTask(id: number): Promise<ApiResponse<Task>> {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/complete`);
    return response.data;
  },

  async deleteTask(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;
