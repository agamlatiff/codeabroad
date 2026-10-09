import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../hooks'
import { NavRail } from '../components/layout/NavRail'
import {
  Search,
  MapPin,
  Award,
  Gift,
  Lock,
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
  const [claimedReward, setClaimedReward] = useState(false)
  const [claimedQuest, setClaimedQuest] = useState(false)

  const userName = user?.name || 'Agam Latifullah'
  const userXp = user?.xp ? (user.xp * 100).toLocaleString() : '5,400'

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex">
      {/* ── 1. LEFT 76PX NAV RAIL (SSOT: codeabroad.pen) ── */}
      <NavRail />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8">
        {/* ══════ CENTER CONTENT STAGE (1010px max / flex-1) ══════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 space-y-5">
          {/* ── 1. DASHBOARD HEADER ROW ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                <span>Selamat Pagi, {userName}!</span>
                <span>🎌</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                Target Hari Ini: Selesaikan 1 Sesi Koding Gin & Jaga Streak 14 Hari 🔥
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Pill */}
              <div className="relative w-56 sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari modul, kuis, kosakata..."
                  className="w-full bg-white text-xs font-medium pl-9 pr-4 py-2 rounded-2xl border-2 border-[#E2E8F0] focus:border-blue-500 focus:outline-none transition-all placeholder:text-[#94A3B8]"
                />
              </div>

              {/* Game Status HUD */}
              <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl px-3.5 py-2 flex items-center gap-3 shadow-xs">
                <div className="flex items-center gap-1.5 font-black text-xs text-[#DC2626]">
                  <span>🔥</span>
                  <span>14 Hari</span>
                </div>
                <div className="w-[1px] h-3.5 bg-[#E2E8F0]" />
                <div className="flex items-center gap-1.5 font-black text-xs text-[#D97706]">
                  <span>⚡</span>
                  <span>{userXp} XP</span>
                </div>
                <div className="w-[1px] h-3.5 bg-[#E2E8F0]" />
                <div className="flex items-center gap-1.5 font-black text-xs text-[#2563EB]">
                  <span className="text-sm">🐼</span>
                  <span>Lv. 7 Tokyo</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. HERO ACTION UNIT CARD ── */}
          <div className="rounded-2xl bg-[#EFF6FF] border-2 border-[#BFDBFE] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-[#DBEAFE] border border-blue-200 flex items-center justify-center shrink-0 text-3xl shadow-xs">
                🚀
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#DBEAFE] text-[#065F46] font-black text-[11px] px-2.5 py-0.5 rounded-md">
                    UNIT 4 • SHIBUYA ENGINE
                  </span>
                  <span className="text-[#047857] font-bold text-xs">
                    62% Selesai (25/40 Sesi)
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
                  Sintaks Go & Gin REST API Engine
                </h2>
                <p className="text-xs text-[#475569] font-medium">
                  Bab 4: Routing, JSON Binding & Middleware Controller • Estimasi 15 Menit
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/learn/station-3-jwt-middleware')}
                className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-[0_4px_0_0_#1D4ED8] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>LANJUTKAN KODING ▶</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/courses')}
                className="text-[11px] font-bold text-[#059669] hover:underline cursor-pointer"
              >
                Review Materi Lalu ↺
              </button>
            </div>
          </div>

          {/* ── 3. GAMIFIED ROADMAP SECTION ── */}
          <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 flex-wrap">
                <MapPin className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-black text-sm sm:text-base text-[#0F172A]">
                  Peta Petualangan Karier Tokyo
                </h3>
                <span className="bg-[#EFF6FF] text-[#1D4ED8] font-black text-[11px] px-2.5 py-0.5 rounded-full">
                  Stasiun 3 dari 5 Aktif 🚀
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/courses')}
                className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
              >
                Lihat Semua Stasiun ➔
              </button>
            </div>

            {/* Connecting Visual Track Line */}
            <div className="hidden sm:flex items-center px-8">
              <div className="w-3 h-3 rounded-full bg-[#1D4ED8] shrink-0" />
              <div className="flex-1 h-[3.5px] bg-[#2563EB]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] shrink-0" />
              <div className="flex-1 h-[3.5px] bg-[#F59E0B]" />
              <div className="w-4 h-4 rounded-full bg-[#2563EB] ring-4 ring-blue-100 shrink-0" />
              <div className="flex-1 h-[3.5px] bg-[#CBD5E1]" />
              <div className="w-3 h-3 rounded-full bg-[#CBD5E1] shrink-0" />
            </div>

            {/* 4 Station Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Station 1 */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
                <span className="text-[#64748B] text-xs font-extrabold">
                  Stasiun 1 • Dasar Go
                </span>
                <Award className="w-8 h-8 text-[#10B981]" />
                <span className="bg-[#DCFCE7] text-[#059669] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  ✓ Selesai (+200 XP)
                </span>
              </div>

              {/* Station 2 (Klaim) */}
              <div className="bg-[#FFFBEB] border-2 border-amber-300 rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
                <span className="bg-[#FEF3C7] text-[#B45309] text-[10px] font-black px-2 py-0.5 rounded-full">
                  Stasiun 2 • KLAIM REWARD
                </span>
                <Gift className="w-8 h-8 text-[#F59E0B] animate-bounce" />
                <button
                  type="button"
                  onClick={() => setClaimedReward(true)}
                  disabled={claimedReward}
                  className="bg-[#F59E0B] hover:bg-amber-600 active:translate-y-0.5 disabled:opacity-50 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-[0_3px_0_0_#B45309] transition-all cursor-pointer"
                >
                  {claimedReward ? 'Sudah Diklaim ✓' : 'Klaim +300 XP ⚡'}
                </button>
              </div>

              {/* Station 3 (Active) */}
              <div className="bg-[#EFF6FF] border-2 border-blue-400 rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
                <span className="bg-[#DBEAFE] text-[#047857] text-[10px] font-black px-2 py-0.5 rounded-full">
                  Stasiun 3 • SEDANG AKTIF 🚀
                </span>
                <Gift className="w-9 h-9 text-[#1D4ED8]" />
                <div className="w-32 h-1.5 bg-[#DBEAFE] rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-[#2563EB] rounded-full" />
                </div>
                <span className="text-[#065F46] text-[10px] font-extrabold">
                  350/400 XP (Sisa 50 XP)
                </span>
              </div>

              {/* Station 4 (Locked) */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2 text-center opacity-70">
                <span className="text-[#64748B] text-xs font-extrabold">
                  Stasiun 4 • Tokyo Ready
                </span>
                <Lock className="w-7 h-7 text-[#94A3B8]" />
                <span className="bg-[#F1F5F9] text-[#64748B] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  Peti Karier Tokyo 🗼
                </span>
              </div>
            </div>
          </div>

          {/* ── 4. QUESTS AND CHALLENGE ROW ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Daily Quests Box */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#D97706]" />
                  <h4 className="font-black text-sm text-[#0F172A]">
                    Misi Harian (Daily Quests)
                  </h4>
                </div>
                <span className="bg-[#FEF3C7] text-[#B45309] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  ⏳ Reset 4j 20m
                </span>
              </div>

              {/* Quest Item 1 */}
              <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                    <Code className="w-4 h-4 stroke-[2.5]" />
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
                <button
                  type="button"
                  onClick={() => setClaimedQuest(true)}
                  disabled={claimedQuest}
                  className="bg-[#F59E0B] hover:bg-amber-600 active:translate-y-0.5 disabled:opacity-50 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-[0_2px_0_0_#B45309] transition-all cursor-pointer shrink-0"
                >
                  {claimedQuest ? 'Klaim ✓' : 'Klaim ⚡'}
                </button>
              </div>

              {/* Quest Item 2 */}
              <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5 truncate">
                    <p className="font-extrabold text-xs text-[#0F172A] truncate">
                      Pelajari 5 Kosakata IT Nihongo N3
                    </p>
                    <p className="text-[#64748B] text-[10px] font-medium truncate">
                      Progress: 3/5 Selesai • +30 XP
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/learn/station-3-jwt-middleware')}
                  className="bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-[0_2px_0_0_#1D4ED8] transition-all cursor-pointer shrink-0"
                >
                  Mulai ▶
                </button>
              </div>
            </div>

            {/* Boss Challenge Box */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#DC2626]" />
                    <h4 className="font-black text-sm text-[#0F172A]">
                      Tantangan Proyek Tokyo
                    </h4>
                  </div>
                  <span className="bg-[#FEE2E2] text-[#DC2626] text-[11px] font-bold px-2 py-0.5 rounded-full">
                    Batas: 15 Mei
                  </span>
                </div>

                <h5 className="font-black text-sm sm:text-base text-[#0F172A]">
                  REST API Gin & Auth Engine JWT
                </h5>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Bangun microservice authentication standar produksi untuk portofolio perusahaan Jepang.
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#E0F2FE] text-[#00ADD8] font-black text-[10px] px-2 py-0.5 rounded">
                    GOLANG
                  </span>
                  <span className="bg-[#EFF6FF] text-[#2563EB] font-black text-[10px] px-2 py-0.5 rounded">
                    GIN ENGINE
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/learn/station-3-jwt-middleware')}
                  className="bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-xs px-4 py-2 rounded-xl shadow-[0_3px_0_0_#1D4ED8] transition-all cursor-pointer"
                >
                  Buka Editor 💻
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (354px width SSOT) ══════ */}
        <aside className="w-full xl:w-[354px] shrink-0 border-t-2 xl:border-t-0 xl:border-l-2 border-[#E2E8F0] bg-white p-5 sm:p-6 space-y-5">
          {/* ── 1. UNIFIED STREAK AND SCHEDULE CARD ── */}
          <div className="border-2 border-slate-100 rounded-2xl p-4 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                <h4 className="font-black text-xs text-[#0F172A]">Streak & Jadwal Live</h4>
              </div>
              <span className="bg-[#FEF2F2] text-[#DC2626] text-[10px] font-bold px-2 py-0.5 rounded-full">
                🔥 14 Hari Aktif
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
                  <span className={`text-[9px] font-bold ${item.active ? 'text-[#0284C7]' : 'text-[#94A3B8]'}`}>
                    {item.day}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[11px] ${
                      item.done
                        ? 'bg-[#8B5CF6] text-white shadow-2xs'
                        : item.active
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-[#F1F5F9] text-[#475569]'
                    }`}
                  >
                    {item.done ? '✓' : item.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Event Notification Box */}
            <div className="bg-[#F5F3FF] border border-purple-200 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-[11px] font-extrabold text-[#5B21B6]">
                  Mock Interview Tokyo (Zoom)
                </p>
                <p className="text-[10px] text-[#7C3AED] font-medium">
                  Besok • 09:00 JST (07:00 WIB)
                </p>
              </div>
              <button
                type="button"
                className="bg-[#7C3AED] hover:bg-purple-700 active:translate-y-0.5 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
              >
                Ingatkan 🔔
              </button>
            </div>
          </div>

          {/* ── 2. LEADERBOARD WIDGET CARD ── */}
          <div className="border-2 border-slate-100 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#D97706]" />
                <h4 className="font-black text-xs text-[#0F172A]">Liga Shibuya (Divisi Diamond)</h4>
              </div>
              <span className="bg-[#FEF3C7] text-[#B45309] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                Top 3 Promosi
              </span>
            </div>

            {/* User Row 1 */}
            <div className="bg-[#EFF6FF] rounded-xl p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs">🥇</span>
                <span className="text-xs">🐼</span>
                <span className="font-extrabold text-xs text-[#1D4ED8]">{userName} (Anda)</span>
              </div>
              <span className="font-extrabold text-xs text-[#1E40AF]">5,400 XP</span>
            </div>

            {/* Row 2 */}
            <div className="p-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs">🥈</span>
                <span className="w-5 h-5 rounded-md bg-slate-100 text-[#64748B] text-[9px] font-bold flex items-center justify-center">
                  KT
                </span>
                <span className="font-semibold text-xs text-[#334155]">Kenji Tanaka</span>
              </div>
              <span className="text-xs text-[#64748B] font-medium">5,120 XP</span>
            </div>

            {/* Row 3 */}
            <div className="p-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs">🥉</span>
                <span className="w-5 h-5 rounded-md bg-slate-100 text-[#64748B] text-[9px] font-bold flex items-center justify-center">
                  SW
                </span>
                <span className="font-semibold text-xs text-[#334155]">Sarah Wijaya</span>
              </div>
              <span className="text-xs text-[#64748B] font-medium">4,850 XP</span>
            </div>
          </div>

          {/* ── 3. PASSPORT CARD (LIGHT MODE) ── */}
          <div className="border-2 border-slate-100 rounded-2xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🇯🇵</span>
                <h4 className="font-black text-[10px] text-[#0369A1] tracking-wider uppercase">
                  PASPOR KARIER TOKYO
                </h4>
              </div>
              <span className="bg-[#FEE2E2] text-[#DC2626] font-black text-[9px] px-2 py-0.5 rounded-full">
                合格 VERIFIED
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-black text-xs sm:text-sm text-[#0F172A]">
                75% Siap Kerja di Jepang
              </span>
              <span className="bg-[#EFF6FF] text-[#0284C7] font-extrabold text-[10px] px-1.5 py-0.5 rounded-md">
                CGK ✈️ HND
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="w-[75%] h-full bg-[#0284C7] rounded-full" />
            </div>

            <p className="text-[10px] text-[#64748B] leading-relaxed">
              1 modul Go & 1 sesi interview lagi untuk aktivasi sponsor visa kerja.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
