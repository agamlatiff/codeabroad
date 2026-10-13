import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboard, useQuests } from '../hooks'
import { NavRail } from '../components/layout/NavRail'
import {
  CurriculumPathMap,
  TechNihongoCard,
  CourseSwitcherModal,
  CAREER_TRACKS,
} from '../components/game'
import { Button3D } from '../components/ui/Button3D'
import { triggerHaptic } from '../utils/haptics'
import {
  MagnifyingGlass,
  Target,
  Fire,
  Star,
  Clock,
  CheckCircle,
  Code,
  CaretDown,
  Translate,
  Lightning,
  Gift,
} from '@phosphor-icons/react'
import {
  GolangLogo,
  ReactLogo,
  DockerLogo,
  FundamentalLogo,
  TechNihongoLogo,
} from '../components/ui/BrandLogos'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { profile } = useDashboard()
  const { user } = profile
  const { dailyQuests, quests, timeLeft } = useQuests()
  const [searchQuery, setSearchQuery] = useState('')
  const [claimedLocalQuest, setClaimedLocalQuest] = useState(false)
  const [activeTrack, setActiveTrack] = useState('golang')
  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)

  const currentTrackConfig =
    CAREER_TRACKS.find((t) => t.slug === activeTrack) || CAREER_TRACKS[0]

  const userXp = user?.xp ? (user.xp * 100).toLocaleString() : '5,400'
  const userStreak = user?.streak ?? 14
  const userLevel = user?.current_level ?? 7

  // Active Daily Quests: Prefer API dailyQuests, fallback to active quests
  const activeQuests =
    dailyQuests && dailyQuests.length > 0
      ? dailyQuests.slice(0, 2)
      : quests && quests.length > 0
      ? quests.slice(0, 2)
      : [
          {
            id: 'station-3-jwt-middleware',
            title: 'Tuntaskan 1 Part Koding REST API',
            chip_label: 'GIN 04',
            xp_reward: 50,
            difficulty: 'Menengah',
            user_status: claimedLocalQuest ? 'completed' : 'available',
          },
          {
            id: 'nihongo-n3-vocab',
            title: 'Review 1 Kosakata Standup Tokyo',
            chip_label: 'STANDUP IT',
            xp_reward: 30,
            difficulty: 'Mudah',
            user_status: 'available',
          },
        ]

  const handleClaim = () => {
    triggerHaptic('success')
    setClaimedLocalQuest(true)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. LEFT 76PX COMPACT NAV RAIL (SSOT) ── */}
      <NavRail />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8">
        {/* ══════ CENTER CONTENT STAGE (flex-1) ══════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 space-y-6">
          {/* ── 1. CLEAN TOP CONTEXTUAL BAR (NO ROBOTIC DOUBLE GREETINGS) ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Pill & Subtle Career Indicator */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72 md:w-80">
                <MagnifyingGlass
                  weight="bold"
                  className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari materi atau topik..."
                  className="w-full bg-white text-xs font-medium pl-9 pr-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-2xs"
                />
              </div>

              {/* Discreet Track Indicator (Duolingo Style) */}
              <button
                type="button"
                onClick={() => setIsCourseSwitcherOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border-2 border-slate-200/90 hover:border-blue-300 rounded-2xl shadow-2xs text-xs font-brand font-black text-slate-800 transition-all cursor-pointer shrink-0"
                title="Peminatan karier Anda saat ini. Klik untuk melihat pilihan jalur."
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {currentTrackConfig.iconType === 'fundamental' && <FundamentalLogo className="w-4 h-4" />}
                  {currentTrackConfig.iconType === 'golang' && <GolangLogo className="w-5 h-3.5" />}
                  {currentTrackConfig.iconType === 'frontend' && <ReactLogo className="w-4 h-4" />}
                  {currentTrackConfig.iconType === 'devops' && <DockerLogo className="w-4 h-4" />}
                  {currentTrackConfig.iconType === 'nihongo' && <TechNihongoLogo className="w-4 h-4" />}
                </div>
                <span className="text-[11px] font-bold text-slate-700">
                  {currentTrackConfig.title.split(' ')[0]} {currentTrackConfig.title.split(' ')[1] || ''}
                </span>
                <CaretDown weight="bold" className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Game Status HUD (Clean Light Mode) */}
            <div className="bg-white border-2 border-slate-200/80 rounded-2xl px-3.5 py-2 flex items-center gap-3 shadow-2xs self-start sm:self-auto">
              {/* Streak Fire */}
              <div className="flex items-center gap-1.5 font-brand font-black text-xs text-orange-500">
                <Fire weight="fill" className="w-4 h-4 text-orange-500" />
                <span>{userStreak} Hari</span>
              </div>
              <div className="w-[1px] h-3.5 bg-slate-200" />

              {/* XP Star */}
              <div className="flex items-center gap-1.5 font-brand font-black text-xs text-amber-500">
                <Star weight="fill" className="w-4 h-4 text-amber-400" />
                <span>{userXp} XP</span>
              </div>
              <div className="w-[1px] h-3.5 bg-slate-200" />

              {/* Kodi Companion Level */}
              <div className="flex items-center gap-1.5 font-brand font-black text-xs text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Tingkat {userLevel}</span>
              </div>
            </div>
          </div>

          {/* ── 2. THE SEQUENTIAL NUMBERED LEARNING PATH (PANGGUNG UTAMA) ── */}
          <CurriculumPathMap
            trackSlug={activeTrack}
          />
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (354px COMPACT GAMIFICATION & PROGRESS — FIT 100VH) ══════ */}
        {/* ══════ RIGHT SIDEBAR RAIL (354px SEAMLESS SECTIONAL RAIL — ZERO CARD-ITIS) ══════ */}
        <aside className="w-full xl:w-[354px] shrink-0 border-t xl:border-t-0 xl:border-l border-slate-200/80 bg-white p-5 space-y-4 select-none xl:sticky xl:top-4 xl:self-start">
          {/* ── 1. 7-DAY STREAK CONSISTENCY TRACKER (SEAMLESS SECTION) ── */}
          <div className="space-y-2.5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                  <Fire weight="fill" className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-brand font-black text-xs text-slate-900 leading-none">
                    Rentetan Belajar
                  </h4>
                  <span className="text-[9px] text-slate-400 font-medium">
                    Target Konsistensi 7 Hari
                  </span>
                </div>
              </div>

              {/* Flame Pill Badge */}
              <span className="bg-gradient-to-b from-orange-500 to-orange-600 text-white font-brand font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                <Fire weight="fill" className="w-3 h-3 text-amber-200 animate-pulse" />
                <span>{userStreak} Hari Aktif</span>
              </span>
            </div>

            {/* 7 Days Duolingo Flame Tokens Row */}
            <div className="grid grid-cols-7 gap-1.5 text-center bg-orange-50/30 border border-orange-100/80 rounded-2xl p-2 shadow-2xs">
              {[
                { label: 'Sen', dayIndex: 0 },
                { label: 'Sel', dayIndex: 1 },
                { label: 'Rab', dayIndex: 2 },
                { label: 'Kam', dayIndex: 3, isToday: true },
                { label: 'Jum', dayIndex: 4 },
                { label: 'Sab', dayIndex: 5 },
                { label: 'Min', dayIndex: 6 },
              ].map((item) => {
                const currentDayIndex = 3
                const isCompleted =
                  item.dayIndex <= currentDayIndex &&
                  currentDayIndex - item.dayIndex < Math.max(1, userStreak)

                return (
                  <div key={item.label} className="flex flex-col items-center gap-1">
                    <span
                      className={`text-[9px] font-brand font-black transition-colors ${
                        isCompleted
                          ? 'text-orange-600 font-black'
                          : item.isToday
                          ? 'text-orange-500 font-black underline decoration-orange-400 decoration-2 underline-offset-2'
                          : 'text-slate-400 font-bold'
                      }`}
                    >
                      {item.label}
                    </span>

                    {isCompleted ? (
                      /* 3D Tactile Flame Token */
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-b from-amber-400 via-orange-400 to-orange-500 shadow-[0_2.5px_0_0_#C2410C] flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 group/token cursor-default"
                        title={`${item.label}: Hari Aktif Belajar 🔥`}
                      >
                        <Fire
                          weight="fill"
                          className="w-3.5 h-3.5 text-amber-100 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] animate-pulse"
                        />
                      </div>
                    ) : item.isToday ? (
                      /* Active Day in Progress Ring */
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-50 border-2 border-dashed border-orange-400 flex items-center justify-center text-orange-500 shadow-2xs relative"
                        title="Hari ini: Belajar 1 modul untuk menyalakan api!"
                      >
                        <Fire weight="bold" className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
                      </div>
                    ) : (
                      /* Upcoming Milestone Dot */
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100/80 border border-slate-200/90 flex items-center justify-center text-slate-400"
                        title={`${item.label}: Belum Tercapai`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── SUBTLE SECTION DIVIDER ── */}
          <div className="h-[1px] bg-slate-100" />

          {/* ── 2. MISI & TARGET HARIAN (SEAMLESS SECTION) ── */}
          <div className="space-y-2.5">
            {/* Header with Title & Timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                  <Target weight="bold" className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-brand font-black text-xs text-slate-900 leading-none">
                    Misi & Target Harian
                  </h4>
                  <span className="text-[9px] text-slate-400 font-medium">
                    Raih 50 XP untuk Buka Peti
                  </span>
                </div>
              </div>
              <span className="bg-slate-50 text-slate-600 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs border border-slate-200/60">
                <Clock weight="bold" className="w-3 h-3 text-slate-500" />
                <span>{timeLeft || '4j 20m'}</span>
              </span>
            </div>

            {/* Duolingo Integrated Progress Track with Golden Chest at End */}
            <div className="p-2.5 bg-amber-50/30 border border-amber-100/90 rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-brand font-black text-slate-800 flex items-center gap-1">
                  <Lightning weight="fill" className="w-3 h-3 text-amber-500" />
                  <span>35 / 50 XP Hari Ini</span>
                </span>
                <span className="font-brand font-black text-amber-700 text-[10px] flex items-center gap-1">
                  <span>🎁 +20 💎</span>
                  <span className="text-slate-400 font-medium">(15 XP lagi)</span>
                </span>
              </div>

              {/* Progress Bar Track with Golden Chest Anchor at End */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2.5 bg-white rounded-full border border-slate-200/90 p-0.5 shadow-inner overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#D97706] relative"
                    style={{ width: '70%' }}
                  >
                    <div className="absolute inset-x-0 top-0 h-[45%] bg-white/35 rounded-full" />
                  </div>
                </div>
                <div
                  className="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-2xs"
                  title="Peti Emas Hadiah 50 XP (+20 💎)"
                >
                  <Gift weight="fill" className="w-3.5 h-3.5 text-amber-800" />
                </div>
              </div>
            </div>

            {/* Actionable Quests */}
            <div className="space-y-2">
              {activeQuests.map((quest, idx) => {
                const isDone = quest.user_status === 'completed'
                const questRoute = `/learn/${quest.id}`
                const isLanguage =
                  quest.id?.includes('nihongo') ||
                  quest.title?.toLowerCase().includes('kosakata') ||
                  quest.title?.toLowerCase().includes('jepang')

                return (
                  <div
                    key={quest.id || idx}
                    className="p-2.5 bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Contextual 3D Icon Frame */}
                      {isLanguage ? (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-rose-400 to-pink-500 shadow-[0_2px_0_0_#9F1239] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Translate weight="bold" className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-blue-500 to-indigo-600 shadow-[0_2px_0_0_#1E3A8A] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Code weight="bold" className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p
                          className="font-brand font-black text-[11px] text-slate-900 leading-tight line-clamp-2"
                          title={quest.title}
                        >
                          {quest.title}
                        </p>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[9px] font-brand font-black px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow-2xs">
                            <Lightning weight="fill" className="w-2.5 h-2.5 text-amber-500" />
                            <span>+{quest.xp_reward} XP</span>
                          </span>
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider bg-slate-100 border border-slate-200/60 px-1 py-0.2 rounded">
                            {quest.chip_label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isDone ? (
                      <span className="bg-emerald-50 border border-emerald-300 text-emerald-700 font-brand font-black text-[9px] px-2 py-1 rounded-lg flex items-center gap-0.5 shrink-0 shadow-2xs">
                        <CheckCircle weight="fill" className="w-3 h-3 text-emerald-600" />
                        <span>SELESAI</span>
                      </span>
                    ) : idx === 0 && !claimedLocalQuest ? (
                      <Button3D
                        variant="amber"
                        size="sm"
                        onClick={handleClaim}
                        className="text-[10px] font-black tracking-wide px-2.5 py-1 shrink-0 shadow-[0_2px_0_0_#B45309]"
                      >
                        KLAIM
                      </Button3D>
                    ) : (
                      <Button3D
                        variant="blue"
                        size="sm"
                        onClick={() => navigate(questRoute)}
                        className="text-[10px] font-black tracking-wide px-2.5 py-1 shrink-0 shadow-[0_2px_0_0_#1D4ED8]"
                      >
                        MULAI
                      </Button3D>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── SUBTLE SECTION DIVIDER ── */}
          <div className="h-[1px] bg-slate-100" />

          {/* ── 3. KOSAKATA KANTOR TOKYO (SEAMLESS SECTION) ── */}
          <TechNihongoCard />
        </aside>
      </div>

      {/* ── 3. DUOLINGO-STYLE COURSE SWITCHER MODAL ── */}
      <CourseSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={setActiveTrack}
      />
    </div>
  )
}
