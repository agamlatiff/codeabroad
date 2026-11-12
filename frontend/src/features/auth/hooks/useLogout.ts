import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from "@/features/auth/services/authService"
import { useAuthStore } from "@/features/auth/store/authStore"

/**
 * Shared session sign-out hook.
 * Revokes the server session (best-effort), clears the auth store,
 * clears local user storage, wipes TanStack Query cache, then redirects to /login.
 */
export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const clearAuthStore = useAuthStore((state) => state.logout)

  return useCallback(async (allDevices: boolean = false) => {
    try {
      if (allDevices) {
        await authService.logoutAll()
      } else {
        await authService.logout()
      }
    } finally {
      // 1. Clear client auth session
      clearAuthStore()

      // 2. Wipe TanStack Query cache to prevent data bleed
      queryClient.clear()

      // 3. Clear temporary user-specific storage
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('codeabroad_completed_quests')
      }

      // 4. Redirect to login
      navigate('/login', { replace: true })
    }
  }, [clearAuthStore, queryClient, navigate])
}
