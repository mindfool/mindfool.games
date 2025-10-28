import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryState, Session } from '../types';

/**
 * History Store - Persists session history to AsyncStorage
 *
 * This store manages all completed sessions with automatic persistence.
 * Sessions are stored chronologically (newest first).
 */
export const useHistoryStore = create<HistoryState>()(
  persist(
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
      name: 'mindfool-history', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),

      // Custom serialization for Date objects
      partialize: (state) => ({
        sessions: state.sessions.map((session) => ({
          ...session,
          timestamp: session.timestamp.toISOString(),
        })),
      }),

      // Custom deserialization for Date objects
      merge: (persistedState, currentState) => {
        const persisted = persistedState as any;
        return {
          ...currentState,
          sessions: (persisted?.sessions || []).map((session: any) => ({
            ...session,
            timestamp: new Date(session.timestamp),
          })),
        };
      },
    }
  )
);
