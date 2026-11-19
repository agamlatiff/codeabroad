/**
 * GAMIFICATION DOMAIN CONTRACTS
 * Directly mirrors backend `backend/internal/app/gamification/domain.go`.
 */

export interface ShopItem {
  id: string
  title: string
  name?: string
  subtitle: string
  description?: string
  category: string
  price_gems: number
  badge: string
  icon?: string
  is_active: boolean
  is_available?: boolean
}

export interface BadgeDefinition {
  id: string
  title: string
  description: string
  icon: string
  category: string
  xp_reward: number
}

export interface UserBadge {
  id: string
  user_id: string
  badge_key: string
  badge?: BadgeDefinition
  awarded_at: string
}

export interface GamificationStatus {
  xp?: number
  current_level?: number
  streak?: number
  gems: number
  inventory: Record<string, number>
  claimed_chests: number[]
  badges?: UserBadge[]
  monthly_badge_claimed?: boolean
  monthly_badge_key?: string
}

export interface ClaimChestRequest {
  tier: number
}

export interface DailyChestClaim {
  id: string
  user_id: string
  claim_date: string
  tier: number
  gems_awarded: number
  xp_awarded: number
}

export interface ClaimChestResponse {
  claim: DailyChestClaim
  status: GamificationStatus
}

export interface ShopBuyRequest {
  item_id: string
}

export interface CoachingSubmissionRequest {
  type: 'cv-review' | 'mock-interview'
  target_role?: string
  github_url?: string
  resume_url?: string
  discord_handle?: string
  interview_language?: string
  focus_topic?: string
  preferred_time?: string
  notes?: string
}

export interface CoachingSubmissionRecord {
  id: string
  type: string
  status: string
  created_at: string
}

export interface CoachingSubmissionResponse {
  submission: CoachingSubmissionRecord
  status: GamificationStatus
}

export interface DailyQuestApiItem {
  id: string
  code: string
  slot_category: string
  title: string
  chip_label: string
  metric_type: string
  current_value: number
  target_value: number
  progress_percent: number
  progress_text: string
  xp_reward: number
  route: string
  icon_name: string
  is_completed: boolean
  is_claimed: boolean
}

export interface ClaimDailyQuestApiResponse {
  quest_id: string
  xp_awarded: number
  current_xp: number
  current_level: number
  streak: number
  claimed_at: string
}
