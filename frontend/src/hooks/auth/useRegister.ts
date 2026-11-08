import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { validateRegisterForm } from '../../utils/validation'
import { useFieldErrors } from './useFieldErrors'
import {
  NETWORK_ERROR_MESSAGE,
  PAYLOAD_TOO_LARGE_MESSAGE,
  parseAuthError,
  rateLimitMessage,
  redirectToGoogleOAuth,
  resolvePostAuthPath,
} from './authHelpers'

/**
 * Headless controller hook managing user registration flow, validation, and error mapping for RegisterPage.
 */
export const useRegister = () => {
  const navigate = useNavigate()
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
      navigate(resolvePostAuthPath(data.user), { replace: true })
    },
    onError: (err: unknown) => {
      const { status, rawError, serverMessage, isNetworkError } = parseAuthError(err)

      if (isNetworkError) {
        setGeneralError(NETWORK_ERROR_MESSAGE)
      } else if (status === 429) {
        setGeneralError(rateLimitMessage('pendaftaran'))
      } else if (status === 413) {
        setGeneralError(PAYLOAD_TOO_LARGE_MESSAGE)
      } else if (rawError.includes('email') && (rawError.includes('already') || rawError.includes('exists') || rawError.includes('registered'))) {
        setFieldError('email', 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.')
      } else if (rawError.includes('username') && (rawError.includes('taken') || rawError.includes('already') || rawError.includes('exists'))) {
        setFieldError('username', 'Username ini sudah digunakan. Coba username yang lain.')
      } else if (rawError.includes('password')) {
        setFieldError('password', 'Kata sandi minimal 8 karakter.')
      } else if (status === 409) {
        setGeneralError('Data akun sudah terdaftar. Silakan periksa kembali email atau username kamu.')
      } else {
        setGeneralError(serverMessage || 'Pendaftaran gagal. Periksa kembali kelengkapan formulir kamu.')
      }
    },
  })

  // 4. Form Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
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
      googleRegister: redirectToGoogleOAuth,
    },
  }
}

