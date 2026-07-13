import { ApiResponse } from '../types/ApiResponse';
import { Task } from '../types/Task';
import storage from '../utils/storage';

const TASKS_KEY = 'lifeos_tasks';

export const taskService = {
  async getTasks(): Promise<ApiResponse<Task[]>> {
    const tasksJson = await storage.getItem(TASKS_KEY);
    const tasks: Task[] = tasksJson ? JSON.parse(tasksJson) : [];
    return {
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    };
  },

  async createTask(task: Partial<Task>): Promise<ApiResponse<Task>> {
    const tasksJson = await storage.getItem(TASKS_KEY);
    const tasks: Task[] = tasksJson ? JSON.parse(tasksJson) : [];
    
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTask: Task = {
      id: newId,
      title: task.title || '',
      description: task.description || '',
      completed: false,
      priority: task.priority || 'MEDIUM',
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ...task,
    };

    tasks.push(newTask);
    await storage.setItem(TASKS_KEY, JSON.stringify(tasks));

    return {
      success: true,
      message: 'Task created successfully',
      data: newTask,
    };
  },

  async updateTask(id: number, task: Partial<Task>): Promise<ApiResponse<Task>> {
    const tasksJson = await storage.getItem(TASKS_KEY);
    let tasks: Task[] = tasksJson ? JSON.parse(tasksJson) : [];
    
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Task not found',
        data: null as any,
      };
    }

    const updatedTask = {
      ...tasks[index],
      ...task,
    };
    tasks[index] = updatedTask;
    await storage.setItem(TASKS_KEY, JSON.stringify(tasks));

    return {
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    };
  },

  async completeTask(id: number): Promise<ApiResponse<Task>> {
    const tasksJson = await storage.getItem(TASKS_KEY);
    let tasks: Task[] = tasksJson ? JSON.parse(tasksJson) : [];
    
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Task not found',
        data: null as any,
      };
    }

    const updatedTask = {
      ...tasks[index],
      completed: !tasks[index].completed,
    };
    tasks[index] = updatedTask;
    await storage.setItem(TASKS_KEY, JSON.stringify(tasks));

    return {
      success: true,
      message: 'Task completion toggled successfully',
      data: updatedTask,
    };
  },

  async deleteTask(id: number): Promise<ApiResponse<void>> {
    const tasksJson = await storage.getItem(TASKS_KEY);
    let tasks: Task[] = tasksJson ? JSON.parse(tasksJson) : [];
    
    const filteredTasks = tasks.filter(t => t.id !== id);
    await storage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));

    return {
      success: true,
      message: 'Task deleted successfully',
      data: undefined,
    };
  },
};

export default taskService;
