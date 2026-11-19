export interface Language {
  id: string
  code: string
  name: string
  supported_scripts: string[]
  is_active: boolean
  created_at: string
}

export interface ProficiencyLevel {
  id: string
  language_id: string
  code: string
  name: string
  tier: 'beginner' | 'intermediate' | 'advanced' | string
  official_exam_name: string
  passing_score_percent: number
  order_index: number
  created_at: string
}

export interface UserLanguageEnrollment {
  id: string
  user_id: string
  language_id: string
  current_level_id?: string | null
  initial_placement_type: 'zero_beginner' | 'placement_test' | 'manual_select' | string
  placement_score_percent?: number | null
  is_active: boolean
  enrolled_at: string
  language?: Language | null
  current_level?: ProficiencyLevel | null
}

export type GrammarPointCategory =
  | 'tense'
  | 'conjugation'
  | 'particle'
  | 'honorific'
  | 'sentence_pattern'
  | string

export interface GrammarExample {
  jp: string
  reading: string
  id: string
}

export interface GrammarPoint {
  id: string
  level_id: string
  level_code?: string
  code: string
  category: GrammarPointCategory
  title: string
  formula: string
  explanation: string
  examples?: GrammarExample[]
  order_index: number
  created_at: string
}

export type UnitType = 'curriculum' | 'diagnostic_exam' | string

export interface LessonNodeResponse {
  id: string
  slug?: string
  unit_id: string
  title: string
  xp_reward: number
  order_index: number
  is_unlocked: boolean
  is_completed: boolean
  score: number
  is_skipped: boolean
  completed_at?: string | null
}

export interface UnitNodeResponse {
  id: string
  level_id: string
  title: string
  description?: string | null
  unit_type: UnitType
  order_index: number
  total_lessons: number
  completed_lessons: number
  is_unlocked: boolean
  lessons?: LessonNodeResponse[]
  created_at: string
}

export interface CurriculumResponse {
  language: Language
  level: ProficiencyLevel
  total_lessons: number
  completed_lessons: number
  progress_percent: number
  current_lesson_id?: string | null
  units: UnitNodeResponse[]
}

export interface CurriculumExercise {
  id: string
  lesson_id?: string | null
  grammar_point_id?: string | null
  skill_pillar: string
  exercise_type: string
  prompt: string
  content?: Record<string, unknown>
  options?: string[]
  hint?: string | null
  media_url?: string | null
  xp_reward: number
  order_index: number
  created_at: string
}

export interface LessonDetailResponse {
  id: string
  slug?: string
  unit_id: string
  title: string
  xp_reward: number
  order_index: number
  is_unlocked: boolean
  is_completed: boolean
  score: number
  is_skipped: boolean
  completed_at?: string | null
  grammar_points: GrammarPoint[]
  exercises: CurriculumExercise[]
  created_at: string
}

export interface CompleteLessonRequest {
  lesson_id?: string
  score: number
}

export interface UserLessonProgress {
  id: string
  user_id: string
  lesson_id: string
  is_completed: boolean
  score: number
  is_skipped: boolean
  completed_at: string
}

export interface CurriculumGamificationSummary {
  xp: number
  current_level: number
  streak: number
  gems?: number | null
  last_active_at?: string | null
}

export interface CurriculumBadgeDefinition {
  id: string
  title: string
  description: string
  icon: string
  category: string
  xp_reward: number
  xp_bonus?: number
  created_at: string
}

export interface CompleteLessonResponse {
  progress: UserLessonProgress
  gamification: CurriculumGamificationSummary
  unlocked_next_lesson_id?: string | null
  unlocked_next_lesson_slug?: string | null
  awarded_badges?: CurriculumBadgeDefinition[]
  session_score?: number
  session_xp_earned?: number
}

// ============================================================================
// UI View Models (Map View & Language Switcher)
// ============================================================================

export type CurriculumNodeStatus = 'completed' | 'active' | 'locked'

export interface CareerTrackOption {
  id: string
  slug: string
  languageCode?: string
  title: string
  shortTitle: string
  subtitle: string
  category: 'language'
  badgeLabel: string
  badgeVariant: 'active' | 'available' | 'featured'
  isActive: boolean
  isEnrolled?: boolean
  group?: 'foundation' | 'career'
}

export type MapNodeCategory = 'language' | 'boss'

export interface CurriculumPartNode {
  id: string
  number: number
  title: string
  subtitle: string
  status: CurriculumNodeStatus
  route: string
  xpReward: number
  gemsReward?: number
  score?: number
  isSkipped?: boolean
  category?: MapNodeCategory
  badgeLabel?: string
  isBoss?: boolean
}

export interface CurriculumUnitData {
  id: string
  unitNumber: number
  title: string
  description: string
  bannerGradient: string
  bannerBorder: string
  parts: CurriculumPartNode[]
  bossQuest?: CurriculumPartNode
}

export interface PathMapNode {
  id: string
  title: string
  subtitle: string
  number?: number
  xpReward: number
  gemsReward?: number
  score?: number
  isSkipped?: boolean
  status: CurriculumNodeStatus
  route: string
  category?: MapNodeCategory
  badgeLabel?: string
  isChest?: boolean
  isTrophy?: boolean
}

