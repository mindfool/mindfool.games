import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { WalkingMeditation } from '../src/components/WalkingMeditation';
import { COLORS, SPACING, TYPOGRAPHY } from '../src/constants/tokens';

export default function WalkingMeditationScreen() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/post-game');
  };

  return (
    <LinearGradient
      colors={['#F0F9FF', '#F5F7FA', '#FFFFFF']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
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
