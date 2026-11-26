import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@/features/user/hooks/useUser'
import { languageService } from '@/features/curriculum/services/languageService'
import {
  LANGUAGES_QUERY_KEY,
  getLanguageEnrollmentsQueryKey,
} from '@/shared/constants/queryKeys'
import { getLanguageCatalogMeta } from '@/shared/constants/languageCatalog'
import type { CareerTrackOption } from '@/features/curriculum/types/curriculum'
import {
  mapEnrollmentsToTrackOptions,
  mapGuestLanguagesToTrackOptions,
} from '@/features/curriculum/utils/curriculumMapper'

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
    () =>
      activeUser
        ? mapEnrollmentsToTrackOptions(enrollments, languages)
        : mapGuestLanguagesToTrackOptions(languages, activeTrack),
    [activeTrack, activeUser, enrollments, languages]
  )

  const currentTrackConfig: CareerTrackOption =
    trackOptions.find(
      (t) =>
        t.id === activeTrack ||
        t.slug === activeTrack ||
        (t.languageCode ?? '').toLowerCase() === activeTrack.toLowerCase()
    ) ??
    trackOptions.find((t) => t.isActive) ??
    (() => {
      const normalizedActive = activeTrack.trim().toLowerCase()
      const fallbackLang =
        languages.find(
          (l) =>
            l.is_active &&
            (l.id.toLowerCase() === normalizedActive ||
              l.code.toLowerCase() === normalizedActive)
        ) ??
        languages.find((l) => l.is_active) ??
        null

      if (fallbackLang) {
        const meta = getLanguageCatalogMeta(fallbackLang.code, fallbackLang.name)
        return {
          id: fallbackLang.id,
          slug: fallbackLang.id,
          title: `Bahasa ${fallbackLang.name}`,
          shortTitle: meta.shortName,
          subtitle: `${activeUser ? 'Kurikulum' : 'Mode Coba'} • ${meta.examShort}`,
          category: 'language',
          languageCode: fallbackLang.code.toLowerCase(),
          badgeLabel: activeUser ? 'Aktif' : 'Coba',
          badgeVariant: 'active',
          isActive: true,
        }
      }

      return {
        id: activeTrack || 'guest-track',
        slug: activeTrack || 'lang',
        title: 'Kurikulum Bahasa',
        shortTitle: 'Bahasa',
        subtitle: activeUser ? 'Memuat jalur...' : 'Mode Coba',
        category: 'language',
        languageCode: '',
        badgeLabel: activeUser ? 'Aktif' : 'Coba',
        badgeVariant: 'active',
        isActive: true,
      }
    })()

  const canSwitchLanguage = trackOptions.length >= 2

  return {
    activeUser,
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
