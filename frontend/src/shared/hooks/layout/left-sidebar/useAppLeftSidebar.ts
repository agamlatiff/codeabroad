import { useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Brain,
  SquaresFour,
  Target,
  Trophy,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { useAuthStore } from "@/features/auth/store/authStore"
import { useLogout } from "@/features/auth/hooks/useLogout"
import {
  getProfileQueryKey,
  getSrsDueQueryKey,
} from '@/shared/constants/queryKeys'
import { exerciseService } from '@/features/exercise/services/exerciseService'
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

  const srsDueQuery = useQuery({
    queryKey: getSrsDueQueryKey(user?.id, 20),
    queryFn: ({ signal }) => exerciseService.getDueReviews(20, { signal }),
    enabled: Boolean(user),
    staleTime: 60_000,
    retry: false,
  })

  const srsDueCount = srsDueQuery.data?.total_due ?? 0

  const navItems: LeftSidebarNavItem[] = useMemo(() => {
    const rawItems = [
      {
        label: 'Belajar',
        tooltip: 'Belajar • Peta & Silabus',
        href: '/curriculum',
        icon: SquaresFour,
      },
      {
        label: 'Ulasan',
        tooltip:
          srsDueCount > 0
            ? `Ulasan SRS • ${srsDueCount} kartu jatuh tempo`
            : 'Ulasan SRS • Memori Harian',
        href: '/review',
        icon: Brain,
        hasBadge: srsDueCount > 0,
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
          location.pathname.startsWith('/curriculum')),
    }))
  }, [location.pathname, srsDueCount])

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
