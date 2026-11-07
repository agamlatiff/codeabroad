import { api } from './api'
import { userService } from './userService'
import type { ApiResponse } from '../types/api'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '../types/auth'
import type {
  User,
  UpdateProfilePayload,
  UserActivitySummaryResponse,
  DailyRewardClaimResponse,
  DailyRewardsStatusResponse,
} from '../types/user'

/**
 * Service managing authentication and user session API interactions.
 * Corresponds to backend Auth Service (`/api/v1/auth/*`).
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
   * Terminates active session on the backend.
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
      // Gracefully ignore network errors during sign out
    }
  },

  // --------------------------------------------------------------------------
  // USER SERVICE DELEGATES (For seamless backwards compatibility)
  // --------------------------------------------------------------------------

  /**
   * Fetches latest user profile data from /users/me.
   */
  async getProfile(): Promise<User> {
    return userService.getProfile()
  },

  /**
   * Updates user preferences, primary stack, or profile fields.
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    return userService.updateProfile(payload)
  },

  /**
   * Fetches 7-day weekly activity history and real streak tracking from /users/me/activity-logs.
   */
  async getActivityLogs(): Promise<UserActivitySummaryResponse> {
    return userService.getActivityLogs()
  },

  /**
   * Claims a daily reward (vocab_quest or golden_chest) and persists XP on backend PostgreSQL.
   */
  async claimDailyReward(rewardType: 'vocab_quest' | 'golden_chest'): Promise<DailyRewardClaimResponse> {
    return userService.claimDailyReward(rewardType)
  },

  /**
   * Fetches today's daily rewards status from backend PostgreSQL.
   */
  async getDailyRewardsStatus(): Promise<DailyRewardsStatusResponse> {
    return userService.getDailyRewardsStatus()
  },
}
