import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { WalkingMeditation } from '../src/components/WalkingMeditation';
import { useSessionComplete } from '../src/hooks/useSessionComplete';
import { useExitConfirmation } from '../src/hooks/useExitConfirmation';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../src/constants/tokens';

export default function WalkingMeditationScreen() {
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
      colors={['#F0F9FF', '#F5F7FA', '#FFFFFF']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
          <Text style={styles.exitButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Walking Meditation</Text>
            <Text style={styles.subtitle}>Find calm in movement</Text>
          </View>

          <WalkingMeditation
            duration={180}
            onComplete={handleComplete}
          />
        </View>
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
    left: SPACING.lg,
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.displayLarge,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
