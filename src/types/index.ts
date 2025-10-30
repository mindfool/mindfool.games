/**
 * Shared TypeScript types for MindFool.Games
 */

export type GameMode = 'balloon-breathing' | 'walking-meditation'; // Will expand in future versions

export interface Session {
  id: string; // timestamp-based ID
  mode: GameMode;
  preScore: number; // 0-10
  postScore: number; // 0-10
  delta: number; // postScore - preScore (negative = improvement)
  duration: number; // milliseconds
  cyclesCompleted: number; // number of breath cycles
  notes?: string; // optional reflection
  timestamp: Date;
}

export interface SessionState {
  sessionId: string | null;
  preScore: number | null;
  postScore: number | null;
  startTime: Date | null;
  endTime: Date | null;
  mode: GameMode;

  // Actions
  startSession: (preScore: number, mode?: GameMode) => void;
  endSession: (postScore: number, notes?: string) => void;
  resetSession: () => void;
}

export interface HistoryState {
  sessions: Session[];

  // Actions
  addSession: (session: Session) => void;
  getSessions: () => Session[];
  getLastSession: () => Session | null;
  clearHistory: () => void; // For testing
}

export type BreathPhase = 'inhale' | 'exhale';

export interface BreathTimerCallbacks {
  onInhale: () => void;
  onExhale: () => void;
}
