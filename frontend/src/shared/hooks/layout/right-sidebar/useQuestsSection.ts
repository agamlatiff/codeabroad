import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserActivity } from '@/features/user/hooks/useUserActivity'
import { useDailyRewards } from '@/features/user/hooks/useDailyRewards'
import { triggerHaptic } from '@/shared/utils/haptics'
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
  progressText: string
  route: string
  xpReward: number
  isLanguage: boolean
  status: 'completed' | 'available' | 'ready_to_claim'
}

export interface UseQuestsSectionOptions {
  onClaimChestReward: (e?: React.MouseEvent) => void
}

/**
 * 1:1 Headless controller hook for QuestsSection in AppRightSidebar.
 * Derives daily XP progress and the 3 actionable quests directly from backend activity logs
 * and flashcard review milestones.
 */
export const useQuestsSection = ({
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

  const todayLog = useMemo(
    () => activitySummary?.weekly_logs?.find((log) => log.is_today),
    [activitySummary]
  )

  const isVocabQuestClaimed = Boolean(dailyRewardsStatus?.vocab_quest_claimed)
  const isChestClaimedToday = Boolean(dailyRewardsStatus?.golden_chest_claimed)
  const todayFlashcardsReviewed = dailyRewardsStatus?.today_flashcards_reviewed ?? 0
  const vocabQuestTarget = dailyRewardsStatus?.vocab_quest_target ?? 3
  const isVocabQuestUnlocked =
    Boolean(dailyRewardsStatus?.vocab_quest_unlocked) ||
    todayFlashcardsReviewed >= vocabQuestTarget

  const todayLessonsCompleted = todayLog?.lessons_count ?? 0

  const todayEarnedXp = useMemo(() => {
    const todayLogXp = todayLog?.xp_earned ?? 0
    const vocabClaimXp = isVocabQuestClaimed ? VOCAB_QUEST_REWARD_XP : 0
    return Math.max(todayLogXp, vocabClaimXp)
  }, [todayLog, isVocabQuestClaimed])

  const clampedTodayXp = Math.min(todayEarnedXp, DAILY_TARGET_XP)
  const extraXp = Math.max(0, todayEarnedXp - DAILY_TARGET_XP)
  const dailyProgressPercent = Math.min(
    100,
    Math.round((todayEarnedXp / DAILY_TARGET_XP) * 100)
  )
  const isChestUnlocked = todayEarnedXp >= DAILY_TARGET_XP
  const remainingXp = Math.max(0, DAILY_TARGET_XP - todayEarnedXp)

  const activeQuests: SidebarDailyQuestItem[] = useMemo(
    () => [
      {
        id: 'daily-lesson',
        title: 'Tuntaskan 1 Pelajaran',
        chipLabel: 'PELAJARAN',
        progressText: `${Math.min(1, todayLessonsCompleted)}/1`,
        route: '/curriculum',
        xpReward: 50,
        isLanguage: false,
        status: todayLessonsCompleted >= 1 ? 'completed' : 'available',
      },
      {
        id: 'daily-vocab',
        title: `Ulas ${vocabQuestTarget} Kartu Flashcard`,
        chipLabel: 'KOSAKATA',
        progressText: isVocabQuestClaimed
          ? `${vocabQuestTarget}/${vocabQuestTarget}`
          : `${Math.min(vocabQuestTarget, todayFlashcardsReviewed)}/${vocabQuestTarget}`,
        route: '/flashcards',
        xpReward: VOCAB_QUEST_REWARD_XP,
        isLanguage: true,
        status: isVocabQuestClaimed
          ? 'completed'
          : isVocabQuestUnlocked
            ? 'ready_to_claim'
            : 'available',
      },
      {
        id: 'daily-xp',
        title: `Kumpulkan ${DAILY_TARGET_XP} XP Harian`,
        chipLabel: 'TARGET XP',
        progressText: `${clampedTodayXp}/${DAILY_TARGET_XP}`,
        route: '/flashcards',
        xpReward: GOLDEN_CHEST_REWARD_XP,
        isLanguage: false,
        status: isChestUnlocked ? 'completed' : 'available',
      },
    ],
    [
      clampedTodayXp,
      isChestUnlocked,
      isVocabQuestClaimed,
      isVocabQuestUnlocked,
      todayFlashcardsReviewed,
      todayLessonsCompleted,
      vocabQuestTarget,
    ]
  )

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
      navigate(quest.route)
    },
    [navigate]
  )

  return {
    timeLeft,
    dailyTargetXp: DAILY_TARGET_XP,
    todayEarnedXp,
    clampedTodayXp,
    extraXp,
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
