import { useSessionStore } from './sessionStore';
import { useHistoryStore } from './historyStore';
import { useSettingsStore } from './settingsStore';

/**
 * Reset all Zustand stores to initial state.
 * Call in beforeEach() to prevent test pollution.
 *
 * Note: Using partial setState (not replace) to preserve store methods
 * when using persisted stores with Zustand middleware.
 */
export function resetAllStores(): void {
  // Reset sessionStore - partial update preserves methods
  useSessionStore.setState({
    sessionId: null,
    preScore: null,
    postScore: null,
    startTime: null,
    endTime: null,
    mode: 'balloon-breathing',
  });

  // Reset historyStore - partial update preserves methods
  useHistoryStore.setState({
    sessions: [],
  });

  // Reset settingsStore - partial update preserves methods
  useSettingsStore.setState({
    skipPostGameFeedback: false,
    hapticFeedback: true,
    soundEffects: true,
  });
}

/**
 * Clear AsyncStorage mock between tests.
 * Import from mock: require('../../__mocks__/@react-native-async-storage/async-storage').__mockStorage
 */
export function clearMockStorage(): void {
  const mockModule = require('../../__mocks__/@react-native-async-storage/async-storage');
  if (mockModule.__mockStorage) {
    Object.keys(mockModule.__mockStorage).forEach(key => {
      delete mockModule.__mockStorage[key];
    });
  }
}
