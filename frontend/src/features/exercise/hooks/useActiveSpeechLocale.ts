import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useGuestTrialStore } from '@/features/auth/store/guestTrialStore'
import { languageService } from '@/features/curriculum/services/languageService'
import {
  LANGUAGES_QUERY_KEY,
  getLanguageEnrollmentsQueryKey,
} from '@/shared/constants/queryKeys'
import { resolveSpeechLocale } from '@/features/exercise/utils/exerciseHelpers'

/**
 * Resolves the learner's active language ISO code dynamically for both authenticated learners
 * (from enrollments) and guests (from URL `:languageId`, persisted guest track, or active catalog).
 */
export const useActiveLanguageCode = (): string => {
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')
  const guestPreferredLanguageId = useGuestTrialStore((state) => state.preferredLanguageId)
  const { languageId: routeLanguageId } = useParams<{ languageId?: string }>()
  const isGuest = userId === 'anonymous'

  const enrollmentsQuery = useQuery({
    queryKey: getLanguageEnrollmentsQueryKey(userId),
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    enabled: !isGuest,
    staleTime: 60_000,
    retry: false,
  })

  const languagesQuery = useQuery({
    queryKey: LANGUAGES_QUERY_KEY,
    queryFn: ({ signal }) => languageService.listLanguages({ signal }),
    enabled: isGuest,
    staleTime: 1000 * 60 * 10,
    retry: false,
  })

  return useMemo(() => {
    if (!isGuest) {
      const enrollments = enrollmentsQuery.data ?? []
      const active = enrollments.find((item) => item.is_active) ?? enrollments[0]
      return active?.language?.code?.trim().toLowerCase() || 'ja'
    }

    const languages = languagesQuery.data ?? []
    const requested = (routeLanguageId || guestPreferredLanguageId || '').trim().toLowerCase()
    const matched = requested
      ? languages.find(
          (lang) =>
            lang.id.toLowerCase() === requested || lang.code.toLowerCase() === requested
        )
      : undefined
    const target = matched ?? languages.find((lang) => lang.is_active) ?? languages[0]
    return target?.code?.trim().toLowerCase() || 'ja'
  }, [enrollmentsQuery.data, guestPreferredLanguageId, isGuest, languagesQuery.data, routeLanguageId])
}

/**
 * Resolves the learner's active language UUID when available (useful for guest curriculum lookups).
 */
export const useActiveLanguageId = (): string | undefined => {
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')
  const guestPreferredLanguageId = useGuestTrialStore((state) => state.preferredLanguageId)
  const { languageId: routeLanguageId } = useParams<{ languageId?: string }>()
  const isGuest = userId === 'anonymous'

  const enrollmentsQuery = useQuery({
    queryKey: getLanguageEnrollmentsQueryKey(userId),
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    enabled: !isGuest,
    staleTime: 60_000,
    retry: false,
  })

  const languagesQuery = useQuery({
    queryKey: LANGUAGES_QUERY_KEY,
    queryFn: ({ signal }) => languageService.listLanguages({ signal }),
    enabled: isGuest,
    staleTime: 1000 * 60 * 10,
    retry: false,
  })

  return useMemo(() => {
    if (!isGuest) {
      const enrollments = enrollmentsQuery.data ?? []
      const active = enrollments.find((item) => item.is_active) ?? enrollments[0]
      return active?.language_id
    }

    const languages = languagesQuery.data ?? []
    const requested = (routeLanguageId || guestPreferredLanguageId || '').trim().toLowerCase()
    const matched = requested
      ? languages.find(
          (lang) =>
            lang.id.toLowerCase() === requested || lang.code.toLowerCase() === requested
        )
      : undefined
    const target = matched ?? languages.find((lang) => lang.is_active) ?? languages[0]
    return target?.id
  }, [enrollmentsQuery.data, guestPreferredLanguageId, isGuest, languagesQuery.data, routeLanguageId])
}

/**
 * Resolves the learner's active language into a BCP-47 speech locale.
 */
export const useActiveSpeechLocale = () => {
  const activeLanguageCode = useActiveLanguageCode()
  return useMemo(() => resolveSpeechLocale(activeLanguageCode), [activeLanguageCode])
}
