/**
 * [DOMAIN: CURRICULUM SERPENTINE & UNIT NODES]
 * Single Source of Truth for Curriculum Map & Syllabus Accordion visual tokens.
 */

import type {
  UnitTheme,
  TrackIconType,
  SequentialCurriculumUnit,
  SequentialPartItem,
  MapNodeCategory,
  CurriculumNodeStatus,
} from "@/features/curriculum/types/curriculum"

/**
 * 1. Visual 3D Banner Palettes per Unit Number
 */
export const DEFAULT_UNIT_THEMES: Record<number, UnitTheme> = {
  1: {
    gradientBg: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700',
    border3D: 'border-b-[5px] border-blue-900',
    tagBg: 'bg-blue-500/30 border border-blue-300/30 text-white',
    tagText: 'text-white',
    accentGlow: 'ring-blue-500/15',
    btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
  },
  2: {
    gradientBg: 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800',
    border3D: 'border-b-[5px] border-indigo-950',
    tagBg: 'bg-indigo-500/30 border border-indigo-300/30 text-white',
    tagText: 'text-white',
    accentGlow: 'ring-indigo-500/15',
    btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
  },
  3: {
    gradientBg: 'bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800',
    border3D: 'border-b-[5px] border-teal-950',
    tagBg: 'bg-teal-500/30 border border-teal-300/30 text-white',
    tagText: 'text-white',
    accentGlow: 'ring-teal-500/15',
    btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
  },
  4: {
    gradientBg: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700',
    border3D: 'border-b-[5px] border-amber-900',
    tagBg: 'bg-amber-500/30 border border-amber-300/30 text-white',
    tagText: 'text-white',
    accentGlow: 'ring-amber-500/15',
    btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
  },
  5: {
    gradientBg: 'bg-gradient-to-r from-purple-600 via-violet-700 to-indigo-800',
    border3D: 'border-b-[5px] border-purple-950',
    tagBg: 'bg-purple-500/30 border border-purple-300/30 text-white',
    tagText: 'text-white',
    accentGlow: 'ring-purple-500/15',
    btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
  },
}

/**
 * 2. Unit Card Status Tokens (completed | active | locked)
 */
export interface UnitCardStyleTokens {
  status: CurriculumNodeStatus
  containerRing: string
  bannerHeader: string
  unitTag: string
  titleText: string
  descriptionText: string
  collapseButton: string
  progressTrack: string
  progressFill: string
  progressLabel: string
}

export const resolveUnitCardTokens = (unit: SequentialCurriculumUnit): UnitCardStyleTokens => {
  const theme = unit.theme || DEFAULT_UNIT_THEMES[1]

  if (unit.isCompleted) {
    return {
      status: 'completed',
      containerRing: 'border-emerald-300 ring-4 ring-emerald-500/10',
      bannerHeader:
        'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white border-b-[5px] border-emerald-900',
      unitTag: 'bg-emerald-500/30 border border-emerald-300/30 text-white',
      titleText: 'text-white',
      descriptionText: 'text-white/80',
      collapseButton: 'bg-white/15 hover:bg-white/25 text-white border border-white/25 active:scale-95',
      progressTrack: 'bg-black/25 border-white/20',
      progressFill: 'bg-emerald-300',
      progressLabel: 'text-white',
    }
  }

  if (unit.isActive) {
    return {
      status: 'active',
      containerRing: 'border-blue-500 ring-4 ring-blue-500/15',
      bannerHeader: `${theme.gradientBg} text-white ${theme.border3D}`,
      unitTag: theme.tagBg,
      titleText: 'text-white',
      descriptionText: 'text-white/80',
      collapseButton: 'bg-white/15 hover:bg-white/25 text-white border border-white/25 active:scale-95',
      progressTrack: 'bg-black/25 border-white/20',
      progressFill: 'bg-white',
      progressLabel: 'text-white',
    }
  }

  return {
    status: 'locked',
    containerRing: 'border-slate-200/90',
    bannerHeader: 'bg-slate-100 text-slate-800 border-b-[4px] border-slate-300',
    unitTag: 'bg-slate-200 border border-slate-300 text-slate-700',
    titleText: 'text-slate-900',
    descriptionText: 'text-slate-600',
    collapseButton: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 active:scale-95',
    progressTrack: 'bg-slate-200 border-slate-300',
    progressFill: 'bg-slate-400',
    progressLabel: 'text-slate-600',
  }
}

