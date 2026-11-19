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
  getProfileQueryKey,
} from '@/shared/constants/queryKeys'
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

  const flashcardDueCount = flashcardDueQuery.data?.total_due ?? 0

  const navItems: LeftSidebarNavItem[] = useMemo(() => {
    const rawItems = [
      {
        label: 'Belajar',
        tooltip: 'Belajar • Peta Belajar',
        href: '/curriculum',
        icon: SquaresFour,
      },
      {
        label: 'Aksara',
        tooltip: 'Aksara • Hiragana & Katakana',
        href: '/kana',
        icon: Translate,
      },
      {
        label: 'Grammar',
        tooltip: 'Panduan Grammar',
        href: '/grammar',
        icon: BookOpenText,
      },
      {
        label: 'Flashcard',
        tooltip:
          flashcardDueCount > 0
            ? `Flashcard • ${flashcardDueCount} kartu jatuh tempo`
            : 'Flashcard • Belajar & Ulasan Kosakata',
        href: '/flashcards',
        icon: Cards,
        hasBadge: flashcardDueCount > 0,
      },
      {
        label: 'Misi',
        tooltip: 'Misi • Hadiah Harian & XP',
        href: '/quests',
        icon: Target,
        hasBadge: true,
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
          location.pathname.startsWith('/curriculum')) ||
        (item.href === '/kana' &&
          location.pathname.startsWith('/kana')) ||
        (item.href === '/grammar' &&
          location.pathname.startsWith('/grammar')) ||
        (item.href === '/flashcards' &&
          (location.pathname === '/review' || location.pathname === '/flashcard')),
    }))
  }, [location.pathname, flashcardDueCount])

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
