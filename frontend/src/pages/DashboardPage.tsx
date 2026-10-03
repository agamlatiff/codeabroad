import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'
import type { ApiResponse, User } from '../types/auth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { MascotCard, type KodiPose } from '../components/ui/MascotCard'
import { 
  DoodleHanko, 
  DoodleMatcha, 
  DoodleCodeBracket 
} from '../components/ui/DoodleIcons'
import { 
  Terminal, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Compass
} from 'lucide-react'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const [currentPose, setCurrentPose] = useState<KodiPose>('welcome')
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
        setCurrentPose('celebrate')
      }
    } catch {
      setVerifyResult('Failed: Unauthorized or invalid token')
    } finally {
      setVerifying(false)
    }
  }

  const poseMessages: Record<KodiPose, string> = {
    welcome: `Konnichiwa, ${user?.name?.split(' ')[0] || 'Dev'}-san! I'm Kodi. Ready to master tech interviews for Tokyo & Berlin? 🎌`,
    coding: `Focus mode ON! Writing clean, scalable code for global tech jobs... 💻`,
    celebrate: `Yatta! Quest completed and streak extended! You're leveling up fast! 🎉`,
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 p-4 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Navbar */}
        <header className="flex items-center justify-between pb-6 border-b border-slate-200/80 bg-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-bold shadow-sm">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">CodeAbroad</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200">
                  コード海外
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Indonesian Devs to Japan, Germany & Singapore</p>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </header>

        {/* 2-Column Hero & Mascot Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Mascot Card in Soft Mint Panel */}
          <div className="lg:col-span-5 space-y-3">
            <MascotCard
              name="Kodi"
              pose={currentPose}
              variant="mint"
              streak={user?.streak ?? 1}
              xp={user?.xp ?? 0}
              message={poseMessages[currentPose]}
            />

            {/* Interactive Pose Switcher Stickers */}
            <div className="flex items-center justify-center gap-2 p-2 rounded-2xl bg-white border-2 border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Pose:</span>
              <button
                onClick={() => setCurrentPose('welcome')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPose === 'welcome'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                👋 Hello
              </button>
              <button
                onClick={() => setCurrentPose('coding')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPose === 'coding'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                💻 Coding
              </button>
              <button
                onClick={() => setCurrentPose('celebrate')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPose === 'celebrate'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🎉 Victory
              </button>
            </div>
          </div>

          {/* Right Column: Career Track & Quick Focus Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Welcome & Career Track Card */}
            <Card variant="white">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> ターゲット市場 • Target Market
                </span>
                
                {/* Traditional Japanese Hanko Stamp */}
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
                    ● Active Member
                  </span>
                  <DoodleHanko text="合格" className="w-8 h-8" />
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 tracking-tight">
                Welcome back, {user?.name || 'Developer'}! 👋
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                @{user?.username || 'user'} • {user?.email}
              </p>

              {/* Target Countries Pills */}
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100 text-xs">
                <span className="px-3.5 py-1.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold flex items-center gap-1.5 shadow-sm">
                  🇯🇵 Tokyo, Japan
                </span>
                <span className="px-3.5 py-1.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold flex items-center gap-1.5 shadow-sm">
                  🇩🇪 Berlin, Germany
                </span>
                <span className="px-3.5 py-1.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold flex items-center gap-1.5 shadow-sm">
                  🇸🇬 Singapore
                </span>
              </div>

              {/* Primary Focus Button like the reference */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setCurrentPose('coding')}
                  icon={<DoodleCodeBracket className="w-5 h-5 text-white" />}
                >
                  Start Coding Quest 🚀
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setCurrentPose('welcome')}
                  icon={<DoodleMatcha className="w-5 h-5" />}
                >
                  Break Time
                </Button>
              </div>
            </Card>

            {/* Live Token & Auth Verification Test */}
            <Card variant="white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    JWT Session Verification <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify that Axios Bearer Interceptor attaches your access token to protected routes.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleTestToken}
                  loading={verifying}
                  icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                >
                  Test GET /api/v1/users/me
                </Button>

                {verifyResult && (
                  <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 flex-1">
                    {verifyResult}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
