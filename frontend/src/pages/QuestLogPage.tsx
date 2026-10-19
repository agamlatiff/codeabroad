import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import { questService } from '../services/questService'
import { useQuests } from '../hooks/useQuests'
import { Button3D } from '../components/ui/Button3D'
import { triggerHaptic } from '../utils/haptics'
import { audioEngine } from '../utils/audio'
import {
  GameTopBar,
  CourseSwitcherModal,
  TokyoLeaderboardModal,
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
import doodleOnFire from '../assets/kodi/doodle-on-fire.png'
import doodleProud from '../assets/kodi/doodle-proud.png'
import doodleCoffeeBreak from '../assets/kodi/doodle-coffee-break.png'

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

  // Handle claim daily quest reward with burst animation
  const handleClaimDailyQuest = (questId: string, xpReward: number, gemReward: number) => {
    triggerHaptic('success')
    audioEngine.playPop()

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
    setFloatingReward(`+${xpReward} XP • +${gemReward} 💎`)
    setTimeout(() => setFloatingReward(null), 2000)

    // Dispatch XP reward event
    window.dispatchEvent(new CustomEvent('codeabroad_xp_gained', { detail: { amount: xpReward } }))
    showToast(`🎉 Berhasil klaim +${xpReward} XP & 💎 ${gemReward} Gems!`)
  }

  // Handle Akihabara Arcade item purchase
  const handlePurchaseShopItem = (item: ShopItem) => {
    if (userGems < item.price) {
      triggerHaptic('error')
      showToast(`⚠️ Saldo Gems tidak cukup! Butuh ${item.price} Gems (Saldo: ${userGems}).`)
      return
    }

    triggerHaptic('success')
    audioEngine.playPop()

    const newGems = userGems - item.price
    updateGemsState(newGems)

    const nextInventory = {
      ...inventory,
      [item.id]: (inventory[item.id] || 0) + 1,
    }
    setInventory(nextInventory)
    try {
      localStorage.setItem('codeabroad_user_inventory', JSON.stringify(nextInventory))
    } catch {
      // ignore
    }

    showToast(`🛒 Berhasil menukar ${item.title}! Sisa Saldo: 💎 ${newGems} Gems.`)
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
            : `${Math.min(50, (user?.xp || 0) % 50)}/50 XP`,
        progressPercent:
          completedQuestsSet.has('daily-pointer-quiz') ||
          completedQuestsSet.has('part-2-pointer-dan-struktur-data') ||
          !!claimedDailyMap['daily-pointer-quiz']
            ? 100
            : Math.min(100, Math.round((((user?.xp || 0) % 50) / 50) * 100)),
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

  // Tokyo Boss & Portfolio Challenges (Hooked directly to valid curriculum parts)
  const portfolioChallenges = useMemo(() => {
    const challenges = [
      {
        id: 'boss-worker-pool',
        title: 'High-Concurrency Worker Pool Engine (Mercari Tokyo Spec)',
        subtitle:
          'Bangun pipeline pemrosesan concurrent beban tinggi dengan Goroutines, Channels, context timeout, dan graceful shutdown anti-memory leak.',
        tags: ['GOLANG', 'HIGH CONCURRENCY', 'MERCARI SPEC'],
        deliverables: [
          'Goroutines Worker Pool & Buffered Channels Pipeline',
          'Context Timeout, Cancellation, & Zero Memory Leak',
          'Graceful Shutdown dengan OS Signal Interception',
        ],
        difficulty: 'S-Rank Sulit',
        xp_reward: 250,
        gem_reward: 50,
        sponsorTag: 'KURASI MERCARI TOKYO LABS 🇯🇵',
        sponsorBadgeBg: 'bg-red-50 text-red-900 border-red-200',
        cardBorder: 'border-amber-300 border-b-[5px] border-b-amber-500',
        cardGlow: 'bg-amber-400/20',
        illustration: doodleOnFire,
        illustrationAlt: 'Kodi Mode Concurrency On Fire',
        buttonLabel: '⚔️ Hadapi Boss Worker Pool',
        route: '/learn/part-7-worker-pool-concurrency',
        isCompleted: completedQuestsSet.has('part-7-worker-pool-concurrency'),
      },
      {
        id: 'capstone-clean-arch',
        title: 'Fullstack Microservices Clean Architecture Capstone',
        subtitle:
          'Implementasi end-to-end RESTful API dengan unit test coverage >80%, OpenAPI documentation, dan Docker image scratch minimalis untuk portofolio rekrutmen Jepang.',
        tags: ['MICROSERVICES', 'CLEAN ARCH', 'DOCKER', 'OPENAPI'],
        deliverables: [
          'Clean Architecture 4-Tier (Domain, UseCase, Repo, Delivery)',
          'Unit Test Coverage >80% & SQL Mocking Isolation',
          'Docker Multi-Stage Build Minimal Scratch Image (<25MB)',
        ],
        difficulty: 'S-Rank Sulit',
        xp_reward: 500,
        gem_reward: 100,
        sponsorTag: 'KURASI RAKUTEN SYMPHONY TOKYO 🌟',
        sponsorBadgeBg: 'bg-purple-50 text-purple-900 border-purple-200',
        cardBorder: 'border-purple-300 border-b-[5px] border-b-purple-500',
        cardGlow: 'bg-purple-400/20',
        illustration: doodleProud,
        illustrationAlt: 'Kodi Master Architect',
        buttonLabel: '👑 Ambil Sayembara Capstone',
        route: '/learn/part-11-clean-architecture-repository',
        isCompleted: completedQuestsSet.has('part-11-clean-architecture-repository'),
      },
    ]

    if (!searchQuery.trim()) return challenges
    const q = searchQuery.toLowerCase()
    return challenges.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [searchQuery, completedQuestsSet])

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
                    Lencana Emas Roppongi (Oktober 2026)
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

                {/* Progressive 3-Chest Milestones Display */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { tier: 1, label: 'Peti Perunggu', reward: '+5 💎', icon: '🥉', unlocked: dailyDoneCount >= 1 },
                    { tier: 2, label: 'Peti Perak', reward: '+10 💎', icon: '🥈', unlocked: dailyDoneCount >= 2 },
                    { tier: 3, label: 'Peti Emas', reward: '+20 💎 & XP', icon: '👑', unlocked: dailyDoneCount >= 3 },
                  ].map((chest) => (
                    <div
                      key={chest.tier}
                      className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 transition-all ${
                        chest.unlocked
                          ? 'bg-amber-100/70 border-amber-300 text-amber-900 shadow-2xs scale-[1.02]'
                          : 'bg-white border-slate-200/80 text-slate-400 opacity-70'
                      }`}
                    >
                      <span className="text-xl">{chest.icon}</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider block truncate">
                          {chest.label}
                        </span>
                        <span className="text-xs font-black text-amber-700">
                          {chest.unlocked ? `${chest.reward} ✓` : chest.reward}
                        </span>
                      </div>
                    </div>
                  ))}
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

          {/* ══════ SECTION 2: TOKYO BOSS CHALLENGES (DEDICATED SAYEMBARA GUILD BOARD) ══════ */}
          {activeTab === 'boss' && portfolioChallenges.length > 0 && (
            <div className="space-y-6">
              {/* Guild Sayembara Header Banner */}
              <div className="bg-gradient-to-r from-purple-900/10 via-amber-500/10 to-blue-500/10 border-2 border-purple-200 border-b-[5px] border-b-purple-400 rounded-3xl p-6 sm:p-7 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-black text-2xl shadow-md border-b-[4px] border-purple-900 shrink-0">
                    ⛩️
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-lg sm:text-xl text-[#0F172A] tracking-tight">
                        Papan Sayembara Tokyo Tech Guild (Boss Raids)
                      </h3>
                      <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
                        S-Rank Kurasi Tokyo
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                      Tantangan arsitektur skala industri riil sesuai standar rekrutmen engineer Jepang (Mercari &amp; Rakuten Spec). Selesaikan untuk portofolio kurasi diaspora Tokyo.
                    </p>
                  </div>
                </div>

                {/* Bounty Overview Pill */}
                <div className="bg-white/90 border-2 border-purple-200 rounded-2xl p-3 flex items-center gap-4 shadow-2xs shrink-0 self-start md:self-center">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                      Total Bounty Tersedia
                    </span>
                    <div className="flex items-center gap-2 pt-0.5 font-black text-xs">
                      <span className="text-amber-600">⚡ +750 XP</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-blue-600">💎 +150 Gems</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stack of Rich Horizontal Boss Dossier Cards */}
              <div className="space-y-5">
                {portfolioChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`bg-white border-2 ${challenge.cardBorder} rounded-3xl p-6 sm:p-7 shadow-2xs hover:-translate-y-0.5 transition-all relative overflow-hidden`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left: Illustration Badge & Mood Avatar */}
                      <div className="flex items-center sm:items-start gap-4 shrink-0 lg:w-44 flex-col text-center sm:text-left lg:text-center">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 relative group mx-auto">
                          <div className={`absolute inset-0 ${challenge.cardGlow} rounded-full filter blur-xl transform group-hover:scale-110 transition-transform`} />
                          <img
                            src={challenge.illustration}
                            alt={challenge.illustrationAlt}
                            className="w-full h-full object-contain relative z-10 drop-shadow-md transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="space-y-1 w-full">
                          {challenge.isCompleted ? (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-black text-[11px] px-3 py-1 rounded-full shadow-2xs inline-block">
                              DIASPORA VERIFIED ✓
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-700 font-brand font-black text-[11px] px-3 py-1 rounded-full border border-red-200 inline-block">
                              ⚡ S-RANK BOUNTY
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-slate-400 block">
                            Standar Visa Rekrutmen
                          </span>
                        </div>
                      </div>

                      {/* Middle: Mission Briefing, Tags & Tech Deliverables */}
                      <div className="flex-1 min-w-0 space-y-3.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-brand font-black text-[11px] px-2.5 py-0.5 rounded-lg border ${challenge.sponsorBadgeBg}`}>
                              {challenge.sponsorTag}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400">
                              • Capstone Portofolio
                            </span>
                          </div>

                          <h4 className="font-black text-base sm:text-lg text-[#0F172A] leading-snug">
                            {challenge.title}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {challenge.subtitle}
                          </p>
                        </div>

                        {/* Deliverables Checklist */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                            Target Output Industri (Deliverables):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                            {challenge.deliverables.map((item, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-2">
                                <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span className="truncate">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech tags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {challenge.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-slate-100 text-slate-700 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-md border border-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Bounty Rewards & Action Button Panel */}
                      <div className="shrink-0 flex flex-col justify-between items-center sm:items-end lg:items-center bg-slate-50/80 border-2 border-slate-200/80 rounded-2xl p-4 lg:w-48 space-y-3.5 text-center">
                        <div className="space-y-1 w-full">
                          <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                            Bounty Kelulusan
                          </span>
                          <div className="flex flex-col gap-1 items-center justify-center">
                            <span className="text-sm font-black text-amber-600">
                              ⚡ +{challenge.xp_reward} XP
                            </span>
                            <span className="text-sm font-black text-blue-600">
                              💎 +{challenge.gem_reward} Gems
                            </span>
                          </div>
                        </div>

                        <div className="w-full pt-1">
                          {challenge.isCompleted ? (
                            <Button3D
                              variant="ghost"
                              size="sm"
                              fullWidth
                              onClick={() => navigate(challenge.route)}
                              className="text-xs py-2 bg-emerald-50 border-emerald-300 text-emerald-700"
                            >
                              LIHAT HASIL ✓
                            </Button3D>
                          ) : (
                            <Button3D
                              variant="blue"
                              size="sm"
                              fullWidth
                              onClick={() => navigate(challenge.route)}
                              className="text-xs py-2.5 font-black shadow-md"
                            >
                              {challenge.buttonLabel} ➔
                            </Button3D>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════ SECTION 3: AKIHABARA GEMS ARCADE & GACHA SHOP ══════ */}
          {activeTab === 'shop' && (
            <div className="space-y-6">
              {/* ── 1. KODI ARCADE SHOPKEEPER BANNER ── */}
              <div className="bg-gradient-to-r from-blue-600/10 via-indigo-50/50 to-purple-500/10 border-2 border-blue-300 border-b-[5px] border-b-blue-400 rounded-3xl p-6 sm:p-7 shadow-2xs relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Arcade Details */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-brand font-black text-[11px] px-3 py-1 rounded-full border border-blue-300 bg-blue-100 text-blue-900 uppercase tracking-wider">
                        AKIHABARA ARCADE &amp; GACHA 🕹️
                      </span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Sparkle weight="fill" className="w-3.5 h-3.5 text-blue-500" />
                        <span>Toko Resmi Diaspora Tokyo</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                        Toko Penukaran Gems &amp; Booster
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                        Tukarkan gems hasil menuntaskan latihan koding dan Boss Quest dengan item proteksi streak, pengganda XP, serta kupon review portofolio diaspora.
                      </p>
                    </div>

                    {/* User Gems Vault */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="bg-white border-2 border-blue-300 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-2xs">
                        <span className="text-2xl">💎</span>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                            Brankas Saldo Gems Anda
                          </span>
                          <span className="text-base font-black text-blue-700">
                            {userGems} Gems Tersedia
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Kodi Shopkeeper with Speech Bubble */}
                  <div className="flex flex-col items-center sm:items-end justify-center shrink-0 self-center md:self-auto space-y-2">
                    <div className="relative bg-white border-2 border-blue-300 rounded-2xl px-4 py-2.5 shadow-2xs text-xs font-brand font-black text-slate-800 leading-snug max-w-xs text-center sm:text-left">
                      <span>
                        {userGems >= 20
                          ? `Irasshaimase! Kamu punya ${userGems} Gems. Mau borong Streak Freeze atau Kupon CV Tokyo hari ini? ✨`
                          : `Koleksi Gems lebih banyak dengan menyelesaikan Misi Harian & Sayembara Boss ya! 💎`}
                      </span>
                      <div className="hidden sm:block absolute -bottom-2 right-10 w-3 h-3 bg-white border-b-2 border-r-2 border-blue-300 transform rotate-45" />
                    </div>

                    <div className="w-28 h-28 sm:w-32 sm:h-32 relative group">
                      <div className="absolute inset-0 bg-blue-400/20 rounded-full filter blur-xl transform group-hover:scale-110 transition-transform" />
                      <img
                        src={doodleCoffeeBreak}
                        alt="Kodi Kasir Arcade Akihabara"
                        className="w-full h-full object-contain relative z-10 drop-shadow-md transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 2. USER INVENTORY QUICK POUCH ── */}
              <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-brand font-black">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <span>🎒</span>
                    <span>Tas Inventaris Perlengkapan Anda</span>
                  </span>
                  <span className="text-slate-400 text-[11px] font-semibold">
                    Item aktif otomatis saat dibutuhkan
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {[
                    { id: 'streak-freeze', label: 'Streak Freeze', icon: '❄️', count: inventory['streak-freeze'] || 0, color: 'text-blue-700 bg-blue-50 border-blue-200' },
                    { id: 'xp-booster', label: 'XP Booster 2x', icon: '🧪', count: inventory['xp-booster'] || 0, color: 'text-amber-700 bg-amber-50 border-amber-200' },
                    { id: 'cv-review', label: 'Kupon CV Tokyo', icon: '📋', count: inventory['cv-review'] || 0, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                    { id: 'mock-interview', label: 'VIP Mock Interview', icon: '🎙️', count: inventory['mock-interview'] || 0, color: 'text-purple-700 bg-purple-50 border-purple-200' },
                  ].map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${slot.color}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg">{slot.icon}</span>
                        <span className="text-[11px] font-black truncate">{slot.label}</span>
                      </div>
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-white/80 border border-current shadow-2xs shrink-0">
                        {slot.count}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 3. MERCHANDISE SHOWCASE (2x2 LEGA & TACTILE) ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SHOP_ITEMS.map((item) => {
                  const ItemIcon = item.icon
                  const ownedCount = inventory[item.id] || 0
                  const isAffordable = userGems >= item.price
                  const missingGems = item.price - userGems

                  return (
                    <div
                      key={item.id}
                      className={`bg-white border-2 ${
                        item.id === 'streak-freeze'
                          ? 'border-blue-200 border-b-[5px] border-b-blue-400'
                          : item.id === 'xp-booster'
                          ? 'border-amber-200 border-b-[5px] border-b-amber-400'
                          : item.id === 'cv-review'
                          ? 'border-emerald-200 border-b-[5px] border-b-emerald-400'
                          : 'border-purple-200 border-b-[5px] border-b-purple-400'
                      } rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:-translate-y-0.5 transition-all`}
                    >
                      {/* Top Content */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-2xl border-2 ${item.iconBg} flex items-center justify-center ${item.iconColor} shadow-md shrink-0`}
                            >
                              <ItemIcon weight="bold" className="w-6 h-6" />
                            </div>
                            <div>
                              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border ${item.badgeColor} uppercase tracking-wider inline-block`}>
                                {item.badge}
                              </span>
                              <h3 className="font-black text-base sm:text-lg text-[#0F172A] mt-0.5">
                                {item.title}
                              </h3>
                            </div>
                          </div>

                          {/* Owned Pill */}
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 shrink-0">
                            {ownedCount > 0 ? `Dimiliki: ${ownedCount}x` : 'Belum Ada'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Bottom Action Bar */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg">💎</span>
                          <span className="font-black text-base text-blue-700">
                            {item.price} <span className="text-xs font-bold text-slate-400 uppercase">Gems</span>
                          </span>
                        </div>

                        <div>
                          {isAffordable ? (
                            <Button3D
                              variant={item.id === 'cv-review' ? 'emerald' : item.id === 'xp-booster' ? 'amber' : 'blue'}
                              size="sm"
                              onClick={() => handlePurchaseShopItem(item)}
                              className="text-xs px-5 py-2 shadow-md animate-pulse hover:animate-none"
                            >
                              TUKAR REWARD 💎
                            </Button3D>
                          ) : (
                            <Button3D
                              variant="ghost"
                              size="sm"
                              disabled
                              className="text-xs px-4 py-2 bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                              title={`Kurang ${missingGems} Gems lagi`}
                            >
                              Kurang {missingGems} 💎 Lagi 🔒
                            </Button3D>
                          )}
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
    </div>
  )
}
