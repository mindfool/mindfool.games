/**
 * Design Tokens
 *
 * Centralized design system values.
 * See: docs/design-system/visual-language.md for full specifications
 */

export const COLORS = {
  // Primary
  primary: '#6B9BD1',
  primaryLight: '#A8C5E0',
  primaryDark: '#4A7BA7',

  // State
  calm: '#4CAF50',
  neutral: '#FFA726',
  scattered: '#EF5350',

  // Background
  backgroundLight: '#F5F7FA',
  backgroundMedium: '#E8EDF2',

  // Text
  textPrimary: '#2C3E50',
  textSecondary: '#5A6C7D',

  // UI
  divider: '#E0E7ED',
  white: '#FFFFFF',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const BORDER_RADIUS = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const TYPOGRAPHY = {
  displayLarge: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const,
  },
  displayMedium: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600' as const,
  },
  heading1: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  heading2: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
} as const;

export const SHADOWS = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Breathing animation timing (in milliseconds)
export const BREATHING_TIMING = {
  inhaleDuration: 4000,
  exhaleDuration: 6000,
  cycleDuration: 10000, // inhale + exhale
  sessionDuration: 180000, // 3 minutes for MVP
} as const;

// Breathing circle dimensions (in dp)
export const BREATHING_CIRCLE = {
  minDiameter: 100,
  maxDiameter: 220,
  minGlow: 0,
  maxGlow: 20,
} as const;

// Calmness scale labels (0-10)
export const SCATTER_LABELS = [
  "Extremely scattered", // 0
  "Very scattered",      // 1
  "Very scattered",      // 2
  "Scattered",           // 3
  "Scattered",           // 4
  "Somewhat scattered",  // 5
  "Somewhat scattered",  // 6
  "Calm",                // 7
  "Calm",                // 8
  "Very calm",           // 9
  "Very calm",           // 10
] as const;

// Delta message thresholds
export const DELTA_THRESHOLDS = {
  majorImprovement: -4, // Delta <= -4
  improvement: -2,      // Delta -3 to -2
  slightImprovement: -1, // Delta -1
  neutral: 0,           // Delta 0
  slightWorse: 1,       // Delta +1
  worse: 2,             // Delta >= +2
} as const;
