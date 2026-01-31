import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Breathing478 } from '../src/components/Breathing478';
import { useSessionComplete } from '../src/hooks/useSessionComplete';
import { useExitConfirmation } from '../src/hooks/useExitConfirmation';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../src/constants/tokens';
import { ANIMATION_DURATIONS } from '../src/constants/animations';

export default function Breathing478Screen() {
  const router = useRouter();
  const [sessionActive, setSessionActive] = useState(true);
  const handleSessionComplete = useSessionComplete();

  useExitConfirmation(sessionActive);

  const handleComplete = () => {
    setSessionActive(false);
    handleSessionComplete();
  };

  return (
    <LinearGradient
      colors={['#E0E7FF', '#EEF2FF', COLORS.backgroundLight]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View
          entering={FadeIn.duration(ANIMATION_DURATIONS.fadeIn).delay(100)}
          style={{ flex: 1 }}
        >
          <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
            <Text style={styles.exitButtonText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.headerBadge}>
                <Text style={styles.headerEmoji}>🌙</Text>
              </View>
              <Text style={styles.title}>4-7-8 Breathing</Text>
              <Text style={styles.subtitle}>Dr. Weil's technique for deep relaxation</Text>
            </View>

            <Breathing478
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
