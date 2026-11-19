import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useUser } from '@/features/user/hooks/useUser'
import { useUserActivity } from '@/features/user/hooks/useUserActivity'
import { useDailyRewards } from '@/features/user/hooks/useDailyRewards'
import { languageService } from '@/features/curriculum/services/languageService'
import { CURRICULUM_QUERY_KEY } from '@/features/curriculum/services/curriculumService'
import {
  gamificationService,
  GAMIFICATION_STATUS_QUERY_KEY,
  GAMIFICATION_SHOP_QUERY_KEY,
  GAMIFICATION_BADGES_QUERY_KEY,
} from '@/features/gamification/services/gamificationService'
import {
  SHOP_ITEMS,
  MILESTONE_CHALLENGES,
  type DailyChestItem,
  type DailyQuestViewItem,
  type MilestoneChallengeViewItem,
  type QuestPageTab,
  type ShopItem,
} from '@/features/gamification/constants/gamificationCatalog'
import {
  getProfileQueryKey,
  getActivityLogsQueryKey,
  getDailyRewardsQueryKey,
  getLanguageEnrollmentsQueryKey,
  DAILY_VOCABULARIES_QUERY_KEY,
  SRS_DUE_QUERY_KEY,
} from '@/shared/constants/queryKeys'
import { extractApiErrorMessage } from '@/shared/services/api'
import { getWibDateKey } from '@/shared/utils/date'
import { triggerHaptic } from '@/shared/utils/haptics'
import { audioEngine } from '@/shared/utils/audio'
import { BookOpen, Flask, Lightning, Translate } from '@phosphor-icons/react'
import type { KodiEmotion } from '@/shared/components/ui/KodiCharacter'
import type { CVReviewSubmissionPayload } from '@/features/gamification/components/CVReviewSubmissionModal'
import type { MockInterviewSchedulePayload } from '@/features/gamification/components/MockInterviewScheduleModal'

export type QuestTab = 'all' | 'daily' | 'main' | 'side'

/**
 * Pure backend-backed SSOT controller hook for QuestLogPage (/quests).
 * Avoids client-only localStorage gamification overrides and 1s parent timer ticks.
 */
