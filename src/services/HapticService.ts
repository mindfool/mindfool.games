import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

class HapticService {
  private enabled: boolean = true;

  /**
   * Check if haptics are available on this platform.
   * Web and some Android devices don't support haptics.
   */
  private canVibrate(): boolean {
    return Platform.OS !== 'web';
  }

  /**
   * Light haptic - use for button taps, selections.
   * ImpactFeedbackStyle.Light
   */
  async light(): Promise<void> {
    if (!this.enabled || !this.canVibrate()) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Silently fail - haptics not critical
    }
  }

  /**
   * Medium haptic - use for practice start, significant actions.
   * ImpactFeedbackStyle.Medium
   */
  async medium(): Promise<void> {
    if (!this.enabled || !this.canVibrate()) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Heavy haptic - use for emphasis, warnings.
   * ImpactFeedbackStyle.Heavy
   */
  async heavy(): Promise<void> {
    if (!this.enabled || !this.canVibrate()) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Success haptic pattern - use for practice completion.
   * NotificationFeedbackType.Success
   */
  async success(): Promise<void> {
    if (!this.enabled || !this.canVibrate()) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Selection haptic - very subtle, for scrolling/selection changes.
   * Uses selectionAsync for minimal feedback.
   */
  async selection(): Promise<void> {
    if (!this.enabled || !this.canVibrate()) return;
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Enable or disable haptic feedback.
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if haptics are enabled.
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const hapticService = new HapticService();
