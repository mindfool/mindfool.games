import { Session } from '../types';

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  lastSessionDate: Date | null;
}

/**
 * Calculate streak information from session history
 */
export function calculateStreaks(sessions: Session[]): StreakInfo {
  if (sessions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalSessions: 0,
      lastSessionDate: null,
    };
  }

  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const totalSessions = sortedSessions.length;
  const lastSessionDate = new Date(sortedSessions[0].timestamp);

  // Get unique days with sessions
  const sessionDays = new Set<string>();
  sortedSessions.forEach((session) => {
    const dateStr = getDateString(new Date(session.timestamp));
    sessionDays.add(dateStr);
  });

  const uniqueDays = Array.from(sessionDays).sort().reverse();

  // Calculate current streak
  let currentStreak = 0;
  const today = getDateString(new Date());
  const yesterday = getDateString(getYesterday());

  // Check if there's a session today or yesterday to start the streak
  if (uniqueDays.includes(today)) {
    currentStreak = 1;
    let checkDate = getYesterday();

    for (let i = 1; i < uniqueDays.length; i++) {
      const dayStr = uniqueDays[i];
      const expectedStr = getDateString(checkDate);

      if (dayStr === expectedStr) {
        currentStreak++;
        checkDate = getPreviousDay(checkDate);
      } else {
        break;
      }
    }
  } else if (uniqueDays.includes(yesterday)) {
    // Streak started yesterday
    currentStreak = 1;
    let checkDate = getDayBefore(getYesterday());

    for (let i = 1; i < uniqueDays.length; i++) {
      const dayStr = uniqueDays[i];
      const expectedStr = getDateString(checkDate);

      if (dayStr === expectedStr) {
        currentStreak++;
        checkDate = getPreviousDay(checkDate);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const currentDay = new Date(uniqueDays[i]);
    const nextDay = new Date(uniqueDays[i + 1]);

    const diffTime = currentDay.getTime() - nextDay.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    totalSessions,
    lastSessionDate,
  };
}

/**
 * Get date string in YYYY-MM-DD format
 */
function getDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get yesterday's date
 */
function getYesterday(): Date {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
}

/**
 * Get the day before a given date
 */
function getDayBefore(date: Date): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - 1);
  return newDate;
}

/**
 * Get previous day
 */
function getPreviousDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - 1);
  return newDate;
}

/**
 * Check if user practiced today
 */
export function practicedToday(sessions: Session[]): boolean {
  const today = getDateString(new Date());
  return sessions.some((session) => {
    const sessionDate = getDateString(new Date(session.timestamp));
    return sessionDate === today;
  });
}
