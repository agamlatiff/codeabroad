/**
 * [DOMAIN: HAPTIC VIBRATION & TACTILE MOTION]
 * Single Source of Truth untuk pola getaran hardware sentuh (navigator.vibrate)
 * dan kurva timing animasi mikrotaktil tombol (spring easing & keyframes).
 *
 * NOTE:
 * - Efek suara audio synthesizer berada di soundTokens.ts
 * - Ketinggian bayangan fisik tombol berada di elevationTokens.ts
 */

export const HAPTIC_PATTERNS = {
  tap: 10,                           // Light touch 10ms
  success: [15, 40, 20],             // Quick double buzz
  stampImpact: [40, 20, 50],         // Heavy tactile thump
  streakIgnite: [20, 30, 20, 30, 40],// Crackle buzz
  error: [50, 50, 50],               // Triple alert buzz
} as const

export type HapticType = keyof typeof HAPTIC_PATTERNS

export const ANIMATION_TOKENS = {
  pressTransform: 'translateY(4px)',
  pressTiming: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  springEase: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  floatDuration: '4s ease-in-out infinite',
  pulseDuration: '3s ease-in-out infinite',
} as const

export const MICRO_INTERACTION_TOKENS = {
  stampSlam: 'stamp-slam 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
  flamePulse: 'flame-pulse 2s ease-in-out infinite',
  pop: 'pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
  wobble: 'wobble 0.4s ease-in-out',
} as const
