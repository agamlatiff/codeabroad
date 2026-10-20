import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import { questService } from '../services/questService'
import { gamificationService } from '../services/gamificationService'
import type { Quest } from '../types/quest'
import { useQuests } from '../hooks/useQuests'
import { Button3D } from '../components/ui/Button3D'
import { triggerHaptic } from '../utils/haptics'
import { audioEngine } from '../utils/audio'
import {
  GameTopBar,
  CourseSwitcherModal,
  TokyoLeaderboardModal,
  ChestRewardModal,
  MonthlyBadgeModal,
  CVReviewSubmissionModal,
  MockInterviewScheduleModal,
} from '../components/game'
import {
  CURRICULUM_TRACKS_MAP,
} from '../data/curriculumData'
import {
  MagnifyingGlass,
  Sparkle,
  ShieldCheck,
  Flask,
  FileText,
  Microphone,
  Lightning,
  Clock,
  X,
  Medal,
  CheckCircle,
  Code,
  Translate,
  ArrowRight,
} from '@phosphor-icons/react'
import doodleWelcome from '../assets/kodi/doodle-welcome.png'
import doodleCoding from '../assets/kodi/doodle-coding.png'
import doodleCelebrate from '../assets/kodi/doodle-celebrate.png'

export type QuestPageTab = 'daily' | 'boss' | 'shop'

interface ShopItem {
  id: string
  title: string
  subtitle: string
  price: number
  badge: string
  badgeColor: string
  icon: typeof ShieldCheck
  iconBg: string
  iconColor: string
  category: 'protection' | 'booster' | 'career'
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'streak-freeze',
    title: 'Streak Freeze ❄️',
    subtitle: 'Perlindungan 1 hari penuh dari pemutusan streak saat Anda berhalangan hadir.',
    price: 20,
    badge: 'POPULER 🔥',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: ShieldCheck,
    iconBg: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    category: 'protection',
  },
  {
    id: 'xp-booster',
    title: 'XP Booster Potion 🧪',
    subtitle: 'Pengganda 2x XP untuk setiap latihan koding & kuis selama 30 menit ke depan.',
    price: 35,
    badge: 'BOOSTER ⚡',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Flask,
    iconBg: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    category: 'booster',
  },
  {
    id: 'cv-review',
    title: 'Kupon Review CV Tokyo 📋',
    subtitle: 'Audit portofolio GitHub dan resume teknis langsung oleh software engineer diaspora Tokyo.',
    price: 100,
    badge: 'SPONSOR VISA 🇯🇵',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: FileText,
    iconBg: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
    category: 'career',
  },
  {
    id: 'mock-interview',
    title: 'Akses VIP Mock Interview 🎙️',
    subtitle: 'Simulasi 1-on-1 live technical interview standar Tokyo berbahasa Jepang/Inggris via Discord.',
    price: 150,
    badge: 'EKSKLUSIF ⭐',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Microphone,
    iconBg: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    category: 'career',
  },
]

