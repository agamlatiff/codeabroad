import { useState, useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useQuests } from '../../hooks'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import type { UserActivitySummary } from '../../types/auth'
import { TechNihongoCard } from './TechNihongoCard'
import { StreakCalendarModal } from './StreakCalendarModal'
import { Button3D } from '../ui/Button3D'
import { triggerHaptic } from '../../utils/haptics'
import { audioEngine } from '../../utils/audio'
import {
  Target,
  Fire,
  Clock,
  CheckCircle,
  Code,
  Translate,
  Lightning,
  Gift,
  CalendarCheck,
  X,
} from '@phosphor-icons/react'

export interface GameSidebarRailProps {
  className?: string
  activeTrack?: string
}

/**
 * GameSidebarRail (SSOT)
 * Standardized right-rail gamification sidebar for CodeAbroad.
 * Seamless Sectional Duolingo Layout (Zero Card-itis), Sticky 100vh Positioning,
 * Dynamic 7-Day Streak, Adaptive Multi-Track Quests, and Golden Chest Portal.
 */
export const GameSidebarRail = ({
  className = '',
  activeTrack: propActiveTrack,
}: GameSidebarRailProps) => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const { dailyQuests, timeLeft } = useQuests()

  const activeTrack =
    propActiveTrack || user?.primary_stack || user?.career_path?.slug || 'golang'

  // Daily persistence keys per calendar day (YYYY-MM-DD)
  const todayDateStr = new Date().toISOString().slice(0, 10)
  const chestStorageKey = `codeabroad_daily_chest_claimed_${todayDateStr}`
  const vocabStorageKey = `codeabroad_vocab_reviewed_${todayDateStr}`
  const claimedVocabQuestKey = `codeabroad_vocab_quest_claimed_${todayDateStr}`

  const [isChestModalOpen, setIsChestModalOpen] = useState(false)
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false)
  const [floatingRewards, setFloatingRewards] = useState<{ id: number; amount: number; x: number; y: number }[]>([])

  const spawnFloatingReward = useCallback((amount: number, clientX?: number, clientY?: number) => {
    const x = typeof clientX === 'number' && clientX > 0 ? clientX : window.innerWidth / 2
    const y = typeof clientY === 'number' && clientY > 0 ? clientY : window.innerHeight / 2
    const id = Date.now() + Math.random()
    setFloatingRewards((prev) => [...prev, { id, amount, x, y }])
    window.dispatchEvent(new CustomEvent('codeabroad_xp_gained', { detail: { amount } }))
    setTimeout(() => {
      setFloatingRewards((prev) => prev.filter((r) => r.id !== id))
    }, 1500)
  }, [])

  const [isChestClaimedToday, setIsChestClaimedToday] = useState(() => {
    return localStorage.getItem(chestStorageKey) === 'true'
  })
  const [reviewedNihongoToday, setReviewedNihongoToday] = useState(() => {
    return localStorage.getItem(vocabStorageKey) === 'true'
  })
  const [claimedLocalQuest, setClaimedLocalQuest] = useState(() => {
    return localStorage.getItem(claimedVocabQuestKey) === 'true'
  })

  const [questCompletionTick, setQuestCompletionTick] = useState(0)
  const [activitySummary, setActivitySummary] = useState<UserActivitySummary | null>(null)

  // Aggregated active dates from activity logs and weekly logs for StreakCalendarModal
  const calendarActiveDates = useMemo(() => {
    const dates = new Set<string>()
    if (activitySummary?.active_dates) {
      activitySummary.active_dates.forEach((d) => dates.add(d))
    }
    if (activitySummary?.weekly_logs) {
      activitySummary.weekly_logs.forEach((log) => {
        if (log.is_active && log.date) {
          dates.add(log.date)
        }
      })
    }
    return Array.from(dates)
  }, [activitySummary])

  // Listen to quest completion events across tabs and components
  useEffect(() => {
    const handleQuestCompleted = () => {
      setQuestCompletionTick((t) => t + 1)
      setIsChestClaimedToday(localStorage.getItem(chestStorageKey) === 'true')
      setReviewedNihongoToday(localStorage.getItem(vocabStorageKey) === 'true')
      setClaimedLocalQuest(localStorage.getItem(claimedVocabQuestKey) === 'true')
    }
    window.addEventListener('codeabroad_quest_completed', handleQuestCompleted)
    window.addEventListener('storage', handleQuestCompleted)
    return () => {
      window.removeEventListener('codeabroad_quest_completed', handleQuestCompleted)
      window.removeEventListener('storage', handleQuestCompleted)
    }
  }, [chestStorageKey, vocabStorageKey, claimedVocabQuestKey])

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

  const handleVocabReview = useCallback(() => {
    if (!reviewedNihongoToday) {
      localStorage.setItem(vocabStorageKey, 'true')
      setReviewedNihongoToday(true)
      triggerHaptic('success')
    }
  }, [reviewedNihongoToday, vocabStorageKey])

  const handleClaimVocabQuest = async (e?: React.MouseEvent | { clientX?: number; clientY?: number }) => {
    triggerHaptic('success')
    audioEngine.playRewardClaim()
    spawnFloatingReward(30, e?.clientX, e?.clientY)
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

  const handleClaimChest = async (e?: React.MouseEvent | { clientX?: number; clientY?: number }) => {
    triggerHaptic('success')
    audioEngine.playChestClaim()
    spawnFloatingReward(50, e?.clientX, e?.clientY)
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

  // Aggregate completed quests from server + local storage
  const completedQuestsSet = useMemo(() => {
    const set = new Set<string>()
    if (dailyQuests && dailyQuests.length > 0) {
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

  const userStreak = typeof user?.streak === 'number' ? user.streak : 0

  // Dynamic day calculation (0=Sen, 1=Sel, 2=Rab, 3=Kam, 4=Jum, 5=Sab, 6=Min)
  const jsDay = new Date().getDay()
  const todayDayIndex = jsDay === 0 ? 6 : jsDay - 1

  // Dynamic Daily Quests & Golden Chest XP Progress
  const dailyTargetXp = 50
  const completedDailyQuests = (dailyQuests || []).filter((q) => q.user_status === 'completed')

  // Dynamic Coding Quest Configuration based on Active Career Track
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

  const isCurrentTrackPart1Completed = completedQuestsSet.has(trackQuestConfig.id)

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

  // Active Daily Quests with realistic state adapted to current track and backend API
  const activeQuests = useMemo(() => {
    const defaultQuests = [
      {
        id: trackQuestConfig.id,
        title: trackQuestConfig.title,
        chip_label: trackQuestConfig.chip_label,
        route: trackQuestConfig.route,
        xp_reward: 50,
        user_status: (isCurrentTrackPart1Completed ? 'completed' : 'available') as 'completed' | 'available' | 'ready_to_claim',
      },
      {
        id: 'nihongo-n3-vocab',
        title: 'Review 1 Kosakata Standup Tokyo',
        chip_label: 'STANDUP IT',
        route: '#tech-nihongo-card',
        xp_reward: 30,
        user_status: (claimedLocalQuest
          ? 'completed'
          : reviewedNihongoToday
          ? 'ready_to_claim'
          : 'available') as 'completed' | 'available' | 'ready_to_claim',
      },
    ]

    if (dailyQuests && dailyQuests.length > 0) {
      const apiMapped = dailyQuests.slice(0, 3).map((q) => ({
        id: q.id,
        title: q.title,
        chip_label: q.chip_label || 'MISI HARIAN',
        route: `/learn/${q.id}`,
        xp_reward: q.xp_reward || 30,
        user_status: (completedQuestsSet.has(q.id) || q.user_status === 'completed'
          ? 'completed'
          : 'available') as 'completed' | 'available' | 'ready_to_claim',
      }))
      const hasNihongo = apiMapped.some((q) => q.id.includes('nihongo') || q.title.toLowerCase().includes('jepang'))
      if (!hasNihongo) {
        return [...apiMapped.slice(0, 2), defaultQuests[1]]
      }
      return apiMapped
    }

    return defaultQuests
  }, [
    dailyQuests,
    trackQuestConfig,
    isCurrentTrackPart1Completed,
    claimedLocalQuest,
    reviewedNihongoToday,
    completedQuestsSet,
  ])

  return (
    <>
      <aside
        className={`hidden xl:block w-[354px] shrink-0 border-l border-slate-200/80 bg-white p-4 xl:px-4.5 xl:py-4 pb-8 space-y-3 select-none xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto custom-scrollbar xl:self-start ${className}`}
      >
        {/* ── 1. 7-DAY STREAK CONSISTENCY TRACKER (SEAMLESS SECTION) ── */}
        <div className="space-y-2">
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

            {/* Flame Pill Badge & Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                setIsStreakModalOpen(true)
              }}
              className="bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-brand font-black text-[10px] px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 group/streak"
              title="Buka Kalender Rentetan Belajar Lengkap"
            >
              <Fire weight="fill" className="w-3 h-3 text-amber-200 animate-pulse" />
              <span>{userStreak} Hari</span>
              <span className="bg-white/20 text-[9px] px-1 py-0.2 rounded font-bold group-hover/streak:bg-white/30 flex items-center gap-0.5">
                <CalendarCheck weight="bold" className="w-2.5 h-2.5" />
                <span>Kalender</span>
              </span>
            </button>
          </div>

          {/* 7 Days Duolingo Flame Tokens Row (Clickable) */}
          <div
            onClick={() => {
              triggerHaptic('tap')
              setIsStreakModalOpen(true)
            }}
            className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center bg-orange-50/30 hover:bg-orange-50/60 border border-orange-100/80 hover:border-orange-300 rounded-2xl p-1.5 sm:p-2 shadow-2xs cursor-pointer transition-colors"
            title="Klik untuk membuka Kalender Kehadiran & Rentetan Lengkap 📅"
          >
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
                    <div
                      className="w-7 h-7 rounded-xl bg-gradient-to-b from-amber-400 via-orange-400 to-orange-500 shadow-[0_2px_0_0_#C2410C] flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 group/token cursor-default"
                      title={`${item.label}: Hari Aktif Belajar 🔥`}
                    >
                      <Fire
                        weight="fill"
                        className="w-3.5 h-3.5 text-amber-100 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] animate-pulse"
                      />
                    </div>
                  ) : isToday ? (
                    <div
                      className="w-7 h-7 rounded-xl bg-orange-50 border-2 border-dashed border-orange-400 flex items-center justify-center text-orange-500 shadow-2xs relative"
                      title="Hari ini: Belajar 1 modul untuk menyalakan api!"
                    >
                      <Fire weight="bold" className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
                    </div>
                  ) : (
                    <div
                      className="w-7 h-7 rounded-xl bg-slate-100/80 border border-slate-200/90 flex items-center justify-center text-slate-400"
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
        <div id="daily-quests-section" className="space-y-2 scroll-mt-20">
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
          <div className="p-2 bg-amber-50/30 border border-amber-100/90 rounded-xl space-y-1.5 shadow-2xs">
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
          <div className="space-y-1.5">
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
                  className="p-2 sm:p-2.5 bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-all group"
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
                      onClick={(e) => handleClaimVocabQuest(e)}
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
        <div id="tech-nihongo-card">
          <TechNihongoCard
            isReviewed={reviewedNihongoToday}
            isClaimed={claimedLocalQuest}
            onReview={handleVocabReview}
            onClaim={(e?: React.MouseEvent) => handleClaimVocabQuest(e)}
          />
        </div>
      </aside>

      {/* ── STREAK ATTENDANCE CALENDAR MODAL ── */}
      <StreakCalendarModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        currentStreak={userStreak}
        activeDates={calendarActiveDates}
      />

      {/* ── FLOATING XP BURST REWARDS ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 pointer-events-none z-[9999]">
            {floatingRewards.map((reward) => (
              <div
                key={reward.id}
                className="absolute transform -translate-x-1/2 -translate-y-full animate-float-up-fade flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 font-brand font-black text-sm shadow-[0_4px_16px_rgba(245,158,11,0.5)] border-2 border-white ring-2 ring-amber-400/50"
                style={{ left: reward.x, top: reward.y }}
              >
                <Lightning weight="fill" className="w-4 h-4 text-amber-950 animate-bounce" />
                <span>+{reward.amount} XP</span>
                <span className="text-xs">⚡</span>
              </div>
            ))}
          </div>,
          document.body
        )}

      {/* ── CELEBRATION MODAL FOR DAILY GOLDEN CHEST ── */}
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
              onClick={(e) => handleClaimChest(e)}
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
    </>
  )
}
