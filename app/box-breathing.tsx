import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BoxBreathing } from '../src/components/BoxBreathing';
import { useSessionComplete } from '../src/hooks/useSessionComplete';
import { useExitConfirmation } from '../src/hooks/useExitConfirmation';
import { useSettingsStore } from '../src/stores/settingsStore';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../src/constants/tokens';
import { ANIMATION_DURATIONS } from '../src/constants/animations';

export default function BoxBreathingScreen() {
  const router = useRouter();
  const [sessionActive, setSessionActive] = useState(true);
  const handleSessionComplete = useSessionComplete();
  const hapticFeedback = useSettingsStore((state) => state.hapticFeedback);

  useExitConfirmation(sessionActive);

  const handleComplete = () => {
    setSessionActive(false);
    handleSessionComplete();
  };

  const handleExit = () => {
    if (hapticFeedback) {
      Vibration.vibrate(10);
    }
    router.back();
  };

  return (
    <LinearGradient
      colors={['#EDE9FE', '#F5F3FF', COLORS.backgroundLight]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View
          entering={FadeIn.duration(ANIMATION_DURATIONS.fadeIn).delay(100)}
          style={{ flex: 1 }}
        >
          {/* Exit Button */}
          <TouchableOpacity style={styles.exitButton} onPress={handleExit} activeOpacity={0.6}>
            <Text style={styles.exitButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.headerBadge}>
                <Text style={styles.headerEmoji}>⬜</Text>
              </View>
              <Text style={styles.title}>Box Breathing</Text>
              <Text style={styles.subtitle}>Equal breathing for calm focus</Text>
            </View>

            <BoxBreathing
              duration={180}
              onComplete={handleComplete}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  exitButton: {
    position: 'absolute',
    top: SPACING.xl,
    left: SPACING.xl,
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...SHADOWS.md,
  },
  exitButtonText: {
    fontSize: 24,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  headerBadge: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerEmoji: {
    fontSize: 32,
  },
  title: {
    ...TYPOGRAPHY.displayLarge,
    fontSize: 28,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontWeight: '700',
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
