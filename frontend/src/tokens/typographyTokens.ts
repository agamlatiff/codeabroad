/**
 * Single-responsibility token definitions for font families and typographic scale.
 */

export const TYPOGRAPHY_TOKENS = {
  fontFamily: {
    brand: "'Nunito', 'Fredoka', system-ui, -apple-system, sans-serif",
    sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },

  scale: {
    display: {
      fontSize: '2.5rem',     // 40px - For streak count, milestone numbers
      lineHeight: '1.1',
      fontWeight: '900',
      letterSpacing: '-0.03em',
    },
    h1: {
      fontSize: '1.875rem',   // 30px - Stage main titles
      lineHeight: '1.2',
      fontWeight: '800',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '1.5rem',     // 24px - Section headlines, card titles
      lineHeight: '1.25',
      fontWeight: '800',
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.25rem',    // 20px - Sub-section headers, stat tiles
      lineHeight: '1.3',
      fontWeight: '700',
    },
    bodyLarge: {
      fontSize: '1rem',       // 16px - Primary interaction body
      lineHeight: '1.5',
      fontWeight: '500',
    },
    body: {
      fontSize: '0.875rem',   // 14px - Standard copy & descriptions
      lineHeight: '1.5',
      fontWeight: '400',
    },
    caption: {
      fontSize: '0.75rem',    // 12px - Labels, micro-headers, stat keys
      lineHeight: '1.4',
      fontWeight: '700',
      letterSpacing: '0.05em',
    },
    micro: {
      fontSize: '0.625rem',   // 10px - Barcode, flight meta, timestamps
      lineHeight: '1.3',
      fontWeight: '700',
      letterSpacing: '0.08em',
    },
  },
} as const

