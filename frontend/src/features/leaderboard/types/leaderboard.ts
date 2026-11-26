export type LeagueDivision = 'bronze' | 'silver' | 'gold' | 'diamond'

export interface LeaderboardEntry {
  rank: number
  user_id?: string
  username: string
  name: string
  avatar_url?: string | null
  weekly_xp: number
  streak: number
  current_level: number
  division: LeagueDivision
  is_current_user: boolean
  zone: 'promotion' | 'safe' | 'demotion'
}

export interface PendingWeeklyReward {
  season_year: number
  season_week: number
  division: LeagueDivision
  division_name: string
  rank: number
  weekly_xp: number
  gems_awarded: number
  claimed: boolean
}

export interface ClaimWeeklyRewardResponse {
  reward: PendingWeeklyReward
  new_gems: number
}

export interface WeeklyLeaderboardResponse {
  division: LeagueDivision
  division_name: string
  division_tier: string
  user_division?: LeagueDivision
  season_week: number
  days_remaining: number
  user_rank?: LeaderboardEntry | null
  last_week_reward?: PendingWeeklyReward | null
  entries: LeaderboardEntry[]
  total_competitors: number
}
