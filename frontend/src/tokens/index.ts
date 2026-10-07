/**
 * ============================================================================
 * CodeAbroad Design Tokens — Comprehensive System Specification
 * ============================================================================
 * Visual Identity: 90% Duolingo Clean Light Mode Taste + 10% CodeAbroad Electric Blue Soul
 *
 * This file serves as the Single Source of Truth (SSOT) for colors, typography,
 * 3D tactile physics, gamification variables, elevations, progress bars, form states,
 * gradients, and layout constraints.
 */

export const TOKENS = {
  // ── 1. COLOR SYSTEM ────────────────────────────────────────────────────────
  colors: {
    // A. Surfaces & Backgrounds (Duolingo Clean Light Mode Aesthetic)
    surface: {
      ground: '#FAFAF9',        // Warm canvas / stone base (#FAFAF9)
      canvas: '#FFFFFF',        // Primary container / pure white surface
      card: '#FFFFFF',          // Stage card container
      elevated: '#F1F5F9',      // 2x2 metric tiles, interactive item containers
      overlay: '#F8FAFC',       // Dropdowns, floating pills, hover surfaces
      modal: '#FFFFFF',         // Modal windows & flight ticket cockpit
      border: '#E2E8F0',        // Subtle card boundary
      borderHover: '#CBD5E1',   // Active/hover boundary
      borderFocus: '#2563EB',   // Keyboard focus ring (Electric Blue)
    },

    // B. Dark Contrast Surfaces (Optional High-Contrast Contexts)
    darkSurface: {
      ground: '#0A0E17',
      card: '#111827',
      elevated: '#162032',
      border: 'rgba(255, 255, 255, 0.08)',
      borderHover: 'rgba(59, 130, 246, 0.4)',
    },

    // C. Primary Brand: Electric Tech Blue (Replacing Duolingo Green)
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
      primary: '#2563EB',
      hover: '#3B82F6',
      active: '#1D4ED8',
      shadow: '#1D4ED8',
      glow: 'rgba(37, 99, 235, 0.35)',
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
      xp: '#F59E0B',            // Amber gold
      xpHover: '#D97706',
      xpShadow: '#B45309',
      xpBg: 'rgba(245, 158, 11, 0.12)',
      xpBorder: 'rgba(245, 158, 11, 0.3)',
      xpGlow: 'rgba(245, 158, 11, 0.35)',

      // Verified / Pass / Quests Complete
      verified: '#10B981',      // Emerald green
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
        border: 'rgba(16, 185, 129, 0.3)',
        text: '#34D399',
      },
      warning: {
        base: '#F59E0B',
        surface: 'rgba(245, 158, 11, 0.1)',
        border: 'rgba(245, 158, 11, 0.3)',
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
        border: 'rgba(56, 189, 248, 0.3)',
        text: '#7DD3FC',
      },
    },

    // G. Typography Colors (Clean Light Mode High-Contrast)
    text: {
      primary: '#0F172A',       // High-contrast slate-900
      secondary: '#475569',     // Slate-600 descriptions & subheads
      muted: '#94A3B8',         // Subtle footnotes, watermarks, airport labels
      accent: '#2563EB',        // Clickable interactive link text (Electric Blue)
      inverse: '#FFFFFF',       // Text on dark/blue buttons
    },
  },

  // ── 2. CURATED GRADIENTS & AMBIENT MESH ─────────────────────────────────────
  gradients: {
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
  },

  // ── 3. TACTILE 3D PHYSICS & SHADOWS ────────────────────────────────────────
  shadows: {
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
  },

  // ── 4. GAMIFIED PROGRESS BAR & METERS (DUOLINGO CORE) ─────────────────────
  progressBar: {
    heights: {
      sm: '8px',
      md: '14px',        // Standard quest & lesson tracker
      lg: '20px',        // Hero chunky milestone bar
    },
    trackBg: '#E2E8F0',  // Recessed light groove
    trackBorder: '#CBD5E1',
    colors: {
      blue: '#2563EB',
      cyan: '#38BDF8',
      xp: '#F59E0B',
      streak: '#FB923C',
      emerald: '#10B981',
    },
    glow: {
      blue: '0 0 12px rgba(37, 99, 235, 0.35)',
      emerald: '0 0 12px rgba(16, 185, 129, 0.35)',
      xp: '0 0 12px rgba(245, 158, 11, 0.35)',
    },
  },

  // ── 5. FORM & INPUT CONTROLS (TACTILE CLEAN LIGHT FORM SYSTEM) ────────────
  forms: {
    inputBg: '#FFFFFF',
    inputBgHover: '#F8FAFC',
    borderResting: '#E2E8F0',
    borderHover: '#CBD5E1',
    focusRing: '0 0 0 4px rgba(37, 99, 235, 0.15)',
    errorRing: '0 0 0 4px rgba(244, 63, 94, 0.15)',
    placeholder: '#94A3B8',
    text: '#0F172A',
    disabledOpacity: 0.5,
  },

  // ── 6. GLASSMORPHISM & BLUR PRESETS (CLEAN FROSTED LIGHT) ─────────────────
  glass: {
    blurSubtle: 'blur(4px)',
    blurMedium: 'blur(12px)',
    blurDeep: 'blur(20px)',
    surfaceNav: 'rgba(255, 255, 255, 0.9)',
    surfaceModal: 'rgba(255, 255, 255, 0.98)',
    backdropDim: 'rgba(15, 23, 42, 0.45)',
  },

  // ── 7. TYPOGRAPHY SCALE ────────────────────────────────────────────────────
  typography: {
    fontFamily: {
      sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      brand: "'Fredoka', 'Plus Jakarta Sans', system-ui, sans-serif",
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
  },

  // ── 8. GEOMETRY & CORNER RADIUS ────────────────────────────────────────────
  radius: {
    sm: '0.5rem',       // 8px - Badges, micro tags
    md: '0.75rem',      // 12px - Small inputs, avatar containers
    tile: '1rem',       // 16px - 2x2 metric stat tiles (rounded-2xl)
    button: '1rem',     // 16px - Chunky 3D buttons (rounded-2xl)
    card: '1.5rem',     // 24px - Hero containers & dark modal cards (rounded-3xl)
    largeCard: '2rem',  // 32px - Boarding pass main stage
    pill: '9999px',     // Full capsule buttons & status pills
  },

  // ── 9. SPACING & LAYOUT BREAKPOINTS ────────────────────────────────────────
  layout: {
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
  },

  // ── 10. ANIMATION & TIMING CURVES ──────────────────────────────────────────
  animation: {
    pressTransform: 'translateY(4px)',
    pressTiming: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    springEase: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    floatDuration: '4s ease-in-out infinite',
    pulseDuration: '3s ease-in-out infinite',
  },

  // ── 11. MASCOT & EMOTION REGISTRY (KODI SYSTEM) ───────────────────────────
  mascot: {
    name: 'Kodi',
    species: 'Tech Companion Panda / Red Panda',
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
  },

  // ── 12. DUOLINGO COMIC SPEECH BUBBLE (CLEAN LIGHT SSOT) ───────────────────
  speechBubble: {
    bg: '#FFFFFF',
    bgDark: '#162032',
    border: '#E2E8F0',
    borderDark: 'rgba(255, 255, 255, 0.12)',
    tailSize: '8px',
    radius: '1.25rem',  // 20px
    shadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
  },

  // ── 13. GAMIFIED MICRO-INTERACTION KEYFRAMES ──────────────────────────────
  microInteractions: {
    stampSlam: 'stamp-slam 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
    flamePulse: 'flame-pulse 2s ease-in-out infinite',
    pop: 'pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    wobble: 'wobble 0.4s ease-in-out',
  },

  // ── 14. INTERNATIONAL TECH HUB DESTINATIONS (CODEABROAD NARRATIVE) ──────
  destinations: {
    origin: {
      code: 'CGK',
      city: 'Jakarta',
      country: 'Indonesia',
      flag: '🇮🇩',
      airport: 'Soekarno-Hatta Int Airport',
    },
    targets: {
      JP: {
        code: 'HND',
        city: 'Tokyo',
        country: 'Jepang',
        flag: '🇯🇵',
        airport: 'Haneda International Airport',
        currency: 'JPY',
        visa: 'Engineer / Specialist in Humanities',
        flightNumber: 'CA-2026',
        timezoneOffset: '+09:00',
      },
      DE: {
        code: 'BER',
        city: 'Berlin',
        country: 'Jerman',
        flag: '🇩🇪',
        airport: 'Berlin Brandenburg Airport',
        currency: 'EUR',
        visa: 'EU Blue Card',
        flightNumber: 'CA-2026',
        timezoneOffset: '+02:00',
      },
      SG: {
        code: 'SIN',
        city: 'Singapore',
        country: 'Singapura',
        flag: '🇸🇬',
        airport: 'Changi International Airport',
        currency: 'SGD',
        visa: 'Employment Pass (EP)',
        flightNumber: 'CA-2026',
        timezoneOffset: '+08:00',
      },
      UK: {
        code: 'LHR',
        city: 'London',
        country: 'Inggris',
        flag: '🇬🇧',
        airport: 'Heathrow International Airport',
        currency: 'GBP',
        visa: 'Skilled Worker Visa',
        flightNumber: 'CA-2026',
        timezoneOffset: '+01:00',
      },
    },
  },

  // ── 15. GAMIFIED AUDIO & SFX CUES ──────────────────────────────────────────
  sfx: {
    buttonTap: '/sounds/button-tap.mp3',
    stampSlam: '/sounds/stamp-slam.mp3',
    streakFlame: '/sounds/streak-flame.mp3',
    xpGain: '/sounds/xp-gain.mp3',
    airportChime: '/sounds/airport-chime.mp3',
    questComplete: '/sounds/quest-complete.mp3',
    errorWobble: '/sounds/error-wobble.mp3',
  },

  // ── 16. GAMIFICATION ECONOMY & MILESTONE RULES ─────────────────────────────
  gamificationRules: {
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
  },

  // ── 17. MOBILE HAPTIC FEEDBACK PATTERNS ────────────────────────────────────
  haptics: {
    tap: 10,                           // Light touch 10ms
    success: [15, 40, 20],             // Quick double buzz
    stampImpact: [40, 20, 50],         // Heavy tactile thump
    streakIgnite: [20, 30, 20, 30, 40],// Crackle buzz
    error: [50, 50, 50],               // Triple alert buzz
  },

  // ── 18. Z-INDEX HIERARCHY ──────────────────────────────────────────────────
  zIndex: {
    base: 0,
    card: 10,
    perforation: 15,
    spotlight: 20,
    stickyHeader: 30,
    dropdown: 40,
    modalBackdrop: 50,
    modal: 60,
    toast: 70,
  },
} as const

export type DesignTokens = typeof TOKENS
