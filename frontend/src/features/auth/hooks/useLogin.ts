import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from "@/features/auth/services/authService"
import { loginSchema, type LoginPayload } from "@/features/auth/types/auth"
import { useAuthStore } from "@/features/auth/store/authStore"
import { PROFILE_QUERY_KEY } from "@/features/user/services/userService"
import {
  resolveLoginErrorMessage,
  resolvePostAuthPath,
  // redirectToGoogleOAuth,
} from './authHelpers'

/**
 * Headless controller hook managing user authentication flow with React Hook Form + Zod for LoginPage.
 */
export const useLogin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [generalError, setGeneralError] = useState<string | null>(null)

  // 1. React Hook Form + Zod Schema Resolver
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  })

  // 2. TanStack Mutation for Session Authentication
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data, variables) => {
      setAuth(data.user, data.access_token, data.refresh_token, variables.remember_me)
      queryClient.setQueryData(PROFILE_QUERY_KEY, data.user)
      navigate(resolvePostAuthPath(data.user), { replace: true })
    },
    onError: (err: unknown) => {
      setGeneralError(resolveLoginErrorMessage(err))
    },
  })

  // 3. Form Submit Handler bridged to RHF validation
  const onSubmit = (data: LoginPayload) => {
    setGeneralError(null)
    loginMutation.mutate({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      remember_me: data.remember_me ?? false,
    })
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (loginMutation.isPending) return
    rhfHandleSubmit(onSubmit)(e)
  }

  return {
    // React Hook Form register primitive for direct binding
    register,

    // Form Values & Field Setters (backwards-compatible with LoginPage UI components)
    form: {
      email: watch('email') ?? '',
      setEmail: (val: string) => {
        setValue('email', val)
        clearErrors('email')
      },
      password: watch('password') ?? '',
      setPassword: (val: string) => {
        setValue('password', val)
        clearErrors('password')
      },
      rememberMe: watch('remember_me') ?? false,
      setRememberMe: (val: boolean) => setValue('remember_me', val),
      fieldErrors: {
        email: errors.email?.message,
        password: errors.password?.message,
      },
      clearFieldError: (field: keyof LoginPayload) => clearErrors(field),
    },

    // Request Status & Alerts
    status: {
      loading: loginMutation.isPending,
      error: generalError,
      clearError: () => setGeneralError(null),
    },

    // User Actions
    actions: {
      submit: handleFormSubmit,
      // googleLogin: redirectToGoogleOAuth,
    },
  }
}
