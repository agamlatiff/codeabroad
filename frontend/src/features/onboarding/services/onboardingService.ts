import { api } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type {
  Country,
  CareerPath,
  OnboardingPayload,
  OnboardingProfileResponse,
} from "@/features/onboarding/types/onboarding"

export const CAREER_PATHS_QUERY_KEY = ['career-paths'] as const

export const onboardingService = {
  // Fetch available destination countries
  async getCountries(): Promise<Country[]> {
    const response = await api.get<ApiResponse<Country[]>>('/countries')
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch countries')
  },

  // Fetch available career tracks and their technology stacks
  async getCareerPaths(): Promise<CareerPath[]> {
    const response = await api.get<ApiResponse<CareerPath[]>>('/career-paths')
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch career paths')
  },

  // Submit completed onboarding preferences
  async completeOnboarding(
    payload: OnboardingPayload
  ): Promise<OnboardingProfileResponse> {
    const response = await api.post<ApiResponse<OnboardingProfileResponse>>(
      '/onboarding',
      payload
    )
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to complete onboarding')
  },
}
