import { Platform, Share } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';

export interface ShareContent {
  title: string;
  message: string;
  url: string;
  imageUri?: string; // For native sharing with screenshot
}

/**
 * Check if native sharing is available on this platform
 */
export async function isShareAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return typeof navigator !== 'undefined' && 'share' in navigator;
  }
  return Sharing.isAvailableAsync();
}

/**
 * Share content using platform-appropriate method
 * - Web: Web Share API with clipboard fallback
 * - Native: expo-sharing for images, Share API for text
 */
export async function shareContent(content: ShareContent): Promise<{ success: boolean; method: string }> {
  // Haptic feedback on share action
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  try {
    if (Platform.OS === 'web') {
      return await shareWeb(content);
    } else {
      return await shareNative(content);
    }
  } catch (error) {
    console.error('Share failed:', error);
    return { success: false, method: 'error' };
  }
}

async function shareWeb(content: ShareContent): Promise<{ success: boolean; method: string }> {
  // Web Share API (requires HTTPS and user gesture)
  if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ url: content.url })) {
    try {
      await navigator.share({
        title: content.title,
        text: content.message,
        url: content.url,
      });
      return { success: true, method: 'web-share-api' };
    } catch (error) {
      // User cancelled or API failed
      if ((error as Error).name === 'AbortError') {
        return { success: false, method: 'cancelled' };
      }
      // Fall through to clipboard
    }
  }

  // Fallback: Copy to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(`${content.message}\n${content.url}`);
    return { success: true, method: 'clipboard' };
  }

  return { success: false, method: 'unsupported' };
}

async function shareNative(content: ShareContent): Promise<{ success: boolean; method: string }> {
  // If we have an image URI and sharing is available, share the image
  if (content.imageUri && await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(content.imageUri, {
      dialogTitle: content.title,
      UTI: 'public.png',
      mimeType: 'image/png',
    });
    return { success: true, method: 'native-image' };
  }

  // Otherwise share text with URL
  const result = await Share.share({
    message: `${content.message}\n${content.url}`,
    title: content.title,
  });

  if (result.action === Share.sharedAction) {
    return { success: true, method: 'native-text' };
  }

  return { success: false, method: 'dismissed' };
}
