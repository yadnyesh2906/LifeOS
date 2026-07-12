import { useState, useEffect } from 'react';
import goalService from '../services/goalService';
import { Goal } from '../types/Goal';

export const useGoal = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const response = await goalService.getGoals();
      if (response.success && response.data) {
        setGoals(response.data);
      } else {
        setError(response.message || 'Failed to fetch goals');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createGoal = async (
    title: string,
    description: string | null,
    targetDate: string | null,
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  ) => {
    try {
      const response = await goalService.createGoal({ title, description, targetDate, status });
      if (response.success && response.data) {
        setGoals(prev => [response.data, ...prev]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create goal');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const updateGoal = async (id: number, updates: Partial<Goal>) => {
    try {
      const response = await goalService.updateGoal(id, updates);
      if (response.success && response.data) {
        setGoals(prev => prev.map(g => g.id === id ? response.data : g));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update goal');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const completeGoal = async (id: number) => {
    try {
      const response = await goalService.completeGoal(id);
      if (response.success && response.data) {
        setGoals(prev => prev.map(g => g.id === id ? response.data : g));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to complete goal');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const deleteGoal = async (id: number) => {
    try {
      const response = await goalService.deleteGoal(id);
      if (response.success) {
        setGoals(prev => prev.filter(g => g.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete goal');
      }
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    isLoading,
    error,
    refetch: fetchGoals,
    createGoal,
    updateGoal,
    completeGoal,
    deleteGoal,
  };
};

export default useGoal;
