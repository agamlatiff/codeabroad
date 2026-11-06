/**
 * Single source of truth for sound effects (SFX) tokens,
 * procedural Web Audio synthesis configurations, and sound settings.
 */

export type SoundEffectType =
  | 'node_tap'
  | 'node_hover'
  | 'modal_open'
  | 'modal_close'
  | 'quest_start'
  | 'node_locked'
  | 'view_switch'
  | 'trophy_tap'
  | 'track_change'
  | 'yamanote_jingle'
  | 'zen_bell'
  // Forward-compatible gamification SFX
  | 'quest_complete'
  | 'gem_collect'
  | 'streak_ignite'

export type SoundscapeTrack = 'universal' | 'japan'
export type AudioPlaybackMode = 'all' | 'sfx_only' | 'muted'

export interface ToneStep {
  freq: number
  targetFreq?: number
  type?: OscillatorType
  duration: number
  gain: number
  rampType?: 'linear' | 'exponential'
  delay?: number
}

export interface SoundConfig {
  volume: number
  steps: ToneStep[]
}

export const SOUND_STORAGE_KEYS = {
  muted: 'codeabroad_sound_muted',
  volume: 'codeabroad_sound_volume',
  audioMode: 'codeabroad_audio_mode',
  bgmVolume: 'codeabroad_bgm_volume',
} as const

export const DEFAULT_MASTER_VOLUME = 0.65
export const DEFAULT_BGM_VOLUME = 0.12

/**
 * Universal Lo-Fi chill chords (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
 * Synthesized through warm 400Hz low-pass filters for focus coding.
 */
export const UNIVERSAL_SOUNDSCAPE_CHORDS: number[][] = [
  [174.61, 261.63, 329.63, 440.0], // Fmaj7 (F3, C4, E4, A4)
  [164.81, 246.94, 293.66, 392.0], // Em7 (E3, B3, D4, G4)
  [146.83, 220.0, 261.63, 349.23], // Dm7 (D3, A3, C4, F4)
  [130.81, 196.0, 246.94, 329.63], // Cmaj7 (C3, G3, B3, E4)
]

/**
 * Traditional Japanese pentatonic scale (Insen & Yo scale notes: D, Eb, G, A, C, D)
 * Synthesizes organic koto-like acoustic plucked tones and Tokyo temple atmosphere.
 */
export const JAPAN_SOUNDSCAPE_SCALE: number[] = [
  293.66, // D4
  311.13, // Eb4
  392.0,  // G4
  440.0,  // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
]

