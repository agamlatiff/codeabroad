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

const parseDayOrdinal = (dateStr: string): number | null => {
  const parts = dateStr.split('-')
  if (parts.length !== 3) return null
  const [y, m, d] = parts.map(Number)
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000)
}

const computeLongestConsecutiveRun = (dates: ReadonlySet<string>): number => {
  const ordinals: number[] = []
  for (const dt of dates) {
    const ord = parseDayOrdinal(dt)
    if (ord !== null) ordinals.push(ord)
  }
  if (ordinals.length === 0) return 0
  ordinals.sort((a, b) => a - b)

  let longest = 1
  let run = 1
  for (let i = 1; i < ordinals.length; i++) {
    const diff = ordinals[i] - ordinals[i - 1]
    if (diff === 0) continue
    if (diff === 1) {
      run += 1
      if (run > longest) longest = run
    } else {
      run = 1
    }
  }
  return longest
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
    activeDates.forEach((d) => {
      if (d) set.add(d)
    })
    return set
  }, [activeDates])

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

  const longestStreak = useMemo(
    () => Math.max(currentStreak, computeLongestConsecutiveRun(activeDateSet)),
    [activeDateSet, currentStreak]
  )

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

