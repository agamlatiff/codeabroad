import { useState, useEffect, useMemo } from 'react'
import { useDashboard, useQuests } from '../hooks'
import { useRoadmap } from '../hooks/useRoadmap'
import { authService } from '../services/authService'
import { NavRail } from '../components/layout/NavRail'
import {
  CurriculumPathMap,
  CourseSwitcherModal,
  CAREER_TRACKS,
  GameSidebarRail,
} from '../components/game'
import { triggerHaptic } from '../utils/haptics'
import { audioEngine } from '../utils/audio'
import {
  Fire,
  Star,
  CaretDown,
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
  Trophy,
} from '@phosphor-icons/react'
import { TokyoLeaderboardModal } from '../components/game/TokyoLeaderboardModal'
import {
  GolangLogo,
  ReactLogo,
  DockerLogo,
  FundamentalLogo,
  TechNihongoLogo,
} from '../components/ui/BrandLogos'

export const DashboardPage = () => {
  const { profile, actions } = useDashboard()
  const { user } = profile
  const { dailyQuests } = useQuests()
  const [isMuted, setIsMuted] = useState(() => audioEngine.isMuted())

  useEffect(() => {
    const handleSoundToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>
      setIsMuted(customEvent.detail.muted)
    }
    window.addEventListener('codeabroad_sound_toggle', handleSoundToggle)
    return () => window.removeEventListener('codeabroad_sound_toggle', handleSoundToggle)
  }, [])

  const handleToggleSound = () => {
    triggerHaptic('tap')
    const nextMuted = audioEngine.toggleMute()
    setIsMuted(nextMuted)
    if (!nextMuted) {
      audioEngine.playPop()
    }
  }

  const [activeTrack, setActiveTrack] = useState(() => {
    return user?.primary_stack || user?.career_path?.slug || 'golang'
  })
  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const { roadmap } = useRoadmap(activeTrack)
  const [questCompletionTick, setQuestCompletionTick] = useState(0)
  const [isXpPulsing, setIsXpPulsing] = useState(false)

  // Listen for real-time quest completions and XP gains across the application
  useEffect(() => {
    const handler = () => setQuestCompletionTick((prev) => prev + 1)
    const handleXp = () => {
      setIsXpPulsing(true)
      setTimeout(() => setIsXpPulsing(false), 1200)
    }
    window.addEventListener('codeabroad_quest_completed', handler)
    window.addEventListener('codeabroad_xp_gained', handleXp)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('codeabroad_quest_completed', handler)
      window.removeEventListener('codeabroad_xp_gained', handleXp)
      window.removeEventListener('storage', handler)
    }
  }, [])

  // Aggregated set of all completed quest IDs
  const completedQuestsSet = useMemo(() => {
    const set = new Set<string>()
    if (dailyQuests) {
      dailyQuests.forEach((q) => {
        if (q.user_status === 'completed') set.add(q.id)
      })
    }
    try {
      const stored = JSON.parse(localStorage.getItem('codeabroad_completed_quests') || '[]')
      if (Array.isArray(stored)) {
        stored.forEach((id: string) => set.add(id))
      }
    } catch {}
    return set
  }, [dailyQuests, questCompletionTick])

  // Dynamic career track progress aggregation (completed vs total modules)
  const trackProgressMap = useMemo(() => {
    let completed = 0
    let total = 0

    if (roadmap?.stations && roadmap.stations.length > 0) {
      roadmap.stations.forEach((st) => {
        if (st.chapters && st.chapters.length > 0) {
          st.chapters.forEach((ch) => {
            if (ch.quests && ch.quests.length > 0) {
              total += ch.quests.length
              completed += ch.quests.filter((q) => q.status === 'completed' || completedQuestsSet.has(q.id)).length
            } else {
              total += 1
              if (ch.is_completed || completedQuestsSet.has(ch.id)) completed += 1
            }
          })
        } else {
          total += 1
          if (st.is_completed || completedQuestsSet.has(st.id)) completed += 1
        }
      })
    }

    const localCount = completedQuestsSet.size
    const effectiveCompleted = Math.max(completed, localCount)
    const effectiveTotal = total > 0 ? total : 10

    return {
      [activeTrack]: {
        completed: Math.min(effectiveCompleted, effectiveTotal),
        total: effectiveTotal,
      },
    }
  }, [roadmap, activeTrack, completedQuestsSet])

  // Synchronize activeTrack when user profile arrives from backend
  useEffect(() => {
    if (user?.primary_stack) {
      setActiveTrack(user.primary_stack)
    } else if (user?.career_path?.slug) {
      setActiveTrack(user.career_path.slug)
    }
  }, [user?.primary_stack, user?.career_path?.slug])

  const handleSelectTrack = async (newTrack: string) => {
    triggerHaptic('tap')
    setActiveTrack(newTrack)
    try {
      await authService.updateProfile({ primary_stack: newTrack })
      actions.refetchProfile()
    } catch {
      // Gracefully continue with local state if backend update fails
    }
  }

  const currentTrackConfig =
    CAREER_TRACKS.find((t) => t.slug === activeTrack) || CAREER_TRACKS[0]

  // Dynamic user gamification stats
  const userXp = typeof user?.xp === 'number' ? user.xp.toLocaleString() : '0'
  const userStreak = typeof user?.streak === 'number' ? user.streak : 0
  const userLevel = typeof user?.current_level === 'number' ? user.current_level : 1

  // Active Career Track progress stats for Option 3 top bar
  const activeTrackStats = trackProgressMap[activeTrack] || { completed: 0, total: 10 }
  const activeTrackPercent =
    activeTrackStats.total > 0
      ? Math.min(100, Math.round((activeTrackStats.completed / activeTrackStats.total) * 100))
      : 0


  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. LEFT 76PX COMPACT NAV RAIL (SSOT) ── */}
      <NavRail />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8">
        {/* ══════ CENTER CONTENT STAGE (flex-1) ══════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 space-y-6">
          {/* ── 1. CLEAN TOP CONTEXTUAL BAR (TRACK SELECTOR & PROGRESS BAR) ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Track Switcher Pill & Linear Progress Bar (Option 3) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              {/* Clickable Track Switcher Pill */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setIsCourseSwitcherOpen(true)
                }}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-white border-2 border-slate-200/90 hover:border-blue-400 rounded-2xl shadow-2xs text-xs font-brand font-black text-slate-800 transition-all cursor-pointer group shrink-0"
                title="Peminatan karier saat ini. Klik untuk beralih jalur belajar."
              >
                <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {currentTrackConfig.iconType === 'fundamental' && <FundamentalLogo className="w-4 h-4" />}
                  {currentTrackConfig.iconType === 'golang' && <GolangLogo className="w-5 h-3.5" />}
                  {currentTrackConfig.iconType === 'frontend' && <ReactLogo className="w-4 h-4" />}
                  {currentTrackConfig.iconType === 'devops' && <DockerLogo className="w-4 h-4" />}
                  {currentTrackConfig.iconType === 'nihongo' && <TechNihongoLogo className="w-4 h-4" />}
                </div>
                <span className="text-xs font-brand font-black text-slate-900 leading-tight">
                  {currentTrackConfig.title}
                </span>
                <CaretDown weight="bold" className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors ml-0.5" />
              </button>

              {/* Track Linear Progress Bar */}
              <div className="flex items-center gap-2.5 bg-white border-2 border-slate-200/80 rounded-2xl px-3 py-2 shadow-2xs">
                <div className="w-24 sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#1D4ED8]"
                    style={{ width: `${activeTrackPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-600 shrink-0">
                  {activeTrackStats.completed}/{activeTrackStats.total} Modul ({activeTrackPercent}%)
                </span>
              </div>
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
              <div className={`flex items-center gap-1.5 font-brand font-black text-xs text-amber-500 rounded-lg px-1.5 py-0.5 transition-all ${isXpPulsing ? 'animate-pulse-ring bg-amber-50 scale-105' : ''}`}>
                <Star weight="fill" className={`w-4 h-4 text-amber-400 ${isXpPulsing ? 'animate-bounce' : ''}`} />
                <span>{userXp} XP</span>
              </div>
              <div className="w-[1px] h-3.5 bg-slate-200" />

              {/* Kodi Companion Level */}
              <div className="flex items-center gap-1.5 font-brand font-black text-xs text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Tingkat {userLevel}</span>
              </div>

              {/* Tokyo League Leaderboard HUD Button */}
              <div className="w-[1px] h-3.5 bg-slate-200" />
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setIsLeaderboardOpen(true)
                }}
                className="flex items-center gap-1 font-brand font-black text-xs text-amber-700 hover:text-amber-800 transition-colors cursor-pointer group"
                title="Buka Papan Peringkat Liga Tokyo"
              >
                <Trophy weight="fill" className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Liga</span>
              </button>

              {/* Audio Sound Toggle */}
              <div className="w-[1px] h-3.5 bg-slate-200" />
              <button
                type="button"
                onClick={handleToggleSound}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center justify-center p-1 rounded-lg hover:bg-slate-100 active:translate-y-0.5"
                title={isMuted ? 'Aktifkan Efek Suara' : 'Bisukan Efek Suara'}
              >
                {isMuted ? (
                  <SpeakerSimpleSlash weight="bold" className="w-4 h-4 text-slate-400" />
                ) : (
                  <SpeakerSimpleHigh weight="bold" className="w-4 h-4 text-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* ── 2. THE SEQUENTIAL NUMBERED LEARNING PATH (PANGGUNG UTAMA) ── */}
          <CurriculumPathMap
            trackSlug={activeTrack}
          />
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (SSOT - Subtask 34.3) ══════ */}
        <GameSidebarRail activeTrack={activeTrack} />
      </div>

      {/* ── 3. DUOLINGO-STYLE COURSE SWITCHER MODAL ── */}
      <CourseSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
        trackProgressMap={trackProgressMap}
      />

      {/* ── TOKYO LEADERBOARD MODAL ── */}
      <TokyoLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  )
}
