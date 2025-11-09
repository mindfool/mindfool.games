import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { CalmSlider } from '../src/components/CalmSlider';
import { Button } from '../src/components/Button';
import { LastSessionCard } from '../src/components/LastSessionCard';
import { StreakCard } from '../src/components/StreakCard';
import { useSessionStore } from '../src/stores/sessionStore';
import { useHistoryStore } from '../src/stores/historyStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../src/constants/tokens';
import { GameMode } from '../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const [calmScore, setCalmScore] = useState(5); // Default to middle
  const [selectedMode, setSelectedMode] = useState<GameMode>('balloon-breathing');
  const startSession = useSessionStore((state) => state.startSession);
  const lastSession = useHistoryStore((state) => state.getLastSession());

  const handleStart = () => {
    startSession(calmScore, selectedMode);
    switch (selectedMode) {
      case 'walking-meditation':
        router.push('/walking-meditation');
        break;
      case 'number-bubbles':
        router.push('/number-bubbles');
        break;
      case 'gong-listening':
        router.push('/gong-listening');
        break;
      case 'counting-ladder':
        router.push('/counting-ladder');
        break;
      case 'box-breathing':
        router.push('/box-breathing');
        break;
      case '478-breathing':
        router.push('/478-breathing');
        break;
      case 'body-scan':
        router.push('/body-scan');
        break;
      case 'loving-kindness':
        router.push('/loving-kindness');
        break;
      case 'mindful-eating':
        router.push('/mindful-eating');
        break;
      default:
        router.push('/game');
    }
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
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🧘</Text>
          </View>
          <Text style={styles.title}>
            MindFool<Text style={styles.titleAccent}>.Games</Text>
          </Text>
          <Text style={styles.subtitle}>Your daily mental reset</Text>

          {/* History & Settings Buttons */}
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push('/history')}
            >
              <Text style={styles.buttonEmoji}>📊</Text>
              <Text style={styles.buttonText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push('/settings')}
            >
              <Text style={styles.buttonEmoji}>⚙️</Text>
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Streak Card */}
        <View style={styles.streakContainer}>
          <StreakCard />
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

          {/* Game Mode Selection */}
          <View style={styles.modeSelection}>
            <Text style={styles.modeSelectionTitle}>Choose a practice:</Text>
            <View style={styles.modeCards}>
              <TouchableOpacity
                style={[
                  styles.modeCard,
                  selectedMode === 'balloon-breathing' && styles.modeCardSelected
                ]}
                onPress={() => setSelectedMode('balloon-breathing')}
              >
                <Text style={styles.modeEmoji}>🎈</Text>
                <Text style={styles.modeTitle}>Balloon Breathing</Text>
                <Text style={styles.modeDescription}>Follow the rhythm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeCard,
                  selectedMode === 'walking-meditation' && styles.modeCardSelected
                ]}
                onPress={() => setSelectedMode('walking-meditation')}
              >
                <Text style={styles.modeEmoji}>🚶</Text>
                <Text style={styles.modeTitle}>Walking Meditation</Text>
                <Text style={styles.modeDescription}>Count your steps</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeCard,
                  selectedMode === 'number-bubbles' && styles.modeCardSelected
                ]}
                onPress={() => setSelectedMode('number-bubbles')}
              >
                <Text style={styles.modeEmoji}>🔢</Text>
                <Text style={styles.modeTitle}>Number Bubbles</Text>
                <Text style={styles.modeDescription}>Tap 1 to 10</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeCard,
                  selectedMode === 'gong-listening' && styles.modeCardSelected
                ]}
                onPress={() => setSelectedMode('gong-listening')}
              >
                <Text style={styles.modeEmoji}>🔔</Text>
                <Text style={styles.modeTitle}>Gong Listening</Text>
                <Text style={styles.modeDescription}>Listen deeply</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeCard,
                  selectedMode === 'counting-ladder' && styles.modeCardSelected
                ]}
                onPress={() => setSelectedMode('counting-ladder')}
              >
                <Text style={styles.modeEmoji}>🪜</Text>
                <Text style={styles.modeTitle}>Counting Ladder</Text>
                <Text style={styles.modeDescription}>Count with breath</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeCard,
                  selectedMode === 'box-breathing' && styles.modeCardSelected
                ]}
                onPress={() => setSelectedMode('box-breathing')}
              >
                <Text style={styles.modeEmoji}>⬜</Text>
                <Text style={styles.modeTitle}>Box Breathing</Text>
                <Text style={styles.modeDescription}>4-4-4-4 pattern</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeCard,
                  selectedMode === '478-breathing' && styles.modeCardSelected
                ]}
                onPress={() => setSelectedMode('478-breathing')}
              >
                <Text style={styles.modeEmoji}>🌙</Text>
                <Text style={styles.modeTitle}>4-7-8 Breathing</Text>
                <Text style={styles.modeDescription}>Deep relaxation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeCard,
                  selectedMode === 'body-scan' && styles.modeCardSelected
                ]}
                onPress={() => setSelectedMode('body-scan')}
              >
                <Text style={styles.modeEmoji}>🧘‍♀️</Text>
                <Text style={styles.modeTitle}>Body Scan</Text>
                <Text style={styles.modeDescription}>Body awareness</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeCard,
                  selectedMode === 'loving-kindness' && styles.modeCardSelected
                ]}
                onPress={() => setSelectedMode('loving-kindness')}
              >
                <Text style={styles.modeEmoji}>💗</Text>
                <Text style={styles.modeTitle}>Loving Kindness</Text>
                <Text style={styles.modeDescription}>Compassion practice</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeCard,
                  selectedMode === 'mindful-eating' && styles.modeCardSelected
                ]}
                onPress={() => setSelectedMode('mindful-eating')}
              >
                <Text style={styles.modeEmoji}>🍎</Text>
                <Text style={styles.modeTitle}>Mindful Eating</Text>
                <Text style={styles.modeDescription}>Slow down meals</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.spacer} />

          <Button
            title={
              selectedMode === 'walking-meditation' ? 'Start Walking' :
              selectedMode === 'number-bubbles' ? 'Start Counting' :
              selectedMode === 'gong-listening' ? 'Start Listening' :
              selectedMode === 'counting-ladder' ? 'Start Breathing' :
              selectedMode === 'box-breathing' ? 'Start Box Breathing' :
              selectedMode === '478-breathing' ? 'Start 4-7-8 Breathing' :
              selectedMode === 'body-scan' ? 'Start Body Scan' :
              selectedMode === 'loving-kindness' ? 'Start Loving Kindness' :
              selectedMode === 'mindful-eating' ? 'Start Mindful Eating' :
              'Start Session'
            }
            onPress={handleStart}
            fullWidth
          />

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>✨</Text>
            <Text style={styles.infoTitle}>10 mindfulness practices</Text>
            <Text style={styles.infoText}>
              Each session is 2-5 minutes. Find what works for you.
            </Text>
          </View>
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
    paddingTop: SPACING.xl,
    paddingBottom: SPACING['2xl'],
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonEmoji: {
    fontSize: 20,
  },
  buttonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    fontWeight: '600',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    ...TYPOGRAPHY.displayLarge,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    fontWeight: '700',
  },
  titleAccent: {
    color: COLORS.primary,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  content: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingBottom: SPACING['2xl'],
  },
  spacer: {
    height: SPACING['2xl'],
  },
  infoCard: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  infoTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  infoText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
  streakContainer: {
    marginTop: SPACING.lg,
  },
  lastSessionContainer: {
    marginTop: SPACING.md,
  },
  modeSelection: {
    width: '100%',
    marginTop: SPACING.lg,
  },
  modeSelectionTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  modeCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  modeCard: {
    width: '47%',
    minWidth: 140,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E8F4F8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  modeCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F9FF',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  modeEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  modeTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  modeDescription: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
