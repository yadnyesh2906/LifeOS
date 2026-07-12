import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { DashboardDTO } from '../types/Dashboard';

export const dashboardService = {
  async getDashboardData(): Promise<ApiResponse<DashboardDTO>> {
    const response = await api.get<ApiResponse<DashboardDTO>>('/dashboard');
    return response.data;
  },
};

export default dashboardService;
