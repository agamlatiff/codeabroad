import { api } from './api'
import type { ApiResponse } from '../types/auth'
import type { VocabularyItem } from '../types/vocabulary'

export const vocabularyService = {
  // Fetch rotating IT Tokyo daily vocabularies from backend PostgreSQL API
  async getDailyVocabularies(): Promise<VocabularyItem[]> {
    const response = await api.get<ApiResponse<VocabularyItem[]>>('/vocabularies/daily')
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch daily vocabularies')
  },

  // Fetch paginated vocabularies with optional category filter
  async listVocabularies(category?: string, page = 1, limit = 20): Promise<{ vocabularies: VocabularyItem[]; total: number }> {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    params.append('page', String(page))
    params.append('limit', String(limit))

    const response = await api.get<ApiResponse<{ vocabularies: VocabularyItem[]; total: number }>>(`/vocabularies?${params.toString()}`)
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch vocabularies')
  },
}
