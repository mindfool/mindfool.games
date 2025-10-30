import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { CalmSlider } from '../src/components/CalmSlider';
import { Button } from '../src/components/Button';
import { LastSessionCard } from '../src/components/LastSessionCard';
import { useSessionStore } from '../src/stores/sessionStore';
import { useHistoryStore } from '../src/stores/historyStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../src/constants/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const [calmScore, setCalmScore] = useState(5); // Default to middle
  const startSession = useSessionStore((state) => state.startSession);
  const lastSession = useHistoryStore((state) => state.getLastSession());

  const handleStart = () => {
    startSession(calmScore);
    router.push('/game');
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F5F7FA', '#E8F4F8']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            MindFool<Text style={styles.titleAccent}>.Games</Text>
          </Text>
          <Text style={styles.subtitle}>Your daily mental reset</Text>
        </View>

        {/* Last Session Card (if exists) */}
        {lastSession && (
          <View style={styles.lastSessionContainer}>
            <LastSessionCard session={lastSession} />
          </View>
        )}

        {/* Main Content */}
        <View style={styles.content}>
          <CalmSlider
            value={calmScore}
            onChange={setCalmScore}
            question="How scattered or calm is your mind?"
          />

          <View style={styles.spacer} />

          <Button
            title="Start Balloon Breathing"
            onPress={handleStart}
            fullWidth
          />

          {/* Info Text */}
          <Text style={styles.infoText}>
            A 2-3 minute breathing session to help you find calm and focus.
          </Text>
        </View>

        {/* Footer - Coming Soon */}
        <View style={styles.footer}>
          <Text style={styles.footerLabel}>Coming Soon:</Text>
          <Text style={styles.footerText}>
            Walking Meditation • Gong Listening • Number Bubbles • Counting Ladder
          </Text>
        </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.displayLarge,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  titleAccent: {
    color: COLORS.primary,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  spacer: {
    height: SPACING['2xl'],
  },
  infoText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  footer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  footerLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  footerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  lastSessionContainer: {
    marginTop: SPACING.md,
  },
});
