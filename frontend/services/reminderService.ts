import { ApiResponse } from '../types/ApiResponse';
import { Reminder } from '../types/Reminder';
import storage from '../utils/storage';

const REMINDERS_KEY = 'lifeos_reminders';

export const reminderService = {
  async getReminders(): Promise<ApiResponse<Reminder[]>> {
    const remindersJson = await storage.getItem(REMINDERS_KEY);
    const reminders: Reminder[] = remindersJson ? JSON.parse(remindersJson) : [];
    return {
      success: true,
      message: 'Reminders fetched successfully',
      data: reminders,
    };
  },
};

export default reminderService;
