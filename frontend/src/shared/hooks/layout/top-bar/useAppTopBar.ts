import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUser } from "@/features/user/hooks/useUser"
import { onboardingService, CAREER_PATHS_QUERY_KEY } from "@/features/onboarding/services/onboardingService"
import type { CareerTrackOption } from "@/features/curriculum/types/roadmap"
import { mapCareerPathsToTrackOptions } from "@/features/curriculum/utils/roadmapMapper"
import { resolveTrackIconType } from "@/features/curriculum/tokens/roadmapTokens"


/**
 * 1:1 Headless controller hook for AppTopBar.
 * Resolves active career track metadata and user gamification HUD stats
 * directly from backend PostgreSQL endpoints via TanStack Query cache synchronization.
 */
export const useAppTopBar = (activeTrack: string) => {
  const { data } = useUser()
  const activeUser = data.user

  // 2. Fetch database-seeded career paths & tech stacks
  const { data: careerPaths = [] } = useQuery({
    queryKey: CAREER_PATHS_QUERY_KEY,
    queryFn: onboardingService.getCareerPaths,
    staleTime: 1000 * 60 * 10,
  })

  // Derived user gamification HUD stats
  const userXp = typeof activeUser?.xp === 'number' ? activeUser.xp.toLocaleString() : '0'
  const userStreak = typeof activeUser?.streak === 'number' ? activeUser.streak : 0
  const userLevel = typeof activeUser?.current_level === 'number' ? activeUser.current_level : 1
  const userGems = typeof activeUser?.gems === 'number' ? activeUser.gems : 0

  // Map database career paths into selectable track options
  const trackOptions: CareerTrackOption[] = useMemo(
    () => mapCareerPathsToTrackOptions(careerPaths, activeUser),
    [careerPaths, activeUser]
  )

  // Resolve active career track configuration from memoized options
  const currentTrackConfig: CareerTrackOption =
    trackOptions.find((t) => t.slug === activeTrack) ?? {
      id: activeTrack || 'active-track',
      slug: activeTrack,
      title: activeUser?.career_path?.label || activeTrack || 'Career Track',
      shortTitle: activeTrack || 'Track',
      subtitle: '',
      category: 'coding',
      iconType: resolveTrackIconType(activeTrack || ''),
      badgeLabel: 'Aktif',
      badgeVariant: 'active',
      isActive: true,
    }

  return {
    userXp,
    userStreak,
    userLevel,
    userGems,
    trackOptions,
    currentTrackConfig,
  }
}

