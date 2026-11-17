import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from "@/features/auth/store/authStore"
import { userService } from "@/features/user/services/userService"
import {
  getProfileQueryKey,
  getDailyRewardsQueryKey,
  getActivityLogsQueryKey,
} from "@/shared/constants/queryKeys"
import type { DailyRewardsStatusResponse, DailyRewardClaimResponse } from "@/shared/types/user"

/**
 * Headless hook managing daily habit milestone rewards (Vocab Quest & Golden Chest).
 * Returns semantic { data, status, actions } objects for clean readability.
 */
export const useDailyRewards = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)

  // 1. Fetch today's claimed status for Vocab Quest and Golden Chest
  const {
    data: dailyRewardsStatus = null,
    isLoading,
    isError,
    refetch,
  } = useQuery<DailyRewardsStatusResponse>({
    queryKey: getDailyRewardsQueryKey(user?.id),
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
      updateUser({
        xp: res.current_xp,
        current_level: res.current_level,
        streak: res.streak,
        ...(typeof res.current_gems === 'number' ? { gems: res.current_gems } : {}),
      })
      void queryClient.invalidateQueries({ queryKey: getProfileQueryKey(user?.id) })
      void queryClient.invalidateQueries({ queryKey: getDailyRewardsQueryKey(user?.id) })
      void queryClient.invalidateQueries({ queryKey: getActivityLogsQueryKey(user?.id) })
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
