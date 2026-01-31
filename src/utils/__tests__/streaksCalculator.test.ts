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

    describe('date boundary edge cases', () => {
      const boundaryTestCases: [string, string, string[], number][] = [
        ['year boundary', '2024-01-01T12:00:00Z', ['2024-01-01T10:00:00Z', '2023-12-31T10:00:00Z'], 2],
        ['month boundary', '2024-02-01T12:00:00Z', ['2024-02-01T10:00:00Z', '2024-01-31T10:00:00Z'], 2],
        ['leap year Feb 29 to Mar 1', '2024-03-01T12:00:00Z', ['2024-03-01T10:00:00Z', '2024-02-29T10:00:00Z'], 2],
      ];

      test.each(boundaryTestCases)(
        '%s: streak continues correctly',
        (_, today, sessionDates, expectedStreak) => {
          jest.setSystemTime(new Date(today));
          const sessions = sessionDates.map((d) => createSession(new Date(d)));

          const result = calculateStreaks(sessions);

          expect(result.currentStreak).toBe(expectedStreak);
        }
      );
    });

    describe('multiple sessions same day', () => {
      it('should count as 1 day for streak but count all for totalSessions', () => {
        // Use local date construction to avoid timezone issues
        const today = new Date(2024, 2, 15, 12, 0, 0); // March 15, 2024 noon local
        jest.setSystemTime(today);
        const sessions = [
          createSession(new Date(2024, 2, 15, 9, 0, 0)), // 9am local
          createSession(new Date(2024, 2, 15, 12, 0, 0)), // noon local
          createSession(new Date(2024, 2, 15, 18, 0, 0)), // 6pm local
        ];

        const result = calculateStreaks(sessions);

        expect(result.currentStreak).toBe(1);
        expect(result.longestStreak).toBe(1);
        expect(result.totalSessions).toBe(3);
      });

      it('should handle multiple sessions on consecutive days correctly', () => {
        // Use local date construction to avoid timezone issues
        const today = new Date(2024, 2, 15, 12, 0, 0); // March 15, 2024 noon local
        jest.setSystemTime(today);
        const sessions = [
          // 3 sessions today
          createSession(new Date(2024, 2, 15, 9, 0, 0)),
          createSession(new Date(2024, 2, 15, 12, 0, 0)),
          createSession(new Date(2024, 2, 15, 18, 0, 0)),
          // 2 sessions yesterday
          createSession(new Date(2024, 2, 14, 10, 0, 0)),
          createSession(new Date(2024, 2, 14, 20, 0, 0)),
        ];

        const result = calculateStreaks(sessions);

        expect(result.currentStreak).toBe(2);
        expect(result.longestStreak).toBe(2);
        expect(result.totalSessions).toBe(5);
      });
    });
  });

  describe('practicedToday', () => {
    it('should return false for empty array', () => {
      jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));

      const result = practicedToday([]);

      expect(result).toBe(false);
    });

    it('should return true for session today', () => {
      jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
      const sessions = [createSession(new Date('2024-03-15T10:00:00Z'))];

      const result = practicedToday(sessions);

      expect(result).toBe(true);
    });

    it('should return false for session yesterday only', () => {
      jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
      const sessions = [createSession(new Date('2024-03-14T10:00:00Z'))];

      const result = practicedToday(sessions);

      expect(result).toBe(false);
    });

    it('should return true for multiple sessions including today', () => {
      jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
      const sessions = [
        createSession(new Date('2024-03-14T10:00:00Z')),
        createSession(new Date('2024-03-15T10:00:00Z')),
        createSession(new Date('2024-03-13T10:00:00Z')),
      ];

      const result = practicedToday(sessions);

      expect(result).toBe(true);
    });

    it('should detect early morning session as today', () => {
      // Use local date construction to avoid timezone issues
      const today = new Date(2024, 2, 15, 23, 59, 0); // March 15, 2024 11:59pm local
      jest.setSystemTime(today);
      const sessions = [createSession(new Date(2024, 2, 15, 0, 1, 0))]; // 12:01am same day local

      const result = practicedToday(sessions);

      expect(result).toBe(true);
    });

    it('should detect late night session as today', () => {
      // Use local date construction to avoid timezone issues
      const today = new Date(2024, 2, 15, 0, 1, 0); // March 15, 2024 12:01am local
      jest.setSystemTime(today);
      const sessions = [createSession(new Date(2024, 2, 15, 0, 0, 30))]; // 12:00:30am same day local

      const result = practicedToday(sessions);

      expect(result).toBe(true);
    });
  });
});
