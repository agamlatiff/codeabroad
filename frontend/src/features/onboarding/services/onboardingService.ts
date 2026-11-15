import { api, unwrapApiResponse } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type {
  Country,
  CareerPath,
  OnboardingLanguage,
  OnboardingPayload,
  OnboardingProfileResponse,
  OnboardingV3ResultResponse,
} from "@/features/onboarding/types/onboarding"

export const CAREER_PATHS_QUERY_KEY = ['career-paths'] as const
export const ONBOARDING_LANGUAGES_QUERY_KEY = ['onboarding-languages'] as const

const LANGUAGE_TO_COUNTRY_META: Record<
  string,
  { code: string; name: string; flag_emoji: string; badge?: string }
> = {
  ja: { code: 'JP', name: 'Jepang', flag_emoji: '🇯🇵', badge: 'Populer' },
  de: { code: 'DE', name: 'Jerman', flag_emoji: '🇩🇪', badge: 'Segera Hadir' },
  en: { code: 'SG', name: 'Singapura', flag_emoji: '🇸🇬', badge: 'Segera Hadir' },
}

const DEFAULT_CAREER_PATHS: CareerPath[] = [
  {
    id: 'backend',
    slug: 'backend',
    label: 'Backend Engineer',
    description: 'API skalabel, microservices, dan arsitektur sistem terdistribusi.',
    stacks: [
      { slug: 'golang', label: 'Go (Gin Framework)', is_active: true, badge: 'Tokyo Standard' },
      { slug: 'node', label: 'Node.js (Express)', is_active: false, badge: 'Coming Soon' },
      { slug: 'java', label: 'Java (Spring Boot)', is_active: false, badge: 'Coming Soon' },
    ],
  },
  {
    id: 'frontend',
    slug: 'frontend',
    label: 'Frontend Engineer',
    description: 'Antarmuka web modern, aksesibilitas, dan performa UI tinggi.',
    stacks: [
      { slug: 'react', label: 'React & TypeScript', is_active: true, badge: 'Tokyo Standard' },
      { slug: 'vue', label: 'Vue.js', is_active: false, badge: 'Coming Soon' },
    ],
  },
  {
    id: 'fullstack',
    slug: 'fullstack',
    label: 'Fullstack Engineer',
    description: 'Pengembangan end-to-end dari antarmuka hingga infrastruktur backend.',
    stacks: [
      { slug: 'react_golang', label: 'React + Go', is_active: true, badge: 'Populer' },
    ],
  },
  {
    id: 'devops',
    slug: 'devops',
    label: 'DevOps & Cloud',
    description: 'CI/CD, Kubernetes, dan keandalan sistem cloud produksi.',
    stacks: [
      { slug: 'kubernetes', label: 'Docker & Kubernetes', is_active: false, badge: 'Coming Soon' },
    ],
  },
]

export const onboardingService = {
  // Fetch available active languages from v3.0 /onboarding/languages
  async getLanguages(): Promise<OnboardingLanguage[]> {
    const response = await api.get<ApiResponse<OnboardingLanguage[]>>('/onboarding/languages')
    return unwrapApiResponse(response, 'Gagal memuat daftar bahasa onboarding.')
  },

  // Fetch placement test questions for a target language
  async getPlacementQuestions(languageId: string): Promise<{ language: OnboardingLanguage; questions: unknown[] }> {
    const response = await api.get<ApiResponse<{ language: OnboardingLanguage; questions: unknown[] }>>(
      `/onboarding/placement-questions/${languageId}`
    )
    return unwrapApiResponse(response, 'Gagal memuat soal placement test.')
  },

  // Map v3.0 languages to destination country cards for Step 1 UI
  async getCountries(): Promise<Country[]> {
    const languages = await onboardingService.getLanguages()
    return languages.map((lang) => {
      const meta = LANGUAGE_TO_COUNTRY_META[lang.code?.toLowerCase()] ?? {
        code: lang.code?.toUpperCase() || 'JP',
        name: lang.name,
        flag_emoji: '🌐',
      }
      return {
        id: lang.id,
        code: meta.code,
        name: meta.name,
        flag_emoji: meta.flag_emoji,
        is_active: lang.is_active,
        badge: meta.badge,
      }
    })
  },

  // Return career track catalog for Step 2 UI & legacy track switchers without hitting removed v2 endpoints
  async getCareerPaths(): Promise<CareerPath[]> {
    return DEFAULT_CAREER_PATHS
  },

  // Submit completed onboarding preferences to v3.0 POST /onboarding
  async completeOnboarding(
    payload: OnboardingPayload
  ): Promise<OnboardingProfileResponse> {
    const v3Body = {
      language_id: payload.language_id || payload.country_id || '',
      daily_goal_minutes: payload.daily_goal_minutes,
      initial_placement_type: payload.initial_placement_type,
      ...(payload.manual_level_id ? { manual_level_id: payload.manual_level_id } : {}),
      ...(payload.placement_answers ? { placement_answers: payload.placement_answers } : {}),
    }

    const response = await api.post<ApiResponse<OnboardingV3ResultResponse>>(
      '/onboarding',
      v3Body
    )
    const data = unwrapApiResponse(response, 'Gagal menyelesaikan onboarding.')

    const countryMeta = LANGUAGE_TO_COUNTRY_META.ja
    const matchedCareerPath = DEFAULT_CAREER_PATHS.find(
      (p) => p.id === payload.career_path_id || p.slug === payload.career_path_id
    )
    return {
      id: data.user.id,
      name: data.profile.name,
      username: data.profile.username,
      email: data.user.email,
      level: payload.level || data.assigned_level?.code || 'beginner',
      xp: data.gamification_stats.xp,
      current_level: data.gamification_stats.current_level,
      streak: data.gamification_stats.streak,
      is_onboarded: data.profile.is_onboarded,
      primary_stack: payload.primary_stack || 'golang',
      target_timeline: payload.target_timeline,
      language_level: payload.language_level,
      country: {
        id: data.enrollment.language_id,
        code: countryMeta.code,
        name: countryMeta.name,
        flag_emoji: countryMeta.flag_emoji,
      },
      career_path: {
        id: matchedCareerPath?.id || payload.career_path_id || 'backend',
        slug: matchedCareerPath?.slug || payload.career_path_id || 'backend',
        label: matchedCareerPath?.label || 'Backend Engineer',
      },
      created_at: data.user.created_at,
    }
  },
}
