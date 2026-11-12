import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from "@/features/auth/store/authStore"
import { userService, PROFILE_QUERY_KEY } from "@/features/user/services/userService"
import type { User, UpdateProfilePayload } from "@/features/user/types/user"

/**
 * Single Source of Truth (SSOT) hook for user profile and preferences.
 * Combines client Zustand auth store with TanStack Query database profile.
 * Structured with semantic { data, status, actions } objects for clean readability.
 */
export const useUser = () => {
  const queryClient = useQueryClient()
  const { user: storeUser, isAuthenticated, updateUser } = useAuthStore()

  // 1. Fetch latest normalized user profile from PostgreSQL
  const {
    data: profileUser,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: ({ signal }) => userService.getProfile({ signal }),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
  })

  // 2. Synchronize fresh database profile into client Zustand store
  useEffect(() => {
    if (profileUser) {
      updateUser(profileUser)
    }
  }, [profileUser, updateUser])

  // 3. Mutation for updating user profile / preferences
  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateProfile(payload),
    onSuccess: (updatedUser: User) => {
      updateUser(updatedUser)
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
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
