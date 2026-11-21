/**
 * Shared Mascot ("Kodi") & Speech Bubble Design Tokens.
 */

export type KodiStudyEmotion =
  | 'curious'
  | 'reading'
  | 'idea'
  | 'polite'
  | 'explaining'
  | 'listening'
  | 'writing'
  | 'chatting'
  | 'clock'
  | 'cheering'

const KODI_STUDY_EMOTION_SET: ReadonlySet<string> = new Set<KodiStudyEmotion>([
  'curious',
  'reading',
  'idea',
  'polite',
  'explaining',
  'listening',
  'writing',
  'chatting',
  'clock',
  'cheering',
])

export const isKodiStudyEmotion = (emotion: string): emotion is KodiStudyEmotion =>
  KODI_STUDY_EMOTION_SET.has(emotion)

export const MASCOT_TOKENS = {
  name: 'Mera',
  species: 'Language Companion',
  title: 'Mera — Merantalk Companion',
  emotions: {
    welcome: { label: 'Greeting / Hello', aura: 'rgba(59, 130, 246, 0.25)' },
    celebrate: { label: 'Yatta / Milestone Success', aura: 'rgba(16, 185, 129, 0.3)' },
    coding: { label: 'Deep Focus / Quest Active', aura: 'rgba(37, 99, 235, 0.25)' },
    studying: { label: 'Language Study / Notebook', aura: 'rgba(16, 185, 129, 0.25)' },
    curious: { label: 'Curious / Did You Know', aura: 'rgba(245, 158, 11, 0.25)' },
    reading: { label: 'Reading / Ocha Time', aura: 'rgba(59, 130, 246, 0.25)' },
    idea: { label: 'Aha Idea / Lightbulb', aura: 'rgba(250, 204, 21, 0.30)' },
    polite: { label: 'Polite Keigo / Ojigi', aura: 'rgba(168, 85, 247, 0.25)' },
    explaining: { label: 'Sensei Explaining Pattern', aura: 'rgba(14, 165, 233, 0.25)' },
    listening: { label: 'Audio Listening / Headphones', aura: 'rgba(244, 63, 94, 0.25)' },
    writing: { label: 'Calligraphy / Washi Notes', aura: 'rgba(16, 185, 129, 0.25)' },
    chatting: { label: 'Conversation / Greeting', aura: 'rgba(56, 189, 248, 0.25)' },
    clock: { label: 'Tense & Time Mastery', aura: 'rgba(251, 113, 133, 0.25)' },
    cheering: { label: 'Uchiwa Fan Cheer', aura: 'rgba(245, 158, 11, 0.25)' },
    proud: { label: 'Boarding Pass / Offer Unlocked', aura: 'rgba(245, 158, 11, 0.3)' },
    warning: { label: 'Streak Alert / Daily Reminder', aura: 'rgba(251, 146, 60, 0.3)' },
  },
  sizes: {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
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
  radius: '1.25rem',
  shadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
  containerClass: 'mb-2 z-30 animate-bounce-subtle pointer-events-none',
  bubbleClass:
    'relative bg-white border-2 border-slate-200/90 text-slate-800 px-3 py-1.5 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.08)] text-[11px] font-brand font-black tracking-tight max-w-[200px] text-center',
  tailClass:
    'absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-slate-200/90 rotate-45',
} as const
