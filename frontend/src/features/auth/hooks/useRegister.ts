import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from "@/features/auth/services/authService"
import { registerSchema, type RegisterPayload } from "@/features/auth/types/auth"
import { useAuthStore } from "@/features/auth/store/authStore"
import { PROFILE_QUERY_KEY } from "@/features/user/services/userService"
import {
  resolveRegisterErrorMessage,
  resolvePostAuthPath,
} from './authHelpers'

/**
 * Headless controller hook managing user registration flow with React Hook Form + Zod for RegisterPage.
 */
export const useRegister = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [generalError, setGeneralError] = useState<string | null>(null)

  // 1. React Hook Form + Zod Schema Resolver
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    watch,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  // 2. TanStack Mutation for Registration
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      // Automatically authenticate on successful registration (default persistent session)
      setAuth(data.user, data.access_token, data.refresh_token, true)
      queryClient.setQueryData(PROFILE_QUERY_KEY, data.user)
      navigate(resolvePostAuthPath(data.user), { replace: true })
    },
    onError: (err: unknown) => {
      const errorResult = resolveRegisterErrorMessage(err)
      if (errorResult.type === 'field') {
        setError(errorResult.field, { message: errorResult.message })
      } else {
        setGeneralError(errorResult.message)
      }
    },
  })

  // 3. Form Submit Handler bridged to RHF validation
  const onSubmit = (data: RegisterPayload) => {
    setGeneralError(null)
    registerMutation.mutate({
      name: data.name.trim(),
      username: data.username.trim().toLowerCase(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    })
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (registerMutation.isPending) return
    rhfHandleSubmit(onSubmit)(e)
  }

  return {
    // React Hook Form primitives
    register,
    handleSubmit: rhfHandleSubmit,
    watch,
    control,
    setValue,
    setError,
    clearErrors,
    errors,

    // Request Status & Alerts
    status: {
      loading: registerMutation.isPending,
      error: generalError,
      clearError: () => setGeneralError(null),
    },

    // User Actions
    actions: {
      submit: handleFormSubmit,
    },
  }
}
