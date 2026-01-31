import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AmbientType } from '../constants/audio';
import { audioService } from '../services/AudioService';
import { hapticService } from '../services/HapticService';

export interface SettingsState {
  skipPostGameFeedback: boolean;
  hapticFeedback: boolean;
  soundEffects: boolean;
  soundVolume: number; // 0.0 to 1.0
  ambientSound: AmbientType;

  // Actions
  setSkipPostGameFeedback: (skip: boolean) => Promise<void>;
  setHapticFeedback: (enabled: boolean) => Promise<void>;
  setSoundEffects: (enabled: boolean) => Promise<void>;
  setSoundVolume: (volume: number) => Promise<void>;
  setAmbientSound: (type: AmbientType) => Promise<void>;
  loadSettings: () => Promise<void>;
}

const SETTINGS_STORAGE_KEY = '@mindfool_settings';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  skipPostGameFeedback: false,
  hapticFeedback: true,
  soundEffects: true,
  soundVolume: 0.7,
  ambientSound: 'off' as AmbientType,

  setSkipPostGameFeedback: async (skip: boolean) => {
    set({ skipPostGameFeedback: skip });
    await saveSettings(get());
  },

  setHapticFeedback: async (enabled: boolean) => {
    set({ hapticFeedback: enabled });
    hapticService.setEnabled(enabled);
    await saveSettings(get());
  },

  setSoundEffects: async (enabled: boolean) => {
    set({ soundEffects: enabled });
    audioService.setEnabled(enabled);
    await saveSettings(get());
  },

  setSoundVolume: async (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    set({ soundVolume: clampedVolume });
    audioService.setVolume(clampedVolume);
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
          soundVolume: settings.soundVolume ?? 0.7,
          ambientSound: settings.ambientSound ?? 'off',
        });

        // Sync AudioService with loaded settings
        audioService.setEnabled(settings.soundEffects ?? true);
        audioService.setVolume(settings.soundVolume ?? 0.7);

        // Sync HapticService with loaded settings
        hapticService.setEnabled(settings.hapticFeedback ?? true);
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
      soundVolume: state.soundVolume,
      ambientSound: state.ambientSound,
    };
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}
