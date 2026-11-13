import { api, unwrapApiResponse } from '@/shared/services/api'
import type { RequestOptions } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/api'
import type { VocabularyItem } from '@/features/exercise/types/vocabulary'

export const vocabularyService = {
  /**
   * Fetches rotating daily workplace vocabulary cards derived from backend curriculum exercises.
   */
  getDailyVocabularies: async (options?: RequestOptions): Promise<VocabularyItem[]> => {
    const response = await api.get<ApiResponse<VocabularyItem[]>>('/vocabularies/daily', {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat kosakata harian.')
  },
}
