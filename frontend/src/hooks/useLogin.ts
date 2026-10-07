import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { validateLoginForm } from '../utils/validation'

/**
 * Headless controller hook managing user authentication flow and form validation for LoginPage.
 */
export const useLogin = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  // 1. Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

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

  // 3. TanStack Mutation for Session Authentication
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token, rememberMe)
      const targetPath = data.user.is_onboarded ? '/dashboard' : '/onboarding'
      navigate(targetPath, { replace: true })
    },
    onError: (err: unknown) => {
      if (isAxiosError<{ error?: string; message?: string }>(err)) {
        const rawError = (err.response?.data?.error || err.response?.data?.message || '').toLowerCase()
        if (
          err.response?.status === 401 ||
          rawError.includes('unauthorized') ||
          rawError.includes('invalid') ||
          rawError.includes('password') ||
          rawError.includes('credential')
        ) {
          setGeneralError('Email atau kata sandi yang kamu masukkan salah. Silakan coba lagi.')
        } else if (err.response?.status === 404 || rawError.includes('not found')) {
          setGeneralError('Akun dengan email ini belum terdaftar. Silakan buat akun baru.')
        } else {
          setGeneralError(err.response?.data?.error || 'Gagal masuk. Periksa kembali email dan kata sandi kamu.')
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

    const errors = validateLoginForm(email, password)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    loginMutation.mutate({
      email,
      password,
      remember_me: rememberMe,
    })
  }

  // 5. Google OAuth Redirection
  const handleGoogleLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
    window.location.href = `${apiBaseUrl}/auth/google`
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
      googleLogin: handleGoogleLogin,
    },
  }
}