export const SOUND_PRESETS: Record<SoundEffectType, SoundConfig> = {
  // 1. Cheerful popping bubble tap on interactive roadmap nodes
  node_tap: {
    volume: 0.35,
    steps: [
      {
        freq: 480,
        targetFreq: 880,
        type: 'sine',
        duration: 0.08,
        gain: 0.4,
        rampType: 'exponential',
      },
    ],
  },

  // 1b. Tactile micro-tick when hovering nodes (gentle spatial feedback)
  node_hover: {
    volume: 0.1,
    steps: [
      {
        freq: 1400,
        targetFreq: 1800,
        type: 'sine',
        duration: 0.025,
        gain: 0.25,
        rampType: 'exponential',
      },
    ],
  },

  // 2. Gentle upward chime when opening quest detail modal
  modal_open: {
    volume: 0.3,
    steps: [
      {
        freq: 523.25, // C5
        type: 'triangle',
        duration: 0.09,
        gain: 0.3,
        delay: 0,
      },
      {
        freq: 659.25, // E5
        type: 'triangle',
        duration: 0.11,
        gain: 0.35,
        delay: 0.04,
      },
      {
        freq: 783.99, // G5
        type: 'sine',
        duration: 0.16,
        gain: 0.4,
        delay: 0.08,
      },
    ],
  },

  // 3. Soft pop-down when closing modal
  modal_close: {
    volume: 0.25,
    steps: [
      {
        freq: 659.25, // E5
        targetFreq: 392.0, // G4
        type: 'sine',
        duration: 0.09,
        gain: 0.3,
        rampType: 'exponential',
      },
    ],
  },

  // 4. Upbeat triumphant arpeggio fanfare when starting a quest
  quest_start: {
    volume: 0.4,
    steps: [
      { freq: 523.25, type: 'triangle', duration: 0.08, gain: 0.35, delay: 0 },
      { freq: 659.25, type: 'triangle', duration: 0.08, gain: 0.35, delay: 0.06 },
      { freq: 783.99, type: 'triangle', duration: 0.1, gain: 0.4, delay: 0.12 },
      { freq: 1046.5, type: 'sine', duration: 0.22, gain: 0.5, delay: 0.18 },
    ],
  },

  // 5. Dull low wooden thud when attempting to click a locked node
  node_locked: {
    volume: 0.45,
    steps: [
      {
        freq: 180,
        targetFreq: 80,
        type: 'triangle',
        duration: 0.12,
        gain: 0.5,
        rampType: 'exponential',
      },
    ],
  },

  // 6. Crisp snappy mechanical slide click when toggling Map vs Syllabus
  view_switch: {
    volume: 0.25,
    steps: [
      {
        freq: 920,
        targetFreq: 1400,
        type: 'triangle',
        duration: 0.04,
        gain: 0.35,
        rampType: 'exponential',
      },
      {
        freq: 1200,
        targetFreq: 600,
        type: 'sine',
        duration: 0.05,
        gain: 0.3,
        delay: 0.03,
        rampType: 'exponential',
      },
    ],
  },

  // 7. Shimmering golden chime when clicking the unit Trophy Milestone / Boss node
  trophy_tap: {
    volume: 0.4,
    steps: [
      { freq: 880.0, type: 'sine', duration: 0.15, gain: 0.3, delay: 0 },
      { freq: 1108.73, type: 'sine', duration: 0.2, gain: 0.35, delay: 0.05 },
      { freq: 1318.51, type: 'sine', duration: 0.25, gain: 0.4, delay: 0.1 },
      { freq: 1760.0, type: 'sine', duration: 0.35, gain: 0.45, delay: 0.15 },
    ],
  },

  // 8. Warm musical chord when switching career track
  track_change: {
    volume: 0.35,
    steps: [
      { freq: 440.0, type: 'triangle', duration: 0.12, gain: 0.3, delay: 0 },
      { freq: 554.37, type: 'triangle', duration: 0.14, gain: 0.35, delay: 0.06 },
      { freq: 659.25, type: 'sine', duration: 0.22, gain: 0.4, delay: 0.12 },
    ],
  },

  // 9. Tokyo Yamanote Line Station Departure Jingle (JR East melodic chime)
  yamanote_jingle: {
    volume: 0.35,
    steps: [
      { freq: 659.25, type: 'triangle', duration: 0.12, gain: 0.35, delay: 0 },     // E5
      { freq: 830.61, type: 'triangle', duration: 0.12, gain: 0.35, delay: 0.09 },  // G#5
      { freq: 987.77, type: 'triangle', duration: 0.14, gain: 0.4, delay: 0.18 },   // B5
      { freq: 1318.51, type: 'sine', duration: 0.32, gain: 0.45, delay: 0.28 },    // E6
    ],
  },

  // 10. Serene Japanese Temple Bell / Koto acoustic pluck
  zen_bell: {
    volume: 0.3,
    steps: [
      { freq: 440.0, type: 'sine', duration: 0.4, gain: 0.35, delay: 0 },
      { freq: 659.25, type: 'sine', duration: 0.5, gain: 0.3, delay: 0.08 },
      { freq: 880.0, type: 'sine', duration: 0.7, gain: 0.25, delay: 0.15 },
    ],
  },

  // 11. Forward-compatible: quest victory celebration
  quest_complete: {
    volume: 0.5,
    steps: [
      { freq: 523.25, type: 'triangle', duration: 0.1, gain: 0.4, delay: 0 },
      { freq: 659.25, type: 'triangle', duration: 0.1, gain: 0.4, delay: 0.08 },
      { freq: 783.99, type: 'triangle', duration: 0.12, gain: 0.45, delay: 0.16 },
      { freq: 1046.5, type: 'sine', duration: 0.35, gain: 0.55, delay: 0.24 },
    ],
  },

  // 12. Forward-compatible: coin / gem pickup ding
  gem_collect: {
    volume: 0.35,
    steps: [
      {
        freq: 987.77,
        targetFreq: 1318.51,
        type: 'sine',
        duration: 0.14,
        gain: 0.45,
        rampType: 'exponential',
      },
    ],
  },

  // 13. Forward-compatible: streak flame ignite
  streak_ignite: {
    volume: 0.4,
    steps: [
      {
        freq: 220,
        targetFreq: 660,
        type: 'sawtooth',
        duration: 0.18,
        gain: 0.35,
        rampType: 'exponential',
      },
    ],
  },
}
