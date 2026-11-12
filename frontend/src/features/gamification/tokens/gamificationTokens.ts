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

export const MASCOT_TOKENS = {
  name: 'Kodi',
  species: 'Tech Companion Panda / Red Panda',
  title: 'Kodi (Chiikawa Neko) — CodeAbroad Companion',
  emotions: {
    welcome: { label: 'Greeting / Hello', aura: 'rgba(59, 130, 246, 0.25)' },
    celebrate: { label: 'Yatta / Milestone Success', aura: 'rgba(16, 185, 129, 0.3)' },
    coding: { label: 'Deep Focus / Quest Active', aura: 'rgba(37, 99, 235, 0.25)' },
    proud: { label: 'Boarding Pass / Offer Unlocked', aura: 'rgba(245, 158, 11, 0.3)' },
    warning: { label: 'Streak Alert / Daily Reminder', aura: 'rgba(251, 146, 60, 0.3)' },
  },
  sizes: {
    sm: 'w-16 h-16',   // 64px - Compact avatar / inline mascot
    md: 'w-24 h-24',   // 96px - Standard card header / dialog companion
    lg: 'w-32 h-32',   // 128px - Hero celebration / stage companion
    xl: 'w-40 h-40',   // 160px - Milestone panoramic theater
  },
  sizePixels: {
    sm: 64,
    md: 110,
    lg: 160,
    xl: 220,
  },
} as const

export const SPEECH_BUBBLE_TOKENS = {
  bg: '#FFFFFF',
  bgDark: '#162032',
  border: '#E2E8F0',
  borderDark: 'rgba(255, 255, 255, 0.12)',
  tailSize: '8px',
  radius: '1.25rem',  // 20px
  shadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
  containerClass: 'mb-2 z-30 animate-bounce-subtle pointer-events-none',
  bubbleClass:
    'relative bg-white border-2 border-slate-200/90 text-slate-800 px-3 py-1.5 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.08)] text-[11px] font-brand font-black tracking-tight max-w-[200px] text-center',
  tailClass:
    'absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-slate-200/90 rotate-45',
} as const
