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

  useEffect(() => {
    fetchGoals();
  }, []);

  return { goals, isLoading, error, refetch: fetchGoals };
};

export default useGoal;
