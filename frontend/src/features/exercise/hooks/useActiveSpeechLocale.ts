import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  LANGUAGE_ENROLLMENTS_QUERY_KEY,
  languageService,
} from '@/features/curriculum/services/languageService'
import { resolveSpeechLocale } from '@/features/exercise/utils/exerciseHelpers'

/**
 * Resolves the learner's active enrolled language into a BCP-47 speech locale.
 */
export const useActiveSpeechLocale = () => {
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')

  const enrollmentsQuery = useQuery({
    queryKey: [...LANGUAGE_ENROLLMENTS_QUERY_KEY, userId],
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    staleTime: 60_000,
    retry: false,
  })

  return useMemo(() => {
    const enrollments = enrollmentsQuery.data ?? []
    const active = enrollments.find((item) => item.is_active) ?? enrollments[0]
    return resolveSpeechLocale(active?.language?.code)
  }, [enrollmentsQuery.data])
}

