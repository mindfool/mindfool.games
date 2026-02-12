import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Hook to detect online/offline status
 *
 * Features:
 * - Tracks navigator.onLine on web
 * - Listens to online/offline events
 * - Returns true for native platforms (always online)
 *
 * @returns {boolean} Current online status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    Platform.OS === 'web' ? navigator.onLine : true
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
