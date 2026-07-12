import { useState, useEffect } from 'react';
import reminderService from '../services/reminderService';
import { Reminder } from '../types/Reminder';

export const useReminder = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = async () => {
    setIsLoading(true);
    try {
      const response = await reminderService.getReminders();
      if (response.success && response.data) {
        setReminders(response.data);
      } else {
        setError(response.message || 'Failed to fetch reminders');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return { reminders, isLoading, error, refetch: fetchReminders };
};

export default useReminder;
