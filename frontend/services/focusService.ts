import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { FocusSession } from '../types/Focus';

export const focusService = {
  async getFocusSessions(): Promise<ApiResponse<FocusSession[]>> {
    const response = await api.get<ApiResponse<FocusSession[]>>('/focus');
    return response.data;
  },
};

export default focusService;
