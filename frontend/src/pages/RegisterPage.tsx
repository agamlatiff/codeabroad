import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'
import type { ApiResponse, AuthResponse } from '../types/auth'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthField } from '../components/auth/AuthField'
import { PasswordStrengthMeter } from '../components/auth/PasswordStrengthMeter'
import { SocialAuthButton } from '../components/auth/SocialAuthButton'
import { AuthDivider } from '../components/auth/AuthDivider'
import doodleCoding from '../assets/kodi/doodle-coding.png'
import { User, AtSign, Mail, Lock, Loader2, AlertCircle } from 'lucide-react'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

  // 1. Submit registration form with client-side & backend error mapping
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Pre-flight client-side validation
    const errors: Record<string, string> = {}
    if (!name.trim()) {
      errors.name = 'Nama lengkap wajib diisi'
    } else if (name.trim().length < 2) {
      errors.name = 'Nama terlalu pendek (minimal 2 karakter)'
    } else if (name.trim().length > 100) {
      errors.name = 'Nama terlalu panjang (maksimal 100 karakter)'
    }

    if (!username.trim()) {
      errors.username = 'Username wajib diisi'
    } else if (username.length < 3) {
      errors.username = 'Username minimal 3 karakter'
    } else if (username.length > 30) {
      errors.username = 'Username maksimal 30 karakter'
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = 'Username hanya boleh huruf, angka, dan garis bawah (_)'
    }

    if (!email.trim()) {
      errors.email = 'Alamat email wajib diisi'
    } else if (email.length > 255) {
      errors.email = 'Alamat email maksimal 255 karakter'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Format email tidak valid (contoh: nama@domain.com)'
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi'
    } else if (password.length < 8) {
      errors.password = 'Kata sandi minimal 8 karakter'
    } else if (password.length > 72) {
      errors.password = 'Kata sandi maksimal 72 karakter'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
        name,
        username,
        email,
        password,
      })

      const res = response.data
      if (res.success && res.data) {
        // Automatically authenticate on successful registration (default persistent)
        setAuth(res.data.user, res.data.access_token, res.data.refresh_token, true)
        navigate('/dashboard')
      } else {
        setError(res.error || 'Pendaftaran gagal. Silakan coba beberapa saat lagi.')
      }
    } catch (err: unknown) {
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
          setError('Data akun sudah terdaftar. Silakan periksa email atau username kamu.')
        } else {
          setError(err.response?.data?.error || 'Pendaftaran gagal. Periksa kembali kelengkapan formulir kamu.')
        }
      } else {
        setError('Gagal terhubung ke server backend. Periksa koneksi internet kamu.')
      }
    } finally {
      setLoading(false)
    }
  }

  // 2. Google OAuth redirection handler
  const handleGoogleRegister = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
    window.location.href = `${apiUrl}/auth/google`
  }

  return (
    <AuthLayout
      title="Daftar Akun Baru"
      subtitle="Lengkapi data di bawah ini untuk memulai petualangan karir tech global."
      heroTitle="Mulai Langkah Karir Global Impianmu"
      heroSubtitle="Bergabung bersama ribuan developer Indonesia untuk menembus coding interview ke Jepang, Jerman, dan Singapura."
      heroImage={doodleCoding}
      speechBubble="Yuk mulai petualangan coding globalmu bareng aku! ✨"
    >
      {/* Error Alert */}
      {error && (
        <div className="mb-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── 1. REGISTRATION FORM (FIRST) ── */}
      <form onSubmit={handleSubmit} noValidate className="space-y-2 sm:space-y-2.5">
        <AuthField
          id="name"
          label="Nama Lengkap"
          type="text"
          placeholder="Contoh: Budi Pratama"
          value={name}
          error={fieldErrors.name}
          onChange={(e) => {
            setName(e.target.value)
            clearFieldError('name')
          }}
          icon={<User className="w-4 h-4" />}
        />

        <AuthField
          id="username"
          label="Username"
          type="text"
          placeholder="nama_kamu"
          value={username}
          error={fieldErrors.username}
          onChange={(e) => {
            setUsername(e.target.value.toLowerCase().trim())
            clearFieldError('username')
          }}
          icon={<AtSign className="w-4 h-4" />}
        />

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

        <div>
          <AuthField
            id="password"
            label="Kata Sandi"
            isPassword
            placeholder="Minimal 8 karakter"
            value={password}
            error={fieldErrors.password}
            onChange={(e) => {
              setPassword(e.target.value)
              clearFieldError('password')
            }}
            icon={<Lock className="w-4 h-4" />}
          />
          {/* Real-time Password Strength Meter */}
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#4338CA] hover:to-[#3730A3] active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 mt-2.5"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Daftar Sekarang'}
        </button>
      </form>

      {/* ── 2. DIVIDER ── */}
      <AuthDivider text="atau daftar dengan" className="my-3 sm:my-3.5" />

      {/* ── 3. GOOGLE OAUTH BUTTON ── */}
      <div className="space-y-3">
        <SocialAuthButton provider="google" onClick={handleGoogleRegister}>
          Daftar dengan Google
        </SocialAuthButton>
      </div>

      {/* ── 4. LOGIN FOOTER ── */}
      <div className="mt-3.5 sm:mt-4 text-center text-xs text-slate-500 font-normal">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-[#4F46E5] font-semibold hover:underline">
          Masuk sekarang
        </Link>
      </div>
    </AuthLayout>
  )
}
