import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import { authService } from '../../../services/authService'
import { questService } from '../../../services/questService'
import { triggerHaptic } from '../../../utils/haptics'
import { ACTIVITY_LOGS_QUERY_KEY } from './useStreakSection'

export const DAILY_REWARDS_QUERY_KEY = ['daily-rewards'] as const
export const DAILY_QUESTS_QUERY_KEY = ['daily-quests'] as const

export const DAILY_TARGET_XP = 50
export const VOCAB_QUEST_REWARD_XP = 30
export const GOLDEN_CHEST_REWARD_XP = 50

export interface SidebarDailyQuestItem {
  id: string
  title: string
  chipLabel: string
  route: string
  xpReward: number
  isLanguage: boolean
  status: 'completed' | 'available' | 'ready_to_claim'
}

export interface UseQuestsSectionOptions {
  isNihongoReviewed: boolean
  onFocusNihongoCard: () => void
  onClaimChestReward: (e?: React.MouseEvent) => void
}

/**
 * 1:1 Headless controller hook for QuestsSection in AppRightSidebar.
 * Isolates the 1-second JST countdown timer so only this section re-renders every second,
 * and computes daily XP progress, actionable quests, and ChestModal state.
 */
export const useQuestsSection = ({
  isNihongoReviewed,
  onFocusNihongoCard,
  onClaimChestReward,
}: UseQuestsSectionOptions) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [timeLeft, setTimeLeft] = useState('00:00:00')
  const [isChestModalOpen, setIsChestModalOpen] = useState(false)

  // Countdown timer to midnight WIB / Waktu Indonesia Barat (UTC+7)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const wibNow = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60 * 1000)
      const wibMidnight = new Date(wibNow)
      wibMidnight.setHours(24, 0, 0, 0)
      const diffMs = wibMidnight.getTime() - wibNow.getTime()

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

  const { data: activitySummary = null } = useQuery({
    queryKey: ACTIVITY_LOGS_QUERY_KEY,
    queryFn: () => authService.getActivityLogs(),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

  const { data: dailyRewardsStatus = null } = useQuery({
    queryKey: DAILY_REWARDS_QUERY_KEY,
    queryFn: () => authService.getDailyRewardsStatus(),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

  const { data: dailyQuests = [] } = useQuery({
    queryKey: DAILY_QUESTS_QUERY_KEY,
    queryFn: () => questService.getDailyQuests(),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

  const isVocabQuestClaimed = Boolean(dailyRewardsStatus?.vocab_quest_claimed)
  const isChestClaimedToday = Boolean(dailyRewardsStatus?.golden_chest_claimed)

  const todayEarnedXp = useMemo(() => {
    const todayLogXp =
      activitySummary?.weekly_logs?.find((log) => log.is_today)?.xp_earned ?? 0
    const completedQuestsXp = dailyQuests
      .filter((q) => q.user_status === 'completed')
      .reduce((sum, q) => sum + (q.xp_reward || 0), 0)
    const vocabClaimXp = isVocabQuestClaimed ? VOCAB_QUEST_REWARD_XP : 0

    return Math.max(todayLogXp, completedQuestsXp + vocabClaimXp)
  }, [activitySummary, dailyQuests, isVocabQuestClaimed])

  const dailyProgressPercent = Math.min(
    100,
    Math.round((todayEarnedXp / DAILY_TARGET_XP) * 100)
  )
  const isChestUnlocked = todayEarnedXp >= DAILY_TARGET_XP
  const remainingXp = Math.max(0, DAILY_TARGET_XP - todayEarnedXp)

  const activeQuests: SidebarDailyQuestItem[] = useMemo(() => {
    const nihongoMission: SidebarDailyQuestItem = {
      id: 'nihongo-daily-vocab',
      title: 'Review 1 Kosakata Standup Tokyo',
      chipLabel: 'STANDUP IT',
      route: '#tech-nihongo-card',
      xpReward: VOCAB_QUEST_REWARD_XP,
      isLanguage: true,
      status: isVocabQuestClaimed
        ? 'completed'
        : isNihongoReviewed
          ? 'ready_to_claim'
          : 'available',
    }

    const mappedApiQuests: SidebarDailyQuestItem[] = dailyQuests.slice(0, 2).map((q) => {
      const lowerTitle = q.title.toLowerCase()
      const isLang =
        q.id.includes('nihongo') ||
        lowerTitle.includes('kosakata') ||
        lowerTitle.includes('jepang')

      return {
        id: q.id,
        title: q.title,
        chipLabel: q.chip_label || 'MISI HARIAN',
        route: `/learn/${q.id}`,
        xpReward: q.xp_reward || VOCAB_QUEST_REWARD_XP,
        isLanguage: isLang,
        status: q.user_status === 'completed' ? 'completed' : 'available',
      }
    })

    return [...mappedApiQuests, nihongoMission]
  }, [dailyQuests, isVocabQuestClaimed, isNihongoReviewed])

  const handleOpenChestModal = useCallback(() => {
    triggerHaptic('tap')
    setIsChestModalOpen(true)
  }, [])

  const handleCloseChestModal = useCallback(() => {
    setIsChestModalOpen(false)
  }, [])

  const handleConfirmClaimChest = useCallback(
    (e?: React.MouseEvent) => {
      if (!isChestUnlocked || isChestClaimedToday) return
      setIsChestModalOpen(false)
      onClaimChestReward(e)
    },
    [isChestUnlocked, isChestClaimedToday, onClaimChestReward]
  )

  const handleQuestAction = useCallback(
    (quest: SidebarDailyQuestItem) => {
      triggerHaptic('tap')
      if (quest.isLanguage) {
        onFocusNihongoCard()
      } else {
        navigate(quest.route)
      }
    },
    [navigate, onFocusNihongoCard]
  )

  return {
    timeLeft,
    dailyTargetXp: DAILY_TARGET_XP,
    todayEarnedXp,
    dailyProgressPercent,
    isChestUnlocked,
    isChestClaimedToday,
    remainingXp,
    activeQuests,
    isChestModalOpen,
    handleOpenChestModal,
    handleCloseChestModal,
    handleConfirmClaimChest,
    handleQuestAction,
  }
}

