/**
 * Design Tokens
 *
 * Centralized design system values.
 * See: docs/design-system/visual-language.md for full specifications
 */

export const COLORS = {
  // Primary - Serene Blue-Purple
  primary: '#7C3AED',        // Vibrant purple
  primaryLight: '#A78BFA',   // Light purple
  primaryDark: '#5B21B6',    // Deep purple
  primarySoft: '#EDE9FE',    // Very light purple background

  // Accent Colors
  accent: '#EC4899',         // Pink accent
  accentLight: '#F9A8D4',
  accentSoft: '#FCE7F3',

  // State
  calm: '#10B981',           // Emerald green
  neutral: '#F59E0B',        // Amber
  scattered: '#EF4444',      // Red

  // Background - Soft gradients
  background: '#FAFBFC',
  backgroundLight: '#F8FAFC',
  backgroundMedium: '#F1F5F9',

  // Surface
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#1E293B',    // Slate 800
  textSecondary: '#64748B',  // Slate 500
  textTertiary: '#94A3B8',   // Slate 400

  // UI
  divider: '#E2E8F0',
  border: '#E2E8F0',
  white: '#FFFFFF',

  // Game specific
  breathing: '#7C3AED',
  walking: '#06B6D4',        // Cyan
  bubbles: '#F59E0B',        // Amber
  gong: '#F97316',           // Orange
  ladder: '#3B82F6',         // Blue
  box: '#8B5CF6',            // Violet
  sleep: '#6366F1',          // Indigo
  bodyScan: '#A855F7',       // Purple
  loving: '#EC4899',         // Pink
  eating: '#F59E0B',         // Amber
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
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
  xs: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },
  xl: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  colored: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
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
  majorImprovement: 4,  // Delta >= +4 (much calmer)
  improvement: 2,       // Delta +2 to +3
  slightImprovement: 1, // Delta +1
  neutral: 0,           // Delta 0
  slightWorse: -1,      // Delta -1 (slightly more scattered)
  worse: -2,            // Delta <= -2
} as const;
