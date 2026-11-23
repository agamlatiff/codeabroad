import { useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BookOpenText,
  Cards,
  SquaresFour,
  Target,
  Translate,
  Trophy,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { useAuthStore } from "@/features/auth/store/authStore"
import { useLogout } from "@/features/auth/hooks/useLogout"
import {
  getDailyQuestsQueryKey,
  getProfileQueryKey,
  LEADERBOARD_QUERY_KEY,
} from '@/shared/constants/queryKeys'
import {
  gamificationService,
  GAMIFICATION_STATUS_QUERY_KEY,
} from '@/features/gamification/services/gamificationService'
import {
  flashcardService,
  FLASHCARD_DUE_QUERY_KEY,
} from '@/features/flashcard/services/flashcardService'
import { triggerHaptic } from '@/shared/utils/haptics'
import {
  getSavedAvatarStyle,
  saveAvatarStyle,
  type AvatarStyle,
} from '@/shared/utils/avatar'

export interface LeftSidebarNavItem {
  label: string
  tooltip: string
  href: string
  icon: Icon
  hasBadge?: boolean
  isActive: boolean
  tourId?: string
}

export const useAppLeftSidebar = () => {
  const location = useLocation()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [avatarStyle, setAvatarStyleState] = useState<AvatarStyle>(() => getSavedAvatarStyle())

  const flashcardDueQuery = useQuery({
    queryKey: [...FLASHCARD_DUE_QUERY_KEY, user?.id ?? 'anonymous', 'ja', 'sidebar'],
    queryFn: ({ signal }) => flashcardService.getDueQueue('ja', 20, { signal }),
    enabled: Boolean(user),
    staleTime: 60_000,
    retry: false,
  })

  const dailyQuestsQuery = useQuery({
    queryKey: getDailyQuestsQueryKey(user?.id),
    queryFn: ({ signal }) => gamificationService.getDailyQuests({ signal }),
    enabled: Boolean(user),
    staleTime: 60_000,
    retry: false,
  })

  const gamificationStatusQuery = useQuery({
    queryKey: [...GAMIFICATION_STATUS_QUERY_KEY, user?.id ?? 'anonymous'],
    queryFn: ({ signal }) => gamificationService.getStatus({ signal }),
    enabled: Boolean(user),
    staleTime: 60_000,
    retry: false,
  })

  const flashcardDueCount = flashcardDueQuery.data?.total_due ?? 0

  const hasQuestsBadge = useMemo(() => {
    const quests = dailyQuestsQuery.data ?? []
    const status = gamificationStatusQuery.data
    const hasClaimableQuest = quests.some((q) => q.is_completed && !q.is_claimed)
    const dailyDoneCount = quests.filter((q) => q.is_completed).length
    const claimedChests = status?.claimed_chests ?? []
    const hasUnclaimedChest = [1, 2, 3].some(
      (tier) => dailyDoneCount >= tier && !claimedChests.includes(tier)
    )
    const hasClaimableMonthly =
      Boolean(status) &&
      !status?.monthly_badge_claimed &&
      (status?.monthly_completed_count ?? 0) >= (status?.monthly_target_count ?? 25)
    return hasClaimableQuest || hasUnclaimedChest || hasClaimableMonthly
  }, [dailyQuestsQuery.data, gamificationStatusQuery.data])

  const navItems: LeftSidebarNavItem[] = useMemo(() => {
    const rawItems = [
      {
        label: 'Belajar',
        tooltip: 'Peta Belajar • Alur Utama',
        href: '/curriculum',
        icon: SquaresFour,
      },
      {
        label: 'Aksara',
        tooltip: 'Langkah 1 • Hiragana, Katakana & Kanji',
        href: '/kana/hiragana',
        icon: Translate,
        tourId: 'nav-kana',
      },
      {
        label: 'Flashcard',
        tooltip:
          flashcardDueCount > 0
            ? `Langkah 2 • Flashcard (${flashcardDueCount} kartu jatuh tempo)`
            : 'Langkah 2 • Kartu Huruf & Kosakata',
        href: '/flashcards',
        icon: Cards,
        hasBadge: flashcardDueCount > 0,
        tourId: 'nav-flashcards',
      },
      {
        label: 'Grammar',
        tooltip: 'Langkah 3 • Pola & Rumus Kalimat',
        href: '/grammar',
        icon: BookOpenText,
        tourId: 'nav-grammar',
      },
      {
        label: 'Misi',
        tooltip: 'Misi • Hadiah Harian & XP',
        href: '/quests',
        icon: Target,
        hasBadge: hasQuestsBadge,
      },
      {
        label: 'Peringkat',
        tooltip: 'Peringkat • Liga Global',
        href: '/leaderboard',
        icon: Trophy,
      },
    ]

    return rawItems.map((item) => ({
      ...item,
      isActive:
        location.pathname === item.href ||
        (item.href === '/curriculum' &&
          (location.pathname.startsWith('/curriculum') || location.pathname === '/review')) ||
        (item.href.startsWith('/kana') &&
          location.pathname.startsWith('/kana')) ||
        (item.href === '/grammar' &&
          location.pathname.startsWith('/grammar')) ||
        (item.href === '/flashcards' && location.pathname === '/flashcard'),
    }))
  }, [location.pathname, flashcardDueCount, hasQuestsBadge])

  const handleAvatarStyleChange = useCallback((style: AvatarStyle) => {
    saveAvatarStyle(style)
    setAvatarStyleState(style)
  }, [])

  const handleOpenSettings = useCallback(() => {
    triggerHaptic('tap')
    setIsSettingsOpen(true)
  }, [])

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false)
  }, [])

  const handleProfileUpdated = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: getProfileQueryKey(user?.id) })
    void queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY })
  }, [queryClient, user?.id])

  const handleLogout = useCallback(() => {
    triggerHaptic('tap')
    void logout()
  }, [logout])

  return {
    user,
    navItems,
    avatarStyle,
    isSettingsOpen,
    handleAvatarStyleChange,
    handleOpenSettings,
    handleCloseSettings,
    handleProfileUpdated,
    handleLogout,
  }
}
