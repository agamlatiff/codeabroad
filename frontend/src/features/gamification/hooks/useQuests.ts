import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useUser } from '@/features/user/hooks/useUser'
import { languageService } from '@/features/curriculum/services/languageService'
import {
  curriculumService,
  CURRICULUM_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
import {
  contextualizeDailyQuestTarget,
  resolveCurriculumActiveGuidance,
} from '@/features/curriculum/constants/n5UnitStudyGuides'
import type { CurriculumResponse, LessonNodeResponse } from '@/features/curriculum/types/curriculum'
import {
  flashcardService,
  FLASHCARD_DECKS_QUERY_KEY,
} from '@/features/flashcard/services/flashcardService'
import {
  exerciseService,
  EXAM_RESULT_QUERY_KEY,
} from '@/features/exercise/services/exerciseService'
import {
  gamificationService,
  GAMIFICATION_STATUS_QUERY_KEY,
  GAMIFICATION_SHOP_QUERY_KEY,
  GAMIFICATION_BADGES_QUERY_KEY,
} from '@/features/gamification/services/gamificationService'
import {
  SHOP_ITEMS,
  type AchievementBadgeViewItem,
  type BadgeFilterTab,
  type DailyChestItem,
  type DailyQuestViewItem,
  type LevelExamSummary,
  type QuestPageTab,
  type ShopCategoryFilter,
  type ShopItem,
} from '@/features/gamification/constants/gamificationCatalog'
import {
  getProfileQueryKey,
  getActivityLogsQueryKey,
  getDailyRewardsQueryKey,
  getLanguageEnrollmentsQueryKey,
  getDailyQuestsQueryKey,
  DAILY_VOCABULARIES_QUERY_KEY,
  LEADERBOARD_QUERY_KEY,
  SRS_DUE_QUERY_KEY,
} from '@/shared/constants/queryKeys'
import { extractApiErrorMessage } from '@/shared/services/api'
import { getWibDateKey, getWibHour, getWibMidnightRemainingMs } from '@/shared/utils/date'
import { triggerHaptic } from '@/shared/utils/haptics'
import { audioEngine } from '@/shared/utils/audio'
import { BookOpen, Cards, Flask, Lightning, Target, Translate } from '@phosphor-icons/react'
import type { KodiEmotion } from '@/shared/components/ui/KodiCharacter'
import type { CVReviewSubmissionPayload } from '@/features/gamification/components/CVReviewSubmissionModal'
import type { MockInterviewSchedulePayload } from '@/features/gamification/components/MockInterviewScheduleModal'

export type QuestTab = 'all' | 'daily' | 'main' | 'side'

const VALID_QUEST_TABS: ReadonlySet<QuestPageTab> = new Set(['daily', 'milestones', 'shop'])
const URGENT_RESET_THRESHOLD_MS = 2 * 60 * 60 * 1000

const KODI_QUEST_TIPS: ReadonlyArray<{ emotion: KodiEmotion; speech: string }> = [
  {
    emotion: 'idea',
    speech: 'Tips: Mulai dari misi kilat 5 menit dulu agar Peti Perunggu langsung siap dibuka!',
  },
  {
    emotion: 'explaining',
    speech: 'Setiap pelajaran & misi yang selesai otomatis ikut dihitung ke target Lencana Bulanan.',
  },
  {
    emotion: 'curious',
    speech: 'Kumpulkan Gems dari Peti Harian untuk ditukar Streak Freeze atau Review CV di Pasar Guild.',
  },
  {
    emotion: 'clock',
    speech: 'Misi harian direset otomatis pukul 00:00 WIB. Luangkan 10 menit sebelum tidur biar streak aman!',
  },
  {
    emotion: 'cheering',
    speech: 'Tuntaskan ketiga misi hari ini untuk membuka Peti Emas (+30 Gems & +100 XP).',
  },
]

function parseQuestTabParam(raw: string | null): QuestPageTab {
  const lower = (raw ?? '').trim().toLowerCase()
  if (lower === 'boss' || lower === 'badges' || lower === 'exam' || lower === 'milestones') {
    return 'milestones'
  }
  if (lower === 'shop') return 'shop'
  return VALID_QUEST_TABS.has(lower as QuestPageTab) ? (lower as QuestPageTab) : 'daily'
}

function cleanLessonDisplayTitle(title: string, shortTitle?: string): string {
  if (shortTitle?.trim()) return shortTitle.trim()
  return title.replace(/^(?:pelajaran|lesson)\s*\d+\s*[:.\-–—]\s*/i, '').trim() || title
}

function resolveNextActiveLesson(curriculum: CurriculumResponse | null): {
  route: string
  title: string | null
} {
  if (!curriculum) return { route: '/curriculum', title: null }
  let fallbackUnlocked: LessonNodeResponse | null = null

  for (const unit of curriculum.units ?? []) {
    for (const lesson of unit.lessons ?? []) {
      if (curriculum.current_lesson_id && lesson.id === curriculum.current_lesson_id) {
        return {
          route: `/learn/${lesson.slug || lesson.id}`,
          title: cleanLessonDisplayTitle(lesson.title, lesson.short_title),
        }
      }
      if (!fallbackUnlocked && lesson.is_unlocked && !lesson.is_completed) {
        fallbackUnlocked = lesson
      }
    }
  }

  if (fallbackUnlocked) {
    return {
      route: `/learn/${fallbackUnlocked.slug || fallbackUnlocked.id}`,
      title: cleanLessonDisplayTitle(fallbackUnlocked.title, fallbackUnlocked.short_title),
    }
  }

  return { route: '/curriculum', title: null }
}

function formatEarnedDate(isoDate?: string | null): string | null {
  if (!isoDate) return null
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDisplayFirstName(rawName?: string): string {
  const firstToken = (rawName ?? '').trim().split(/\s+/)[0] || ''
  if (!firstToken) return 'Sobat'
  return firstToken.charAt(0).toUpperCase() + firstToken.slice(1)
}

function getWibTimeGreeting(hour: number): string {
  if (hour >= 4 && hour <= 10) return 'Semangat Pagi!'
  if (hour >= 11 && hour <= 14) return 'Semangat Siang!'
  if (hour >= 15 && hour <= 17) return 'Semangat Sore!'
  return 'Semangat Malam!'
}

/**
 * Pure backend-backed SSOT controller hook for QuestLogPage (/quests).
 * Avoids client-only localStorage gamification overrides and 1s parent timer ticks.
 */
export const useQuests = () => {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, updateUser } = useAuthStore()
  const userId = user?.id ?? 'anonymous'

  useUser()

  const rawTabParam = searchParams.get('tab')
  const activeTab = useMemo(() => parseQuestTabParam(rawTabParam), [rawTabParam])

  useEffect(() => {
    if (!rawTabParam || rawTabParam.trim().toLowerCase() !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true })
    }
  }, [activeTab, rawTabParam, setSearchParams])

  const [activeTipIndex, setActiveTipIndex] = useState<number | null>(null)
  const [shopCategory, setShopCategory] = useState<ShopCategoryFilter>('all')
  const [badgeFilter, setBadgeFilter] = useState<BadgeFilterTab>('all')

  const setActiveTab = useCallback(
    (nextTab: QuestPageTab) => {
      setActiveTipIndex(null)
      setSearchParams({ tab: nextTab }, { replace: true })
    },
    [setSearchParams]
  )

  const handleCycleKodiTip = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.playPop()
    setActiveTipIndex((prev) => (prev === null ? 0 : (prev + 1) % KODI_QUEST_TIPS.length))
  }, [])

  const [activeTrack, setActiveTrack] = useState('')

  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)
  const [selectedChestForModal, setSelectedChestForModal] = useState<DailyChestItem | null>(null)
  const [isChestModalOpen, setIsChestModalOpen] = useState(false)
  const [isMonthlyBadgeModalOpen, setIsMonthlyBadgeModalOpen] = useState(false)
  const [isCVModalOpen, setIsCVModalOpen] = useState(false)
  const [isMockModalOpen, setIsMockModalOpen] = useState(false)
  const [isPurchasingItemId, setIsPurchasingItemId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [floatingReward, setFloatingReward] = useState<string | null>(null)

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const floatingRewardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      if (floatingRewardTimerRef.current) clearTimeout(floatingRewardTimerRef.current)
    }
  }, [])

  const showToast = useCallback((message: string) => {
    setToastMessage(message)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }, [])

  const triggerFloatingReward = useCallback((text: string) => {
    setFloatingReward(text)
    if (floatingRewardTimerRef.current) clearTimeout(floatingRewardTimerRef.current)
    floatingRewardTimerRef.current = setTimeout(() => {
      setFloatingReward(null)
    }, 2500)
  }, [])

  // Backend SSOT gamification queries
  const statusQuery = useQuery({
    queryKey: [...GAMIFICATION_STATUS_QUERY_KEY, userId],
    queryFn: ({ signal }) => gamificationService.getStatus({ signal }),
    enabled: Boolean(user),
    staleTime: 60_000,
  })

  const shopQuery = useQuery({
    queryKey: GAMIFICATION_SHOP_QUERY_KEY,
    queryFn: ({ signal }) => gamificationService.listShopItems({ signal }),
    staleTime: 300_000,
  })

  const badgesQuery = useQuery({
    queryKey: [...GAMIFICATION_BADGES_QUERY_KEY, userId],
    queryFn: ({ signal }) => gamificationService.listBadges({ signal }),
    enabled: Boolean(user),
    staleTime: 120_000,
  })

  const curriculumQuery = useQuery({
    queryKey: [...CURRICULUM_QUERY_KEY, userId],
    queryFn: ({ signal }) => curriculumService.getCurriculum(undefined, { signal }),
    enabled: Boolean(user),
    staleTime: 120_000,
  })

  const enrollmentsQuery = useQuery({
    queryKey: getLanguageEnrollmentsQueryKey(userId),
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    enabled: Boolean(user),
    staleTime: 120_000,
  })

  const activeCurriculum = curriculumQuery.data ?? null
  const activeLevel = activeCurriculum?.level ?? null
  const activeLevelId = activeLevel?.id ?? ''
  const activeLangCode = activeCurriculum?.language?.code || 'ja'

  const earnedBadgeByKey = useMemo(() => {
    const map = new Map<string, string>()
    const list = badgesQuery.data?.user_badges ?? statusQuery.data?.badges ?? []
    for (const item of list) {
      map.set(item.badge_key, item.awarded_at)
    }
    return map
  }, [badgesQuery.data?.user_badges, statusQuery.data?.badges])

  const completedCurriculumLessons = activeCurriculum?.completed_lessons ?? 0
  const totalCurriculumLessons = activeCurriculum?.total_lessons ?? 0
  const allLevelLessonsCompleted =
    totalCurriculumLessons > 0 && completedCurriculumLessons >= totalCurriculumLessons
  const activeLevelCodeLower = (activeLevel?.code ?? '').toLowerCase()
  const hasLevelMasteryBadge = Boolean(
    activeLevelCodeLower && earnedBadgeByKey.has(`${activeLevelCodeLower}_mastery`)
  )

  const flashcardDecksQuery = useQuery({
    queryKey: [...FLASHCARD_DECKS_QUERY_KEY, activeLangCode, userId],
    queryFn: ({ signal }) => flashcardService.listDecks(activeLangCode, { signal }),
    enabled: Boolean(user && activeTab === 'milestones'),
    staleTime: 120_000,
  })

  const examResultQuery = useQuery({
    queryKey: [...EXAM_RESULT_QUERY_KEY, userId, activeLevelId],
    queryFn: async ({ signal }) => {
      try {
        return await exerciseService.getExamResult(activeLevelId, { signal })
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 404) {
          return null
        }
        throw err
      }
    },
    enabled: Boolean(user && activeLevelId && (allLevelLessonsCompleted || hasLevelMasteryBadge)),
    retry: false,
    staleTime: 120_000,
  })

  const dailyQuestsQuery = useQuery({
    queryKey: getDailyQuestsQueryKey(userId),
    queryFn: ({ signal }) => gamificationService.getDailyQuests({ signal }),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
  })

  const gamificationStatus = statusQuery.data ?? null

  useEffect(() => {
    if (!gamificationStatus) return
    updateUser({
      gems: gamificationStatus.gems,
      ...(typeof gamificationStatus.xp === 'number' ? { xp: gamificationStatus.xp } : {}),
      ...(typeof gamificationStatus.current_level === 'number'
        ? { current_level: gamificationStatus.current_level }
        : {}),
      ...(typeof gamificationStatus.streak === 'number'
        ? { streak: gamificationStatus.streak }
        : {}),
    })
  }, [gamificationStatus, updateUser])

  const userGems = gamificationStatus?.gems ?? user?.gems ?? 0
  const inventory = gamificationStatus?.inventory ?? {}

  const claimedDailyChests = useMemo<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {}
    for (const tier of gamificationStatus?.claimed_chests ?? []) {
      map[tier] = true
    }
    return map
  }, [gamificationStatus?.claimed_chests])

  const shopItems = useMemo<ShopItem[]>(() => {
    const remoteItems = shopQuery.data ?? []
    if (remoteItems.length === 0) return SHOP_ITEMS
    const fallbackById = new Map(SHOP_ITEMS.map((item) => [item.id, item]))
    return remoteItems.map((remote) => {
      const fallback = fallbackById.get(remote.id)
      return {
        id: remote.id,
        title: remote.title || fallback?.title || remote.id,
        subtitle: remote.subtitle || fallback?.subtitle || '',
        price: remote.price_gems,
        badge: remote.badge || fallback?.badge || 'ITEM',
        badgeColor: fallback?.badgeColor || 'bg-blue-100 text-blue-800 border-blue-200',
        icon: fallback?.icon || Flask,
        iconBg:
          fallback?.iconBg ||
          'bg-gradient-to-b from-blue-500 to-indigo-600 shadow-[0_3px_0_0_#1E3A8A]',
        iconColor: fallback?.iconColor || 'text-white',
        category:
          remote.category === 'booster' || remote.category === 'boost'
            ? 'booster'
            : remote.category === 'career'
              ? 'career'
              : 'protection',
      }
    })
  }, [shopQuery.data])

  const filteredShopItems = useMemo(() => {
    if (shopCategory === 'all') return shopItems
    return shopItems.filter((item) => item.category === shopCategory)
  }, [shopItems, shopCategory])

  // Pure UTC+7 WIB calendar calculations
  const todayDateKey = useMemo(() => getWibDateKey(), [])
  const [wibYear, wibMonth, wibDay] = useMemo(
    () => todayDateKey.split('-').map(Number),
    [todayDateKey]
  )
  const currentMonthYearName = useMemo(
    () =>
      new Date(Date.UTC(wibYear, wibMonth - 1, 15)).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      }),
    [wibYear, wibMonth]
  )
  const currentMonthShort = useMemo(
    () =>
      new Date(Date.UTC(wibYear, wibMonth - 1, 15))
        .toLocaleDateString('id-ID', {
          month: 'short',
          timeZone: 'Asia/Jakarta',
        })
        .replace('.', '')
        .slice(0, 3)
        .toUpperCase(),
    [wibYear, wibMonth]
  )
  const daysLeftInMonth = useMemo(() => {
    const lastDay = new Date(Date.UTC(wibYear, wibMonth, 0)).getUTCDate()
    return Math.max(1, lastDay - wibDay)
  }, [wibYear, wibMonth, wibDay])

  const activeGuidance = useMemo(
    () => resolveCurriculumActiveGuidance(activeCurriculum),
    [activeCurriculum]
  )

  // Daily quests rotate per user + WIB date from backend SSOT (/gamification/daily-quests)
  // and route to the unit-matched Flashcard deck or next Lesson.
  const dailyQuests = useMemo<DailyQuestViewItem[]>(
    () =>
      (dailyQuestsQuery.data ?? []).map((q) => {
        const icon =
          q.icon_name === 'cards'
            ? Cards
            : q.icon_name === 'translate'
              ? Translate
              : q.icon_name === 'lightning'
                ? Lightning
                : q.icon_name === 'target'
                  ? Target
                  : BookOpen
        const target = contextualizeDailyQuestTarget(q, activeGuidance)
        return {
          id: q.id,
          title: q.title,
          chip_label: target.chipLabel,
          difficulty: q.slot_category === 'curriculum' ? 'Pemula' : 'Mudah',
          xp_reward: q.xp_reward,
          gem_reward: 0,
          estimated_minutes: q.slot_category === 'curriculum' ? 15 : 5,
          isCompleted: q.is_completed,
          isClaimed: q.is_claimed,
          route: target.route,
          icon,
          iconName: q.icon_name || 'book-open',
          progressText: q.progress_text,
          progressPercent: q.progress_percent,
        }
      }),
    [activeGuidance, dailyQuestsQuery.data]
  )

  const levelExamSummary = useMemo<LevelExamSummary | null>(() => {
    if (!activeCurriculum || !activeLevel?.id) return null
    const nextLesson = resolveNextActiveLesson(activeCurriculum)
    const passedResult = examResultQuery.data ?? null
    const status: LevelExamSummary['status'] = passedResult?.attempt?.is_passed
      ? 'passed'
      : allLevelLessonsCompleted
        ? 'ready'
        : 'locked'
    const totalLessons = activeCurriculum.total_lessons
    const completedLessons = Math.min(totalLessons, activeCurriculum.completed_lessons)
    const progressPercent =
      totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0

    return {
      levelId: activeLevel.id,
      levelCode: activeLevel.code,
      languageName: activeCurriculum.language?.name || 'Bahasa Target',
      examName: activeLevel.official_exam_name || `Evaluasi Kesiapan ${activeLevel.code}`,
      passingScorePercent: activeLevel.passing_score_percent || 60,
      completedLessons,
      totalLessons,
      progressPercent,
      status,
      nextLessonRoute: nextLesson.route,
      nextLessonTitle: nextLesson.title,
      examRoute: `/exam/${encodeURIComponent(activeLevel.id)}`,
      passedResult,
    }
  }, [activeCurriculum, activeLevel, allLevelLessonsCompleted, examResultQuery.data])

  const enrolledLanguageCount = enrollmentsQuery.data?.length ?? (activeCurriculum ? 1 : 0)
  const learnedFlashcardsCount = useMemo(
    () => (flashcardDecksQuery.data ?? []).reduce((sum, deck) => sum + (deck.learned_cards || 0), 0),
    [flashcardDecksQuery.data]
  )
  const currentUserStreak = gamificationStatus?.streak ?? user?.streak ?? 0

  const achievementBadges = useMemo<AchievementBadgeViewItem[]>(() => {
    const catalog = badgesQuery.data?.catalog ?? []
    const nextLessonRoute = levelExamSummary?.nextLessonRoute ?? '/curriculum'

    const items = catalog.map<AchievementBadgeViewItem>((def) => {
      const awardedAtIso = earnedBadgeByKey.get(def.id) ?? null
      const isEarned = earnedBadgeByKey.has(def.id)
      const awardedAt = formatEarnedDate(awardedAtIso)

      let description = def.description
      let currentProgress = isEarned ? 1 : 0
      let targetProgress = 1
      let progressLabel = isEarned ? '1/1 Tercapai' : '0/1 Tercapai'
      let actionLabel: string | null = null
      let actionType: AchievementBadgeViewItem['actionType'] = null
      let actionRoute: string | undefined

      switch (def.id) {
        case 'akihabara_novice': {
          currentProgress = isEarned ? 1 : 0
          targetProgress = 1
          progressLabel = isEarned ? '1/1 Onboarding Selesai' : '0/1 Onboarding'
          break
        }
        case 'first_step': {
          currentProgress = isEarned ? 1 : Math.min(1, completedCurriculumLessons)
          targetProgress = 1
          progressLabel = `${currentProgress}/1 Pelajaran`
          if (!isEarned) {
            actionLabel = 'Mulai Pelajaran'
            actionType = 'navigate'
            actionRoute = nextLessonRoute
          }
          break
        }
        case 'streak_7': {
          targetProgress = 7
          currentProgress = isEarned ? 7 : Math.min(7, currentUserStreak)
          progressLabel = `${currentProgress}/7 Hari`
          if (!isEarned) {
            actionLabel = 'Ke Misi Harian'
            actionType = 'switch_tab_daily'
          }
          break
        }
        case 'streak_30': {
          targetProgress = 30
          currentProgress = isEarned ? 30 : Math.min(30, currentUserStreak)
          progressLabel = `${currentProgress}/30 Hari`
          if (!isEarned) {
            actionLabel = 'Ke Misi Harian'
            actionType = 'switch_tab_daily'
          }
          break
        }
        case 'srs_veteran': {
          targetProgress = 25
          currentProgress = isEarned ? 25 : Math.min(25, learnedFlashcardsCount)
          progressLabel = flashcardDecksQuery.data
            ? `${currentProgress}/25 Kartu`
            : 'Target: 25 Kartu SRS'
          if (!isEarned) {
            actionLabel = 'Latihan Flashcard'
            actionType = 'navigate'
            actionRoute = '/flashcards'
          }
          break
        }
        case 'n5_mastery': {
          if (isEarned) {
            currentProgress = 1
            targetProgress = 1
            progressLabel = 'Ujian Lulus • Lencana Diraih'
          } else if (levelExamSummary?.status === 'passed') {
            currentProgress = 1
            targetProgress = 1
            progressLabel = 'Ujian Lulus • Sinkronisasi Lencana'
          } else if (levelExamSummary && levelExamSummary.totalLessons > 0) {
            currentProgress = levelExamSummary.completedLessons
            targetProgress = levelExamSummary.totalLessons
            progressLabel =
              levelExamSummary.status === 'ready'
                ? `Ujian Siap • Lulus ≥ ${levelExamSummary.passingScorePercent}%`
                : `${currentProgress}/${targetProgress} Pelajaran`
          } else {
            progressLabel = 'Selesaikan Unit & Ujian N5'
          }
          if (!isEarned && levelExamSummary?.status !== 'passed') {
            if (levelExamSummary?.status === 'ready') {
              actionLabel = 'Mulai Ujian N5'
              actionType = 'navigate'
              actionRoute = levelExamSummary.examRoute
            } else {
              actionLabel = 'Lanjutkan Kurikulum'
              actionType = 'navigate'
              actionRoute = nextLessonRoute
            }
          }
          break
        }
        case 'multilingual_explorer': {
          targetProgress = 2
          currentProgress = isEarned ? 2 : Math.min(2, enrolledLanguageCount)
          progressLabel = `${currentProgress}/2 Bahasa`
          if (!isEarned) {
            actionLabel = 'Tambah Bahasa'
            actionType = 'open_track_switcher'
          }
          break
        }
        default: {
          if (!isEarned) {
            actionLabel = 'Lanjutkan Belajar'
            actionType = 'navigate'
            actionRoute = '/curriculum'
          }
          break
        }
      }

      const progressPercent =
        isEarned
          ? 100
          : targetProgress > 0
            ? Math.min(100, Math.round((currentProgress / targetProgress) * 100))
            : 0

      return {
        id: def.id,
        title: def.title,
        description,
        category: def.category,
        icon: def.icon,
        xpReward: def.xp_reward,
        isEarned,
        awardedAt,
        currentProgress,
        targetProgress,
        progressLabel,
        progressPercent,
        actionLabel,
        actionType,
        actionRoute,
      }
    })

    return items.sort((a, b) => {
      if (a.isEarned !== b.isEarned) return a.isEarned ? -1 : 1
      if (!a.isEarned && !b.isEarned && b.progressPercent !== a.progressPercent) {
        return b.progressPercent - a.progressPercent
      }
      return a.xpReward - b.xpReward
    })
  }, [
    badgesQuery.data?.catalog,
    completedCurriculumLessons,
    currentUserStreak,
    earnedBadgeByKey,
    enrolledLanguageCount,
    flashcardDecksQuery.data,
    learnedFlashcardsCount,
    levelExamSummary,
  ])

  const filteredBadges = useMemo(() => {
    if (badgeFilter === 'earned') return achievementBadges.filter((b) => b.isEarned)
    if (badgeFilter === 'locked') return achievementBadges.filter((b) => !b.isEarned)
    return achievementBadges
  }, [achievementBadges, badgeFilter])

  const earnedBadgeCount = useMemo(
    () => achievementBadges.filter((b) => b.isEarned).length,
    [achievementBadges]
  )

  const dailyDoneCount = dailyQuests.filter((d) => d.isCompleted).length
  const totalDailyTarget = dailyQuests.length

  const monthlyTargetCount = gamificationStatus?.monthly_target_count ?? 25
  const monthlyCompletedCount = Math.min(
    monthlyTargetCount,
    gamificationStatus?.monthly_completed_count ?? 0
  )
  const monthlyProgressPercent = Math.min(
    100,
    Math.round((monthlyCompletedCount / monthlyTargetCount) * 100)
  )
  const isMonthlyBadgeClaimed = Boolean(gamificationStatus?.monthly_badge_claimed)
  const xpBoosterActive = Boolean(gamificationStatus?.xp_booster_active)
  const xpBoosterExpiresAt = gamificationStatus?.xp_booster_expires_at ?? null

  const userFirstName = formatDisplayFirstName(user?.name)
  const wibHour = getWibHour()
  const timeGreeting = getWibTimeGreeting(wibHour)
  const isResetUrgent = getWibMidnightRemainingMs() < URGENT_RESET_THRESHOLD_MS

  const kodiCompanion = useMemo(() => {
    if (activeTab === 'shop') {
      if (userGems < 20) {
        return {
          emotion: 'curious' as KodiEmotion,
          badge: timeGreeting,
          badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
          speech: `Halo ${userFirstName}! Kumpulkan ${20 - userGems} Gems lagi dari Peti Harian untuk menukar Streak Freeze pertamamu.`,
        }
      }
      return {
        emotion: 'idea' as KodiEmotion,
        badge: 'Pasar Guild Aktif',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        speech: `Saldo kamu ${userGems} Gems, ${userFirstName}! Pilih proteksi streak atau kupon karier di etalase guild.`,
      }
    }

    if (activeTab === 'milestones') {
      if (levelExamSummary?.status === 'ready') {
        return {
          emotion: 'cheering' as KodiEmotion,
          badge: 'Ujian Siap Dibuka!',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          speech: `Semua pelajaran ${levelExamSummary.levelCode} sudah beres, ${userFirstName}! Yuk uji kemampuanmu untuk naik tingkat.`,
        }
      }
      return {
        emotion: 'explaining' as KodiEmotion,
        badge: timeGreeting,
        badgeBg: 'bg-violet-100 text-violet-900 border-violet-300',
        speech: `Kamu sudah meraih ${earnedBadgeCount} dari ${achievementBadges.length || 7} lencana, ${userFirstName}. Kejar milestone terdekat untuk bonus XP!`,
      }
    }

    if (totalDailyTarget > 0 && dailyDoneCount >= totalDailyTarget) {
      return {
        emotion: 'celebrate' as KodiEmotion,
        badge: 'Semua Misi Tuntas!',
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        speech: `Luar biasa, ${userFirstName}! Semua misi harian selesai — jangan lupa buka ketiga Peti Hadiahmu!`,
      }
    }

    if (isResetUrgent) {
      return {
        emotion: 'clock' as KodiEmotion,
        badge: timeGreeting,
        badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
        speech: `Sisa waktu harian kurang dari 2 jam, ${userFirstName}! Yuk tuntaskan misi tercepat agar streak aman.`,
      }
    }

    if (dailyDoneCount === 0) {
      return {
        emotion: 'welcome' as KodiEmotion,
        badge: timeGreeting,
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        speech: `Halo ${userFirstName}! Selesaikan 3 misi hari ini untuk menjaga streak dan membuka Peti Emas!`,
      }
    }

    return {
      emotion: 'cheering' as KodiEmotion,
      badge: timeGreeting,
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      speech: `Keren, ${userFirstName}! Tinggal ${totalDailyTarget - dailyDoneCount} misi lagi untuk membuka Peti Emas Harian!`,
    }
  }, [
    achievementBadges.length,
    activeTab,
    dailyDoneCount,
    earnedBadgeCount,
    isResetUrgent,
    levelExamSummary,
    timeGreeting,
    totalDailyTarget,
    userFirstName,
    userGems,
  ])

  const activeTip = activeTipIndex !== null ? KODI_QUEST_TIPS[activeTipIndex] : null
  const displayedKodiEmotion = activeTip ? activeTip.emotion : kodiCompanion.emotion
  const displayedKodiSpeech = activeTip ? activeTip.speech : kodiCompanion.speech

  const invalidateGamificationCaches = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [...GAMIFICATION_STATUS_QUERY_KEY, userId] }),
      queryClient.invalidateQueries({ queryKey: [...GAMIFICATION_BADGES_QUERY_KEY, userId] }),
      queryClient.invalidateQueries({ queryKey: getProfileQueryKey(userId) }),
      queryClient.invalidateQueries({ queryKey: getActivityLogsQueryKey(userId) }),
      queryClient.invalidateQueries({ queryKey: getDailyRewardsQueryKey(userId) }),
      queryClient.invalidateQueries({ queryKey: getDailyQuestsQueryKey(userId) }),
      queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY }),
    ])
  }, [queryClient, userId])

  const [claimingQuestId, setClaimingQuestId] = useState<string | null>(null)

  const handleClaimDailyQuest = useCallback(
    async (questId: string) => {
      if (!questId || claimingQuestId) return
      setClaimingQuestId(questId)
      try {
        const res = await gamificationService.claimDailyQuest(questId)
        triggerHaptic('success')
        audioEngine.playRewardClaim()
        updateUser({
          xp: res.current_xp,
          current_level: res.current_level,
          streak: res.streak,
        })
        triggerFloatingReward(`+${res.xp_awarded} XP`)
        showToast(`Misi harian diklaim! +${res.xp_awarded} XP masuk ke akunmu.`)
        await invalidateGamificationCaches()
      } catch (err) {
        triggerHaptic('error')
        showToast(extractApiErrorMessage(err, 'Gagal mengklaim hadiah misi harian.'))
      } finally {
        setClaimingQuestId(null)
      }
    },
    [claimingQuestId, updateUser, triggerFloatingReward, showToast, invalidateGamificationCaches]
  )

  // Mutations
  const claimChestMutation = useMutation({
    mutationFn: (tier: number) => gamificationService.claimDailyChest(tier),
  })

  const buyItemMutation = useMutation({
    mutationFn: (itemId: string) => gamificationService.buyShopItem(itemId),
  })

  const activateItemMutation = useMutation({
    mutationFn: (itemId: string) => gamificationService.activateShopItem(itemId),
  })

  const claimMonthlyBadgeMutation = useMutation({
    mutationFn: () => gamificationService.claimMonthlyBadge(),
  })

  const [isActivatingItemId, setIsActivatingItemId] = useState<string | null>(null)

  const handleSelectTrack = useCallback(
    async (languageId: string) => {
      if (!languageId) return
      try {
        const isAlreadyEnrolled = (enrollmentsQuery.data ?? []).some(
          (enrollment) => enrollment.language_id === languageId
        )
        if (!isAlreadyEnrolled) {
          await languageService.enrollLanguage(languageId)
        }
        await languageService.switchActiveLanguage(languageId)
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: getLanguageEnrollmentsQueryKey(userId) }),
          queryClient.invalidateQueries({ queryKey: CURRICULUM_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: DAILY_VOCABULARIES_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: SRS_DUE_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: [...GAMIFICATION_BADGES_QUERY_KEY, userId] }),
          queryClient.invalidateQueries({ queryKey: [...GAMIFICATION_STATUS_QUERY_KEY, userId] }),
          queryClient.invalidateQueries({ queryKey: FLASHCARD_DECKS_QUERY_KEY }),
        ])
        triggerHaptic('success')
        setActiveTrack(languageId)
        setIsCourseSwitcherOpen(false)
        if (!isAlreadyEnrolled) {
          showToast('Berhasil mendaftar & beralih ke bahasa baru!')
        }
      } catch (err: unknown) {
        triggerHaptic('error')
        audioEngine.playError()
        showToast(extractApiErrorMessage(err, 'Gagal mengganti bahasa aktif. Silakan coba lagi.'))
      }
    },
    [enrollmentsQuery.data, queryClient, showToast, userId]
  )

  const handleOpenChest = useCallback(
    (chest: DailyChestItem) => {
      if (!chest.unlocked) {
        triggerHaptic('error')
        audioEngine.playError()
        showToast(
          `Selesaikan ${chest.tier - dailyDoneCount} misi harian lagi untuk membuka ${chest.label}!`
        )
        return
      }
      triggerHaptic('tap')
      audioEngine.playPop()
      setSelectedChestForModal(chest)
      setIsChestModalOpen(true)
    },
    [dailyDoneCount, showToast]
  )

  const handleConfirmClaimChest = useCallback(async () => {
    if (!selectedChestForModal || claimChestMutation.isPending) return
    const tier = selectedChestForModal.tier
    const chestLabel = selectedChestForModal.label

    try {
      const res = await claimChestMutation.mutateAsync(tier)
      triggerHaptic('success')
      audioEngine.playChestClaim()

      updateUser({
        gems: res.status.gems,
        ...(typeof res.status.xp === 'number' ? { xp: res.status.xp } : {}),
        ...(typeof res.status.current_level === 'number'
          ? { current_level: res.status.current_level }
          : {}),
      })
      await invalidateGamificationCaches()

      const gemsAwarded = res.claim.gems_awarded
      const xpAwarded = res.claim.xp_awarded
      triggerFloatingReward(`+${xpAwarded > 0 ? `${xpAwarded} XP • ` : ''}+${gemsAwarded} 💎`)
      showToast(`${chestLabel} berhasil dibuka! +${gemsAwarded} Gems ditambahkan.`)
      setIsChestModalOpen(false)
    } catch (err: unknown) {
      triggerHaptic('error')
      audioEngine.playError()
      showToast(extractApiErrorMessage(err, 'Gagal membuka peti hadiah harian.'))
    }
  }, [
    claimChestMutation,
    invalidateGamificationCaches,
    selectedChestForModal,
    showToast,
    triggerFloatingReward,
    updateUser,
  ])

  const handlePurchaseShopItem = useCallback(
    async (item: ShopItem) => {
      if (isPurchasingItemId || buyItemMutation.isPending) return
      if (userGems < item.price) {
        triggerHaptic('error')
        audioEngine.playError()
        showToast(`Saldo Gems tidak cukup! Butuh ${item.price} Gems (Saldo: ${userGems}).`)
        return
      }

      setIsPurchasingItemId(item.id)
      try {
        const updatedStatus = await buyItemMutation.mutateAsync(item.id)
        triggerHaptic('success')
        audioEngine.playCoinJingle()
        updateUser({ gems: updatedStatus.gems })
        await invalidateGamificationCaches()
        showToast(`Berhasil menukar ${item.title}! Sisa Saldo: ${updatedStatus.gems} Gems.`)
      } catch (err: unknown) {
        triggerHaptic('error')
        audioEngine.playError()
        showToast(extractApiErrorMessage(err, `Gagal menukar ${item.title}.`))
      } finally {
        setIsPurchasingItemId(null)
      }
    },
    [buyItemMutation, invalidateGamificationCaches, isPurchasingItemId, showToast, updateUser, userGems]
  )

  const handleActivateShopItem = useCallback(
    async (itemId: string) => {
      if (isActivatingItemId || activateItemMutation.isPending) return
      setIsActivatingItemId(itemId)
      try {
        await activateItemMutation.mutateAsync(itemId)
        triggerHaptic('success')
        audioEngine.playRewardClaim()
        await invalidateGamificationCaches()
        showToast('2x XP Booster aktif selama 15 menit! Semua pelajaran & flashcard mendapat XP ganda.')
      } catch (err: unknown) {
        triggerHaptic('error')
        audioEngine.playError()
        showToast(extractApiErrorMessage(err, 'Gagal mengaktifkan item dari tas.'))
      } finally {
        setIsActivatingItemId(null)
      }
    },
    [activateItemMutation, invalidateGamificationCaches, isActivatingItemId, showToast]
  )

  const handleClaimMonthlyBadge = useCallback(async () => {
    if (claimMonthlyBadgeMutation.isPending) return
    try {
      const res = await claimMonthlyBadgeMutation.mutateAsync()
      triggerHaptic('success')
      audioEngine.playChestClaim()
      updateUser({
        ...(typeof res.status.xp === 'number' ? { xp: res.status.xp } : {}),
        ...(typeof res.status.current_level === 'number'
          ? { current_level: res.status.current_level }
          : {}),
      })
      await invalidateGamificationCaches()
      triggerFloatingReward(`+${res.claim.xp_awarded} XP`)
      showToast(`Lencana Emas Bulanan diklaim! +${res.claim.xp_awarded} XP ditambahkan.`)
      setIsMonthlyBadgeModalOpen(false)
    } catch (err: unknown) {
      triggerHaptic('error')
      audioEngine.playError()
      showToast(extractApiErrorMessage(err, 'Gagal mengklaim lencana bulanan.'))
    }
  }, [claimMonthlyBadgeMutation, invalidateGamificationCaches, showToast, triggerFloatingReward, updateUser])

  const handleCVSubmitted = useCallback(
    async (data: CVReviewSubmissionPayload) => {
      const res = await gamificationService.submitCoaching({
        type: 'cv-review',
        github_url: data.githubUrl || undefined,
        resume_url: data.resumeUrl,
        target_role: data.targetRole,
        notes: data.notes || undefined,
      })
      updateUser({ gems: res.status.gems })
      await invalidateGamificationCaches()
      showToast('Kupon Review CV berhasil digunakan. Mentor akan memeriksa berkas Anda!')
    },
    [invalidateGamificationCaches, showToast, updateUser]
  )

  const handleMockScheduled = useCallback(
    async (data: MockInterviewSchedulePayload) => {
      const res = await gamificationService.submitCoaching({
        type: 'mock-interview',
        discord_handle: data.discordHandle,
        interview_language: data.language,
        focus_topic: data.focusTopic,
        preferred_time: data.preferredTime,
      })
      updateUser({ gems: res.status.gems })
      await invalidateGamificationCaches()
      showToast('Pengajuan Mock Interview VIP berhasil dikirim! Silakan periksa Discord Anda.')
    },
    [invalidateGamificationCaches, showToast, updateUser]
  )

  const dailyProgressPercent =
    totalDailyTarget > 0 ? Math.min(100, Math.round((dailyDoneCount / totalDailyTarget) * 100)) : 0

  const trackProgressMap = useMemo<Record<string, { completed: number; total: number }>>(() => {
    if (!activeCurriculum?.language) return {}
    const stats = {
      completed: activeCurriculum.completed_lessons,
      total: activeCurriculum.total_lessons,
    }
    return {
      [activeCurriculum.language.id]: stats,
      [activeCurriculum.language.code]: stats,
    }
  }, [activeCurriculum])

  const resolvedActiveTrack =
    activeTrack || activeCurriculum?.language?.id || activeCurriculum?.language?.code || ''

  const totalCount = dailyQuests.length + achievementBadges.length
  const completedCount = dailyDoneCount + earnedBadgeCount
  const progressPercent =
    totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0

  return {
    activeTab,
    setActiveTab,
    shopCategory,
    setShopCategory,
    badgeFilter,
    setBadgeFilter,
    activeTrack: resolvedActiveTrack,
    trackProgressMap,
    isCourseSwitcherOpen,
    setIsCourseSwitcherOpen,
    selectedChestForModal,
    isChestModalOpen,
    setIsChestModalOpen,
    isMonthlyBadgeModalOpen,
    setIsMonthlyBadgeModalOpen,
    isCVModalOpen,
    setIsCVModalOpen,
    isMockModalOpen,
    setIsMockModalOpen,
    isPurchasingItemId,
    isActivatingItemId,
    isClaimingMonthlyBadge: claimMonthlyBadgeMutation.isPending,
    xpBoosterActive,
    xpBoosterExpiresAt,
    toastMessage,
    setToastMessage,
    floatingReward,
    userGems,
    inventory,
    claimedDailyChests,
    shopItems,
    filteredShopItems,
    dailyQuests,
    levelExamSummary,
    achievementBadges,
    filteredBadges,
    earnedBadgeCount,
    dailyDoneCount,
    totalDailyTarget,
    dailyProgressPercent,
    currentMonthYearName,
    currentMonthShort,
    daysLeftInMonth,
    monthlyCompletedCount,
    monthlyTargetCount,
    monthlyProgressPercent,
    isMonthlyBadgeClaimed,
    kodiCompanion,
    displayedKodiEmotion,
    displayedKodiSpeech,
    activeTipIndex,
    handleCycleKodiTip,
    completedCount,
    totalCount,
    progressPercent,
    isLoading: statusQuery.isLoading || dailyQuestsQuery.isLoading,
    isMilestonesLoading: badgesQuery.isLoading || curriculumQuery.isLoading,
    claimingQuestId,
    handleClaimDailyQuest,
    handleSelectTrack,
    handleOpenChest,
    handleConfirmClaimChest,
    handlePurchaseShopItem,
    handleActivateShopItem,
    handleClaimMonthlyBadge,
    handleCVSubmitted,
    handleMockScheduled,
  }
}
