import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from "@/features/auth/services/authService"
import type { LoginPayload } from "@/features/auth/types/auth"
import { useAuthStore } from "@/features/auth/store/authStore"
import { PROFILE_QUERY_KEY } from "@/features/user/services/userService"
import { validateLoginForm } from "@/shared/utils/validation"
import { useFieldErrors } from './useFieldErrors'
import {
  resolveLoginErrorMessage,
  resolvePostAuthPath,
  // redirectToGoogleOAuth,
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
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token, rememberMe)
      queryClient.setQueryData(PROFILE_QUERY_KEY, data.user)
      navigate(resolvePostAuthPath(data.user), { replace: true })
    },
    onError: (err: unknown) => {
      setGeneralError(resolveLoginErrorMessage(err))
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
