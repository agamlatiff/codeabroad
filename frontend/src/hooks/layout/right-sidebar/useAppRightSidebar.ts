import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import { userService } from '../../../services/userService'
import { triggerHaptic } from '../../../utils/haptics'
import { audioEngine } from '../../../utils/audio'
import { PROFILE_QUERY_KEY } from '../../../constants/queryKeys'
import { ACTIVITY_LOGS_QUERY_KEY } from './useStreakSection'
import {
  DAILY_REWARDS_QUERY_KEY,
  DAILY_QUESTS_QUERY_KEY,
  VOCAB_QUEST_REWARD_XP,
  GOLDEN_CHEST_REWARD_XP,
} from './useQuestsSection'

const FLOATING_REWARD_DURATION_MS = 1500
const HIGHLIGHT_DURATION_MS = 2000
const DRAWER_CLOSE_DURATION_MS = 220

export interface FloatingRewardItem {
  id: number
  amount: number
  x: number
  y: number
}

export interface UseAppRightSidebarOptions {
  onCloseMobileDrawer?: () => void
}

/**
 * 1:1 Headless controller hook for AppRightSidebar container.
 * Manages mobile slide-over drawer transitions, cross-section scroll/highlight
 * coordination, floating XP bursts, and daily reward claim mutations.
 */
export const useAppRightSidebar = ({ onCloseMobileDrawer }: UseAppRightSidebarOptions = {}) => {
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()

  const { data: dailyRewardsStatus = null } = useQuery({
    queryKey: DAILY_REWARDS_QUERY_KEY,
    queryFn: () => userService.getDailyRewardsStatus(),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

  const [isClosingDrawer, setIsClosingDrawer] = useState(false)
  const [reviewedLanguageSession, setReviewedLanguageSession] = useState(false)
  const [isLanguageHighlighted, setIsLanguageHighlighted] = useState(false)
  const [floatingRewards, setFloatingRewards] = useState<FloatingRewardItem[]>([])

  const languageSectionRef = useRef<HTMLDivElement | null>(null)
  const rewardTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const drawerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const rewardTimers = rewardTimersRef.current
    return () => {
      rewardTimers.forEach((timer) => clearTimeout(timer))
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
      if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current)
    }
  }, [])

  const isVocabQuestClaimed = Boolean(dailyRewardsStatus?.vocab_quest_claimed)
  const isChestClaimedToday = Boolean(dailyRewardsStatus?.golden_chest_claimed)
  const isLanguageReviewed = isVocabQuestClaimed || reviewedLanguageSession

  const spawnFloatingReward = useCallback((amount: number, clientX?: number, clientY?: number) => {
    const x = typeof clientX === 'number' && clientX > 0 ? clientX : window.innerWidth / 2
    const y = typeof clientY === 'number' && clientY > 0 ? clientY : window.innerHeight / 2
    const id = Date.now() + Math.random()

    setFloatingRewards((prev) => [...prev, { id, amount, x, y }])

    const timer = setTimeout(() => {
      setFloatingRewards((prev) => prev.filter((r) => r.id !== id))
    }, FLOATING_REWARD_DURATION_MS)
    rewardTimersRef.current.push(timer)
  }, [])

  const claimRewardMutation = useMutation({
    mutationFn: (rewardType: 'vocab_quest' | 'golden_chest') =>
      userService.claimDailyReward(rewardType),
    onSuccess: (res) => {
      updateUser({
        xp: res.current_xp,
        current_level: res.current_level,
        streak: res.streak,
      })
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: DAILY_REWARDS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: DAILY_QUESTS_QUERY_KEY })
    },
  })

  const handleLanguageReview = useCallback(() => {
    if (!isLanguageReviewed) {
      setReviewedLanguageSession(true)
      triggerHaptic('success')
    }
  }, [isLanguageReviewed])

  const handleClaimVocabQuest = useCallback(
    (e?: React.MouseEvent | { clientX?: number; clientY?: number }) => {
      if (isVocabQuestClaimed || claimRewardMutation.isPending) return
      triggerHaptic('success')
      audioEngine.playRewardClaim()
      spawnFloatingReward(VOCAB_QUEST_REWARD_XP, e?.clientX, e?.clientY)
      claimRewardMutation.mutate('vocab_quest')
    },
    [isVocabQuestClaimed, claimRewardMutation, spawnFloatingReward]
  )

  const handleClaimChest = useCallback(
    (e?: React.MouseEvent | { clientX?: number; clientY?: number }) => {
      if (isChestClaimedToday || claimRewardMutation.isPending) return
      triggerHaptic('success')
      audioEngine.playChestClaim()
      spawnFloatingReward(GOLDEN_CHEST_REWARD_XP, e?.clientX, e?.clientY)
      claimRewardMutation.mutate('golden_chest')
    },
    [isChestClaimedToday, claimRewardMutation, spawnFloatingReward]
  )

  const handleFocusLanguageCard = useCallback(() => {
    languageSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setIsLanguageHighlighted(true)
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
    highlightTimerRef.current = setTimeout(() => {
      setIsLanguageHighlighted(false)
    }, HIGHLIGHT_DURATION_MS)
  }, [])

  const handleCloseMobileDrawer = useCallback(() => {
    setIsClosingDrawer(true)
    if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current)
    drawerTimerRef.current = setTimeout(() => {
      setIsClosingDrawer(false)
      onCloseMobileDrawer?.()
    }, DRAWER_CLOSE_DURATION_MS)
  }, [onCloseMobileDrawer])

  return {
    isLanguageReviewed,
    isVocabQuestClaimed,
    isLanguageHighlighted,
    languageSectionRef,
    isClosingDrawer,
    floatingRewards,
    handleLanguageReview,
    handleClaimVocabQuest,
    handleClaimChest,
    handleFocusLanguageCard,
    handleCloseMobileDrawer,
  }
}