/**
 * 3. Lesson Item Status & Category Tokens (completed | active | locked)
 */
export const PART_STATUS_TOKENS: Record<
  CurriculumNodeStatus,
  {
    card: string
    cube: string
    title: string
  }
> = {
  completed: {
    card: 'bg-white border-2 border-slate-200/90 border-b-[4px] border-b-slate-300 hover:border-b-[5px] hover:-translate-y-0.5',
    cube: 'bg-emerald-500 border-2 border-emerald-300 text-white shadow-[0_3px_0_0_#047857] sm:shadow-[0_3.5px_0_0_#047857]',
    title: 'text-slate-900',
  },
  active: {
    card: 'bg-blue-50/50 border-2 border-blue-500 border-b-[5px] border-b-blue-600 ring-4 ring-blue-500/10 shadow-sm hover:border-b-[6px] hover:-translate-y-0.5',
    cube: 'bg-blue-600 border-2 border-blue-400 text-white shadow-[0_3px_0_0_#1D4ED8] sm:shadow-[0_3.5px_0_0_#1D4ED8] animate-pulse',
    title: 'text-blue-950 font-black',
  },
  locked: {
    card: 'bg-slate-50/70 border-2 border-slate-200/70 border-b-[3px] border-b-slate-200 opacity-60',
    cube: 'bg-slate-100 border-2 border-slate-200 text-slate-400',
    title: 'text-slate-900',
  },
}

export const PART_CATEGORY_TOKENS: Record<
  SequentialPartItem['category'],
  {
    chip: string
    lockedCardAccent: string
  }
> = {
  code: {
    chip: 'bg-slate-100 text-slate-700 border border-slate-200',
    lockedCardAccent: '',
  },
  language: {
    chip: 'bg-blue-100 text-blue-700 border border-blue-200',
    lockedCardAccent: 'bg-slate-50/80 border-slate-200/70',
  },
  boss: {
    chip: 'bg-amber-100 text-amber-800 border border-amber-300',
    lockedCardAccent: 'bg-amber-50/30 border-amber-200/60',
  },
}

export interface PartItemStyleTokens {
  status: CurriculumNodeStatus
  card: string
  cube: string
  chip: string
  title: string
}

export const resolvePartTokens = (part: SequentialPartItem): PartItemStyleTokens => {
  const status: CurriculumNodeStatus = part.is_completed
    ? 'completed'
    : part.is_unlocked || part.isNextActive
      ? 'active'
      : 'locked'

  const statusToken = PART_STATUS_TOKENS[status]
  const categoryToken = PART_CATEGORY_TOKENS[part.category] || PART_CATEGORY_TOKENS.language

  return {
    status,
    card: `${statusToken.card} ${status === 'locked' ? categoryToken.lockedCardAccent : ''}`.trim(),
    cube: statusToken.cube,
    chip: categoryToken.chip,
    title: statusToken.title,
  }
}

/**
 * 4. Resolves a visual 3D unit theme based on unit number.
 */
export const resolveUnitTheme = (unitNumber: number): UnitTheme => {
  const index = ((unitNumber - 1) % 5) + 1
  return DEFAULT_UNIT_THEMES[index] || DEFAULT_UNIT_THEMES[1]
}

/**
 * 5. Maps a language code or track slug to its UI icon identifier.
 */
export const resolveTrackIconType = (slugOrCode: string): TrackIconType => {
  const normalized = slugOrCode.toLowerCase()
  if (normalized === 'ja' || normalized.includes('nihongo') || normalized.includes('japan')) {
    return 'nihongo'
  }
  if (normalized === 'en' || normalized.includes('english')) {
    return 'english'
  }
  if (normalized === 'ko' || normalized.includes('korean')) {
    return 'korean'
  }
  if (normalized === 'de' || normalized.includes('german')) {
    return 'german'
  }
  if (normalized === 'zh' || normalized.includes('mandarin') || normalized.includes('chinese')) {
    return 'mandarin'
  }
  if (normalized.includes('go')) return 'golang'
  if (
    normalized.includes('react') ||
    normalized.includes('front') ||
    normalized.includes('vue') ||
    normalized.includes('web')
  ) {
    return 'frontend'
  }
  if (normalized.includes('devops') || normalized.includes('aws') || normalized.includes('cloud')) {
    return 'devops'
  }
  return 'fundamental'
}

