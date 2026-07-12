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

  const createJournal = async (title: string, content: string) => {
    try {
      const response = await journalService.createJournal({ title, content });
      if (response.success && response.data) {
        setJournals(prev => [response.data, ...prev]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create journal');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const updateJournal = async (id: number, updates: Partial<Journal>) => {
    try {
      const response = await journalService.updateJournal(id, updates);
      if (response.success && response.data) {
        setJournals(prev => prev.map(j => (j.id === id ? response.data : j)));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update journal');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const deleteJournal = async (id: number) => {
    try {
      const response = await journalService.deleteJournal(id);
      if (response.success) {
        setJournals(prev => prev.filter(j => j.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete journal');
      }
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return {
    journals,
    isLoading,
    error,
    refetch: fetchJournals,
    createJournal,
    updateJournal,
    deleteJournal,
  };
};

export default useJournal;
