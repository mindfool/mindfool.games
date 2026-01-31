import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AmbientType } from '../constants/audio';

export interface SettingsState {
  skipPostGameFeedback: boolean;
  hapticFeedback: boolean;
  soundEffects: boolean;
  ambientSound: AmbientType;

  // Actions
  setSkipPostGameFeedback: (skip: boolean) => Promise<void>;
  setHapticFeedback: (enabled: boolean) => Promise<void>;
  setSoundEffects: (enabled: boolean) => Promise<void>;
  setAmbientSound: (type: AmbientType) => Promise<void>;
  loadSettings: () => Promise<void>;
}

const SETTINGS_STORAGE_KEY = '@mindfool_settings';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  skipPostGameFeedback: false,
  hapticFeedback: true,
  soundEffects: true,
  ambientSound: 'off' as AmbientType,

  setSkipPostGameFeedback: async (skip: boolean) => {
    set({ skipPostGameFeedback: skip });
    await saveSettings(get());
  },

  setHapticFeedback: async (enabled: boolean) => {
    set({ hapticFeedback: enabled });
    await saveSettings(get());
  },

  setSoundEffects: async (enabled: boolean) => {
    set({ soundEffects: enabled });
    await saveSettings(get());
  },

  setAmbientSound: async (type: AmbientType) => {
    set({ ambientSound: type });
    await saveSettings(get());
  },

  loadSettings: async () => {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        set({
          skipPostGameFeedback: settings.skipPostGameFeedback ?? false,
          hapticFeedback: settings.hapticFeedback ?? true,
          soundEffects: settings.soundEffects ?? true,
          ambientSound: settings.ambientSound ?? 'off',
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },
}));

async function saveSettings(state: SettingsState) {
  try {
    const settings = {
      skipPostGameFeedback: state.skipPostGameFeedback,
      hapticFeedback: state.hapticFeedback,
      soundEffects: state.soundEffects,
      ambientSound: state.ambientSound,
    };
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}
