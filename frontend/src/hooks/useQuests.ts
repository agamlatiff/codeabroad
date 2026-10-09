import { useState, useEffect, useCallback, useMemo } from 'react'
import { questService } from '../services/questService'
import type { Quest } from '../types/quest'

export type QuestTab = 'all' | 'daily' | 'main' | 'side'

export const useQuests = () => {
  const [activeTab, setActiveTab] = useState<QuestTab>('all')
  const [allQuests, setAllQuests] = useState<Quest[]>([])
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00')

  const fetchQuests = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [questsData, dailyData] = await Promise.all([
        questService.listQuests(),
        questService.getDailyQuests(),
      ])
      setAllQuests(questsData)
      setDailyQuests(dailyData)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat daftar misi'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuests()
  }, [fetchQuests])

  // Countdown timer to midnight JST / WIB
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      // Midnight in JST (UTC+9)
      const jstNow = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60 * 1000)
      const jstMidnight = new Date(jstNow)
      jstMidnight.setHours(24, 0, 0, 0)
      const diffMs = jstMidnight.getTime() - jstNow.getTime()

      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

      const pad = (n: number) => n.toString().padStart(2, '0')
      setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  // Filtered quests based on current tab
  const filteredQuests = useMemo(() => {
    if (activeTab === 'daily') {
      return dailyQuests
    }
    if (activeTab === 'main') {
      return allQuests.filter((q) => q.type === 'main')
    }
    if (activeTab === 'side') {
      return allQuests.filter((q) => q.type === 'side')
    }
    return allQuests
  }, [activeTab, allQuests, dailyQuests])

  const completedCount = useMemo(() => {
    return allQuests.filter((q) => q.user_status === 'completed').length
  }, [allQuests])

  return {
    activeTab,
    setActiveTab,
    quests: filteredQuests,
    dailyQuests,
    timeLeft,
    completedCount,
    totalCount: allQuests.length,
    isLoading,
    error,
    refetch: fetchQuests,
  }
}
