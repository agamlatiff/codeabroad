import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { questService } from '../../services/questService'
import { triggerHaptic } from '../../utils/haptics'
import { audioEngine } from '../../utils/audio'
import { PROFILE_QUERY_KEY } from '../layout/useAppTopBar'

export const ACTIVITY_LOGS_QUERY_KEY = ['activity-logs'] as const
export const DAILY_REWARDS_QUERY_KEY = ['daily-rewards'] as const
export const DAILY_QUESTS_QUERY_KEY = ['daily-quests'] as const

const DAILY_TARGET_XP = 50
const VOCAB_QUEST_REWARD_XP = 30
const GOLDEN_CHEST_REWARD_XP = 50
const FLOATING_REWARD_DURATION_MS = 1500
const HIGHLIGHT_DURATION_MS = 2000
const DRAWER_CLOSE_DURATION_MS = 220

const DEFAULT_WEEKDAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'] as const

export interface SidebarDailyQuestItem {
  id: string
  title: string
  chipLabel: string
  route: string
  xpReward: number
  isLanguage: boolean
  status: 'completed' | 'available' | 'ready_to_claim'
}

export interface WeeklyStreakDayItem {
  label: string
  dayIndex: number
  isToday: boolean
  isCompleted: boolean
  xpEarned: number
  questsCount: number
}

export interface FloatingRewardItem {
  id: number
  amount: number
  x: number
  y: number
}

export interface UseAppRightSidebarOptions {
  onCloseMobileDrawer?: () => void
}

/**
 * 1:1 Headless controller hook for AppRightSidebar.
 * Synchronizes 7-day streak logs, daily quests, and daily chest rewards
 * directly from PostgreSQL via TanStack Query with zero localStorage scraping.
 */
