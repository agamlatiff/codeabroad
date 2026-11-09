import { api, unwrapApiResponse, type RequestOptions } from './api'
import type { ApiResponse } from '../types/api'
import type {
  User,
  UpdateProfilePayload,
  UserActivitySummaryResponse,
  DailyRewardClaimResponse,
  DailyRewardsStatusResponse,
} from '../types/user'

export const PROFILE_QUERY_KEY = ['profile'] as const
export const ACTIVITY_LOGS_QUERY_KEY = ['activity-logs'] as const
export const DAILY_REWARDS_QUERY_KEY = ['daily-rewards'] as const

/**
 * Service managing user profile, preferences, and daily consistency activity tracking.
 * Directly corresponds to backend User Service (`/api/v1/users/me/*`).
 */
export const userService = {
  /**
   * Fetches latest user profile data from /users/me.
   */
  async getProfile(options?: RequestOptions): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/me', {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat profil pengguna.')
  },

  /**
   * Updates user preferences, primary stack, or profile fields on /users/me.
   */
  async updateProfile(payload: UpdateProfilePayload, options?: RequestOptions): Promise<User> {
    const response = await api.patch<ApiResponse<User>>('/users/me', payload, {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memperbarui profil pengguna.')
  },

  /**
   * Fetches 7-day weekly activity history and real streak tracking from /users/me/activity-logs.
   */
  async getActivityLogs(options?: RequestOptions): Promise<UserActivitySummaryResponse> {
    const response = await api.get<ApiResponse<UserActivitySummaryResponse>>('/users/me/activity-logs', {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat catatan aktivitas belajar.')
  },

  /**
   * Claims a daily reward (vocab_quest or golden_chest) and persists XP on backend PostgreSQL.
   */
  async claimDailyReward(
    rewardType: 'vocab_quest' | 'golden_chest',
    options?: RequestOptions
  ): Promise<DailyRewardClaimResponse> {
    const response = await api.post<ApiResponse<DailyRewardClaimResponse>>(
      '/users/me/daily-rewards/claim',
      { reward_type: rewardType },
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal mengklaim hadiah harian.')
  },

  /**
   * Fetches today's daily rewards status from backend PostgreSQL.
   */
  async getDailyRewardsStatus(options?: RequestOptions): Promise<DailyRewardsStatusResponse> {
    const response = await api.get<ApiResponse<DailyRewardsStatusResponse>>('/users/me/daily-rewards', {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat status hadiah harian.')
  },
}
