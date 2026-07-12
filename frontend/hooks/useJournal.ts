import { useState, useEffect } from 'react';
import journalService from '../services/journalService';
import { Journal } from '../types/Journal';

export const useJournal = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJournals = async () => {
    setIsLoading(true);
    try {
      const response = await journalService.getJournals();
      if (response.success && response.data) {
        setJournals(response.data);
      } else {
        setError(response.message || 'Failed to fetch journals');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return { journals, isLoading, error, refetch: fetchJournals };
};

export default useJournal;
