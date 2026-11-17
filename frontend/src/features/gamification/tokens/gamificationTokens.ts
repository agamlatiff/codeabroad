import { COLOR_TOKENS } from "@/shared/tokens/colorTokens"

/**
 * [DOMAIN: GAMIFICATION RULES & KODI MASCOT]
 * Single-responsibility token definitions for Duolingo gamification mechanics:
 * economy rules, XP reward systems, streak milestones, league tiers,
 * Kodi mascot emotions/sizes, and speech bubbles.
 *
 * NOTE:
 * - Sound effects & BGM belong strictly in soundTokens.ts
 * - Color palettes belong strictly in colorTokens.ts
 */

export const PROGRESS_BAR_TOKENS = {
  heights: {
    sm: '8px',
    md: '14px',        // Standard quest & lesson tracker
    lg: '20px',        // Hero chunky milestone bar
  },
  trackBg: COLOR_TOKENS.surface.border,      // Recessed light groove (#E2E8F0)
  trackBorder: COLOR_TOKENS.surface.borderHover, // (#CBD5E1)
  colors: {
    blue: COLOR_TOKENS.brand[600],           // (#2563EB)
    cyan: COLOR_TOKENS.cyan[400],            // (#38BDF8)
    xp: COLOR_TOKENS.gamified.xp,            // (#F5B942)
    streak: COLOR_TOKENS.gamified.streak,    // (#FB923C)
    emerald: COLOR_TOKENS.gamified.verified, // (#10B981)
  },
  glow: {
    blue: '0 0 12px rgba(37, 99, 235, 0.35)',
    emerald: '0 0 12px rgba(16, 185, 129, 0.35)',
    xp: '0 0 12px rgba(245, 158, 11, 0.35)',
  },
} as const

export const GAMIFICATION_RULES_TOKENS = {
  xp: {
    onboardingComplete: 50,
    dailyCheckin: 10,
    questEasy: 20,
    questMedium: 35,
    questHard: 50,
    perfectWeekBonus: 100,
  },
  streakMilestones: [3, 7, 14, 30, 50, 100, 365],
  leagueZones: {
    promotionTop: 3,       // Top 3 advance to next tier
    demotionBottom: 3,     // Bottom 3 fall to lower tier
  },
} as const

export { MASCOT_TOKENS, SPEECH_BUBBLE_TOKENS } from '@/shared/tokens/mascotTokens'
