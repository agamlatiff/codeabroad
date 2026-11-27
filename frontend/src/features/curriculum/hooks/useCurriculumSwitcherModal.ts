import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  LANGUAGES_QUERY_KEY,
  getLanguageEnrollmentsQueryKey,
} from '@/shared/constants/queryKeys'
import { languageService } from '@/features/curriculum/services/languageService'
import { triggerHaptic } from '@/shared/utils/haptics'
import type { CareerTrackOption } from '@/features/curriculum/types/curriculum'
import {
  mapEnrollmentsToTrackOptions,
  mapGuestLanguagesToTrackOptions,
} from '@/features/curriculum/utils/curriculumMapper'
import { useActiveLanguageId } from '@/features/exercise/hooks/useActiveSpeechLocale'

export interface UseCurriculumSwitcherModalOptions {
  enabled?: boolean
  onSelectTrack: (languageId: string) => void | Promise<boolean | void>
  onClose: () => void
}

/**
 * 1:1 Headless controller hook for Language / Curriculum Switcher Modal.
 * Fetches user enrollments (when signed in) and available destination languages lazily when enabled.
 */
export const useCurriculumSwitcherModal = ({
  enabled = true,
  onSelectTrack,
  onClose,
}: UseCurriculumSwitcherModalOptions) => {
  const userId = useAuthStore((s) => s.user?.id)
  const activeLanguageId = useActiveLanguageId()

  const { data: enrollments = [], isLoading: isEnrollmentsLoading } = useQuery({
    queryKey: getLanguageEnrollmentsQueryKey(userId),
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    enabled: enabled && Boolean(userId),
    staleTime: 1000 * 60 * 5,
  })

  const { data: languages = [], isLoading: isLanguagesLoading } = useQuery({
    queryKey: LANGUAGES_QUERY_KEY,
    queryFn: ({ signal }) => languageService.listLanguages({ signal }),
    enabled,
    staleTime: 1000 * 60 * 10,
  })

  const trackOptions: CareerTrackOption[] = useMemo(
    () =>
      userId
        ? mapEnrollmentsToTrackOptions(enrollments, languages)
        : mapGuestLanguagesToTrackOptions(languages, activeLanguageId ?? ''),
    [activeLanguageId, enrollments, languages, userId]
  )

  const enrolledOptions = useMemo(
    () => trackOptions.filter((option) => option.isEnrolled !== false),
    [trackOptions]
  )

  const catalogOptions = useMemo(
    () => trackOptions.filter((option) => option.isEnrolled === false),
    [trackOptions]
  )

  const handleSelect = useCallback(
    (track: CareerTrackOption) => {
      triggerHaptic('success')
      onSelectTrack(track.slug)
      onClose()
    },
    [onSelectTrack, onClose]
  )

  return {
    trackOptions,
    enrolledOptions,
    catalogOptions,
    isLoading: isLanguagesLoading || (Boolean(userId) && isEnrollmentsLoading),
    handleSelect,
  }
}
