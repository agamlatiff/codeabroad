import { useState, useMemo, useCallback } from 'react'
import { triggerHaptic } from "@/shared/utils/haptics"
import { soundEngine } from "@/shared/utils/audio"

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const

export const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'] as const

const formatYMD = (y: number, m: number, d: number): string => {
  const mm = String(m + 1).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

export interface CalendarDayCell {
  dayNumber: number
  dateStr: string
  isActive: boolean
  isToday: boolean
  isPast: boolean
  isFuture: boolean
}

export interface UseStreakModalOptions {
  currentStreak: number
  activeDates?: string[]
}

/**
 * 1:1 Headless controller hook for StreakModal in AppRightSidebar.
 * Computes calendar grid cells, real streak statistics, and month navigation.
 */
export const useStreakModal = ({
  currentStreak,
  activeDates = [],
}: UseStreakModalOptions) => {
  const today = useMemo(() => new Date(), [])
  const [currentViewDate, setCurrentViewDate] = useState(() => new Date())

  const year = currentViewDate.getFullYear()
  const month = currentViewDate.getMonth()
  const monthLabel = `${MONTH_NAMES[month]} ${year}`
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  const todayStr = useMemo(
    () => formatYMD(today.getFullYear(), today.getMonth(), today.getDate()),
    [today]
  )

  const activeDateSet = useMemo(() => {
    const set = new Set<string>()
    activeDates.forEach((d) => set.add(d))
    if (currentStreak > 0) {
      for (let i = 0; i < currentStreak; i++) {
        const streakDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
        set.add(formatYMD(streakDate.getFullYear(), streakDate.getMonth(), streakDate.getDate()))
      }
    }
    return set
  }, [activeDates, currentStreak, today])

  const { startOffset, daysList } = useMemo(() => {
    const totalDays = new Date(year, month + 1, 0).getDate()
    const firstDayIndex = new Date(year, month, 1).getDay()
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1

    const list: CalendarDayCell[] = []
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = formatYMD(year, month, d)
      const isActive = activeDateSet.has(dateStr)
      const isToday = dateStr === todayStr
      const isPast =
        year < today.getFullYear() ||
        (year === today.getFullYear() && month < today.getMonth()) ||
        (year === today.getFullYear() && month === today.getMonth() && d < today.getDate())
      const isFuture =
        year > today.getFullYear() ||
        (year === today.getFullYear() && month > today.getMonth()) ||
        (year === today.getFullYear() && month === today.getMonth() && d > today.getDate())

      list.push({
        dayNumber: d,
        dateStr,
        isActive,
        isToday,
        isPast,
        isFuture,
      })
    }

    return { startOffset: offset, daysList: list }
  }, [year, month, activeDateSet, today, todayStr])

  const activeDaysInMonth = useMemo(
    () => daysList.filter((d) => d.isActive).length,
    [daysList]
  )

  const longestStreak = Math.max(currentStreak, activeDateSet.size)

  const handlePrevMonth = useCallback(() => {
    triggerHaptic('tap')
    soundEngine.playPop()
    setCurrentViewDate(new Date(year, month - 1, 1))
  }, [year, month])

  const handleNextMonth = useCallback(() => {
    triggerHaptic('tap')
    soundEngine.playPop()
    setCurrentViewDate(new Date(year, month + 1, 1))
  }, [year, month])

  const handleResetToToday = useCallback(() => {
    triggerHaptic('tap')
    soundEngine.playPop()
    setCurrentViewDate(new Date())
  }, [])

  return {
    monthLabel,
    isCurrentMonth,
    dayLabels: DAY_LABELS,
    startOffset,
    daysList,
    activeDaysInMonth,
    longestStreak,
    handlePrevMonth,
    handleNextMonth,
    handleResetToToday,
  }
}