/**
 * 6. Map View Duolingo 3D Serpentine Path Palettes & Geometry Tokens
 */
export interface MapUnitPalette {
  gradient: string
  border: string
  glow: string
}

export const MAP_UNIT_PALETTES: MapUnitPalette[] = [
  {
    gradient: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700',
    border: 'border-emerald-500/40',
    glow: 'bg-emerald-400',
  },
  {
    gradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700',
    border: 'border-blue-500/40',
    glow: 'bg-blue-400',
  },
  {
    gradient: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800',
    border: 'border-purple-500/40',
    glow: 'bg-indigo-400',
  },
  {
    gradient: 'bg-gradient-to-r from-slate-700 via-slate-800 to-indigo-900',
    border: 'border-slate-500/40',
    glow: 'bg-slate-400',
  },
]

export const resolveMapUnitPalette = (index: number): MapUnitPalette =>
  MAP_UNIT_PALETTES[index % MAP_UNIT_PALETTES.length]

export const MAP_GEOMETRY = {
  xSequence: [135, 200, 265, 200] as const,
  verticalSpacing: 175,
  startY: 135,
  viewboxWidth: 400,
  bottomPadding: 70,
  nodeDiscRadius: 36,
} as const

export const MAP_MILESTONE_REWARDS = {
  defaultLessonXp: 15,
  trophyXp: 100,
} as const

/**
 * 7. Map Node Category & Status Visual Tokens
 */
export interface MapCategoryStyleTokens {
  popoverBorder: string
  popoverLabelColor: string
  badgeClass: string
  activeButtonVariant: 'rose' | 'blue'
  activeButtonText: string
  discCompleted: string
  discActive: string
  modalIconBgActive: string
  modalIconBgCompleted: string
  modalIconBgLocked: string
}

export const MAP_CATEGORY_TOKENS: Record<MapNodeCategory, MapCategoryStyleTokens> = {
  language: {
    popoverBorder: 'border-blue-400',
    popoverLabelColor: 'text-blue-600',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    activeButtonVariant: 'blue',
    activeButtonText: 'MULAI SESI BELAJAR',
    discCompleted: 'bg-emerald-500 shadow-[0_5px_0_0_#047857]',
    discActive: 'bg-blue-600 shadow-[0_6px_0_0_#1D4ED8] ring-8 ring-blue-100',
    modalIconBgActive: 'bg-blue-600 border-blue-700 text-white shadow-[0_3px_0_0_#1D4ED8]',
    modalIconBgCompleted: 'bg-emerald-100 border-emerald-300 text-emerald-700',
    modalIconBgLocked: 'bg-slate-100 border-slate-300 text-slate-500',
  },
  code: {
    popoverBorder: 'border-blue-400',
    popoverLabelColor: 'text-blue-600',
    badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
    activeButtonVariant: 'blue',
    activeButtonText: 'MULAI SESI BELAJAR',
    discCompleted: 'bg-emerald-500 shadow-[0_5px_0_0_#047857]',
    discActive: 'bg-blue-600 shadow-[0_6px_0_0_#1D4ED8] ring-8 ring-blue-100',
    modalIconBgActive: 'bg-blue-100 border-blue-300 text-blue-700',
    modalIconBgCompleted: 'bg-emerald-100 border-emerald-300 text-emerald-700',
    modalIconBgLocked: 'bg-slate-100 border-slate-300 text-slate-500',
  },
}

export const resolveMapNodeCategory = (category?: string): MapNodeCategory =>
  category === 'code' ? 'code' : 'language'

export const resolveMapCategoryTokens = (category?: string): MapCategoryStyleTokens =>
  MAP_CATEGORY_TOKENS[resolveMapNodeCategory(category)]

/**
 * 8. Modal Node Detail Visual & Copy Tokens
 */
export const MAP_MODAL_TOKENS = {
  iconContainerBase:
    'w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs',
  milestones: {
    chest:
      'w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs',
    trophy:
      'w-12 h-12 rounded-2xl bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center text-yellow-700 shadow-2xs',
  },
  statusBadge: {
    completed: 'Selesai',
    active: 'Siap Dipelajari',
    locked: 'Sesi Terkunci',
  },
  lockedDescription:
    'Sesi ini masih terkunci. Selesaikan seluruh lesson sebelumnya secara berurutan atau aktifkan bahasa ini terlebih dahulu.',
} as const

