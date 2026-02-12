import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../constants/tokens';
import { Button } from './Button';

const DISMISSED_KEY = 'pwa-install-dismissed';

/**
 * PWA Install Prompt Component
 *
 * Shows installation banner for:
 * - Chromium browsers (Chrome, Edge) - programmatic install button
 * - Safari browsers - manual install instructions
 *
 * Features:
 * - Auto-hides if already installed
 * - Can be dismissed permanently (stored in AsyncStorage)
 * - Fixed position at bottom of screen
 */
export function PWAInstallPrompt() {
  const { canInstall, isInstalled, promptInstall, isSafari } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const checkDismissed = async () => {
      try {
        const dismissed = await AsyncStorage.getItem(DISMISSED_KEY);
        setIsDismissed(dismissed === 'true');
      } catch (error) {
        console.error('Error checking dismissed state:', error);
      }
    };

    checkDismissed();
  }, []);

  const handleDismiss = async () => {
    try {
      await AsyncStorage.setItem(DISMISSED_KEY, 'true');
      setIsDismissed(true);
    } catch (error) {
      console.error('Error saving dismissed state:', error);
    }
  };

  const handleInstall = async () => {
    await promptInstall();
    handleDismiss(); // Auto-dismiss after install attempt
  };

  // Don't show if:
  // - Already installed
  // - User dismissed permanently
  // - Not on web platform
  // - No install capability (not Chromium or Safari)
  if (
    isInstalled ||
    isDismissed ||
    Platform.OS !== 'web' ||
    (!canInstall && !isSafari)
  ) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={handleDismiss}
        accessibilityLabel="Dismiss install prompt"
      >
        <Text style={styles.dismissText}>✕</Text>
      </TouchableOpacity>

      {canInstall ? (
        // Chromium browsers - show install button
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Install Mindfool</Text>
            <Text style={styles.description}>
              Install the app for a better experience
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Install" onPress={handleInstall} variant="primary" />
          </View>
        </View>
      ) : isSafari ? (
        // Safari - show manual instructions
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Install Mindfool</Text>
            <Text style={styles.safariInstructions}>
              Tap the <Text style={styles.bold}>Share</Text> icon{' '}
              <Text style={styles.shareIcon}>⎋</Text>, then select{' '}
              <Text style={styles.bold}>"Add to Home Screen"</Text>
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute' as any,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    ...SHADOWS.lg,
  },
  dismissButton: {
    position: 'absolute' as any,
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  dismissText: {
    fontSize: 20,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  content: {
    flexDirection: 'row' as any,
    alignItems: 'center',
    gap: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  description: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  safariInstructions: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  shareIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    minWidth: 100,
  },
});
