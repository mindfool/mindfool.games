import { create } from 'zustand';
import type { HistoryState, Session } from '../types';

/**
 * History Store - Simple in-memory version for testing
 * Persistence temporarily disabled to diagnose Metro bundler issue
 */
export const useHistoryStore = create<HistoryState>((set, get) => ({
  sessions: [],

  // Add a new session to history
  addSession: (session: Session) => {
    set((state) => ({
      sessions: [session, ...state.sessions], // Newest first
    }));
  },

  // Get all sessions
  getSessions: () => {
    return get().sessions;
  },

  // Get the most recent session
  getLastSession: () => {
    const sessions = get().sessions;
    return sessions.length > 0 ? sessions[0] : null;
  },

  // Clear all history (for testing/debugging)
  clearHistory: () => {
    set({ sessions: [] });
  },
}));
