import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboard, useRoadmap, useQuests } from '../hooks'
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
  Calendar,
  Trophy,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { profile } = useDashboard()
  const { user } = profile
  const { roadmap, selectedStation } = useRoadmap()
  const { dailyQuests, quests, timeLeft } = useQuests()
  const [searchQuery, setSearchQuery] = useState('')
  const [claimedLocalQuest, setClaimedLocalQuest] = useState(false)

  const userName = user?.name || user?.username || 'Agam Latifullah'
  const userXp = user?.xp ? (user.xp * 100).toLocaleString() : '5,400'
  const userStreak = user?.streak ?? 14
  const userLevel = user?.current_level ?? 7

  // Derive dynamic learning objective from active roadmap or fallback
  const currentTrackTitle = roadmap?.title || 'Sintaks Go & Gin REST API Engine'
  const currentChapterTitle =
    selectedStation?.chapters?.[0]?.title ||
    'Bab 4: Routing, JSON Binding & Middleware Controller'
  const currentUnitTag = selectedStation?.chip_label || 'UNIT 4 • SHIBUYA ENGINE'
  const currentProgress = selectedStation?.progress_rate ?? 62

  // Active Daily Quests: Prefer API dailyQuests, fallback to active quests or curated items
  const activeQuests =
    dailyQuests && dailyQuests.length > 0
      ? dailyQuests.slice(0, 3)
      : quests && quests.length > 0
      ? quests.slice(0, 3)
      : [
          {
            id: 'station-3-jwt-middleware',
            title: 'Tuntaskan 1 Bab Koding Gin REST API',
            chip_label: 'GIN // 04',
            xp_reward: 50,
            difficulty: 'Menengah',
            user_status: claimedLocalQuest ? 'completed' : 'available',
          },
          {
            id: 'nihongo-n3-vocab',
            title: 'Pelajari 5 Kosakata Tech Nihongo N3',
            chip_label: 'JLPT N3',
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
    <div className="min-h-screen bg-[#080D18] text-[#F1F5F9] font-sans flex selection:bg-blue-600/30">
      {/* ── 1. LEFT 76PX COMPACT NAV RAIL (SSOT) ── */}
      <NavRail />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8">
        {/* ══════ CENTER CONTENT STAGE (flex-1) ══════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 space-y-6">
          {/* ── 1. DASHBOARD HEADER ROW ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#F1F5F9] tracking-tight flex items-center gap-2">
                <span>Selamat Malam, {userName}!</span>
                <span>🎌</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] font-medium">
                Target Hari Ini: Selesaikan 1 Sesi Koding Gin & Jaga Streak {userStreak} Hari 🔥
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Pill */}
              <div className="relative w-56 sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari modul, kuis, kosakata..."
                  className="w-full bg-[#101827] text-xs font-medium pl-9 pr-4 py-2.5 rounded-2xl border border-[#27364D] focus:border-[#3B82F6] focus:outline-none transition-all placeholder:text-[#64748B] text-[#F1F5F9] shadow-inner"
                />
              </div>

              {/* Game Status HUD with Animated Doodles */}
              <div className="bg-[#101827] border border-[#27364D] rounded-2xl px-4 py-2 flex items-center gap-3 shadow-md">
                {/* Streak Fire */}
                <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-[#FB923C]">
                  <DoodleFire className="w-4 h-4" />
                  <span>{userStreak} Hari</span>
                </div>
                <div className="w-[1px] h-3.5 bg-[#27364D]" />

                {/* XP Star */}
                <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-[#F5B942]">
                  <DoodleStar className="w-4 h-4" />
                  <span>{userXp} XP</span>
                </div>
                <div className="w-[1px] h-3.5 bg-[#27364D]" />

                {/* Kodi Companion Level */}
                <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-[#38BDF8]">
                  <span className="text-sm">🐼</span>
                  <span>Lv. {userLevel} Tokyo</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. LEARNING COMMAND CENTER (DOMINANT CONTINUE LEARNING HERO) ── */}
          <KodiHeroStage
            user={user}
            trackTitle={currentTrackTitle}
            chapterTitle={currentChapterTitle}
            unitTag={currentUnitTag}
            progressPercentage={currentProgress}
            timeEstimate="15 Menit"
            nextQuestRoute="/learn/station-3-jwt-middleware"
          />

          {/* ── 3. JAPANESE RAILWAY JOURNEY MAP (YAMANOTE NIGHT EXPRESS) ── */}
          <YamanoteRailTrack
            currentStation={selectedStation?.station_number || 3}
            stations={roadmap?.stations}
          />

          {/* ── 4. DAILY QUESTS & BOSS CHALLENGE ROW ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Daily Quests Box */}
            <div className="bg-[#101827] border border-[#27364D] rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#F5B942]" />
                  <h4 className="font-extrabold text-sm text-[#F1F5F9]">
                    Misi Harian (Daily Quests)
                  </h4>
                </div>
                <span className="bg-[#172236] border border-[#27364D] text-[#F5B942] text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Reset {timeLeft || '4j 20m'}</span>
                </span>
              </div>

              {/* Actionable Quest Items List */}
              <div className="space-y-2.5">
                {activeQuests.map((quest, idx) => {
                  const isDone = quest.user_status === 'completed'
                  const questRoute = `/learn/${quest.id}`

                  return (
                    <div
                      key={quest.id || idx}
                      className="bg-[#172236] border border-[#27364D] hover:border-[#3B82F6]/50 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#101827] border border-[#27364D] text-[#38BDF8] flex items-center justify-center shrink-0">
                          <Code className="w-5 h-5 stroke-[2]" />
                        </div>
                        <div className="space-y-0.5 truncate">
                          <p className="font-bold text-xs sm:text-sm text-[#F1F5F9] truncate">
                            {quest.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-[#F5B942] font-mono font-semibold">
                              +{quest.xp_reward} XP
                            </span>
                            <span className="text-[#64748B]">•</span>
                            <span className="text-[#94A3B8] font-medium">
                              {quest.difficulty || 'Menengah'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isDone ? (
                        <span className="bg-emerald-950/40 border border-emerald-500/30 text-[#10B981] font-mono font-bold text-[10px] px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>SELESAI ✓</span>
                        </span>
                      ) : idx === 0 && !claimedLocalQuest ? (
                        <button
                          type="button"
                          onClick={handleClaim}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-[10px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
                        >
                          KLAIM ⚡
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate(questRoute)}
                          className="bg-[#3B82F6] hover:bg-blue-500 text-white font-mono font-bold text-[10px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <span>MULAI</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Boss Challenge Box */}
            <div className="bg-[#101827] border border-[#27364D] rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FB923C]" />
                    <h4 className="font-extrabold text-sm text-[#F1F5F9]">
                      Tantangan Portofolio Tokyo 🏆
                    </h4>
                  </div>
                  <span className="bg-red-950/40 border border-red-500/30 text-rose-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                    DEADLINE: 15 MEI
                  </span>
                </div>

                <h5 className="font-black text-sm sm:text-base text-[#F1F5F9]">
                  REST API Gin & Auth Engine JWT Standar Tokyo
                </h5>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Bangun microservice authentication standar produksi untuk kurasi portofolio perusahaan teknologi Jepang (Mercari / LINE).
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#27364D]">
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#172236] text-[#38BDF8] border border-[#27364D] font-mono font-bold text-[10px] px-2 py-0.5 rounded-md">
                    GOLANG
                  </span>
                  <span className="bg-[#172236] text-[#60A5FA] border border-[#27364D] font-mono font-bold text-[10px] px-2 py-0.5 rounded-md">
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

        {/* ══════ RIGHT SIDEBAR RAIL (SUPPORTING CAREER METRICS - 354px) ══════ */}
        <aside className="w-full xl:w-[354px] shrink-0 border-t xl:border-t-0 xl:border-l border-[#27364D] bg-[#101827] p-5 sm:p-6 space-y-5 select-none">
          {/* ── 1. UNIFIED STREAK AND SCHEDULE CARD ── */}
          <div className="border border-[#27364D] bg-[#172236]/40 rounded-3xl p-4 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#38BDF8]" />
                <h4 className="font-extrabold text-xs text-[#F1F5F9]">Streak & Jadwal Live</h4>
              </div>
              <span className="bg-orange-950/40 border border-orange-500/30 text-[#FB923C] font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span>🔥</span>
                <span>{userStreak} Hari Aktif</span>
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
                  <span
                    className={`text-[9px] font-bold ${
                      item.active ? 'text-[#38BDF8]' : 'text-[#64748B]'
                    }`}
                  >
                    {item.day}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-[11px] transition-all ${
                      item.done
                        ? 'bg-emerald-950/70 border border-emerald-500/50 text-[#10B981]'
                        : item.active
                        ? 'bg-[#3B82F6] text-white shadow-md glow-primary'
                        : 'bg-[#101827] border border-[#27364D] text-[#64748B]'
                    }`}
                  >
                    {item.done ? '✓' : item.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Event Notification Box */}
            <div className="bg-[#101827] border border-[#27364D] rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-[11px] font-extrabold text-[#F1F5F9]">
                  Mock Interview Tokyo (Zoom)
                </p>
                <p className="text-[10px] text-[#38BDF8] font-mono font-medium">
                  Besok • 09:00 JST (07:00 WIB)
                </p>
              </div>
              <button
                type="button"
                className="bg-[#172236] hover:bg-[#27364D] border border-[#27364D] text-[#38BDF8] font-bold text-[10px] px-2.5 py-1 rounded-xl shrink-0 cursor-pointer transition-colors"
              >
                Ingatkan 🔔
              </button>
            </div>
          </div>

          {/* ── 2. LEADERBOARD PODIUM CARD (LIGA SHIBUYA) ── */}
          <div className="border border-[#27364D] bg-[#172236]/40 rounded-3xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#F5B942]" />
                <h4 className="font-extrabold text-xs text-[#F1F5F9]">
                  Liga Shibuya (Divisi Diamond)
                </h4>
              </div>
              <span className="bg-[#101827] border border-[#27364D] text-[#F5B942] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                Top 3 Promosi
              </span>
            </div>

            <div className="space-y-1.5">
              {/* User Row 1 (Gold 🥇) */}
              <div className="bg-[#172236] border border-[#3B82F6]/50 rounded-2xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🥇</span>
                  <span className="text-sm">🐼</span>
                  <span className="font-extrabold text-xs text-[#F1F5F9]">
                    {userName} (Anda)
                  </span>
                </div>
                <span className="font-mono font-bold text-xs text-[#38BDF8]">{userXp} XP</span>
              </div>

              {/* Row 2 (Silver 🥈) */}
              <div className="p-2 flex items-center justify-between rounded-xl hover:bg-[#172236]/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🥈</span>
                  <span className="w-5 h-5 rounded-md bg-[#101827] border border-[#27364D] text-[#94A3B8] text-[9px] font-bold flex items-center justify-center font-mono">
                    KT
                  </span>
                  <span className="font-medium text-xs text-[#94A3B8]">Kenji Tanaka</span>
                </div>
                <span className="font-mono text-xs text-[#64748B]">5,120 XP</span>
              </div>

              {/* Row 3 (Bronze 🥉) */}
              <div className="p-2 flex items-center justify-between rounded-xl hover:bg-[#172236]/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🥉</span>
                  <span className="w-5 h-5 rounded-md bg-[#101827] border border-[#27364D] text-[#94A3B8] text-[9px] font-bold flex items-center justify-center font-mono">
                    SW
                  </span>
                  <span className="font-medium text-xs text-[#94A3B8]">Sarah Wijaya</span>
                </div>
                <span className="font-mono text-xs text-[#64748B]">4,850 XP</span>
              </div>
            </div>
          </div>

          {/* ── 3. TOKYO PASSPORT WIDGET (DARK BIOMETRIC TECH BOOKLET) ── */}
          <TokyoPassportWidget user={user} readinessScore={75} />
        </aside>
      </div>
    </div>
  )
}
