import { useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  SquaresFour,
  Target,
  Trophy,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { useAuthStore } from "@/features/auth/store/authStore"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { triggerHaptic } from "@/shared/utils/haptics"
import type { AvatarStyle } from "@/features/user/utils/avatar"
import { PROFILE_QUERY_KEY } from "@/features/user/services/userService"

export interface LeftSidebarNavItem {
  label: string
  tooltip: string
  href: string
  icon: Icon
  hasBadge?: boolean
  isActive: boolean
}

/**
 * 1:1 Headless controller hook for AppLeftSidebar.
 * Manages navigation rail items, active route matching, avatar style state,
 * account settings modal visibility, and session sign-out.
 */
export const useAppLeftSidebar = () => {
  const location = useLocation()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const logout = useLogout()

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [avatarStyle, setAvatarStyleState] = useState<AvatarStyle>('adventurer')

  const navItems: LeftSidebarNavItem[] = useMemo(() => {
    const rawItems = [
      {
        label: 'Belajar',
        tooltip: 'Belajar • Peta & Silabus',
        href: '/curriculum',
        icon: SquaresFour,
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
        tooltip: 'Peringkat • Liga Tokyo',
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
  }, [location.pathname])

  const handleAvatarStyleChange = useCallback((style: AvatarStyle) => {
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
    void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
  }, [queryClient])

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

