import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useDashboard, useQuests } from '../hooks'
import { useAuthStore } from '../store/authStore'
import { useRoadmap } from '../hooks/useRoadmap'
import { authService } from '../services/authService'
import type { UserActivitySummary } from '../types/auth'
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
  X,
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
  const { profile, actions } = useDashboard()
  const { user } = profile
  const { updateUser } = useAuthStore()
  const { dailyQuests, timeLeft } = useQuests()
  // Daily persistence keys per calendar day (YYYY-MM-DD)
  const todayDateStr = new Date().toISOString().slice(0, 10)
  const chestStorageKey = `codeabroad_daily_chest_claimed_${todayDateStr}`
  const vocabStorageKey = `codeabroad_vocab_reviewed_${todayDateStr}`
  const claimedVocabQuestKey = `codeabroad_vocab_quest_claimed_${todayDateStr}`

  const [isChestModalOpen, setIsChestModalOpen] = useState(false)
  const [isChestClaimedToday, setIsChestClaimedToday] = useState(() => {
    return localStorage.getItem(chestStorageKey) === 'true'
  })
  const [reviewedNihongoToday, setReviewedNihongoToday] = useState(() => {
    return localStorage.getItem(vocabStorageKey) === 'true'
  })
  const [claimedLocalQuest, setClaimedLocalQuest] = useState(() => {
    return localStorage.getItem(claimedVocabQuestKey) === 'true'
  })

  const handleVocabReview = () => {
    if (!reviewedNihongoToday) {
      localStorage.setItem(vocabStorageKey, 'true')
      setReviewedNihongoToday(true)
      triggerHaptic('success')
    }
  }

  const handleClaimVocabQuest = async () => {
    triggerHaptic('success')
    localStorage.setItem(claimedVocabQuestKey, 'true')
    setClaimedLocalQuest(true)

    try {
      const res = await authService.claimDailyReward('vocab_quest')
      updateUser({
        xp: res.current_xp,
        current_level: res.current_level,
        streak: res.streak,
      })
    } catch {
      updateUser({
        xp: (user?.xp || 0) + 30,
      })
    }
    window.dispatchEvent(new Event('codeabroad_quest_completed'))
    window.dispatchEvent(new Event('storage'))
  }

  const handleClaimChest = async () => {
    triggerHaptic('success')
    localStorage.setItem(chestStorageKey, 'true')
    setIsChestClaimedToday(true)
    setIsChestModalOpen(false)

    try {
      const res = await authService.claimDailyReward('golden_chest')
      updateUser({
        xp: res.current_xp,
        current_level: res.current_level,
        streak: res.streak,
      })
    } catch {
      updateUser({
        xp: (user?.xp || 0) + 50,
      })
    }
    window.dispatchEvent(new Event('codeabroad_quest_completed'))
    window.dispatchEvent(new Event('storage'))
  }
  const [activeTrack, setActiveTrack] = useState(() => {
    return user?.primary_stack || user?.career_path?.slug || 'golang'
  })
  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)
  const { roadmap } = useRoadmap(activeTrack)

  const [questCompletionTick, setQuestCompletionTick] = useState(0)
  const [activitySummary, setActivitySummary] = useState<UserActivitySummary | null>(null)

  // Fetch real 7-day weekly activity logs and daily rewards status from backend API
  useEffect(() => {
    let isMounted = true
    authService
      .getActivityLogs()
      .then((data) => {
        if (isMounted) setActivitySummary(data)
      })
      .catch((err) => {
        console.warn('Using offline activity log fallback:', err)
      })

    authService
      .getDailyRewardsStatus()
      .then((status) => {
        if (!isMounted || !status) return
        if (status.vocab_quest_claimed) {
          localStorage.setItem(claimedVocabQuestKey, 'true')
          setClaimedLocalQuest(true)
        }
        if (status.golden_chest_claimed) {
          localStorage.setItem(chestStorageKey, 'true')
          setIsChestClaimedToday(true)
        }
      })
      .catch((err) => {
        console.warn('Using offline daily rewards status fallback:', err)
      })

    return () => {
      isMounted = false
    }
  }, [questCompletionTick, claimedVocabQuestKey, chestStorageKey])

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

  const isPart1Completed =
    completedQuestsSet.has('part-1-variabel-dan-tipe-data') ||
    completedQuestsSet.has('d1000001-0000-0000-0000-000000000001')

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

  // Dynamic day calculation (0=Sen, 1=Sel, 2=Rab, 3=Kam, 4=Jum, 5=Sab, 6=Min)
  const jsDay = new Date().getDay()
  const todayDayIndex = jsDay === 0 ? 6 : jsDay - 1

  // Dynamic Daily Quests & Golden Chest XP Progress
  const dailyTargetXp = 50
  const completedDailyQuests = (dailyQuests || []).filter((q) => q.user_status === 'completed')
  // Dynamic Coding Quest 1 Configuration based on Active Career Track
  const trackQuestConfig = useMemo(() => {
    switch (activeTrack) {
      case 'frontend':
      case 'react':
        return {
          id: 'part-1-react-components-and-props',
          title: 'Tuntaskan Part 1: Komponen React & Props TS',
          chip_label: 'REACT 01',
          route: '/courses',
        }
      case 'devops':
      case 'devops_aws':
        return {
          id: 'part-1-linux-and-docker-fundamentals',
          title: 'Tuntaskan Part 1: Linux CLI & Docker Container',
          chip_label: 'DEVOPS 01',
          route: '/courses',
        }
      case 'golang':
      case 'backend':
      default:
        return {
          id: 'part-1-variabel-dan-tipe-data',
          title: 'Tuntaskan Part 1: Variabel & Tipe Data',
          chip_label: 'GO 01',
          route: '/learn/part-1-variabel-dan-tipe-data',
        }
    }
  }, [activeTrack])

  const isCurrentTrackPart1Completed =
    completedQuestsSet.has(trackQuestConfig.id) ||
    (activeTrack === 'golang' && isPart1Completed)

  const completedApiXp = completedDailyQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0)
  const todayEarnedXp = Math.min(
    dailyTargetXp,
    completedApiXp +
      (isCurrentTrackPart1Completed ? 50 : 0) +
      (claimedLocalQuest ? 30 : 0) +
      (reviewedNihongoToday && !claimedLocalQuest ? 15 : 0)
  )
  const dailyProgressPercent = Math.min(100, Math.round((todayEarnedXp / dailyTargetXp) * 100))
  const isChestUnlocked = todayEarnedXp >= dailyTargetXp
  const remainingXp = Math.max(0, dailyTargetXp - todayEarnedXp)

  // Active Daily Quests with realistic state adapted to current track
  const activeQuests = [
    {
      id: trackQuestConfig.id,
      title: trackQuestConfig.title,
      chip_label: trackQuestConfig.chip_label,
      route: trackQuestConfig.route,
      xp_reward: 50,
      difficulty: 'Pemula',
      user_status: (isCurrentTrackPart1Completed ? 'completed' : 'available') as 'completed' | 'available',
    },
    {
      id: 'nihongo-n3-vocab',
      title: 'Review 1 Kosakata Standup Tokyo',
      chip_label: 'STANDUP IT',
      route: '#tech-nihongo-card',
      xp_reward: 30,
      difficulty: 'Mudah',
      user_status: (claimedLocalQuest
        ? 'completed'
        : reviewedNihongoToday
        ? 'ready_to_claim'
        : 'available') as 'completed' | 'ready_to_claim' | 'available',
    },
  ]

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
              {(
                activitySummary?.weekly_logs && activitySummary.weekly_logs.length === 7
                  ? activitySummary.weekly_logs.map((log) => ({
                      label: log.day_label,
                      dayIndex: log.day_index,
                      isToday: log.is_today,
                      isCompleted: log.is_active,
                      xpEarned: log.xp_earned,
                      questsCount: log.quests_count,
                    }))
                  : [
                      { label: 'Sen', dayIndex: 0 },
                      { label: 'Sel', dayIndex: 1 },
                      { label: 'Rab', dayIndex: 2 },
                      { label: 'Kam', dayIndex: 3 },
                      { label: 'Jum', dayIndex: 4 },
                      { label: 'Sab', dayIndex: 5 },
                      { label: 'Min', dayIndex: 6 },
                    ].map((item) => ({
                      label: item.label,
                      dayIndex: item.dayIndex,
                      isToday: item.dayIndex === todayDayIndex,
                      isCompleted:
                        item.dayIndex < todayDayIndex
                          ? todayDayIndex - item.dayIndex < Math.max(1, userStreak)
                          : item.dayIndex === todayDayIndex && userStreak > 0,
                      xpEarned: 0,
                      questsCount: 0,
                    }))
              ).map((item) => {
                const isToday = item.isToday
                const isCompleted = item.isCompleted

                return (
                  <div key={item.label} className="flex flex-col items-center gap-1">
                    <span
                      className={`text-[9px] font-brand font-black transition-colors ${
                        isCompleted
                          ? 'text-orange-600 font-black'
                          : isToday
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
                    ) : isToday ? (
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
          <div id="daily-quests-section" className="space-y-2.5 scroll-mt-20">
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
                  <span>{todayEarnedXp} / {dailyTargetXp} XP Hari Ini</span>
                </span>
                <span className="font-brand font-black text-amber-700 text-[10px] flex items-center gap-1">
                  <span>🎁 +20 💎</span>
                  <span className="text-slate-400 font-medium">
                    ({isChestUnlocked ? 'Tercapai! 🎉' : `${remainingXp} XP lagi`})
                  </span>
                </span>
              </div>

              {/* Progress Bar Track with Golden Chest Anchor at End */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2.5 bg-white rounded-full border border-slate-200/90 p-0.5 shadow-inner overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#D97706] relative"
                    style={{ width: `${dailyProgressPercent}%` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-[45%] bg-white/35 rounded-full" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap')
                    setIsChestModalOpen(true)
                  }}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs transition-transform cursor-pointer ${
                    isChestUnlocked
                      ? 'bg-amber-400 border-amber-500 text-amber-950 animate-bounce shadow-[0_2px_0_0_#B45309] hover:scale-110 active:scale-95'
                      : 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200'
                  }`}
                  title={
                    isChestUnlocked
                      ? 'Klik untuk membuka Peti Emas Hadiah 50 XP! (+20 💎)'
                      : `Peti Emas Hadiah 50 XP (+20 💎) - ${remainingXp} XP lagi`
                  }
                >
                  <Gift weight={isChestUnlocked ? 'fill' : 'bold'} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Actionable Quests */}
            <div className="space-y-2">
              {activeQuests.map((quest, idx) => {
                const isDone = quest.user_status === 'completed'
                const questRoute = quest.route || `/learn/${quest.id}`
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
                    ) : quest.user_status === 'ready_to_claim' ? (
                      <Button3D
                        variant="amber"
                        size="sm"
                        onClick={handleClaimVocabQuest}
                        className="text-[10px] font-black tracking-wide px-2.5 py-1 shrink-0 shadow-[0_2px_0_0_#B45309]"
                      >
                        KLAIM ⚡
                      </Button3D>
                    ) : (
                      <Button3D
                        variant="blue"
                        size="sm"
                        onClick={() => {
                          triggerHaptic('tap')
                          if (isLanguage) {
                            const el = document.getElementById('tech-nihongo-card')
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              el.classList.add('ring-4', 'ring-blue-400', 'rounded-2xl', 'transition-all')
                              setTimeout(() => {
                                el.classList.remove('ring-4', 'ring-blue-400', 'rounded-2xl')
                              }, 2000)
                            }
                          } else {
                            navigate(questRoute)
                          }
                        }}
                        className="text-[10px] font-black tracking-wide px-2.5 py-1 shrink-0 shadow-[0_2px_0_0_#1D4ED8]"
                      >
                        MULAI ▶
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
          <TechNihongoCard
            isReviewed={reviewedNihongoToday}
            isClaimed={claimedLocalQuest}
            onReview={handleVocabReview}
          />
        </aside>
      </div>

      {/* ── 3. DUOLINGO-STYLE COURSE SWITCHER MODAL ── */}
      <CourseSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
        trackProgressMap={trackProgressMap}
      />

      {/* ── 4. CELEBRATION MODAL FOR DAILY GOLDEN CHEST ── */}
      {isChestModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl animate-pop relative">
            <button
              type="button"
              onClick={() => setIsChestModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
            >
              <X weight="bold" className="w-4 h-4" />
            </button>
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 shadow-[0_6px_0_0_#B45309] flex items-center justify-center text-amber-950 animate-bounce">
              <Gift weight="fill" className="w-10 h-10 text-white drop-shadow-md" />
            </div>
            <div className="space-y-1">
              <h3 className="font-brand font-black text-xl text-slate-900">
                Peti Emas Hadiah Terbuka! 🎉
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {isChestClaimedToday
                  ? 'Hadiah peti hari ini sudah kamu klaim. Kembali lagi besok untuk peti berikutnya!'
                  : isChestUnlocked
                  ? 'Kerja kerasmu hari ini luar biasa! Kamu telah menuntaskan target 50 XP harian.'
                  : `Kumpulkan ${remainingXp} XP lagi hari ini untuk membuka hadiah permata di peti ini.`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="font-brand font-black text-sm text-amber-900 flex items-center gap-1">
                <Lightning weight="fill" className="w-4 h-4 text-amber-500" />
                <span>+50 XP Harian</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-brand font-black text-sm text-amber-900 flex items-center gap-1">
                <span>+20 💎 Permata</span>
              </span>
            </div>
            <Button3D
              variant="amber"
              size="md"
              fullWidth
              disabled={!isChestUnlocked || isChestClaimedToday}
              onClick={handleClaimChest}
              className="py-2.5 font-black text-xs shadow-[0_3px_0_0_#B45309]"
            >
              {isChestClaimedToday
                ? 'HADIAH PETI SUDAH DIKLAIM ✓'
                : isChestUnlocked
                ? 'KLAIM HADIAH & LANJUTKAN 🎁'
                : 'SELESAIKAN TARGET 50 XP (TERKUNCI)'}
            </Button3D>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
