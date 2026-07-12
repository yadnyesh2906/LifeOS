import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { Mood } from '../types/Mood';

export const moodService = {
  async getMoods(): Promise<ApiResponse<Mood[]>> {
    const response = await api.get<ApiResponse<Mood[]>>('/moods');
    return response.data;
  },
};

export default moodService;
