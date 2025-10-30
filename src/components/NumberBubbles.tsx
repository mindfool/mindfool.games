import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Vibration } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Bubble {
  number: number;
  x: number;
  y: number;
  animated: Animated.ValueXY;
}

interface NumberBubblesProps {
  duration?: number;
  onComplete?: () => void;
  minDuration?: number;
}

export function NumberBubbles({
  duration = 180,
  onComplete,
  minDuration = 10
}: NumberBubblesProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentTarget, setCurrentTarget] = useState(1);
  const [streak, setStreak] = useState(0);
  const [errors, setErrors] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random positions for bubbles
  const generateBubbles = () => {
    const newBubbles: Bubble[] = [];
    const bubbleSize = 70;
    const padding = 40;

    for (let i = 1; i <= 10; i++) {
      const x = Math.random() * (SCREEN_WIDTH - bubbleSize - padding * 2) + padding;
      const y = Math.random() * (SCREEN_HEIGHT * 0.6 - bubbleSize - padding * 2) + padding;

      newBubbles.push({
        number: i,
        x,
        y,
        animated: new Animated.ValueXY({ x, y })
      });
    }
    setBubbles(newBubbles);
  };

  useEffect(() => {
    generateBubbles();

    // Timer
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

  const handleBubbleTap = (number: number) => {
    if (number === currentTarget) {
      // Correct tap - success haptic
      Vibration.vibrate(10);
      setStreak(prev => prev + 1);

      if (currentTarget === 10) {
        // Completed sequence - stronger haptic
        Vibration.vibrate([0, 10, 50, 10]);
        setCurrentTarget(1);
        generateBubbles(); // Regenerate positions for new round
      } else {
        setCurrentTarget(prev => prev + 1);
      }
    } else {
      // Wrong tap - error haptic (longer vibration)
      Vibration.vibrate([0, 50, 100, 50]);
      setErrors(prev => prev + 1);
      setStreak(0);
      setCurrentTarget(1); // Reset to 1 on error
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

  const canSkip = timeElapsed >= minDuration;

  return (
    <View style={styles.container}>
      {/* Game Area with Bubbles */}
      <View style={styles.gameArea}>
        {bubbles.map((bubble) => {
          const isTarget = bubble.number === currentTarget;
          const isNext = bubble.number === currentTarget + 1;
          const isPast = bubble.number < currentTarget;

          return (
            <TouchableOpacity
              key={bubble.number}
              style={[
                styles.bubble,
                {
                  left: bubble.x,
                  top: bubble.y,
                },
                isTarget && styles.targetBubble,
                isPast && styles.pastBubble,
              ]}
              onPress={() => handleBubbleTap(bubble.number)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.bubbleNumber,
                isTarget && styles.targetNumber,
                isPast && styles.pastNumber,
              ]}>
                {bubble.number}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Target</Text>
          <Text style={styles.statValue}>{currentTarget}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{streak}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formatTime(timeElapsed)}</Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Tap numbers 1 → 10 in order
        </Text>
        <Text style={styles.instructionsSubtext}>
          Wrong tap resets to 1
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
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  bubble: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  targetBubble: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.1 }],
  },
  pastBubble: {
    backgroundColor: COLORS.calm,
    borderColor: '#45A049',
    opacity: 0.6,
  },
  bubbleNumber: {
    ...TYPOGRAPHY.displayLarge,
    color: COLORS.primary,
    fontWeight: '700',
  },
  targetNumber: {
    color: COLORS.white,
  },
  pastNumber: {
    color: COLORS.white,
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
