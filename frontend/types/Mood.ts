export interface Mood {
  id: number;
  moodState: 'HAPPY' | 'SAD' | 'PRODUCTIVE' | 'NEUTRAL';
  note: string | null;
  createdAt: string;
}

export default Mood;
