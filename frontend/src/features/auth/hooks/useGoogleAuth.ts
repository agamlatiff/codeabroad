import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/features/auth/services/authService'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getProfileQueryKey } from '@/shared/constants/queryKeys'
import {
  resolveGoogleAuthErrorMessage,
  resolvePostAuthPath,
} from '@/features/auth/hooks/authHelpers'

export interface UseGoogleAuthOptions {
  onError?: (message: string) => void
}

/**
 * Coordinates Google OAuth 2.0 auth-code exchange with Merantalk session persistence and navigation.
 */
export const useGoogleAuth = (options?: UseGoogleAuthOptions) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)

  const googleAuthMutation = useMutation({
    mutationFn: (code: string) => authService.googleAuth({ code, remember_me: true }),
    onSuccess: (data) => {
      queryClient.clear()
      if (!data.access_token) {
        options?.onError?.('Sesi Google berhasil dibuat, tetapi token akses tidak diterima.')
        return
      }
      setAuth(data.user, data.access_token, data.refresh_token, true)
      queryClient.setQueryData(getProfileQueryKey(data.user.id), data.user)
      navigate(resolvePostAuthPath(data.user), { replace: true })
    },
    onError: (err: unknown) => {
      options?.onError?.(resolveGoogleAuthErrorMessage(err))
    },
  })

  return {
    authenticateWithCode: (code: string) => {
      if (googleAuthMutation.isPending) return
      googleAuthMutation.mutate(code)
    },
    loading: googleAuthMutation.isPending,
  }
}
