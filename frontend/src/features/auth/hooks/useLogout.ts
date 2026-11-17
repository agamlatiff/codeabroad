import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from "@/features/auth/services/authService"
import { useAuthStore } from "@/features/auth/store/authStore"
import { clearClientSession } from "@/shared/services/sessionCleanup"

/**
 * Shared session sign-out hook.
 * Revokes the server session (best-effort), wipes client auth/feature stores + caches,
 * preserves audio settings, then redirects to /login.
 */
export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useCallback(async (allDevices: boolean = false) => {
    try {
      if (allDevices) {
        await authService.logoutAll()
      } else {
        const currentRefreshToken = useAuthStore.getState().refreshToken
        await authService.logout(currentRefreshToken)
      }
    } finally {
      clearClientSession(queryClient)
      navigate('/login', { replace: true })
    }
  }, [queryClient, navigate])
}
