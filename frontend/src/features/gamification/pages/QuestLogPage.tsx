import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { AppLeftSidebar } from "@/shared/components/layout/left-sidebar/AppLeftSidebar"
import { useAuthStore } from "@/features/auth/store/authStore"
import { useUserActivity } from "@/features/user/hooks/useUserActivity"
import {
  languageService,
  LANGUAGE_ENROLLMENTS_QUERY_KEY,
} from "@/features/curriculum/services/languageService"
import { gamificationService } from "@/features/gamification/services/gamificationService"
import { useQuests } from "@/features/gamification/hooks/useQuests"
import { getWibDateKey } from "@/shared/utils/date"
import { Button3D } from "@/shared/components/ui/Button3D"
import { triggerHaptic } from "@/shared/utils/haptics"
import { audioEngine } from "@/shared/utils/audio"
import { AppTopBar } from "@/shared/components/layout/top-bar/AppTopBar"
import { TrackSwitcherModal } from "@/shared/components/layout/top-bar/TrackSwitcherModal"
import { LeaderboardModal } from "@/features/leaderboard/components/LeaderboardModal"
import { ChestRewardModal } from "@/features/gamification/components/ChestRewardModal"
import { MonthlyBadgeModal } from "@/features/gamification/components/MonthlyBadgeModal"
import { CVReviewSubmissionModal } from "@/features/gamification/components/CVReviewSubmissionModal"
import { MockInterviewScheduleModal } from "@/features/gamification/components/MockInterviewScheduleModal"
import { DailyQuestsSection } from "@/features/gamification/components/DailyQuestsSection"
import { MilestoneChallengesSection } from "@/features/gamification/components/MilestoneChallengesSection"
import { AkihabaraShopSection } from "@/features/gamification/components/AkihabaraShopSection"
import {
  SHOP_ITEMS,
  MILESTONE_CHALLENGES,
  type QuestPageTab,
  type ShopItem,
  type DailyChestItem,
  type DailyQuestViewItem,
  type MilestoneChallengeViewItem,
} from "@/features/gamification/constants/gamificationCatalog"
import {
  MagnifyingGlass,
  Sparkle,
  Flask,
  Lightning,
  Clock,
  X,
  Medal,
  CheckCircle,
  BookOpen,
  Translate,
  ArrowRight,
} from '@phosphor-icons/react'
import { KodiCharacter, type KodiEmotion } from "@/shared/components/ui/KodiCharacter"

export type { QuestPageTab }