export const QuestLogPage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const {
    dailyQuests,
    timeLeft,
    completedCount: hookCompletedCount,
    totalCount: hookTotalCount,
    isLoading: hookLoading,
  } = useQuests()

  // Track selection state (SSOT with user profile)
  const [activeTrack, setActiveTrack] = useState(() => {
    return user?.primary_stack || user?.career_path?.slug || 'golang'
  })
  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)

  // Active filter tab (Dedicated views: daily, boss, shop)
  const [activeTab, setActiveTab] = useState<QuestPageTab>('daily')
  const [searchQuery, setSearchQuery] = useState('')

  // 3-Tier Milestone Chests state for today
  const todayDateKey = useMemo(() => new Date().toISOString().split('T')[0], [])
  const [claimedDailyChests, setClaimedDailyChests] = useState<Record<number, boolean>>(() => {
    try {
      const todayKey = new Date().toISOString().split('T')[0]
      const stored = localStorage.getItem(`codeabroad_claimed_daily_chests_${todayKey}`)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  // Selected chest for reward unboxing modal
  const [selectedChestForModal, setSelectedChestForModal] = useState<{
    tier: 1 | 2 | 3
    label: string
    reward: string
    gemReward: number
    xpReward: number
    icon: string
    unlocked: boolean
  } | null>(null)
  const [isChestModalOpen, setIsChestModalOpen] = useState(false)

  // Monthly challenge dynamic date & claim state
  const currentMonthYearName = useMemo(() => {
    return new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }, [])
  const monthlyBadgeKey = useMemo(() => {
    const now = new Date()
    return `codeabroad_monthly_badge_${now.getFullYear()}_${now.getMonth() + 1}`
  }, [])
  const [isMonthlyBadgeClaimed, setIsMonthlyBadgeClaimed] = useState<boolean>(() => {
    try {
      const now = new Date()
      return localStorage.getItem(`codeabroad_monthly_badge_${now.getFullYear()}_${now.getMonth() + 1}`) === 'true'
    } catch {
      return false
    }
  })
  const [isMonthlyBadgeModalOpen, setIsMonthlyBadgeModalOpen] = useState(false)

  // Active XP Booster state
  const [xpBoosterExpiresAt, setXpBoosterExpiresAt] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('codeabroad_xp_booster_expires_at')
      return stored ? parseInt(stored, 10) : 0
    } catch {
      return 0
    }
  })

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
  useEffect(() => {
    if (typeof user?.gems === 'number') {
      setUserGems(user.gems)
    }
  }, [user?.gems])

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

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Claimed daily quests set
  const [claimedDailyMap, setClaimedDailyMap] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('codeabroad_claimed_daily_quests')
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

  // Real backend Boss Quests (Sayembara Boss from DB)
  const [backendBossQuests, setBackendBossQuests] = useState<Quest[]>([])

  // Fetch real SSOT gamification status and Boss quests from backend API
  useEffect(() => {
    let isMounted = true

    // 1. Fetch gamification status (gems, inventory, chest claims, badges)
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

    // 2. Fetch real Boss Quests from PostgreSQL
    questService
      .listQuests({ type: 'boss' })
      .then((quests) => {
        if (!isMounted || !quests || quests.length === 0) return
        setBackendBossQuests(quests)
      })
      .catch(() => {
        // Fallback to curriculum challenges
      })

    return () => {
      isMounted = false
    }
  }, [updateUser])

  // Fetch real user completed quests from backend API
  useEffect(() => {
    let isMounted = true
    questService
      .listQuests()
      .then((quests) => {
        if (!isMounted || !quests || quests.length === 0) return
        setCompletedQuestsSet((prev) => {
          const next = new Set(prev)
          quests.forEach((q) => {
            if (q.user_status === 'completed') {
              next.add(q.id)
            }
          })
          return next
        })
      })
      .catch(() => {
        // Gracefully continue with local storage
      })
    return () => {
      isMounted = false
    }
  }, [])

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

  // Multi-track progress map for CourseSwitcherModal
  const trackProgressMap = useMemo(() => {
    const progressMap: Record<string, { completed: number; total: number }> = {}
    Object.entries(CURRICULUM_TRACKS_MAP).forEach(([trackSlug, trackUnits]) => {
      const parts = trackUnits.flatMap((u) => u.parts)
      const completed = parts.filter((p) => completedQuestsSet.has(p.id)).length
      progressMap[trackSlug] = {
        completed,
        total: parts.length > 0 ? parts.length : 12,
      }
    })
    return progressMap
  }, [completedQuestsSet])

  // Handle track switch from CourseSwitcherModal
  const handleSelectTrack = async (trackSlug: string) => {
    triggerHaptic('success')
    setActiveTrack(trackSlug)
    setIsCourseSwitcherOpen(false)
    updateUser({ primary_stack: trackSlug })
    try {
      await authService.updateProfile({ primary_stack: trackSlug })
    } catch {
      // Gracefully continue with local state
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
    audioEngine.playPop()

    const isBoosterActive = xpBoosterExpiresAt > Date.now()
    const finalXp = isBoosterActive ? xpReward * 2 : xpReward

    const nextMap = { ...claimedDailyMap, [questId]: true }
    setClaimedDailyMap(nextMap)
    try {
      localStorage.setItem('codeabroad_claimed_daily_quests', JSON.stringify(nextMap))
    } catch {
      // ignore
    }

    const nextGems = userGems + gemReward
    updateGemsState(nextGems)

    // Trigger floating reward burst
    setFloatingReward(`+${finalXp} XP ${isBoosterActive ? '(2x XP 🔥) ' : ''}• +${gemReward} 💎`)
    setTimeout(() => setFloatingReward(null), 2500)

    // Dispatch XP reward event
    window.dispatchEvent(new CustomEvent('codeabroad_xp_gained', { detail: { amount: finalXp } }))
    showToast(
      `🎉 Berhasil klaim +${finalXp} XP ${isBoosterActive ? '(2x XP Booster Aktif!) ' : ''}& 💎 ${gemReward} Gems!`
    )
  }

  // Use XP Booster Potion (30 minutes of 2x XP)
  const handleUseXPBooster = () => {
    const owned = inventory['xp-booster'] || 0
    if (owned <= 0) return
    triggerHaptic('success')
    audioEngine.playPop()

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

    const expiresAt = Date.now() + 30 * 60 * 1000
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
    } catch {
      const owned = inventory['cv-review'] || 0
      const newInventory = {
        ...inventory,
        ['cv-review']: Math.max(0, owned - 1),
      }
      setInventory(newInventory)
      try {
        localStorage.setItem('codeabroad_user_inventory', JSON.stringify(newInventory))
        window.dispatchEvent(new CustomEvent('codeabroad_inventory_updated'))

        const submissions = JSON.parse(localStorage.getItem('codeabroad_cv_submissions') || '[]')
        submissions.push({ ...data, submittedAt: new Date().toISOString(), status: 'in_review' })
        localStorage.setItem('codeabroad_cv_submissions', JSON.stringify(submissions))
      } catch {
        // ignore
      }
    }

    showToast('📋 Kupon CV Review berhasil digunakan. Mentor Tokyo sedang memeriksa berkas Anda!')
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
    } catch {
      const owned = inventory['mock-interview'] || 0
      const newInventory = {
        ...inventory,
        ['mock-interview']: Math.max(0, owned - 1),
      }
      setInventory(newInventory)
      try {
        localStorage.setItem('codeabroad_user_inventory', JSON.stringify(newInventory))
        window.dispatchEvent(new CustomEvent('codeabroad_inventory_updated'))

        const schedules = JSON.parse(localStorage.getItem('codeabroad_mock_schedules') || '[]')
        schedules.push({ ...data, scheduledAt: new Date().toISOString(), status: 'confirmed_discord' })
        localStorage.setItem('codeabroad_mock_schedules', JSON.stringify(schedules))
      } catch {
        // ignore
      }
    }

    showToast('🎙️ Pengajuan Mock Interview VIP berhasil dikirim! Silakan periksa Discord Anda.')
  }

  // Open chest modal or show guidance toast
  const handleOpenChest = (chest: {
    tier: 1 | 2 | 3
    label: string
    reward: string
    gemReward: number
    xpReward: number
    icon: string
    unlocked: boolean
  }) => {
    if (!chest.unlocked) {
      triggerHaptic('error')
      showToast(`⚠️ Selesaikan ${chest.tier - dailyDoneCount} misi harian lagi untuk membuka ${chest.label}!`)
      return
    }
    triggerHaptic('tap')
    setSelectedChestForModal(chest)
    setIsChestModalOpen(true)
  }

  // Confirm claim chest reward from unboxing modal
  const handleConfirmClaimChest = async () => {
    if (!selectedChestForModal) return
    const tier = selectedChestForModal.tier
    const nextChests = { ...claimedDailyChests, [tier]: true }
    setClaimedDailyChests(nextChests)
    try {
      localStorage.setItem(`codeabroad_claimed_daily_chests_${todayDateKey}`, JSON.stringify(nextChests))
    } catch {
      // ignore
    }

    try {
      const res = await gamificationService.claimDailyChest(tier)
      updateGemsState(res.status.gems)
    } catch {
      const nextGems = userGems + selectedChestForModal.gemReward
      updateGemsState(nextGems)
    }

    if (selectedChestForModal.xpReward > 0) {
      window.dispatchEvent(
        new CustomEvent('codeabroad_xp_gained', { detail: { amount: selectedChestForModal.xpReward } })
      )
    }

    setFloatingReward(
      `+${selectedChestForModal.xpReward > 0 ? `${selectedChestForModal.xpReward} XP • ` : ''}+${selectedChestForModal.gemReward} 💎`
    )
    setTimeout(() => setFloatingReward(null), 2500)
    showToast(`🎉 ${selectedChestForModal.label} berhasil dibuka! +${selectedChestForModal.gemReward} Gems ditambahkan.`)
    setIsChestModalOpen(false)
  }

  // Claim Monthly Roppongi Gold Badge
  const handleClaimMonthlyBadge = async () => {
    setIsMonthlyBadgeClaimed(true)
    try {
      localStorage.setItem(monthlyBadgeKey, 'true')
    } catch {
      // ignore
    }

    try {
      const res = await gamificationService.claimMonthlyBadge()
      updateGemsState(res.gems)
    } catch {
      const nextGems = userGems + 50
      updateGemsState(nextGems)
    }

    window.dispatchEvent(new CustomEvent('codeabroad_xp_gained', { detail: { amount: 150 } }))

    setFloatingReward('+150 XP • +50 💎')
    setTimeout(() => setFloatingReward(null), 2500)
    showToast(`🎉 Lencana Emas Roppongi (${currentMonthYearName}) berhasil disematkan ke portofolio Anda!`)
    setIsMonthlyBadgeModalOpen(false)
  }

  // Handle Akihabara Arcade item purchase
  const handlePurchaseShopItem = async (item: ShopItem) => {
    if (userGems < item.price) {
      triggerHaptic('error')
      showToast(`⚠️ Saldo Gems tidak cukup! Butuh ${item.price} Gems (Saldo: ${userGems}).`)
      return
    }

    triggerHaptic('success')
    audioEngine.playPop()

    try {
      const updatedStatus = await gamificationService.buyShopItem(item.id)
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
      const newGems = userGems - item.price
      updateGemsState(newGems)

      const nextInventory = {
        ...inventory,
        [item.id]: (inventory[item.id] || 0) + 1,
      }
      setInventory(nextInventory)
      try {
        localStorage.setItem('codeabroad_user_inventory', JSON.stringify(nextInventory))
        window.dispatchEvent(new CustomEvent('codeabroad_inventory_updated'))
      } catch {
        // ignore
      }

      showToast(`🛒 Berhasil menukar ${item.title}! Sisa Saldo: 💎 ${newGems} Gems.`)
    }
  }

  // 3 Daily Quests (The Core Habit Loop, cleanly checked against SSOT)
  const canonicalDailyList = useMemo(() => {
    if (dailyQuests && dailyQuests.length > 0) {
      return dailyQuests.map((q, idx) => {
        const isDone =
          q.user_status === 'completed' ||
          completedQuestsSet.has(q.id) ||
          !!claimedDailyMap[q.id]

        const defaultIcons = [Code, Translate, Lightning]
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

    return [
      {
        id: 'daily-gin-handler',
        title: 'Tuntaskan 1 Latihan Koding di Silabus',
        chip_label: 'KODING GIN API',
        difficulty: 'Pemula',
        xp_reward: 50,
        gem_reward: 10,
        estimated_minutes: 15,
        isCompleted:
          completedQuestsSet.has('daily-gin-handler') ||
          completedQuestsSet.has('part-4-routing-dan-jwt-middleware') ||
          !!claimedDailyMap['daily-gin-handler'],
        route: '/learn/part-4-routing-dan-jwt-middleware',
        icon: Code,
        progressText:
          completedQuestsSet.has('daily-gin-handler') ||
          completedQuestsSet.has('part-4-routing-dan-jwt-middleware') ||
          !!claimedDailyMap['daily-gin-handler']
            ? '1/1 Selesai'
            : '0/1 Selesai',
        progressPercent:
          completedQuestsSet.has('daily-gin-handler') ||
          completedQuestsSet.has('part-4-routing-dan-jwt-middleware') ||
          !!claimedDailyMap['daily-gin-handler']
            ? 100
            : 0,
      },
      {
        id: 'daily-nihongo-standup',
        title: 'Review 5 Kosakata Kantor Tokyo Hari Ini',
        chip_label: 'JLPT N3 NIHONGO',
        difficulty: 'Mudah',
        xp_reward: 30,
        gem_reward: 5,
        estimated_minutes: 5,
        isCompleted:
          completedQuestsSet.has('daily-nihongo-standup') ||
          completedQuestsSet.has('part-3-aisatsu-onboarding-tokyo') ||
          !!claimedDailyMap['daily-nihongo-standup'],
        route: '/learn/part-3-aisatsu-onboarding-tokyo',
        icon: Translate,
        progressText:
          completedQuestsSet.has('daily-nihongo-standup') ||
          completedQuestsSet.has('part-3-aisatsu-onboarding-tokyo') ||
          !!claimedDailyMap['daily-nihongo-standup']
            ? '5/5 Selesai'
            : '0/5 Selesai',
        progressPercent:
          completedQuestsSet.has('daily-nihongo-standup') ||
          completedQuestsSet.has('part-3-aisatsu-onboarding-tokyo') ||
          !!claimedDailyMap['daily-nihongo-standup']
            ? 100
            : 0,
      },
      {
        id: 'daily-pointer-quiz',
        title: 'Kumpulkan 50 XP dari Latihan Koding',
        chip_label: 'TARGET XP HARIAN',
        difficulty: 'Mudah',
        xp_reward: 40,
        gem_reward: 10,
        estimated_minutes: 5,
        isCompleted:
          completedQuestsSet.has('daily-pointer-quiz') ||
          completedQuestsSet.has('part-2-pointer-dan-struktur-data') ||
          !!claimedDailyMap['daily-pointer-quiz'],
        route: '/courses',
        icon: Lightning,
        progressText:
          completedQuestsSet.has('daily-pointer-quiz') ||
          completedQuestsSet.has('part-2-pointer-dan-struktur-data') ||
          !!claimedDailyMap['daily-pointer-quiz']
            ? '50/50 XP'
            : `${Math.min(50, user?.xp || 0)}/50 XP`,
        progressPercent:
          completedQuestsSet.has('daily-pointer-quiz') ||
          completedQuestsSet.has('part-2-pointer-dan-struktur-data') ||
          !!claimedDailyMap['daily-pointer-quiz']
            ? 100
            : Math.min(100, Math.round(((user?.xp || 0) / 50) * 100)),
      },
    ]
  }, [dailyQuests, completedQuestsSet, claimedDailyMap, user?.xp])

  // Filter daily quests based on search query
  const filteredDaily = useMemo(() => {
    if (!searchQuery.trim()) return canonicalDailyList
    const q = searchQuery.toLowerCase()
    return canonicalDailyList.filter(
      (item) => item.title.toLowerCase().includes(q) || item.chip_label.toLowerCase().includes(q)
    )
  }, [canonicalDailyList, searchQuery])

  // Tokyo Boss & Portfolio Challenges (Hooked directly to PostgreSQL DB & curriculum parts)
  const portfolioChallenges = useMemo(() => {
    let challenges = [
      {
        id: 'boss-worker-pool',
        title: 'High-Concurrency Worker Pool Engine',
        subtitle:
          'Pipeline pemrosesan concurrent beban tinggi dengan Goroutines, Channels, context timeout, dan graceful shutdown anti-memory leak.',
        tags: ['GOLANG', 'HIGH CONCURRENCY', 'WORKER POOL'],
        icon: '🔥',
        xp_reward: 250,
        gem_reward: 50,
        route: '/learn/part-7-worker-pool-concurrency',
        isCompleted:
          completedQuestsSet.has('part-7-worker-pool-concurrency') ||
          completedQuestsSet.has('b1000001-0000-0000-0000-000000000001'),
      },
      {
        id: 'capstone-clean-arch',
        title: 'Fullstack Microservices Clean Architecture Capstone',
        subtitle:
          'Implementasi RESTful API end-to-end dengan unit test coverage >80%, OpenAPI spec, dan scratch minimal Docker image.',
        tags: ['MICROSERVICES', 'CLEAN ARCH', 'DOCKER'],
        icon: '🏛️',
        xp_reward: 500,
        gem_reward: 100,
        route: '/learn/part-11-clean-architecture-repository',
        isCompleted:
          completedQuestsSet.has('part-11-clean-architecture-repository') ||
          completedQuestsSet.has('b1000002-0000-0000-0000-000000000002'),
      },
    ]

    if (backendBossQuests && backendBossQuests.length > 0) {
      challenges = backendBossQuests.map((q) => {
        const isWorkerPool = q.order_index === 1 || q.title.toLowerCase().includes('worker pool')
        const route = isWorkerPool
          ? '/learn/part-7-worker-pool-concurrency'
          : '/learn/part-11-clean-architecture-repository'
        const curriculumId = isWorkerPool
          ? 'part-7-worker-pool-concurrency'
          : 'part-11-clean-architecture-repository'
        const isDone =
          q.user_status === 'completed' ||
          completedQuestsSet.has(q.id) ||
          completedQuestsSet.has(curriculumId)

        const cleanTitle = q.title.replace(/\s*\(Mercari Tokyo Spec\)/gi, '')

        return {
          id: q.id,
          title: cleanTitle,
          subtitle:
            q.description ||
            'Tantangan arsitektur backend berskala tinggi standar industri modern.',
          tags: isWorkerPool
            ? ['GOLANG', 'HIGH CONCURRENCY', 'WORKER POOL']
            : ['MICROSERVICES', 'CLEAN ARCH', 'DOCKER'],
          icon: isWorkerPool ? '🔥' : '🏛️',
          xp_reward: q.xp_reward,
          gem_reward: Math.round(q.xp_reward / 5),
          route,
          isCompleted: isDone,
        }
      })
    }

    if (!searchQuery.trim()) return challenges
    const q = searchQuery.toLowerCase()
    return challenges.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [backendBossQuests, completedQuestsSet, searchQuery])

  // Monthly Quest Progress Calculation (Authentic Duolingo Monthly Badge Challenge)
  const totalCompletedCount = completedQuestsSet.size
  const monthlyTargetCount = 25
  const monthlyCompletedCount = Math.min(monthlyTargetCount, totalCompletedCount)
  const monthlyProgressPercent = Math.min(100, Math.round((monthlyCompletedCount / monthlyTargetCount) * 100))

  // Days left in current month calculation
  const daysLeftInMonth = useMemo(() => {
    const now = new Date()
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return Math.max(1, lastDay.getDate() - now.getDate())
  }, [])

  // Daily quest completion count
  const dailyDoneCount = canonicalDailyList.filter((d) => d.isCompleted).length
  const totalDailyTarget = canonicalDailyList.length

  // Dynamic living companion Kodi state & speech bubble
  const kodiCompanion = useMemo(() => {
    const userName = user?.name ? user.name.split(' ')[0] : 'Sobat'
    if (dailyDoneCount === 0) {
      return {
        image: doodleWelcome,
        badge: 'Semangat Pagi! ⚡',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        speech: `Halo ${userName}! Selesaikan 3 misi hari ini untuk menyalakan api streak 🔥`,
        alt: 'Kodi Menyapa',
      }
    }
    if (dailyDoneCount < totalDailyTarget) {
      return {
        image: doodleCoding,
        badge: 'Sedang Berjalan 🚀',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        speech: `Keren banget! Tinggal ${totalDailyTarget - dailyDoneCount} misi lagi untuk membuka Peti Emas Akihabara 🎁`,
        alt: 'Kodi Koding',
      }
    }
    return {
      image: doodleCelebrate,
      badge: 'Semua Misi Tuntas! 🎉',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      speech: `Luar biasa, ${userName}! Semua misi harian tuntas dan streak Anda aman. Sampai jumpa besok di Tokyo Guild! 🌸`,
      alt: 'Kodi Merayakan',
    }
  }, [dailyDoneCount, totalDailyTarget, user?.name])

  // Counts for top bar (Pure SSOT, 0 fake fallbacks)
  const totalCount =
    hookTotalCount > 0
      ? hookTotalCount
      : canonicalDailyList.length + portfolioChallenges.length
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
      <NavRail />

      {/* ── 2. SINGLE-COLUMN SPACIOUS CENTER STAGE (AIRY, ZERO SIDEBAR CLAUSTROPHOBIA) ── */}
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-12">
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 space-y-7">
          {/* ── TOP HUD BAR (SSOT) ── */}
          <GameTopBar
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
                    Selesaikan 25 misi dan tantangan koding bulan ini untuk membuka lencana emas permanen di profil portofolio Anda.
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
                          <span>LENCANA EMAS AKTIF DI PROFIL ✓</span>
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
                <div className="w-28 h-28 sm:w-32 sm:h-32 relative group">
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full filter blur-xl transform group-hover:scale-110 transition-transform" />
                  <img
                    src={kodiCompanion.image}
                    alt={kodiCompanion.alt}
                    className="w-full h-full object-contain relative z-10 drop-shadow-md transform group-hover:scale-105 transition-transform duration-300"
                  />
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
          {activeTab === 'daily' && filteredDaily.length > 0 && (
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
              {/* Header with Title & Countdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 border-2 border-amber-200 text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
                    <Lightning weight="fill" className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg text-[#0F172A]">
                        Misi Harian ({dailyDoneCount}/{totalDailyTarget} Selesai)
                      </h3>
                      {hookLoading && (
                        <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      Selesaikan 3 misi harian untuk membuka Peti Emas Akihabara &amp; menjaga rentetan streak.
                    </p>
                  </div>
                </div>

                <span className="bg-[#FFFBEB] text-[#B45309] text-xs font-black px-3.5 py-1.5 rounded-2xl border-2 border-amber-200 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto">
                  <Clock weight="bold" className="w-3.5 h-3.5" />
                  <span>Reset dalam: {timeLeft}</span>
                </span>
              </div>

              {/* 3-Tier Milestone Chests Progress Track */}
              <div className="bg-amber-50/40 border border-amber-200/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-brand font-black">
                  <span className="text-amber-900 flex items-center gap-1.5">
                    <Sparkle weight="fill" className="w-4 h-4 text-amber-600" />
                    <span>Peti Hadiah Harian: {dailyDoneCount} dari {totalDailyTarget} Misi Tercapai</span>
                  </span>
                  <span className="text-amber-700 font-bold">
                    {dailyDoneCount >= totalDailyTarget
                      ? '🎉 Peti Emas Terbuka!'
                      : `${totalDailyTarget - dailyDoneCount} misi lagi untuk Peti Emas`}
                  </span>
                </div>

                {/* Progressive 3-Chest Milestones Display (Tactile 3D Buttons) */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    {
                      tier: 1 as const,
                      label: 'Peti Perunggu',
                      reward: '+5 💎',
                      gemReward: 5,
                      xpReward: 0,
                      icon: '🥉',
                      unlocked: dailyDoneCount >= 1,
                    },
                    {
                      tier: 2 as const,
                      label: 'Peti Perak',
                      reward: '+10 💎',
                      gemReward: 10,
                      xpReward: 0,
                      icon: '🥈',
                      unlocked: dailyDoneCount >= 2,
                    },
                    {
                      tier: 3 as const,
                      label: 'Peti Emas',
                      reward: '+20 💎 & XP',
                      gemReward: 20,
                      xpReward: 50,
                      icon: '👑',
                      unlocked: dailyDoneCount >= 3,
                    },
                  ].map((chest) => {
                    const isClaimed = !!claimedDailyChests[chest.tier]
                    return (
                      <button
                        key={chest.tier}
                        type="button"
                        onClick={() => handleOpenChest(chest)}
                        className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                          isClaimed
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 border-b-[3px] border-b-emerald-400 opacity-90'
                            : chest.unlocked
                            ? 'bg-amber-100/90 border-amber-400 text-amber-950 border-b-[4px] border-b-amber-500 shadow-xs scale-[1.02] ring-2 ring-amber-300 animate-pulse'
                            : 'bg-white border-slate-200/80 text-slate-400 hover:border-slate-300 active:translate-y-0.5'
                        }`}
                      >
                        <span className="text-xl shrink-0">{chest.icon}</span>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-black uppercase tracking-wider block truncate">
                            {chest.label}
                          </span>
                          <span
                            className={`text-xs font-black block truncate ${
                              isClaimed
                                ? 'text-emerald-700'
                                : chest.unlocked
                                ? 'text-amber-800'
                                : 'text-slate-500'
                            }`}
                          >
                            {isClaimed ? 'DIKLAIM ✓' : chest.unlocked ? 'KLAIM ✨' : chest.reward}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 3 Daily Quests Chunky Cards Feed */}
              <div className="space-y-3.5 pt-1">
                {filteredDaily.map((questItem, idx) => {
                  const isClaimed = !!claimedDailyMap[questItem.id]
                  const isDone = questItem.isCompleted || isClaimed
                  const QuestIcon = questItem.icon

                  return (
                    <div
                      key={questItem.id}
                      className={`border-2 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 shadow-2xs ${
                        isClaimed
                          ? 'bg-slate-50/70 border-slate-200/80 border-b-[3px] border-b-slate-200 opacity-80'
                          : isDone
                          ? 'bg-amber-50/50 border-2 border-amber-300 border-b-[4px] border-b-amber-400 shadow-xs'
                          : 'bg-white border-2 border-slate-200/90 border-b-[4px] border-b-slate-300 hover:border-b-[5px] hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Left: Icon & Info */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-13 h-13 rounded-2xl border-2 flex items-center justify-center shrink-0 shadow-2xs ${
                            isClaimed
                              ? 'bg-slate-100 border-slate-300 text-slate-400'
                              : isDone
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-blue-50 border-blue-200 text-[#2563EB]'
                          }`}
                        >
                          {isClaimed ? (
                            <CheckCircle weight="fill" className="w-7 h-7 text-emerald-600" />
                          ) : (
                            <QuestIcon weight="bold" className="w-6 h-6" />
                          )}
                        </div>

                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-black text-[10px] px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${
                                isDone
                                  ? 'bg-amber-100 border-amber-200 text-amber-900'
                                  : 'bg-blue-50 border-blue-200 text-[#1D4ED8]'
                              }`}
                            >
                              {questItem.chip_label}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              • Target #{idx + 1}
                            </span>
                            {isClaimed && (
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                HADIAH DITERIMA ✓
                              </span>
                            )}
                          </div>

                          <h4 className="font-black text-sm sm:text-base text-[#0F172A] truncate">
                            {questItem.title}
                          </h4>

                          {/* Progress Line */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="w-28 sm:w-40 h-2 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isDone ? 'bg-emerald-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${questItem.progressPercent}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-slate-500 font-mono">
                              {questItem.progressText}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-bold text-amber-600">
                              ⚡ +{questItem.xp_reward} XP
                            </span>
                            <span className="text-xs font-bold text-blue-600">
                              💎 +{questItem.gem_reward}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Tactile Action Button */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {isClaimed ? (
                          <Button3D
                            variant="ghost"
                            size="sm"
                            disabled
                            className="text-xs px-4 py-2 border-2 border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                          >
                            SELESAI ✓
                          </Button3D>
                        ) : isDone ? (
                          <Button3D
                            variant="amber"
                            size="sm"
                            onClick={() =>
                              handleClaimDailyQuest(questItem.id, questItem.xp_reward, questItem.gem_reward)
                            }
                            className="text-xs px-4 py-2 ring-4 ring-amber-300 animate-pulse"
                          >
                            KLAIM HADIAH ⚡
                          </Button3D>
                        ) : (
                          <Button3D
                            variant="blue"
                            size="sm"
                            onClick={() => navigate(questItem.route)}
                            className="text-xs px-4 py-2"
                          >
                            MULAI ▶
                          </Button3D>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ══════ SECTION 2: TOKYO GUILD TERMINAL (TACTILE MISSION SLATS) ══════ */}
          {activeTab === 'boss' && portfolioChallenges.length > 0 && (
            <div className="space-y-4">
              {/* Console Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                <div>
                  <h3 className="font-brand font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                    <span>⚔️</span>
                    <span>Sayembara Tokyo Tech Guild</span>
                    <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md border border-purple-200">
                      S-RANK SPECS
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Tantangan portofolio arsitektur riil kurasi engineer diaspora Tokyo (Mercari &amp; Rakuten Spec).
                  </p>
                </div>

                {/* Total Bounty Badge */}
                <div className="flex items-center gap-2 text-xs font-brand font-black bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-amber-900 shrink-0 self-start sm:self-auto shadow-2xs">
                  <span>Bounty:</span>
                  <span className="text-amber-600">⚡ +750 XP</span>
                  <span>•</span>
                  <span className="text-blue-600">💎 +150 Gems</span>
                </div>
              </div>

              {/* Tactile Mission Slat Cartridges */}
              <div className="bg-white border-2 border-slate-200/90 rounded-3xl divide-y-2 divide-slate-100 shadow-2xs overflow-hidden">
                {portfolioChallenges.map((challenge, idx) => (
                  <div
                    key={challenge.id}
                    className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Left: Indicator & Track Info */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-blue-400 transition-all text-2xl shadow-2xs">
                        {challenge.icon}
                      </div>

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black font-mono px-2.5 py-0.5 rounded-md border border-amber-300 bg-amber-50 text-amber-800 uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                            🏆 S-Rank Capstone
                          </span>
                          {challenge.isCompleted && (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              LULUS KUALIFIKASI ✓
                            </span>
                          )}
                        </div>

                        <h4 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                          {challenge.title}
                        </h4>

                        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
                          {challenge.subtitle}
                        </p>

                        {/* Tech Tags Minimal Row */}
                        <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                          {challenge.tags.map((t) => (
                            <span key={t} className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Bounty & Tactile Action */}
                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          Bounty
                        </div>
                        <div className="flex md:flex-col items-center md:items-end gap-1.5 md:gap-0 font-brand font-black text-xs">
                          <span className="text-amber-600">⚡ +{challenge.xp_reward} XP</span>
                          <span className="text-blue-600">💎 +{challenge.gem_reward} Gems</span>
                        </div>
                      </div>

                      <div>
                        <Button3D
                          variant={challenge.isCompleted ? 'ghost' : idx === 0 ? 'amber' : 'blue'}
                          size="sm"
                          onClick={() => navigate(challenge.route)}
                          className={`text-xs px-4 py-2 ${challenge.isCompleted ? 'border border-emerald-300 bg-emerald-50 text-emerald-700' : ''}`}
                        >
                          {challenge.isCompleted ? 'LIHAT HASIL ✓' : 'MULAI SAYEMBARA ➔'}
                        </Button3D>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════ SECTION 3: AKIHABARA VENDING RACK (UNIFIED KIOSK SHELF) ══════ */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              {/* Vending Console Top HUD */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-5 sm:p-6 shadow-md border-b-[5px] border-b-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-2xl shrink-0 backdrop-blur-xs">
                    🕹️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                        Akihabara Tech Kiosk &amp; Vending
                      </h3>
                      <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                        AUTO DISPENSE
                      </span>
                    </div>
                    <p className="text-xs text-blue-100 max-w-md">
                      Tukarkan gems sayembara dengan proteksi streak, potion pengganda XP, dan kupon karir Tokyo.
                    </p>
                  </div>
                </div>

                {/* Live Gems Coin Vault */}
                <div className="bg-white/15 border-2 border-white/20 rounded-2xl px-4 py-2.5 flex items-center gap-3 shrink-0 self-start sm:self-auto backdrop-blur-xs">
                  <span className="text-2xl animate-bounce">💎</span>
                  <div>
                    <span className="text-[10px] font-black text-blue-200 block uppercase tracking-wider">
                      Saldo Gems Anda
                    </span>
                    <span className="text-base font-black text-amber-300">
                      {userGems} Gems
                    </span>
                  </div>
                </div>
              </div>

              {/* Unified Vending Shelf Rack */}
              <div className="bg-white border-2 border-slate-200/90 rounded-3xl divide-y-2 divide-slate-100 shadow-2xs overflow-hidden">
                {SHOP_ITEMS.map((item) => {
                  const ItemIcon = item.icon
                  const ownedCount = inventory[item.id] || 0
                  const isAffordable = userGems >= item.price
                  const missingGems = item.price - userGems

                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Left Item Token & Info */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div
                          className={`w-12 h-12 rounded-2xl border-2 ${item.iconBg} flex items-center justify-center ${item.iconColor} shadow-2xs shrink-0 group-hover:scale-105 transition-transform`}
                        >
                          <ItemIcon weight="bold" className="w-6 h-6" />
                        </div>

                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black text-sm sm:text-base text-slate-900">
                              {item.title}
                            </h4>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${item.badgeColor} uppercase tracking-wider`}>
                              {item.badge}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Right: Stock Counter & Purchase/Action Buttons */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-wrap">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                            Stok Tas
                          </span>
                          <span className="font-mono font-black text-xs text-slate-700">
                            {ownedCount > 0 ? `${ownedCount}x Dimiliki` : 'Belum Ada'}
                          </span>
                        </div>

                        {/* Action if owned */}
                        {ownedCount > 0 && item.id === 'xp-booster' && (
                          <div>
                            {xpBoosterExpiresAt > Date.now() ? (
                              <span className="text-[11px] font-mono font-black bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1 animate-pulse">
                                <span>⚡ 2x XP Aktif</span>
                              </span>
                            ) : (
                              <Button3D
                                variant="amber"
                                size="sm"
                                onClick={handleUseXPBooster}
                                className="text-xs px-3.5 py-2 ring-2 ring-amber-300"
                              >
                                GUNAKAN 🧪
                              </Button3D>
                            )}
                          </div>
                        )}

                        {ownedCount > 0 && item.id === 'cv-review' && (
                          <Button3D
                            variant="emerald"
                            size="sm"
                            onClick={() => {
                              triggerHaptic('tap')
                              setIsCVModalOpen(true)
                            }}
                            className="text-xs px-3.5 py-2 border-b-emerald-800"
                          >
                            KIRIM BERKAS 📋
                          </Button3D>
                        )}

                        {ownedCount > 0 && item.id === 'mock-interview' && (
                          <Button3D
                            variant="amber"
                            size="sm"
                            onClick={() => {
                              triggerHaptic('tap')
                              setIsMockModalOpen(true)
                            }}
                            className="text-xs px-3.5 py-2 text-purple-950 bg-gradient-to-r from-purple-300 to-indigo-300 border-b-purple-600"
                          >
                            JADWALKAN 🎙️
                          </Button3D>
                        )}

                        {ownedCount > 0 && item.id === 'streak-freeze' && (
                          <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs">
                            <span>❄️ Proteksi Siap</span>
                          </span>
                        )}

                        <div>
                          <Button3D
                            variant={isAffordable ? 'blue' : 'ghost'}
                            size="sm"
                            onClick={() => handlePurchaseShopItem(item)}
                            disabled={!isAffordable}
                            className={`text-xs px-4 py-2 min-w-[120px] ${
                              !isAffordable ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : ''
                            }`}
                          >
                            {isAffordable ? (
                              <span className="flex items-center gap-1.5">
                                <span>TUKAR</span>
                                <span className="font-mono font-black">💎 {item.price}</span>
                              </span>
                            ) : (
                              <span>Kurang {missingGems} 💎</span>
                            )}
                          </Button3D>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick link banner back to curriculum */}
          <div className="p-4 bg-slate-100/80 border-2 border-slate-200 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Ingin melanjutkan modul kurikulum utama?</span>
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="text-[#2563EB] hover:underline flex items-center gap-1 font-black cursor-pointer"
            >
              <span>Buka Silabus Kurikulum</span>
              <ArrowRight weight="bold" className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>
      </div>

      {/* ── 3. DUOLINGO-STYLE COURSE SWITCHER MODAL ── */}
      <CourseSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
        trackProgressMap={trackProgressMap}
      />

      {/* ── 4. TOKYO LEADERBOARD MODAL ── */}
      <TokyoLeaderboardModal
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
