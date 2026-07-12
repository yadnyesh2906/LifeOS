import { useState, useEffect } from 'react';
import habitService from '../services/habitService';
import { Habit } from '../types/Habit';

export const useHabit = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const response = await habitService.getHabits();
      if (response.success && response.data) {
        // Map backend HabitDTO fields to frontend types
        const mappedHabits = response.data.map((h: any) => ({
          id: h.id,
          title: h.title || h.name, // Support both name and title
          frequency: h.frequency || 'Daily',
          streak: h.streak || 0,
          completedToday: h.completed || false,
        }));
        setHabits(mappedHabits);
      } else {
        setError(response.message || 'Failed to fetch habits');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createHabit = async (name: string, description: string | null, frequency: string) => {
    try {
      const response = await habitService.createHabit({
        name, // Send name since the backend validated name
        title: name,
        description,
        frequency,
        completed: false,
      });
      if (response.success && response.data) {
        const newHabit: Habit = {
          id: response.data.id,
          title: response.data.title || response.data.name,
          frequency: response.data.frequency || 'Daily',
          streak: 0,
          completedToday: false,
        };
        setHabits(prev => [newHabit, ...prev]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create habit');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const updateHabit = async (id: number, updates: Partial<any>) => {
    try {
      const response = await habitService.updateHabit(id, {
        name: updates.title,
        title: updates.title,
        description: updates.description,
        frequency: updates.frequency,
      });
      if (response.success && response.data) {
        const updated: Habit = {
          id: response.data.id,
          title: response.data.title || response.data.name,
          frequency: response.data.frequency || 'Daily',
          streak: response.data.streak || 0,
          completedToday: response.data.completed || false,
        };
        setHabits(prev => prev.map(h => (h.id === id ? updated : h)));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update habit');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const completeHabit = async (id: number) => {
    try {
      const response = await habitService.completeHabit(id);
      if (response.success && response.data) {
        const updated: Habit = {
          id: response.data.id,
          title: response.data.title || response.data.name,
          frequency: response.data.frequency || 'Daily',
          streak: response.data.streak || 0,
          completedToday: response.data.completed || false,
        };
        setHabits(prev => prev.map(h => (h.id === id ? updated : h)));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to complete habit');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const deleteHabit = async (id: number) => {
    try {
      const response = await habitService.deleteHabit(id);
      if (response.success) {
        setHabits(prev => prev.filter(h => h.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete habit');
      }
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return {
    habits,
    isLoading,
    error,
    refetch: fetchHabits,
    createHabit,
    updateHabit,
    completeHabit,
    deleteHabit,
  };
};

export default useHabit;
