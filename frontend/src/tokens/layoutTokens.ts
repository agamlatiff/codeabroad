/**
 * Single-responsibility token definitions for layout breakpoints, container geometry,
 * border radii, and form input controls.
 */

export const LAYOUT_TOKENS = {
  maxWidth: {
    mobile: '420px',    // Focused mobile form / single-card view
    compact: '640px',   // Center stage hero (Step 4 Boarding Pass)
    standard: '1024px', // Tablet & standard dashboard
    wide: '1280px',     // Full panoramic flight theater
  },
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
  minTouchTarget: '44px',
  buttonHeight: {
    sm: '38px',
    md: '48px',
    lg: '56px',
  },
} as const

export const RADIUS_TOKENS = {
  sm: '0.5rem',       // 8px - Badges, micro tags
  md: '0.75rem',      // 12px - Small inputs, avatar containers
  tile: '1rem',       // 16px - 2x2 metric stat tiles (rounded-2xl)
  button: '1rem',     // 16px - Chunky 3D buttons (rounded-2xl)
  card: '1.5rem',     // 24px - Hero containers & dark modal cards (rounded-3xl)
  largeCard: '2rem',  // 32px - Boarding pass main stage
  pill: '9999px',     // Full capsule buttons & status pills
} as const

export const FORM_TOKENS = {
  inputBg: '#FFFFFF',
  inputBgHover: '#F8FAFC',
  borderResting: '#E2E8F0',
  borderHover: '#CBD5E1',
  focusRing: '0 0 0 4px rgba(37, 99, 235, 0.15)',
  errorRing: '0 0 0 4px rgba(244, 63, 94, 0.15)',
  placeholder: '#94A3B8',
  text: '#0F172A',
  disabledOpacity: 0.5,
} as const

