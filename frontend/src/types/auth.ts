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
    xp: number
    current_level: number
    streak: number
    is_onboarded: boolean
    created_at: string
}

export interface AuthResponse {
    access_token: string
    refresh_token: string
    user: User
}

export type ApiResponse<T> = 
  | { success: true; message?: string; data: T; error?: never }
  | { success: false; error: string; code: string; data?: never }

