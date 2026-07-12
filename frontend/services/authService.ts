import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { LoginResponseData } from '../types/Auth';
import { User } from '../types/User';

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<LoginResponseData>> {
    const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async register(fullName: string, email: string, password: string): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>('/auth/register', {
      fullName,
      email,
      password,
    });
    return response.data;
  },
};

export default authService;