export const useAppRightSidebar = ({ onCloseMobileDrawer }: UseAppRightSidebarOptions = {}) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()

  // 1. Server state queries via TanStack Query
  const { data: activitySummary = null } = useQuery({
    queryKey: ACTIVITY_LOGS_QUERY_KEY,
    queryFn: () => authService.getActivityLogs(),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

  const { data: dailyRewardsStatus = null } = useQuery({
    queryKey: DAILY_REWARDS_QUERY_KEY,
    queryFn: () => authService.getDailyRewardsStatus(),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

  const { data: dailyQuests = [] } = useQuery({
    queryKey: DAILY_QUESTS_QUERY_KEY,
    queryFn: () => questService.getDailyQuests(),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

  // 2. Local UI states
  const [isChestModalOpen, setIsChestModalOpen] = useState(false)
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false)
  const [isClosingDrawer, setIsClosingDrawer] = useState(false)
  const [reviewedNihongoSession, setReviewedNihongoSession] = useState(false)
  const [isNihongoHighlighted, setIsNihongoHighlighted] = useState(false)
  const [floatingRewards, setFloatingRewards] = useState<FloatingRewardItem[]>([])
  const [timeLeft, setTimeLeft] = useState('00:00:00')

  const nihongoSectionRef = useRef<HTMLDivElement | null>(null)
  const rewardTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const drawerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up all timers on unmount
  useEffect(() => {
    const rewardTimers = rewardTimersRef.current
    return () => {
      rewardTimers.forEach((timer) => clearTimeout(timer))
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
      if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current)
    }
  }, [])

  // Countdown timer to midnight JST (UTC+9)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const jstNow = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60 * 1000)
      const jstMidnight = new Date(jstNow)
      jstMidnight.setHours(24, 0, 0, 0)
      const diffMs = jstMidnight.getTime() - jstNow.getTime()

      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
      const pad = (n: number) => n.toString().padStart(2, '0')
      setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  // 3. Derived streak & daily reward states from backend responses
  const isVocabQuestClaimed = Boolean(dailyRewardsStatus?.vocab_quest_claimed)
  const isChestClaimedToday = Boolean(dailyRewardsStatus?.golden_chest_claimed)
  const isNihongoReviewed = isVocabQuestClaimed || reviewedNihongoSession

  const userStreak =
    activitySummary?.current_streak ?? (typeof user?.streak === 'number' ? user.streak : 0)

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

  const weeklyStreakDays: WeeklyStreakDayItem[] = useMemo(() => {
    if (activitySummary?.weekly_logs && activitySummary.weekly_logs.length === 7) {
      return activitySummary.weekly_logs.map((log) => ({
        label: log.day_label,
        dayIndex: log.day_index,
        isToday: log.is_today,
        isCompleted: log.is_active,
        xpEarned: log.xp_earned,
        questsCount: log.quests_count,
      }))
    }

    const jsDay = new Date().getDay()
    const todayDayIndex = jsDay === 0 ? 6 : jsDay - 1

    return DEFAULT_WEEKDAY_LABELS.map((label, dayIndex) => ({
      label,
      dayIndex,
      isToday: dayIndex === todayDayIndex,
      isCompleted: dayIndex === todayDayIndex && userStreak > 0,
      xpEarned: 0,
      questsCount: 0,
    }))
  }, [activitySummary, userStreak])

  // Calculate today's earned XP from backend weekly log + completed daily quests
  const todayEarnedXp = useMemo(() => {
    const todayLogXp =
      activitySummary?.weekly_logs?.find((log) => log.is_today)?.xp_earned ?? 0
    const completedQuestsXp = dailyQuests
      .filter((q) => q.user_status === 'completed')
      .reduce((sum, q) => sum + (q.xp_reward || 0), 0)
    const vocabClaimXp = isVocabQuestClaimed ? VOCAB_QUEST_REWARD_XP : 0

    const rawXp = Math.max(todayLogXp, completedQuestsXp + vocabClaimXp)
    return Math.min(DAILY_TARGET_XP, rawXp)
  }, [activitySummary, dailyQuests, isVocabQuestClaimed])

  const dailyProgressPercent = Math.min(
    100,
    Math.round((todayEarnedXp / DAILY_TARGET_XP) * 100)
  )
  const isChestUnlocked = todayEarnedXp >= DAILY_TARGET_XP
  const remainingXp = Math.max(0, DAILY_TARGET_XP - todayEarnedXp)

  // Build actionable daily quest items from backend dailyQuests + daily Nihongo review mission
  const activeQuests: SidebarDailyQuestItem[] = useMemo(() => {
    const nihongoMission: SidebarDailyQuestItem = {
      id: 'nihongo-daily-vocab',
      title: 'Review 1 Kosakata Standup Tokyo',
      chipLabel: 'STANDUP IT',
      route: '#tech-nihongo-card',
      xpReward: VOCAB_QUEST_REWARD_XP,
      isLanguage: true,
      status: isVocabQuestClaimed
        ? 'completed'
        : isNihongoReviewed
          ? 'ready_to_claim'
          : 'available',
    }

    const mappedApiQuests: SidebarDailyQuestItem[] = dailyQuests.slice(0, 2).map((q) => {
      const lowerTitle = q.title.toLowerCase()
      const isLang =
        q.id.includes('nihongo') ||
        lowerTitle.includes('kosakata') ||
        lowerTitle.includes('jepang')

      return {
        id: q.id,
        title: q.title,
        chipLabel: q.chip_label || 'MISI HARIAN',
        route: `/learn/${q.id}`,
        xpReward: q.xp_reward || VOCAB_QUEST_REWARD_XP,
        isLanguage: isLang,
        status: q.user_status === 'completed' ? 'completed' : 'available',
      }
    })

    return [...mappedApiQuests, nihongoMission]
  }, [dailyQuests, isVocabQuestClaimed, isNihongoReviewed])

  // 4. Floating XP burst helper
  const spawnFloatingReward = useCallback((amount: number, clientX?: number, clientY?: number) => {
    const x = typeof clientX === 'number' && clientX > 0 ? clientX : window.innerWidth / 2
    const y = typeof clientY === 'number' && clientY > 0 ? clientY : window.innerHeight / 2
    const id = Date.now() + Math.random()

    setFloatingRewards((prev) => [...prev, { id, amount, x, y }])

    const timer = setTimeout(() => {
      setFloatingRewards((prev) => prev.filter((r) => r.id !== id))
    }, FLOATING_REWARD_DURATION_MS)
    rewardTimersRef.current.push(timer)
  }, [])

  // 5. TanStack Query Mutation for claiming daily rewards on backend PostgreSQL
  const claimRewardMutation = useMutation({
    mutationFn: (rewardType: 'vocab_quest' | 'golden_chest') =>
      authService.claimDailyReward(rewardType),
    onSuccess: (res) => {
      updateUser({
        xp: res.current_xp,
        current_level: res.current_level,
        streak: res.streak,
      })
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: DAILY_REWARDS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: DAILY_QUESTS_QUERY_KEY })
    },
  })

  // 6. Action Handlers
  const handleVocabReview = useCallback(() => {
    if (!isNihongoReviewed) {
      setReviewedNihongoSession(true)
      triggerHaptic('success')
    }
  }, [isNihongoReviewed])

  const handleClaimVocabQuest = useCallback(
    (e?: React.MouseEvent | { clientX?: number; clientY?: number }) => {
      if (isVocabQuestClaimed || claimRewardMutation.isPending) return
      triggerHaptic('success')
      audioEngine.playRewardClaim()
      spawnFloatingReward(VOCAB_QUEST_REWARD_XP, e?.clientX, e?.clientY)
      claimRewardMutation.mutate('vocab_quest')
    },
    [isVocabQuestClaimed, claimRewardMutation, spawnFloatingReward]
  )

  const handleClaimChest = useCallback(
    (e?: React.MouseEvent | { clientX?: number; clientY?: number }) => {
      if (!isChestUnlocked || isChestClaimedToday || claimRewardMutation.isPending) return
      triggerHaptic('success')
      audioEngine.playChestClaim()
      spawnFloatingReward(GOLDEN_CHEST_REWARD_XP, e?.clientX, e?.clientY)
      setIsChestModalOpen(false)
      claimRewardMutation.mutate('golden_chest')
    },
    [isChestUnlocked, isChestClaimedToday, claimRewardMutation, spawnFloatingReward]
  )

  const handleQuestAction = useCallback(
    (quest: SidebarDailyQuestItem) => {
      triggerHaptic('tap')
      if (quest.isLanguage) {
        nihongoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setIsNihongoHighlighted(true)
        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
        highlightTimerRef.current = setTimeout(() => {
          setIsNihongoHighlighted(false)
        }, HIGHLIGHT_DURATION_MS)
      } else {
        navigate(quest.route)
      }
    },
    [navigate]
  )

  const handleCloseMobileDrawer = useCallback(() => {
    setIsClosingDrawer(true)
    if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current)
    drawerTimerRef.current = setTimeout(() => {
      setIsClosingDrawer(false)
      onCloseMobileDrawer?.()
    }, DRAWER_CLOSE_DURATION_MS)
  }, [onCloseMobileDrawer])

  return {
    userStreak,
    timeLeft,
    dailyTargetXp: DAILY_TARGET_XP,
    todayEarnedXp,
    dailyProgressPercent,
    isChestUnlocked,
    isChestClaimedToday,
    remainingXp,
    weeklyStreakDays,
    calendarActiveDates,
    activeQuests,
    isNihongoReviewed,
    isVocabQuestClaimed,
    isNihongoHighlighted,
    nihongoSectionRef,
    isChestModalOpen,
    setIsChestModalOpen,
    isStreakModalOpen,
    setIsStreakModalOpen,
    isClosingDrawer,
    floatingRewards,
    handleVocabReview,
    handleClaimVocabQuest,
    handleClaimChest,
    handleQuestAction,
    handleCloseMobileDrawer,
  }
}
