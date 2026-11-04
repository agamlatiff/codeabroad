/**
 * Single-responsibility token definitions for surfaces, brand palettes,
 * gamified semantic colors, typography colors, and curated gradients.
 */

export const COLOR_TOKENS = {
  // A. Surfaces & Backgrounds (Clean Warm Light Mode Primary - SSOT)
  surface: {
    ground: '#FAFAF9',        // Warm white canvas (consistent with Onboarding & Auth)
    canvas: '#FFFFFF',        // Pure white card container
    card: '#FFFFFF',          // Clean white surface
    elevated: '#F8FAFC',      // Soft elevated container, list slots, tiles
    overlay: '#FFFFFF',       // Dropdowns, floating pills, hover surfaces
    modal: '#FFFFFF',         // Modal windows
    border: '#E2E8F0',        // Tactile slate border
    borderHover: '#CBD5E1',   // Active / hover boundary
    borderFocus: '#3B82F6',   // Keyboard focus ring (Electric Blue)
  },

  // B. Dark Code Editor Surfaces (Exclusively for LearnWorkspacePage IDE)
  editorSurface: {
    ground: '#080D18',        // Deep midnight canvas for Monaco / code syntax
    canvas: '#101827',        // Code editor dark panel
    card: '#101827',
    elevated: '#172236',
    border: '#27364D',
    borderHover: '#3B82F6',
  },

  // C. Primary Brand: Electric Tech Blue
  brand: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',           // Vibrant electric accent
    600: '#2563EB',           // Core CodeAbroad Blue
    700: '#1D4ED8',           // 3D Button bevel shadow depth
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
    primary: '#3B82F6',
    hover: '#60A5FA',
    active: '#2563EB',
    shadow: '#1D4ED8',
    glow: 'rgba(59, 130, 246, 0.35)',
  },

  // D. Brand Secondary: Neon Cyan & Flight Path
  cyan: {
    400: '#38BDF8',           // Tokyo flight route accent
    500: '#0EA5E9',
    600: '#0284C7',           // 3D Cyan bevel shadow depth
    700: '#0369A1',
    shadow: '#0284C7',
    glow: 'rgba(56, 189, 248, 0.35)',
  },

  // E. Gamification Engine (Core Duolingo Mechanics)
  gamified: {
    // Streak System (Flame / Heat)
    streak: '#FB923C',        // Fire orange
    streakHover: '#F97316',
    streakShadow: '#C2410C',
    streakBg: 'rgba(251, 146, 60, 0.12)',
    streakGlow: 'rgba(251, 146, 60, 0.35)',

    // XP & Rewards System (Gold Coin / Star)
    xp: '#F5B942',            // Warm amber gold
    xpHover: '#D97706',
    xpShadow: '#B45309',
    xpBg: 'rgba(245, 185, 66, 0.12)',
    xpBorder: '#27364D',
    xpGlow: 'rgba(245, 185, 66, 0.35)',

    // Verified / Pass / Quests Complete
    verified: '#10B981',      // Restrained emerald green
    verifiedHover: '#059669',
    verifiedShadow: '#047857',
    verifiedBg: 'rgba(16, 185, 129, 0.12)',

    // Japanese Tech Culture / Hanko Seal
    hanko: '#E11D48',         // Japanese cinnabar red
    hankoShadow: '#BE123C',
    hankoBg: 'rgba(225, 29, 72, 0.12)',

    // Competitive Leagues (Leaderboard tiers)
    leagues: {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      sapphire: '#0F52BA',
      ruby: '#E0115F',
      diamond: '#B9F2FF',
      obsidian: '#3D3D3D',
    },
  },

  // F. Semantics & System Feedback
  semantic: {
    success: {
      base: '#10B981',
      surface: 'rgba(16, 185, 129, 0.1)',
      border: '#27364D',
      text: '#34D399',
    },
    warning: {
      base: '#F5B942',
      surface: 'rgba(245, 185, 66, 0.1)',
      border: '#27364D',
      text: '#FBBF24',
    },
    error: {
      base: '#F43F5E',
      surface: 'rgba(244, 63, 94, 0.1)',
      border: 'rgba(244, 63, 94, 0.3)',
      text: '#FB7185',
    },
    info: {
      base: '#38BDF8',
      surface: 'rgba(56, 189, 248, 0.1)',
      border: '#27364D',
      text: '#7DD3FC',
    },
  },

  // G. Typography Colors (Cool White High-Contrast)
  text: {
    primary: '#F1F5F9',       // High-contrast cool white
    secondary: '#94A3B8',     // Muted slate descriptions & subheads
    muted: '#64748B',         // Subtle footnotes, watermarks, airport labels
    accent: '#3B82F6',        // Clickable interactive link text (Electric Blue)
    inverse: '#080D18',       // Text on bright buttons/badges
  },
} as const

export const GRADIENT_TOKENS = {
  // Flight Path / Hero Brand (Electric Blue to Neon Cyan)
  brand: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
  // Flame Streak (Fire Orange to Hot Red)
  streak: 'linear-gradient(135deg, #FB923C 0%, #EF4444 100%)',
  // XP Gold Sheen
  xp: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
  // Hanko / Verification Seal
  hanko: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
  // Dark Matte Card Mesh
  cardMesh: 'linear-gradient(180deg, #162032 0%, #111827 100%)',
  // Duolingo Iconic Pill Gloss Highlight (Glass shine on top half of bars/buttons)
  glossHighlight: 'linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 100%)',
} as const

