import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from "@/features/auth/store/authStore"
import { userService } from "@/features/user/services/userService"
import { triggerHaptic } from "@/shared/utils/haptics"
import { audioEngine } from "@/shared/utils/audio"
import {
  getProfileQueryKey,
  getActivityLogsQueryKey,
  getDailyRewardsQueryKey,
  getDailyQuestsQueryKey,
} from '@/shared/constants/queryKeys'
import { VOCAB_QUEST_REWARD_XP, GOLDEN_CHEST_REWARD_XP } from './useQuestsSection'

const FLOATING_REWARD_DURATION_MS = 1500
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

export const useAppRightSidebar = ({ onCloseMobileDrawer }: UseAppRightSidebarOptions = {}) => {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)

  const { data: dailyRewardsStatus = null } = useQuery({
    queryKey: getDailyRewardsQueryKey(user?.id),
    queryFn: ({ signal }) => userService.getDailyRewardsStatus({ signal }),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

  const [isClosingDrawer, setIsClosingDrawer] = useState(false)
  const [floatingRewards, setFloatingRewards] = useState<FloatingRewardItem[]>([])

  const rewardTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const drawerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const rewardTimers = rewardTimersRef.current
    return () => {
      rewardTimers.forEach((timer) => clearTimeout(timer))
      if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current)
    }
  }, [])

  const isVocabQuestClaimed = Boolean(dailyRewardsStatus?.vocab_quest_claimed)
  const isChestClaimedToday = Boolean(dailyRewardsStatus?.golden_chest_claimed)
  const vocabQuestTarget = dailyRewardsStatus?.vocab_quest_target ?? 3
  const todayFlashcardsReviewed = dailyRewardsStatus?.today_flashcards_reviewed ?? 0
  const isVocabQuestUnlocked =
    Boolean(dailyRewardsStatus?.vocab_quest_unlocked) ||
    todayFlashcardsReviewed >= vocabQuestTarget

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
    mutationFn: ({ rewardType }: { rewardType: 'vocab_quest' | 'golden_chest'; clientX?: number; clientY?: number }) =>
      userService.claimDailyReward(rewardType),
    onSuccess: (res, variables) => {
      triggerHaptic('success')
      if (variables.rewardType === 'golden_chest') {
        audioEngine.playChestClaim()
        spawnFloatingReward(GOLDEN_CHEST_REWARD_XP, variables.clientX, variables.clientY)
      } else {
        audioEngine.playRewardClaim()
        spawnFloatingReward(VOCAB_QUEST_REWARD_XP, variables.clientX, variables.clientY)
      }
      updateUser({
        xp: res.current_xp,
        current_level: res.current_level,
        streak: res.streak,
        ...(typeof res.current_gems === 'number' ? { gems: res.current_gems } : {}),
      })
      void queryClient.invalidateQueries({ queryKey: getProfileQueryKey(user?.id) })
      void queryClient.invalidateQueries({ queryKey: getActivityLogsQueryKey(user?.id) })
      void queryClient.invalidateQueries({ queryKey: getDailyRewardsQueryKey(user?.id) })
      void queryClient.invalidateQueries({ queryKey: getDailyQuestsQueryKey(user?.id) })
    },
    onError: () => {
      triggerHaptic('error')
    },
  })

  const handleClaimVocabQuest = useCallback(
    (e?: React.MouseEvent | { clientX?: number; clientY?: number }) => {
      if (isVocabQuestClaimed || !isVocabQuestUnlocked || claimRewardMutation.isPending) return
      claimRewardMutation.mutate({
        rewardType: 'vocab_quest',
        clientX: e?.clientX,
        clientY: e?.clientY,
      })
    },
    [isVocabQuestClaimed, isVocabQuestUnlocked, claimRewardMutation]
  )

  const handleClaimChest = useCallback(
    (e?: React.MouseEvent | { clientX?: number; clientY?: number }) => {
      if (isChestClaimedToday || claimRewardMutation.isPending) return
      claimRewardMutation.mutate({
        rewardType: 'golden_chest',
        clientX: e?.clientX,
        clientY: e?.clientY,
      })
    },
    [isChestClaimedToday, claimRewardMutation]
  )

  const handleCloseMobileDrawer = useCallback(() => {
    setIsClosingDrawer(true)
    if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current)
    drawerTimerRef.current = setTimeout(() => {
      setIsClosingDrawer(false)
      onCloseMobileDrawer?.()
    }, DRAWER_CLOSE_DURATION_MS)
  }, [onCloseMobileDrawer])

  return {
    isVocabQuestClaimed,
    isVocabQuestUnlocked,
    isClosingDrawer,
    floatingRewards,
    handleClaimVocabQuest,
    handleClaimChest,
    handleCloseMobileDrawer,
  }
}
