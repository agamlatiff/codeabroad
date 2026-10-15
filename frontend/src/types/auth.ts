export interface User {
    id: string
    name: string
    username: string
    email: string
    avatar_url?: string | null
    bio?: string | null
    career_path_id?: string | null
    country_id?: string | null
    level: string
    target_timeline?: string | null
    language_level?: string | null
    xp: number
    current_level: number
    streak: number
    gems?: number | null
    is_onboarded: boolean
    primary_stack?: string | null
    country?: {
        id: string
        code: string
        name: string
        flag_emoji: string
    } | null
    career_path?: {
        id: string
        slug: string
        label: string
    } | null
    created_at: string
}

export interface AuthResponse {
    access_token: string
    refresh_token: string
    user: User
}

export type ApiResponse<T> = 
  | { success: true; message?: string; data: T; error?: never }
  | { success: false; error: string; code: string; details?: Record<string, any>; data?: never }

export interface LoginPayload {
    email: string
    password: string
    remember_me?: boolean
}

export interface RegisterPayload {
    name: string
    username: string
    email: string
    password: string
}

export interface UserActivityLog {
    date: string
    day_index: number
    day_label: string
    is_active: boolean
    is_today: boolean
    xp_earned: number
    quests_count: number
}

export interface UserActivitySummary {
    current_streak: number
    total_active_days: number
    last_active_at?: string | null
    weekly_logs: UserActivityLog[]
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


