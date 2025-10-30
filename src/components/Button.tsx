import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const containerStyle = [
    styles.container,
    fullWidth && styles.fullWidth,
  ].filter(Boolean);

  const textStyle = [
    styles.text,
    variant === 'primary' ? styles.primaryText : styles.secondaryText,
    disabled && styles.disabledText,
  ].filter(Boolean);

  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#7BA5D6', '#6B9BD1', '#5A8BC7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={textStyle}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const buttonStyle = [
    styles.button,
    variant === 'secondary' && styles.secondary,
    disabled && styles.disabled,
  ].filter(Boolean);

  return (
    <TouchableOpacity
      style={[containerStyle, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xl,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  secondary: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  disabled: {
    backgroundColor: COLORS.divider,
    borderColor: COLORS.divider,
    shadowOpacity: 0,
    elevation: 0,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  secondaryText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  disabledText: {
    color: COLORS.textSecondary,
    opacity: 0.5,
  },
});
