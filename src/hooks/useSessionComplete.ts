import { useRouter } from 'expo-router';
import { useSettingsStore } from '../stores/settingsStore';
import { useSessionStore } from '../stores/sessionStore';

/**
 * Hook to handle session completion with settings-aware navigation
 */
export function useSessionComplete() {
  const router = useRouter();
  const skipPostGameFeedback = useSettingsStore((state) => state.skipPostGameFeedback);
  const endSession = useSessionStore((state) => state.endSession);
  const resetSession = useSessionStore((state) => state.resetSession);
  const preScore = useSessionStore((state) => state.preScore);

  const handleComplete = () => {
    if (skipPostGameFeedback) {
      // Use middle value (5) as default post-score if skipping
      const defaultPostScore = preScore ?? 5;
      endSession(defaultPostScore);
      resetSession();
      router.replace('/');
    } else {
      router.push('/post-game');
    }
  };

  return handleComplete;
}
