import { Easing } from 'react-native-reanimated';

// Breathing animations use smooth ease-in-out for calm, meditative feel
export const BREATHING_EASING = Easing.inOut(Easing.ease);

// Tap feedback uses quick out-cubic for responsive feel
export const TAP_EASING = Easing.out(Easing.cubic);

// Standard durations in milliseconds
export const ANIMATION_DURATIONS = {
  // Tap feedback
  pressIn: 100,
  pressOut: 200,

  // Card entrance
  cardEntrance: 400,
  cardStagger: 80,

  // Breathing phases (can be overridden per exercise)
  breathDefault: 4000,

  // UI transitions
  fadeIn: 300,
  fadeOut: 200,

  // Score reveal
  countUp: 1500,
} as const;

// Entrance animation delays for staggered lists
export const getStaggerDelay = (index: number, baseDelay = ANIMATION_DURATIONS.cardStagger) =>
  index * baseDelay;
