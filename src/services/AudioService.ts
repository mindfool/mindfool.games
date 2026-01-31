import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { SOUND_ASSETS, SILENCE_ASSET, DEFAULT_VOLUME, SoundType, AMBIENT_ASSETS, AmbientType } from '../constants/audio';

class AudioService {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private volume: number = DEFAULT_VOLUME;
  private enabled: boolean = true;
  private initialized: boolean = false;
  private webUnlocked: boolean = false;
  private ambientSound: Audio.Sound | null = null;
  private currentAmbient: AmbientType = 'off';

  /**
   * Initialize audio mode. Call once on app start.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      this.initialized = true;
    } catch (error) {
      console.warn('AudioService: Failed to initialize audio mode:', error);
    }
  }

  /**
   * Preload all sound effects for instant playback.
   * Call after initialize(), typically during app load.
   */
  async preloadSounds(): Promise<void> {
    for (const [key, asset] of Object.entries(SOUND_ASSETS)) {
      try {
        const { sound } = await Audio.Sound.createAsync(asset);
        this.sounds.set(key as SoundType, sound);
      } catch (error) {
        console.warn(`AudioService: Failed to preload ${key}:`, error);
      }
    }
  }

  /**
   * Unlock web audio context on first user interaction.
   * Call this from a touch handler (e.g., first tap on home screen).
   */
  async unlockWebAudio(): Promise<void> {
    if (Platform.OS !== 'web' || this.webUnlocked) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        SILENCE_ASSET,
        { shouldPlay: true, volume: 0 }
      );
      await sound.unloadAsync();
      this.webUnlocked = true;
    } catch (error) {
      console.warn('AudioService: Web audio unlock failed:', error);
    }
  }

  /**
   * Play a sound effect. Respects enabled setting.
   */
  async playSound(type: SoundType): Promise<void> {
    if (!this.enabled) return;

    const sound = this.sounds.get(type);
    if (!sound) {
      console.warn(`AudioService: Sound ${type} not loaded`);
      return;
    }

    try {
      await sound.setVolumeAsync(this.volume);
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.warn(`AudioService: Failed to play ${type}:`, error);
    }
  }

  /**
   * Start playing an ambient sound loop.
   * Stops any currently playing ambient first.
   */
  async playAmbient(type: AmbientType): Promise<void> {
    if (!this.enabled || type === 'off') {
      await this.stopAmbient();
      return;
    }

    // Stop current ambient if different
    if (this.currentAmbient !== type) {
      await this.stopAmbient();
    }

    // Already playing this ambient
    if (this.ambientSound && this.currentAmbient === type) {
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(AMBIENT_ASSETS[type], {
        isLooping: true,
        volume: this.volume,
        shouldPlay: true,
      });
      this.ambientSound = sound;
      this.currentAmbient = type;
    } catch (error) {
      console.warn(`AudioService: Failed to play ambient ${type}:`, error);
    }
  }

  /**
   * Stop the currently playing ambient sound.
   */
  async stopAmbient(): Promise<void> {
    if (this.ambientSound) {
      try {
        await this.ambientSound.stopAsync();
        await this.ambientSound.unloadAsync();
      } catch (error) {
        // Ignore cleanup errors
      }
      this.ambientSound = null;
      this.currentAmbient = 'off';
    }
  }

  /**
   * Get the currently playing ambient type.
   */
  getCurrentAmbient(): AmbientType {
    return this.currentAmbient;
  }

  /**
   * Set master volume (0.0 to 1.0).
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));

    // Update volume on all loaded sounds
    this.sounds.forEach(async (sound) => {
      try {
        await sound.setVolumeAsync(this.volume);
      } catch (error) {
        // Ignore - sound may be playing
      }
    });

    // Update ambient sound volume
    if (this.ambientSound) {
      this.ambientSound.setVolumeAsync(this.volume).catch(() => {});
    }
  }

  /**
   * Get current volume level.
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Enable or disable all audio.
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAmbient();
    }
  }

  /**
   * Check if audio is enabled.
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Clean up all sounds. Call on app unmount.
   */
  async cleanup(): Promise<void> {
    // Stop ambient sound first
    await this.stopAmbient();

    // Clean up preloaded sounds
    for (const sound of this.sounds.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    this.sounds.clear();
    this.initialized = false;
  }
}

// Export singleton instance
export const audioService = new AudioService();

// Re-export types for convenience
export { SoundType, AmbientType } from '../constants/audio';
