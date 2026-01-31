import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/tokens';
import { audioService } from '../services/AudioService';
import { hapticService } from '../services/HapticService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BreathingVideoProps {
  duration?: number; // Duration in seconds (default: 3 minutes = 180s)
  onComplete?: () => void;
  minDuration?: number; // Minimum time before allowing skip (default: 10s)
}

export function BreathingVideo({ duration = 180, onComplete, minDuration = 10 }: BreathingVideoProps) {
  const videoRef = useRef<Video>(null);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Play start chime and haptic when exercise begins
    audioService.playSound('chime-start');
    hapticService.medium();

    // Start playing the video
    videoRef.current?.playAsync();

    // Timer countdown
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      // Clean up timer
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Stop and unload video when component unmounts
      videoRef.current?.stopAsync();
      videoRef.current?.unloadAsync();
    };
  }, [duration, onComplete]);

  const handleCompleteEarly = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onComplete?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      // Loop the video
      videoRef.current?.replayAsync();
    }
  };

  const canSkip = timeElapsed >= minDuration;

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={require('../../assets/videos/balloon-breathing.mp4')}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time Elapsed</Text>
        <Text style={styles.timerValue}>{formatTime(timeElapsed)}</Text>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Follow the balloon's rhythm
        </Text>
        <Text style={styles.instructionsSubtext}>
          Inhale as it expands • Exhale as it contracts
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: SCREEN_WIDTH - (SPACING.lg * 2),
    height: SCREEN_WIDTH - (SPACING.lg * 2),
    maxWidth: 400,
    maxHeight: 400,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  video: {
    width: '100%',
    height: '100%',
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
