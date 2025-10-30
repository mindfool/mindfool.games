import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/tokens';

interface CountingLadderProps {
  duration?: number;
  onComplete?: () => void;
  minDuration?: number;
}

export function CountingLadder({
  duration = 180,
  onComplete,
  minDuration = 10
}: CountingLadderProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentCount, setCurrentCount] = useState(1);
  const [cycles, setCycles] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Main timer
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

  // Breathing animation cycle
  useEffect(() => {
    const breathCycle = () => {
      // Inhale (4 seconds)
      setBreathPhase('inhale');
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Exhale (6 seconds)
        setBreathPhase('exhale');
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 6000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          breathCycle(); // Repeat
        });
      });
    };

    breathCycle();

    return () => {
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, []);

  const handleTap = () => {
    if (breathPhase === 'exhale') {
      // Correct: tapped during exhale
      if (currentCount === 10) {
        // Completed a full ladder
        setCurrentCount(1);
        setCycles(prev => prev + 1);
      } else {
        setCurrentCount(prev => prev + 1);
      }
    }
    // Ignore taps during inhale
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

  const canSkip = timeElapsed >= minDuration;

  return (
    <View style={styles.container}>
      {/* Breathing Circle */}
      <View style={styles.breathingContainer}>
        <Animated.View
          style={[
            styles.breathingOuter,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        />
        <TouchableOpacity
          style={styles.breathingCircle}
          onPress={handleTap}
          activeOpacity={0.8}
        >
          <Text style={styles.countNumber}>{currentCount}</Text>
          <Text style={styles.phaseText}>
            {breathPhase === 'inhale' ? 'Inhale' : 'Tap to count'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>{currentCount}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Cycles</Text>
          <Text style={styles.statValue}>{cycles}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formatTime(timeElapsed)}</Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Inhale deeply, exhale while counting
        </Text>
        <Text style={styles.instructionsSubtext}>
          Tap the circle during each exhale. Count 1 → 10, then repeat.
        </Text>
      </View>

      {/* Complete Button */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  breathingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  breathingOuter: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.primary,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  countNumber: {
    fontSize: 72,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  phaseText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    ...TYPOGRAPHY.displayMedium,
    color: COLORS.primary,
    fontWeight: '700',
  },
  instructionsContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  instructionsText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionsSubtext: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  completeButton: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  completeButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.white,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
