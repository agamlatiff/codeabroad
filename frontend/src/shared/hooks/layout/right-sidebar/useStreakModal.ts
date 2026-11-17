import { useState, useMemo, useCallback } from 'react'
import { triggerHaptic } from '@/shared/utils/haptics'
import { soundEngine } from '@/shared/utils/audio'
import { getWibDateKey } from '@/shared/utils/date'

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

const getWibCalendarToday = () => {
  const wibKey = getWibDateKey()
  const [y, m, d] = wibKey.split('-').map(Number)
  return { year: y, month: m - 1, day: d, key: wibKey }
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

export const useStreakModal = ({
  currentStreak,
  activeDates = [],
}: UseStreakModalOptions) => {
  const wibToday = useMemo(() => getWibCalendarToday(), [])
  const [currentViewDate, setCurrentViewDate] = useState(
    () => new Date(wibToday.year, wibToday.month, 1)
  )

  const year = currentViewDate.getFullYear()
  const month = currentViewDate.getMonth()
  const monthLabel = `${MONTH_NAMES[month]} ${year}`
  const isCurrentMonth = year === wibToday.year && month === wibToday.month

  const todayStr = wibToday.key

  const activeDateSet = useMemo(() => {
    const set = new Set<string>()
    activeDates.forEach((d) => set.add(d))
    if (currentStreak > 0) {
      const baseMs = Date.UTC(wibToday.year, wibToday.month, wibToday.day)
      for (let i = 0; i < currentStreak; i++) {
        const dt = new Date(baseMs - i * 86400000)
        set.add(
          formatYMD(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate())
        )
      }
    }
    return set
  }, [activeDates, currentStreak, wibToday])

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
        year < wibToday.year ||
        (year === wibToday.year && month < wibToday.month) ||
        (year === wibToday.year && month === wibToday.month && d < wibToday.day)
      const isFuture =
        year > wibToday.year ||
        (year === wibToday.year && month > wibToday.month) ||
        (year === wibToday.year && month === wibToday.month && d > wibToday.day)

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
  }, [year, month, activeDateSet, wibToday, todayStr])

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
    const today = getWibCalendarToday()
    setCurrentViewDate(new Date(today.year, today.month, 1))
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

