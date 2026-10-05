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

export interface OnboardingPayload {
  country_id: string
  career_path_id: string
  primary_stack: string
  level: 'beginner' | 'intermediate'
  target_timeline: TargetTimeline
  language_level: LanguageLevel
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
  country: CountrySummary
  career_path: CareerPathSummary
  created_at: string
}
