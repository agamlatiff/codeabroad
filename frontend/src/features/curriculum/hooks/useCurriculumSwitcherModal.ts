import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  languageService,
  LANGUAGES_QUERY_KEY,
  LANGUAGE_ENROLLMENTS_QUERY_KEY,
} from "@/features/curriculum/services/languageService"
import { triggerHaptic } from "@/shared/utils/haptics"
import type { CareerTrackOption } from "@/features/curriculum/types/curriculum"
import { mapEnrollmentsToTrackOptions } from "@/features/curriculum/utils/curriculumMapper"

export interface UseCurriculumSwitcherModalOptions {
  enabled?: boolean
  onSelectTrack: (languageId: string) => void
  onClose: () => void
}

/**
 * 1:1 Headless controller hook for Language / Curriculum Switcher Modal.
 * Fetches user enrollments and available destination languages lazily when enabled.
 */
export const useCurriculumSwitcherModal = ({
  enabled = true,
  onSelectTrack,
  onClose,
}: UseCurriculumSwitcherModalOptions) => {
  const { data: enrollments = [] } = useQuery({
    queryKey: LANGUAGE_ENROLLMENTS_QUERY_KEY,
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    enabled,
    staleTime: 1000 * 60 * 5,
  })

  const { data: languages = [] } = useQuery({
    queryKey: LANGUAGES_QUERY_KEY,
    queryFn: ({ signal }) => languageService.listLanguages({ signal }),
    enabled,
    staleTime: 1000 * 60 * 10,
  })

  const trackOptions: CareerTrackOption[] = useMemo(
    () => mapEnrollmentsToTrackOptions(enrollments, languages),
    [enrollments, languages]
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
      if (track.isEnrolled === false) return
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
    handleSelect,
  }
}
