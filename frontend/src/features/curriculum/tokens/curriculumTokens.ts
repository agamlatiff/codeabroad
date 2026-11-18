/**
 * [DOMAIN: CURRICULUM SERPENTINE & UNIT NODES]
 * Single Source of Truth for Peta Belajar Map visual tokens.
 */

import type {
  MapNodeCategory,
} from "@/features/curriculum/types/curriculum"

/**
 * 1. Map View Duolingo 3D Serpentine Path Palettes & Geometry Tokens
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
  activeButtonVariant: 'rose' | 'blue' | 'amber'
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
  boss: {
    popoverBorder: 'border-amber-400',
    popoverLabelColor: 'text-amber-700',
    badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200',
    activeButtonVariant: 'amber',
    activeButtonText: 'MULAI EVALUASI',
    discCompleted: 'bg-emerald-500 shadow-[0_5px_0_0_#047857]',
    discActive: 'bg-amber-500 shadow-[0_6px_0_0_#B45309] ring-8 ring-amber-100',
    modalIconBgActive: 'bg-amber-500 border-amber-600 text-white shadow-[0_3px_0_0_#B45309]',
    modalIconBgCompleted: 'bg-emerald-100 border-emerald-300 text-emerald-700',
    modalIconBgLocked: 'bg-slate-100 border-slate-300 text-slate-500',
  },
}

export const resolveMapNodeCategory = (category?: string): MapNodeCategory =>
  category === 'boss' ? 'boss' : 'language'

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
