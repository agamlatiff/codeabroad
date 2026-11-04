/**
 * Single-responsibility token definitions for 3D tactile physics shadows,
 * glassmorphism blur presets, and z-index stacking hierarchy.
 */

export const SHADOW_TOKENS = {
  // 3D Push-Down Button Shadows (Resting State)
  tactile: {
    blue: '0 5px 0 0 #1D4ED8',
    cyan: '0 5px 0 0 #0284C7',
    dark: '0 5px 0 0 #020617',
    emerald: '0 5px 0 0 #047857',
    amber: '0 5px 0 0 #B45309',
    rose: '0 5px 0 0 #9F1239',
    white: '0 4px 0 0 #CBD5E1',
    subtle: '0 3px 0 0 rgba(0, 0, 0, 0.4)',
  },

  // 3D Push-Down Button Shadows (Hover State - Elevates slightly)
  tactileHover: {
    blue: '0 6px 0 0 #1D4ED8',
    cyan: '0 6px 0 0 #0284C7',
    dark: '0 6px 0 0 #020617',
    emerald: '0 6px 0 0 #047857',
    amber: '0 6px 0 0 #B45309',
    rose: '0 6px 0 0 #9F1239',
    white: '0 5px 0 0 #CBD5E1',
  },

  // Active Pressed State (Zero shadow, depressed physical element)
  tactileActive: 'none',

  // Atmospheric Glows (Hero Spotlight, Kodi Stage, Milestone Card)
  glow: {
    blue: '0 10px 30px -5px rgba(37, 99, 235, 0.35)',
    cyan: '0 10px 30px -5px rgba(56, 189, 248, 0.35)',
    streak: '0 10px 30px -5px rgba(251, 146, 60, 0.35)',
    xp: '0 10px 30px -5px rgba(245, 158, 11, 0.35)',
    card: '0 20px 45px -15px rgba(0, 0, 0, 0.75)',
  },
} as const

export const GLASS_TOKENS = {
  blurSubtle: 'blur(4px)',
  blurMedium: 'blur(12px)',
  blurDeep: 'blur(20px)',
  surfaceNav: 'rgba(255, 255, 255, 0.9)',
  surfaceModal: 'rgba(255, 255, 255, 0.98)',
  backdropDim: 'rgba(15, 23, 42, 0.45)',
} as const

export const Z_INDEX_TOKENS = {
  base: 0,
  card: 10,
  perforation: 15,
  spotlight: 20,
  stickyHeader: 30,
  dropdown: 40,
  modalBackdrop: 50,
  modal: 60,
  toast: 70,
} as const

