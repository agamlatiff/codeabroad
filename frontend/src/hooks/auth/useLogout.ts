import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'

/**
 * Shared session sign-out hook.
 * Revokes the server session (best-effort), clears the auth store and
 * TanStack Query cache, then redirects to /login.
 */
export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const clearAuthStore = useAuthStore((state) => state.logout)

  return useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      // Always clear the client session, even if the server is unreachable
      clearAuthStore()
      queryClient.clear()
      navigate('/login', { replace: true })
    }
  }, [clearAuthStore, queryClient, navigate])
}

