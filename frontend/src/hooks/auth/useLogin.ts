import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { PROFILE_QUERY_KEY } from '../../constants/queryKeys'
import { validateLoginForm } from '../../utils/validation'
import { useFieldErrors } from './useFieldErrors'
import {
  NETWORK_ERROR_MESSAGE,
  PAYLOAD_TOO_LARGE_MESSAGE,
  SERVER_ERROR_MESSAGE,
  parseAuthError,
  rateLimitMessage,
  // redirectToGoogleOAuth,
  resolvePostAuthPath,
} from './authHelpers'

/**
 * Headless controller hook managing user authentication flow and form validation for LoginPage.
 */
export const useLogin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)

  // 1. Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // 2. Error States
  const { fieldErrors, setFieldErrors, clearFieldError } = useFieldErrors()
  const [generalError, setGeneralError] = useState<string | null>(null)

  // 3. TanStack Mutation for Session Authentication
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token, rememberMe)
      queryClient.setQueryData(PROFILE_QUERY_KEY, data.user)
      navigate(resolvePostAuthPath(data.user), { replace: true })
    },
    onError: (err: unknown) => {
      const { status, rawError, isNetworkError } = parseAuthError(err)

      if (isNetworkError) {
        setGeneralError(NETWORK_ERROR_MESSAGE)
      } else if (status === 429) {
        setGeneralError(rateLimitMessage('masuk'))
      } else if (status === 413) {
        setGeneralError(PAYLOAD_TOO_LARGE_MESSAGE)
      } else if (status !== undefined && status >= 500) {
        setGeneralError(SERVER_ERROR_MESSAGE)
      } else if (
        status === 401 ||
        rawError.includes('unauthorized') ||
        rawError.includes('invalid') ||
        rawError.includes('password') ||
        rawError.includes('credential')
      ) {
        setGeneralError('Email atau kata sandi yang kamu masukkan salah. Silakan coba lagi.')
      } else {
        setGeneralError('Gagal masuk. Periksa kembali email dan kata sandi kamu.')
      }
    },
  })

  // 4. Form Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (loginMutation.isPending) return

    setGeneralError(null)

    const errors = validateLoginForm(email, password)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    loginMutation.mutate({
      email: email.trim().toLowerCase(),
      password,
      remember_me: rememberMe,
    })
  }

  return {
    // 1. Form Values & Field Setters
    form: {
      email,
      setEmail,
      password,
      setPassword,
      rememberMe,
      setRememberMe,
      fieldErrors,
      clearFieldError,
    },

    // 2. Request Status & Alerts
    status: {
      loading: loginMutation.isPending,
      error: generalError,
      clearError: () => setGeneralError(null),
    },

    // 3. User Actions
    actions: {
      submit: handleSubmit,
      // googleLogin: redirectToGoogleOAuth,
    },
  }
}
