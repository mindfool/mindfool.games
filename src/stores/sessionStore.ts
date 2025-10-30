import { create } from 'zustand';
import { SessionState, GameMode, Session } from '../types';
import { useHistoryStore } from './historyStore';

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionId: null,
  preScore: null,
  postScore: null,
  startTime: null,
  endTime: null,
  mode: 'balloon-breathing',

  startSession: (preScore: number, mode: GameMode = 'balloon-breathing') => {
    const sessionId = Date.now().toString();
    set({
      sessionId,
      preScore,
      postScore: null,
      startTime: new Date(),
      endTime: null,
      mode,
    });
  },

  endSession: (postScore: number, notes?: string) => {
    const state = get();
    if (!state.sessionId || !state.preScore || !state.startTime) {
      console.error('Cannot end session: session not started');
      return;
    }

    const endTime = new Date();
    set({
      postScore,
      endTime,
    });

    // Save completed session to history
    const session: Session = {
      id: state.sessionId,
      mode: state.mode,
      preScore: state.preScore,
      postScore,
      delta: postScore - state.preScore,
      duration: endTime.getTime() - state.startTime.getTime(),
      cyclesCompleted: 0, // Will be updated when breath timer is implemented
      notes,
      timestamp: endTime,
    };

    useHistoryStore.getState().addSession(session);
  },

  resetSession: () => {
    set({
      sessionId: null,
      preScore: null,
      postScore: null,
      startTime: null,
      endTime: null,
    });
  },
}));
