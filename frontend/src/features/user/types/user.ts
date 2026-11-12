import type { CountrySummary, CareerPathSummary } from "@/features/onboarding/types/onboarding"

/**
 * 3-PILLAR NORMALIZED USER DOMAIN TYPES
 * Directly mirrors backend `backend/internal/domain/user.go`.
 */

// Pillar 1: Auth Core (users table)
export interface UserAccount {
  id: string
  email: string
  created_at: string
  updated_at?: string
}

// Pillar 2: Profile & Career Goals (user_profiles table)
export interface UserProfile {
  name: string
  username: string
  bio?: string | null
  career_path_id?: string | null
  country_id?: string | null
  tech_stack_id?: string | null
  primary_stack?: string | null
  is_onboarded: boolean
  has_seen_roadmap_tour?: boolean
  preferred_roadmap_view?: 'map' | 'syllabus' | null
  country?: CountrySummary | null
  career_path?: CareerPathSummary | null

  // Frontend UI / Onboarding compatibility helpers
  avatar_url?: string | null
  level?: string | null
  target_timeline?: string | null
  language_level?: string | null
}

// Pillar 3: High-Concurrency Game Loop Stats (user_gamification table)
export interface UserGamificationStats {
  xp: number
  current_level: number
  streak: number
  gems?: number | null
  last_active_at?: string | null
}

// Unified 3-Pillar Aggregate for API responses and client store
export interface User extends UserAccount, UserProfile, UserGamificationStats {}

// --- DTO: Update Profile Payload (matches domain.UpdateProfileRequest) ---
export interface UpdateProfilePayload {
  name?: string
  bio?: string
  country_id?: string
  career_path_id?: string
  tech_stack_id?: string
  primary_stack?: string
  has_seen_roadmap_tour?: boolean
  preferred_roadmap_view?: 'map' | 'syllabus'
}

// --- DTO: 7-Day Activity & Consistency Tracking ---
export interface DailyActivityStat {
  xp_earned: number
  quests_count: number
}

export interface UserActivityLogItem {
  date: string
  day_index: number
  day_label: string
  is_active: boolean
  is_today: boolean
  xp_earned: number
  quests_count: number
}

export interface UserActivitySummaryResponse {
  current_streak: number
  total_active_days: number
  last_active_at?: string | null
  weekly_logs: UserActivityLogItem[]
  active_dates?: string[]
}

// --- DTO: Daily Rewards Habit Milestones ---
export interface DailyRewardClaimRequest {
  reward_type: 'vocab_quest' | 'golden_chest'
}

export interface DailyRewardClaimResponse {
  reward_type: string
  xp_awarded: number
  current_xp: number
  current_level: number
  streak: number
  claimed_at: string
}

export interface DailyRewardsStatusResponse {
  date: string
  vocab_quest_claimed: boolean
  golden_chest_claimed: boolean
}
