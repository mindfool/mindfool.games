import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/tokens';

interface GongListeningProps {
  duration?: number;
  onComplete?: () => void;
  minDuration?: number;
}

export function GongListening({
  duration = 180,
  onComplete,
  minDuration = 10
}: GongListeningProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [gongCount, setGongCount] = useState(0);
  const [totalListenTime, setTotalListenTime] = useState(0);
  const [currentGongTime, setCurrentGongTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const gongTimerRef = useRef<NodeJS.Timeout | null>(null);
  const listenStartRef = useRef<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  // Setup audio on mount
  useEffect(() => {
    // Configure audio mode
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    // Cleanup on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

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
      if (gongTimerRef.current) clearInterval(gongTimerRef.current);
    };
  }, [duration, onComplete]);

  // Animate gong when listening
  useEffect(() => {
    if (isListening) {
      // Pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.15,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.8,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
      opacityAnim.setValue(0.3);
    }
  }, [isListening]);

  const playGongSound = async () => {
    try {
      // If there's an existing sound, unload it first
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Create and play new sound
      // TODO: Replace with actual gong sound file when available
      // For now, this will use system sounds or you can add gong.mp3 to assets/sounds/
      const { sound } = await Audio.Sound.createAsync(
        // Placeholder - will need to add actual gong sound file
        // require('../../assets/sounds/gong.mp3')
        { uri: 'https://freesound.org/data/previews/411/411089_5121236-lq.mp3' }, // Temporary online gong sound
        { shouldPlay: true, volume: 0.8 }
      );

      soundRef.current = sound;

      // Play for ~6 seconds (typical gong resonance)
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Error playing gong sound:', error);
      // Continue without sound if there's an error
    }
  };

  const handlePressIn = () => {
    setIsListening(true);
    listenStartRef.current = Date.now();

    // Play gong sound
    playGongSound();

    // Start tracking listen time
    gongTimerRef.current = setInterval(() => {
      setCurrentGongTime(prev => prev + 0.1);
    }, 100);
  };

  const handlePressOut = () => {
    setIsListening(false);

    // Calculate listen duration
    if (listenStartRef.current) {
      const listenDuration = (Date.now() - listenStartRef.current) / 1000;

      // If listened for at least 3 seconds, count it as a successful gong
      if (listenDuration >= 3) {
        setGongCount(prev => prev + 1);
        setTotalListenTime(prev => prev + listenDuration);
      }

      listenStartRef.current = null;
      setCurrentGongTime(0);
    }

    if (gongTimerRef.current) {
      clearInterval(gongTimerRef.current);
      gongTimerRef.current = null;
    }
  };

  const handleCompleteEarly = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (gongTimerRef.current) clearInterval(gongTimerRef.current);
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
      {/* Gong Visual */}
      <View style={styles.gongContainer}>
        <Animated.View
          style={[
            styles.gongOuter,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        />
        <TouchableOpacity
          style={[
            styles.gong,
            isListening && styles.gongActive,
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Text style={styles.gongEmoji}>🔔</Text>
          {isListening && (
            <Text style={styles.gongText}>Listening...</Text>
          )}
          {!isListening && (
            <Text style={styles.gongTextInactive}>Hold to Listen</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Gongs</Text>
          <Text style={styles.statValue}>{gongCount}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Listen Time</Text>
          <Text style={styles.statValue}>
            {Math.floor(totalListenTime + currentGongTime)}s
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formatTime(timeElapsed)}</Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Press and hold the gong
        </Text>
        <Text style={styles.instructionsSubtext}>
          Listen deeply to the silence. Hold for 3+ seconds to count.
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
  gongContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gongOuter: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.primary,
  },
  gong: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  gongActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  gongEmoji: {
    fontSize: 80,
    marginBottom: SPACING.sm,
  },
  gongText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  gongTextInactive: {
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
