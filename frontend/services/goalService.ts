import { ApiResponse } from '../types/ApiResponse';
import { Goal } from '../types/Goal';
import storage from '../utils/storage';

const GOALS_KEY = 'lifeos_goals';

export const goalService = {
  async getGoals(): Promise<ApiResponse<Goal[]>> {
    const goalsJson = await storage.getItem(GOALS_KEY);
    const goals: Goal[] = goalsJson ? JSON.parse(goalsJson) : [];
    return {
      success: true,
      message: 'Goals fetched successfully',
      data: goals,
    };
  },

  async createGoal(goal: Partial<Goal>): Promise<ApiResponse<Goal>> {
    const goalsJson = await storage.getItem(GOALS_KEY);
    const goals: Goal[] = goalsJson ? JSON.parse(goalsJson) : [];
    
    const newId = goals.length > 0 ? Math.max(...goals.map(g => g.id)) + 1 : 1;
    const newGoal: Goal = {
      id: newId,
      title: goal.title || '',
      description: goal.description || '',
      targetDate: goal.targetDate || new Date().toISOString().split('T')[0],
      completed: false,
      progress: goal.progress || 0,
      createdAt: new Date().toISOString(),
      ...goal,
    };

    goals.push(newGoal);
    await storage.setItem(GOALS_KEY, JSON.stringify(goals));

    return {
      success: true,
      message: 'Goal created successfully',
      data: newGoal,
    };
  },

  async updateGoal(id: number, goal: Partial<Goal>): Promise<ApiResponse<Goal>> {
    const goalsJson = await storage.getItem(GOALS_KEY);
    let goals: Goal[] = goalsJson ? JSON.parse(goalsJson) : [];
    
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Goal not found',
        data: null as any,
      };
    }

    const updatedGoal = {
      ...goals[index],
      ...goal,
    };
    goals[index] = updatedGoal;
    await storage.setItem(GOALS_KEY, JSON.stringify(goals));

    return {
      success: true,
      message: 'Goal updated successfully',
      data: updatedGoal,
    };
  },

  async completeGoal(id: number): Promise<ApiResponse<Goal>> {
    const goalsJson = await storage.getItem(GOALS_KEY);
    let goals: Goal[] = goalsJson ? JSON.parse(goalsJson) : [];
    
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Goal not found',
        data: null as any,
      };
    }

    const updatedGoal = {
      ...goals[index],
      completed: !goals[index].completed,
      progress: !goals[index].completed ? 100 : goals[index].progress,
    };
    goals[index] = updatedGoal;
    await storage.setItem(GOALS_KEY, JSON.stringify(goals));

    return {
      success: true,
      message: 'Goal completion status toggled successfully',
      data: updatedGoal,
    };
  },

  async deleteGoal(id: number): Promise<ApiResponse<void>> {
    const goalsJson = await storage.getItem(GOALS_KEY);
    let goals: Goal[] = goalsJson ? JSON.parse(goalsJson) : [];
    
    const filteredGoals = goals.filter(g => g.id !== id);
    await storage.setItem(GOALS_KEY, JSON.stringify(filteredGoals));

    return {
      success: true,
      message: 'Goal deleted successfully',
      data: undefined,
    };
  },
};

export default goalService;
