import { calculateStreaks, practicedToday, StreakInfo } from '../streaksCalculator';
import type { Session } from '../../types';

/**
 * Helper function to create a valid mock session with the given timestamp
 */
function createSession(date: Date): Session {
  return {
    id: `session-${date.getTime()}`,
    mode: 'balloon-breathing',
    preScore: 7,
    postScore: 4,
    delta: -3,
    duration: 60000,
    cyclesCompleted: 5,
    timestamp: date,
  };
}

describe('streaksCalculator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('calculateStreaks', () => {
    describe('empty history', () => {
      it('should return zeros for empty session array', () => {
        const result = calculateStreaks([]);

        expect(result).toEqual({
          currentStreak: 0,
          longestStreak: 0,
          totalSessions: 0,
          lastSessionDate: null,
        });
      });
    });

    describe('current streak - basic cases', () => {
      it('should return streak of 1 for session today only', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [createSession(new Date('2024-03-15T10:00:00Z'))];

        const result = calculateStreaks(sessions);

        expect(result.currentStreak).toBe(1);
        expect(result.longestStreak).toBe(1);
        expect(result.totalSessions).toBe(1);
      });

      it('should return streak of 1 for session yesterday only (streak not broken yet)', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [createSession(new Date('2024-03-14T10:00:00Z'))];

        const result = calculateStreaks(sessions);

        expect(result.currentStreak).toBe(1);
        expect(result.longestStreak).toBe(1);
        expect(result.totalSessions).toBe(1);
      });

      it('should return streak of 0 for session 2+ days ago only (broken)', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [createSession(new Date('2024-03-13T10:00:00Z'))];

        const result = calculateStreaks(sessions);

        expect(result.currentStreak).toBe(0);
        expect(result.longestStreak).toBe(1);
        expect(result.totalSessions).toBe(1);
      });

      it('should return streak of 3 for sessions today + yesterday + day before', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [
          createSession(new Date('2024-03-15T10:00:00Z')),
          createSession(new Date('2024-03-14T10:00:00Z')),
          createSession(new Date('2024-03-13T10:00:00Z')),
        ];

        const result = calculateStreaks(sessions);

        expect(result.currentStreak).toBe(3);
        expect(result.longestStreak).toBe(3);
        expect(result.totalSessions).toBe(3);
      });
    });

    describe('current streak - gap handling', () => {
      it('should return streak of 1 for sessions today and 2 days ago (gap breaks streak)', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [
          createSession(new Date('2024-03-15T10:00:00Z')),
          createSession(new Date('2024-03-13T10:00:00Z')),
        ];

        const result = calculateStreaks(sessions);

        expect(result.currentStreak).toBe(1);
        expect(result.longestStreak).toBe(1);
        expect(result.totalSessions).toBe(2);
      });

      it('should return streak of 1 for sessions yesterday and 3 days ago', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [
          createSession(new Date('2024-03-14T10:00:00Z')),
          createSession(new Date('2024-03-12T10:00:00Z')),
        ];

        const result = calculateStreaks(sessions);

        expect(result.currentStreak).toBe(1);
        expect(result.longestStreak).toBe(1);
        expect(result.totalSessions).toBe(2);
      });
    });

    describe('longest streak', () => {
      it('should return longest streak of 1 for single session', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [createSession(new Date('2024-03-15T10:00:00Z'))];

        const result = calculateStreaks(sessions);

        expect(result.longestStreak).toBe(1);
      });

      it('should return longest streak of 3 for three consecutive days', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [
          createSession(new Date('2024-03-15T10:00:00Z')),
          createSession(new Date('2024-03-14T10:00:00Z')),
          createSession(new Date('2024-03-13T10:00:00Z')),
        ];

        const result = calculateStreaks(sessions);

        expect(result.longestStreak).toBe(3);
      });

      it('should return longest streak of 2 for two separate 2-day streaks', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [
          // Recent 2-day streak
          createSession(new Date('2024-03-15T10:00:00Z')),
          createSession(new Date('2024-03-14T10:00:00Z')),
          // Older 2-day streak with gap
          createSession(new Date('2024-03-10T10:00:00Z')),
          createSession(new Date('2024-03-09T10:00:00Z')),
        ];

        const result = calculateStreaks(sessions);

        expect(result.longestStreak).toBe(2);
        expect(result.currentStreak).toBe(2);
      });

      it('should track longest streak separately from current streak', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [
          // Current streak of 1
          createSession(new Date('2024-03-15T10:00:00Z')),
          // Gap
          // Older streak of 5
          createSession(new Date('2024-03-10T10:00:00Z')),
          createSession(new Date('2024-03-09T10:00:00Z')),
          createSession(new Date('2024-03-08T10:00:00Z')),
          createSession(new Date('2024-03-07T10:00:00Z')),
          createSession(new Date('2024-03-06T10:00:00Z')),
        ];

        const result = calculateStreaks(sessions);

        expect(result.currentStreak).toBe(1);
        expect(result.longestStreak).toBe(5);
      });
    });

    describe('lastSessionDate', () => {
      it('should return the most recent session date', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [
          createSession(new Date('2024-03-15T10:00:00Z')),
          createSession(new Date('2024-03-14T10:00:00Z')),
        ];

        const result = calculateStreaks(sessions);

        expect(result.lastSessionDate).toEqual(new Date('2024-03-15T10:00:00Z'));
      });

      it('should return correct lastSessionDate regardless of input order', () => {
        jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
        const sessions = [
          createSession(new Date('2024-03-10T10:00:00Z')),
          createSession(new Date('2024-03-15T10:00:00Z')),
          createSession(new Date('2024-03-12T10:00:00Z')),
        ];

        const result = calculateStreaks(sessions);

        expect(result.lastSessionDate).toEqual(new Date('2024-03-15T10:00:00Z'));
      });
    });
  });
});
