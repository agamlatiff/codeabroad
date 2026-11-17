import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from "@/features/auth/store/authStore"
import { userService } from "@/features/user/services/userService"
import { getActivityLogsQueryKey } from "@/shared/constants/queryKeys"
import type { UserActivitySummaryResponse } from "@/shared/types/user"

/**
 * Headless hook managing 7-day learning activity logs, streaks, and attendance calendar.
 * Returns semantic { data, status, actions } objects for clean readability.
 */
export const useUserActivity = () => {
  const user = useAuthStore((s) => s.user)

  const {
    data: activitySummary = null,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserActivitySummaryResponse>({
    queryKey: getActivityLogsQueryKey(user?.id),
    queryFn: ({ signal }) => userService.getActivityLogs({ signal }),
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
