import { api } from './api'
import type { ApiResponse } from '../types/auth'
import type {
  Quest,
  QuestFilter,
  RunTestsRequest,
  RunTestsResponse,
  SubmitQuestRequest,
  SubmitQuestResponse,
} from '../types/quest'

export const questService = {
  // List quests with optional filtering by type, career_path_id, or chapter_id
  async listQuests(filter?: QuestFilter): Promise<Quest[]> {
    const params = new URLSearchParams()
    if (filter?.type) params.append('type', filter.type)
    if (filter?.career_path_id) params.append('career_path_id', filter.career_path_id)
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

  // Fetch full details of a specific quest including acceptance criteria and starter code
  async getQuestDetails(id: string): Promise<Quest> {
    const response = await api.get<ApiResponse<Quest>>(`/quests/${id}`)
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch quest details')
  },

  // Run tests in sandbox
  async runTests(id: string, req: RunTestsRequest): Promise<RunTestsResponse> {
    const response = await api.post<ApiResponse<RunTestsResponse>>(`/quests/${id}/run-tests`, req)
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to run tests')
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
