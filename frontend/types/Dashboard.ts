export interface DashboardDTO {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalHabits: number;
  totalGoals: number;
  completedGoals: number;
  totalNotes: number;
  totalJournals: number;
  totalReminders: number;
  todayMood: string | null;
}

export default DashboardDTO;
