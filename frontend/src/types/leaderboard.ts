export type TokyoDivision = 'shinjuku' | 'shibuya' | 'akihabara' | 'roppongi'

export interface LeaderboardEntry {
  rank: number
  user_id: string
  username: string
  name: string
  avatar_url?: string | null
  weekly_xp: number
  streak: number
  current_level: number
  division: TokyoDivision
  is_current_user: boolean
  zone: 'promotion' | 'safe' | 'demotion'
}

export interface WeeklyLeaderboardResponse {
  division: TokyoDivision
  division_name: string
  division_tier: string
  season_week: number
  days_remaining: number
  user_rank?: LeaderboardEntry | null
  entries: LeaderboardEntry[]
  total_competitors: number
}
