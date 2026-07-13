import { ApiResponse } from '../types/ApiResponse';
import storage from '../utils/storage';

const MOODS_KEY = 'lifeos_moods';

export const moodService = {
  async getMoods(): Promise<ApiResponse<any[]>> {
    const moodsJson = await storage.getItem(MOODS_KEY);
    const moods = moodsJson ? JSON.parse(moodsJson) : [];
    return {
      success: true,
      message: 'Mood logs fetched successfully',
      data: moods,
    };
  },

  async createMood(mood: any): Promise<ApiResponse<any>> {
    const moodsJson = await storage.getItem(MOODS_KEY);
    const moods: any[] = moodsJson ? JSON.parse(moodsJson) : [];

    const newId = moods.length > 0 ? Math.max(...moods.map(m => m.id)) + 1 : 1;
    const newMood = {
      id: newId,
      moodState: mood.moodState || 'NEUTRAL',
      notes: mood.notes || '',
      loggedAt: new Date().toISOString(),
      ...mood,
    };

    moods.push(newMood);
    await storage.setItem(MOODS_KEY, JSON.stringify(moods));

    return {
      success: true,
      message: 'Mood logged successfully',
      data: newMood,
    };
  },

  async updateMood(id: number, mood: any): Promise<ApiResponse<any>> {
    const moodsJson = await storage.getItem(MOODS_KEY);
    let moods: any[] = moodsJson ? JSON.parse(moodsJson) : [];

    const index = moods.findIndex(m => m.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Mood record not found',
        data: null,
      };
    }

    const updatedMood = {
      ...moods[index],
      ...mood,
    };
    moods[index] = updatedMood;
    await storage.setItem(MOODS_KEY, JSON.stringify(moods));

    return {
      success: true,
      message: 'Mood log updated successfully',
      data: updatedMood,
    };
  },

  async deleteMood(id: number): Promise<ApiResponse<void>> {
    const moodsJson = await storage.getItem(MOODS_KEY);
    let moods: any[] = moodsJson ? JSON.parse(moodsJson) : [];

    const filteredMoods = moods.filter(m => m.id !== id);
    await storage.setItem(MOODS_KEY, JSON.stringify(filteredMoods));

    return {
      success: true,
      message: 'Mood log deleted successfully',
      data: undefined,
    };
  },
};

export default moodService;
