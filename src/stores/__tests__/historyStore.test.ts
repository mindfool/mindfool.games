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
  });
});
