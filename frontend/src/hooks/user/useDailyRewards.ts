import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { userService } from '../../services/userService'
import { DAILY_REWARDS_QUERY_KEY, ACTIVITY_LOGS_QUERY_KEY } from '../../constants/queryKeys'
import type { DailyRewardsStatusResponse, DailyRewardClaimResponse } from '../../types/user'

/**
 * Headless hook managing daily habit milestone rewards (Vocab Quest & Golden Chest).
 * Returns semantic { data, status, actions } objects for clean readability.
 */
export const useDailyRewards = () => {
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()

  // 1. Fetch today's claimed status for Vocab Quest and Golden Chest
  const {
    data: dailyRewardsStatus = null,
    isLoading,
    isError,
    refetch,
  } = useQuery<DailyRewardsStatusResponse>({
    queryKey: DAILY_REWARDS_QUERY_KEY,
    queryFn: ({ signal }) => userService.getDailyRewardsStatus({ signal }),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

  // 2. Mutation for claiming daily rewards
  const claimMutation = useMutation<
    DailyRewardClaimResponse,
    Error,
    'vocab_quest' | 'golden_chest'
  >({
    mutationFn: (rewardType) => userService.claimDailyReward(rewardType),
    onSuccess: (res) => {
      // Synchronize updated game loop stats into client Zustand store
      updateUser({
        xp: res.current_xp,
        current_level: res.current_level,
        streak: res.streak,
      })
      // Invalidate relevant query keys so streaks and reward cards re-render
      void queryClient.invalidateQueries({ queryKey: DAILY_REWARDS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY })
    },
  })

  return {
    data: {
      dailyRewardsStatus,
    },
    status: {
      isLoading,
      isError,
      isClaiming: claimMutation.isPending,
      claimError: claimMutation.error,
    },
    actions: {
      refetch,
      claimReward: claimMutation.mutateAsync,
    },
  }
}
