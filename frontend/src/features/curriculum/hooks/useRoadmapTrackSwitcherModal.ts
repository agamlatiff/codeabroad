import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { onboardingService, CAREER_PATHS_QUERY_KEY } from "@/features/onboarding/services/onboardingService"
import { useUser } from "@/features/user/hooks/useUser"
import { triggerHaptic } from "@/shared/utils/haptics"
import type { CareerTrackOption } from "@/features/curriculum/types/roadmap"
import { mapCareerPathsToTrackOptions } from "@/features/curriculum/utils/roadmapMapper"

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

  const { data } = useUser()
  const user = data.user

  // Direct lightweight computation (~5 career paths, simple filter and find)
  const trackOptions: CareerTrackOption[] = mapCareerPathsToTrackOptions(careerPaths, user)

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
