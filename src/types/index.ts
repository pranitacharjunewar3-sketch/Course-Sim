export interface SimFile {
  id: string;
  name: string;
  type: 'structured' | 'unstructured';
  extension: string;
  size?: number;
  detected?: boolean;
}

export interface ChallengeQuestion {
  fileName: string;
  correctAnswer: 'structured' | 'unstructured';
  reason: string;
  icon: string;
}

export type Screen = 
  | 'intro' 
  | 'data-types' 
  | 'structured' 
  | 'unstructured' 
  | 'simulation'
  | 'challenge'
  | 'final-sim'
  | 'summary'
  | 'programming'
  | 'algorithms'
  | 'ml';

export interface DroppedItem {
  id: string;
  name: string;
  type: 'structured' | 'unstructured';
  timestamp: number;
}

export type Theme = 'light' | 'dark';
