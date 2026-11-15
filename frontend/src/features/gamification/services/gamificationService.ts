import { api } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type {
  BadgeDefinition,
  ClaimChestResponse,
  CoachingSubmissionRequest,
  CoachingSubmissionResponse,
  GamificationStatus,
  ShopItem,
  UserBadge,
} from "@/features/gamification/types/gamification"

export type * from "@/features/gamification/types/gamification"

export const gamificationService = {
  async getStatus(): Promise<GamificationStatus> {
    const response = await api.get<ApiResponse<GamificationStatus>>('/gamification/status')
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch gamification status')
  },

  async listShopItems(): Promise<ShopItem[]> {
    const response = await api.get<ApiResponse<ShopItem[]>>('/gamification/shop')
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch shop items')
  },

  async listBadges(): Promise<{ catalog: BadgeDefinition[]; user_badges: UserBadge[] }> {
    const response = await api.get<
      ApiResponse<{ catalog: BadgeDefinition[]; user_badges: UserBadge[] }>
    >('/gamification/badges')
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch badges')
  },

  async claimDailyChest(tier: number): Promise<ClaimChestResponse> {
    const response = await api.post<ApiResponse<ClaimChestResponse>>(
      '/gamification/chests/claim',
      { tier }
    )
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to claim daily chest')
  },

  async buyShopItem(itemId: string): Promise<GamificationStatus> {
    const response = await api.post<
      ApiResponse<{ purchased_item: unknown; status: GamificationStatus }>
    >('/gamification/shop/buy', { item_id: itemId })
    if (response.data.success && response.data.data) {
      return response.data.data.status
    }
    throw new Error(response.data.error || 'Failed to purchase shop item')
  },

  async submitCoaching(req: CoachingSubmissionRequest): Promise<CoachingSubmissionResponse> {
    const response = await api.post<ApiResponse<CoachingSubmissionResponse>>(
      '/gamification/coaching',
      req
    )
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to submit coaching request')
  },
}
