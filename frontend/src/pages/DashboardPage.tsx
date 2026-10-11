import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../hooks'
import { NavRail } from '../components/layout/NavRail'
import {
  KodiHeroStage,
  YamanoteRailTrack,
  TokyoPassportWidget,
} from '../components/game'
import { Button3D } from '../components/ui/Button3D'
import { DoodleFire, DoodleStar } from '../components/illustrations/doodles'
import { triggerHaptic } from '../utils/haptics'
import {
  Search,
  Target,
  Flame,
  Code,
  Sparkles,
  Calendar,
  Trophy,
} from 'lucide-react'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { profile } = useDashboard()
  const { user } = profile
  const [searchQuery, setSearchQuery] = useState('')
  const [claimedQuest, setClaimedQuest] = useState(false)

  const userName = user?.name || user?.username || 'Agam Latifullah'
  const userXp = user?.xp ? (user.xp * 100).toLocaleString() : '5,400'
  const userStreak = user?.streak ?? 14

  const handleClaimDailyQuest = () => {
    triggerHaptic('success')
    setClaimedQuest(true)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex">
      {/* ── 1. LEFT 76PX NAV RAIL (SSOT) ── */}
      <NavRail />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8">
        {/* ══════ CENTER CONTENT STAGE (1010px flex-1) ══════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 space-y-6">
          {/* ── 1. DASHBOARD HEADER ROW ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                <span>Selamat Pagi, {userName}!</span>
                <span>🎌</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Target Hari Ini: Selesaikan 1 Sesi Koding Gin & Jaga Streak {userStreak} Hari 🔥
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
                  placeholder="Cari modul, kuis, kosakata..."
                  className="w-full bg-white text-xs font-medium pl-9 pr-4 py-2.5 rounded-2xl border-2 border-slate-200/90 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                />
              </div>

              {/* Game Status HUD with Animated Doodles */}
              <div className="bg-white border-2 border-slate-200/90 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-xs">
                {/* Streak Fire */}
                <div className="flex items-center gap-1.5 font-black text-xs text-orange-600">
                  <DoodleFire className="w-4 h-4" />
                  <span>{userStreak} Hari</span>
                </div>
                <div className="w-[1px] h-3.5 bg-slate-200" />

                {/* XP Star */}
                <div className="flex items-center gap-1.5 font-black text-xs text-amber-600">
                  <DoodleStar className="w-4 h-4" />
                  <span>{userXp} XP</span>
                </div>
                <div className="w-[1px] h-3.5 bg-slate-200" />

                {/* Kodi Companion Level */}
                <div className="flex items-center gap-1.5 font-black text-xs text-[#2563EB]">
                  <span className="text-sm">🐼</span>
                  <span>Lv. {user?.current_level ?? 7} Tokyo</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. KODI HERO STAGE (INTERACTIVE 3D COMPANION) ── */}
          <KodiHeroStage
            user={user}
            trackTitle="Sintaks Go & Gin REST API Engine"
            chapterTitle="Bab 4: Routing, JSON Binding & Middleware Controller"
            unitTag="UNIT 4 • SHIBUYA ENGINE"
            progressPercentage={62}
            timeEstimate="15 Menit"
          />

          {/* ── 3. YAMANOTE METRO RAILWAY TRACK (GAME ADVENTURE MAP) ── */}
          <YamanoteRailTrack currentStation={3} />

          {/* ── 4. QUESTS & BOSS CHALLENGE ROW ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Daily Quests Box */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#D97706]" />
                  <h4 className="font-black text-sm text-[#0F172A]">
                    Misi Harian (Daily Quests)
                  </h4>
                </div>
                <span className="bg-[#FEF3C7] text-[#B45309] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  ⏳ Reset 4j 20m
                </span>
              </div>

              {/* Quest Item 1 */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#0284C7] flex items-center justify-center shrink-0">
                    <Code className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5 truncate">
                    <p className="font-extrabold text-xs text-[#0F172A] truncate">
                      Tuntaskan 1 Bab Koding Gin
                    </p>
                    <p className="text-[#059669] text-[10px] font-bold truncate">
                      Selesai ✓ • Hadiah: +50 XP & 10 Gems
                    </p>
                  </div>
                </div>
                <Button3D
                  variant="amber"
                  size="sm"
                  disabled={claimedQuest}
                  onClick={handleClaimDailyQuest}
                  className="text-[10px] py-1.5 px-3.5 shrink-0"
                >
                  {claimedQuest ? 'KLAIM ✓' : 'KLAIM ⚡'}
                </Button3D>
              </div>

              {/* Quest Item 2 */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5 truncate">
                    <p className="font-extrabold text-xs text-[#0F172A] truncate">
                      Pelajari 5 Kosakata IT Nihongo N3
                    </p>
                    <p className="text-slate-500 text-[10px] font-medium truncate">
                      Progress: 3/5 Selesai • +30 XP
                    </p>
                  </div>
                </div>
                <Button3D
                  variant="blue"
                  size="sm"
                  onClick={() => navigate('/learn/station-3-jwt-middleware')}
                  className="text-[10px] py-1.5 px-4 shrink-0"
                >
                  MULAI ▶
                </Button3D>
              </div>
            </div>

            {/* Boss Challenge Box */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#DC2626]" />
                    <h4 className="font-black text-sm text-[#0F172A]">
                      Tantangan Portofolio Tokyo 🏆
                    </h4>
                  </div>
                  <span className="bg-[#FEE2E2] text-[#DC2626] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    DEADLINE: 15 MEI
                  </span>
                </div>

                <h5 className="font-black text-sm sm:text-base text-[#0F172A]">
                  REST API Gin & Auth Engine JWT Standar Tokyo
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bangun microservice authentication standar produksi untuk kurasi portofolio perusahaan teknologi Jepang (Mercari / LINE).
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="bg-sky-50 text-[#00ADD8] border border-sky-200 font-black text-[10px] px-2 py-0.5 rounded-md">
                    GOLANG
                  </span>
                  <span className="bg-blue-50 text-[#2563EB] border border-blue-200 font-black text-[10px] px-2 py-0.5 rounded-md">
                    GIN ENGINE
                  </span>
                </div>
                <Button3D
                  variant="blue"
                  size="sm"
                  onClick={() => navigate('/learn/station-3-jwt-middleware')}
                  className="text-xs px-4 py-2"
                >
                  BUKA EDITOR 💻
                </Button3D>
              </div>
            </div>
          </div>
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (354px width) ══════ */}
        <aside className="w-full xl:w-[354px] shrink-0 border-t-2 xl:border-t-0 xl:border-l-2 border-[#E2E8F0] bg-white p-5 sm:p-6 space-y-5">
          {/* ── 1. UNIFIED STREAK AND SCHEDULE CARD ── */}
          <div className="border-2 border-slate-200/90 rounded-3xl p-4 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                <h4 className="font-black text-xs text-[#0F172A]">Streak & Jadwal Live</h4>
              </div>
              <span className="bg-[#FEF2F2] text-[#DC2626] text-[10px] font-bold px-2 py-0.5 rounded-full">
                🔥 {userStreak} Hari Aktif
              </span>
            </div>

            {/* 7 Days Row */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {[
                { day: 'S', done: true, label: 'Sen' },
                { day: 'S', done: true, label: 'Sel' },
                { day: 'R', done: true, label: 'Rab' },
                { day: 'K', active: true, date: '8', label: 'Kam' },
                { day: 'J', date: '9', label: 'Jum' },
                { day: 'S', date: '10', label: 'Sab' },
                { day: 'M', date: '11', label: 'Min' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className={`text-[9px] font-bold ${item.active ? 'text-[#0284C7]' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-[11px] ${
                      item.done
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : item.active
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.done ? '✓' : item.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Event Notification Box */}
            <div className="bg-[#F5F3FF] border border-purple-200 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-[11px] font-extrabold text-purple-900">
                  Mock Interview Tokyo (Zoom)
                </p>
                <p className="text-[10px] text-purple-700 font-medium">
                  Besok • 09:00 JST (07:00 WIB)
                </p>
              </div>
              <button
                type="button"
                className="bg-purple-600 hover:bg-purple-700 active:translate-y-0.5 text-white font-bold text-[10px] px-2.5 py-1 rounded-xl shrink-0 cursor-pointer shadow-2xs"
              >
                Ingatkan 🔔
              </button>
            </div>
          </div>

          {/* ── 2. LEADERBOARD PODIUM CARD (LIGA SHIBUYA) ── */}
          <div className="border-2 border-slate-200/90 rounded-3xl p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#D97706]" />
                <h4 className="font-black text-xs text-[#0F172A]">Liga Shibuya (Divisi Diamond)</h4>
              </div>
              <span className="bg-[#FEF3C7] text-[#B45309] text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                Top 3 Promosi
              </span>
            </div>

            <div className="space-y-1.5">
              {/* User Row 1 (Gold 🥇) */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🥇</span>
                  <span className="text-sm">🐼</span>
                  <span className="font-extrabold text-xs text-[#1D4ED8]">{userName} (Anda)</span>
                </div>
                <span className="font-extrabold text-xs text-[#1E40AF]">5,400 XP</span>
              </div>

              {/* Row 2 (Silver 🥈) */}
              <div className="p-2 flex items-center justify-between rounded-xl hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🥈</span>
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-bold flex items-center justify-center">
                    KT
                  </span>
                  <span className="font-semibold text-xs text-slate-700">Kenji Tanaka</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">5,120 XP</span>
              </div>

              {/* Row 3 (Bronze 🥉) */}
              <div className="p-2 flex items-center justify-between rounded-xl hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🥉</span>
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-bold flex items-center justify-center">
                    SW
                  </span>
                  <span className="font-semibold text-xs text-slate-700">Sarah Wijaya</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">4,850 XP</span>
              </div>
            </div>
          </div>

          {/* ── 3. TOKYO PASSPORT WIDGET (BOARDING PASS & HANKO) ── */}
          <TokyoPassportWidget user={user} readinessScore={75} />
        </aside>
      </div>
    </div>
  )
}
