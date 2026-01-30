import { resetAllStores, clearMockStorage } from '../src/stores/testUtils';

describe('Test Foundation', () => {
  beforeEach(() => {
    resetAllStores();
    clearMockStorage();
  });

  it('should run a test successfully', () => {
    expect(true).toBe(true);
  });

  it('should import store reset utilities', () => {
    expect(typeof resetAllStores).toBe('function');
    expect(typeof clearMockStorage).toBe('function');
  });

  it('should access Zustand stores without errors', () => {
    const { useSessionStore } = require('../src/stores/sessionStore');
    const { useHistoryStore } = require('../src/stores/historyStore');

    expect(useSessionStore.getState).toBeDefined();
    expect(useHistoryStore.getState).toBeDefined();
  });
});
