import { api } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type {
  OnboardingLanguage,
  OnboardingPayload,
  OnboardingProfileResponse,
  OnboardingV3ResultResponse,
  PlacementQuestionsResponse,
} from "../types/onboarding"

export const ONBOARDING_LANGUAGES_QUERY_KEY = ['onboarding-languages'] as const
export const PLACEMENT_QUESTIONS_QUERY_KEY = (languageId: string) =>
  ['onboarding-placement-questions', languageId] as const

export const onboardingService = {
  async getLanguages(): Promise<OnboardingLanguage[]> {
    const response = await api.get<ApiResponse<OnboardingLanguage[]>>('/languages')
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Gagal memuat daftar bahasa')
  },

  async getPlacementQuestions(languageId: string): Promise<PlacementQuestionsResponse> {
    const response = await api.get<ApiResponse<PlacementQuestionsResponse>>(
      `/onboarding/placement-questions/${languageId}`
    )
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Gagal memuat soal tes penempatan')
  },

  async completeOnboarding(payload: OnboardingPayload): Promise<OnboardingProfileResponse> {
    const response = await api.post<ApiResponse<OnboardingV3ResultResponse>>(
      '/onboarding',
      payload
    )

    if (response.data.success && response.data.data) {
      const resData = response.data.data
      return {
        id: resData.user_id || '',
        user_id: resData.user_id || '',
        is_onboarded: resData.is_onboarded,
        xp: resData.xp ?? 50,
        streak: resData.streak ?? 0,
        daily_goal_minutes: resData.daily_goal_minutes,
        initial_placement_type: resData.initial_placement_type,
        placement_score_percent: resData.placement_score_percent,
        assigned_level_code: resData.assigned_level_code,
        assigned_level_name: resData.assigned_level_name,
        language_code: resData.language_code,
        language_name: resData.language_name,
        preferred_roadmap_view: resData.preferred_roadmap_view ?? 'map',
      }
    }
    throw new Error(response.data.error || 'Gagal menyelesaikan onboarding')
  },
}
