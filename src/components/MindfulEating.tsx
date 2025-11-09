import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/tokens';

interface MindfulEatingProps {
  duration?: number; // Default 20 minutes (1200 seconds)
  onComplete?: () => void;
  minDuration?: number;
}

const REMINDERS = [
  'Chew slowly and thoroughly',
  'Notice the flavors and textures',
  'Put your utensils down between bites',
  'Are you still hungry?',
  'Appreciate where your food came from',
  'Notice the colors on your plate',
  'Feel gratitude for this meal',
  'Are you eating mindfully?',
];

export function MindfulEating({
  duration = 1200, // 20 minutes default
  onComplete,
  minDuration = 60,
}: MindfulEatingProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(REMINDERS[0]);
  const [reminderIndex, setReminderIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const timeElapsed = duration - timeRemaining;
  const canSkip = timeElapsed >= minDuration;

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Show a new reminder every 2.5 minutes (150 seconds)
      reminderIntervalRef.current = setInterval(() => {
        setReminderIndex((prev) => {
          const nextIndex = (prev + 1) % REMINDERS.length;
          setCurrentReminder(REMINDERS[nextIndex]);
          return nextIndex;
        });
      }, 150000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
    };
  }, [isActive, duration, onComplete]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
  };

  const handleResume = () => {
    setIsActive(true);
  };

  const handleCompleteEarly = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
    onComplete?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeRemaining / duration;

  return (
    <View style={styles.container}>
      {!isActive && timeRemaining === duration ? (
        // Initial state
        <View style={styles.startContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🍎</Text>
          </View>
          <Text style={styles.title}>Mindful Eating Timer</Text>
          <Text style={styles.description}>
            A {duration / 60}-minute timer to help you eat slowly and mindfully.
            You'll receive gentle reminders to stay present.
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Start Eating Mindfully</Text>
          </TouchableOpacity>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Tips for Mindful Eating:</Text>
            <Text style={styles.tipText}>• Remove distractions (phone, TV)</Text>
            <Text style={styles.tipText}>• Eat sitting down</Text>
            <Text style={styles.tipText}>• Take smaller bites</Text>
            <Text style={styles.tipText}>• Chew thoroughly (20-30 times)</Text>
            <Text style={styles.tipText}>• Pause between bites</Text>
          </View>
        </View>
      ) : (
        // Active timer
        <View style={styles.activeContainer}>
          {/* Progress Circle */}
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.timerLabel}>remaining</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          {/* Reminder */}
          <View style={styles.reminderCard}>
            <Text style={styles.reminderIcon}>💭</Text>
            <Text style={styles.reminderText}>{currentReminder}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            {isActive ? (
              <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.resumeButton} onPress={handleResume}>
                <Text style={styles.buttonText}>Resume</Text>
              </TouchableOpacity>
            )}
          </View>

          {canSkip && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteEarly}
            >
              <Text style={styles.completeButtonText}>End Session</Text>
            </TouchableOpacity>
          )}
        </View>
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
  startContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    ...TYPOGRAPHY.displayMedium,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  description: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: SPACING.xl,
  },
  startButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.white,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tipsTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  tipText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  activeContainer: {
    alignItems: 'center',
    width: '100%',
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 8,
    borderColor: '#FFF4E6',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  timerText: {
    ...TYPOGRAPHY.displayLarge,
    fontSize: 48,
    color: COLORS.primary,
    fontWeight: '700',
  },
  timerLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#FFF4E6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  reminderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    width: '100%',
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  reminderText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  controls: {
    marginBottom: SPACING.lg,
  },
  pauseButton: {
    backgroundColor: COLORS.textSecondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: 12,
  },
  resumeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: 12,
  },
  buttonText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.white,
    fontWeight: '600',
  },
  completeButton: {
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
