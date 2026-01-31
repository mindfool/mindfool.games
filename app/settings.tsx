import { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useSettingsStore } from '../src/stores/settingsStore';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../src/constants/tokens';
import { AMBIENT_LABELS, AmbientType } from '../src/constants/audio';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    skipPostGameFeedback,
    hapticFeedback,
    soundEffects,
    soundVolume,
    ambientSound,
    setSkipPostGameFeedback,
    setHapticFeedback,
    setSoundEffects,
    setSoundVolume,
    setAmbientSound,
    loadSettings,
  } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerBadge}>
              <Text style={styles.headerEmoji}>⚙️</Text>
            </View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Customize your experience</Text>
          </View>

          {/* Settings Sections */}
          <View style={styles.content}>
            {/* Session Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Session Preferences</Text>

              <View style={styles.settingCard}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Skip Post-Session Feedback</Text>
                  <Text style={styles.settingDescription}>
                    Go directly to home screen after completing a session
                  </Text>
                </View>
                <Switch
                  value={skipPostGameFeedback}
                  onValueChange={setSkipPostGameFeedback}
                  trackColor={{ false: '#D1D5DB', true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>
            </View>

            {/* Experience Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>

              <View style={styles.settingCard}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Haptic Feedback</Text>
                  <Text style={styles.settingDescription}>
                    Vibration feedback for interactions
                  </Text>
                </View>
                <Switch
                  value={hapticFeedback}
                  onValueChange={setHapticFeedback}
                  trackColor={{ false: '#D1D5DB', true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <View style={styles.settingCard}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Sound Effects</Text>
                  <Text style={styles.settingDescription}>
                    Audio feedback during sessions
                  </Text>
                </View>
                <Switch
                  value={soundEffects}
                  onValueChange={setSoundEffects}
                  trackColor={{ false: '#D1D5DB', true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>
            </View>

            {/* Audio Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Audio</Text>

              {/* Volume Slider */}
              <View style={styles.settingCard}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Volume</Text>
                  <Text style={styles.settingDescription}>
                    {Math.round(soundVolume * 100)}%
                  </Text>
                </View>
                <Slider
                  style={{ width: 120, height: 40 }}
                  minimumValue={0}
                  maximumValue={1}
                  value={soundVolume}
                  onSlidingComplete={setSoundVolume}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor="#D1D5DB"
                  thumbTintColor={COLORS.primary}
                />
              </View>

              {/* Ambient Sound Picker */}
              <View style={styles.settingCard}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Background Sound</Text>
                  <Text style={styles.settingDescription}>
                    Ambient sound during practice
                  </Text>
                </View>
              </View>

              {/* Ambient Options */}
              <View style={styles.ambientOptions}>
                {(['off', 'rain', 'nature', 'whitenoise'] as AmbientType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.ambientOption,
                      ambientSound === type && styles.ambientOptionActive,
                    ]}
                    onPress={() => setAmbientSound(type)}
                  >
                    <Text
                      style={[
                        styles.ambientOptionText,
                        ambientSound === type && styles.ambientOptionTextActive,
                      ]}
                    >
                      {AMBIENT_LABELS[type]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* About Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <View style={styles.aboutCard}>
                <Text style={styles.aboutEmoji}>🧘</Text>
                <Text style={styles.aboutTitle}>MindFool.Games</Text>
                <Text style={styles.aboutVersion}>Version 0.1.0</Text>
                <Text style={styles.aboutText}>
                  Mindful practices for daily mental resets
                </Text>
              </View>
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
    paddingHorizontal: SPACING.xl,
  },
  header: {
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.xl,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: SPACING['2xl'],
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  headerBadge: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.colored,
  },
  headerEmoji: {
    fontSize: 32,
  },
  title: {
    ...TYPOGRAPHY.displayLarge,
    fontSize: 32,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    fontWeight: '800',
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
  },
  content: {
    paddingBottom: SPACING['3xl'],
  },
  section: {
    marginBottom: SPACING['2xl'],
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading1,
    fontSize: 20,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  settingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.lg,
  },
  settingTitle: {
    ...TYPOGRAPHY.heading2,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  aboutCard: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'],
    alignItems: 'center',
    ...SHADOWS.md,
  },
  aboutEmoji: {
    fontSize: 56,
    marginBottom: SPACING.lg,
  },
  aboutTitle: {
    ...TYPOGRAPHY.heading1,
    fontSize: 24,
    color: COLORS.textPrimary,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  aboutVersion: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  aboutText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  ambientOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: -SPACING.sm,
  },
  ambientOption: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  ambientOptionActive: {
    backgroundColor: COLORS.primary,
  },
  ambientOptionText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  ambientOptionTextActive: {
    color: COLORS.white,
  },
});
