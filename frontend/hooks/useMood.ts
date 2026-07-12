import { useState, useEffect } from 'react';
import moodService from '../services/moodService';
import { Mood } from '../types/Mood';

export const useMood = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoods = async () => {
    setIsLoading(true);
    try {
      const response = await moodService.getMoods();
      if (response.success && response.data) {
        const mappedMoods = response.data.map((m: any) => ({
          id: m.id,
          moodState: m.mood as any,
          note: m.note,
          createdAt: m.createdAt,
        }));
        setMoods(mappedMoods);
      } else {
        setError(response.message || 'Failed to fetch moods');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createMood = async (moodState: string, note: string | null) => {
    try {
      const response = await moodService.createMood({ mood: moodState, note });
      if (response.success && response.data) {
        const newMood: Mood = {
          id: response.data.id,
          moodState: response.data.mood as any,
          note: response.data.note,
          createdAt: response.data.createdAt,
        };
        setMoods(prev => [newMood, ...prev]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create mood');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const updateMood = async (id: number, updates: Partial<Mood>) => {
    try {
      const response = await moodService.updateMood(id, {
        mood: updates.moodState,
        note: updates.note,
      });
      if (response.success && response.data) {
        const updated: Mood = {
          id: response.data.id,
          moodState: response.data.mood as any,
          note: response.data.note,
          createdAt: response.data.createdAt,
        };
        setMoods(prev => prev.map(m => (m.id === id ? updated : m)));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update mood');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const deleteMood = async (id: number) => {
    try {
      const response = await moodService.deleteMood(id);
      if (response.success) {
        setMoods(prev => prev.filter(m => m.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete mood');
      }
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  return {
    moods,
    isLoading,
    error,
    refetch: fetchMoods,
    createMood,
    updateMood,
    deleteMood,
  };
};

export default useMood;
