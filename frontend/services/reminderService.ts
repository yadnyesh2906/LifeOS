import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { Reminder } from '../types/Reminder';

export const reminderService = {
  async getReminders(): Promise<ApiResponse<Reminder[]>> {
    const response = await api.get<ApiResponse<Reminder[]>>('/reminders');
    return response.data;
  },
};

export default reminderService;
