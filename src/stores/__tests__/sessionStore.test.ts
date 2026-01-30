import { useSessionStore } from '../sessionStore';
import { useHistoryStore } from '../historyStore';
import { resetAllStores, clearMockStorage } from '../testUtils';
import type { GameMode } from '../../types';

describe('sessionStore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
    resetAllStores();
    clearMockStorage();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('should start with null session values', () => {
      const state = useSessionStore.getState();
      expect(state.sessionId).toBeNull();
      expect(state.preScore).toBeNull();
      expect(state.postScore).toBeNull();
      expect(state.startTime).toBeNull();
      expect(state.endTime).toBeNull();
    });

    it('should have default mode of balloon-breathing', () => {
      const state = useSessionStore.getState();
      expect(state.mode).toBe('balloon-breathing');
    });
  });

  describe('startSession', () => {
    it('should set sessionId to truthy value', () => {
      useSessionStore.getState().startSession(7);
      const state = useSessionStore.getState();
      expect(state.sessionId).toBeTruthy();
      expect(state.sessionId).not.toBeNull();
    });

    it('should set preScore to provided value', () => {
      useSessionStore.getState().startSession(8);
      const state = useSessionStore.getState();
      expect(state.preScore).toBe(8);
    });

    it('should set postScore to null (not completed yet)', () => {
      useSessionStore.getState().startSession(7);
      const state = useSessionStore.getState();
      expect(state.postScore).toBeNull();
    });

    it('should set startTime to current Date', () => {
      useSessionStore.getState().startSession(7);
      const state = useSessionStore.getState();
      expect(state.startTime).toBeInstanceOf(Date);
      expect(state.startTime?.toISOString()).toBe('2024-03-15T12:00:00.000Z');
    });

    it('should set endTime to null', () => {
      useSessionStore.getState().startSession(7);
      const state = useSessionStore.getState();
      expect(state.endTime).toBeNull();
    });

    it('should use balloon-breathing when mode not specified', () => {
      useSessionStore.getState().startSession(7);
      const state = useSessionStore.getState();
      expect(state.mode).toBe('balloon-breathing');
    });

    it('should accept box-breathing mode', () => {
      useSessionStore.getState().startSession(7, 'box-breathing');
      const state = useSessionStore.getState();
      expect(state.mode).toBe('box-breathing');
    });

    it('should accept 478-breathing mode', () => {
      useSessionStore.getState().startSession(6, '478-breathing');
      const state = useSessionStore.getState();
      expect(state.mode).toBe('478-breathing');
    });

    it('should accept walking-meditation mode', () => {
      useSessionStore.getState().startSession(5, 'walking-meditation');
      const state = useSessionStore.getState();
      expect(state.mode).toBe('walking-meditation');
    });

    it('should overwrite previous session state when starting new session', () => {
      // Start first session
      useSessionStore.getState().startSession(7, 'balloon-breathing');
      const firstSessionId = useSessionStore.getState().sessionId;

      // Advance time to ensure different sessionId
      jest.advanceTimersByTime(100);

      // Start second session
      useSessionStore.getState().startSession(5, 'box-breathing');
      const state = useSessionStore.getState();

      expect(state.sessionId).not.toBe(firstSessionId);
      expect(state.preScore).toBe(5);
      expect(state.mode).toBe('box-breathing');
      expect(state.postScore).toBeNull();
    });
  });

  describe('endSession', () => {
    it('should set postScore and endTime', () => {
      useSessionStore.getState().startSession(7);
      jest.advanceTimersByTime(60000); // 1 minute
      useSessionStore.getState().endSession(4);

      const state = useSessionStore.getState();
      expect(state.postScore).toBe(4);
      expect(state.endTime).toBeInstanceOf(Date);
      expect(state.endTime?.toISOString()).toBe('2024-03-15T12:01:00.000Z');
    });

    it('should calculate delta correctly (postScore - preScore)', () => {
      useSessionStore.getState().startSession(7);
      useSessionStore.getState().endSession(4);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].delta).toBe(-3); // 4 - 7 = -3 (negative means improvement)
    });

    it('should save session to historyStore', () => {
      useSessionStore.getState().startSession(7, 'balloon-breathing');
      const sessionId = useSessionStore.getState().sessionId;

      useSessionStore.getState().endSession(4);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].id).toBe(sessionId);
      expect(sessions[0].mode).toBe('balloon-breathing');
      expect(sessions[0].preScore).toBe(7);
      expect(sessions[0].postScore).toBe(4);
    });

    it('should save session with notes when provided', () => {
      useSessionStore.getState().startSession(7);
      useSessionStore.getState().endSession(4, 'Felt much calmer');

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].notes).toBe('Felt much calmer');
    });

    it('should calculate duration correctly', () => {
      useSessionStore.getState().startSession(7);
      jest.advanceTimersByTime(60000); // 1 minute = 60000ms
      useSessionStore.getState().endSession(4);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].duration).toBe(60000);
    });

    it('should calculate duration for longer sessions', () => {
      useSessionStore.getState().startSession(8);
      jest.advanceTimersByTime(180000); // 3 minutes = 180000ms
      useSessionStore.getState().endSession(3);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions[0].duration).toBe(180000);
    });

    it('should not end session if not started - logs error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      useSessionStore.getState().endSession(4);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Cannot end session: session not started'
      );
      expect(useSessionStore.getState().postScore).toBeNull();
      expect(useHistoryStore.getState().getSessions()).toHaveLength(0);

      consoleSpy.mockRestore();
    });

    it('should set timestamp to endTime in saved session', () => {
      useSessionStore.getState().startSession(7);
      jest.advanceTimersByTime(60000);
      useSessionStore.getState().endSession(4);

      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions[0].timestamp).toBeInstanceOf(Date);
      expect(sessions[0].timestamp.toISOString()).toBe('2024-03-15T12:01:00.000Z');
    });
  });

  describe('resetSession', () => {
    it('should clear sessionId to null', () => {
      useSessionStore.getState().startSession(7);
      expect(useSessionStore.getState().sessionId).not.toBeNull();

      useSessionStore.getState().resetSession();
      expect(useSessionStore.getState().sessionId).toBeNull();
    });

    it('should clear preScore to null', () => {
      useSessionStore.getState().startSession(7);
      expect(useSessionStore.getState().preScore).toBe(7);

      useSessionStore.getState().resetSession();
      expect(useSessionStore.getState().preScore).toBeNull();
    });

    it('should clear startTime to null', () => {
      useSessionStore.getState().startSession(7);
      expect(useSessionStore.getState().startTime).not.toBeNull();

      useSessionStore.getState().resetSession();
      expect(useSessionStore.getState().startTime).toBeNull();
    });

    it('should clear postScore and endTime after completed session', () => {
      useSessionStore.getState().startSession(7);
      useSessionStore.getState().endSession(4);

      expect(useSessionStore.getState().postScore).toBe(4);
      expect(useSessionStore.getState().endTime).not.toBeNull();

      useSessionStore.getState().resetSession();

      expect(useSessionStore.getState().postScore).toBeNull();
      expect(useSessionStore.getState().endTime).toBeNull();
    });

    it('should NOT affect historyStore (history persists)', () => {
      useSessionStore.getState().startSession(7);
      useSessionStore.getState().endSession(4);

      expect(useHistoryStore.getState().getSessions()).toHaveLength(1);

      useSessionStore.getState().resetSession();

      // History should still contain the session
      expect(useHistoryStore.getState().getSessions()).toHaveLength(1);
    });

    it('should allow starting a new session after reset', () => {
      useSessionStore.getState().startSession(7);
      useSessionStore.getState().resetSession();

      useSessionStore.getState().startSession(6, 'box-breathing');

      const state = useSessionStore.getState();
      expect(state.sessionId).not.toBeNull();
      expect(state.preScore).toBe(6);
      expect(state.mode).toBe('box-breathing');
    });
  });

  describe('complete session workflow', () => {
    it('should handle full session lifecycle correctly', () => {
      // Start session
      useSessionStore.getState().startSession(8, 'balloon-breathing');
      expect(useSessionStore.getState().sessionId).toBeTruthy();
      expect(useSessionStore.getState().preScore).toBe(8);

      // Simulate practice duration
      jest.advanceTimersByTime(120000); // 2 minutes

      // End session
      useSessionStore.getState().endSession(3, 'Great practice');

      // Verify session state
      const sessionState = useSessionStore.getState();
      expect(sessionState.postScore).toBe(3);
      expect(sessionState.endTime).toBeTruthy();

      // Verify history
      const sessions = useHistoryStore.getState().getSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].preScore).toBe(8);
      expect(sessions[0].postScore).toBe(3);
      expect(sessions[0].delta).toBe(-5);
      expect(sessions[0].duration).toBe(120000);
      expect(sessions[0].notes).toBe('Great practice');

      // Reset for next session
      useSessionStore.getState().resetSession();
      expect(useSessionStore.getState().sessionId).toBeNull();
      expect(useHistoryStore.getState().getSessions()).toHaveLength(1);
    });
  });
});
