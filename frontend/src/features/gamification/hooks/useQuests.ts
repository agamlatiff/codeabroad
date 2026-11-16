import { useState, useEffect, useCallback } from 'react'
import { getWibMidnightCountdown } from "@/shared/utils/date"

export type QuestTab = 'all' | 'daily' | 'main' | 'side'

export interface QuestSummaryItem {
  id: string
  title: string
  type: 'main' | 'side' | 'daily' | 'boss'
  chip_label: string
  difficulty: string
  estimated_minutes: number
  xp_reward: number
  user_status: 'locked' | 'available' | 'completed'
}

export const useQuests = () => {
  const [activeTab, setActiveTab] = useState<QuestTab>('all')
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00')

  const fetchQuests = useCallback(async () => {
    // Daily & milestone quests are derived from user activity and gamification status
  }, [])

  // Countdown timer to midnight WIB (UTC+7)
  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(getWibMidnightCountdown())
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  return {
    activeTab,
    setActiveTab,
    quests: [] as QuestSummaryItem[],
    allQuests: [] as QuestSummaryItem[],
    dailyQuests: [] as QuestSummaryItem[],
    completedCount: 0,
    totalCount: 0,
    isLoading: false,
    error: null as string | null,
    timeLeft,
    refresh: fetchQuests,
  }
}
