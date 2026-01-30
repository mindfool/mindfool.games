import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryState, Session } from '../types';

/**
 * History Store - Persists session history to AsyncStorage
 * Sessions survive app restarts for streak tracking
 */
export const useHistoryStore = create(
  persist<HistoryState>(
    (set, get) => ({
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
    }),
    {
      name: 'mindfool-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
