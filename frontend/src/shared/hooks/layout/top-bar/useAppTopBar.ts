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
import { useActiveLanguageId } from '@/features/exercise/hooks/useActiveSpeechLocale'

export const useAppTopBar = (activeTrack: string) => {
  const { data } = useUser()
  const activeUser = data.user
  const resolvedActiveLanguageId = useActiveLanguageId()
  const effectiveTrack = (activeTrack || resolvedActiveLanguageId || '').trim()

  const { data: enrollments = [], isLoading: isEnrollmentsLoading } = useQuery({
    queryKey: getLanguageEnrollmentsQueryKey(activeUser?.id),
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    enabled: Boolean(activeUser),
    staleTime: 1000 * 60 * 5,
  })

  const { data: languages = [], isLoading: isLanguagesLoading } = useQuery({
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
        : mapGuestLanguagesToTrackOptions(languages, effectiveTrack),
    [activeUser, effectiveTrack, enrollments, languages]
  )

  const currentTrackConfig: CareerTrackOption =
    trackOptions.find(
      (t) =>
        t.id === effectiveTrack ||
        t.slug === effectiveTrack ||
        (t.languageCode ?? '').toLowerCase() === effectiveTrack.toLowerCase()
    ) ??
    trackOptions.find((t) => t.isActive) ??
    (() => {
      const normalizedActive = effectiveTrack.trim().toLowerCase()
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
        id: effectiveTrack || 'guest-track',
        slug: effectiveTrack || 'lang',
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
    isTrackLoading: isLanguagesLoading || (Boolean(activeUser) && isEnrollmentsLoading),
  }
}
