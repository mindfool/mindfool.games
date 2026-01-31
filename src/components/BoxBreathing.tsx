import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  FadeIn,
} from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/tokens';
import { BREATHING_EASING, ANIMATION_DURATIONS } from '../constants/animations';
import { audioService } from '../services/AudioService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BoxBreathingProps {
  duration?: number; // Duration in seconds (default: 3 minutes = 180s)
  onComplete?: () => void;
  minDuration?: number; // Minimum time before allowing skip (default: 10s)
}

type BreathPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

export function BoxBreathing({ duration = 180, onComplete, minDuration = 10 }: BoxBreathingProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [phaseCount, setPhaseCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.3);

  // Box breathing: 4 seconds each phase
  const PHASE_DURATION = 4000; // 4 seconds

  useEffect(() => {
    // Play start chime when exercise begins
    audioService.playSound('chime-start');

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
    // Reset and start the cycle
    cycleBreath();
  };

  const cycleBreath = () => {
    // Inhale (4s)
    setCurrentPhase('inhale');
    scale.value = withTiming(1, { duration: PHASE_DURATION, easing: BREATHING_EASING });
    opacity.value = withTiming(1, { duration: PHASE_DURATION });

    setTimeout(() => {
      // Hold (4s)
      setCurrentPhase('hold-in');
      // Keep the same size during hold

      setTimeout(() => {
        // Exhale (4s)
        setCurrentPhase('exhale');
        scale.value = withTiming(0.6, { duration: PHASE_DURATION, easing: BREATHING_EASING });
        opacity.value = withTiming(0.3, { duration: PHASE_DURATION });

        setTimeout(() => {
          // Hold (4s)
          setCurrentPhase('hold-out');

          setTimeout(() => {
            // Cycle complete, start again
            setPhaseCount(prev => prev + 1);
            cycleBreath();
          }, PHASE_DURATION);
        }, PHASE_DURATION);
      }, PHASE_DURATION);
    }, PHASE_DURATION);
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
      case 'inhale': return 'Breathe In';
      case 'hold-in': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold-out': return 'Hold';
    }
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale': return 'Fill your lungs slowly';
      case 'hold-in': return 'Keep the breath in';
      case 'exhale': return 'Release completely';
      case 'hold-out': return 'Rest before next breath';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, animatedStyle]} />
        <View style={styles.square} />
      </View>

      <View style={styles.phaseContainer}>
        <Animated.View
          key={currentPhase}
          entering={FadeIn.duration(ANIMATION_DURATIONS.fadeIn)}
        >
          <Text style={styles.phaseText}>{getPhaseText()}</Text>
          <Text style={styles.phaseSubtext}>{getPhaseInstruction()}</Text>
        </Animated.View>
        <Text style={styles.cycleCount}>Cycle {Math.floor(phaseCount / 4) + 1}</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time Elapsed</Text>
        <Text style={styles.timerValue}>{formatTime(timeElapsed)}</Text>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Box Breathing (4-4-4-4)
        </Text>
        <Text style={styles.instructionsSubtext}>
          4 seconds each: In • Hold • Out • Hold
        </Text>
      </View>

      {canSkip && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteEarly}
          testID="complete-session-btn"
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
  square: {
    position: 'absolute',
    width: CIRCLE_SIZE * 0.7,
    height: CIRCLE_SIZE * 0.7,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderRadius: 12,
    opacity: 0.3,
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
