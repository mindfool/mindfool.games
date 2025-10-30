import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BreathingVideo } from '../src/components/BreathingVideo';
import { COLORS, SPACING, TYPOGRAPHY } from '../src/constants/tokens';

export default function GameScreen() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/post-game');
  };

  return (
    <LinearGradient
      colors={['#E8F4F8', '#F5F7FA', '#FFFFFF']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Balloon Breathing</Text>
            <Text style={styles.subtitle}>Find your calm</Text>
          </View>

          <BreathingVideo
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
