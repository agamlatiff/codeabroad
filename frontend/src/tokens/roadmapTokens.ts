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
 * 3. Part Item Status & Category Tokens (completed | active | locked + code | nihongo | capstone)
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
  capstone: {
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

