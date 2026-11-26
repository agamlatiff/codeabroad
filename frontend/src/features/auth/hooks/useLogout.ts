import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from "@/features/auth/services/authService"
import { useAuthStore } from "@/features/auth/store/authStore"
import { LOGOUT_MUTATION_KEY } from "@/shared/constants/queryKeys"
import { clearClientSession } from "@/shared/services/sessionCleanup"

/**
 * Shared session sign-out hook.
 * Revokes the server session (best-effort, bounded timeout), wipes client auth/feature stores + caches,
 * preserves audio settings, then redirects to /login while broadcasting LOGOUT_MUTATION_KEY.
 */
export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const lockRef = useRef(false)

  const { mutateAsync } = useMutation({
    mutationKey: LOGOUT_MUTATION_KEY,
    mutationFn: async (allDevices: boolean) => {
      if (allDevices) {
        await authService.logoutAll()
      } else {
        const currentRefreshToken = useAuthStore.getState().refreshToken
        await authService.logout(currentRefreshToken)
      }
    },
    onSettled: () => {
      clearClientSession(queryClient)
      navigate('/login', { replace: true })
    },
  })

  return useCallback(
    async (allDevices: boolean = false) => {
      if (lockRef.current) return
      lockRef.current = true
      try {
        await mutateAsync(allDevices)
      } finally {
        lockRef.current = false
      }
    },
    [mutateAsync]
  )
}
