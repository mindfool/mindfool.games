import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Vibration } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WalkingMeditationProps {
  duration?: number; // Duration in seconds (default: 3 minutes = 180s)
  onComplete?: () => void;
  minDuration?: number; // Minimum time before allowing skip (default: 10s)
}

export function WalkingMeditation({
  duration = 180,
  onComplete,
  minDuration = 10
}: WalkingMeditationProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentCount, setCurrentCount] = useState(1);
  const [currentFoot, setCurrentFoot] = useState<'left' | 'right'>('left');
  const [cycles, setCycles] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start timer
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

  const handleStepTap = () => {
    setIsActive(true);

    // Subtle haptic feedback
    Vibration.vibrate(10);

    if (currentCount === 10) {
      // At 10, switch foot and reset to 1
      setCurrentFoot(prev => prev === 'left' ? 'right' : 'left');
      setCurrentCount(1);

      // Increment cycle counter when switching from right back to left
      if (currentFoot === 'right') {
        setCycles(prev => prev + 1);
      }
    } else {
      // Increment count for current foot
      setCurrentCount(prev => prev + 1);
    }

    // Reset active state after animation
    setTimeout(() => setIsActive(false), 150);
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
      {/* Current Foot Display */}
      <View style={styles.footLabelContainer}>
        <Text style={styles.footLabel}>
          {currentFoot === 'left' ? '👣 LEFT FOOT' : 'RIGHT FOOT 👣'}
        </Text>
      </View>

      {/* Main Step Counter Circle */}
      <TouchableOpacity
        style={[
          styles.stepCircle,
          isActive && styles.stepCircleActive
        ]}
        onPress={handleStepTap}
        activeOpacity={0.8}
      >
        <Text style={styles.stepCountLabel}>Count</Text>
        <Text style={styles.stepCount}>{currentCount}</Text>
        <Text style={styles.tapInstruction}>Tap when foot touches ground</Text>
      </TouchableOpacity>

      {/* Stats */}
      <View style={styles.statsContainer}>
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
          Focus on {currentFoot} foot until you reach 10
        </Text>
        <Text style={styles.instructionsSubtext}>
          At 10, switch to {currentFoot === 'left' ? 'right' : 'left'} foot and start at 1
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footLabelContainer: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  footLabel: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  stepCircle: {
    width: SCREEN_WIDTH - (SPACING.lg * 2),
    height: SCREEN_WIDTH - (SPACING.lg * 2),
    maxWidth: 300,
    maxHeight: 300,
    borderRadius: 150,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  stepCircleActive: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.4,
    shadowRadius: 20,
    backgroundColor: '#F0F9FF',
    borderColor: COLORS.primaryLight,
  },
  stepCountLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepCount: {
    fontSize: 72,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  tapInstruction: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  statBox: {
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
    minWidth: 100,
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
