import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from "@/features/auth/store/authStore"
import { userService } from "@/features/user/services/userService"
import { getProfileQueryKey, LEADERBOARD_QUERY_KEY } from "@/shared/constants/queryKeys"
import type { User, UpdateProfilePayload } from "@/shared/types/user"

/**
 * Single Source of Truth (SSOT) hook for user profile and preferences.
 * Combines client Zustand auth store with TanStack Query database profile.
 * Structured with semantic { data, status, actions } objects for clean readability.
 */
export const useUser = () => {
  const queryClient = useQueryClient()
  const storeUser = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const updateUser = useAuthStore((s) => s.updateUser)

  // 1. Fetch latest normalized user profile from PostgreSQL
  const {
    data: profileUser,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: getProfileQueryKey(storeUser?.id),
    queryFn: ({ signal }) => userService.getProfile({ signal }),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
  })

  // 2. Synchronize fresh database profile into client Zustand store
  useEffect(() => {
    if (profileUser) {
      // Onboarding is one-way: never let a stale cached profile downgrade it.
      const alreadyOnboarded = useAuthStore.getState().user?.is_onboarded === true
      updateUser(
        alreadyOnboarded && !profileUser.is_onboarded
          ? { ...profileUser, is_onboarded: true }
          : profileUser
      )
    }
  }, [profileUser, updateUser])

  // 3. Mutation for updating user profile / preferences
  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateProfile(payload),
    onSuccess: (updatedUser: User) => {
      updateUser(updatedUser)
      queryClient.setQueryData(getProfileQueryKey(updatedUser.id), updatedUser)
      void queryClient.invalidateQueries({ queryKey: getProfileQueryKey(updatedUser.id) })
      void queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY })
    },
  })

  // Prefer freshly queried profile over stale initial local store
  const user = profileUser || storeUser

  return {
    data: {
      user,
      isAuthenticated,
    },
    status: {
      isLoading,
      isError,
      isUpdating: updateProfileMutation.isPending,
      updateError: updateProfileMutation.error,
    },
    actions: {
      refetch,
      updateProfile: updateProfileMutation.mutateAsync,
    },
  }
}
