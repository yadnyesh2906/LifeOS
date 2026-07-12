export interface Goal {
  id: number;
  title: string;
  description: string | null;
  targetDate: string | null;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export default Goal;
