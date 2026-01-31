import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHistoryStore } from '../stores/historyStore';
import { calculateStreaks, practicedToday } from '../utils/streaksCalculator';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/tokens';

export function StreakCard() {
  const sessions = useHistoryStore((state) => state.sessions);
  const streakInfo = calculateStreaks(sessions);
  const todayDone = practicedToday(sessions);

  if (sessions.length === 0) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#FEF3C7', '#FFFBEB']}
      style={styles.container}
      testID="streak-card"
    >
      <View style={styles.content}>
        <View style={styles.streakSection}>
          <View style={styles.fireContainer}>
            <Text style={styles.fireEmoji}>🔥</Text>
          </View>
          <View style={styles.streakInfo}>
            <Text style={styles.streakNumber} testID="streak-count">{streakInfo.currentStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.meta}>
          {todayDone && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✓ Completed Today</Text>
            </View>
          )}

          {streakInfo.longestStreak > streakInfo.currentStreak && (
            <Text style={styles.recordText}>
              🏆 Record: {streakInfo.longestStreak} days
            </Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  content: {
    padding: SPACING.xl,
  },
  streakSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  fireContainer: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
    ...SHADOWS.sm,
  },
  fireEmoji: {
    fontSize: 40,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    ...TYPOGRAPHY.displayLarge,
    fontSize: 42,
    color: COLORS.textPrimary,
    fontWeight: '800',
    lineHeight: 48,
  },
  streakLabel: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
  },
  badgeText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.calm,
    fontWeight: '700',
  },
  recordText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
