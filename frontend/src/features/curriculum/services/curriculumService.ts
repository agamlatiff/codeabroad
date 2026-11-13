import { api, unwrapApiResponse, type RequestOptions } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type {
  CurriculumResponse,
  LessonDetailResponse,
  CompleteLessonRequest,
  CompleteLessonResponse,
  GrammarPoint,
} from "@/features/curriculum/types/curriculum"

export const CURRICULUM_QUERY_KEY = ['curriculum'] as const
export const LESSON_DETAIL_QUERY_KEY = ['curriculum', 'lesson'] as const
export const GRAMMAR_POINTS_QUERY_KEY = ['curriculum', 'grammar-points'] as const

/**
 * Service managing language curriculum trees, lesson details, completion, and grammar references.
 * Directly corresponds to backend Curriculum endpoints (`/api/v1/curriculum/*`).
 */
export const curriculumService = {
  /**
   * Fetches the user's curriculum tree (defaults to active enrollment if languageId is omitted).
   */
  async getCurriculum(
    languageId?: string,
    options?: RequestOptions
  ): Promise<CurriculumResponse> {
    const trimmed = languageId?.trim()
    const response = await api.get<ApiResponse<CurriculumResponse>>('/curriculum', {
      params: trimmed ? { language_id: trimmed } : undefined,
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat kurikulum belajar.')
  },

  /**
   * Fetches full lesson node details including exercises and linked grammar points.
   */
  async getLessonDetail(
    lessonId: string,
    options?: RequestOptions
  ): Promise<LessonDetailResponse> {
    const encodedId = encodeURIComponent(lessonId.trim())
    const response = await api.get<ApiResponse<LessonDetailResponse>>(
      `/curriculum/lessons/${encodedId}`,
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal memuat detail lesson.')
  },

  /**
   * Completes a lesson node atomically on the backend and awards XP/streak/badges.
   */
  async completeLesson(
    lessonId: string,
    payload: CompleteLessonRequest,
    options?: RequestOptions
  ): Promise<CompleteLessonResponse> {
    const encodedId = encodeURIComponent(lessonId.trim())
    const response = await api.post<ApiResponse<CompleteLessonResponse>>(
      `/curriculum/lessons/${encodedId}/complete`,
      payload,
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal menyelesaikan lesson.')
  },

  /**
   * Fetches syntax and grammar points for an unlocked proficiency level.
   */
  async getGrammarPoints(
    levelId: string,
    options?: RequestOptions
  ): Promise<GrammarPoint[]> {
    const response = await api.get<ApiResponse<GrammarPoint[]>>('/curriculum/grammar-points', {
      params: { level_id: levelId.trim() },
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat daftar grammar level.')
  },
}
