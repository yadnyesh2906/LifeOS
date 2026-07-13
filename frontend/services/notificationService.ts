import { ApiResponse } from '../types/ApiResponse';
import storage from '../utils/storage';

const NOTIFICATIONS_KEY = 'lifeos_notifications';

export const notificationService = {
  async getNotifications(): Promise<ApiResponse<any[]>> {
    const notificationsJson = await storage.getItem(NOTIFICATIONS_KEY);
    const notifications = notificationsJson ? JSON.parse(notificationsJson) : [
      {
        id: 1,
        title: 'Welcome to LifeOS',
        message: 'Start tracking your tasks, habits, and goals to build streaks!',
        read: false,
        createdAt: new Date().toISOString(),
      }
    ];
    return {
      success: true,
      message: 'Notifications fetched successfully',
      data: notifications,
    };
  },
};

export default notificationService;
