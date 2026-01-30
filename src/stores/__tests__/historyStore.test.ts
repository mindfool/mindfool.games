import { useHistoryStore } from '../historyStore';
import { resetAllStores, clearMockStorage } from '../testUtils';
import type { Session } from '../../types';

describe('historyStore', () => {
  beforeEach(() => {
    resetAllStores();
    clearMockStorage();
  });

  const createMockSession = (overrides: Partial<Session> = {}): Session => ({
    id: `session-${Date.now()}`,
    mode: 'balloon-breathing',
    preScore: 7,
    postScore: 4,
    delta: -3,
    duration: 60000,
    cyclesCompleted: 5,
    timestamp: new Date(),
    ...overrides,
  });

  describe('initial state', () => {
    it('should start with empty sessions array', () => {
      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toEqual([]);
    });
  });

  describe('addSession', () => {
    it('should add a session to the store', () => {
      const session = createMockSession({ id: 'test-session-1' });

      useHistoryStore.getState().addSession(session);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].id).toBe('test-session-1');
    });

    it('should add new sessions at the beginning (newest first)', () => {
      const session1 = createMockSession({ id: 'first' });
      const session2 = createMockSession({ id: 'second' });

      useHistoryStore.getState().addSession(session1);
      useHistoryStore.getState().addSession(session2);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions[0].id).toBe('second');
      expect(sessions[1].id).toBe('first');
    });

    it('should maintain correct ordering with multiple sessions', () => {
      const session1 = createMockSession({ id: 'first', timestamp: new Date('2024-01-01T10:00:00Z') });
      const session2 = createMockSession({ id: 'second', timestamp: new Date('2024-01-01T11:00:00Z') });
      const session3 = createMockSession({ id: 'third', timestamp: new Date('2024-01-01T12:00:00Z') });
      const session4 = createMockSession({ id: 'fourth', timestamp: new Date('2024-01-01T13:00:00Z') });
      const session5 = createMockSession({ id: 'fifth', timestamp: new Date('2024-01-01T14:00:00Z') });

      useHistoryStore.getState().addSession(session1);
      useHistoryStore.getState().addSession(session2);
      useHistoryStore.getState().addSession(session3);
      useHistoryStore.getState().addSession(session4);
      useHistoryStore.getState().addSession(session5);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toHaveLength(5);
      expect(sessions[0].id).toBe('fifth');
      expect(sessions[1].id).toBe('fourth');
      expect(sessions[2].id).toBe('third');
      expect(sessions[3].id).toBe('second');
      expect(sessions[4].id).toBe('first');
    });

    it('should allow multiple sessions with same mode', () => {
      const session1 = createMockSession({ id: 'balloon-1', mode: 'balloon-breathing' });
      const session2 = createMockSession({ id: 'balloon-2', mode: 'balloon-breathing' });
      const session3 = createMockSession({ id: 'balloon-3', mode: 'balloon-breathing' });

      useHistoryStore.getState().addSession(session1);
      useHistoryStore.getState().addSession(session2);
      useHistoryStore.getState().addSession(session3);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toHaveLength(3);
      expect(sessions.every((s) => s.mode === 'balloon-breathing')).toBe(true);
      expect(sessions[0].id).toBe('balloon-3');
      expect(sessions[1].id).toBe('balloon-2');
      expect(sessions[2].id).toBe('balloon-1');
    });

    it('should preserve session notes field', () => {
      const sessionWithNotes = createMockSession({
        id: 'session-with-notes',
        notes: 'Felt very relaxed after this session',
      });

      useHistoryStore.getState().addSession(sessionWithNotes);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions[0].notes).toBe('Felt very relaxed after this session');
    });

    it('should handle large history without performance issues', () => {
      // Add 50 sessions
      for (let i = 0; i < 50; i++) {
        useHistoryStore.getState().addSession(
          createMockSession({ id: `session-${i}`, timestamp: new Date(`2024-01-01T${String(i).padStart(2, '0')}:00:00Z`) })
        );
      }

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toHaveLength(50);
      expect(sessions[0].id).toBe('session-49'); // Newest
      expect(sessions[49].id).toBe('session-0'); // Oldest
    });
  });

  describe('getSessions', () => {
    it('should return all sessions', () => {
      const session1 = createMockSession({ id: 'a' });
      const session2 = createMockSession({ id: 'b' });
      const session3 = createMockSession({ id: 'c' });

      useHistoryStore.getState().addSession(session1);
      useHistoryStore.getState().addSession(session2);
      useHistoryStore.getState().addSession(session3);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toHaveLength(3);
    });
  });

  describe('getLastSession', () => {
    it('should return null when no sessions exist', () => {
      const lastSession = useHistoryStore.getState().getLastSession();
      expect(lastSession).toBeNull();
    });

    it('should return the most recent session', () => {
      const session1 = createMockSession({ id: 'older' });
      const session2 = createMockSession({ id: 'newer' });

      useHistoryStore.getState().addSession(session1);
      useHistoryStore.getState().addSession(session2);

      const lastSession = useHistoryStore.getState().getLastSession();
      expect(lastSession?.id).toBe('newer');
    });
  });

  describe('clearHistory', () => {
    it('should remove all sessions', () => {
      useHistoryStore.getState().addSession(createMockSession());
      useHistoryStore.getState().addSession(createMockSession());

      useHistoryStore.getState().clearHistory();

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toEqual([]);
    });
  });

  describe('persist configuration', () => {
    it('should have persist middleware configured', () => {
      // Verify the store has persist API (indicates middleware is applied)
      const store = useHistoryStore;
      expect(store.persist).toBeDefined();
      expect(store.persist.getOptions().name).toBe('mindfool-history');
    });

    it('should use correct storage key for persistence', () => {
      const store = useHistoryStore;
      const options = store.persist.getOptions();
      expect(options.name).toBe('mindfool-history');
    });

    it('should have rehydrate method available', () => {
      const store = useHistoryStore;
      expect(store.persist.rehydrate).toBeDefined();
      expect(typeof store.persist.rehydrate).toBe('function');
    });

    it('should clear store state when clearHistory is called', () => {
      // Add sessions
      useHistoryStore.getState().addSession(createMockSession({ id: 'session-1' }));
      useHistoryStore.getState().addSession(createMockSession({ id: 'session-2' }));
      useHistoryStore.getState().addSession(createMockSession({ id: 'session-3' }));

      expect(useHistoryStore.getState().getSessions()).toHaveLength(3);

      // Clear history
      useHistoryStore.getState().clearHistory();

      // Verify state is cleared
      expect(useHistoryStore.getState().getSessions()).toEqual([]);
      expect(useHistoryStore.getState().getLastSession()).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle sessions with undefined optional fields', () => {
      const minimalSession = createMockSession({
        id: 'minimal',
        notes: undefined,
      });

      useHistoryStore.getState().addSession(minimalSession);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions[0].id).toBe('minimal');
      expect(sessions[0].notes).toBeUndefined();
    });

    it('should maintain data integrity after multiple operations', () => {
      // Add some sessions
      useHistoryStore.getState().addSession(createMockSession({ id: 'a' }));
      useHistoryStore.getState().addSession(createMockSession({ id: 'b' }));
      expect(useHistoryStore.getState().getSessions()).toHaveLength(2);

      // Clear
      useHistoryStore.getState().clearHistory();
      expect(useHistoryStore.getState().getSessions()).toHaveLength(0);

      // Add again
      useHistoryStore.getState().addSession(createMockSession({ id: 'c' }));
      useHistoryStore.getState().addSession(createMockSession({ id: 'd' }));
      expect(useHistoryStore.getState().getSessions()).toHaveLength(2);
      expect(useHistoryStore.getState().getSessions()[0].id).toBe('d');
    });

    it('should handle rapid consecutive additions', () => {
      const sessions = [];
      for (let i = 0; i < 10; i++) {
        const session = createMockSession({ id: `rapid-${i}` });
        sessions.push(session);
        useHistoryStore.getState().addSession(session);
      }

      const storedSessions = useHistoryStore.getState().getSessions();
      expect(storedSessions).toHaveLength(10);
      expect(storedSessions[0].id).toBe('rapid-9');
      expect(storedSessions[9].id).toBe('rapid-0');
    });
  });
});
