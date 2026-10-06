import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'
import { UserAvatar } from '../components/ui/UserAvatar'
import type { AvatarStyle } from '../utils/avatar'
import { MascotCard, type KodiPose } from '../components/ui/MascotCard'
import { DoodleHanko } from '../components/ui/DoodleIcons'
import { Logo } from '../components/ui/Logo'
import { 
  LogOut, 
  Sparkles, 
  Plane, 
  Award, 
  Flame, 
  Lock, 
  Check, 
  Zap, 
  Target 
} from 'lucide-react'

// Helper to format tech stack slug into readable label with icon
const formatTechStack = (slug?: string | null): string => {
  switch (slug) {
    case 'golang':
      return '🐹 Go (Gin Framework)'
    case 'java':
      return '☕ Java (Spring Boot)'
    case 'node':
    case 'nodejs':
      return '🟩 Node.js (Express)'
    case 'react':
    case 'react-ts':
      return '⚛️ React'
    case 'vue':
      return '🟢 Vue.js'
    case 'svelte':
      return '🧡 Svelte'
    case 'react_golang':
    case 'react-golang':
      return '⚛️🐹 React + Go + AWS'
    case 'react_node':
      return '⚛️🟩 React + Node + AWS'
    case 'devops_aws':
    case 'devops_cloud':
    case 'docker-k8s-aws':
      return '☁️ AWS Cloud Native'
    case 'devops_gcp':
      return '☁️ GCP Cloud Native'
    case 'devops_terraform':
      return '🟣 Terraform & GitOps'
    default:
      return slug ? slug.replace(/_/g, ' ').toUpperCase() : 'Go (Gin Framework)'
  }
}

