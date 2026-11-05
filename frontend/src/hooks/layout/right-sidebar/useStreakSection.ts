import { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import { authService } from '../../../services/authService'
import { triggerHaptic } from '../../../utils/haptics'

export const ACTIVITY_LOGS_QUERY_KEY = ['activity-logs'] as const

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
  const { user } = useAuthStore()
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false)

  const { data: activitySummary = null } = useQuery({
    queryKey: ACTIVITY_LOGS_QUERY_KEY,
    queryFn: () => authService.getActivityLogs(),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

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

  const weeklyStreakDays: WeeklyStreakDayItem[] = useMemo(() => {
    if (activitySummary?.weekly_logs && activitySummary.weekly_logs.length === 7) {
      return activitySummary.weekly_logs.map((log) => ({
        label: log.day_label,
        dayIndex: log.day_index,
        isToday: log.is_today,
        isCompleted: log.is_active,
        xpEarned: log.xp_earned,
        questsCount: log.quests_count,
      }))
    }

    const jsDay = new Date().getDay()
    const todayDayIndex = jsDay === 0 ? 6 : jsDay - 1

    return DEFAULT_WEEKDAY_LABELS.map((label, dayIndex) => ({
      label,
      dayIndex,
      isToday: dayIndex === todayDayIndex,
      isCompleted: false,
      xpEarned: 0,
      questsCount: 0,
    }))
  }, [activitySummary])

  const handleOpenStreakModal = useCallback(() => {
    triggerHaptic('tap')
    setIsStreakModalOpen(true)
  }, [])

  const handleCloseStreakModal = useCallback(() => {
    setIsStreakModalOpen(false)
  }, [])

  return {
    userStreak,
    weeklyStreakDays,
    calendarActiveDates,
    isStreakModalOpen,
    handleOpenStreakModal,
    handleCloseStreakModal,
  }
}

