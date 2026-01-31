import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/tokens';
import { BREATHING_EASING, ANIMATION_DURATIONS } from '../constants/animations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Breathing478Props {
  duration?: number; // Duration in seconds (default: 3 minutes = 180s)
  onComplete?: () => void;
  minDuration?: number; // Minimum time before allowing skip (default: 10s)
}

type BreathPhase = 'inhale' | 'hold' | 'exhale';

export function Breathing478({ duration = 180, onComplete, minDuration = 10 }: Breathing478Props) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [phaseCount, setPhaseCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0.3);

  // 4-7-8 breathing: 4s inhale, 7s hold, 8s exhale
  const INHALE_DURATION = 4000;
  const HOLD_DURATION = 7000;
  const EXHALE_DURATION = 8000;

  useEffect(() => {
    // Start the breathing cycle
    startBreathingCycle();

    // Timer countdown
    intervalRef.current = setInterval(() => {
      setTimeElapsed((prev) => {
        if (prev >= duration) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onComplete?.();
          return duration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, onComplete]);

  const startBreathingCycle = () => {
    cycleBreath();
  };

  const cycleBreath = () => {
    // Inhale (4s)
    setCurrentPhase('inhale');
    scale.value = withTiming(1, { duration: INHALE_DURATION, easing: BREATHING_EASING });
    opacity.value = withTiming(1, { duration: INHALE_DURATION });

    setTimeout(() => {
      // Hold (7s)
      setCurrentPhase('hold');
      // Keep the same size during hold

      setTimeout(() => {
        // Exhale (8s)
        setCurrentPhase('exhale');
        scale.value = withTiming(0.5, { duration: EXHALE_DURATION, easing: BREATHING_EASING });
        opacity.value = withTiming(0.3, { duration: EXHALE_DURATION });

        setTimeout(() => {
          // Cycle complete, start again
          setPhaseCount(prev => prev + 1);
          cycleBreath();
        }, EXHALE_DURATION);
      }, HOLD_DURATION);
    }, INHALE_DURATION);
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
      opacity: opacity.value,
    };
  });

  const canSkip = timeElapsed >= minDuration;

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe In (4)';
      case 'hold': return 'Hold (7)';
      case 'exhale': return 'Breathe Out (8)';
    }
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale': return 'Through your nose, gently';
      case 'hold': return 'Keep the breath calm and steady';
      case 'exhale': return 'Through your mouth, completely';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, animatedStyle]} />
      </View>

      <View style={styles.phaseContainer}>
        <Animated.View
          key={currentPhase}
          entering={FadeIn.duration(ANIMATION_DURATIONS.fadeIn)}
        >
          <Text style={styles.phaseText}>{getPhaseText()}</Text>
          <Text style={styles.phaseSubtext}>{getPhaseInstruction()}</Text>
        </Animated.View>
        <Text style={styles.cycleCount}>Cycle {phaseCount + 1}</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time Elapsed</Text>
        <Text style={styles.timerValue}>{formatTime(timeElapsed)}</Text>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          4-7-8 Breathing
        </Text>
        <Text style={styles.instructionsSubtext}>
          Dr. Andrew Weil's relaxation technique
        </Text>
      </View>

      {canSkip && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteEarly}
        >
          <Text style={styles.completeButtonText}>Complete Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const CIRCLE_SIZE = Math.min(SCREEN_WIDTH - (SPACING.lg * 4), 320);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: COLORS.primary,
  },
  phaseContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    minHeight: 100,
  },
  phaseText: {
    ...TYPOGRAPHY.displayMedium,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  phaseSubtext: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  cycleCount: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  timerContainer: {
    marginTop: SPACING.lg,
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
  instructionsContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  instructionsText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginBottom: 4,
  },
  instructionsSubtext: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  completeButton: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completeButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
});
