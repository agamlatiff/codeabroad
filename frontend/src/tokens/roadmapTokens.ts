import type {
  UnitTheme,
  TrackIconType,
  SequentialCurriculumUnit,
  SequentialPartItem,
} from '../types/roadmap'

export type RoadmapNodeStatus = 'completed' | 'active' | 'locked'

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
  status: RoadmapNodeStatus
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
 * 3. Part Item Status & Category Tokens (completed | active | locked + code | nihongo | boss)
 */
export const PART_STATUS_TOKENS: Record<
  RoadmapNodeStatus,
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
  nihongo: {
    chip: 'bg-rose-100 text-rose-700 border border-rose-200',
    lockedCardAccent: 'bg-rose-50/40 border-rose-200/60',
  },
  boss: {
    chip: 'bg-amber-100 text-amber-800 border border-amber-300',
    lockedCardAccent: 'bg-amber-50/30 border-amber-200/60',
  },
}

export interface PartItemStyleTokens {
  status: RoadmapNodeStatus
  card: string
  cube: string
  chip: string
  title: string
}

export const resolvePartTokens = (part: SequentialPartItem): PartItemStyleTokens => {
  const status: RoadmapNodeStatus = part.is_completed
    ? 'completed'
    : part.isNextActive
      ? 'active'
      : 'locked'

  const statusToken = PART_STATUS_TOKENS[status]
  const categoryToken = PART_CATEGORY_TOKENS[part.category] || PART_CATEGORY_TOKENS.code

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
 * 5. Maps a database tech stack slug or career path slug to its UI brand icon identifier.
 */
export const resolveTrackIconType = (slug: string): TrackIconType => {
  const normalized = slug.toLowerCase()
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
  if (normalized.includes('nihongo')) return 'nihongo'
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
} as const

export const MAP_MILESTONE_REWARDS = {
  chestXp: 30,
  trophyXp: 50,
  defaultQuestXp: 50,
  chestGems: 20,
} as const

/**
 * 7. Map Node Category & Status Visual Tokens
 */
export type MapNodeCategory = 'nihongo' | 'integration' | 'devops' | 'code'

export interface MapCategoryStyleTokens {
  popoverBorder: string
  popoverLabelColor: string
  badgeClass: string
  activeButtonVariant: 'rose' | 'cyan' | 'amber' | 'blue'
  activeButtonText: string
  discCompleted: string
  discActive: string
  modalIconBgActive: string
  modalIconBgCompleted: string
}

export const MAP_CATEGORY_TOKENS: Record<MapNodeCategory, MapCategoryStyleTokens> = {
  nihongo: {
    popoverBorder: 'border-rose-400',
    popoverLabelColor: 'text-rose-600',
    badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200',
    activeButtonVariant: 'rose',
    activeButtonText: 'MULAI NIHONGO',
    discCompleted: 'bg-rose-500 shadow-[0_5px_0_0_#9F1239]',
    discActive: 'bg-rose-500 shadow-[0_6px_0_0_#BE123C] ring-8 ring-rose-100',
    modalIconBgActive: 'bg-rose-500 border-rose-600 text-white shadow-[0_3px_0_0_#9F1239]',
    modalIconBgCompleted: 'bg-rose-100 border-rose-300 text-rose-700',
  },
  integration: {
    popoverBorder: 'border-cyan-400',
    popoverLabelColor: 'text-cyan-600',
    badgeClass: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    activeButtonVariant: 'cyan',
    activeButtonText: 'HANDSHAKE FITUR',
    discCompleted: 'bg-cyan-600 shadow-[0_5px_0_0_#0E7490]',
    discActive: 'bg-cyan-600 shadow-[0_6px_0_0_#0E7490] ring-8 ring-cyan-100',
    modalIconBgActive: 'bg-cyan-600 border-cyan-700 text-white shadow-[0_3px_0_0_#0E7490]',
    modalIconBgCompleted: 'bg-cyan-100 border-cyan-300 text-cyan-700',
  },
  devops: {
    popoverBorder: 'border-amber-400',
    popoverLabelColor: 'text-amber-600',
    badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200',
    activeButtonVariant: 'amber',
    activeButtonText: 'LANJUTKAN KODING',
    discCompleted: 'bg-amber-600 shadow-[0_5px_0_0_#B45309]',
    discActive: 'bg-amber-600 shadow-[0_6px_0_0_#B45309] ring-8 ring-amber-100',
    modalIconBgActive: 'bg-amber-600 border-amber-700 text-white shadow-[0_3px_0_0_#B45309]',
    modalIconBgCompleted: 'bg-amber-100 border-amber-300 text-amber-700',
  },
  code: {
    popoverBorder: 'border-blue-400',
    popoverLabelColor: 'text-blue-600',
    badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
    activeButtonVariant: 'blue',
    activeButtonText: 'LANJUTKAN KODING',
    discCompleted: 'bg-emerald-500 shadow-[0_5px_0_0_#047857]',
    discActive: 'bg-blue-600 shadow-[0_6px_0_0_#1D4ED8] ring-8 ring-blue-100',
    modalIconBgActive: 'bg-blue-100 border-blue-300 text-blue-700',
    modalIconBgCompleted: 'bg-emerald-100 border-emerald-300 text-emerald-700',
  },
}

export const resolveMapNodeCategory = (category?: string): MapNodeCategory => {
  if (category === 'nihongo') return 'nihongo'
  if (category === 'integration') return 'integration'
  if (category === 'devops') return 'devops'
  return 'code'
}

export const resolveMapCategoryTokens = (category?: string): MapCategoryStyleTokens =>
  MAP_CATEGORY_TOKENS[resolveMapNodeCategory(category)]



