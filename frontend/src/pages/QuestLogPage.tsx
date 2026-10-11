import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { Button3D } from '../components/ui/Button3D'
import { ProgressBar3D } from '../components/ui/ProgressBar3D'
import { DoodleFire, DoodleStar } from '../components/illustrations/doodles'
import { triggerHaptic } from '../utils/haptics'
import {
  Search,
  Calendar,
  Shield,
  Award,
  Sparkles,
  Gift,
  Trophy,
  Timer,
} from 'lucide-react'

export const QuestLogPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'main' | 'boss'>('all')
  const [claimedD1, setClaimedD1] = useState(false)
  const [claimedChest, setClaimedChest] = useState(false)
  const [userGems, setUserGems] = useState(45)

  const userXp = user?.xp ? (user.xp * 100).toLocaleString() : '5,400'
  const userStreak = user?.streak || 14

  const handleClaimD1 = () => {
    triggerHaptic('success')
    setClaimedD1(true)
    setUserGems((prev) => prev + 10)
  }

  const handleClaimChest = () => {
    triggerHaptic('success')
    setClaimedChest(true)
    setUserGems((prev) => prev + 15)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex">
      {/* ── 1. LEFT NAV RAIL ── */}
      <NavRail />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8">
        {/* ══════ CENTER CONTENT STAGE ══════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 space-y-6">
          {/* ── 1. HEADER ROW ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">📜</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Pusat Misi & Akihabara Quest Board
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Tuntaskan Misi Harian & Boss Challenge untuk Booster XP, Gems 💎 & Sponsor Visa Tokyo
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Pill */}
              <div className="relative w-56 sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari misi harian, kuis, boss..."
                  className="w-full bg-white text-xs font-semibold pl-9 pr-4 py-2 rounded-2xl border-2 border-slate-200 focus:border-[#2563EB] focus:outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                />
              </div>

              {/* Game Status HUD */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-1.5 flex items-center gap-3 shadow-xs">
                <div className="flex items-center gap-1.5 font-black text-xs text-[#DC2626]">
                  <DoodleFire className="w-4 h-4" />
                  <span>{userStreak} Hari</span>
                </div>
                <div className="w-[1px] h-3.5 bg-slate-200" />
                <div className="flex items-center gap-1.5 font-black text-xs text-[#F59E0B]">
                  <DoodleStar className="w-4 h-4" />
                  <span>{userXp} XP</span>
                </div>
                <div className="w-[1px] h-3.5 bg-slate-200" />
                <div className="flex items-center gap-1.5 font-black text-xs text-[#2563EB]">
                  <span className="text-sm">💎</span>
                  <span>{userGems} Gems</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. FILTER TABS ROW ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Semua Misi (6)' },
              { id: 'daily', label: 'Misi Harian ⚡ (3)' },
              { id: 'main', label: 'Misi Utama 🚀 (2)' },
              { id: 'boss', label: 'Tantangan Portofolio 🏆 (1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setActiveTab(tab.id as typeof activeTab)
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── 3. DAILY QUESTS CONTAINER (AKIHABARA ARCADE STYLE) ── */}
          {(activeTab === 'all' || activeTab === 'daily') && (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-[#D97706] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#0F172A]">
                      Misi Harian Akihabara (Daily Quests)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Reset setiap pukul 00:00 JST • Bonus XP pengganda streak
                    </p>
                  </div>
                </div>

                <span className="bg-[#FFFBEB] text-[#B45309] text-xs font-black px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5" />
                  <span>Sisa Waktu: 4j 20m</span>
                </span>
              </div>

              {/* Quest D1 (COMPLETED - READY TO CLAIM) */}
              <div className="bg-[#FFFBEB] border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-transform hover:-translate-y-0.5 shadow-2xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-mono font-black text-xs shrink-0">
                    D1
                  </div>
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-200/60 text-amber-900 font-black text-[10px] px-2 py-0.5 rounded">
                        GIN REST API
                      </span>
                      <span className="text-xs font-black text-emerald-700">✓ Selesai 100%</span>
                    </div>
                    <h4 className="font-black text-xs sm:text-sm text-[#0F172A] truncate">
                      Tuntaskan 1 Bab Koding Gin REST API
                    </h4>
                    <p className="text-[11px] font-medium text-amber-900">
                      Hadiah: ⚡ +50 XP • 💎 10 Gems
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <Button3D
                    variant="amber"
                    size="sm"
                    disabled={claimedD1}
                    onClick={handleClaimD1}
                    className="text-xs px-4 py-2"
                  >
                    {claimedD1 ? 'HADIAH DIKLAIM ✓' : 'KLAIM HADIAH ⚡'}
                  </Button3D>
                </div>
              </div>

              {/* Quest D2 (IN PROGRESS) */}
              <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] font-mono font-black text-xs shrink-0">
                    D2
                  </div>
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-[#1D4ED8] font-black text-[10px] px-2 py-0.5 rounded">
                        JLPT N3 NIHONGO
                      </span>
                      <span className="text-xs font-bold text-slate-500">3/5 Kosakata</span>
                    </div>
                    <h4 className="font-black text-xs sm:text-sm text-[#0F172A] truncate">
                      Pelajari 5 Kosakata Business IT Nihongo N3
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Hadiah: ⚡ +30 XP • 💎 5 Gems
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <Button3D
                    variant="blue"
                    size="sm"
                    onClick={() => navigate('/learn/station-3-jwt-middleware')}
                    className="text-xs px-4 py-2"
                  >
                    Lanjutkan ▶
                  </Button3D>
                </div>
              </div>

              {/* Quest D3 (QUIZ - UNSTARTED) */}
              <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-mono font-black text-xs shrink-0">
                    D3
                  </div>
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-700 font-black text-[10px] px-2 py-0.5 rounded">
                        KUIS CEPAT
                      </span>
                      <span className="text-xs font-medium text-slate-400">Estimasi 5 Menit</span>
                    </div>
                    <h4 className="font-black text-xs sm:text-sm text-[#0F172A] truncate">
                      Selesaikan Kuis Syntax Pointer & Struct Go
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Hadiah: ⚡ +40 XP
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => navigate('/learn/station-3-jwt-middleware')}
                    className="bg-slate-100 hover:bg-slate-200 active:translate-y-0.5 text-slate-800 font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer border border-slate-200"
                  >
                    Mulai Kuis ▶
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── 4. MAIN CAREER QUEST & BOSS CHALLENGE ROW ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Main Career Quest Card */}
            {(activeTab === 'all' || activeTab === 'main') && (
              <div className="bg-white border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#DCFCE7] text-[#15803D] font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                      <span>🚀</span>
                      <span>MISI UTAMA KARIER</span>
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-[11px] px-2 py-0.5 rounded border border-emerald-200">
                      SESI 4/8 AKTIF
                    </span>
                  </div>

                  <h4 className="font-black text-base sm:text-lg text-[#0F172A] tracking-tight">
                    Bangun Middleware JWT & Auth Guard di Gin
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Validasi token header Authorization Bearer, claim user ID, dan tangani HTTP 401 Unauthorized secara idiomatik untuk standar sistem produksi Tokyo.
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 relative z-10">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="text-[#059669] font-black">⚡ +200 XP • Kunci Stasiun 5 Docker</span>
                    <span>Modul Gin Core</span>
                  </div>

                  <Button3D
                    variant="emerald"
                    size="md"
                    fullWidth
                    onClick={() => navigate('/learn/station-3-jwt-middleware')}
                    className="text-xs py-3"
                  >
                    <span>BUKA WORKSPACE KODING 💻</span>
                  </Button3D>
                </div>
              </div>
            )}

            {/* Boss Challenge Card */}
            {(activeTab === 'all' || activeTab === 'boss') && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#FEF2F2] text-[#DC2626] font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>TANTANGAN PORTOFOLIO TOKYO</span>
                    </span>
                    <span className="bg-red-50 text-red-600 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-red-200">
                      DEADLINE 15 MEI
                    </span>
                  </div>

                  <h4 className="font-black text-base sm:text-lg text-[#0F172A] tracking-tight">
                    REST API Gin & Auth Engine JWT Standar Tokyo
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bangun microservice authentication standar produksi untuk kurasi portofolio perusahaan teknologi Jepang yang mensponsori visa kerja.
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 relative z-10">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['GOLANG', 'GIN ENGINE', 'POSTGRESQL', 'DOCKER'].map((tag) => (
                      <span key={tag} className="bg-blue-50 text-[#2563EB] font-black text-[10px] px-2 py-0.5 rounded-md border border-blue-100">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button3D
                    variant="blue"
                    size="md"
                    fullWidth
                    onClick={() => navigate('/learn/station-3-jwt-middleware')}
                    className="text-xs py-3"
                  >
                    <span>BUKA BRIEFING & SPESIFIKASI ➔</span>
                  </Button3D>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (354px width SSOT) ══════ */}
        <aside className="w-full xl:w-[354px] shrink-0 border-t-2 xl:border-t-0 xl:border-l-2 border-[#E2E8F0] bg-white p-5 sm:p-6 space-y-5">
          {/* ── 1. UNIFIED STREAK AND SCHEDULE CARD (BLUE/EMERALD HIERARCHY) ── */}
          <div className="border-2 border-slate-200 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                <h4 className="font-black text-xs text-[#0F172A]">Streak & Jadwal Live</h4>
              </div>
              <span className="bg-[#FEF2F2] text-[#DC2626] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
                <span>🔥</span>
                <span>{userStreak} Hari Aktif</span>
              </span>
            </div>

            {/* 7 Days Row */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {[
                { day: 'S', done: true },
                { day: 'S', done: true },
                { day: 'R', done: true },
                { day: 'K', active: true, date: '8' },
                { day: 'J', date: '9' },
                { day: 'S', date: '10' },
                { day: 'M', date: '11' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className={`text-[9px] font-bold ${item.active ? 'text-[#0284C7]' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-[11px] transition-all ${
                      item.done
                        ? 'bg-[#10B981] text-white shadow-2xs'
                        : item.active
                        ? 'bg-[#2563EB] text-white shadow-xs ring-2 ring-blue-200'
                        : 'bg-[#F1F5F9] text-[#475569]'
                    }`}
                  >
                    {item.done ? '✓' : item.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Event Box */}
            <div className="bg-[#EFF6FF] border border-blue-200 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-[11px] font-black text-[#1E40AF]">
                  Mock Interview Tokyo (Zoom)
                </p>
                <p className="text-[10px] text-[#2563EB] font-semibold">
                  Besok • 09:00 JST (07:00 WIB)
                </p>
              </div>
              <button
                type="button"
                className="bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-[10px] px-2.5 py-1.5 rounded-xl shrink-0 cursor-pointer shadow-xs transition-all"
              >
                Ingatkan 🔔
              </button>
            </div>
          </div>

          {/* ── 2. WEEKLY CHEST CARD (AKIHABARA REWARD POD) ── */}
          <div className="bg-[#FFFBEB] border-2 border-amber-300 rounded-3xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-600" />
                <h4 className="font-black text-xs text-[#92400E]">
                  Peti Hadiah Mingguan 🎁
                </h4>
              </div>
              <span className="bg-amber-100 text-[#B45309] font-black text-[10px] px-2 py-0.5 rounded-md">
                TIER 2 AKTIF
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-amber-950">
                  15 dari 20 Misi Tuntas
                </span>
                <span className="font-black text-amber-700 font-mono">
                  75%
                </span>
              </div>
              <ProgressBar3D value={75} max={100} variant="xp" size="sm" />
            </div>

            <p className="text-[11px] text-[#92400E] leading-relaxed">
              5 misi lagi untuk klaim Peti Emas Shibuya (+300 XP & 20 Gems).
            </p>

            <Button3D
              variant="amber"
              size="sm"
              fullWidth
              disabled={claimedChest}
              onClick={handleClaimChest}
              className="text-xs py-2"
            >
              {claimedChest ? 'PETI PERAK DIKLAIM ✓' : 'KLAIM PETI PERAK (+150 XP) ⚡'}
            </Button3D>
          </div>

          {/* ── 3. GEMS EXCHANGE SHOP (AKIHABARA ARCADE SHOP) ── */}
          <div className="border-2 border-slate-200 rounded-3xl p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-xs text-[#0F172A] flex items-center gap-1.5">
                <span>💎</span>
                <span>Toko Penukaran Gems Tokyo</span>
              </h4>
              <span className="bg-blue-50 text-[#2563EB] font-black text-[10px] px-2 py-0.5 rounded-md border border-blue-200">
                💎 {userGems} GEMS
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-[#2563EB]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Streak Freeze (1 Hari)
                    </span>
                    <span className="text-[10px] text-slate-500">Amankan streak saat libur</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerHaptic('tap')}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-[#2563EB] font-black text-[10px] px-2.5 py-1 rounded-xl cursor-pointer shadow-2xs"
                >
                  20 Gems
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Review CV Prioritas
                    </span>
                    <span className="text-[10px] text-slate-500">Review oleh IT recruiter Tokyo</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerHaptic('tap')}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-amber-700 font-black text-[10px] px-2.5 py-1 rounded-xl cursor-pointer shadow-2xs"
                >
                  100 Gems
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
