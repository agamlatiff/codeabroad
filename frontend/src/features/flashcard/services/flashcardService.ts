import { api, unwrapApiResponse, type RequestOptions } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/api'
import type {
  FlashcardDeck,
  FlashcardDeckDetail,
  FlashcardDueQueue,
  FlashcardReviewResponse,
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
    return unwrapApiResponse(response, 'Gagal memuat antrean ulasan flashcard.')
  },

  async reviewCard(cardId: string, quality: number): Promise<FlashcardReviewResponse> {
    const response = await api.post<ApiResponse<FlashcardReviewResponse>>(
      `/flashcards/cards/${encodeURIComponent(cardId)}/review`,
      { quality }
    )
    return unwrapApiResponse(response, 'Gagal menyimpan penilaian flashcard.')
  },
}
