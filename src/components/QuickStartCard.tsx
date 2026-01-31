import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AnimatedPressable } from './animations/AnimatedPressable';
import { useSettingsStore } from '../stores/settingsStore';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/tokens';
import { GameMode } from '../types';

interface QuickStartCardProps {
  onPress: (mode: GameMode) => void;
}

const getModeEmoji = (mode: GameMode): string => {
  const emojiMap: Record<GameMode, string> = {
    'balloon-breathing': '🎈',
    'box-breathing': '⬜',
    '478-breathing': '🌙',
    'walking-meditation': '🚶',
    'number-bubbles': '🔢',
    'counting-ladder': '🪜',
    'gong-listening': '🔔',
    'body-scan': '🧘‍♀️',
    'loving-kindness': '💗',
    'mindful-eating': '🍎',
    'gratitude-journal': '📓',
  };
  return emojiMap[mode] || '🧘';
};

const getModeName = (mode: GameMode): string => {
  const nameMap: Record<GameMode, string> = {
    'balloon-breathing': 'Balloon Breathing',
    'box-breathing': 'Box Breathing',
    '478-breathing': '4-7-8 Breathing',
    'walking-meditation': 'Walking Meditation',
    'number-bubbles': 'Number Bubbles',
    'counting-ladder': 'Counting Ladder',
    'gong-listening': 'Gong Listening',
    'body-scan': 'Body Scan',
    'loving-kindness': 'Loving Kindness',
    'mindful-eating': 'Mindful Eating',
    'gratitude-journal': 'Gratitude Journal',
  };
  return nameMap[mode] || mode;
};

export function QuickStartCard({ onPress }: QuickStartCardProps) {
  const lastPracticeMode = useSettingsStore((state) => state.lastPracticeMode);

  // Don't render if no previous practice
  if (!lastPracticeMode) return null;

  return (
    <Animated.View entering={FadeInUp.delay(0).duration(400)}>
      <AnimatedPressable
        onPress={() => onPress(lastPracticeMode)}
        style={styles.container}
        testID="quick-start-card"
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>{getModeEmoji(lastPracticeMode)}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Quick Start</Text>
            <Text style={styles.modeName}>{getModeName(lastPracticeMode)}</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  emoji: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modeName: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  arrow: {
    fontSize: 24,
    color: COLORS.primary,
  },
});
