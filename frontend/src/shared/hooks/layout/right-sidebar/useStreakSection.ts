import { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUser } from "@/features/user/hooks/useUser"
import { useUserActivity } from "@/features/user/hooks/useUserActivity"
import {
  gamificationService,
  GAMIFICATION_STATUS_QUERY_KEY,
} from '@/features/gamification/services/gamificationService'
import { triggerHaptic } from "@/shared/utils/haptics"

const DEFAULT_WEEKDAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'] as const

export interface WeeklyStreakDayItem {
  label: string
  dayIndex: number
  isToday: boolean
  isCompleted: boolean
  xpEarned: number
  questsCount: number
}

/**
 * 1:1 Headless controller hook for StreakSection in AppRightSidebar.
 * Fetches 7-day activity logs from PostgreSQL via TanStack Query and manages
 * the StreakModal visibility.
 */
export const useStreakSection = () => {
  const { data: userData } = useUser()
  const user = userData.user
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false)

  const { data: activityData, status: activityStatus } = useUserActivity()
  const activitySummary = activityData.activitySummary

  const { data: gamificationStatus } = useQuery({
    queryKey: [...GAMIFICATION_STATUS_QUERY_KEY, user?.id ?? 'anonymous'],
    queryFn: ({ signal }) => gamificationService.getStatus({ signal }),
    enabled: Boolean(user?.id),
    staleTime: 1000 * 60 * 2,
    retry: false,
  })
  const streakFreezeCount = gamificationStatus?.inventory?.['streak-freeze'] ?? 0

  const userStreak =
    activitySummary?.current_streak ?? (typeof user?.streak === 'number' ? user.streak : 0)

  const calendarActiveDates = useMemo(() => {
    const dates = new Set<string>()
    if (activitySummary?.active_dates) {
      activitySummary.active_dates.forEach((d) => dates.add(d))
    }
    if (activitySummary?.weekly_logs) {
      activitySummary.weekly_logs.forEach((log) => {
        if (log.is_active && log.date) {
          dates.add(log.date)
        }
      })
    }
    return Array.from(dates)
  }, [activitySummary])

  const [todayDayIndex] = useState(() => {
    const wibNow = new Date(Date.now() + 7 * 60 * 60 * 1000)
    const jsDay = wibNow.getUTCDay()
    return jsDay === 0 ? 6 : jsDay - 1
  })

  const weeklyStreakDays: WeeklyStreakDayItem[] = useMemo(() => {
    if (activitySummary?.weekly_logs && activitySummary.weekly_logs.length === 7) {
      return activitySummary.weekly_logs.map((log) => ({
        label: log.day_label,
        dayIndex: log.day_index,
        isToday: log.is_today,
        isCompleted: log.is_active,
        xpEarned: log.xp_earned,
        questsCount: log.lessons_count ?? 0,
      }))
    }

    return DEFAULT_WEEKDAY_LABELS.map((label, dayIndex) => ({
      label,
      dayIndex,
      isToday: dayIndex === todayDayIndex,
      isCompleted: false,
      xpEarned: 0,
      questsCount: 0,
    }))
  }, [activitySummary, todayDayIndex])

  const handleOpenStreakModal = useCallback(() => {
    triggerHaptic('tap')
    setIsStreakModalOpen(true)
  }, [])

  const handleCloseStreakModal = useCallback(() => {
    setIsStreakModalOpen(false)
  }, [])

  return {
    userStreak,
    streakFreezeCount,
    weeklyStreakDays,
    calendarActiveDates,
    isLoading: Boolean(user) && activityStatus.isLoading && !activitySummary,
    isStreakModalOpen,
    handleOpenStreakModal,
    handleCloseStreakModal,
  }
}
