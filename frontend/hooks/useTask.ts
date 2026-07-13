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

  const createTask = async (title: string, description: string | null, dueDate: string | null) => {
    try {
      const response = await taskService.createTask({
        title,
        description,
        dueDate,
      });
      if (response.success && response.data) {
        setTasks(prev => [response.data, ...prev]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create task');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const response = await taskService.updateTask(id, updates);
      if (response.success && response.data) {
        setTasks(prev => prev.map(t => t.id === id ? response.data : t));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update task');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const completeTask = async (id: number) => {
    try {
      const response = await taskService.completeTask(id);
      if (response.success && response.data) {
        setTasks(prev => prev.map(t => t.id === id ? response.data : t));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to complete task');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await taskService.deleteTask(id);
      if (response.success) {
        setTasks(prev => prev.filter(t => t.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete task');
      }
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
  };
};

export default useTask;
