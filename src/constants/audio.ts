// Sound types for type-safe playback
export type SoundType = 'chime-start' | 'chime-complete' | 'tick' | 'gong';
export type AmbientType = 'rain' | 'nature' | 'whitenoise' | 'off';

// Asset paths using require() for bundling
export const SOUND_ASSETS: Record<SoundType, any> = {
  'chime-start': require('../../assets/sounds/chime-start.mp3'),
  'chime-complete': require('../../assets/sounds/chime-complete.mp3'),
  'tick': require('../../assets/sounds/tick.mp3'),
  'gong': require('../../assets/sounds/gong.mp3'),
};

// Silence asset for web audio unlock
export const SILENCE_ASSET = require('../../assets/sounds/silence.mp3');

// Default volume (0.0 to 1.0)
export const DEFAULT_VOLUME = 0.7;

// Volume presets for quick selection
export const VOLUME_PRESETS = {
  low: 0.3,
  medium: 0.5,
  high: 0.8,
} as const;
