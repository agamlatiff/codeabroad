import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserActivity } from "@/features/user/hooks/useUserActivity"
import { useDailyRewards } from "@/features/user/hooks/useDailyRewards"
import { triggerHaptic } from "@/shared/utils/haptics"
import { getWibMidnightCountdown } from '@/shared/utils/date'
import { DAILY_QUESTS_QUERY_KEY } from '@/shared/constants/queryKeys'

export { DAILY_QUESTS_QUERY_KEY }

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
  isLanguageReviewed: boolean
  onFocusLanguageCard: () => void
  onClaimChestReward: (e?: React.MouseEvent) => void
}

/**
 * 1:1 Headless controller hook for QuestsSection in AppRightSidebar.
 * Isolates the 1-second WIB countdown timer so only this section re-renders every second,
 * and computes daily XP progress, actionable quests, and ChestModal state.
 */
export const useQuestsSection = ({
  isLanguageReviewed,
  onFocusLanguageCard,
  onClaimChestReward,
}: UseQuestsSectionOptions) => {
  const navigate = useNavigate()

  const [timeLeft, setTimeLeft] = useState('00:00:00')
  const [isChestModalOpen, setIsChestModalOpen] = useState(false)

  // Countdown timer to midnight WIB / Waktu Indonesia Barat (UTC+7)
  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(getWibMidnightCountdown())
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  const { data: activityData } = useUserActivity()
  const activitySummary = activityData.activitySummary

  const { data: rewardsData } = useDailyRewards()
  const dailyRewardsStatus = rewardsData.dailyRewardsStatus

  const dailyQuests: Array<{
    id: string
    title: string
    chip_label?: string
    xp_reward?: number
    user_status?: string
  }> = useMemo(() => [], [])

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
    const languageMission: SidebarDailyQuestItem = {
      id: 'language-daily-vocab',
      title: 'Review 1 Kosakata Harian',
      chipLabel: 'KOSAKATA KERJA',
      route: '#daily-language-card',
      xpReward: VOCAB_QUEST_REWARD_XP,
      isLanguage: true,
      status: isVocabQuestClaimed
        ? 'completed'
        : isLanguageReviewed
          ? 'ready_to_claim'
          : 'available',
    }

    const mappedApiQuests: SidebarDailyQuestItem[] = dailyQuests.slice(0, 2).map((q) => {
      const lowerTitle = q.title.toLowerCase()
      const isLang =
        q.id.includes('nihongo') ||
        q.id.includes('language') ||
        lowerTitle.includes('kosakata') ||
        lowerTitle.includes('bahasa')

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

    return [...mappedApiQuests, languageMission]
  }, [dailyQuests, isVocabQuestClaimed, isLanguageReviewed])

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
        onFocusLanguageCard()
      } else {
        navigate(quest.route)
      }
    },
    [navigate, onFocusLanguageCard]
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
