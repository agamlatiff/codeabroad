import { api } from './api'
import type { ApiResponse } from '../types/api'
import type {
  User,
  UpdateProfilePayload,
  UserActivitySummaryResponse,
  DailyRewardClaimResponse,
  DailyRewardsStatusResponse,
} from '../types/user'

/**
 * Service managing user profile, preferences, and daily consistency activity tracking.
 * Directly corresponds to backend User Service (`/api/v1/users/me/*`).
 */
export const userService = {
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
   * Updates user preferences, primary stack, or profile fields on /users/me.
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const response = await api.patch<ApiResponse<User>>('/users/me', payload)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Gagal memperbarui profil pengguna.')
    }
    return response.data.data
  },

  /**
   * Fetches 7-day weekly activity history and real streak tracking from /users/me/activity-logs.
   */
  async getActivityLogs(): Promise<UserActivitySummaryResponse> {
    const response = await api.get<ApiResponse<UserActivitySummaryResponse>>('/users/me/activity-logs')
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Gagal memuat catatan aktivitas belajar.')
    }
    return response.data.data
  },

  /**
   * Claims a daily reward (vocab_quest or golden_chest) and persists XP on backend PostgreSQL.
   */
  async claimDailyReward(rewardType: 'vocab_quest' | 'golden_chest'): Promise<DailyRewardClaimResponse> {
    const response = await api.post<ApiResponse<DailyRewardClaimResponse>>('/users/me/daily-rewards/claim', {
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
  async getDailyRewardsStatus(): Promise<DailyRewardsStatusResponse> {
    const response = await api.get<ApiResponse<DailyRewardsStatusResponse>>('/users/me/daily-rewards')
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Gagal memuat status hadiah harian.')
    }
    return response.data.data
  },
}
