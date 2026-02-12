import Constants from 'expo-constants';
import type { GameMode } from '../../types';

// Marketing site URL (Next.js mindfool.games-web on Vercel)
const MARKETING_SITE = 'https://mindfool.games';

// App URL (Expo app mindfool.games on Vercel)
const APP_BASE = 'https://app.mindfool.games';

/**
 * Build a deep link URL for a specific practice
 * In development: uses custom scheme (mindfool://)
 * In production: uses universal link (https://app.mindfool.games)
 */
export function buildDeepLink(practice: GameMode): string {
  // Map practice name to route
  const practiceRoute = practice;

  if (__DEV__) {
    // Development: custom scheme for Expo Go
    const scheme = Constants.expoConfig?.scheme || 'mindfool';
    return `${scheme}://${practiceRoute}`;
  }

  // Production: universal link to PWA
  return `${APP_BASE}/${practiceRoute}`;
}

/**
 * Build a shareable URL for streak achievement
 * Points to marketing site which has OG meta tags for social preview
 */
export function buildStreakShareUrl(days: number, practice?: GameMode): string {
  const params = new URLSearchParams({
    days: String(days),
    ...(practice && { practice }),
  });

  // Share URL points to marketing site for OG preview
  // Marketing site will redirect to app or show download CTA
  return `${MARKETING_SITE}/share/streak?${params.toString()}`;
}

/**
 * Build share content for streak achievement
 */
export function buildStreakShareContent(days: number, practice?: GameMode) {
  const url = buildStreakShareUrl(days, practice);
  const practiceText = practice ? ` with ${formatPracticeName(practice)}` : '';

  return {
    title: `${days} Day Mindfulness Streak!`,
    message: `I've maintained a ${days} day streak${practiceText} on MindFool.Games! Join me in building mental resilience through daily practice.`,
    url,
  };
}

/**
 * Format practice name for display
 */
function formatPracticeName(practice: GameMode): string {
  const names: Record<GameMode, string> = {
    'balloon-breathing': 'Balloon Breathing',
    'walking-meditation': 'Walking Meditation',
    'number-bubbles': 'Number Bubbles',
    'gong-listening': 'Gong Listening',
    'counting-ladder': 'Counting Ladder',
    'box-breathing': 'Box Breathing',
    '478-breathing': '4-7-8 Breathing',
    'body-scan': 'Body Scan',
    'mindful-eating': 'Mindful Eating',
    'loving-kindness': 'Loving Kindness',
    'gratitude-journal': 'Gratitude Journal',
  };
  return names[practice] || practice;
}
