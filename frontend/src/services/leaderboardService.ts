import { api } from './api'
import type { ApiResponse } from '../types/auth'
import type { TokyoDivision, WeeklyLeaderboardResponse } from '../types/leaderboard'

export const leaderboardService = {
  // Fetch weekly Tokyo League leaderboard standings
  async getWeeklyLeaderboard(division?: TokyoDivision): Promise<WeeklyLeaderboardResponse> {
    const params = new URLSearchParams()
    if (division) params.append('division', division)

    const url = `/leaderboard/weekly${params.toString() ? `?${params.toString()}` : ''}`
    const response = await api.get<ApiResponse<WeeklyLeaderboardResponse>>(url)
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch weekly leaderboard')
  },
}
