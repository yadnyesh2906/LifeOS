import { useState, useEffect } from 'react';
import noteService from '../services/noteService';
import { Note } from '../types/Note';

export const useNote = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await noteService.getNotes();
      if (response.success && response.data) {
        setNotes(response.data);
      } else {
        setError(response.message || 'Failed to fetch notes');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return { notes, isLoading, error, refetch: fetchNotes };
};

export default useNote;
