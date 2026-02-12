import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { useSettingsStore } from '../src/stores/settingsStore';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { PWAInstallPrompt } from '../src/components';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const onboardingComplete = useSettingsStore((state) => state.onboardingComplete);

  // Load settings on mount
  useEffect(() => {
    loadSettings().then(() => setSettingsLoaded(true));
  }, []);

  // Redirect to onboarding if not complete (after settings loaded)
  useEffect(() => {
    if (settingsLoaded && !onboardingComplete && segments[0] !== 'onboarding') {
      router.replace('/onboarding');
    }
  }, [settingsLoaded, onboardingComplete, segments]);

  useEffect(() => {
    // Handle deep links when app is already open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle deep link that opened the app
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = ({ url }: { url: string }) => {
    try {
      const parsed = Linking.parse(url);
      const path = parsed.path;

      if (!path) return;

      // Map deep link paths to app routes
      // Handles: mindfool://box-breathing, https://app.mindfool.games/box-breathing
      const validRoutes = [
        'box-breathing',
        '478-breathing',
        'body-scan',
        'counting-ladder',
        'gong-listening',
        'loving-kindness',
        'mindful-eating',
        'number-bubbles',
        'walking-meditation',
        'history',
        'settings',
      ];

      // Normalize path (remove leading slash)
      const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

      if (validRoutes.includes(normalizedPath)) {
        // Use replace to avoid back navigation to share page
        router.replace(`/${normalizedPath}` as any);
      }
    } catch (error) {
      console.warn('Failed to handle deep link:', error);
    }
  };

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#F5F7FA',
            },
            animation: 'fade',
            animationDuration: 250,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="game" />
          <Stack.Screen
            name="post-game"
            options={{
              animation: 'slide_from_bottom',
              animationDuration: 300,
            }}
          />
          <Stack.Screen
            name="onboarding"
            options={{
              animation: 'fade',
            }}
          />
        </Stack>
        <PWAInstallPrompt />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
