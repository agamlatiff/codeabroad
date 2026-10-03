import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'
import type { ApiResponse, AuthResponse } from '../types/auth'
import { AuthLayout } from '../components/auth/AuthLayout'
import { SocialAuthButton } from '../components/auth/SocialAuthButton'
import { AuthField } from '../components/auth/AuthField'
import { AuthDivider } from '../components/auth/AuthDivider'
import { AuthCheckbox } from '../components/auth/AuthCheckbox'
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react'

export const LoginPage = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Clear specific field error when user interacts
  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  // 1. Submit email & password authentication
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Pre-flight client-side validation
    const errors: Record<string, string> = {}
    if (!email.trim()) {
      errors.email = 'Alamat email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Format email tidak valid (contoh: nama@domain.com)'
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
        email,
        password,
        remember_me: rememberMe,
      })

      const res = response.data
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.access_token, res.data.refresh_token, rememberMe)
        navigate('/dashboard')
      } else {
        setError(res.error || 'Gagal masuk. Silakan coba beberapa saat lagi.')
      }
    } catch (err: unknown) {
      if (isAxiosError<{ error?: string; message?: string }>(err)) {
        const rawError = (err.response?.data?.error || err.response?.data?.message || '').toLowerCase()
        if (
          err.response?.status === 401 ||
          rawError.includes('unauthorized') ||
          rawError.includes('invalid') ||
          rawError.includes('password') ||
          rawError.includes('credential')
        ) {
          setError('Email atau kata sandi yang kamu masukkan salah. Silakan coba lagi.')
        } else if (err.response?.status === 404 || rawError.includes('not found')) {
          setError('Akun dengan email ini belum terdaftar. Silakan buat akun baru.')
        } else {
          setError(err.response?.data?.error || 'Gagal masuk. Periksa kembali email dan kata sandi kamu.')
        }
      } else {
        setError('Gagal terhubung ke server backend. Periksa koneksi internet kamu.')
      }
    } finally {
      setLoading(false)
    }
  }

  // 2. Google OAuth redirection handler
  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
    window.location.href = `${apiUrl}/auth/google`
  }

  return (
    <AuthLayout
      title="Selamat Datang"
      subtitle="Masuk ke akunmu untuk melanjutkan persiapan karir tech."
      speechBubble="Halo! Siap lanjut push code hari ini? 🚀"
    >
      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── 1. EMAIL & PASSWORD FORM (FIRST) ── */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        <AuthField
          id="email"
          label="Alamat Email"
          type="email"
          placeholder="nama@email.com"
          value={email}
          error={fieldErrors.email}
          onChange={(e) => {
            setEmail(e.target.value)
            clearFieldError('email')
          }}
          icon={<Mail className="w-4 h-4" />}
        />

        <AuthField
          id="password"
          label="Kata Sandi"
          isPassword
          placeholder="Masukkan kata sandi kamu"
          value={password}
          error={fieldErrors.password}
          onChange={(e) => {
            setPassword(e.target.value)
            clearFieldError('password')
          }}
          icon={<Lock className="w-4 h-4" />}
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between pt-0.5">
          <AuthCheckbox
            id="remember"
            label="Ingat saya"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <button
            type="button"
            className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] hover:underline cursor-pointer"
          >
            Lupa kata sandi?
          </button>
        </div>

        {/* Submit Button with Elevated Glow */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#4338CA] hover:to-[#3730A3] active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 mt-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Masuk Sekarang'}
        </button>
      </form>

      {/* ── 2. DIVIDER ── */}
      <AuthDivider text="atau lanjutkan dengan" className="my-3.5 sm:my-4" />

      {/* ── 3. GOOGLE OAUTH BUTTON (SECOND) ── */}
      <div className="space-y-3">
        <SocialAuthButton provider="google" onClick={handleGoogleLogin}>
          Masuk dengan Google
        </SocialAuthButton>
      </div>

      {/* ── 4. REGISTRATION FOOTER ── */}
      <div className="mt-4 sm:mt-5 text-center text-xs text-slate-500 font-normal">
        Belum punya akun?{' '}
        <Link to="/register" className="text-[#4F46E5] font-semibold hover:underline">
          Daftar sekarang
        </Link>
      </div>
    </AuthLayout>
  )
}
