import { ApiResponse } from '../types/ApiResponse';
import storage from '../utils/storage';

const HABITS_KEY = 'lifeos_habits';

export const habitService = {
  async getHabits(): Promise<ApiResponse<any[]>> {
    const habitsJson = await storage.getItem(HABITS_KEY);
    const habits = habitsJson ? JSON.parse(habitsJson) : [];
    return {
      success: true,
      message: 'Habits fetched successfully',
      data: habits,
    };
  },

  async getHabitById(id: number): Promise<ApiResponse<any>> {
    const habitsJson = await storage.getItem(HABITS_KEY);
    const habits: any[] = habitsJson ? JSON.parse(habitsJson) : [];
    const habit = habits.find(h => h.id === id);
    if (!habit) {
      return {
        success: false,
        message: 'Habit not found',
        data: null,
      };
    }
    return {
      success: true,
      message: 'Habit fetched successfully',
      data: habit,
    };
  },

  async createHabit(habit: any): Promise<ApiResponse<any>> {
    const habitsJson = await storage.getItem(HABITS_KEY);
    const habits: any[] = habitsJson ? JSON.parse(habitsJson) : [];

    const newId = habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1;
    const newHabit = {
      id: newId,
      name: habit.name || '',
      description: habit.description || '',
      frequency: habit.frequency || 'DAILY',
      streak: 0,
      completedToday: false,
      completedDates: [],
      createdAt: new Date().toISOString(),
      ...habit,
    };

    habits.push(newHabit);
    await storage.setItem(HABITS_KEY, JSON.stringify(habits));

    return {
      success: true,
      message: 'Habit created successfully',
      data: newHabit,
    };
  },

  async updateHabit(id: number, habit: any): Promise<ApiResponse<any>> {
    const habitsJson = await storage.getItem(HABITS_KEY);
    let habits: any[] = habitsJson ? JSON.parse(habitsJson) : [];

    const index = habits.findIndex(h => h.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Habit not found',
        data: null,
      };
    }

    const updatedHabit = {
      ...habits[index],
      ...habit,
    };
    habits[index] = updatedHabit;
    await storage.setItem(HABITS_KEY, JSON.stringify(habits));

    return {
      success: true,
      message: 'Habit updated successfully',
      data: updatedHabit,
    };
  },

  async completeHabit(id: number): Promise<ApiResponse<any>> {
    const habitsJson = await storage.getItem(HABITS_KEY);
    let habits: any[] = habitsJson ? JSON.parse(habitsJson) : [];

    const index = habits.findIndex(h => h.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Habit not found',
        data: null,
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const habit = habits[index];
    const completedDates: string[] = habit.completedDates || [];
    
    let updatedHabit;
    if (completedDates.includes(todayStr)) {
      // Un-complete habit
      const newDates = completedDates.filter(d => d !== todayStr);
      updatedHabit = {
        ...habit,
        completedToday: false,
        completedDates: newDates,
        streak: Math.max(0, habit.streak - 1),
      };
    } else {
      // Complete habit
      const newDates = [...completedDates, todayStr];
      updatedHabit = {
        ...habit,
        completedToday: true,
        completedDates: newDates,
        streak: habit.streak + 1,
      };
    }

    habits[index] = updatedHabit;
    await storage.setItem(HABITS_KEY, JSON.stringify(habits));

    return {
      success: true,
      message: 'Habit completion status toggled successfully',
      data: updatedHabit,
    };
  },

  async deleteHabit(id: number): Promise<ApiResponse<void>> {
    const habitsJson = await storage.getItem(HABITS_KEY);
    let habits: any[] = habitsJson ? JSON.parse(habitsJson) : [];

    const filteredHabits = habits.filter(h => h.id !== id);
    await storage.setItem(HABITS_KEY, JSON.stringify(filteredHabits));

    return {
      success: true,
      message: 'Habit deleted successfully',
      data: undefined,
    };
  },
};

export default habitService;
