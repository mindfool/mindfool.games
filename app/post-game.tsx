import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { CalmSlider } from '../src/components/CalmSlider';
import { Button } from '../src/components/Button';
import { ReflectionInput } from '../src/components/ReflectionInput';
import { CountUpNumber } from '../src/components/animations/CountUpNumber';
import { useSessionStore } from '../src/stores/sessionStore';
import { audioService } from '../src/services/AudioService';
import { hapticService } from '../src/services/HapticService';
import { COLORS, SPACING, SCATTER_LABELS } from '../src/constants/tokens';

const MAX_MOBILE_WIDTH = 428;

export default function PostGameScreen() {
  const router = useRouter();
  const preScore = useSessionStore((state) => state.preScore);
  const endSession = useSessionStore((state) => state.endSession);
  const resetSession = useSessionStore((state) => state.resetSession);

  const [postScore, setPostScore] = useState(5);
  const [showReflection, setShowReflection] = useState(false);

  // Play completion chime and haptic when postgame screen appears
  useEffect(() => {
    audioService.playSound('chime-complete');
    hapticService.success();
  }, []);

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
  const improvement = delta; // Positive delta = improvement (higher score = calmer)

  const getDeltaMessage = () => {
    if (improvement >= 4) return `Wow! You feel ${improvement} points calmer!`;
    if (improvement >= 2) return `You feel ${improvement} points calmer!`;
    if (improvement === 1) return 'You feel a bit calmer';
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
    <SafeAreaView style={styles.container} testID="post-game-screen">
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
        <Animated.View style={styles.header} entering={FadeInUp.duration(400)}>
          <Text style={styles.title} testID="session-complete-title">Session Complete!</Text>
        </Animated.View>

        <View style={styles.content}>
          {!showReflection ? (
            <>
              {/* Before/After Comparison */}
              <Animated.View
                style={styles.comparisonCard}
                entering={FadeInUp.duration(400).delay(100)}
              >
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>Before:</Text>
                  <View style={styles.comparisonValueRow}>
                    <CountUpNumber
                      end={preScore ?? 0}
                      duration={1}
                      style={styles.comparisonValue}
                    />
                    <Text style={styles.comparisonValue}>
                      {' '}{preScore !== null && SCATTER_LABELS[preScore]}
                    </Text>
                  </View>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>After:</Text>
                  <View style={styles.comparisonValueRow}>
                    <CountUpNumber
                      end={postScore}
                      duration={1.5}
                      delay={0.5}
                      style={styles.comparisonValue}
                    />
                    <Text style={styles.comparisonValue}>
                      {' '}{SCATTER_LABELS[postScore]}
                    </Text>
                  </View>
                </View>

                <Animated.View
                  style={[styles.deltaCard, { backgroundColor: getDeltaColor() + '20' }]}
                  entering={FadeIn.delay(2000)}
                >
                  <Text style={[styles.deltaText, { color: getDeltaColor() }]}>
                    {getDeltaMessage()}
                  </Text>
                </Animated.View>
              </Animated.View>

              <View style={styles.spacer} />

              {/* Post-session slider */}
              <CalmSlider
                value={postScore}
                onChange={setPostScore}
                question="How stable and calm do you feel now?"
              />

              <View style={styles.spacer} />

              <Button title="Next" onPress={handleNext} fullWidth testID="next-button" />

              <Text style={styles.infoText}>
                Great job taking time for mindfulness!
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
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  outerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_MOBILE_WIDTH,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
  },
  header: {
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
    paddingVertical: SPACING.xl,
  },
  comparisonCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  comparisonValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 18,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  comparisonValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  deltaCard: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  deltaText: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    textAlign: 'center',
  },
  spacer: {
    height: SPACING.xl,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
