import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import {
  Search,
  Calendar,
  Shield,
  Award,
} from 'lucide-react'

export const QuestLogPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'main' | 'boss'>('all')
  const [claimedD1, setClaimedD1] = useState(false)
  const [claimedChest, setClaimedChest] = useState(false)

  const userXp = user?.xp ? (user.xp * 100).toLocaleString() : '5,400'

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex">
      {/* ── 1. LEFT 76PX NAV RAIL (SSOT: codeabroad.pen) ── */}
      <NavRail />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8">
        {/* ══════ CENTER CONTENT STAGE (1010px max / flex-1) ══════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 space-y-5">
          {/* ── 1. HEADER ROW ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                <span>Pusat Misi & Quest Log 📜</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                Tuntaskan Misi Harian & Tantangan Portofolio untuk Booster XP & Gems 💎
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
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#475569] border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── 3. DAILY QUESTS CONTAINER ── */}
          {(activeTab === 'all' || activeTab === 'daily') && (
            <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="bg-[#FFFBEB] text-[#B45309] font-black text-[10px] px-2.5 py-0.5 rounded">
                    DAILY QUESTS
                  </span>
                  <h3 className="font-black text-sm text-[#0F172A]">
                    Misi Harian Anda
                  </h3>
                </div>
                <span className="bg-[#F8FAFC] text-[#64748B] text-xs font-medium px-2.5 py-1 rounded-full border border-slate-100">
                  ⏳ Reset Tengah Malam (4j 20m)
                </span>
              </div>

              {/* Quest D1 */}
              <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-[#FEF3C7] text-[#B45309] font-black text-xs px-2.5 py-1 rounded-lg shrink-0">
                    GIN // D1
                  </span>
                  <div className="space-y-0.5 truncate">
                    <h4 className="font-black text-xs sm:text-sm text-[#0F172A] truncate">
                      Tuntaskan 1 Bab Koding Gin REST API
                    </h4>
                    <p className="text-[11px] font-bold text-[#92400E] truncate">
                      Status: 1 dari 1 Selesai (100% ✓)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-2.5 py-1 rounded-full">
                    ⚡ +50 XP • 💎 10
                  </span>
                  <button
                    type="button"
                    onClick={() => setClaimedD1(true)}
                    disabled={claimedD1}
                    className="bg-[#F59E0B] hover:bg-amber-600 active:translate-y-0.5 disabled:opacity-50 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-[0_2px_0_0_#B45309] transition-all cursor-pointer"
                  >
                    {claimedD1 ? 'Diklaim ✓' : 'Klaim Hadiah ⚡'}
                  </button>
                </div>
              </div>

              {/* Quest D2 */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-[#EFF6FF] text-[#1D4ED8] font-black text-xs px-2.5 py-1 rounded-lg shrink-0">
                    JLPT // D2
                  </span>
                  <div className="space-y-0.5 truncate">
                    <h4 className="font-black text-xs sm:text-sm text-[#0F172A] truncate">
                      Pelajari 5 Kosakata Business IT Nihongo N3
                    </h4>
                    <p className="text-[11px] font-medium text-[#64748B] truncate">
                      Status: 3 dari 5 Kosakata (Sisa 2 Lagi)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-2.5 py-1 rounded-full">
                    ⚡ +30 XP • 💎 5
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/learn/station-3-jwt-middleware')}
                    className="bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-[0_2px_0_0_#1D4ED8] transition-all cursor-pointer"
                  >
                    Lanjutkan ▶
                  </button>
                </div>
              </div>

              {/* Quest D3 */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-[#EFF6FF] text-[#1D4ED8] font-black text-xs px-2.5 py-1 rounded-lg shrink-0">
                    QUIZ // D3
                  </span>
                  <div className="space-y-0.5 truncate">
                    <h4 className="font-black text-xs sm:text-sm text-[#0F172A] truncate">
                      Selesaikan Kuis Syntax Pointer & Struct Go
                    </h4>
                    <p className="text-[11px] font-medium text-[#64748B] truncate">
                      Status: 0 dari 1 Kuis • Estimasi 5 Menit
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-2.5 py-1 rounded-full">
                    ⚡ +40 XP
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/learn/station-3-jwt-middleware')}
                    className="bg-white border border-slate-300 hover:bg-slate-50 active:translate-y-0.5 text-[#334155] font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Mulai Kuis ▶
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── 4. MAIN & BOSS QUESTS ROW ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main Career Quest Card */}
            {(activeTab === 'all' || activeTab === 'main') && (
              <div className="bg-white border-2 border-emerald-300 rounded-2xl p-5 space-y-3.5 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-[#14532D]">
                      Misi Utama Karier 🚀
                    </span>
                    <span className="bg-[#DCFCE7] text-[#1D4ED8] font-black text-[10px] px-2 py-0.5 rounded">
                      SESI 4/8 AKTIF
                    </span>
                  </div>
                  <h4 className="font-black text-base text-[#14532D]">
                    Bangun Middleware JWT & Auth Guard di Gin
                  </h4>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    Validasi token header Authorization Bearer, claim user ID, dan tangani HTTP 401 Unauthorized secara idiomatik.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-black text-[#16A34A]">⚡ +200 XP</span>
                    <span className="text-[#64748B]">• Kunci Stasiun 5 Docker</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/learn/station-3-jwt-middleware')}
                    className="w-full bg-[#22C55E] hover:bg-emerald-600 active:translate-y-0.5 text-white font-black text-xs py-3 rounded-xl shadow-[0_3px_0_0_#15803D] transition-all cursor-pointer"
                  >
                    Buka Workspace Koding 💻
                  </button>
                </div>
              </div>
            )}

            {/* Boss Challenge Card */}
            {(activeTab === 'all' || activeTab === 'boss') && (
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-[#0F172A]">
                      Tantangan Portofolio Tokyo 🏆
                    </span>
                    <span className="bg-[#FEE2E2] text-[#DC2626] font-black text-[10px] px-2 py-0.5 rounded">
                      DEADLINE 15 MEI
                    </span>
                  </div>
                  <h4 className="font-black text-base text-[#0F172A]">
                    REST API Gin & Auth Engine JWT Standar Tokyo
                  </h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Bangun microservice authentication standar produksi untuk kurasi portofolio perusahaan teknologi Jepang.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['GOLANG', 'GIN ENGINE', 'POSTGRES', 'DOCKER'].map((tag) => (
                      <span key={tag} className="bg-[#EFF6FF] text-[#2563EB] font-black text-[10px] px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/learn/station-3-jwt-middleware')}
                    className="w-full bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-xs py-3 rounded-xl shadow-[0_3px_0_0_#1D4ED8] transition-all cursor-pointer"
                  >
                    Buka Briefing & Spec ➔
                  </button>
                </div>
              </div>
            )}
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
                { day: 'S', done: true },
                { day: 'S', done: true },
                { day: 'R', done: true },
                { day: 'K', active: true, date: '8' },
                { day: 'J', date: '9' },
                { day: 'S', date: '10' },
                { day: 'M', date: '11' },
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

          {/* ── 2. WEEKLY CHEST CARD (SCREEN 09 SPECIFIC) ── */}
          <div className="bg-[#FFFBEB] border-2 border-amber-300 rounded-2xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-xs text-[#92400E]">
                Peti Hadiah Mingguan 🎁
              </h4>
              <span className="bg-[#FEF3C7] text-[#D97706] font-black text-[9px] px-2 py-0.5 rounded">
                TIER 2 AKTIF
              </span>
            </div>

            <p className="font-extrabold text-xs text-[#78350F]">
              15 dari 20 Misi Tuntas (75%)
            </p>

            <div className="w-full h-2 bg-[#FDE68A] rounded-full overflow-hidden">
              <div className="w-[75%] h-full bg-[#F59E0B] rounded-full" />
            </div>

            <p className="text-[10px] text-[#92400E] leading-relaxed">
              5 misi lagi untuk klaim Peti Emas Shibuya (+300 XP & 20 Gems).
            </p>

            <button
              type="button"
              onClick={() => setClaimedChest(true)}
              disabled={claimedChest}
              className="w-full bg-[#F59E0B] hover:bg-amber-600 active:translate-y-0.5 disabled:opacity-50 text-white font-black text-xs py-2 rounded-xl shadow-[0_2px_0_0_#B45309] transition-all cursor-pointer"
            >
              {claimedChest ? 'Peti Perak Diklaim ✓' : 'Klaim Peti Perak (+150 XP) ⚡'}
            </button>
          </div>

          {/* ── 3. GEMS EXCHANGE SHOP (SCREEN 09 SPECIFIC) ── */}
          <div className="border-2 border-slate-100 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-xs text-[#0F172A]">
                Toko Penukaran Gems 💎
              </h4>
              <span className="bg-[#EFF6FF] text-[#2563EB] font-black text-[10px] px-2 py-0.5 rounded">
                💎 45 GEMS
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#334155]">
                    Streak Freeze (1 Hari)
                  </span>
                </div>
                <span className="bg-[#EFF6FF] text-[#1D4ED8] font-bold text-[10px] px-2 py-0.5 rounded">
                  20 Gems
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#334155]">
                    Review CV Prioritas
                  </span>
                </div>
                <span className="bg-[#EFF6FF] text-[#1D4ED8] font-bold text-[10px] px-2 py-0.5 rounded">
                  100 Gems
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
