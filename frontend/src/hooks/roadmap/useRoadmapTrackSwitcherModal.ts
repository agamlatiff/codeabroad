import { useMemo, useCallback } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useQuery } from '@tanstack/react-query'
import { onboardingService } from '../../services/onboardingService'
import { triggerHaptic } from '../../utils/haptics'
import type { CareerTrackOption } from '../../types/roadmap'
import { mapCareerPathsToTrackOptions } from '../../utils/roadmapMapper'
import { CAREER_PATHS_QUERY_KEY } from '../../constants/queryKeys'

export interface UseRoadmapTrackSwitcherModalOptions {
  onSelectTrack: (trackSlug: string) => void
  onClose: () => void
}

/**
 * 1:1 Headless controller hook for RoadmapTrackSwitcherModal.
 * Fetches database-seeded career paths via TanStack Query and handles track selection.
 */
export const useRoadmapTrackSwitcherModal = ({
  onSelectTrack,
  onClose,
}: UseRoadmapTrackSwitcherModalOptions) => {
  const { data: careerPaths = [] } = useQuery({
    queryKey: CAREER_PATHS_QUERY_KEY,
    queryFn: onboardingService.getCareerPaths,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  })

  // Memoized due to nested loops in mapCareerPathsToTrackOptions
  const { user } = useAuthStore()

  const trackOptions: CareerTrackOption[] = useMemo(
    () => mapCareerPathsToTrackOptions(careerPaths, user),
    [careerPaths, user]
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
    handleSelect,
  }
}

