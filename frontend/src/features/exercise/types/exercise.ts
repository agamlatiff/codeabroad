import type {
  CompleteLessonResponse,
  CurriculumBadgeDefinition,
  CurriculumExercise,
  LessonDetailResponse,
  ProficiencyLevel,
} from '@/features/curriculum/types/curriculum'

export type ExerciseType =
  | 'sentence_builder'
  | 'fill_blank'
  | 'listening_choice'
  | 'speaking_repeat'
  | 'dialogue_roleplay'
  | string

export type SkillPillar = 'reading' | 'listening' | 'speaking' | 'writing' | string

export interface ExerciseFuriganaItem {
  kanji: string
  kana: string
}

export interface ExerciseChoiceOption {
  id: string
  text: string
}

export interface ParsedExerciseContent {
  tokens: string[]
  targetTranslation?: string
  sentenceTemplate?: string
  passage?: string
  translation?: string
  displayText?: string
  audioText?: string
  audioUrl?: string
  romaji?: string
  phoneticBreakdown: string[]
  furigana: ExerciseFuriganaItem[]
  choiceOptions: ExerciseChoiceOption[]
  hint?: string
}

export interface SubmitExerciseAnswerRequest {
  exercise_id: string
  user_answer: string
  time_spent_seconds: number
}

export interface SubmitExerciseAnswerResponse {
  is_correct: boolean
  correct_answer: string
  explanation?: string | null
  diagnostic_feedback?: string | null
  xp_earned: number
  streak_bonus: number
  next_review_due?: string | null
}

export interface UserSRSReview {
  id: string
  user_id: string
  exercise_id: string
  ease_factor: number
  interval_days: number
  repetition_count: number
  next_review_at: string
  last_reviewed_at?: string | null
  exercise?: CurriculumExercise
}

export interface SRSQueueResponse {
  total_due: number
  items: UserSRSReview[]
}

export interface SubmitSRSReviewRequest {
  exercise_id: string
  quality: number
}

export interface ReadinessExamAnswerItem {
  exercise_id: string
  user_answer: string
}

export interface ReadinessExamSubmissionRequest {
  level_id: string
  answers: ReadinessExamAnswerItem[]
}

export interface ReadinessExamAttempt {
  id: string
  user_id: string
  level_id: string
  reading_score: number
  listening_score: number
  writing_score: number
  speaking_score: number
  overall_score: number
  max_score?: number
  score_percent: number
  is_passed: boolean
  analysis_report?: Record<string, unknown>
  attempted_at: string
  level?: ProficiencyLevel
}

export interface ExamCertificate {
  certificate_id: string
  exam_name: string
  level_code: string
  candidate_name: string
  score: number
  max_score: number
  percentage: number
  issued_at: string
}

export interface ReadinessExamResponse {
  attempt: ReadinessExamAttempt
  certificate?: ExamCertificate
  awarded_badges?: CurriculumBadgeDefinition[]
}

export interface LessonCompletionNavigationState {
  completionResult: CompleteLessonResponse
  lesson: LessonDetailResponse
  totalExercises: number
  correctCount: number
  totalXpEarned: number
  accuracyPercent: number
}

