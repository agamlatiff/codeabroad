import { api, unwrapApiResponse, type RequestOptions } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/api'
import type {
  FlashcardDeck,
  FlashcardDeckDetail,
  FlashcardDeckPageParams,
  FlashcardDueQueue,
  FlashcardReviewResponse,
  PaginatedFlashcardDecks,
} from '@/features/flashcard/types/flashcard'

export const FLASHCARD_DECKS_QUERY_KEY = ['flashcards', 'decks'] as const
export const FLASHCARD_DUE_QUERY_KEY = ['flashcards', 'due'] as const

export const flashcardService = {
  async listDecks(lang = 'ja', options?: RequestOptions): Promise<FlashcardDeck[]> {
    const response = await api.get<ApiResponse<FlashcardDeck[]>>('/flashcards/decks', {
      params: { lang },
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat daftar dek flashcard.')
  },

  async listDecksPage(
    params: FlashcardDeckPageParams = {},
    options?: RequestOptions
  ): Promise<PaginatedFlashcardDecks> {
    const response = await api.get<ApiResponse<PaginatedFlashcardDecks>>('/flashcards/decks', {
      params: {
        paginated: '1',
        lang: params.lang ?? 'ja',
        level: params.level && params.level !== 'ALL' ? params.level : undefined,
        category: params.category && params.category !== 'ALL' ? params.category : undefined,
        q: params.q?.trim() || undefined,
        cursor: params.cursor || undefined,
        limit: params.limit ?? 12,
      },
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat halaman dek flashcard.')
  },

  async getDeck(deckId: string, options?: RequestOptions): Promise<FlashcardDeckDetail> {
    const response = await api.get<ApiResponse<FlashcardDeckDetail>>(
      `/flashcards/decks/${encodeURIComponent(deckId)}`,
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal memuat kartu dek flashcard.')
  },

  async getDueQueue(lang = 'ja', limit = 20, options?: RequestOptions): Promise<FlashcardDueQueue> {
    const response = await api.get<ApiResponse<FlashcardDueQueue>>('/flashcards/due', {
      params: { lang, limit },
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat daftar ulasan flashcard.')
  },

  async reviewCard(cardId: string, quality: number): Promise<FlashcardReviewResponse> {
    const response = await api.post<ApiResponse<FlashcardReviewResponse>>(
      `/flashcards/cards/${encodeURIComponent(cardId)}/review`,
      { quality }
    )
    return unwrapApiResponse(response, 'Gagal menyimpan penilaian flashcard.')
  },
}
