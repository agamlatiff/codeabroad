/**
 * Single-responsibility token definitions for Duolingo gamification mechanics:
 * progress bars, economy rules, Kodi mascot emotions, speech bubbles, SFX, and destinations.
 */

export const PROGRESS_BAR_TOKENS = {
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
} as const

export const SPEECH_BUBBLE_TOKENS = {
  bg: '#FFFFFF',
  bgDark: '#162032',
  border: '#E2E8F0',
  borderDark: 'rgba(255, 255, 255, 0.12)',
  tailSize: '8px',
  radius: '1.25rem',  // 20px
  shadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
} as const

export const SFX_TOKENS = {
  buttonTap: '/sounds/button-tap.mp3',
  stampSlam: '/sounds/stamp-slam.mp3',
  streakFlame: '/sounds/streak-flame.mp3',
  xpGain: '/sounds/xp-gain.mp3',
  airportChime: '/sounds/airport-chime.mp3',
  questComplete: '/sounds/quest-complete.mp3',
  errorWobble: '/sounds/error-wobble.mp3',
} as const

export const DESTINATION_TOKENS = {
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
} as const

