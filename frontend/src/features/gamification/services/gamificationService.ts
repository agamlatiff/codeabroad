import { api, unwrapApiResponse, type RequestOptions } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import { DAILY_QUESTS_QUERY_KEY } from "@/shared/constants/queryKeys"
import type {
  BadgeDefinition,
  ClaimChestResponse,
  ClaimDailyQuestApiResponse,
  ClaimMonthlyBadgeResponse,
  CoachingSubmissionRequest,
  CoachingSubmissionResponse,
  DailyQuestApiItem,
  GamificationStatus,
  ShopItem,
  UserBadge,
} from "@/features/gamification/types/gamification"

export type * from "@/features/gamification/types/gamification"

export const GAMIFICATION_STATUS_QUERY_KEY = ['gamification', 'status'] as const
export const GAMIFICATION_SHOP_QUERY_KEY = ['gamification', 'shop'] as const
export const GAMIFICATION_BADGES_QUERY_KEY = ['gamification', 'badges'] as const
export const GAMIFICATION_DAILY_QUESTS_QUERY_KEY = DAILY_QUESTS_QUERY_KEY

export const gamificationService = {
  async getStatus(options?: RequestOptions): Promise<GamificationStatus> {
    const response = await api.get<ApiResponse<GamificationStatus>>('/gamification/status', {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat status gamifikasi.')
  },

  async listShopItems(options?: RequestOptions): Promise<ShopItem[]> {
    const response = await api.get<ApiResponse<ShopItem[]>>('/gamification/shop', {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat katalog toko hadiah.')
  },

  async listBadges(
    options?: RequestOptions
  ): Promise<{ catalog: BadgeDefinition[]; user_badges: UserBadge[] }> {
    const response = await api.get<
      ApiResponse<{ catalog: BadgeDefinition[]; user_badges: UserBadge[] }>
    >('/gamification/badges', { signal: options?.signal })
    return unwrapApiResponse(response, 'Gagal memuat daftar lencana.')
  },

  async claimDailyChest(tier: number): Promise<ClaimChestResponse> {
    const response = await api.post<ApiResponse<ClaimChestResponse>>(
      '/gamification/chests/claim',
      { tier }
    )
    return unwrapApiResponse(response, 'Gagal membuka peti hadiah harian.')
  },

  async buyShopItem(itemId: string): Promise<GamificationStatus> {
    const response = await api.post<
      ApiResponse<{ purchased_item: unknown; status: GamificationStatus }>
    >('/gamification/shop/buy', { item_id: itemId })
    return unwrapApiResponse(response, 'Gagal menukar item di toko.').status
  },

  async activateShopItem(itemId: string): Promise<GamificationStatus> {
    const response = await api.post<ApiResponse<{ status: GamificationStatus }>>(
      '/gamification/shop/activate',
      { item_id: itemId }
    )
    return unwrapApiResponse(response, 'Gagal mengaktifkan item dari tas.').status
  },

  async claimMonthlyBadge(): Promise<ClaimMonthlyBadgeResponse> {
    const response = await api.post<ApiResponse<ClaimMonthlyBadgeResponse>>(
      '/gamification/monthly-badge/claim'
    )
    return unwrapApiResponse(response, 'Gagal mengklaim lencana bulanan.')
  },

  async submitCoaching(req: CoachingSubmissionRequest): Promise<CoachingSubmissionResponse> {
    const response = await api.post<ApiResponse<CoachingSubmissionResponse>>(
      '/gamification/coaching',
      req
    )
    return unwrapApiResponse(response, 'Gagal mengirim pengajuan mentoring.')
  },

  async getDailyQuests(options?: RequestOptions): Promise<DailyQuestApiItem[]> {
    const response = await api.get<ApiResponse<DailyQuestApiItem[]>>(
      '/gamification/daily-quests',
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal memuat daftar misi harian.')
  },

  async claimDailyQuest(questId: string): Promise<ClaimDailyQuestApiResponse> {
    const response = await api.post<ApiResponse<ClaimDailyQuestApiResponse>>(
      `/gamification/daily-quests/${encodeURIComponent(questId)}/claim`
    )
    return unwrapApiResponse(response, 'Gagal mengklaim hadiah misi harian.')
  },
}
