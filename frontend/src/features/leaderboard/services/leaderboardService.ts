import { api, unwrapApiResponse, type RequestOptions } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type { LeagueDivision, WeeklyLeaderboardResponse } from "@/features/leaderboard/types/leaderboard"

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
}
