import { useState } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { shareContent, ShareContent } from '../lib/sharing';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/tokens';

interface ShareButtonProps {
  content: ShareContent;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  onShareComplete?: (result: { success: boolean; method: string }) => void;
}

export function ShareButton({
  content,
  variant = 'secondary',
  size = 'sm',
  onShareComplete,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePress = async () => {
    if (isSharing) return;

    setIsSharing(true);
    setShowSuccess(false);

    try {
      const result = await shareContent(content);

      if (result.success) {
        setShowSuccess(true);
        // Reset success indicator after 2 seconds
        setTimeout(() => setShowSuccess(false), 2000);
      }

      onShareComplete?.(result);
    } finally {
      setIsSharing(false);
    }
  };

  const isPrimary = variant === 'primary';
  const isSmall = size === 'sm';

  return (
    <Pressable
      onPress={handlePress}
      disabled={isSharing}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
        isSmall ? styles.buttonSmall : styles.buttonMedium,
        pressed && styles.buttonPressed,
        isSharing && styles.buttonDisabled,
      ]}
    >
      {isSharing ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? '#FFFFFF' : COLORS.primary}
        />
      ) : showSuccess ? (
        <Text style={[styles.text, isPrimary && styles.textPrimary]}>
          ✓ {Platform.OS === 'web' ? 'Copied!' : 'Shared!'}
        </Text>
      ) : (
        <Text style={[styles.text, isPrimary && styles.textPrimary]}>
          Share 🔗
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    minWidth: 80,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    minWidth: 120,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
});
