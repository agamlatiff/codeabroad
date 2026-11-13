import { api, unwrapApiResponse, type RequestOptions } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type {
  Language,
  ProficiencyLevel,
  UserLanguageEnrollment,
} from "@/features/curriculum/types/curriculum"

export const LANGUAGES_QUERY_KEY = ['languages'] as const
export const LANGUAGE_ENROLLMENTS_QUERY_KEY = ['languages', 'enrollments'] as const

export interface LanguageDetailsResponse {
  language: Language
  levels: ProficiencyLevel[]
}

/**
 * Service managing destination languages, proficiency levels, and active language enrollment switching.
 * Directly corresponds to backend Language endpoints (`/api/v1/languages/*`).
 */
export const languageService = {
  /**
   * Lists all available destination languages.
   */
  async listLanguages(options?: RequestOptions): Promise<Language[]> {
    const response = await api.get<ApiResponse<Language[]>>('/languages', {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat daftar bahasa.')
  },

  /**
   * Fetches language metadata along with its ordered proficiency levels.
   */
  async getLanguageDetails(
    languageId: string,
    options?: RequestOptions
  ): Promise<LanguageDetailsResponse> {
    const encodedId = encodeURIComponent(languageId.trim())
    const response = await api.get<ApiResponse<LanguageDetailsResponse>>(
      `/languages/${encodedId}`,
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal memuat detail bahasa.')
  },

  /**
   * Fetches all language enrollments belonging to the authenticated user.
   */
  async getUserEnrollments(options?: RequestOptions): Promise<UserLanguageEnrollment[]> {
    const response = await api.get<ApiResponse<UserLanguageEnrollment[]>>('/languages/enrollments', {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat track bahasa aktif kamu.')
  },

  /**
   * Switches the user's active enrolled language track.
   */
  async switchActiveLanguage(
    languageId: string,
    options?: RequestOptions
  ): Promise<UserLanguageEnrollment> {
    const response = await api.post<ApiResponse<UserLanguageEnrollment>>(
      '/languages/switch',
      { language_id: languageId },
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal mengganti bahasa belajar aktif.')
  },
}

