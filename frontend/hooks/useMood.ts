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
        setMoods(response.data);
      } else {
        setError(response.message || 'Failed to fetch moods');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  return { moods, isLoading, error, refetch: fetchMoods };
};

export default useMood;