export const QuestLogPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()
  const {
    data: { activitySummary },
  } = useUserActivity()
  const {
    dailyQuests,
    timeLeft,
    completedCount: hookCompletedCount,
    totalCount: hookTotalCount,
    isLoading: hookLoading,
  } = useQuests()

  // Track selection state (empty string defaults to user's active enrolled language)
  const [activeTrack, setActiveTrack] = useState('')
  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)

  // Active filter tab (Dedicated views: daily, boss, shop)
  const [activeTab, setActiveTab] = useState<QuestPageTab>('daily')
  const [searchQuery, setSearchQuery] = useState('')

  // 3-Tier Milestone Chests state for today (WIB UTC+7)
  const todayDateKey = useMemo(() => getWibDateKey(), [])
  const [claimedDailyChests, setClaimedDailyChests] = useState<Record<number, boolean>>(() => {
    try {
      const todayKey = getWibDateKey()
      const stored = localStorage.getItem(`codeabroad_claimed_daily_chests_${todayKey}`)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  // Selected chest for reward unboxing modal
  const [selectedChestForModal, setSelectedChestForModal] = useState<DailyChestItem | null>(null)
  const [isChestModalOpen, setIsChestModalOpen] = useState(false)

  // Monthly challenge dynamic WIB date & claim state
  const [wibYear, wibMonth, wibDay] = useMemo(
    () => todayDateKey.split('-').map(Number),
    [todayDateKey]
  )
  const currentMonthYearName = useMemo(() => {
    return new Date(Date.UTC(wibYear, wibMonth - 1, 15)).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    })
  }, [wibYear, wibMonth])
  const monthlyBadgeKey = useMemo(
    () => `codeabroad_monthly_badge_${wibYear}_${wibMonth}`,
    [wibYear, wibMonth]
  )
  const [isMonthlyBadgeClaimed, setIsMonthlyBadgeClaimed] = useState<boolean>(() => {
    try {
      const [y, m] = getWibDateKey().split('-').map(Number)
      return localStorage.getItem(`codeabroad_monthly_badge_${y}_${m}`) === 'true'
    } catch {
      return false
    }
  })
  const [isMonthlyBadgeModalOpen, setIsMonthlyBadgeModalOpen] = useState(false)

  // Active XP Booster state (with pure interval clock for render checks)
  const [xpBoosterExpiresAt, setXpBoosterExpiresAt] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('codeabroad_xp_booster_expires_at')
      return stored ? parseInt(stored, 10) : 0
    } catch {
      return 0
    }
  })
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    if (xpBoosterExpiresAt <= nowMs) return
    const timer = setInterval(() => {
      setNowMs(Date.now())
    }, 15000)
    return () => clearInterval(timer)
  }, [xpBoosterExpiresAt, nowMs])

  const isBoosterActive = xpBoosterExpiresAt > nowMs

  // Akihabara coupon modal states
  const [isCVModalOpen, setIsCVModalOpen] = useState(false)
  const [isMockModalOpen, setIsMockModalOpen] = useState(false)

  // Floating reward animation state
  const [floatingReward, setFloatingReward] = useState<string | null>(null)

  // Gems state synced with user store & localStorage (Clean SSOT, default 0, no dummy 45)
  const [userGems, setUserGems] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('codeabroad_user_gems')
      if (stored !== null) return parseInt(stored, 10)
    } catch {
      // ignore
    }
    return typeof user?.gems === 'number' ? user.gems : 0
  })

  // Sync userGems when user.gems in authStore updates
  const [prevUserGems, setPrevUserGems] = useState<number | null | undefined>(user?.gems)
  if (typeof user?.gems === 'number' && user.gems !== prevUserGems) {
    setPrevUserGems(user.gems)
    setUserGems(user.gems)
  }

  // User inventory state for Akihabara Arcade items (clean SSOT: all start at 0)
  const [inventory, setInventory] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('codeabroad_user_inventory')
      return stored
        ? JSON.parse(stored)
        : { 'streak-freeze': 0, 'xp-booster': 0, 'cv-review': 0, 'mock-interview': 0 }
    } catch {
      return { 'streak-freeze': 0, 'xp-booster': 0, 'cv-review': 0, 'mock-interview': 0 }
    }
  })

  // Toast confirmation notification for shop purchase / quest claim
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isClaimingChest, setIsClaimingChest] = useState(false)
  const [isPurchasingItemId, setIsPurchasingItemId] = useState<string | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const floatingRewardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      if (floatingRewardTimerRef.current) clearTimeout(floatingRewardTimerRef.current)
    }
  }, [])

  const showToast = (message: string) => {
    setToastMessage(message)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const triggerFloatingReward = (text: string) => {
    setFloatingReward(text)
    if (floatingRewardTimerRef.current) clearTimeout(floatingRewardTimerRef.current)
    floatingRewardTimerRef.current = setTimeout(() => {
      setFloatingReward(null)
    }, 2500)
  }

  // Claimed daily quests set (reset daily by todayDateKey in WIB)
  const [claimedDailyMap, setClaimedDailyMap] = useState<Record<string, boolean>>(() => {
    try {
      const todayKey = getWibDateKey()
      const stored = localStorage.getItem(`codeabroad_claimed_daily_quests_${todayKey}`)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  // Completed quests persistence set (clean SSOT)
  const [completedQuestsSet, setCompletedQuestsSet] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('codeabroad_completed_quests')
      return stored ? new Set(JSON.parse(stored)) : new Set<string>()
    } catch {
      return new Set<string>()
    }
  })

  const [shopItems, setShopItems] = useState<ShopItem[]>(SHOP_ITEMS)

  // Fetch real SSOT gamification status and shop catalog from backend API
  useEffect(() => {
    let isMounted = true

    gamificationService
      .getStatus()
      .then((status) => {
        if (!isMounted) return
        setUserGems(status.gems)
        updateUser({ gems: status.gems })
        setInventory(status.inventory)
        if (status.claimed_chests && status.claimed_chests.length > 0) {
          const claimMap: Record<number, boolean> = {}
          status.claimed_chests.forEach((t) => {
            claimMap[t] = true
          })
          setClaimedDailyChests((prev) => ({ ...prev, ...claimMap }))
        }
        if (status.monthly_badge_claimed) {
          setIsMonthlyBadgeClaimed(true)
        }
      })
      .catch(() => {
        // Gracefully continue with local state
      })

    gamificationService
      .listShopItems()
      .then((remoteItems) => {
        if (!isMounted || remoteItems.length === 0) return
        const fallbackById = new Map(SHOP_ITEMS.map((item) => [item.id, item]))
        const merged: ShopItem[] = remoteItems.map((remote) => {
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
        setShopItems(merged)
      })
      .catch(() => {
        // Keep default SHOP_ITEMS fallback
      })

    return () => {
      isMounted = false
    }
  }, [updateUser])

  // Sync completed quests on custom event
  useEffect(() => {
    const handleQuestCompleted = () => {
      try {
        const stored = localStorage.getItem('codeabroad_completed_quests')
        if (stored) {
          setCompletedQuestsSet(new Set(JSON.parse(stored)))
        }
      } catch (e) {
        console.error('Failed to sync completed quests in QuestLog:', e)
      }
    }
    window.addEventListener('codeabroad_quest_completed', handleQuestCompleted)
    return () => {
      window.removeEventListener('codeabroad_quest_completed', handleQuestCompleted)
    }
  }, [])

  // Multi-track progress map for TrackSwitcherModal
  const trackProgressMap = useMemo<Record<string, { completed: number; total: number }>>(
    () => ({}),
    []
  )

  // Handle track switch from TrackSwitcherModal (persists to backend & refreshes enrollments)
  const handleSelectTrack = async (languageId: string) => {
    if (!languageId) return
    try {
      await languageService.switchActiveLanguage(languageId)
      await queryClient.invalidateQueries({ queryKey: LANGUAGE_ENROLLMENTS_QUERY_KEY })
      triggerHaptic('success')
      setActiveTrack(languageId)
      setIsCourseSwitcherOpen(false)
    } catch {
      triggerHaptic('error')
      audioEngine.playError()
      showToast('❌ Gagal mengganti bahasa belajar aktif. Silakan coba lagi.')
    }
  }

  // Update gems and persist
  const updateGemsState = (newTotal: number) => {
    setUserGems(newTotal)
    try {
      localStorage.setItem('codeabroad_user_gems', String(newTotal))
      updateUser({ gems: newTotal })
    } catch {
      // ignore
    }
  }

  // Handle claim daily quest reward with burst animation & XP multiplier
  const handleClaimDailyQuest = (questId: string, xpReward: number, gemReward: number) => {
    triggerHaptic('success')
    audioEngine.playRewardClaim()

    const boosterActive = xpBoosterExpiresAt > Date.now()
    const finalXp = boosterActive ? xpReward * 2 : xpReward

    const nextMap = { ...claimedDailyMap, [questId]: true }
    setClaimedDailyMap(nextMap)
    try {
      localStorage.setItem(`codeabroad_claimed_daily_quests_${todayDateKey}`, JSON.stringify(nextMap))
    } catch {
      // ignore
    }

    const nextGems = userGems + gemReward
    updateGemsState(nextGems)

    // Trigger floating reward burst
    triggerFloatingReward(`+${finalXp} XP ${boosterActive ? '(2x XP 🔥) ' : ''}• +${gemReward} 💎`)

    // Dispatch XP reward event
    window.dispatchEvent(new CustomEvent('codeabroad_xp_gained', { detail: { amount: finalXp } }))
    showToast(
      `🎉 Berhasil klaim +${finalXp} XP ${boosterActive ? '(2x XP Booster Aktif!) ' : ''}& 💎 ${gemReward} Gems!`
    )
  }

  // Use XP Booster Potion (30 minutes of 2x XP)
  const handleUseXPBooster = () => {
    const owned = inventory['xp-booster'] || 0
    if (owned <= 0) return
    triggerHaptic('success')
    audioEngine.playStreakFlame()

    const newInventory = {
      ...inventory,
      ['xp-booster']: Math.max(0, owned - 1),
    }
    setInventory(newInventory)
    try {
      localStorage.setItem('codeabroad_user_inventory', JSON.stringify(newInventory))
      window.dispatchEvent(new CustomEvent('codeabroad_inventory_updated'))
    } catch {
      // ignore
    }

    const now = Date.now()
    const expiresAt = now + 30 * 60 * 1000
    setNowMs(now)
    setXpBoosterExpiresAt(expiresAt)
    try {
      localStorage.setItem('codeabroad_xp_booster_expires_at', String(expiresAt))
      window.dispatchEvent(new CustomEvent('codeabroad_booster_activated'))
    } catch {
      // ignore
    }

    showToast('🧪 XP Booster Potion Aktif! Anda mendapatkan 2x XP selama 30 menit ke depan.')
  }

  // Handle CV Review Submission
  const handleCVSubmitted = async (data: { githubUrl: string; resumeUrl: string; targetRole: string; notes: string }) => {
    try {
      const res = await gamificationService.submitCoaching({
        type: 'cv-review',
        github_url: data.githubUrl,
        resume_url: data.resumeUrl,
        target_role: data.targetRole,
        notes: data.notes,
      })
      setInventory(res.status.inventory)
      localStorage.setItem('codeabroad_user_inventory', JSON.stringify(res.status.inventory))
      window.dispatchEvent(new CustomEvent('codeabroad_inventory_updated'))
      showToast('📋 Kupon CV Review berhasil digunakan. Mentor Tokyo sedang memeriksa berkas Anda!')
    } catch {
      triggerHaptic('error')
      audioEngine.playError()
      showToast('❌ Gagal mengirim pengajuan CV Review. Pastikan Anda memiliki kupon aktif dan koneksi stabil.')
    }
  }

  // Handle Mock Interview Schedule
  const handleMockScheduled = async (data: { language: string; discordHandle: string; focusTopic: string; preferredTime: string }) => {
    try {
      const res = await gamificationService.submitCoaching({
        type: 'mock-interview',
        discord_handle: data.discordHandle,
        interview_language: data.language,
        focus_topic: data.focusTopic,
        preferred_time: data.preferredTime,
      })
      setInventory(res.status.inventory)
      localStorage.setItem('codeabroad_user_inventory', JSON.stringify(res.status.inventory))
      window.dispatchEvent(new CustomEvent('codeabroad_inventory_updated'))
      showToast('🎙️ Pengajuan Mock Interview VIP berhasil dikirim! Silakan periksa Discord Anda.')
    } catch {
      triggerHaptic('error')
      audioEngine.playError()
      showToast('❌ Gagal menjadwalkan Mock Interview. Pastikan Anda memiliki kupon aktif dan koneksi stabil.')
    }
  }

  // Open chest modal or show guidance toast
  const handleOpenChest = (chest: DailyChestItem) => {
    if (!chest.unlocked) {
      triggerHaptic('error')
      audioEngine.playError()
      showToast(`⚠️ Selesaikan ${chest.tier - dailyDoneCount} misi harian lagi untuk membuka ${chest.label}!`)
      return
    }
    triggerHaptic('tap')
    audioEngine.playPop()
    setSelectedChestForModal(chest)
    setIsChestModalOpen(true)
  }

  // Confirm claim chest reward from unboxing modal
  const handleConfirmClaimChest = async () => {
    if (!selectedChestForModal || isClaimingChest) return
    const tier = selectedChestForModal.tier
    const chestLabel = selectedChestForModal.label
    const gemReward = selectedChestForModal.gemReward
    const xpReward = selectedChestForModal.xpReward

    setIsClaimingChest(true)
    try {
      const res = await gamificationService.claimDailyChest(tier)
      triggerHaptic('success')
      audioEngine.playChestClaim()

      const nextChests = { ...claimedDailyChests, [tier]: true }
      setClaimedDailyChests(nextChests)
      try {
        localStorage.setItem(`codeabroad_claimed_daily_chests_${todayDateKey}`, JSON.stringify(nextChests))
      } catch {
        // ignore
      }

      updateGemsState(res.status.gems)

      if (xpReward > 0) {
        window.dispatchEvent(
          new CustomEvent('codeabroad_xp_gained', { detail: { amount: xpReward } })
        )
      }

      triggerFloatingReward(
        `+${xpReward > 0 ? `${xpReward} XP • ` : ''}+${gemReward} 💎`
      )
      showToast(`🎉 ${chestLabel} berhasil dibuka! +${gemReward} Gems ditambahkan.`)
      setIsChestModalOpen(false)
    } catch {
      triggerHaptic('error')
      audioEngine.playError()
      showToast('❌ Gagal membuka peti hadiah. Pastikan peti belum diklaim dan koneksi stabil.')
    } finally {
      setIsClaimingChest(false)
    }
  }

  // Claim Monthly Roppongi Gold Badge
  const handleClaimMonthlyBadge = async () => {
    triggerHaptic('success')
    audioEngine.playFanfare()
    setIsMonthlyBadgeClaimed(true)
    try {
      localStorage.setItem(monthlyBadgeKey, 'true')
    } catch {
      // ignore
    }

    try {
      const nextGems = userGems + 50
      updateGemsState(nextGems)
    } catch {
      // ignore
    }

    window.dispatchEvent(new CustomEvent('codeabroad_xp_gained', { detail: { amount: 150 } }))

    triggerFloatingReward('+150 XP • +50 💎')
    showToast(`🎉 Lencana Emas Roppongi (${currentMonthYearName}) berhasil disematkan ke portofolio Anda!`)
    setIsMonthlyBadgeModalOpen(false)
  }

  // Handle Akihabara Arcade item purchase
  const handlePurchaseShopItem = async (item: ShopItem) => {
    if (isPurchasingItemId) return
    if (userGems < item.price) {
      triggerHaptic('error')
      audioEngine.playError()
      showToast(`⚠️ Saldo Gems tidak cukup! Butuh ${item.price} Gems (Saldo: ${userGems}).`)
      return
    }

    setIsPurchasingItemId(item.id)
    try {
      const updatedStatus = await gamificationService.buyShopItem(item.id)
      triggerHaptic('success')
      audioEngine.playCoinJingle()
      updateGemsState(updatedStatus.gems)
      setInventory(updatedStatus.inventory)
      try {
        localStorage.setItem('codeabroad_user_inventory', JSON.stringify(updatedStatus.inventory))
        window.dispatchEvent(new CustomEvent('codeabroad_inventory_updated'))
      } catch {
        // ignore
      }
      showToast(`🛒 Berhasil menukar ${item.title}! Sisa Saldo: 💎 ${updatedStatus.gems} Gems.`)
    } catch {
      triggerHaptic('error')
      audioEngine.playError()
      showToast(`❌ Gagal menukar ${item.title}. Silakan coba lagi beberapa saat.`)
    } finally {
      setIsPurchasingItemId(null)
    }
  }

  const todayEarnedXp = useMemo(() => {
    const todayLog = activitySummary?.weekly_logs?.find((log) => log.is_today)
    return todayLog?.xp_earned ?? 0
  }, [activitySummary])

  // 3 Daily Quests (The Core Habit Loop, cleanly checked against SSOT)
  const canonicalDailyList = useMemo<DailyQuestViewItem[]>(() => {
    if (dailyQuests && dailyQuests.length > 0) {
      return dailyQuests.map((q, idx) => {
        const isDone =
          q.user_status === 'completed' ||
          completedQuestsSet.has(q.id) ||
          !!claimedDailyMap[q.id]

        const defaultIcons = [BookOpen, Translate, Lightning]
        const QuestIcon = defaultIcons[idx % defaultIcons.length]

        return {
          id: q.id,
          title: q.title,
          chip_label: q.chip_label || 'HARIAN',
          difficulty: q.difficulty || 'Pemula',
          xp_reward: q.xp_reward || 40,
          gem_reward: 10,
          estimated_minutes: q.estimated_minutes || 10,
          isCompleted: isDone,
          route: `/learn/${q.id}`,
          icon: QuestIcon,
          progressText: isDone ? '1/1 Selesai' : '0/1 Selesai',
          progressPercent: isDone ? 100 : 0,
        }
      })
    }

    const isLessonDone =
      completedQuestsSet.has('daily-lesson-sprint') || !!claimedDailyMap['daily-lesson-sprint']
    const isVocabDone =
      completedQuestsSet.has('daily-nihongo-vocab') || !!claimedDailyMap['daily-nihongo-vocab']
    const isXpDone =
      completedQuestsSet.has('daily-xp-sprint') ||
      !!claimedDailyMap['daily-xp-sprint'] ||
      todayEarnedXp >= 50

    return [
      {
        id: 'daily-lesson-sprint',
        title: 'Tuntaskan 1 Pelajaran Bahasa di Kurikulum',
        chip_label: 'PELAJARAN HARIAN',
        difficulty: 'Pemula',
        xp_reward: 50,
        gem_reward: 10,
        estimated_minutes: 15,
        isCompleted: isLessonDone,
        route: '/curriculum',
        icon: BookOpen,
        progressText: isLessonDone ? '1/1 Selesai' : '0/1 Selesai',
        progressPercent: isLessonDone ? 100 : 0,
      },
      {
        id: 'daily-nihongo-vocab',
        title: 'Review 5 Kosakata & Kanji Tokyo Hari Ini',
        chip_label: 'JLPT NIHONGO',
        difficulty: 'Mudah',
        xp_reward: 30,
        gem_reward: 5,
        estimated_minutes: 5,
        isCompleted: isVocabDone,
        route: '/curriculum',
        icon: Translate,
        progressText: isVocabDone ? '5/5 Selesai' : '0/5 Selesai',
        progressPercent: isVocabDone ? 100 : 0,
      },
      {
        id: 'daily-xp-sprint',
        title: 'Kumpulkan 50 XP dari Latihan Bahasa',
        chip_label: 'TARGET XP HARIAN',
        difficulty: 'Mudah',
        xp_reward: 40,
        gem_reward: 10,
        estimated_minutes: 5,
        isCompleted: isXpDone,
        route: '/curriculum',
        icon: Lightning,
        progressText: isXpDone ? '50/50 XP' : `${Math.min(50, todayEarnedXp)}/50 XP`,
        progressPercent: isXpDone
          ? 100
          : Math.min(100, Math.round((todayEarnedXp / 50) * 100)),
      },
    ]
  }, [dailyQuests, completedQuestsSet, claimedDailyMap, todayEarnedXp])

  // Filter daily quests based on search query
  const filteredDaily = useMemo(() => {
    if (!searchQuery.trim()) return canonicalDailyList
    const q = searchQuery.toLowerCase()
    return canonicalDailyList.filter(
      (item) => item.title.toLowerCase().includes(q) || item.chip_label.toLowerCase().includes(q)
    )
  }, [canonicalDailyList, searchQuery])

  // Language Mastery Milestone Challenges
  const portfolioChallenges = useMemo<MilestoneChallengeViewItem[]>(() => {
    const challenges: MilestoneChallengeViewItem[] = MILESTONE_CHALLENGES.map((challenge) => ({
      ...challenge,
      isCompleted: completedQuestsSet.has(challenge.id),
    }))

    if (!searchQuery.trim()) return challenges
    const q = searchQuery.toLowerCase()
    return challenges.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [completedQuestsSet, searchQuery])

  // Monthly Quest Progress Calculation (Monthly Badge Challenge)
  const totalCompletedCount = completedQuestsSet.size
  const monthlyTargetCount = 25
  const monthlyCompletedCount = Math.min(monthlyTargetCount, totalCompletedCount)
  const monthlyProgressPercent = Math.min(100, Math.round((monthlyCompletedCount / monthlyTargetCount) * 100))

  // Days left in current WIB month calculation
  const daysLeftInMonth = useMemo(() => {
    const lastDay = new Date(wibYear, wibMonth, 0).getDate()
    return Math.max(1, lastDay - wibDay)
  }, [wibYear, wibMonth, wibDay])

  // Daily quest completion count
  const dailyDoneCount = canonicalDailyList.filter((d) => d.isCompleted).length
  const totalDailyTarget = canonicalDailyList.length

  const userFirstName = user?.name ? user.name.split(' ')[0] : 'Sobat'

  // Dynamic living companion Kodi state & speech bubble
  const kodiCompanion = useMemo(() => {
    if (dailyDoneCount === 0) {
      return {
        emotion: 'welcome' as KodiEmotion,
        badge: 'Semangat Pagi! ⚡',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        speech: `Halo ${userFirstName}! Selesaikan 3 misi hari ini untuk menyalakan api streak 🔥`,
        alt: 'Kodi Menyapa',
      }
    }
    if (dailyDoneCount < totalDailyTarget) {
      return {
        emotion: 'coding' as KodiEmotion,
        badge: 'Sedang Berjalan 🚀',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        speech: `Keren banget! Tinggal ${totalDailyTarget - dailyDoneCount} misi lagi untuk membuka Peti Emas Akihabara 🎁`,
        alt: 'Kodi Belajar',
      }
    }
    return {
      emotion: 'celebrate' as KodiEmotion,
      badge: 'Semua Misi Tuntas! 🎉',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      speech: `Luar biasa, ${userFirstName}! Semua misi harian tuntas dan streak Anda aman. Sampai jumpa besok di Tokyo Guild! 🌸`,
      alt: 'Kodi Merayakan',
    }
  }, [dailyDoneCount, totalDailyTarget, userFirstName])

  // Counts for top bar (Pure SSOT, 0 fake fallbacks)
  const totalCount =
    hookTotalCount > 0
      ? hookTotalCount
      : canonicalDailyList.length + MILESTONE_CHALLENGES.length
  const completedCount =
    typeof hookCompletedCount === 'number' && hookCompletedCount > 0
      ? hookCompletedCount
      : totalCompletedCount
  const progressPercent = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0

  // Determine if search has no results for the active tab
  const hasNoResults =
    searchQuery.trim().length > 0 &&
    ((activeTab === 'daily' && filteredDaily.length === 0) ||
      (activeTab === 'boss' && portfolioChallenges.length === 0))

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. LEFT NAV RAIL (SSOT) ── */}
      <AppLeftSidebar />

      {/* ── 2. SINGLE-COLUMN SPACIOUS CENTER STAGE (AIRY, ZERO SIDEBAR CLAUSTROPHOBIA) ── */}
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-12">
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 space-y-7">
          {/* ── TOP HUD BAR (SSOT) ── */}
          <AppTopBar
            activeTrack={activeTrack}
            onOpenCourseSwitcher={() => setIsCourseSwitcherOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            completedCount={completedCount}
            totalCount={totalCount}
            progressPercent={progressPercent}
            unitLabel="Misi"
          />

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Floating Reward Particle Toast */}
          {floatingReward && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
              <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-sm px-4 py-2 rounded-full shadow-lg border-2 border-white ring-4 ring-amber-300/50 flex items-center gap-2">
                <Sparkle weight="fill" className="w-4 h-4 text-amber-900" />
                <span>{floatingReward}</span>
              </div>
            </div>
          )}

          {/* ── 1. LIVING HERO BANNER: KODI MASCOT & MONTHLY CHALLENGE ── */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-50/40 to-blue-500/10 border-2 border-amber-300 border-b-[5px] border-b-amber-400 rounded-3xl p-6 sm:p-7 shadow-2xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Column: Monthly Challenge Details */}
              <div className="space-y-3.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`font-brand font-black text-[11px] px-3 py-1 rounded-full border uppercase tracking-wider ${kodiCompanion.badgeBg}`}>
                    {kodiCompanion.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock weight="bold" className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sisa {daysLeftInMonth} Hari di Bulan Ini</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                    Lencana Emas Roppongi ({currentMonthYearName})
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    Selesaikan 25 misi dan tantangan bahasa bulan ini untuk membuka lencana emas permanen di profil Anda.
                  </p>
                </div>

                {/* Monthly Challenge Progress Track */}
                <div className="space-y-2 pt-1 max-w-lg">
                  <div className="flex items-center justify-between text-xs font-brand font-black">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <Medal weight="fill" className="w-4 h-4 text-amber-500" />
                      <span>{monthlyCompletedCount} / {monthlyTargetCount} Misi Selesai</span>
                    </span>
                    <span className="text-amber-700 font-bold">
                      {monthlyCompletedCount >= monthlyTargetCount
                        ? '🎉 Lencana Terbuka!'
                        : `${monthlyTargetCount - monthlyCompletedCount} misi lagi`}
                    </span>
                  </div>
                  <div className="h-3.5 bg-white/90 rounded-full border border-amber-300 p-0.5 shadow-inner overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#D97706]"
                      style={{ width: `${monthlyProgressPercent}%` }}
                    />
                  </div>

                  {/* Monthly Challenge Action Button */}
                  <div className="pt-2">
                    <Button3D
                      variant={monthlyCompletedCount >= monthlyTargetCount ? 'amber' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        triggerHaptic('tap')
                        setIsMonthlyBadgeModalOpen(true)
                      }}
                      className={`text-xs px-4 py-2 ${
                        isMonthlyBadgeClaimed
                          ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300'
                          : monthlyCompletedCount >= monthlyTargetCount
                          ? 'ring-4 ring-amber-300 animate-pulse shadow-md'
                          : 'border-2 border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                      }`}
                    >
                      {isMonthlyBadgeClaimed ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600" />
                          <span>LENCANA EMAS AKTIF DI PROFIL</span>
                        </span>
                      ) : monthlyCompletedCount >= monthlyTargetCount ? (
                        <span className="flex items-center gap-1.5">
                          <Sparkle weight="fill" className="w-4 h-4 text-amber-950" />
                          <span>KLAIM LENCANA EMAS BULAN INI (+50 💎)</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Medal weight="bold" className="w-4 h-4 text-amber-600" />
                          <span>LIHAT DETAIL LENCANA ROPPONGI ➔</span>
                        </span>
                      )}
                    </Button3D>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Kodi Companion with Speech Bubble */}
              <div className="flex flex-col items-center sm:items-end justify-center shrink-0 self-center md:self-auto space-y-2">
                {/* Speech Bubble */}
                <div className="relative bg-white border-2 border-amber-300 rounded-2xl px-4 py-2.5 shadow-2xs text-xs font-brand font-black text-slate-800 leading-snug max-w-xs text-center sm:text-left">
                  <span>{kodiCompanion.speech}</span>
                  <div className="hidden sm:block absolute -bottom-2 right-10 w-3 h-3 bg-white border-b-2 border-r-2 border-amber-300 transform rotate-45" />
                </div>

                {/* Animated Kodi Illustration Asset */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 relative group flex items-center justify-center">
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full filter blur-xl transform group-hover:scale-110 transition-transform" />
                  <div className="relative z-10 drop-shadow-md transform group-hover:scale-105 transition-transform duration-300">
                    <KodiCharacter emotion={kodiCompanion.emotion} size={110} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. FILTER TABS & SEARCH BAR ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* 3D Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                {
                  id: 'daily' as QuestPageTab,
                  label: `Misi Harian ⚡ (${filteredDaily.length})`,
                },
                {
                  id: 'boss' as QuestPageTab,
                  label: `Sayembara Boss 🏆 (${portfolioChallenges.length})`,
                },
                {
                  id: 'shop' as QuestPageTab,
                  label: `Toko Akihabara 💎`,
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap')
                      setActiveTab(tab.id)
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border-b-[4px] ${
                      isActive
                        ? 'bg-[#2563EB] text-white border-b-blue-800 shadow-xs translate-y-0.5'
                        : 'bg-white text-slate-700 border-2 border-slate-200 border-b-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Search Pill + Quick Gems Pill */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <div className="relative w-full sm:w-56">
                <MagnifyingGlass
                  weight="bold"
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari misi, kuis..."
                  className="w-full bg-white text-xs font-semibold pl-9 pr-7 py-2 rounded-2xl border-2 border-slate-200 focus:border-[#2563EB] focus:outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    <X weight="bold" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setActiveTab('shop')
                }}
                className="bg-blue-50 hover:bg-blue-100/80 active:translate-y-0.5 border-2 border-blue-200 border-b-[3px] border-b-blue-300 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
                title="Buka Toko Gems Akihabara"
              >
                <span className="text-sm">💎</span>
                <span className="text-xs font-black text-[#1D4ED8]">{userGems}</span>
              </button>
            </div>
          </div>

          {/* ── EMPTY STATE SEARCH FEEDBACK ── */}
          {hasNoResults && (
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border-2 border-amber-200 text-2xl flex items-center justify-center mx-auto shadow-2xs">
                🔍
              </div>
              <h3 className="font-black text-base text-[#0F172A]">
                Tidak Ada Misi Ditemukan
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Kata kunci &ldquo;{searchQuery}&rdquo; tidak cocok dengan misi harian atau sayembara boss.
              </p>
              <Button3D
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="text-xs px-4 py-2"
              >
                Reset Pencarian
              </Button3D>
            </div>
          )}

          {/* ══════ SECTION 1: 3-TIER MILESTONE CHESTS & DAILY QUESTS ══════ */}
          {activeTab === 'daily' && (
            <DailyQuestsSection
              quests={filteredDaily}
              dailyDoneCount={dailyDoneCount}
              totalDailyTarget={totalDailyTarget}
              timeLeft={timeLeft}
              isLoading={hookLoading}
              hasSearchNoResults={hasNoResults}
              claimedDailyMap={claimedDailyMap}
              claimedDailyChests={claimedDailyChests}
              onOpenChest={handleOpenChest}
              onClaimDailyQuest={handleClaimDailyQuest}
              onStartQuest={(route) => navigate(route)}
              onContinueCurriculum={() => {
                triggerHaptic('tap')
                navigate('/curriculum')
              }}
            />
          )}

          {/* ══════ SECTION 2: MILESTONE CHALLENGES (LANGUAGE MASTERY SLATS) ══════ */}
          {activeTab === 'boss' && (
            <MilestoneChallengesSection
              challenges={portfolioChallenges}
              hasSearchNoResults={hasNoResults}
              onStartChallenge={(route) => navigate(route)}
              onContinueCurriculum={() => {
                triggerHaptic('tap')
                navigate('/curriculum')
              }}
            />
          )}

          {/* ══════ SECTION 3: AKIHABARA VENDING RACK (UNIFIED KIOSK SHELF) ══════ */}
          {activeTab === 'shop' && (
            <AkihabaraShopSection
              shopItems={shopItems}
              userGems={userGems}
              inventory={inventory}
              isBoosterActive={isBoosterActive}
              isPurchasingItemId={isPurchasingItemId}
              onUseXPBooster={handleUseXPBooster}
              onOpenCVModal={() => {
                triggerHaptic('tap')
                setIsCVModalOpen(true)
              }}
              onOpenMockModal={() => {
                triggerHaptic('tap')
                setIsMockModalOpen(true)
              }}
              onPurchaseItem={handlePurchaseShopItem}
            />
          )}

          {/* Quick link banner back to curriculum */}
          <div className="p-4 bg-slate-100/80 border-2 border-slate-200 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Ingin melanjutkan modul kurikulum utama?</span>
            <button
              type="button"
              onClick={() => navigate('/curriculum')}
              className="text-[#2563EB] hover:underline flex items-center gap-1 font-black cursor-pointer"
            >
              <span>Buka Silabus Kurikulum</span>
              <ArrowRight weight="bold" className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>
      </div>

      {/* ── 3. LANGUAGE TRACK SWITCHER MODAL ── */}
      <TrackSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
        trackProgressMap={trackProgressMap}
      />

      {/* ── 4. TOKYO LEADERBOARD MODAL ── */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* ── 5. CHEST REWARD UNBOXING MODAL ── */}
      {selectedChestForModal && (
        <ChestRewardModal
          isOpen={isChestModalOpen}
          onClose={() => setIsChestModalOpen(false)}
          tier={selectedChestForModal.tier}
          title={selectedChestForModal.label}
          gemReward={selectedChestForModal.gemReward}
          xpReward={selectedChestForModal.xpReward}
          icon={selectedChestForModal.icon}
          isClaimed={!!claimedDailyChests[selectedChestForModal.tier]}
          onClaim={handleConfirmClaimChest}
        />
      )}

      {/* ── 6. MONTHLY CHALLENGE BADGE MODAL ── */}
      <MonthlyBadgeModal
        isOpen={isMonthlyBadgeModalOpen}
        onClose={() => setIsMonthlyBadgeModalOpen(false)}
        monthYearName={currentMonthYearName}
        completedCount={monthlyCompletedCount}
        targetCount={monthlyTargetCount}
        isClaimed={isMonthlyBadgeClaimed}
        onClaim={handleClaimMonthlyBadge}
      />

      {/* ── 7. CV REVIEW SUBMISSION MODAL ── */}
      <CVReviewSubmissionModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        onSubmitted={handleCVSubmitted}
      />

      {/* ── 8. MOCK INTERVIEW SCHEDULE MODAL ── */}
      <MockInterviewScheduleModal
        isOpen={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
        onScheduled={handleMockScheduled}
      />
    </div>
  )
}
