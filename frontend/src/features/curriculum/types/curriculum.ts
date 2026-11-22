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

export type GrammarRole =
  | 'topic'
  | 'subject'
  | 'object'
  | 'particle'
  | 'verb'
  | 'adjective'
  | 'noun'
  | 'predicate'
  | 'time'
  | 'place'
  | 'connector'
  | 'ending'
  | string

export interface GrammarFormulaPart {
  text: string
  label: string
  role: GrammarRole
}

export interface GrammarBreakdownToken {
  jp: string
  reading: string
  meaning: string
  role: GrammarRole
}

export interface GrammarExampleBreakdown {
  tokens: GrammarBreakdownToken[]
  translation: string
}

export interface GrammarFormVariation {
  label: string
  jp: string
  reading: string
  id: string
}

export interface GrammarCommonMistake {
  wrong: string
  right: string
  why: string
}

export interface GrammarMiniQuizItem {
  question: string
  options: string[]
  answer: number
  why: string
}

export interface GrammarLearningGuide {
  analogy: string
  when_to_use: string[]
  formula_parts: GrammarFormulaPart[]
  steps: string[]
  breakdowns: GrammarExampleBreakdown[]
  forms: GrammarFormVariation[]
  mistakes: GrammarCommonMistake[]
  quiz: GrammarMiniQuizItem[]
}

export interface UserGrammarProgress {
  id: string
  user_id: string
  grammar_point_id: string
  quiz_score: number
  correct_count: number
  total_questions: number
  attempts_count: number
  is_understood: boolean
  understood_at?: string | null
  next_review_at?: string | null
  last_attempted_at: string
}

export interface SubmitGrammarCheckRequest {
  correct_count: number
  total_questions: number
}

export interface SubmitGrammarCheckResponse {
  progress: UserGrammarProgress
  understood_total: number
}

export interface GrammarPoint {
  id: string
  level_id: string
  level_code?: string
  code: string
  category: GrammarPointCategory
  title: string
  formula: string
  /** Romaji reading of the formula (particles は→wa, へ→e, を→o). */
  formula_reading?: string
  explanation: string
  examples?: GrammarExample[]
  learning_guide?: GrammarLearningGuide
  practice_lesson_slug?: string
  practice_lesson_title?: string
  practice_unit_order?: number
  is_understood?: boolean
  quiz_score?: number
  attempts_count?: number
  next_review_at?: string | null
  order_index: number
  created_at: string
}

export type UnitType = 'curriculum' | 'diagnostic_exam' | string

export interface LessonNodeResponse {
  id: string
  slug?: string
  unit_id: string
  title: string
  short_title?: string
  icon_name?: string
  xp_reward: number
  order_index: number
  total_exercises?: number
  completed_exercises?: number
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

export interface LessonStudyItem {
  symbol: string
  reading: string
  meaning: string
  mnemonic: string
  speak_text: string
  first_exercise_index: number
}

export interface LessonDetailResponse {
  id: string
  slug?: string
  unit_id: string
  title: string
  short_title?: string
  icon_name?: string
  xp_reward: number
  order_index: number
  is_unlocked: boolean
  is_completed: boolean
  score: number
  is_skipped: boolean
  completed_at?: string | null
  grammar_points: GrammarPoint[]
  exercises: CurriculumExercise[]
  study_items?: LessonStudyItem[]
  created_at: string
}

export type KanaScriptType = 'hiragana' | 'katakana' | 'kanji'

export interface KanaCharacterItem {
  id: string
  character: string
  script: KanaScriptType
  romaji: string
  row_group: string
  row_order: number
  col_order: number
  mnemonic: string
  example_word: string
  example_reading: string
  example_meaning: string
  practice_count: number
  correct_count: number
  mastery_score: number
  is_mastered: boolean
}

export interface KanaChartResponse {
  script: string
  total: number
  mastered_count: number
  characters: KanaCharacterItem[]
}

export interface KanaPracticeItem {
  character: string
  is_correct: boolean
}

export interface KanaPracticeResponse {
  updated_count: number
  mastered_total: number
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
  xp_earned?: number
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
  shortTitle?: string
  subtitle: string
  iconName?: string
  totalExercises?: number
  completedExercises?: number
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
  shortTitle?: string
  subtitle: string
  number?: number
  iconName?: string
  totalExercises?: number
  completedExercises?: number
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

