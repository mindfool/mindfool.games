import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../src/components/animations/AnimatedPressable';
import { StreakCard } from '../src/components/StreakCard';
import { CalmSlider } from '../src/components/CalmSlider';
import { useSessionStore } from '../src/stores/sessionStore';
import { useHistoryStore } from '../src/stores/historyStore';
import { useSettingsStore } from '../src/stores/settingsStore';
import { audioService } from '../src/services/AudioService';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../src/constants/tokens';
import { GameMode } from '../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Practice {
  id: GameMode;
  title: string;
  emoji: string;
  color: string;
  gradient: [string, string];
  description: string;
  route: string;
}

const PRACTICES: Practice[] = [
  {
    id: 'balloon-breathing',
    title: 'Balloon',
    emoji: '🎈',
    color: COLORS.breathing,
    gradient: ['#EDE9FE', '#F5F3FF'],
    description: 'Follow the rhythm',
    route: '/game',
  },
  {
    id: 'box-breathing',
    title: 'Box',
    emoji: '⬜',
    color: COLORS.box,
    gradient: ['#EDE9FE', '#F5F3FF'],
    description: '4-4-4-4 breathing',
    route: '/box-breathing',
  },
  {
    id: '478-breathing',
    title: '4-7-8',
    emoji: '🌙',
    color: COLORS.sleep,
    gradient: ['#E0E7FF', '#EEF2FF'],
    description: 'Deep relaxation',
    route: '/478-breathing',
  },
  {
    id: 'walking-meditation',
    title: 'Walking',
    emoji: '🚶',
    color: COLORS.walking,
    gradient: ['#CFFAFE', '#F0FDFA'],
    description: 'Count your steps',
    route: '/walking-meditation',
  },
  {
    id: 'number-bubbles',
    title: 'Bubbles',
    emoji: '🔢',
    color: COLORS.bubbles,
    gradient: ['#FEF3C7', '#FFFBEB'],
    description: 'Tap 1 to 10',
    route: '/number-bubbles',
  },
  {
    id: 'counting-ladder',
    title: 'Ladder',
    emoji: '🪜',
    color: COLORS.ladder,
    gradient: ['#DBEAFE', '#EFF6FF'],
    description: 'Count with breath',
    route: '/counting-ladder',
  },
  {
    id: 'gong-listening',
    title: 'Gong',
    emoji: '🔔',
    color: COLORS.gong,
    gradient: ['#FFEDD5', '#FFF7ED'],
    description: 'Listen deeply',
    route: '/gong-listening',
  },
  {
    id: 'body-scan',
    title: 'Body Scan',
    emoji: '🧘‍♀️',
    color: COLORS.bodyScan,
    gradient: ['#F3E8FF', '#FAF5FF'],
    description: 'Body awareness',
    route: '/body-scan',
  },
  {
    id: 'loving-kindness',
    title: 'Loving',
    emoji: '💗',
    color: COLORS.loving,
    gradient: ['#FCE7F3', '#FDF2F8'],
    description: 'Compassion',
    route: '/loving-kindness',
  },
  {
    id: 'mindful-eating',
    title: 'Eating',
    emoji: '🍎',
    color: COLORS.eating,
    gradient: ['#FEF3C7', '#FFFBEB'],
    description: 'Slow down',
    route: '/mindful-eating',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const startSession = useSessionStore((state) => state.startSession);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const soundEffects = useSettingsStore((state) => state.soundEffects);
  const lastSession = useHistoryStore((state) => state.getLastSession());
  const [calmScore, setCalmScore] = useState(5);
  const audioInitialized = useRef(false);

  // Initialize audio system on app start
  useEffect(() => {
    const initAudio = async () => {
      if (audioInitialized.current) return;
      audioInitialized.current = true;
      await audioService.initialize();
      await audioService.preloadSounds();
    };
    initAudio();

    // Cleanup on unmount (app close)
    return () => {
      audioService.cleanup();
    };
  }, []);

  // Sync audio enabled state with settings
  useEffect(() => {
    audioService.setEnabled(soundEffects);
  }, [soundEffects]);

  useEffect(() => {
    loadSettings();
  }, []);

  const handlePracticeSelect = (practice: Practice) => {
    // Unlock web audio on first user interaction
    audioService.unlockWebAudio();
    startSession(calmScore, practice.id);
    router.push(practice.route);
  };

  return (
    <LinearGradient
      colors={[COLORS.backgroundLight, COLORS.background, COLORS.backgroundMedium]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🧘</Text>
            </View>
            <Text style={styles.title}>
              Mind<Text style={styles.titleAccent}>Fool</Text>
            </Text>
            <Text style={styles.subtitle}>Daily mindfulness practices</Text>

            {/* Header Actions */}
            <View style={styles.headerActions}>
              <Animated.View entering={FadeInUp.delay(0).duration(400)}>
                <AnimatedPressable
                  style={styles.headerButton}
                  onPress={() => router.push('/history')}
                  testID="history-button"
                >
                  <Text style={styles.headerButtonEmoji}>📊</Text>
                </AnimatedPressable>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(0).duration(400)}>
                <AnimatedPressable
                  style={styles.headerButton}
                  onPress={() => router.push('/settings')}
                  testID="settings-button"
                >
                  <Text style={styles.headerButtonEmoji}>⚙️</Text>
                </AnimatedPressable>
              </Animated.View>
            </View>
          </View>

          {/* Streak Card */}
          <View style={styles.streakContainer} testID="streak-card-container">
            <StreakCard />
          </View>

          {/* Calm Score Assessment */}
          <View style={styles.calmSection}>
            <CalmSlider
              value={calmScore}
              onChange={setCalmScore}
              question="How calm is your mind right now?"
            />
          </View>

          {/* Practices Grid */}
          <View style={styles.practicesSection}>
            <Text style={styles.sectionTitle}>Choose Your Practice</Text>
            <View style={styles.practicesGrid}>
              {PRACTICES.map((practice, index) => (
                <AnimatedPressable
                  key={practice.id}
                  onPress={() => handlePracticeSelect(practice)}
                  style={styles.practiceCard}
                  testID={`practice-card-${practice.id}`}
                >
                  <Animated.View
                    entering={FadeInUp.delay(index * 80).duration(400)}
                  >
                    <LinearGradient
                      colors={practice.gradient}
                      style={styles.practiceGradient}
                    >
                      <Text style={styles.practiceEmoji}>{practice.emoji}</Text>
                      <Text style={styles.practiceTitle}>{practice.title}</Text>
                      <Text style={styles.practiceDescription}>{practice.description}</Text>
                    </LinearGradient>
                  </Animated.View>
                </AnimatedPressable>
              ))}
            </View>
          </View>

          {/* Quick Start Tip */}
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>✨</Text>
            <Text style={styles.tipText}>
              Tap any practice to begin immediately. Each session is 2-5 minutes.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const CARD_WIDTH = (SCREEN_WIDTH - SPACING.xl * 2 - SPACING.lg) / 2;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['3xl'],
  },
  header: {
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.colored,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    ...TYPOGRAPHY.displayLarge,
    fontSize: 36,
    color: COLORS.textPrimary,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  titleAccent: {
    color: COLORS.primary,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  headerButtonEmoji: {
    fontSize: 24,
  },
  streakContainer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  calmSection: {
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.sm,
  },
  practicesSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading1,
    fontSize: 22,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  practicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
  },
  practiceCard: {
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  practiceGradient: {
    padding: SPACING.lg,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  practiceEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  practiceTitle: {
    ...TYPOGRAPHY.heading2,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  practiceDescription: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    flex: 1,
  },
});
