/**
 * GAMIFICATION DOMAIN CONTRACTS
 * Directly mirrors backend `backend/internal/domain/gamification.go`.
 */

export interface GamificationStatus {
  gems: number
  inventory: Record<string, number>
  claimed_chests: number[]
  monthly_badge_claimed: boolean
  monthly_badge_key: string
}

export interface ClaimChestRequest {
  tier: number
}

export interface ClaimChestResponse {
  status: GamificationStatus
  gems_awarded: number
  xp_awarded: number
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

