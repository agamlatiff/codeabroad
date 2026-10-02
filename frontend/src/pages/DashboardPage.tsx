import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'
import type { ApiResponse, User } from '../types/auth'
import { 
  Terminal, 
  LogOut, 
  ShieldCheck, 
  Flame, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleTestToken = async () => {
    setVerifying(true)
    setVerifyResult(null)
    try {
      const res = await api.get<ApiResponse<User>>('/users/me')
      if (res.data.success && res.data.data) {
        setVerifyResult(`Success! Verified as @${res.data.data.username} (${res.data.data.email})`)
      }
    } catch {
      setVerifyResult('Failed: Unauthorized or invalid token')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-200 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Navbar */}
        <header className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center glow-cyan">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                CodeAbroad <Sparkles className="w-4 h-4 text-emerald-400" />
              </h1>
              <p className="text-xs text-slate-400">Global Tech Career Journey</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium border border-rose-500/20 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </header>

        {/* Welcome Banner */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Authenticated Session
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
              Welcome back, {user?.name || 'Developer'}! 👋
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              @{user?.username || 'user'} • {user?.email}
            </p>
          </div>
        </div>

        {/* Gamification Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Daily Streak</p>
              <h3 className="text-xl font-bold text-white">{user?.streak ?? 1} Days 🔥</h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Current Level</p>
              <h3 className="text-xl font-bold text-white capitalize">{user?.level || 'Junior'} (Lvl {user?.current_level ?? 1})</h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Experience</p>
              <h3 className="text-xl font-bold text-white">{user?.xp ?? 0} XP</h3>
            </div>
          </div>
        </div>

        {/* Live Token & Auth Verification Test */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">Live JWT Token Verification</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Klik tombol di bawah untuk menguji apakah <code>Axios Request Interceptor</code> otomatis melampirkan Bearer Access Token ke endpoint backend yang dilindungi (<code>GET /api/v1/users/me</code>).
          </p>

          <button
            onClick={handleTestToken}
            disabled={verifying}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-medium text-sm border border-cyan-500/30 transition disabled:opacity-50 cursor-pointer"
          >
            {verifying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>Test GET /api/v1/users/me</span>
          </button>

          {verifyResult && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
              {verifyResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
