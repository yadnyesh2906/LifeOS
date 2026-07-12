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

  const createNote = async (title: string, content: string) => {
    try {
      const response = await noteService.createNote({ title, content });
      if (response.success && response.data) {
        setNotes(prev => [response.data, ...prev]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create note');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const updateNote = async (id: number, updates: Partial<Note>) => {
    try {
      const response = await noteService.updateNote(id, updates);
      if (response.success && response.data) {
        setNotes(prev => prev.map(n => (n.id === id ? response.data : n)));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update note');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const response = await noteService.deleteNote(id);
      if (response.success) {
        setNotes(prev => prev.filter(n => n.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete note');
      }
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    isLoading,
    error,
    refetch: fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
};

export default useNote;
