/**
 * Normalized User Domain Types shared across auth, user, onboarding, curriculum, and layout shells.
 */

export interface UserAccount {
  id: string
  email: string
  created_at: string
  updated_at?: string
}

export interface UserProfile {
  name: string
  username: string
  bio?: string | null
  is_onboarded: boolean
  daily_goal_minutes?: number
  has_seen_roadmap_tour?: boolean
  preferred_roadmap_view?: 'map' | 'syllabus' | null
  avatar_url?: string | null
}

export interface UserGamificationStats {
  xp: number
  current_level: number
  streak: number
  gems?: number | null
  last_active_at?: string | null
}

export interface User extends UserAccount, UserProfile, UserGamificationStats {}

export interface UpdateProfilePayload {
  name?: string
  bio?: string
  daily_goal_minutes?: number
  has_seen_roadmap_tour?: boolean
  preferred_roadmap_view?: 'map' | 'syllabus'
}

export interface DailyActivityStat {
  xp_earned: number
  lessons_count: number
}

export interface UserActivityLogItem {
  date: string
  day_index: number
  day_label: string
  is_active: boolean
  is_today: boolean
  xp_earned: number
  lessons_count: number
}

export interface UserActivitySummaryResponse {
  current_streak: number
  total_active_days: number
  last_active_at?: string | null
  weekly_logs: UserActivityLogItem[]
  active_dates?: string[]
}

export interface DailyRewardClaimRequest {
  reward_type: 'vocab_quest' | 'golden_chest'
}

export interface DailyRewardClaimResponse {
  reward_type: string
  xp_awarded: number
  gems_awarded?: number
  current_xp: number
  current_gems?: number
  current_level: number
  streak: number
  claimed_at: string
}

export interface DailyRewardsStatusResponse {
  date: string
  vocab_quest_claimed: boolean
  golden_chest_claimed: boolean
}
