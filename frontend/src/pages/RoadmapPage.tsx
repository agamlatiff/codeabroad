import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { TokyoPassportWidget } from '../components/game/TokyoPassportWidget'
import { Button3D } from '../components/ui/Button3D'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { DoodleFire, DoodleStar, DoodleHanko } from '../components/illustrations/doodles'
import doodleCoding from '../assets/kodi/doodle-coding.png'
import {
  Search,
  Calendar,
  Lock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react'

export const RoadmapPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [unit4Expanded, setUnit4Expanded] = useState(true)

  const userXp = user?.xp ? (user.xp * 100).toLocaleString() : '5,400'
  const userStreak = user?.streak || 14
  const userName = user?.name ? user.name.split(' ')[0] : user?.username || 'Agam'

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
                <span className="text-xl sm:text-2xl">🎌</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Ekspedisi Distrik Tokyo & Silabus Go
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Target Karier Tokyo 2026 • 5 Stasiun Distrik • 40 Sesi Koding • 62% Selesai 🚀
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
                  placeholder="Cari distrik, sintaks, kuis..."
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
                  <span className="text-sm">🐼</span>
                  <span>Lv. 7 Tokyo</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. HERO ACTIVE EXPEDITION UNIT (STAGE KODI) ── */}
          <div className="rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-white to-sky-50/70 border-2 border-[#BFDBFE] p-5 sm:p-7 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 w-full lg:w-auto">
              {/* Kodi Mascot with Glass Base */}
              <div className="relative flex flex-col items-center justify-center shrink-0 group">
                <div className="w-24 h-7 bg-blue-200/50 rounded-[50%] absolute -bottom-2 z-0 blur-[1px]" />
                <img
                  src={doodleCoding}
                  alt="Kodi Coding"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative z-10 select-none drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-1"
                />
              </div>

              {/* Narrative & Info */}
              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <SpeechBubble direction="left" variant="light" className="shadow-xs py-1.5 px-3 max-w-md">
                  <span className="text-xs font-bold text-slate-800">
                    Sugoi, <strong className="text-[#2563EB]">{userName}-san</strong>! 🏙️ Distrik Shibuya siap kamu taklukkan hari ini!
                  </span>
                </SpeechBubble>

                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="bg-[#DBEAFE] text-[#1D4ED8] font-black text-[11px] px-2.5 py-0.5 rounded-md">
                      STASIUN 04 • DISTRIK SHIBUYA
                    </span>
                    <span className="text-[#047857] font-bold text-xs">
                      62% Selesai (25/40 Sesi)
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
                    Sintaks Go & Gin REST API Engine
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Bab 4: JWT Middleware & Auth Guard Tokyo • Estimasi 15 Menit
                  </p>
                </div>
              </div>
            </div>

            {/* Right Action */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end gap-2 shrink-0 w-full sm:w-auto relative z-10">
              <Button3D
                variant="blue"
                size="md"
                onClick={() => navigate('/learn/station-3-jwt-middleware')}
                className="w-full sm:w-auto text-xs px-6 py-3 shadow-[0_4px_0_0_#1D4ED8]"
              >
                <span>LANJUTKAN KODING ▶</span>
              </Button3D>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1 cursor-pointer py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Lihat Ringkasan Dashboard</span>
              </button>
            </div>
          </div>

          {/* ── 3. TOKYO DISTRICT EXPEDITION STATIONS ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
                <span>Peta Stasiun Ekspedisi Karier</span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  (5 Distrik Utama)
                </span>
              </h3>
              <span className="text-xs font-black text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                3 Distrik Lulus ✓
              </span>
            </div>

            {/* Station 01: Akihabara */}
            <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-all hover:border-slate-300">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Award className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                      STN-01 • 秋葉原
                    </span>
                    <span className="text-xs font-black text-emerald-700">8/8 Sesi Tuntas</span>
                  </div>
                  <h4 className="font-black text-sm sm:text-base text-[#0F172A] truncate">
                    Distrik Akihabara • Dasar Sintaks Go & Memory Pointer
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    Fondasi Kompilasi, Strict Typing, dan Alokasi Memori Pointer
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-3 py-1 rounded-full border border-amber-200/60">
                  ⚡ +800 XP
                </span>
                <div className="flex items-center gap-1 bg-[#DCFCE7] text-[#059669] font-black text-xs px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>LULUS</span>
                  <DoodleHanko text="合格" className="w-5 h-5 ml-1" />
                </div>
              </div>
            </div>

            {/* Station 02: Roppongi */}
            <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-all hover:border-slate-300">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Award className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                      STN-02 • 六本木
                    </span>
                    <span className="text-xs font-black text-emerald-700">8/8 Sesi Tuntas</span>
                  </div>
                  <h4 className="font-black text-sm sm:text-base text-[#0F172A] truncate">
                    Distrik Roppongi • Struct, Interface & Error Handling
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    Abstraksi Interface & Pola Idiomatic Error Standar Jepang
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-3 py-1 rounded-full border border-amber-200/60">
                  ⚡ +800 XP
                </span>
                <div className="flex items-center gap-1 bg-[#DCFCE7] text-[#059669] font-black text-xs px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>LULUS</span>
                  <DoodleHanko text="合格" className="w-5 h-5 ml-1" />
                </div>
              </div>
            </div>

            {/* Station 03: Ginza */}
            <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-all hover:border-slate-300">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Award className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                      STN-03 • 銀座
                    </span>
                    <span className="text-xs font-black text-emerald-700">9/9 Sesi Tuntas</span>
                  </div>
                  <h4 className="font-black text-sm sm:text-base text-[#0F172A] truncate">
                    Distrik Ginza • Concurrency, Goroutine & Channel Engine
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    Worker Pool Pattern untuk Sistem FinTech Skala Besar di Tokyo
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-3 py-1 rounded-full border border-amber-200/60">
                  ⚡ +1,000 XP
                </span>
                <div className="flex items-center gap-1 bg-[#DCFCE7] text-[#059669] font-black text-xs px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>LULUS</span>
                  <DoodleHanko text="合格" className="w-5 h-5 ml-1" />
                </div>
              </div>
            </div>

            {/* Station 04: Shibuya (ACTIVE EXPANDABLE) */}
            <div className="bg-white border-2 border-[#2563EB] rounded-3xl p-5 sm:p-6 space-y-4 shadow-md shadow-blue-500/10 ring-4 ring-blue-500/10">
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                onClick={() => setUnit4Expanded(!unit4Expanded)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-300 flex items-center justify-center text-[#2563EB] shrink-0">
                    <Sparkles className="w-6 h-6 fill-blue-500 text-blue-600" />
                  </div>
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#2563EB] text-white font-mono font-black text-[10px] px-2 py-0.5 rounded">
                        STN-04 • 渋谷 • AKTIF
                      </span>
                      <span className="text-xs font-bold text-[#2563EB]">4 dari 8 Sesi Tuntas (62%)</span>
                    </div>
                    <h4 className="font-black text-base sm:text-lg text-[#0F172A] truncate">
                      Distrik Shibuya • REST API Engine (Gin Framework)
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      Routing Engine, Middleware Auth, PostgreSQL & Portofolio Tokyo
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-3 py-1 rounded-full border border-amber-200">
                    ⚡ 350/400 XP
                  </span>
                  <span className="bg-[#2563EB] text-white font-black text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-xs">
                    <span>🚀 BUKA DAFTAR BAB</span>
                    {unit4Expanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                  </span>
                </div>
              </div>

              {/* Chapters list inside Shibuya */}
              {unit4Expanded && (
                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  {/* Chapter 01 */}
                  <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">
                        ✓
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        Bab 1: Setup Framework Gin & Routing Hello Shibuya
                      </span>
                    </div>
                    <span className="text-xs font-black text-[#059669] shrink-0">
                      ✓ Selesai (+50 XP)
                    </span>
                  </div>

                  {/* Chapter 02 */}
                  <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">
                        ✓
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        Bab 2: Request Binding, JSON Validation & DTO Model
                      </span>
                    </div>
                    <span className="text-xs font-black text-[#059669] shrink-0">
                      ✓ Selesai (+50 XP)
                    </span>
                  </div>

                  {/* Chapter 03 */}
                  <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">
                        ✓
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        Bab 3: Clean Architecture: Handlers, Usecase & Domain
                      </span>
                    </div>
                    <span className="text-xs font-black text-[#059669] shrink-0">
                      ✓ Selesai (+50 XP)
                    </span>
                  </div>

                  {/* Chapter 04 (ACTIVE) */}
                  <div className="bg-[#EFF6FF] border-2 border-[#2563EB] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        04
                      </span>
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-black text-[#1E3A8A] block truncate">
                          Bab 4: JWT Middleware & Auth Guard Tokyo
                        </span>
                        <span className="text-[11px] text-[#2563EB] font-bold">
                          Sedang Aktif • 15 Menit Koding
                        </span>
                      </div>
                    </div>
                    <Button3D
                      variant="blue"
                      size="sm"
                      onClick={() => navigate('/learn/station-3-jwt-middleware')}
                      className="text-xs px-4 py-2 shrink-0 shadow-[0_3px_0_0_#1D4ED8]"
                    >
                      Mulai Sekarang ▶
                    </Button3D>
                  </div>

                  {/* Chapter 05 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 opacity-60">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0">
                        05
                      </span>
                      <span className="text-xs font-medium text-slate-600 truncate">
                        Bab 5: Database Connection GORM & PostgreSQL Pooling
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 shrink-0">
                      🔒 Berikutnya
                    </span>
                  </div>

                  {/* Chapter 06: Boss Challenge */}
                  <div className="bg-[#FFFBEB] border-2 border-amber-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-[#F59E0B] text-white font-black text-xs flex items-center justify-center shrink-0">
                        🏆
                      </span>
                      <div className="truncate">
                        <span className="text-xs font-black text-amber-950 block truncate">
                          Boss Challenge: Microservice Auth Engine Portofolio
                        </span>
                        <span className="text-[10px] text-amber-800 font-bold">
                          Kunci Verifikasi Portofolio Kerja Tokyo
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#B45309] shrink-0 bg-amber-100 px-2.5 py-1 rounded-xl">
                      +400 XP ⚡
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Station 05: Tokyo Central (LOCKED FINAL GATEWAY) */}
            <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-75">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                  <Lock className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-600 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                      STN-05 • 東京駅 • GERBANG TOKYO
                    </span>
                    <span className="text-xs font-bold text-slate-500">0/7 Sesi</span>
                  </div>
                  <h4 className="font-black text-sm sm:text-base text-slate-700 truncate">
                    Distrik Tokyo Central • Docker & Cloud Gateway 🗼
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    Containerization, Mock Interview & Aktivasi Sponsor Visa Kerja
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                <span className="bg-slate-100 text-slate-500 font-black text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-200">
                  <Lock className="w-3.5 h-3.5" />
                  <span>TERKUNCI</span>
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (354px width SSOT) ══════ */}
        <aside className="w-full xl:w-[354px] shrink-0 border-t-2 xl:border-t-0 xl:border-l-2 border-[#E2E8F0] bg-white p-5 sm:p-6 space-y-5">
          {/* ── 1. UNIFIED STREAK AND SCHEDULE CARD (CLEAN BLUE/GOLD HIERARCHY) ── */}
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

            {/* Live Event Notification Box */}
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

          {/* ── 2. SKILL COMPETENCIES CARD (SCREEN 08 SPECIFIC) ── */}
          <div className="border-2 border-slate-200 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xs">
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
                  <span className="font-semibold text-slate-700">{skill.label}</span>
                  <span className={`${skill.bg} ${skill.text} font-black text-[10px] px-2.5 py-0.5 rounded-full`}>
                    {skill.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. TOKYO PASSPORT WIDGET (AUTHENTIC JAPANESE CAREER PASSPORT) ── */}
          <TokyoPassportWidget user={user} readinessScore={75} />
        </aside>
      </div>
    </div>
  )
}
