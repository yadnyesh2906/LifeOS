import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { Journal } from '../types/Journal';

export const journalService = {
  async getJournals(): Promise<ApiResponse<Journal[]>> {
    const response = await api.get<ApiResponse<Journal[]>>('/journals');
    return response.data;
  },
};

export default journalService;
