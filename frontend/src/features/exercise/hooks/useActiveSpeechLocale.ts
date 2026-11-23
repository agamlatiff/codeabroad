import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import { languageService } from '@/features/curriculum/services/languageService'
import { getLanguageEnrollmentsQueryKey } from '@/shared/constants/queryKeys'
import { resolveSpeechLocale } from '@/features/exercise/utils/exerciseHelpers'

/**
 * Resolves the learner's active enrolled language ISO code (defaults to 'ja' while loading).
 */
export const useActiveLanguageCode = (): string => {
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')

  const enrollmentsQuery = useQuery({
    queryKey: getLanguageEnrollmentsQueryKey(userId),
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    enabled: userId !== 'anonymous',
    staleTime: 60_000,
    retry: false,
  })

  return useMemo(() => {
    const enrollments = enrollmentsQuery.data ?? []
    const active = enrollments.find((item) => item.is_active) ?? enrollments[0]
    return active?.language?.code?.trim().toLowerCase() || 'ja'
  }, [enrollmentsQuery.data])
}

/**
 * Resolves the learner's active enrolled language into a BCP-47 speech locale.
 */
export const useActiveSpeechLocale = () => {
  const activeLanguageCode = useActiveLanguageCode()
  return useMemo(() => resolveSpeechLocale(activeLanguageCode), [activeLanguageCode])
}

