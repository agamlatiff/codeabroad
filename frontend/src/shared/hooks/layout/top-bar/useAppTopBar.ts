import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@/features/user/hooks/useUser'
import {
  languageService,
} from '@/features/curriculum/services/languageService'
import {
  LANGUAGES_QUERY_KEY,
  getLanguageEnrollmentsQueryKey,
} from '@/shared/constants/queryKeys'
import type { CareerTrackOption } from '@/features/curriculum/types/curriculum'
import { mapEnrollmentsToTrackOptions } from '@/features/curriculum/utils/curriculumMapper'
import { getSavedAvatarStyle } from '@/shared/utils/avatar'

export const useAppTopBar = (activeTrack: string) => {
  const { data } = useUser()
  const activeUser = data.user

  const { data: enrollments = [] } = useQuery({
    queryKey: getLanguageEnrollmentsQueryKey(activeUser?.id),
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    enabled: Boolean(activeUser),
    staleTime: 1000 * 60 * 5,
  })

  const { data: languages = [] } = useQuery({
    queryKey: LANGUAGES_QUERY_KEY,
    queryFn: ({ signal }) => languageService.listLanguages({ signal }),
    staleTime: 1000 * 60 * 10,
  })

  const rawXp = typeof activeUser?.xp === 'number' ? activeUser.xp : 0
  const userXp = rawXp.toLocaleString()
  const userStreak = typeof activeUser?.streak === 'number' ? activeUser.streak : 0
  const userLevel = typeof activeUser?.current_level === 'number' ? activeUser.current_level : 1
  const userGems = typeof activeUser?.gems === 'number' ? activeUser.gems : 0

  const trackOptions: CareerTrackOption[] = useMemo(
    () => mapEnrollmentsToTrackOptions(enrollments, languages),
    [enrollments, languages]
  )

  const currentTrackConfig: CareerTrackOption =
    trackOptions.find(
      (t) =>
        t.id === activeTrack ||
        t.slug === activeTrack ||
        t.languageCode === activeTrack
    ) ??
    trackOptions.find((t) => t.isActive) ?? {
      id: activeTrack || 'active-track',
      slug: activeTrack,
      title: 'Pilih Bahasa',
      shortTitle: 'Bahasa',
      subtitle: '',
      category: 'language',
      badgeLabel: 'Aktif',
      badgeVariant: 'active',
      isActive: true,
    }

  const canSwitchLanguage = enrollments.length >= 2
  const avatarStyle = getSavedAvatarStyle()

  return {
    activeUser,
    avatarStyle,
    rawXp,
    userXp,
    userStreak,
    userLevel,
    userGems,
    trackOptions,
    currentTrackConfig,
    canSwitchLanguage,
  }
}
