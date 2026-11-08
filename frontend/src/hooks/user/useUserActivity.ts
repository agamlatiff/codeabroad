import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { userService } from '../../services/userService'
import { ACTIVITY_LOGS_QUERY_KEY } from '../../constants/queryKeys'
import type { UserActivitySummaryResponse } from '../../types/user'

/**
 * Headless hook managing 7-day learning activity logs, streaks, and attendance calendar.
 * Returns semantic { data, status, actions } objects for clean readability.
 */
export const useUserActivity = () => {
  const { user } = useAuthStore()

  const {
    data: activitySummary = null,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserActivitySummaryResponse>({
    queryKey: ACTIVITY_LOGS_QUERY_KEY,
    queryFn: () => userService.getActivityLogs(),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2, // 2 minutes fresh cache
  })

  return {
    data: {
      activitySummary,
    },
    status: {
      isLoading,
      isError,
    },
    actions: {
      refetch,
    },
  }
}
