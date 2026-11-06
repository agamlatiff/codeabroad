import type { QuestSummary } from './quest'

export interface Chapter {
  id: string
  module_id: string
  chapter_number: number
  title: string
  description?: string
  is_unlocked: boolean
  is_completed: boolean
  quests?: QuestSummary[]
  created_at?: string
  updated_at?: string
}

export interface Module {
  id: string
  tech_stack_id: string
  module_number: number
  title: string
  description?: string
  is_unlocked: boolean
  is_completed: boolean
  progress_rate: number
  chapters?: Chapter[]
  created_at?: string
  updated_at?: string
}

export interface Roadmap {
  id: string
  career_path_id?: string
  slug: string
  title: string
  badge?: string
  description?: string
  is_active: boolean
  modules?: Module[]
  created_at?: string
  updated_at?: string
}

export interface UnitTheme {
  gradientBg: string
  border3D: string
  tagBg: string
  tagText: string
  accentGlow: string
  btnGuideBg: string
}

export interface SequentialPartItem {
  id: string
  globalPartNumber: number
  title: string
  subtitle: string
  chipLabel: string
  category: 'code' | 'language' | 'boss'
  difficulty: 'Pemula' | 'Menengah' | 'Sulit'
  estimatedMinutes: number
  xpReward: number
  route: string
  is_unlocked?: boolean
  is_completed?: boolean
  isNextActive?: boolean
}

export interface SequentialCurriculumUnit {
  id: string
  unitNumber: number
  tag: string
  title: string
  description: string
  totalXp: number
  progressRate?: number
  isUnlocked?: boolean
  isCompleted?: boolean
  isActive?: boolean
  progressPercent?: number
  completedCount?: number
  theme?: UnitTheme
  parts: SequentialPartItem[]
}

export type TrackIconType = 'fundamental' | 'golang' | 'frontend' | 'devops' | 'nihongo'

export interface CareerTrackOption {
  id: string
  slug: string
  title: string
  shortTitle: string
  subtitle: string
  category: 'coding' | 'language'
  iconType: TrackIconType
  badgeLabel: string
  badgeVariant: 'active' | 'available' | 'featured'
  isActive: boolean
  group?: 'foundation' | 'career'
}

export type MapNodeCategory = 'code' | 'language'

export interface CurriculumPartNode {
  id: string
  number: number
  title: string
  subtitle: string
  status: 'completed' | 'active' | 'locked'
  route: string
  xpReward: number
  category?: MapNodeCategory
  badgeLabel?: string
}

export interface CurriculumUnitData {
  id: string
  unitNumber: number
  tag: string
  title: string
  description: string
  statusBadge: string
  badgeType: 'completed' | 'active' | 'locked'
  bannerGradient: string
  bannerBorder: string
  parts: CurriculumPartNode[]
}

export interface PathMapNode {
  id: string
  title: string
  subtitle: string
  number?: number
  xpReward: number
  status: 'completed' | 'active' | 'locked'
  route: string
  category?: MapNodeCategory
  badgeLabel?: string
  isChest?: boolean
  isTrophy?: boolean
}

