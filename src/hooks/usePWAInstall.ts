import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

/**
 * BeforeInstallPromptEvent interface
 * Chrome/Edge specific event for PWA installation
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Hook to manage PWA installation prompt
 *
 * Features:
 * - Captures beforeinstallprompt event (Chromium browsers)
 * - Detects if app is already installed (standalone mode)
 * - Detects Safari for manual install instructions
 * - Provides programmatic install trigger
 *
 * @returns {object} PWA install state and methods
 */
export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Only run on web platform
    if (Platform.OS !== 'web') return;

    // Check if already installed (standalone display mode)
    const checkInstalled = () => {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsInstalled(isStandalone);
      }
    };

    // Detect Safari browser
    const checkSafari = () => {
      if (typeof navigator !== 'undefined') {
        const userAgent = navigator.userAgent.toLowerCase();
        const safariRegex = /^((?!chrome|android).)*safari/i;
        setIsSafari(safariRegex.test(userAgent));
      }
    };

    checkInstalled();
    checkSafari();

    // Handle beforeinstallprompt event (Chromium browsers)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Trigger the install prompt programmatically
   * Only works if beforeinstallprompt event was captured
   */
  const promptInstall = useCallback(async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA install');
      } else {
        console.log('User dismissed PWA install');
      }

      // Clear the install prompt after use
      setInstallPrompt(null);
    } catch (error) {
      console.error('Error triggering install prompt:', error);
    }
  }, [installPrompt]);

  return {
    canInstall: !!installPrompt && !isInstalled,
    isInstalled,
    promptInstall,
    isSafari,
  };
}
