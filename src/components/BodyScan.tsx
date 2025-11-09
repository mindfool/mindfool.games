import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BodyScanProps {
  duration?: number;
  onComplete?: () => void;
  minDuration?: number;
}

type BodyPart =
  | 'head'
  | 'chest'
  | 'leftArm'
  | 'rightArm'
  | 'stomach'
  | 'leftLeg'
  | 'rightLeg';

const BODY_PARTS: { id: BodyPart; label: string; instruction: string }[] = [
  { id: 'head', label: 'Head & Face', instruction: 'Notice sensations in your head and face' },
  { id: 'chest', label: 'Chest', instruction: 'Feel your breath moving in your chest' },
  { id: 'leftArm', label: 'Left Arm', instruction: 'Scan down your left arm to fingertips' },
  { id: 'rightArm', label: 'Right Arm', instruction: 'Scan down your right arm to fingertips' },
  { id: 'stomach', label: 'Stomach', instruction: 'Notice your belly rising and falling' },
  { id: 'leftLeg', label: 'Left Leg', instruction: 'Scan down your left leg to your toes' },
  { id: 'rightLeg', label: 'Right Leg', instruction: 'Scan down your right leg to your toes' },
];

export function BodyScan({ duration = 300, onComplete, minDuration = 30 }: BodyScanProps) {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [completedParts, setCompletedParts] = useState<Set<number>>(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentPart = BODY_PARTS[currentPartIndex];
  const progress = completedParts.size / BODY_PARTS.length;
  const canSkip = timeElapsed >= minDuration;

  useEffect(() => {
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

  const handlePartComplete = () => {
    setCompletedParts((prev) => new Set(prev).add(currentPartIndex));
    setIsResting(true);

    setTimeout(() => {
      setIsResting(false);
      if (currentPartIndex < BODY_PARTS.length - 1) {
        setCurrentPartIndex((prev) => prev + 1);
      } else {
        // All parts complete
        if (intervalRef.current) clearInterval(intervalRef.current);
        onComplete?.();
      }
    }, 1500); // 1.5 second rest between parts
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

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedParts.size} / {BODY_PARTS.length} complete
        </Text>
      </View>

      {/* Body Part Display */}
      <View style={styles.partContainer}>
        {!isResting ? (
          <>
            <View style={styles.bodyPartCircle}>
              <Text style={styles.bodyPartEmoji}>
                {currentPart.id === 'head' && '🧠'}
                {currentPart.id === 'chest' && '🫁'}
                {(currentPart.id === 'leftArm' || currentPart.id === 'rightArm') && '💪'}
                {currentPart.id === 'stomach' && '🌟'}
                {(currentPart.id === 'leftLeg' || currentPart.id === 'rightLeg') && '🦵'}
              </Text>
            </View>

            <Text style={styles.partLabel}>{currentPart.label}</Text>
            <Text style={styles.partInstruction}>{currentPart.instruction}</Text>

            <TouchableOpacity style={styles.scanButton} onPress={handlePartComplete}>
              <Text style={styles.scanButtonText}>I've Scanned This Area</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handlePartComplete}>
              <Text style={styles.skipButtonText}>Skip →</Text>
            </TouchableOpacity>

            <Text style={styles.helperText}>
              Take 10-15 seconds to notice sensations here
            </Text>
          </>
        ) : (
          <View style={styles.restingContainer}>
            <Text style={styles.restingEmoji}>✨</Text>
            <Text style={styles.restingText}>Moving to next area...</Text>
          </View>
        )}
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time Elapsed</Text>
        <Text style={styles.timerValue}>{formatTime(timeElapsed)}</Text>
      </View>

      {/* Complete Button */}
      {canSkip && (
        <TouchableOpacity style={styles.completeButton} onPress={handleCompleteEarly}>
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
    paddingHorizontal: SPACING.lg,
  },
  progressContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8F4F8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  partContainer: {
    alignItems: 'center',
    minHeight: 300,
    justifyContent: 'center',
  },
  bodyPartCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  bodyPartEmoji: {
    fontSize: 64,
  },
  partLabel: {
    ...TYPOGRAPHY.displayMedium,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  partInstruction: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  scanButton: {
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
  scanButtonText: {
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
  restingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  restingEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  restingText: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textSecondary,
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
