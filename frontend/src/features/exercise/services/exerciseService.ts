import { api, unwrapApiResponse } from '@/shared/services/api'
import type { RequestOptions } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/api'
import type { CurriculumExercise } from '@/features/curriculum/types/curriculum'
import type {
  ReadinessExamResponse,
  ReadinessExamSubmissionRequest,
  SRSQueueResponse,
  SubmitExerciseAnswerRequest,
  SubmitExerciseAnswerResponse,
  SubmitSRSReviewRequest,
  UserSRSReview,
} from '@/features/exercise/types/exercise'

export const SRS_DUE_QUERY_KEY = ['srs', 'due'] as const
export const EXAM_QUESTIONS_QUERY_KEY = ['exams', 'questions'] as const

export const exerciseService = {
  /**
   * Submits a single exercise answer to backend for evaluation, XP credit, and SRS scheduling.
   */
  submitAnswer: async (
    payload: SubmitExerciseAnswerRequest,
    options?: RequestOptions
  ): Promise<SubmitExerciseAnswerResponse> => {
    const response = await api.post<ApiResponse<SubmitExerciseAnswerResponse>>(
      '/exercises/submit',
      payload,
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal memverifikasi jawaban latihan.')
  },

  /**
   * Retrieves due Spaced Repetition System (SRS) flashcards for the authenticated user.
   */
  getDueReviews: async (
    limit = 20,
    options?: RequestOptions
  ): Promise<SRSQueueResponse> => {
    const response = await api.get<ApiResponse<SRSQueueResponse>>('/srs/due', {
      params: { limit },
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat antrean ulasan SRS.')
  },

  /**
   * Submits an SM-2 quality rating (0-5) for a due flashcard.
   */
  processReview: async (
    payload: SubmitSRSReviewRequest,
    options?: RequestOptions
  ): Promise<UserSRSReview> => {
    const response = await api.post<ApiResponse<UserSRSReview>>('/srs/review', payload, {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal menyimpan hasil ulasan SRS.')
  },

  /**
   * Retrieves randomized mock readiness exam questions for a proficiency level.
   */
  getExamQuestions: async (
    levelId: string,
    options?: RequestOptions
  ): Promise<CurriculumExercise[]> => {
    const response = await api.get<ApiResponse<CurriculumExercise[]>>(
      `/exams/questions/${levelId}`,
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal memuat soal ujian kesiapan.')
  },

  /**
   * Submits answers for the 4-pillar mock readiness exam.
   */
  submitExam: async (
    payload: ReadinessExamSubmissionRequest,
    options?: RequestOptions
  ): Promise<ReadinessExamResponse> => {
    const response = await api.post<ApiResponse<ReadinessExamResponse>>(
      '/exams/submit',
      payload,
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal mengirim hasil ujian kesiapan.')
  },
}
