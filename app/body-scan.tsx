import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BodyScan } from '../src/components/BodyScan';
import { useSessionComplete } from '../src/hooks/useSessionComplete';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../src/constants/tokens';

export default function BodyScanScreen() {
  const router = useRouter();
  const handleComplete = useSessionComplete();

  return (
    <LinearGradient
      colors={['#F3E8FF', '#FAF5FF', COLORS.backgroundLight]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
          <Text style={styles.exitButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerEmoji}>🧘‍♀️</Text>
            </View>
            <Text style={styles.title}>Body Scan</Text>
            <Text style={styles.subtitle}>Progressive body awareness meditation</Text>
          </View>

          <BodyScan duration={300} onComplete={handleComplete} />
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
