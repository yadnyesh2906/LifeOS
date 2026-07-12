import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { User } from '../types/User';

export const profileService = {
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/users/profile');
    return response.data;
  },
};

export default profileService;
