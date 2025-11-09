import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/tokens';

interface LovingKindnessProps {
  duration?: number;
  onComplete?: () => void;
  minDuration?: number;
}

type Recipient = 'self' | 'loved-one' | 'neutral' | 'difficult' | 'all-beings';

const RECIPIENTS = [
  {
    id: 'self' as Recipient,
    label: 'Yourself',
    emoji: '🌟',
    phrases: [
      'May I be happy',
      'May I be healthy',
      'May I be safe',
      'May I live with ease',
    ],
  },
  {
    id: 'loved-one' as Recipient,
    label: 'Someone You Love',
    emoji: '💗',
    phrases: [
      'May you be happy',
      'May you be healthy',
      'May you be safe',
      'May you live with ease',
    ],
  },
  {
    id: 'neutral' as Recipient,
    label: 'A Neutral Person',
    emoji: '👤',
    phrases: [
      'May you be happy',
      'May you be healthy',
      'May you be safe',
      'May you live with ease',
    ],
  },
  {
    id: 'difficult' as Recipient,
    label: 'Someone Difficult',
    emoji: '🤝',
    phrases: [
      'May you be happy',
      'May you be healthy',
      'May you be safe',
      'May you live with ease',
    ],
  },
  {
    id: 'all-beings' as Recipient,
    label: 'All Beings',
    emoji: '🌍',
    phrases: [
      'May all beings be happy',
      'May all beings be healthy',
      'May all beings be safe',
      'May all beings live with ease',
    ],
  },
];

export function LovingKindness({
  duration = 300,
  onComplete,
  minDuration = 30,
}: LovingKindnessProps) {
  const [currentRecipientIndex, setCurrentRecipientIndex] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const currentRecipient = RECIPIENTS[currentRecipientIndex];
  const currentPhrase = currentRecipient.phrases[currentPhraseIndex];
  const canSkip = timeElapsed >= minDuration;

  useEffect(() => {
    // Gentle pulsing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    intervalRef.current = setInterval(() => {
      setTimeElapsed((prev) => {
        if (prev >= duration) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return duration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration]);

  const handleNext = () => {
    if (currentPhraseIndex < currentRecipient.phrases.length - 1) {
      setCurrentPhraseIndex((prev) => prev + 1);
    } else if (currentRecipientIndex < RECIPIENTS.length - 1) {
      setCurrentRecipientIndex((prev) => prev + 1);
      setCurrentPhraseIndex(0);
    } else {
      // Complete
      if (intervalRef.current) clearInterval(intervalRef.current);
      onComplete?.();
    }
  };

  const handleCompleteEarly = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onComplete?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const progress =
    (currentRecipientIndex * 4 + currentPhraseIndex + 1) /
    (RECIPIENTS.length * 4);

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Heart Animation */}
      <Animated.View style={[styles.heartContainer, animatedStyle]}>
        <Text style={styles.heartEmoji}>{currentRecipient.emoji}</Text>
      </Animated.View>

      {/* Recipient */}
      <Text style={styles.recipientLabel}>{currentRecipient.label}</Text>

      {/* Phrase */}
      <View style={styles.phraseContainer}>
        <Text style={styles.phrase}>{currentPhrase}</Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentRecipientIndex === RECIPIENTS.length - 1 &&
          currentPhraseIndex === currentRecipient.phrases.length - 1
            ? 'Complete'
            : 'Next Phrase'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
        <Text style={styles.skipButtonText}>Skip →</Text>
      </TouchableOpacity>

      <Text style={styles.helperText}>
        Repeat silently, feeling the meaning
      </Text>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time Elapsed</Text>
        <Text style={styles.timerValue}>{formatTime(timeElapsed)}</Text>
      </View>

      {/* Complete Button */}
      {canSkip && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteEarly}
        >
          <Text style={styles.completeButtonText}>End Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  progressContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#FFE8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF69B4',
  },
  heartContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heartEmoji: {
    fontSize: 64,
  },
  recipientLabel: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  phraseContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 80,
    justifyContent: 'center',
  },
  phrase: {
    ...TYPOGRAPHY.displayMedium,
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: 12,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.white,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  skipButtonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  helperText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  timerContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  timerValue: {
    ...TYPOGRAPHY.displayMedium,
    color: COLORS.primary,
    fontWeight: '700',
  },
  completeButton: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.textSecondary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
  },
  completeButtonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.white,
    fontWeight: '600',
  },
});
