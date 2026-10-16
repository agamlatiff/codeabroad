import { useState, useEffect, useMemo } from 'react'
import { useDashboard, useQuests } from '../hooks'
import { useRoadmap } from '../hooks/useRoadmap'
import { authService } from '../services/authService'
import { NavRail } from '../components/layout/NavRail'
import {
  CurriculumPathMap,
  CourseSwitcherModal,
  GameSidebarRail,
  GameTopBar,
} from '../components/game'
import { triggerHaptic } from '../utils/haptics'
import { TokyoLeaderboardModal } from '../components/game/TokyoLeaderboardModal'

export const DashboardPage = () => {
  const { profile, actions } = useDashboard()
  const { user } = profile
  const { dailyQuests } = useQuests()

  const [activeTrack, setActiveTrack] = useState(() => {
    return user?.primary_stack || user?.career_path?.slug || 'golang'
  })
  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const { roadmap } = useRoadmap(activeTrack)
  const [questCompletionTick, setQuestCompletionTick] = useState(0)

  // Listen for real-time quest completions across the application
  useEffect(() => {
    const handler = () => setQuestCompletionTick((prev) => prev + 1)
    window.addEventListener('codeabroad_quest_completed', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('codeabroad_quest_completed', handler)
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

  // Active Career Track progress stats for top bar
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
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8 xl:pb-0">
        {/* ══════ CENTER CONTENT STAGE (flex-1) ══════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 pb-12 space-y-6">
          {/* ── 1. CLEAN TOP CONTEXTUAL BAR (SSOT - GameTopBar) ── */}
          <GameTopBar
            activeTrack={activeTrack}
            onOpenCourseSwitcher={() => setIsCourseSwitcherOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            completedCount={activeTrackStats.completed}
            totalCount={activeTrackStats.total}
            progressPercent={activeTrackPercent}
            unitLabel="Modul"
          />


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
