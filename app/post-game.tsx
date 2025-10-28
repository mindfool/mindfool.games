import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CalmSlider } from '../src/components/CalmSlider';
import { Button } from '../src/components/Button';
import { ReflectionInput } from '../src/components/ReflectionInput';
import { useSessionStore } from '../src/stores/sessionStore';
import { COLORS, SPACING, TYPOGRAPHY, SCATTER_LABELS } from '../src/constants/tokens';

export default function PostGameScreen() {
  const router = useRouter();
  const preScore = useSessionStore((state) => state.preScore);
  const endSession = useSessionStore((state) => state.endSession);
  const resetSession = useSessionStore((state) => state.resetSession);

  const [postScore, setPostScore] = useState(5);
  const [showReflection, setShowReflection] = useState(false);

  const handleNext = () => {
    setShowReflection(true);
  };

  const handleComplete = (notes?: string) => {
    endSession(postScore, notes);
    // Navigate back to home and reset
    resetSession();
    router.replace('/');
  };

  const handleSkip = () => {
    handleComplete();
  };

  const delta = preScore !== null ? postScore - preScore : 0;
  const improvement = -delta; // Negative delta = improvement

  const getDeltaMessage = () => {
    if (improvement >= 4) return `Wow! You feel ${improvement} points calmer! ✨`;
    if (improvement >= 2) return `You feel ${improvement} points calmer! 🌿`;
    if (improvement === 1) return 'You feel a bit calmer 🍃';
    if (improvement === 0) return 'Your calm stayed the same';
    if (improvement === -1) return 'You feel a bit more scattered';
    return `You feel ${Math.abs(improvement)} points more scattered`;
  };

  const getDeltaColor = () => {
    if (improvement >= 2) return COLORS.calm;
    if (improvement >= 0) return COLORS.primary;
    return COLORS.neutral;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Session Complete!</Text>
        </View>

        <View style={styles.content}>
          {!showReflection ? (
            <>
              {/* Before/After Comparison */}
              <View style={styles.comparisonCard}>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>Before:</Text>
                  <Text style={styles.comparisonValue}>
                    {preScore} • {preScore !== null && SCATTER_LABELS[preScore]}
                  </Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>After:</Text>
                  <Text style={styles.comparisonValue}>
                    {postScore} • {SCATTER_LABELS[postScore]}
                  </Text>
                </View>

                <View style={[styles.deltaCard, { backgroundColor: getDeltaColor() + '20' }]}>
                  <Text style={[styles.deltaText, { color: getDeltaColor() }]}>
                    {getDeltaMessage()}
                  </Text>
                </View>
              </View>

              <View style={styles.spacer} />

              {/* Post-session slider */}
              <CalmSlider
                value={postScore}
                onChange={setPostScore}
                question="How stable and calm do you feel now?"
              />

              <View style={styles.spacer} />

              <Button title="Next" onPress={handleNext} fullWidth />

              <Text style={styles.infoText}>
                Great job taking time for mindfulness! 🌿
              </Text>
            </>
          ) : (
            <>
              {/* Reflection Input */}
              <ReflectionInput
                onSubmit={handleComplete}
                onSkip={handleSkip}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
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
    ...TYPOGRAPHY.displayMedium,
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
    paddingVertical: SPACING.xl,
  },
  comparisonCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  comparisonLabel: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
  },
  comparisonValue: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  deltaCard: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  deltaText: {
    ...TYPOGRAPHY.heading2,
    textAlign: 'center',
  },
  spacer: {
    height: SPACING.xl,
  },
  infoText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
