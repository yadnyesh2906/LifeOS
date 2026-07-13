import { ApiResponse } from '../types/ApiResponse';
import { FocusSession } from '../types/Focus';
import storage from '../utils/storage';

const FOCUS_KEY = 'lifeos_focus';

export const focusService = {
  async getFocusSessions(): Promise<ApiResponse<FocusSession[]>> {
    const focusJson = await storage.getItem(FOCUS_KEY);
    const sessions: FocusSession[] = focusJson ? JSON.parse(focusJson) : [];
    return {
      success: true,
      message: 'Focus sessions fetched successfully',
      data: sessions,
    };
  },
};

export default focusService;
