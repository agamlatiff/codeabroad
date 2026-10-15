import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { useQuests, type QuestTab } from '../hooks/useQuests'
import { Button3D } from '../components/ui/Button3D'
import { ProgressBar3D } from '../components/ui/ProgressBar3D'
import { DoodleFire, DoodleStar } from '../components/illustrations/doodles'
import { triggerHaptic } from '../utils/haptics'
import {
  MagnifyingGlass,
  CalendarBlank,
  ShieldCheck,
  Medal,
  Sparkle,
  Gift,
  Trophy,
  Hourglass,
} from '@phosphor-icons/react'

export const QuestLogPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const {
    activeTab,
    setActiveTab,
    quests,
    dailyQuests,
    timeLeft,
    completedCount,
    totalCount,
    isLoading,
  } = useQuests()

  const [searchQuery, setSearchQuery] = useState('')
  const [claimedD1, setClaimedD1] = useState(false)
  const [claimedChest, setClaimedChest] = useState(false)
  const [userGems, setUserGems] = useState<number>(() => (typeof user?.gems === 'number' ? user.gems : 45))

  // Real user stats without artificial * 100 multiplication
  const userXp = typeof user?.xp === 'number' ? user.xp.toLocaleString() : '0'
  const userStreak = typeof user?.streak === 'number' ? user.streak : 0

  const handleClaimD1 = () => {
    triggerHaptic('success')
    setClaimedD1(true)
    setUserGems((prev: number) => prev + 10)
  }

  const handleClaimChest = () => {
    triggerHaptic('success')
    setClaimedChest(true)
    setUserGems((prev: number) => prev + 15)
  }

  // Filter daily quests based on search query
  const filteredDaily = useMemo(() => {
    const list = dailyQuests.length > 0 ? dailyQuests : [
      {
        id: 'daily-gin-handler',
        title: 'Tuntaskan 1 Bab Koding Gin REST API',
        chip_label: 'GIN REST API',
        type: 'daily' as const,
        difficulty: 'Pemula',
        xp_reward: 50,
        estimated_minutes: 15,
        order_index: 1,
        is_active: true,
        user_status: claimedD1 ? ('completed' as const) : ('available' as const),
        user_tests_passed: 1,
        user_total_tests: 1,
        created_at: '',
        updated_at: '',
      },
      {
        id: 'daily-nihongo-standup',
        title: 'Pelajari 5 Kosakata Business IT Nihongo N3',
        chip_label: 'JLPT N3',
        type: 'daily' as const,
        difficulty: 'Mudah',
        xp_reward: 30,
        estimated_minutes: 5,
        order_index: 2,
        is_active: true,
        user_status: 'available' as const,
        user_tests_passed: 0,
        user_total_tests: 1,
        created_at: '',
        updated_at: '',
      },
      {
        id: 'daily-pointer-quiz',
        title: 'Selesaikan Kuis Syntax Pointer & Struct Go',
        chip_label: 'KUIS CEPAT',
        type: 'daily' as const,
        difficulty: 'Mudah',
        xp_reward: 40,
        estimated_minutes: 5,
        order_index: 3,
        is_active: true,
        user_status: 'available' as const,
        user_tests_passed: 0,
        user_total_tests: 1,
        created_at: '',
        updated_at: '',
      },
    ]

    if (!searchQuery.trim()) return list
    const q = searchQuery.toLowerCase()
    return list.filter(
      (item) => item.title.toLowerCase().includes(q) || item.chip_label.toLowerCase().includes(q)
    )
  }, [dailyQuests, searchQuery, claimedD1])

  const mainQuests = useMemo(() => {
    return quests.filter((q) => q.type === 'main')
  }, [quests])

  const sideQuests = useMemo(() => {
    return quests.filter((q) => q.type === 'side')
  }, [quests])

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
                  Pusat Misi & Tantangan Koding
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Tuntaskan Misi Harian & Tantangan Portofolio untuk Booster XP, Gems 💎 & Sponsor Visa Tokyo
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Pill */}
              <div className="relative w-56 sm:w-64">
                <MagnifyingGlass weight="bold" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari misi harian, kuis, modul..."
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
              { id: 'all' as QuestTab, label: `Semua Misi (${totalCount || 6})` },
              { id: 'daily' as QuestTab, label: `Misi Harian ⚡ (${filteredDaily.length})` },
              { id: 'main' as QuestTab, label: `Misi Utama 🚀 (${mainQuests.length || 2})` },
              { id: 'side' as QuestTab, label: `Tantangan Portofolio 🏆 (${sideQuests.length || 1})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setActiveTab(tab.id)
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

          {/* ── 3. DAILY QUESTS CONTAINER ── */}
          {(activeTab === 'all' || activeTab === 'daily') && (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-[#D97706] flex items-center justify-center shrink-0">
                    <Sparkle weight="fill" className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-[#0F172A]">
                        Misi Harian (Daily Quests)
                      </h3>
                      {isLoading && (
                        <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      Reset setiap pukul 00:00 JST (22:00 WIB) • Bonus XP pengganda streak
                    </p>
                  </div>
                </div>

                <span className="bg-[#FFFBEB] text-[#B45309] text-xs font-black px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                  <Hourglass weight="bold" className="w-3.5 h-3.5" />
                  <span>Sisa Waktu: {timeLeft}</span>
                </span>
              </div>

              {/* Dynamic Daily Quests List */}
              <div className="space-y-3">
                {filteredDaily.map((questItem, idx) => {
                  const isDone = questItem.user_status === 'completed' || (idx === 0 && claimedD1)
                  return (
                    <div
                      key={questItem.id}
                      className={`border-2 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-transform hover:-translate-y-0.5 shadow-2xs ${
                        isDone
                          ? 'bg-[#FFFBEB] border-amber-300'
                          : 'bg-white border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                            isDone
                              ? 'bg-amber-100 border-amber-300 text-amber-700'
                              : 'bg-blue-50 border-blue-200 text-[#2563EB]'
                          }`}
                        >
                          D{idx + 1}
                        </div>
                        <div className="space-y-0.5 truncate">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-black text-[10px] px-2 py-0.5 rounded ${
                                isDone
                                  ? 'bg-amber-200/60 text-amber-900'
                                  : 'bg-blue-100 text-[#1D4ED8]'
                              }`}
                            >
                              {questItem.chip_label}
                            </span>
                            {isDone ? (
                              <span className="text-xs font-black text-emerald-700">✓ Selesai 100%</span>
                            ) : (
                              <span className="text-xs font-medium text-slate-400">
                                Estimasi {questItem.estimated_minutes} Menit
                              </span>
                            )}
                          </div>
                          <h4 className="font-black text-xs sm:text-sm text-[#0F172A] truncate">
                            {questItem.title}
                          </h4>
                          <p className="text-[11px] font-medium text-slate-500">
                            Hadiah: ⚡ +{questItem.xp_reward} XP • 💎 10 Gems
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                        {isDone ? (
                          <Button3D
                            variant="amber"
                            size="sm"
                            disabled={claimedD1}
                            onClick={handleClaimD1}
                            className="text-xs px-4 py-2"
                          >
                            {claimedD1 ? 'HADIAH DIKLAIM ✓' : 'KLAIM HADIAH ⚡'}
                          </Button3D>
                        ) : (
                          <Button3D
                            variant="blue"
                            size="sm"
                            onClick={() => navigate(`/learn/${questItem.id}`)}
                            className="text-xs px-4 py-2"
                          >
                            Mulai Misi ▶
                          </Button3D>
                        )}
                      </div>
                    </div>
                  )
                })}
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
                      PART 1 AKTIF
                    </span>
                  </div>

                  <h4 className="font-black text-base sm:text-lg text-[#0F172A] tracking-tight">
                    {mainQuests[0]?.title || 'Part 1: Variabel & Tipe Data Golang'}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {mainQuests[0]?.story_context || mainQuests[0]?.description || 'Pelajari deklarasi variabel, zero value, dan konversi tipe data yang menjadi fondasi microservices di Tokyo.'}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 relative z-10">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="text-[#059669] font-black">
                      ⚡ +{mainQuests[0]?.xp_reward || 50} XP • Standar IT Tokyo
                    </span>
                    <span>Modul Unit 1</span>
                  </div>

                  <Button3D
                    variant="emerald"
                    size="md"
                    fullWidth
                    onClick={() => navigate(`/learn/${mainQuests[0]?.id || 'part-1-variabel-dan-tipe-data'}`)}
                    className="text-xs py-3"
                  >
                    <span>BUKA WORKSPACE KODING 💻</span>
                  </Button3D>
                </div>
              </div>
            )}

            {/* Boss / Portfolio Challenge Card */}
            {(activeTab === 'all' || activeTab === 'side') && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#FEF2F2] text-[#DC2626] font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                      <Trophy weight="fill" className="w-3.5 h-3.5" />
                      <span>TANTANGAN PORTOFOLIO TOKYO</span>
                    </span>
                    <span className="bg-red-50 text-red-600 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-red-200">
                      KURASI VISA
                    </span>
                  </div>

                  <h4 className="font-black text-base sm:text-lg text-[#0F172A] tracking-tight">
                    REST API Gin & Auth Engine Standar Tokyo
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
                    onClick={() => navigate('/learn/part-4-gin-routing')}
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
                <CalendarBlank weight="bold" className="w-4 h-4 text-[#2563EB]" />
                <h4 className="font-black text-xs text-[#0F172A]">Streak & Jadwal Live</h4>
              </div>
              <span className="bg-[#FEF2F2] text-[#DC2626] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
                <span>🔥</span>
                <span>{userStreak} Hari Aktif</span>
              </span>
            </div>

            {/* 7 Days Row */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, idx) => {
                const isCompletedDay = idx < Math.min(userStreak, 7) - 1
                const isCurrentDay = idx === Math.min(userStreak, 7) - 1
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className={`text-[9px] font-bold ${isCurrentDay ? 'text-[#0284C7]' : 'text-slate-400'}`}>
                      {day}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-[11px] transition-all ${
                        isCompletedDay
                          ? 'bg-[#10B981] text-white shadow-2xs'
                          : isCurrentDay
                          ? 'bg-[#2563EB] text-white shadow-xs ring-2 ring-blue-200'
                          : 'bg-[#F1F5F9] text-[#475569]'
                      }`}
                    >
                      {isCompletedDay || isCurrentDay ? '✓' : idx + 1}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Live Event Box */}
            <div className="bg-[#EFF6FF] border border-blue-200 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-[11px] font-black text-[#1E40AF]">
                  Mock Technical Interview Tokyo
                </p>
                <p className="text-[10px] text-[#2563EB] font-semibold">
                  Sabtu • 09:00 JST (07:00 WIB)
                </p>
              </div>
              <button
                type="button"
                onClick={() => triggerHaptic('tap')}
                className="bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-[10px] px-2.5 py-1.5 rounded-xl shrink-0 cursor-pointer shadow-xs transition-all"
              >
                Ingatkan 🔔
              </button>
            </div>
          </div>

          {/* ── 2. WEEKLY CHEST CARD ── */}
          <div className="bg-[#FFFBEB] border-2 border-amber-300 rounded-3xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift weight="fill" className="w-4 h-4 text-amber-600" />
                <h4 className="font-black text-xs text-[#92400E]">
                  Peti Hadiah Mingguan 🎁
                </h4>
              </div>
              <span className="bg-amber-100 text-[#B45309] font-black text-[10px] px-2 py-0.5 rounded-md">
                TIER 1 AKTIF
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-amber-950">
                  {completedCount} dari 10 Misi Tuntas
                </span>
                <span className="font-black text-amber-700 font-mono">
                  {Math.min(100, Math.round((completedCount / 10) * 100))}%
                </span>
              </div>
              <ProgressBar3D
                value={Math.min(100, Math.round((completedCount / 10) * 100))}
                max={100}
                variant="xp"
                size="sm"
              />
            </div>

            <p className="text-[11px] text-[#92400E] leading-relaxed">
              Tuntaskan {Math.max(0, 10 - completedCount)} misi lagi untuk klaim Peti Emas (+300 XP & 20 Gems).
            </p>

            <Button3D
              variant="amber"
              size="sm"
              fullWidth
              disabled={claimedChest || completedCount < 10}
              onClick={handleClaimChest}
              className="text-xs py-2"
            >
              {claimedChest
                ? 'PETI DIKLAIM ✓'
                : completedCount >= 10
                ? 'KLAIM PETI EMAS (+300 XP) ⚡'
                : 'KLAIM PETI (BELUM MEMENUHI)'}
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
                    <ShieldCheck weight="bold" className="w-4 h-4" />
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
                    <Medal weight="bold" className="w-4 h-4" />
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
