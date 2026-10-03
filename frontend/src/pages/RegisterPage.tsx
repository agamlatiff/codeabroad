import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'
import type { ApiResponse, AuthResponse } from '../types/auth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import doodleCoding from '../assets/kodi/doodle-coding.png'
import { Terminal, Lock, Mail, User, ArrowRight, AlertCircle, AtSign } from 'lucide-react'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
        setAuth(res.data.user, res.data.access_token, res.data.refresh_token)
        navigate('/dashboard')
      } else {
        setError('error' in res ? res.error : 'Registration failed')
      }
    } catch (err: unknown) {
      if (isAxiosError<{ error?: string }>(err)) {
        const serverError = err.response?.data?.error
        setError(serverError || 'Failed to connect to the server')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl border-2 border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        {/* Left Column: Form */}
        <div className="lg:col-span-6 p-8 md:p-14 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold shadow-sm">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="font-black text-slate-900 tracking-tight text-lg">CodeAbroad</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200">
                コード海外
              </span>
            </div>

            {/* Header Text */}
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Start your journey to tech jobs in Japan, Germany & Singapore today.
            </p>

            {error && (
              <div className="mt-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <Input
                label="Full Name"
                type="text"
                required
                placeholder="e.g. Budi Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-4 h-4" />}
              />

              <Input
                label="Username"
                type="text"
                required
                placeholder="budipratama"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                icon={<AtSign className="w-4 h-4" />}
              />

              <Input
                label="Email Address"
                type="email"
                required
                placeholder="budi@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
              />

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                className="mt-4"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-slate-900 font-bold underline-offset-4 hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Right Column: Pastel Sky / Kodi Coding Showcase */}
        <div className="lg:col-span-6 bg-[#F0F7FF] border-t lg:border-t-0 lg:border-l-2 border-[#D6E8FC] p-8 md:p-12 flex flex-col items-center justify-between text-center relative overflow-hidden">
          {/* Floating Sticker Badges */}
          <div className="w-full flex items-center justify-between text-xs">
            <span className="px-3.5 py-1.5 rounded-2xl bg-white border-2 border-[#D6E8FC] text-slate-800 font-bold shadow-sm flex items-center gap-1.5">
              🇯🇵 Tokyo Tech Track
            </span>
            <span className="px-3.5 py-1.5 rounded-2xl bg-white border-2 border-[#D6E8FC] text-slate-800 font-bold shadow-sm flex items-center gap-1.5">
              ⚡ Live Quests
            </span>
          </div>

          {/* Central Kodi Illustration */}
          <div className="my-auto py-6 flex flex-col items-center">
            {/* Manga Speech Bubble */}
            <div className="relative mb-4 px-4 py-2.5 rounded-2xl bg-white text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0F172A] font-bold text-xs max-w-xs animate-fade-in">
              <span>"Let's write clean code & conquer international interviews!" 💻</span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-slate-900 rotate-45" />
            </div>

            <div className="w-56 h-56 relative flex items-center justify-center">
              <img
                src={doodleCoding}
                alt="Kodi Coding"
                className="w-full h-full object-contain drop-shadow-sm select-none hover:scale-105 transition-transform duration-200"
              />
            </div>
          </div>

          {/* Bottom Branding / Quote */}
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-900">
              Gamified IT learning for Indonesian engineers going global
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Curated roadmaps for Japan, Germany, and Singapore tech ecosystems.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
