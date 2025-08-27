

export interface ChildProfile {
  id: string;
  nickname: string;
  age: number;
  grade: 'K' | '1' | '2' | '3';
  createdAt: Date;
  lastPlayed?: Date;
  subscriptionStatus?: 'free' | 'premium';
}

export interface MathFact {
  id: string;
  type: 'addition' | 'subtraction';
  a: number;
  b: number;
  answer: number;
  difficulty: number;
  factFamily: string;
  commonCoreStandard?: string;
}

export interface SessionResult {
  factId: string;
  correct: boolean;
  responseTime: number;
  timestamp: Date;
}

export interface LearningSession {
  id: string;
  childId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  results: SessionResult[];
}

export interface ProgressSummary {
  childId: string;
  totalSessions: number;
  totalMinutes: number;
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  factMastery: Record<string, number>; // factFamily -> mastery score (0-100)
  lastUpdated: Date;
}

export interface SyncState {
  lastSync: Date | null;
  pendingChanges: boolean;
  subscriptionActive: boolean;
}

export interface ExportData {
  version: string;
  childProfiles: ChildProfile[];
  learningSessions: LearningSession[];
  progressSummaries: ProgressSummary[];
  exportedAt: Date;
}

