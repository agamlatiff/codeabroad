import { api, unwrapApiResponse } from "@/shared/services/api"
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
    return unwrapApiResponse(response, 'Failed to fetch gamification status')
  },

  async listShopItems(): Promise<ShopItem[]> {
    const response = await api.get<ApiResponse<ShopItem[]>>('/gamification/shop')
    return unwrapApiResponse(response, 'Failed to fetch shop items')
  },

  async listBadges(): Promise<{ catalog: BadgeDefinition[]; user_badges: UserBadge[] }> {
    const response = await api.get<
      ApiResponse<{ catalog: BadgeDefinition[]; user_badges: UserBadge[] }>
    >('/gamification/badges')
    return unwrapApiResponse(response, 'Failed to fetch badges')
  },

  async claimDailyChest(tier: number): Promise<ClaimChestResponse> {
    const response = await api.post<ApiResponse<ClaimChestResponse>>(
      '/gamification/chests/claim',
      { tier }
    )
    return unwrapApiResponse(response, 'Failed to claim daily chest')
  },

  async buyShopItem(itemId: string): Promise<GamificationStatus> {
    const response = await api.post<
      ApiResponse<{ purchased_item: unknown; status: GamificationStatus }>
    >('/gamification/shop/buy', { item_id: itemId })
    return unwrapApiResponse(response, 'Failed to purchase shop item').status
  },

  async submitCoaching(req: CoachingSubmissionRequest): Promise<CoachingSubmissionResponse> {
    const response = await api.post<ApiResponse<CoachingSubmissionResponse>>(
      '/gamification/coaching',
      req
    )
    return unwrapApiResponse(response, 'Failed to submit coaching request')
  },
}
