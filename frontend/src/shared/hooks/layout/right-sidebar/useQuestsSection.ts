import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import { gamificationService } from '@/features/gamification/services/gamificationService'
import { useUserActivity } from '@/features/user/hooks/useUserActivity'
import { useDailyRewards } from '@/features/user/hooks/useDailyRewards'
import { triggerHaptic } from '@/shared/utils/haptics'
import { getWibMidnightCountdown } from '@/shared/utils/date'
import {
  DAILY_QUESTS_QUERY_KEY,
  getDailyQuestsQueryKey,
} from '@/shared/constants/queryKeys'

export { DAILY_QUESTS_QUERY_KEY }

export const DAILY_TARGET_XP = 50
export const GOLDEN_CHEST_REWARD_XP = 50

export interface SidebarDailyQuestItem {
  id: string
  code: string
  title: string
  chipLabel: string
  progressText: string
  route: string
  xpReward: number
  iconName: string
  slotCategory: string
  status: 'completed' | 'available' | 'ready_to_claim'
}

export interface UseQuestsSectionOptions {
  onClaimChestReward: (e?: React.MouseEvent) => void
}

/**
 * 1:1 Headless controller hook for QuestsSection in AppRightSidebar.
 * Derives daily XP progress and the 3 rotating daily quests from backend gamification SSOT.
 */
export const useQuestsSection = ({
  onClaimChestReward,
}: UseQuestsSectionOptions) => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

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

  const { data: dailyQuestsApi = [] } = useQuery({
    queryKey: getDailyQuestsQueryKey(user?.id),
    queryFn: ({ signal }) => gamificationService.getDailyQuests({ signal }),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

  const todayLog = useMemo(
    () => activitySummary?.weekly_logs?.find((log) => log.is_today),
    [activitySummary]
  )

  const isChestClaimedToday = Boolean(dailyRewardsStatus?.golden_chest_claimed)

  const claimedQuestXp = useMemo(
    () =>
      dailyQuestsApi
        .filter((q) => q.is_claimed)
        .reduce((sum, q) => sum + q.xp_reward, 0),
    [dailyQuestsApi]
  )

  const todayEarnedXp = useMemo(() => {
    const todayLogXp = todayLog?.xp_earned ?? 0
    return Math.max(todayLogXp, claimedQuestXp)
  }, [todayLog, claimedQuestXp])

  const clampedTodayXp = Math.min(todayEarnedXp, DAILY_TARGET_XP)
  const extraXp = Math.max(0, todayEarnedXp - DAILY_TARGET_XP)
  const dailyProgressPercent = Math.min(
    100,
    Math.round((todayEarnedXp / DAILY_TARGET_XP) * 100)
  )
  const isChestUnlocked = todayEarnedXp >= DAILY_TARGET_XP
  const remainingXp = Math.max(0, DAILY_TARGET_XP - todayEarnedXp)

  const activeQuests: SidebarDailyQuestItem[] = useMemo(
    () =>
      dailyQuestsApi.map((q) => ({
        id: q.id,
        code: q.code,
        title: q.title,
        chipLabel: q.chip_label,
        progressText: q.progress_text,
        route: q.route || '/curriculum',
        xpReward: q.xp_reward,
        iconName: q.icon_name || 'book-open',
        slotCategory: q.slot_category || 'curriculum',
        status: q.is_claimed
          ? 'completed'
          : q.is_completed
            ? 'ready_to_claim'
            : 'available',
      })),
    [dailyQuestsApi]
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
