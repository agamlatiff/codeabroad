import { api } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type {
  Quest,
  QuestFilter,
  SubmitQuestRequest,
  SubmitQuestResponse,
} from "@/features/gamification/types/quest"

export const questService = {
  // List quests with optional filtering by type, language_id, or chapter_id
  async listQuests(filter?: QuestFilter): Promise<Quest[]> {
    const params = new URLSearchParams()
    if (filter?.type) params.append('type', filter.type)
    if (filter?.language_id) params.append('language_id', filter.language_id)
    if (filter?.chapter_id) params.append('chapter_id', filter.chapter_id)

    const response = await api.get<ApiResponse<Quest[]>>('/quests', { params })
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch quests')
  },

  // Fetch rotating daily micro-quests
  async getDailyQuests(): Promise<Quest[]> {
    const response = await api.get<ApiResponse<Quest[]>>('/quests/daily')
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch daily quests')
  },

  // Fetch full details of a specific quest
  async getQuestDetails(id: string): Promise<Quest> {
    const response = await api.get<ApiResponse<Quest>>(`/quests/${id}`)
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch quest details')
  },

  // Submit quest solution and receive rewards
  async submitQuest(id: string, req: SubmitQuestRequest): Promise<SubmitQuestResponse> {
    const response = await api.post<ApiResponse<SubmitQuestResponse>>(`/quests/${id}/submit`, req)
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to submit quest')
  },
}
