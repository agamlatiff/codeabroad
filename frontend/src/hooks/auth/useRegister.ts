import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { PROFILE_QUERY_KEY } from '../../constants/queryKeys'
import { validateRegisterForm } from '../../utils/validation'
import { useFieldErrors } from './useFieldErrors'
import {
  resolveRegisterErrorMessage,
  resolvePostAuthPath,
  // redirectToGoogleOAuth,
} from './authHelpers'

/**
 * Headless controller hook managing user registration flow, validation, and error mapping for RegisterPage.
 */
export const useRegister = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)

  // 1. Form State
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 2. Error States
  const { fieldErrors, setFieldErrors, setFieldError, clearFieldError } = useFieldErrors()
  const [generalError, setGeneralError] = useState<string | null>(null)

  // 3. TanStack Mutation for Registration
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Automatically authenticate on successful registration (default persistent session)
      setAuth(data.user, data.access_token, data.refresh_token, true)
      queryClient.setQueryData(PROFILE_QUERY_KEY, data.user)
      navigate(resolvePostAuthPath(data.user), { replace: true })
    },
    onError: (err: unknown) => {
      const errorResult = resolveRegisterErrorMessage(err)
      if (errorResult.type === 'field') {
        setFieldError(errorResult.field, errorResult.message)
      } else {
        setGeneralError(errorResult.message)
      }
    },
  })

  // 4. Form Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (registerMutation.isPending) return

    setGeneralError(null)

    const errors = validateRegisterForm(name, username, email, password)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    registerMutation.mutate({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password,
    })
  }

  return {
    // 1. Form Values & Field Setters
    form: {
      name,
      setName,
      username,
      setUsername,
      email,
      setEmail,
      password,
      setPassword,
      fieldErrors,
      clearFieldError,
    },

    // 2. Request Status & Alerts
    status: {
      loading: registerMutation.isPending,
      error: generalError,
      clearError: () => setGeneralError(null),
    },

    // 3. User Actions
    actions: {
      submit: handleSubmit,
      // googleRegister: redirectToGoogleOAuth,
    },
  }
}
