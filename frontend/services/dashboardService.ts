import { ApiResponse } from '../types/ApiResponse';
import { DashboardDTO } from '../types/Dashboard';
import storage from '../utils/storage';

const TASKS_KEY = 'lifeos_tasks';
const HABITS_KEY = 'lifeos_habits';
const GOALS_KEY = 'lifeos_goals';
const NOTES_KEY = 'lifeos_notes';
const JOURNALS_KEY = 'lifeos_journals';
const REMINDERS_KEY = 'lifeos_reminders';
const MOODS_KEY = 'lifeos_moods';

export const dashboardService = {
  async getDashboardData(): Promise<ApiResponse<DashboardDTO>> {
    try {
      const [
        tasksJson,
        habitsJson,
        goalsJson,
        notesJson,
        journalsJson,
        remindersJson,
        moodsJson,
      ] = await Promise.all([
        storage.getItem(TASKS_KEY),
        storage.getItem(HABITS_KEY),
        storage.getItem(GOALS_KEY),
        storage.getItem(NOTES_KEY),
        storage.getItem(JOURNALS_KEY),
        storage.getItem(REMINDERS_KEY),
        storage.getItem(MOODS_KEY),
      ]);

      const tasks = tasksJson ? JSON.parse(tasksJson) : [];
      const habits = habitsJson ? JSON.parse(habitsJson) : [];
      const goals = goalsJson ? JSON.parse(goalsJson) : [];
      const notes = notesJson ? JSON.parse(notesJson) : [];
      const journals = journalsJson ? JSON.parse(journalsJson) : [];
      const reminders = remindersJson ? JSON.parse(remindersJson) : [];
      const moods = moodsJson ? JSON.parse(moodsJson) : [];

      const todayStr = new Date().toISOString().split('T')[0];
      const todayMoodRecord = moods.find((m: any) => m.loggedAt && m.loggedAt.startsWith(todayStr));
      const todayMood = todayMoodRecord ? todayMoodRecord.moodState : null;

      const dashboardData: DashboardDTO = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t: any) => t.completed).length,
        pendingTasks: tasks.filter((t: any) => !t.completed).length,
        totalHabits: habits.length,
        totalGoals: goals.length,
        completedGoals: goals.filter((g: any) => g.completed).length,
        totalNotes: notes.length,
        totalJournals: journals.length,
        totalReminders: reminders.length,
        todayMood: todayMood,
      };

      return {
        success: true,
        message: 'Dashboard data fetched successfully',
        data: dashboardData,
      };
    } catch (e: any) {
      console.error('Error fetching dashboard statistics locally:', e);
      return {
        success: false,
        message: e.message || 'Error compiling dashboard statistics',
        data: {
          totalTasks: 0,
          completedTasks: 0,
          pendingTasks: 0,
          totalHabits: 0,
          totalGoals: 0,
          completedGoals: 0,
          totalNotes: 0,
          totalJournals: 0,
          totalReminders: 0,
          todayMood: null,
        },
      };
    }
  },
};

export default dashboardService;
