import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUser } from "@/features/user/hooks/useUser"
import { onboardingService, CAREER_PATHS_QUERY_KEY } from "@/features/onboarding/services/onboardingService"
import {
  languageService,
  LANGUAGES_QUERY_KEY,
  LANGUAGE_ENROLLMENTS_QUERY_KEY,
} from "@/features/curriculum/services/languageService"
import type { CareerTrackOption } from "@/features/curriculum/types/curriculum"
import {
  mapCareerPathsToTrackOptions,
  mapEnrollmentsToTrackOptions,
} from "@/features/curriculum/utils/curriculumMapper"
import { resolveTrackIconType } from "@/features/curriculum/tokens/curriculumTokens"

/**
 * 1:1 Headless controller hook for AppTopBar.
 * Resolves active target language (or career track) metadata and user gamification HUD stats
 * directly from backend endpoints via TanStack Query cache synchronization.
 */
export const useAppTopBar = (activeTrack: string) => {
  const { data } = useUser()
  const activeUser = data.user

  const { data: enrollments = [], isLoading: isLoadingEnrollments } = useQuery({
    queryKey: LANGUAGE_ENROLLMENTS_QUERY_KEY,
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    staleTime: 1000 * 60 * 5,
  })

  const { data: languages = [] } = useQuery({
    queryKey: LANGUAGES_QUERY_KEY,
    queryFn: ({ signal }) => languageService.listLanguages({ signal }),
    staleTime: 1000 * 60 * 10,
  })

  const { data: careerPaths = [] } = useQuery({
    queryKey: CAREER_PATHS_QUERY_KEY,
    queryFn: onboardingService.getCareerPaths,
    enabled: !isLoadingEnrollments && enrollments.length === 0,
    staleTime: 1000 * 60 * 10,
  })

  const userXp = typeof activeUser?.xp === 'number' ? activeUser.xp.toLocaleString() : '0'
  const userStreak = typeof activeUser?.streak === 'number' ? activeUser.streak : 0
  const userLevel = typeof activeUser?.current_level === 'number' ? activeUser.current_level : 1
  const userGems = typeof activeUser?.gems === 'number' ? activeUser.gems : 0

  const languageOptions: CareerTrackOption[] = useMemo(
    () => mapEnrollmentsToTrackOptions(enrollments, languages),
    [enrollments, languages]
  )

  const careerOptions: CareerTrackOption[] = useMemo(
    () => mapCareerPathsToTrackOptions(careerPaths, activeUser),
    [careerPaths, activeUser]
  )

  const trackOptions = languageOptions.length > 0 ? languageOptions : careerOptions

  const currentTrackConfig: CareerTrackOption =
    languageOptions.find((t) => t.id === activeTrack || t.slug === activeTrack) ??
    careerOptions.find((t) => t.slug === activeTrack) ??
    (activeTrack === '' ? languageOptions.find((t) => t.isActive) : undefined) ?? {
      id: activeTrack || 'active-track',
      slug: activeTrack,
      title: activeUser?.career_path?.label || 'Pilih Bahasa',
      shortTitle: activeUser?.career_path?.label || 'Bahasa',
      subtitle: '',
      category: 'language',
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