export const useQuests = () => {
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()
  const userId = user?.id ?? 'anonymous'

  useUser()
  const {
    data: { activitySummary },
  } = useUserActivity()
  const {
    data: { dailyRewardsStatus },
  } = useDailyRewards()

  const [activeTab, setActiveTab] = useState<QuestPageTab>('daily')
  const [searchQuery, setSearchQuery] = useState('')
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
        iconBg: fallback?.iconBg || 'bg-blue-50 border-blue-200',
        iconColor: fallback?.iconColor || 'text-blue-600',
        category:
          remote.category === 'booster' || remote.category === 'boost'
            ? 'booster'
            : remote.category === 'career'
              ? 'career'
              : 'protection',
      }
    })
  }, [shopQuery.data])

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
  const daysLeftInMonth = useMemo(() => {
    const lastDay = new Date(Date.UTC(wibYear, wibMonth, 0)).getUTCDate()
    return Math.max(1, lastDay - wibDay)
  }, [wibYear, wibMonth, wibDay])

  // Daily progress derived purely from backend activity summary & rewards
  const todayLog = useMemo(
    () => activitySummary?.weekly_logs?.find((log) => log.is_today),
    [activitySummary]
  )
  const todayEarnedXp = todayLog?.xp_earned ?? 0
  const todayLessonsCompleted = todayLog?.lessons_count ?? 0
  const todayFlashcards = dailyRewardsStatus?.today_flashcards_reviewed ?? 0
  const vocabTarget = dailyRewardsStatus?.vocab_quest_target ?? 3
  const isVocabDone = Boolean(dailyRewardsStatus?.vocab_quest_claimed)
  const isLessonDone = todayLessonsCompleted >= 1
  const isXpDone = todayEarnedXp >= 50

  const dailyQuests = useMemo<DailyQuestViewItem[]>(
    () => [
      {
        id: 'daily-lesson-sprint',
        title: 'Tuntaskan 1 Pelajaran Bahasa di Kurikulum',
        chip_label: 'PELAJARAN HARIAN',
        difficulty: 'Pemula',
        xp_reward: 50,
        gem_reward: 0,
        estimated_minutes: 15,
        isCompleted: isLessonDone,
        route: '/curriculum',
        icon: BookOpen,
        progressText: isLessonDone ? '1/1 Selesai' : '0/1 Selesai',
        progressPercent: isLessonDone ? 100 : 0,
      },
      {
        id: 'daily-vocab-quest',
        title: `Ulas ${vocabTarget} Kartu Flashcard & Klaim Bonus`,
        chip_label: 'KOSAKATA HARIAN',
        difficulty: 'Mudah',
        xp_reward: 30,
        gem_reward: 0,
        estimated_minutes: 5,
        isCompleted: isVocabDone,
        route: '/flashcards',
        icon: Translate,
        progressText: isVocabDone
          ? `${vocabTarget}/${vocabTarget} Selesai`
          : `${Math.min(vocabTarget, todayFlashcards)}/${vocabTarget} Kartu`,
        progressPercent: isVocabDone
          ? 100
          : Math.min(100, Math.round((todayFlashcards / vocabTarget) * 100)),
      },
      {
        id: 'daily-xp-sprint',
        title: 'Kumpulkan 50 XP dari Latihan Bahasa',
        chip_label: 'TARGET XP HARIAN',
        difficulty: 'Mudah',
        xp_reward: 40,
        gem_reward: 0,
        estimated_minutes: 5,
        isCompleted: isXpDone,
        route: '/flashcards',
        icon: Lightning,
        progressText: isXpDone ? '50/50 XP' : `${Math.min(50, todayEarnedXp)}/50 XP`,
        progressPercent: isXpDone ? 100 : Math.min(100, Math.round((todayEarnedXp / 50) * 100)),
      },
    ],
    [isLessonDone, isVocabDone, isXpDone, todayEarnedXp, todayFlashcards, vocabTarget]
  )

  const filteredDaily = useMemo(() => {
    if (!searchQuery.trim()) return dailyQuests
    const q = searchQuery.toLowerCase()
    return dailyQuests.filter(
      (item) => item.title.toLowerCase().includes(q) || item.chip_label.toLowerCase().includes(q)
    )
  }, [dailyQuests, searchQuery])

  const earnedBadgeKeys = useMemo(() => {
    const list = badgesQuery.data?.user_badges ?? gamificationStatus?.badges ?? []
    return new Set(list.map((b) => b.badge_key))
  }, [badgesQuery.data?.user_badges, gamificationStatus?.badges])

  const milestoneChallenges = useMemo<MilestoneChallengeViewItem[]>(() => {
    const items: MilestoneChallengeViewItem[] = MILESTONE_CHALLENGES.map((challenge) => ({
      ...challenge,
      isCompleted: earnedBadgeKeys.has(challenge.id),
    }))
    if (!searchQuery.trim()) return items
    const q = searchQuery.toLowerCase()
    return items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [earnedBadgeKeys, searchQuery])

  const dailyDoneCount = dailyQuests.filter((d) => d.isCompleted).length
  const totalDailyTarget = dailyQuests.length

  const totalWeeklyLessons = useMemo(
    () =>
      (activitySummary?.weekly_logs ?? []).reduce(
        (acc, log) => acc + (log.lessons_count || 0),
        0
      ),
    [activitySummary?.weekly_logs]
  )
  const monthlyTargetCount = 25
  const monthlyCompletedCount = Math.min(
    monthlyTargetCount,
    Math.max(dailyDoneCount, totalWeeklyLessons + dailyDoneCount)
  )
  const monthlyProgressPercent = Math.min(
    100,
    Math.round((monthlyCompletedCount / monthlyTargetCount) * 100)
  )
  const isMonthlyBadgeClaimed = Boolean(gamificationStatus?.monthly_badge_claimed)

  const userFirstName = user?.name ? user.name.split(' ')[0] : 'Sobat'
  const kodiCompanion = useMemo(() => {
    if (dailyDoneCount === 0) {
      return {
        emotion: 'welcome' as KodiEmotion,
        badge: 'Semangat Pagi! ⚡',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        speech: `Halo ${userFirstName}! Selesaikan 3 misi hari ini untuk menjaga streak dan membuka Peti Emas!`,
      }
    }
    if (dailyDoneCount < totalDailyTarget) {
      return {
        emotion: 'coding' as KodiEmotion,
        badge: 'Sedang Berjalan 🚀',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        speech: `Keren banget! Tinggal ${totalDailyTarget - dailyDoneCount} misi lagi untuk membuka Peti Emas Harian!`,
      }
    }
    return {
      emotion: 'celebrate' as KodiEmotion,
      badge: 'Semua Misi Tuntas! 🎉',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      speech: `Luar biasa, ${userFirstName}! Semua misi harian tuntas dan streak Anda aman!`,
    }
  }, [dailyDoneCount, totalDailyTarget, userFirstName])

  const invalidateGamificationCaches = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [...GAMIFICATION_STATUS_QUERY_KEY, userId] }),
      queryClient.invalidateQueries({ queryKey: getProfileQueryKey(userId) }),
      queryClient.invalidateQueries({ queryKey: getActivityLogsQueryKey(userId) }),
      queryClient.invalidateQueries({ queryKey: getDailyRewardsQueryKey(userId) }),
    ])
  }, [queryClient, userId])

  // Mutations
  const claimChestMutation = useMutation({
    mutationFn: (tier: number) => gamificationService.claimDailyChest(tier),
  })

  const buyItemMutation = useMutation({
    mutationFn: (itemId: string) => gamificationService.buyShopItem(itemId),
  })

  const handleSelectTrack = useCallback(
    async (languageId: string) => {
      if (!languageId) return
      try {
        await languageService.switchActiveLanguage(languageId)
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: getLanguageEnrollmentsQueryKey(userId) }),
          queryClient.invalidateQueries({ queryKey: CURRICULUM_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: DAILY_VOCABULARIES_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: SRS_DUE_QUERY_KEY }),
        ])
        triggerHaptic('success')
        setActiveTrack(languageId)
        setIsCourseSwitcherOpen(false)
      } catch (err: unknown) {
        triggerHaptic('error')
        audioEngine.playError()
        showToast(extractApiErrorMessage(err, 'Gagal mengganti bahasa aktif. Silakan coba lagi.'))
      }
    },
    [queryClient, showToast, userId]
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

  const hasNoResults =
    searchQuery.trim().length > 0 &&
    ((activeTab === 'daily' && filteredDaily.length === 0) ||
      (activeTab === 'boss' && milestoneChallenges.length === 0))

  const totalCount = dailyQuests.length + MILESTONE_CHALLENGES.length
  const completedCount =
    dailyDoneCount + milestoneChallenges.filter((challenge) => challenge.isCompleted).length
  const progressPercent =
    totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    activeTrack,
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
    toastMessage,
    setToastMessage,
    floatingReward,
    userGems,
    inventory,
    claimedDailyChests,
    shopItems,
    dailyQuests,
    filteredDaily,
    milestoneChallenges,
    dailyDoneCount,
    totalDailyTarget,
    currentMonthYearName,
    daysLeftInMonth,
    monthlyCompletedCount,
    monthlyTargetCount,
    monthlyProgressPercent,
    isMonthlyBadgeClaimed,
    kodiCompanion,
    hasNoResults,
    completedCount,
    totalCount,
    progressPercent,
    isLoading: statusQuery.isLoading,
    handleSelectTrack,
    handleOpenChest,
    handleConfirmClaimChest,
    handlePurchaseShopItem,
    handleCVSubmitted,
    handleMockScheduled,
  }
}
