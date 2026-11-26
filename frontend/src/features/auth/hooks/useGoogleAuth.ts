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
  rememberMe?: boolean
  onError?: (message: string) => void
}

/**
 * Coordinates Google OAuth 2.0 auth-code exchange with Merantalk session persistence and navigation.
 */
export const useGoogleAuth = (options?: UseGoogleAuthOptions) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)
  const rememberMe = options?.rememberMe ?? false

  const googleAuthMutation = useMutation({
    mutationFn: (params: { code: string; redirectUri?: string; rememberMe?: boolean }) =>
      authService.googleAuth({
        code: params.code,
        redirect_uri: params.redirectUri,
        remember_me: params.rememberMe ?? rememberMe,
      }),
    onSuccess: (data, variables) => {
      queryClient.clear()
      if (!data.access_token) {
        options?.onError?.('Sesi Google berhasil dibuat, tetapi token akses tidak diterima.')
        return
      }
      const persist = variables.rememberMe ?? rememberMe
      setAuth(data.user, data.access_token, data.refresh_token, persist)
      queryClient.setQueryData(getProfileQueryKey(data.user.id), data.user)
      navigate(resolvePostAuthPath(data.user), { replace: true })
    },
    onError: (err: unknown) => {
      options?.onError?.(resolveGoogleAuthErrorMessage(err))
    },
  })

  return {
    authenticateWithCode: (code: string, redirectUri?: string, overrideRememberMe?: boolean) => {
      if (googleAuthMutation.isPending) return
      googleAuthMutation.mutate({ code, redirectUri, rememberMe: overrideRememberMe })
    },
    loading: googleAuthMutation.isPending,
  }
}
