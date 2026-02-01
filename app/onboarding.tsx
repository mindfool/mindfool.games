import { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
  Pressable,
  ViewToken,
} from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { OnboardingSlide } from '../src/components/OnboardingSlide';
import { useSettingsStore } from '../src/stores/settingsStore';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../src/constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { Platform } from 'react-native';

interface SlideData {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

const SLIDES: SlideData[] = [
  {
    id: 'welcome',
    emoji: '🧘',
    title: 'Welcome to MindFool',
    description: 'Your pocket mindfulness companion for daily calm and focus',
  },
  {
    id: 'how-it-works',
    emoji: '✨',
    title: 'Simple & Quick',
    description: 'Choose from 10 practices, each 2-5 minutes. Track your calm before and after.',
  },
  {
    id: 'get-started',
    emoji: '🎯',
    title: 'Build Your Streak',
    description: 'Practice daily to build streaks and watch your wellbeing improve over time.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<SlideData>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const setOnboardingComplete = useSettingsStore((state) => state.setOnboardingComplete);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const handleSkip = async () => {
    await setOnboardingComplete(true);
    router.replace('/');
  };

  const handleGetStarted = async () => {
    await setOnboardingComplete(true);
    router.replace('/');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      // Use scrollToOffset on web as scrollToIndex has issues with React Native Web
      if (Platform.OS === 'web') {
        flatListRef.current?.scrollToOffset({
          offset: nextIndex * SCREEN_WIDTH,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
      // Manually update the index for web since viewableItemsChanged may not fire
      if (Platform.OS === 'web') {
        setCurrentIndex(nextIndex);
      }
    }
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderSlide = ({ item }: { item: SlideData }) => (
    <OnboardingSlide
      emoji={item.emoji}
      title={item.title}
      description={item.description}
    />
  );

  return (
    <LinearGradient
      colors={[COLORS.backgroundLight, COLORS.background, COLORS.backgroundMedium]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* Skip button in header */}
        <Animated.View entering={FadeIn.delay(300).duration(400)} style={styles.header}>
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </Animated.View>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
        />

        {/* Bottom controls */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.footer}>
          {/* Pagination dots */}
          <View style={styles.pagination}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Action button */}
          {isLastSlide ? (
            <Pressable
              onPress={handleGetStarted}
              style={styles.getStartedButton}
              testID="get-started-button"
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleNext}
              style={styles.nextButton}
              testID="next-button"
            >
              <Text style={styles.nextText}>Next</Text>
            </Pressable>
          )}
        </Animated.View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  skipButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  skipText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['3xl'],
    gap: SPACING.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.divider,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  getStartedButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.colored,
  },
  getStartedText: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.white,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  nextText: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
