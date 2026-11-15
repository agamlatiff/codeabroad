export interface VisaInfo {
  type: string
  difficulty: string
  language_req: string
  key_benefit: string
  processing_time?: string
}

export interface SalaryRange {
  currency: string
  junior: string
  mid: string
  senior: string
  idr_approx: string
}

export interface Country {
  id: string
  code: string
  name: string
  flag_emoji: string
  is_active: boolean
  badge?: string
  visa_info?: VisaInfo
  salary_range?: SalaryRange
  work_culture?: string
}

export interface TechStack {
  slug: string
  label: string
  is_active: boolean
  badge: string
}

export interface CareerPath {
  id: string
  slug: string
  label: string
  description?: string
  stacks: TechStack[]
}

export type TargetTimeline = '6_months' | '1_year' | 'exploring'
export type LanguageLevel = 'none' | 'basic' | 'conversational' | 'fluent'

export interface OnboardingLanguage {
  id: string
  code: string
  name: string
  supported_scripts?: string[]
  is_active: boolean
}

export interface PlacementQuestionOption {
  id?: string
  text?: string
  label?: string
}

export interface PlacementQuestionItem {
  id: string
  skill_pillar: 'reading' | 'listening' | 'writing' | 'speaking'
  exercise_type: 'sentence_builder' | 'fill_blank' | 'listening_choice' | 'speaking_repeat' | 'dialogue_roleplay'
  prompt: string
  content?: {
    question?: string
    sentence?: string
    audio_url?: string
    options?: Array<string | PlacementQuestionOption>
    tokens?: string[]
    furigana?: string
    hints?: string
  }
}

export interface PlacementQuestionsResponse {
  language: OnboardingLanguage
  questions: PlacementQuestionItem[]
}

export interface OnboardingPlacementAnswer {
  exercise_id: string
  user_answer: string
}

export interface OnboardingV3Payload {
  language_id: string
  daily_goal_minutes: 5 | 15 | 30 | 45
  initial_placement_type: 'zero_beginner' | 'placement_test' | 'manual_select'
  manual_level_id?: string
  placement_answers?: OnboardingPlacementAnswer[]
}

export interface OnboardingV3ResultResponse {
  user: {
    id: string
    email: string
    created_at: string
  }
  profile: {
    name: string
    username: string
    bio?: string | null
    daily_goal_minutes: number
    is_onboarded: boolean
    has_seen_roadmap_tour?: boolean
    preferred_roadmap_view?: 'map' | 'syllabus'
  }
  enrollment: {
    id: string
    language_id: string
    current_level_id?: string | null
    initial_placement_type: string
    placement_score_percent?: number | null
  }
  assigned_level: {
    id: string
    code: string
    name: string
    tier: string
  }
  placement_score_percent?: number | null
  gamification_stats: {
    xp: number
    current_level: number
    streak: number
    gems?: number
    last_active_at?: string | null
  }
}

export interface OnboardingPayload {
  language_id: string
  daily_goal_minutes: 5 | 15 | 30 | 45
  initial_placement_type: 'zero_beginner' | 'placement_test' | 'manual_select'
  manual_level_id?: string
  placement_answers?: OnboardingPlacementAnswer[]
  country_id?: string
  career_path_id?: string
  primary_stack?: string
  level?: 'beginner' | 'intermediate'
  target_timeline?: TargetTimeline
  language_level?: LanguageLevel
}

export interface CountrySummary {
  id: string
  code: string
  name: string
  flag_emoji: string
}

export interface CareerPathSummary {
  id: string
  slug: string
  label: string
}

export interface OnboardingProfileResponse {
  id: string
  name: string
  username: string
  email: string
  level: string
  xp: number
  current_level: number
  streak: number
  is_onboarded: boolean
  primary_stack: string
  target_timeline?: TargetTimeline
  language_level?: LanguageLevel
  daily_goal_minutes?: number
  initial_placement_type?: 'zero_beginner' | 'placement_test' | 'manual_select'
  placement_score_percent?: number | null
  assigned_level_code?: string
  assigned_level_name?: string
  language_code?: string
  language_name?: string
  country: CountrySummary
  career_path: CareerPathSummary
  created_at: string
}

export interface IllustrationProps {
  className?: string
}
