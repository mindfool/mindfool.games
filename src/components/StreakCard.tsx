import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useHistoryStore } from '../stores/historyStore';
import { calculateStreaks, practicedToday } from '../utils/streaksCalculator';
import { buildStreakShareContent } from '../lib/sharing/buildShareUrl';
import { ShareButton } from './ShareButton';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/tokens';

export function StreakCard() {
  const sessions = useHistoryStore((state) => state.sessions);
  const streakInfo = calculateStreaks(sessions);
  const todayDone = practicedToday(sessions);

  // Flame pulse animation
  const flameScale = useSharedValue(1);
  const flameOpacity = useSharedValue(1);

  useEffect(() => {
    // Start infinite pulse animation
    const timingConfig = { duration: 800, easing: Easing.inOut(Easing.ease) };

    flameScale.value = withRepeat(
      withSequence(
        withTiming(1.1, timingConfig),
        withTiming(1.0, timingConfig)
      ),
      -1,
      false
    );

    flameOpacity.value = withRepeat(
      withSequence(
        withTiming(1, timingConfig),
        withTiming(0.7, timingConfig)
      ),
      -1,
      false
    );
  }, []);

  const animatedFlameStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: flameScale.value }],
      opacity: flameOpacity.value,
    };
  });

  if (sessions.length === 0) {
    return null;
  }

  // Get most recent practice for share content
  const lastSession = sessions[0];
  const shareContent = buildStreakShareContent(
    streakInfo.currentStreak,
    lastSession?.mode
  );

  return (
    <LinearGradient
      colors={['#FEF3C7', '#FFFBEB']}
      style={styles.container}
      testID="streak-card"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.streakSection}>
            <View style={styles.fireContainer}>
              <Animated.Text style={[styles.fireEmoji, animatedFlameStyle]}>🔥</Animated.Text>
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber} testID="streak-count">{streakInfo.currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>

          {/* Share button - only show if streak > 0 */}
          {streakInfo.currentStreak > 0 && (
            <ShareButton content={shareContent} />
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  streakSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
