import { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import { Task } from '../types/Task';

export const useTask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await taskService.getTasks();
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setError(response.message || 'Failed to fetch tasks');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, isLoading, error, refetch: fetchTasks };
};

export default useTask;
