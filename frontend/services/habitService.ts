import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { Habit } from '../types/Habit';

export const habitService = {
  async getHabits(): Promise<ApiResponse<Habit[]>> {
    const response = await api.get<ApiResponse<Habit[]>>('/habits');
    return response.data;
  },
};

export default habitService;
