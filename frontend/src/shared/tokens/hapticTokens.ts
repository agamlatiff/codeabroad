/**
 * [DOMAIN: HAPTIC VIBRATION]
 * Single Source of Truth untuk pola getaran hardware sentuh (navigator.vibrate).
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
