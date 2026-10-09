import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import {
  Search,
  Calendar,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

export const RoadmapPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [unit4Expanded, setUnit4Expanded] = useState(true)

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
                <span>Kurikulum & Silabus Backend Go 🎌</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                Target Karier Tokyo 2026 • 5 Unit • 40 Sesi • 62% Selesai 🚀
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
              <div className="w-20 h-20 rounded-2xl bg-[#DCFCE7] border border-emerald-200 flex items-center justify-center shrink-0 text-3xl shadow-xs">
                🚀
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#DCFCE7] text-[#1D4ED8] font-black text-[11px] px-2.5 py-0.5 rounded-md">
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
                onClick={() => navigate('/dashboard')}
                className="text-[11px] font-bold text-[#059669] hover:underline cursor-pointer"
              >
                Review Materi Lalu ↺
              </button>
            </div>
          </div>

          {/* ── 3. CURRICULUM UNITS STACK ── */}
          <div className="space-y-3">
            {/* Unit 1 */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="bg-[#EFF6FF] text-[#1D4ED8] font-black text-xs px-2.5 py-1 rounded-lg shrink-0">
                  GO // 01
                </span>
                <div className="space-y-0.5 truncate">
                  <h3 className="font-black text-sm sm:text-base text-[#0F172A] truncate">
                    Unit 1 • Dasar Sintaks Go & Memory Pointer
                  </h3>
                  <p className="text-xs text-[#64748B] truncate">
                    8 dari 8 Sesi Selesai • Fondasi Kompilasi & Strict Typing
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-3 py-1 rounded-full">
                  ⚡ +800 XP
                </span>
                <span className="bg-[#F0F9FF] text-[#0284C7] font-black text-xs px-3 py-1 rounded-full">
                  ✓ LULUS
                </span>
              </div>
            </div>

            {/* Unit 2 */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="bg-[#EFF6FF] text-[#1D4ED8] font-black text-xs px-2.5 py-1 rounded-lg shrink-0">
                  GO // 02
                </span>
                <div className="space-y-0.5 truncate">
                  <h3 className="font-black text-sm sm:text-base text-[#0F172A] truncate">
                    Unit 2 • Struct, Interface & Idiomatic Error Handling
                  </h3>
                  <p className="text-xs text-[#64748B] truncate">
                    8 dari 8 Sesi Selesai • Pola Interface Abstraction Standar Industri
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-3 py-1 rounded-full">
                  ⚡ +800 XP
                </span>
                <span className="bg-[#F0F9FF] text-[#0284C7] font-black text-xs px-3 py-1 rounded-full">
                  ✓ LULUS
                </span>
              </div>
            </div>

            {/* Unit 3 */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="bg-[#EFF6FF] text-[#1D4ED8] font-black text-xs px-2.5 py-1 rounded-lg shrink-0">
                  GO // 03
                </span>
                <div className="space-y-0.5 truncate">
                  <h3 className="font-black text-sm sm:text-base text-[#0F172A] truncate">
                    Unit 3 • Concurrency, Goroutine & Channel Engine
                  </h3>
                  <p className="text-xs text-[#64748B] truncate">
                    9 dari 9 Sesi Selesai • Worker Pool Pattern Tokyo Enterprise
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-3 py-1 rounded-full">
                  ⚡ +1,000 XP
                </span>
                <span className="bg-[#F0F9FF] text-[#0284C7] font-black text-xs px-3 py-1 rounded-full">
                  ✓ LULUS
                </span>
              </div>
            </div>

            {/* Unit 4 Card - Active Expanded */}
            <div className="bg-white border-2 border-blue-400 rounded-2xl p-5 space-y-4 shadow-sm">
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                onClick={() => setUnit4Expanded(!unit4Expanded)}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="bg-[#2563EB] text-white font-black text-xs px-2.5 py-1 rounded-lg shrink-0">
                    GIN // 04
                  </span>
                  <div className="space-y-0.5 truncate">
                    <h3 className="font-black text-base text-[#0F172A] truncate">
                      Unit 4 • Shibuya REST API Engine (Gin Framework)
                    </h3>
                    <p className="text-xs text-[#2563EB] font-bold truncate">
                      Modul Aktif • 4 dari 8 Sesi Tuntas (62% Selesai) • Estimasi 2 Hari
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-3 py-1 rounded-full">
                    ⚡ 350/400 XP
                  </span>
                  <span className="bg-[#2563EB] text-white font-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <span>🚀 AKTIF BERJALAN</span>
                    {unit4Expanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                  </span>
                </div>
              </div>

              {/* Chapters Inside Unit 4 */}
              {unit4Expanded && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {/* Chapter 01 */}
                  <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="bg-[#E0F2FE] text-[#0284C7] font-black text-xs px-2 py-0.5 rounded shrink-0">
                        ✓ 01
                      </span>
                      <span className="text-xs font-semibold text-[#334155] truncate">
                        Setup Framework Gin & Routing Hello Shibuya
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#0284C7] shrink-0">
                      ✓ Selesai
                    </span>
                  </div>

                  {/* Chapter 02 */}
                  <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="bg-[#E0F2FE] text-[#0284C7] font-black text-xs px-2 py-0.5 rounded shrink-0">
                        ✓ 02
                      </span>
                      <span className="text-xs font-semibold text-[#334155] truncate">
                        Request Binding, JSON Validation & DTO Model
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#0284C7] shrink-0">
                      ✓ Selesai
                    </span>
                  </div>

                  {/* Chapter 03 */}
                  <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="bg-[#E0F2FE] text-[#0284C7] font-black text-xs px-2 py-0.5 rounded shrink-0">
                        ✓ 03
                      </span>
                      <span className="text-xs font-semibold text-[#334155] truncate">
                        Clean Architecture: Handlers, Usecase & Domain
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#0284C7] shrink-0">
                      ✓ Selesai
                    </span>
                  </div>

                  {/* Chapter 04 (ACTIVE) */}
                  <div className="bg-[#EFF6FF] border-2 border-[#2563EB] rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="bg-[#2563EB] text-white font-black text-xs px-2 py-0.5 rounded shrink-0">
                        04
                      </span>
                      <span className="text-xs font-black text-[#1E3A8A] truncate">
                        JWT Middleware & Auth Guard Tokyo
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/learn/station-3-jwt-middleware')}
                      className="bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-[0_2px_0_0_#1D4ED8] transition-all cursor-pointer shrink-0"
                    >
                      Mulai (15m) ▶
                    </button>
                  </div>

                  {/* Chapter 05 */}
                  <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-3 opacity-60">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="bg-[#F1F5F9] text-[#64748B] font-black text-xs px-2 py-0.5 rounded shrink-0">
                        05
                      </span>
                      <span className="text-xs font-medium text-[#94A3B8] truncate">
                        Database Connection GORM & PostgreSQL Pooling
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#94A3B8] shrink-0">
                      +250 XP
                    </span>
                  </div>

                  {/* Chapter 06 (Boss Challenge) */}
                  <div className="bg-[#FFFBEB] border border-amber-300 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="bg-[#F59E0B] text-white font-black text-xs px-2 py-0.5 rounded shrink-0">
                        🏆
                      </span>
                      <span className="text-xs font-black text-[#78350F] truncate">
                        Boss Challenge: Microservice Auth Engine Portofolio
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#B45309] shrink-0">
                      Tantangan • +400 XP
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Unit 5 Card - Locked */}
            <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-75">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="bg-[#F1F5F9] text-[#94A3B8] font-black text-xs px-2.5 py-1 rounded-lg shrink-0">
                  CLOUD // 05
                </span>
                <div className="space-y-0.5 truncate">
                  <h3 className="font-black text-sm sm:text-base text-[#64748B] truncate flex items-center gap-2">
                    <span>Unit 5 • Docker Containerization & Cloud Deployment Tokyo</span>
                  </h3>
                  <p className="text-xs text-[#94A3B8] truncate">
                    0 dari 7 Sesi • Terbuka otomatis setelah menyelesaikan Unit 4
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="bg-[#F1F5F9] text-[#64748B] font-black text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>TERKUNCI</span>
                </span>
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

          {/* ── 2. SKILL COMPETENCIES CARD (SCREEN 08 SPECIFIC) ── */}
          <div className="border-2 border-slate-100 rounded-2xl p-4 space-y-3 shadow-xs">
            <h4 className="font-black text-xs text-[#0F172A]">
              Kompetensi Standar Tokyo 🇯🇵
            </h4>

            <div className="space-y-2.5">
              {[
                { label: 'Golang Core & Memory', badge: 'Mahir 100%', bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]' },
                { label: 'Concurrency Engine', badge: 'Mahir 100%', bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]' },
                { label: 'REST API & Gin Engine', badge: 'Aktif 60%', bg: 'bg-[#DBEAFE]', text: 'text-[#2563EB]' },
                { label: 'PostgreSQL & GORM', badge: 'Next (0%)', bg: 'bg-[#F1F5F9]', text: 'text-[#94A3B8]' },
                { label: 'Business IT Nihongo N3', badge: 'Aktif 45%', bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]' },
              ].map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#334155]">{skill.label}</span>
                  <span className={`${skill.bg} ${skill.text} font-black text-[10px] px-2 py-0.5 rounded-full`}>
                    {skill.badge}
                  </span>
                </div>
              ))}
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
