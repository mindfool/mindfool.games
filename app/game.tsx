import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { useSessionStore } from '../src/stores/sessionStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../src/constants/tokens';

export default function GameScreen() {
  const router = useRouter();
  const preScore = useSessionStore((state) => state.preScore);

  const handleComplete = () => {
    router.push('/post-game');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Balloon Breathing</Text>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            🎈
          </Text>
          <Text style={styles.placeholderSubtext}>
            Breathing circle animation will go here
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText}>
            Your pre-session score: <Text style={styles.infoValue}>{preScore}</Text>
          </Text>
          <Text style={styles.instructions}>
            (This is a placeholder. Week 2 will implement the actual breathing animation with Skia)
          </Text>
        </View>

        <Button
          title="Complete Session"
          onPress={handleComplete}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: 'space-between',
  },
  title: {
    ...TYPOGRAPHY.displayMedium,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.xl,
  },
  placeholderText: {
    fontSize: 120,
    marginBottom: SPACING.lg,
  },
  placeholderSubtext: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  info: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  infoText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  infoValue: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '700',
    color: COLORS.primary,
  },
  instructions: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: SPACING.md,
  },
});
