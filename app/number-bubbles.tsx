import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { NumberBubbles } from '../src/components/NumberBubbles';
import { COLORS, SPACING, TYPOGRAPHY } from '../src/constants/tokens';

export default function NumberBubblesScreen() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/post-game');
  };

  return (
    <LinearGradient
      colors={['#FFF9F0', '#F5F7FA', '#FFFFFF']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Number Bubbles</Text>
            <Text style={styles.subtitle}>Count 1 to 10</Text>
          </View>

          <NumberBubbles
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
    marginBottom: SPACING.lg,
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
