/**
 * ONBOARDING v3.0 LANGUAGE MASTERY DOMAIN TYPES
 * Mirrors backend `backend/internal/app/onboarding/domain.go`.
 */

export interface IllustrationProps {
  className?: string
  compact?: boolean
}

export interface OnboardingLanguage {
  id: string
  code: string
  name: string
  native_name: string
  flag_emoji: string
  is_active: boolean
}

export interface PlacementQuestionOption {
  id?: string
  label?: string
  text?: string
}

export interface PlacementQuestionItem {
  id: string
  exercise_type: string
  skill_pillar: string
  prompt: string
  media_url?: string | null
  content?: {
    options?: Array<string | PlacementQuestionOption>
    tokens?: string[]
    question?: string
    sentence?: string
    audio_text?: string
    display_text?: string
    target_translation?: string
  }
}

export interface PlacementQuestionsResponse {
  language_id: string
  total_questions: number
  questions: PlacementQuestionItem[]
}

export interface PlacementAnswerItem {
  exercise_id: string
  user_answer: string
}

export interface OnboardingV3Payload {
  language_id: string
  daily_goal_minutes: 5 | 15 | 30 | 45
  initial_placement_type: 'zero_beginner' | 'placement_test'
  placement_answers?: PlacementAnswerItem[]
}

export type OnboardingPayload = OnboardingV3Payload

/** Mirrors backend onboarding.OnboardingResultResponse (nested shape). */
export interface OnboardingV3ResultResponse {
  user: { id: string; email: string }
  profile: {
    daily_goal_minutes: number
    is_onboarded: boolean
  }
  enrollment: {
    id: string
    language_id: string
    initial_placement_type: 'zero_beginner' | 'placement_test'
    placement_score_percent?: number | null
    language?: { id: string; code: string; name: string } | null
  }
  assigned_level: { id: string; code: string; name: string }
  placement_score_percent?: number
  gamification_stats: { xp: number; streak: number }
}

export interface OnboardingProfileResponse {
  id: string
  user_id: string
  is_onboarded: boolean
  xp: number
  streak: number
  daily_goal_minutes?: number
  initial_placement_type?: 'zero_beginner' | 'placement_test'
  placement_score_percent?: number
  assigned_level_code?: string
  assigned_level_name?: string
  language_code?: string
  language_name?: string
}
