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
        setHabits(response.data);
      } else {
        setError(response.message || 'Failed to fetch habits');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return { habits, isLoading, error, refetch: fetchHabits };
};

export default useHabit;
