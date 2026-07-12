import { useState, useEffect } from 'react';
import focusService from '../services/focusService';
import { FocusSession } from '../types/Focus';

export const useFocus = () => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFocusSessions = async () => {
    setIsLoading(true);
    try {
      const response = await focusService.getFocusSessions();
      if (response.success && response.data) {
        setSessions(response.data);
      } else {
        setError(response.message || 'Failed to fetch focus sessions');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFocusSessions();
  }, []);

  return { sessions, isLoading, error, refetch: fetchFocusSessions };
};

export default useFocus;
