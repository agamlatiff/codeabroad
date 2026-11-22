import { useState, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  LEADERBOARD_QUERY_KEY,
  getActivityLogsQueryKey,
  getProfileQueryKey,
} from '@/shared/constants/queryKeys'
import { extractApiErrorMessage } from '@/shared/services/api'
import { triggerHaptic } from '@/shared/utils/haptics'
import { playSound } from '@/shared/utils/sound'
import {
  LEAGUE_DIVISIONS,
  normalizeLeagueDivision,
} from '@/features/leaderboard/constants/divisions'
import type { LeagueDivision } from '@/features/leaderboard/types/leaderboard'
import { leaderboardService } from '@/features/leaderboard/services/leaderboardService'
import { GAMIFICATION_STATUS_QUERY_KEY } from '@/features/gamification/services/gamificationService'

export interface UseWeeklyLeaderboardOptions {
  enabled?: boolean
  initialDivision?: LeagueDivision
}

/**
 * Shared TanStack Query controller hook for weekly global league standings.
 * When initialDivision is omitted, queries backend for the user's actual division first.
 */
export const useWeeklyLeaderboard = ({
  enabled = true,
  initialDivision,
}: UseWeeklyLeaderboardOptions = {}) => {
  const queryClient = useQueryClient()
  const userId = useAuthStore((s) => s.user?.id ?? 'anonymous')
  const updateUser = useAuthStore((s) => s.updateUser)
  const [selectedDivision, setSelectedDivision] = useState<LeagueDivision | undefined>(
    initialDivision
  )

  const query = useQuery({
    queryKey: [...LEADERBOARD_QUERY_KEY, userId, selectedDivision ?? 'auto'],
    queryFn: ({ signal }) => leaderboardService.getWeeklyLeaderboard(selectedDivision, { signal }),
    enabled,
    staleTime: 30_000,
    retry: false,
  })

  const claimRewardMutation = useMutation({
    mutationFn: () => leaderboardService.claimWeeklyReward(),
    onSuccess: (res) => {
      updateUser({ gems: res.new_gems })
      triggerHaptic('success')
      playSound('gem_collect')
      void queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: getProfileQueryKey(userId) })
      void queryClient.invalidateQueries({ queryKey: getActivityLogsQueryKey(userId) })
      void queryClient.invalidateQueries({ queryKey: GAMIFICATION_STATUS_QUERY_KEY })
    },
    onError: () => {
      triggerHaptic('error')
    },
  })

  const activeDivision: LeagueDivision =
    selectedDivision ?? normalizeLeagueDivision(query.data?.division)
  const currentDivisionConfig =
    LEAGUE_DIVISIONS.find((d) => d.id === activeDivision) ?? LEAGUE_DIVISIONS[0]

  const selectDivision = useCallback((division: LeagueDivision) => {
    setSelectedDivision(division)
  }, [])

  const resetDivision = useCallback((division?: LeagueDivision) => {
    setSelectedDivision(division)
  }, [])

  return {
    leaderboard: query.data ?? null,
    activeDivision,
    currentDivisionConfig,
    isLoading: query.isLoading || query.isFetching,
    error: query.isError
      ? extractApiErrorMessage(
          query.error,
          'Gagal memuat papan peringkat. Periksa koneksi Anda lalu coba lagi.'
        )
      : null,
    selectDivision,
    resetDivision,
    refetch: query.refetch,
    claimWeeklyReward: claimRewardMutation.mutateAsync,
    isClaimingReward: claimRewardMutation.isPending,
    claimRewardError: claimRewardMutation.isError
      ? extractApiErrorMessage(claimRewardMutation.error, 'Gagal mengklaim hadiah podium mingguan.')
      : null,
  }
}
