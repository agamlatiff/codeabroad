import { api } from './api'
import type { ApiResponse } from '../types/api'
import type {
  GamificationStatus,
  ClaimChestResponse,
  CoachingSubmissionRequest,
  CoachingSubmissionResponse,
} from '../types/gamification'

// Re-export gamification types
export type * from '../types/gamification'

export const gamificationService = {
  // Retrieve unified SSOT gamification profile (gems, inventory, chest claims, badges)
  async getStatus(): Promise<GamificationStatus> {
    const response = await api.get<ApiResponse<GamificationStatus>>('/gamification/status')
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch gamification status')
  },

  // Claim a 3-tier milestone chest
  async claimDailyChest(tier: number): Promise<ClaimChestResponse> {
    const response = await api.post<ApiResponse<ClaimChestResponse>>('/gamification/chests/claim', { tier })
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to claim daily chest')
  },

  // Purchase an item from Akihabara Arcade
  async buyShopItem(itemId: string): Promise<GamificationStatus> {
    const response = await api.post<ApiResponse<GamificationStatus>>('/gamification/shop/buy', { item_id: itemId })
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to purchase shop item')
  },

  // Claim monthly challenge badge
  async claimMonthlyBadge(): Promise<GamificationStatus> {
    const response = await api.post<ApiResponse<GamificationStatus>>('/gamification/badges/claim-monthly')
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to claim monthly badge')
  },

  // Submit coaching request (CV review or mock interview)
  async submitCoaching(req: CoachingSubmissionRequest): Promise<CoachingSubmissionResponse> {
    const response = await api.post<ApiResponse<CoachingSubmissionResponse>>('/gamification/coaching/submit', req)
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to submit coaching request')
  },
}
