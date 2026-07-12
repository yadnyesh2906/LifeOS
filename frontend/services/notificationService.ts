import api from './api';
import { ApiResponse } from '../types/ApiResponse';

export const notificationService = {
  async getNotifications(): Promise<ApiResponse<any[]>> {
    const response = await api.get<ApiResponse<any[]>>('/notifications');
    return response.data;
  },
};

export default notificationService;
