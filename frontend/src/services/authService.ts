import { api } from './api'
import type { ApiResponse, AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth'

/**
 * Service managing authentication and user identity API interactions.
 */
export const authService = {
  /**
   * Submits user credentials to authenticate session.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Gagal masuk. Silakan coba lagi.')
    }
    return response.data.data
  },

  /**
   * Submits new user profile details to register account.
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Pendaftaran gagal. Silakan coba lagi.')
    }
    return response.data.data
  },

  /**
   * Fetches latest user profile data from /users/me.
   */
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/me')
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Gagal memuat profil pengguna.')
    }
    return response.data.data
  },

  /**
   * Updates user preferences, primary stack, or profile fields.
   */
  async updateProfile(payload: {
    name?: string
    primary_stack?: string
    career_path_id?: string
    bio?: string
    github_url?: string
    linkedin_url?: string
  }): Promise<User> {
    const response = await api.patch<ApiResponse<User>>('/users/me', payload)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Gagal memperbarui profil pengguna.')
    }
    return response.data.data
  },

  /**
   * Fetches 7-day weekly activity history and real streak tracking from /users/me/activity-logs.
   */
  async getActivityLogs(): Promise<import('../types/auth').UserActivitySummary> {
    const response = await api.get<ApiResponse<import('../types/auth').UserActivitySummary>>('/users/me/activity-logs')
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Gagal memuat catatan aktivitas belajar.')
    }
    return response.data.data
  },

  /**
   * Claims a daily reward (vocab_quest or golden_chest) and persists XP on backend PostgreSQL.
   */
  async claimDailyReward(rewardType: 'vocab_quest' | 'golden_chest'): Promise<import('../types/auth').DailyRewardClaimResponse> {
    const response = await api.post<ApiResponse<import('../types/auth').DailyRewardClaimResponse>>('/users/me/daily-rewards/claim', {
      reward_type: rewardType,
    })
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Gagal mengklaim hadiah harian.')
    }
    return response.data.data
  },

  /**
   * Fetches today's daily rewards status from backend PostgreSQL.
   */
  async getDailyRewardsStatus(): Promise<import('../types/auth').DailyRewardsStatusResponse> {
    const response = await api.get<ApiResponse<import('../types/auth').DailyRewardsStatusResponse>>('/users/me/daily-rewards')
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Gagal memuat status hadiah harian.')
    }
    return response.data.data
  },

  /**
   * Terminates active session on the backend.
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
      // Gracefully ignore network errors during sign out
    }
  },
}
