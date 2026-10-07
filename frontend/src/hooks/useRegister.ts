import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { validateRegisterForm } from '../utils/validation'

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  // Helper to clear field error on input change
  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  // 3. TanStack Mutation for Registration
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Automatically authenticate on successful registration (default persistent session)
      setAuth(data.user, data.access_token, data.refresh_token, true)
      const targetPath = data.user.is_onboarded ? '/dashboard' : '/onboarding'
      navigate(targetPath, { replace: true })
    },
    onError: (err: unknown) => {
      if (isAxiosError<{ error?: string; message?: string }>(err)) {
        const rawError = (err.response?.data?.error || err.response?.data?.message || '').toLowerCase()

        if (rawError.includes('email') && (rawError.includes('already') || rawError.includes('exists') || rawError.includes('registered'))) {
          setFieldErrors((prev) => ({
            ...prev,
            email: 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.',
          }))
        } else if (rawError.includes('username') && (rawError.includes('taken') || rawError.includes('already') || rawError.includes('exists'))) {
          setFieldErrors((prev) => ({
            ...prev,
            username: 'Username ini sudah digunakan. Coba username yang lain.',
          }))
        } else if (rawError.includes('password')) {
          setFieldErrors((prev) => ({
            ...prev,
            password: 'Kata sandi tidak memenuhi kriteria keamanan minimal.',
          }))
        } else if (err.response?.status === 409) {
          setGeneralError('Data akun sudah terdaftar. Silakan periksa email atau username kamu.')
        } else {
          setGeneralError(err.response?.data?.error || 'Pendaftaran gagal. Periksa kembali kelengkapan formulir kamu.')
        }
      } else {
        setGeneralError('Gagal terhubung ke server backend. Periksa koneksi internet kamu.')
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
      name,
      username,
      email,
      password,
    })
  }

  // 5. Google OAuth Redirection
  const handleGoogleRegister = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
    window.location.href = `${apiBaseUrl}/auth/google`
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
      googleRegister: handleGoogleRegister,
    },
  }
}
