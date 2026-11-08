import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { userService } from '../../services/userService'
import { PROFILE_QUERY_KEY } from '../../constants/queryKeys'
import type { User, UpdateProfilePayload } from '../../types/user'

/**
 * Single Source of Truth (SSOT) hook for user profile and preferences.
 * Combines client Zustand auth store with TanStack Query database profile.
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
    queryFn: userService.getProfile,
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
    user,
    isAuthenticated,
    isLoading,
    isError,
    refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  }
}

