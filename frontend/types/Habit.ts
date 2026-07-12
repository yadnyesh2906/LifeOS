export interface Habit {
  id: number;
  title: string;
  frequency: string;
  streak: number;
  completedToday: boolean;
}

export default Habit;