/**
 * 9. Map Track Geometry & SVG Stroke Palettes
 */
export const MAP_STAGE_TOKENS = {
  canvasContainer:
    'max-w-2xl mx-auto w-full bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-7 relative overflow-visible space-y-12 sm:space-y-16 bg-[radial-gradient(#E2E8F0_1.2px,transparent_1.2px)] [background-size:24px_24px]',
} as const

export const MAP_TRACK_TOKENS = {
  glow: {
    stroke: '#93C5FD',
    strokeWidth: 20,
    opacity: 0.35,
  },
  base: {
    stroke: '#E2E8F0',
    strokeWidth: 12,
  },
  dash: {
    strokeWidth: 4,
    dashArray: '10 12',
    completed: {
      stroke: '#10B981',
      opacity: 0.75,
    },
    active: {
      stroke: '#2563EB',
      opacity: 0.75,
    },
    locked: {
      stroke: '#94A3B8',
      opacity: 0.4,
    },
  },
} as const

/**
 * 10. Map Biome Ambient Spotlight Aura
 */
export const MAP_BIOME_AURA_TOKENS = {
  completed: 'bg-emerald-400',
  active: 'bg-blue-400',
  locked: 'bg-indigo-400',
} as const

/**
 * 11. Map Milestone 3D Stepping Stone Nodes
 */
export const MAP_MILESTONE_DISC_TOKENS = {
  chest: {
    completed:
      'bg-gradient-to-b from-amber-300 to-amber-500 border-amber-600 shadow-[0_5px_0_0_#92400E]',
    active:
      'bg-gradient-to-b from-amber-400 to-orange-500 border-amber-600 ring-4 ring-amber-200 shadow-[0_5px_0_0_#B45309] animate-pulse',
    locked: 'bg-slate-100 border-slate-300 shadow-[0_4px_0_0_#CBD5E1]',
  },
  trophy: {
    completed:
      'bg-gradient-to-b from-yellow-300 to-amber-500 border-yellow-600 shadow-[0_5px_0_0_#A16207]',
    locked: 'bg-slate-100 border-slate-300 shadow-[0_4px_0_0_#CBD5E1]',
  },
  lockedLesson:
    'bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 shadow-[0_4px_0_0_#CBD5E1]',
} as const

export const MAP_MILESTONE_PILL_TOKENS = {
  chest: 'bg-amber-50 border border-amber-200/90 text-amber-800',
  trophy: 'bg-yellow-50 border border-yellow-200/90 text-yellow-800',
} as const

/**
 * 12. View Toggle Segmented Control 3D Tokens
 */
export const VIEW_TOGGLE_TOKENS = {
  container:
    'bg-slate-200/90 p-1 rounded-2xl border-2 border-slate-300 flex items-center gap-1 shadow-2xs',
  buttonActive:
    'bg-white text-blue-700 font-brand font-black border-2 border-blue-400 shadow-[0_2.5px_0_0_#93C5FD] translate-y-0',
  buttonInactive:
    'text-slate-600 hover:text-slate-900 font-brand font-bold border-2 border-transparent hover:bg-white/50',
  badgeActive: 'bg-blue-100 text-blue-800 font-black',
  badgeInactive: 'bg-slate-300/70 text-slate-700 font-bold',
} as const

/**
 * 13. Accordion View Actions & Completion Banner Tokens
 */
export const ACCORDION_ACTION_TOKENS = {
  completionBanner:
    'p-3.5 sm:p-4 bg-emerald-50/80 border-t-2 border-emerald-100 flex items-center justify-between gap-3',
  trophyIconBox:
    'w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs',
  verifiedBadge:
    'bg-emerald-600 text-white font-brand font-black text-[10px] px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1',
  xpChip:
    'bg-amber-50 text-amber-900 border border-amber-300 font-brand font-black text-[11px] sm:text-xs px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1',
  completedPill:
    'px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 font-brand font-black text-xs flex items-center gap-1.5 shadow-[0_2px_0_0_#A7F3D0]',
  lockedButton:
    'min-h-[44px] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 border-2 border-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer',
} as const
