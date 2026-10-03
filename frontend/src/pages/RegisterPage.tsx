import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'
import type { ApiResponse, AuthResponse } from '../types/auth'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthField } from '../components/auth/AuthField'
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

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 1. Submit registration form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
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
      if (isAxiosError<{ error?: string }>(err)) {
        setError(err.response?.data?.error || 'Gagal mendaftar. Periksa kembali data kamu.')
      } else {
        setError('Gagal terhubung ke server. Periksa koneksi internet kamu.')
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
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── 1. REGISTRATION FORM (FIRST) ── */}
      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
        <AuthField
          id="name"
          label="Nama Lengkap"
          type="text"
          required
          placeholder="Contoh: Budi Pratama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="w-4 h-4" />}
        />

        <AuthField
          id="username"
          label="Username"
          type="text"
          required
          placeholder="nama_kamu"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
          icon={<AtSign className="w-4 h-4" />}
        />

        <AuthField
          id="email"
          label="Alamat Email"
          type="email"
          required
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
        />

        <AuthField
          id="password"
          label="Kata Sandi"
          isPassword
          required
          placeholder="Minimal 8 karakter"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
        />

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
