import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSettingsStore } from '../src/stores/settingsStore';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

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
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