// Helper to format experience level
const formatExperienceLevel = (level?: string | null): string => {
  if (level === 'intermediate') {
    return '🚀 Berpengalaman (2+ thn)'
  }
  return '🌱 Pemula (< 1-2 thn)'
}

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuthStore()

  const [currentPose, setCurrentPose] = useState<KodiPose>('welcome')
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>(() => {
    return (localStorage.getItem('codeabroad_avatar_style') as AvatarStyle) || 'adventurer'
  })

  // Fetch fresh profile data on mount to ensure synchronization with DB
  useEffect(() => {
    const fetchFreshProfile = async () => {
      try {
        const res = await api.get('/users/me')
        if (res.data.success && res.data.data) {
          updateUser(res.data.data)
        }
      } catch {
        // Fallback to local cached session
      }
    }
    fetchFreshProfile()
  }, [updateUser])

  // Live clocks for Tokyo (JST) and Jakarta (WIB)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const tokyoTime = currentTime.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
  })

  const jakartaTime = currentTime.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleAvatarStyleChange = (style: AvatarStyle) => {
    setAvatarStyle(style)
    localStorage.setItem('codeabroad_avatar_style', style)
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Gracefully clear client session if server unreachable
    } finally {
      logout()
      navigate('/login', { replace: true })
    }
  }

  const firstName = user?.name?.split(' ')[0] || 'Developer'
  const destinationName = user?.country?.name || 'Tokyo, Jepang'

  const poseMessages: Record<KodiPose, string> = {
    welcome: `Konnichiwa, ${firstName}-san! Kodi siap mendampingi persiapan teknismu menuju karier global di ${destinationName}! 🎌`,
    coding: `Mode fokus AKTIF! Ayo selesaikan quest harian untuk mendongkrak skor interview teknismu... 💻`,
    celebrate: `Yatta! Paspor karier aktif, streak 1 hari bertambah, dan bonus +50 XP siap digunakan! 🎉`,
  }

  // Roadmap Nodes Data
  const roadmapNodes = [
    {
      id: 1,
      title: 'Fondasi Git & Go CLI',
      desc: 'Penguasaan toolchain & syntax standar industri global',
      status: 'completed',
      xp: '+50 XP',
      level: 'Lv. 1',
    },
    {
      id: 2,
      title: 'Clean Architecture & REST API',
      desc: 'Implementasi 4-layer Gin, domain modeling & unit test',
      status: 'active',
      xp: '+80 XP',
      level: 'Lv. 2',
    },
    {
      id: 3,
      title: 'Concurrency, Redis & Kafka',
      desc: 'Goroutine pipeline, event streaming & distributed cache',
      status: 'locked',
      xp: '+120 XP',
      level: 'Lv. 3',
    },
    {
      id: 4,
      title: 'Tokyo Technical Mock Interview',
      desc: 'Simulasi live coding & interview kultur kerja Jepang',
      status: 'locked',
      xp: '+200 XP',
      level: 'Lv. 4',
    },
  ]

  // Daily Coding Quests
  const dailyQuests = [
    {
      id: 1,
      title: 'Pecahkan 1 Algoritma Two-Pointer',
      category: 'LeetCode Tokyo',
      xp: 25,
      completed: true,
      difficulty: 'Mudah',
      diffColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 2,
      title: 'Implementasikan Domain Layer di Clean Arch',
      category: 'Backend Mastery',
      xp: 35,
      completed: false,
      difficulty: 'Menengah',
      diffColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    {
      id: 3,
      title: 'Pelajari 5 Kosakata Tech Business Japanese',
      category: 'Kultur & Bahasa',
      xp: 40,
      completed: false,
      difficulty: 'Spesial',
      diffColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans selection:bg-indigo-500/20">
      
      {/* ── 1. TOP HUD NAVBAR (DUAL CLOCK + GAMIFIED STATS) ── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-[#E5E5E5] px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <Logo variant="slate" size="sm" linkTo="/dashboard" />
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono font-bold text-slate-600">
              <span>コード海外</span>
              <span className="text-slate-300">•</span>
              <span>Tokyo Hub</span>
            </div>
          </div>

          {/* Center: Live Dual Timezone Clock (Tokyo & Jakarta) */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-50 border-2 border-[#E5E5E5] px-3.5 py-1.5 rounded-2xl shadow-2xs text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span>🇯🇵</span>
              <span className="text-slate-400 font-normal">Tokyo:</span>
              <span className="font-mono text-slate-900 font-black">{tokyoTime} JST</span>
            </div>
            <span className="text-slate-300 font-light">|</span>
            <div className="flex items-center gap-1.5">
              <span>🇮🇩</span>
              <span className="text-slate-400 font-normal">Jakarta:</span>
              <span className="font-mono text-slate-700 font-bold">{jakartaTime} WIB</span>
            </div>
          </div>

          {/* Right: Gamified Stats + Profile Pill */}
          <div className="flex items-center gap-3">
            {/* Streak Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 border-2 border-orange-200 border-b-4 border-b-orange-300 shadow-2xs font-black text-xs text-orange-950">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{user?.streak ?? 1} Hari</span>
            </div>

            {/* XP Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 border-b-4 border-b-indigo-300 shadow-2xs font-black text-xs text-indigo-950">
              <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>{user?.xp ?? 50} XP</span>
            </div>

            {/* Profile Dropdown / Sign Out */}
            <div className="flex items-center gap-2 pl-1">
              <UserAvatar user={user} size="sm" style={avatarStyle} showBadge badgeColor="streak" />
              <button
                type="button"
                onClick={handleLogout}
                className="w-9 h-9 rounded-xl border-2 border-[#E5E5E5] hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-colors cursor-pointer"
                title="Keluar (Sign Out)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. MAIN CONTAINER ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Welcome Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-slate-800">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  KARIER AKTIF • PASPOR TERDAFTAR
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Level {user?.current_level ?? 1} Developer
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Selamat Datang, {firstName}-san! 🎌
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Persiapan teknis menuju panggung global di <strong className="text-white font-bold">{destinationName}</strong> telah dimulai. 
                Selesaikan quest harian untuk membangun portofolio berstandar internasional dan membuka sponsor visa.
              </p>
            </div>

            {/* Quick Level Progress Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 shrink-0 min-w-[240px] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Level Saat Ini</span>
                <span className="text-amber-300 font-black flex items-center gap-1">
                  <Award className="w-4 h-4" /> Lv. {user?.current_level ?? 1}
                </span>
              </div>

              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((user?.xp ?? 50) % 100))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>{user?.xp ?? 50} / 100 XP</span>
                <span className="text-emerald-300 font-bold">50 XP menuju Lv. 2</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2-COLUMN GRID: ROADMAP & QUESTS (LEFT) + KODI & PASSPORT (RIGHT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ══════ LEFT COLUMN (COL-SPAN-7): GAMIFIED ROADMAP & DAILY QUESTS ══════ */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Gamified Career Roadmap Card */}
            <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-4 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Peta Jalur Karier Tokyo (Roadmap)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Kurikulum kurasi untuk target {formatTechStack(user?.primary_stack)} di Jepang
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 hidden sm:inline-block">
                  Tahap 1 Aktif
                </span>
              </div>

              {/* The Interactive Road Nodes */}
              <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:border-l-2 before:border-dashed before:border-slate-200">
                {roadmapNodes.map((node) => {
                  const isCompleted = node.status === 'completed'
                  const isActive = node.status === 'active'
                  const isLocked = node.status === 'locked'

                  return (
                    <div
                      key={node.id}
                      className={`relative flex items-start gap-4 p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                        isActive
                          ? 'border-[#4F46E5] border-b-4 border-b-[#3730A3] bg-indigo-50/50 shadow-xs'
                          : isCompleted
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-slate-200 bg-slate-50/60 opacity-60'
                      }`}
                    >
                      {/* Node Icon Indicator */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : isActive
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : isLocked ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <span>{node.id}</span>
                        )}
                      </div>

                      {/* Node Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-black text-slate-900 truncate">
                            {node.title}
                          </h3>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md border shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : isActive
                                ? 'bg-indigo-600 text-white border-indigo-700'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            {node.xp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {node.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2. Daily Coding Quests Card */}
            <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-4 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Misi Harian (Daily Quests)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Reset setiap pukul 00:00 JST / 22:00 WIB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  <Flame className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                  <span>Streak +1</span>
                </div>
              </div>

              {/* Quest Items List */}
              <div className="space-y-3">
                {dailyQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="p-4 rounded-2xl border-2 border-[#E5E5E5] border-b-4 hover:border-slate-300 transition-all flex items-center justify-between gap-3 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                          quest.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {quest.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900">
                            {quest.title}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${quest.diffColor}`}>
                            {quest.difficulty}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {quest.category} • Hadiah: <strong className="text-indigo-600 font-extrabold">+{quest.xp} XP</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={quest.completed}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                        quest.completed
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : 'bg-[#4F46E5] hover:bg-[#4338CA] text-white border-b-2 border-b-[#312E81] shadow-2xs active:translate-y-0.5'
                      }`}
                    >
                      {quest.completed ? 'Selesai ✓' : 'Mulai'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════ RIGHT COLUMN (COL-SPAN-5): KODI MENTOR & CAREER PASSPORT ══════ */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Kodi Mascot & Dynamic Advice Card */}
            <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-4 p-5 shadow-xs space-y-3">
              <MascotCard
                name="Kodi"
                pose={currentPose}
                variant="mint"
                streak={user?.streak ?? 1}
                xp={user?.xp ?? 50}
                message={poseMessages[currentPose]}
              />

              {/* Interactive Pose Switcher */}
              <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-[11px] font-bold text-slate-400 ml-1">Pose Kodi:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPose('welcome')}
                    className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      currentPose === 'welcome'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    👋 Sapa
                  </button>
                  <button
                    onClick={() => setCurrentPose('coding')}
                    className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      currentPose === 'coding'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    💻 Ngoding
                  </button>
                  <button
                    onClick={() => setCurrentPose('celebrate')}
                    className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      currentPose === 'celebrate'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🎉 Yatta!
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Digital Career Passport Boarding Pass Card */}
            <div className="rounded-3xl bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0F172A] overflow-hidden">
              {/* Ticket Top Header */}
              <div className="px-5 py-3 bg-slate-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black tracking-wider text-slate-200">
                  <Plane className="w-4 h-4 text-indigo-400" />
                  <span>PASPOR KARIER GLOBAL (搭乗券)</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-slate-400">
                  CA-2026
                </span>
              </div>

              {/* Ticket Body */}
              <div className="p-5 space-y-4">
                
                {/* User details & Hanko Seal */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size="lg" style={avatarStyle} />
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        {user?.name || 'Software Engineer'}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        @{user?.username || 'developer'}
                      </p>
                      <span className="inline-block mt-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {formatExperienceLevel(user?.level)}
                      </span>
                    </div>
                  </div>

                  {/* Hanko Stamp */}
                  <div className="shrink-0 transform -rotate-6">
                    <DoodleHanko text="合格" className="w-12 h-12" />
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Destinasi</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      <span>{user?.country?.flag_emoji || '🇯🇵'}</span>
                      <span className="truncate">{user?.country?.name || 'Jepang (Tokyo Track)'}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Primary Stack</span>
                    <span className="font-bold text-emerald-700 truncate block mt-0.5">
                      {formatTechStack(user?.primary_stack)}
                    </span>
                  </div>
                </div>

                {/* Avatar Style Switcher for fun */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] font-bold">Gaya Avatar:</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                    <button
                      onClick={() => handleAvatarStyleChange('adventurer')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                        avatarStyle === 'adventurer' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      🧑‍💻 Dev
                    </button>
                    <button
                      onClick={() => handleAvatarStyleChange('bottts')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                        avatarStyle === 'bottts' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      🤖 Bot
                    </button>
                    <button
                      onClick={() => handleAvatarStyleChange('lorelei')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                        avatarStyle === 'lorelei' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      🎨 Anime
                    </button>
                  </div>
                </div>

                {/* Barcode Footer */}
                <div className="pt-2 border-t-2 border-dashed border-slate-200 flex items-center justify-between">
                  <div className="font-mono text-[9px] tracking-widest text-slate-400">
                    ||||| | |||| ||| |||||| | |||||
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    VISA FAST-TRACK VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
