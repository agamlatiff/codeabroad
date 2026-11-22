import { api, unwrapApiResponse, type RequestOptions } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type {
  ClaimWeeklyRewardResponse,
  LeagueDivision,
  WeeklyLeaderboardResponse,
} from "@/features/leaderboard/types/leaderboard"

export const leaderboardService = {
  /** Fetches weekly league standings; omits division param when auto-resolving user's active tier. */
  async getWeeklyLeaderboard(
    division?: LeagueDivision,
    options?: RequestOptions
  ): Promise<WeeklyLeaderboardResponse> {
    const response = await api.get<ApiResponse<WeeklyLeaderboardResponse>>('/leaderboard/weekly', {
      params: division ? { division } : undefined,
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat papan peringkat mingguan.')
  },

  /** Claims the authenticated user's previous-week Top-3 league podium Gems prize. */
  async claimWeeklyReward(): Promise<ClaimWeeklyRewardResponse> {
    const response = await api.post<ApiResponse<ClaimWeeklyRewardResponse>>('/leaderboard/weekly/claim')
    return unwrapApiResponse(response, 'Gagal mengklaim hadiah podium mingguan.')
  },
}
