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
  GameSidebarRail,
  CourseSwitcherModal,
  TokyoLeaderboardModal,
} from '../components/game'
import {
  CURRICULUM_TRACKS_MAP,
} from '../data/curriculumData'
import {
  MagnifyingGlass,
  Sparkle,
  Trophy,
  ShieldCheck,
  Flask,
  FileText,
  Microphone,
  Lightning,
  Clock,
  X,
  Medal,
  CheckCircle,
  Gift,
} from '@phosphor-icons/react'

export type QuestPageTab = 'all' | 'daily' | 'main' | 'side' | 'shop'

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

  // Active filter tab
  const [activeTab, setActiveTab] = useState<QuestPageTab>('all')
  const [searchQuery, setSearchQuery] = useState('')

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

  // Handle claim daily quest reward
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

  // Daily quests list (from API or canonical fallback, cleanly checked against SSOT)
  const canonicalDailyList = useMemo(() => {
    if (dailyQuests && dailyQuests.length > 0) {
      return dailyQuests.map((q) => {
        const isDone =
          q.user_status === 'completed' ||
          completedQuestsSet.has(q.id) ||
          !!claimedDailyMap[q.id]

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
        }
      })
    }

    return [
      {
        id: 'daily-gin-handler',
        title: 'Tuntaskan 1 Bab Koding Gin REST API',
        chip_label: 'GIN REST API',
        difficulty: 'Pemula',
        xp_reward: 50,
        gem_reward: 10,
        estimated_minutes: 15,
        isCompleted:
          completedQuestsSet.has('daily-gin-handler') ||
          completedQuestsSet.has('part-4-routing-dan-jwt-middleware') ||
          !!claimedDailyMap['daily-gin-handler'],
        route: '/learn/part-4-routing-dan-jwt-middleware',
      },
      {
        id: 'daily-nihongo-standup',
        title: 'Pelajari 5 Kosakata Business IT Nihongo N3',
        chip_label: 'JLPT N3',
        difficulty: 'Mudah',
        xp_reward: 30,
        gem_reward: 5,
        estimated_minutes: 5,
        isCompleted:
          completedQuestsSet.has('daily-nihongo-standup') ||
          completedQuestsSet.has('part-3-aisatsu-onboarding-tokyo') ||
          !!claimedDailyMap['daily-nihongo-standup'],
        route: '/learn/part-3-aisatsu-onboarding-tokyo',
      },
      {
        id: 'daily-pointer-quiz',
        title: 'Selesaikan Kuis Syntax Pointer & Struct Go',
        chip_label: 'KUIS CEPAT',
        difficulty: 'Mudah',
        xp_reward: 40,
        gem_reward: 10,
        estimated_minutes: 5,
        isCompleted:
          completedQuestsSet.has('daily-pointer-quiz') ||
          completedQuestsSet.has('part-2-pointer-dan-struktur-data') ||
          !!claimedDailyMap['daily-pointer-quiz'],
        route: '/learn/part-2-pointer-dan-struktur-data',
      },
    ]
  }, [dailyQuests, completedQuestsSet, claimedDailyMap])

  // Filter daily quests based on search query
  const filteredDaily = useMemo(() => {
    if (!searchQuery.trim()) return canonicalDailyList
    const q = searchQuery.toLowerCase()
    return canonicalDailyList.filter(
      (item) => item.title.toLowerCase().includes(q) || item.chip_label.toLowerCase().includes(q)
    )
  }, [canonicalDailyList, searchQuery])

  // Dynamic active main curriculum unit & parts for active track
  const currentTrackUnits = useMemo(() => {
    return (
      CURRICULUM_TRACKS_MAP[activeTrack] ||
      (activeTrack === 'backend' && CURRICULUM_TRACKS_MAP['golang']) ||
      (activeTrack === 'react' && CURRICULUM_TRACKS_MAP['frontend']) ||
      (activeTrack === 'devops_aws' && CURRICULUM_TRACKS_MAP['devops']) ||
      CURRICULUM_TRACKS_MAP['golang']
    )
  }, [activeTrack])

  // Total parts in active track (e.g. 12 parts)
  const allTrackParts = useMemo(() => {
    return currentTrackUnits.flatMap((u) =>
      u.parts.map((p, idx) => ({
        id: p.id,
        unitTitle: u.title,
        unitTag: u.tag,
        unitNumber: u.unitNumber,
        partNumber: idx + 1,
        globalPartNumber: p.globalPartNumber || idx + 1,
        title: p.title,
        subtitle: p.subtitle,
        chip_label: p.chipLabel,
        difficulty: p.difficulty,
        xp_reward: p.xpReward,
        gem_reward: 20,
        route: p.route,
        isCompleted: completedQuestsSet.has(p.id),
      }))
    )
  }, [currentTrackUnits, completedQuestsSet])

  // Main quests display list:
  // If in 'all' tab -> show top 4 upcoming
  // If in 'main' tab -> show ALL parts in track
  const dynamicMainQuests = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return allTrackParts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.chip_label.toLowerCase().includes(q) ||
          p.unitTag.toLowerCase().includes(q)
      )
    }

    if (activeTab === 'all') {
      return allTrackParts.slice(0, 4)
    }

    return allTrackParts
  }, [allTrackParts, searchQuery, activeTab])

  // Tokyo Boss & Portfolio Challenges (Hooked directly to valid curriculum parts)
  const portfolioChallenges = useMemo(() => {
    const challenges = [
      {
        id: 'boss-worker-pool',
        title: 'High-Concurrency Worker Pool Engine (Mercari Tokyo Spec)',
        subtitle: 'Bangun pipeline pemrosesan concurrent beban tinggi dengan Goroutines, Channels, context timeout, dan graceful shutdown anti-memory leak.',
        tags: ['GOLANG', 'HIGH CONCURRENCY', 'MERCARI SPEC'],
        difficulty: 'Sulit',
        xp_reward: 250,
        gem_reward: 50,
        sponsorTag: 'KURASI VISA TOKYO 🇯🇵',
        route: '/learn/part-7-worker-pool-concurrency',
        isCompleted: completedQuestsSet.has('part-7-worker-pool-concurrency'),
      },
      {
        id: 'capstone-clean-arch',
        title: 'Fullstack Microservices Clean Architecture Capstone',
        subtitle: 'Implementasi end-to-end RESTful API dengan unit test coverage >80%, OpenAPI documentation, dan Docker image scratch minimalis untuk portofolio rekrutmen Jepang.',
        tags: ['MICROSERVICES', 'CLEAN ARCH', 'DOCKER', 'OPENAPI'],
        difficulty: 'Sulit',
        xp_reward: 500,
        gem_reward: 100,
        sponsorTag: 'SPONSOR VISA PRIORITAS 🌟',
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

  // Counts for top bar (Pure SSOT, 0 fake fallbacks)
  const totalCount =
    hookTotalCount > 0
      ? hookTotalCount
      : allTrackParts.length + canonicalDailyList.length + portfolioChallenges.length
  const completedCount =
    typeof hookCompletedCount === 'number' && hookCompletedCount > 0
      ? hookCompletedCount
      : totalCompletedCount
  const progressPercent = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0

  // Daily quest completion count
  const dailyDoneCount = canonicalDailyList.filter((d) => d.isCompleted).length
  const totalDailyTarget = Math.max(3, canonicalDailyList.length)

  // Determine if search has no results
  const hasNoResults =
    searchQuery.trim().length > 0 &&
    filteredDaily.length === 0 &&
    dynamicMainQuests.length === 0 &&
    portfolioChallenges.length === 0

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. LEFT NAV RAIL (SSOT) ── */}
      <NavRail />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8 xl:pb-0">
        {/* ══════ CENTER CONTENT STAGE ══════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 pb-12 space-y-6">
          {/* ── 1. CLEAN CONTEXTUAL TOP BAR (SSOT - GameTopBar) ── */}
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

          {/* ── 2. DUOLINGO MONTHLY CHALLENGE HERO CARD (MACRO HABIT HOOK) ── */}
          <div className="bg-white border-2 border-slate-200/90 border-b-[5px] border-b-slate-300 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* 3D Tactile Golden Badge Container */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-sm border-2 border-white ring-4 ring-amber-300/40 shrink-0">
                  <Medal weight="fill" className="w-8 h-8 sm:w-9 sm:h-9 text-amber-950 drop-shadow-sm" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-amber-100 text-amber-900 font-brand font-black text-[10px] px-2.5 py-0.5 rounded-full border border-amber-300 uppercase tracking-wider">
                      Tantangan Bulanan Tokyo
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      • Sisa {daysLeftInMonth} Hari
                    </span>
                  </div>
                  <h1 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                    Lencana Emas Roppongi (Tokyo Quest)
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Selesaikan 25 misi dan tantangan koding bulan ini untuk membuka lencana emas permanen di profil portofolio Anda.
                  </p>
                </div>
              </div>

              {/* Reward Chest Preview */}
              <div className="bg-amber-50/70 border-2 border-amber-200/90 rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                <Gift weight="fill" className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider block">
                    Hadiah Lencana
                  </span>
                  <span className="text-xs font-black text-amber-700">
                    +100 💎 &amp; Badge VIP
                  </span>
                </div>
              </div>
            </div>

            {/* Thick Tactile Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-brand font-black">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                  <span>Progres Tantangan: {monthlyCompletedCount} / {monthlyTargetCount} Misi</span>
                </span>
                <span className="text-amber-700 font-bold">
                  {monthlyCompletedCount >= monthlyTargetCount
                    ? '🎉 Lencana Terbuka!'
                    : `${monthlyTargetCount - monthlyCompletedCount} misi lagi`}
                </span>
              </div>
              <div className="h-3.5 bg-slate-100 rounded-full border border-slate-200/90 p-0.5 shadow-inner overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#D97706]"
                  style={{ width: `${monthlyProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── 3. FILTER TABS & SEARCH ROW ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* 3D Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                {
                  id: 'all' as QuestPageTab,
                  label: `Semua Misi 📜 (${filteredDaily.length + dynamicMainQuests.length + portfolioChallenges.length})`,
                },
                {
                  id: 'daily' as QuestPageTab,
                  label: `Misi Harian ⚡ (${filteredDaily.length})`,
                },
                {
                  id: 'main' as QuestPageTab,
                  label: `Misi Karier 🚀 (${allTrackParts.length})`,
                },
                {
                  id: 'side' as QuestPageTab,
                  label: `Sayembara Boss 💼 (${portfolioChallenges.length})`,
                },
                {
                  id: 'shop' as QuestPageTab,
                  label: `Toko Gems 💎`,
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
            <div className="flex items-center gap-2.5 shrink-0">
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
                Kata kunci &ldquo;{searchQuery}&rdquo; tidak cocok dengan misi harian, misi karier, atau sayembara boss.
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

          {/* ══════ SECTION 1: DAILY QUESTS (3 TARGET HARIAN BERPROGRES) ══════ */}
          {(activeTab === 'all' || activeTab === 'daily') && filteredDaily.length > 0 && (
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border-2 border-amber-200 text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
                    <Lightning weight="fill" className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-[#0F172A]">
                        Misi Harian ({dailyDoneCount}/{totalDailyTarget} Selesai)
                      </h3>
                      {hookLoading && (
                        <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      Selesaikan 3 misi harian untuk membuka peti bonus &amp; menjaga rentetan belajar.
                    </p>
                  </div>
                </div>

                <span className="bg-[#FFFBEB] text-[#B45309] text-xs font-black px-3 py-1.5 rounded-2xl border-2 border-amber-200 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto">
                  <Clock weight="bold" className="w-3.5 h-3.5" />
                  <span>Reset dalam: {timeLeft}</span>
                </span>
              </div>

              {/* Daily Quests Chunky Cards Feed */}
              <div className="space-y-3 pt-1">
                {filteredDaily.map((questItem, idx) => {
                  const isClaimed = !!claimedDailyMap[questItem.id]
                  const isDone = questItem.isCompleted || isClaimed

                  return (
                    <div
                      key={questItem.id}
                      className={`border-2 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 shadow-2xs ${
                        isClaimed
                          ? 'bg-slate-50/70 border-slate-200/80 border-b-[3px] border-b-slate-200 opacity-80'
                          : isDone
                          ? 'bg-amber-50/40 border-2 border-amber-300 border-b-[4px] border-b-amber-400 shadow-xs'
                          : 'bg-white border-2 border-slate-200/90 border-b-[4px] border-b-slate-300 hover:border-b-[5px] hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Left: Icon & Info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-2xs ${
                            isClaimed
                              ? 'bg-slate-100 border-slate-300 text-slate-400'
                              : isDone
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-blue-50 border-blue-200 text-[#2563EB]'
                          }`}
                        >
                          {isClaimed ? (
                            <CheckCircle weight="fill" className="w-6 h-6 text-emerald-600" />
                          ) : (
                            `0${idx + 1}`
                          )}
                        </div>

                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-black text-[10px] px-2 py-0.5 rounded-lg border uppercase tracking-wider ${
                                isDone
                                  ? 'bg-amber-100 border-amber-200 text-amber-900'
                                  : 'bg-blue-50 border-blue-200 text-[#1D4ED8]'
                              }`}
                            >
                              {questItem.chip_label}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              • Estimasi {questItem.estimated_minutes} Menit
                            </span>
                            {isClaimed && (
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                HADIAH DITERIMA ✓
                              </span>
                            )}
                          </div>

                          <h4 className="font-black text-sm text-[#0F172A] truncate">
                            {questItem.title}
                          </h4>

                          {/* Progress Line */}
                          <div className="flex items-center gap-3">
                            <div className="w-24 sm:w-36 h-2 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isDone ? 'bg-emerald-500' : 'bg-blue-500'
                                }`}
                                style={{ width: isDone ? '100%' : '0%' }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-slate-500 font-mono">
                              {isDone ? '1/1 Selesai' : '0/1 Selesai'}
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
                            className="text-xs px-4 py-2"
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
                            MULAI MISI ▶
                          </Button3D>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ══════ SECTION 2: CAREER PATH CHECKPOINTS (MISI KARIER) ══════ */}
          {(activeTab === 'all' || activeTab === 'main') && dynamicMainQuests.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚀</span>
                    <h3 className="font-black text-base text-[#0F172A]">
                      Misi Jalur Karier ({activeTrack.toUpperCase()})
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Selesaikan checkpoint keahlian industri untuk memenuhi verifikasi Visa Software Engineer Tokyo.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {activeTab === 'all' && allTrackParts.length > 4 && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap')
                        setActiveTab('main')
                      }}
                      className="text-xs font-black text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Buka Semua {allTrackParts.length} Modul Karier ➔
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsCourseSwitcherOpen(true)}
                    className="text-xs font-black text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer shadow-2xs"
                  >
                    Ganti Track ➔
                  </button>
                </div>
              </div>

              {/* Responsive 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicMainQuests.map((quest) => {
                  return (
                    <div
                      key={quest.id}
                      className={`bg-white border-2 rounded-3xl p-5 flex flex-col justify-between space-y-4 transition-all duration-200 shadow-2xs relative overflow-hidden ${
                        quest.isCompleted
                          ? 'border-emerald-300 border-b-[5px] border-b-emerald-600 bg-emerald-50/15'
                          : 'border-slate-200/90 border-b-[5px] border-b-slate-300 hover:border-b-[6px] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5 uppercase tracking-wider">
                            <span>CHECKPOINT #{quest.globalPartNumber}</span>
                            <span>•</span>
                            <span className="truncate max-w-[130px]">{quest.unitTag}</span>
                          </span>

                          {quest.isCompleted ? (
                            <span className="bg-emerald-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                              LULUS ✓
                            </span>
                          ) : (
                            <span className="bg-blue-50 text-blue-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-blue-200">
                              TERSEDIA
                            </span>
                          )}
                        </div>

                        <h4 className="font-black text-base text-[#0F172A] tracking-tight">
                          {quest.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {quest.subtitle}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                          <span className="text-[#059669] font-black">
                            ⚡ +{quest.xp_reward} XP • 💎 +{quest.gem_reward} Gems
                          </span>
                          <span className="text-slate-400 font-semibold">{quest.chip_label}</span>
                        </div>

                        <Button3D
                          variant={quest.isCompleted ? 'ghost' : 'emerald'}
                          size="md"
                          fullWidth
                          onClick={() => navigate(quest.route)}
                          className={`text-xs py-2.5 ${
                            quest.isCompleted
                              ? 'border-2 border-emerald-300 text-emerald-700 bg-emerald-50'
                              : ''
                          }`}
                        >
                          {quest.isCompleted ? 'ULANGI LATIHAN 💻' : 'BUKA WORKSPACE KODING 💻'}
                        </Button3D>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ══════ SECTION 3: TOKYO BOSS CHALLENGES ══════ */}
          {(activeTab === 'all' || activeTab === 'side') && portfolioChallenges.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Trophy weight="fill" className="w-5 h-5 text-amber-500" />
                  <h3 className="font-black text-base text-[#0F172A]">
                    Tantangan Portofolio &amp; Boss Quest (Standar Visa Tokyo)
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Proyek skala industri tingkat tinggi dengan standar kurasi perusahaan Jepang (Mercari &amp; Rakuten Spec).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-white border-2 border-purple-300 border-b-[5px] border-b-purple-500 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs flex flex-col justify-between hover:border-b-[6px] hover:-translate-y-0.5 transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-purple-100 text-purple-900 font-black text-[11px] px-2.5 py-1 rounded-xl border border-purple-200 flex items-center gap-1.5">
                          <Trophy weight="fill" className="w-3.5 h-3.5 text-purple-600" />
                          <span>{challenge.sponsorTag}</span>
                        </span>

                        {challenge.isCompleted ? (
                          <span className="bg-emerald-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                            LULUS ✓
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-600 font-mono font-black text-[10px] px-2 py-0.5 rounded border border-red-200 uppercase">
                            SULIT
                          </span>
                        )}
                      </div>

                      <h4 className="font-black text-base text-[#0F172A] tracking-tight">
                        {challenge.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {challenge.subtitle}
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {challenge.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-100 text-slate-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md border border-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-purple-100">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span className="text-purple-700 font-black">
                          ⚡ +{challenge.xp_reward} XP • 💎 +{challenge.gem_reward} Gems
                        </span>
                        <span className="text-purple-600 font-bold">Tokyo Portofolio</span>
                      </div>

                      <Button3D
                        variant="blue"
                        size="md"
                        fullWidth
                        onClick={() => navigate(challenge.route)}
                        className="text-xs py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600"
                      >
                        <span>BUKA BRIEFING SPESIFIKASI ➔</span>
                      </Button3D>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════ SECTION 4: AKIHABARA GEMS ARCADE (SHOP) ══════ */}
          {(activeTab === 'all' || activeTab === 'shop') && (
            <div className="bg-gradient-to-b from-blue-50/60 via-white to-white border-2 border-blue-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md border-b-[4px] border-blue-800">
                    💎
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-lg text-[#0F172A] tracking-tight">
                        Toko Penukaran Gems Tokyo (Akihabara Arcade)
                      </h3>
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-200">
                        TERBUKA
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Tukarkan gems hasil sayembara koding dengan booster XP, pelindung streak, dan review portofolio diaspora.
                    </p>
                  </div>
                </div>

                <div className="bg-white border-2 border-blue-200 rounded-2xl px-4 py-2 flex items-center gap-2.5 shadow-2xs shrink-0 self-start sm:self-center">
                  <span className="text-lg">💎</span>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                      Saldo Anda
                    </span>
                    <span className="text-sm font-black text-blue-700">
                      {userGems} Gems
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Duolingo 3D Tactile Shop Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                {SHOP_ITEMS.map((item) => {
                  const ItemIcon = item.icon
                  const ownedCount = inventory[item.id] || 0
                  const isAffordable = userGems >= item.price

                  return (
                    <div
                      key={item.id}
                      className="bg-white border-2 border-slate-200/90 border-b-[4px] border-b-slate-300 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all hover:border-b-[5px] hover:-translate-y-0.5 shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-9 h-9 rounded-xl border-2 ${item.iconBg} flex items-center justify-center ${item.iconColor} shadow-2xs`}
                          >
                            <ItemIcon weight="bold" className="w-5 h-5" />
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-xs sm:text-sm text-[#0F172A]">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-400 text-[10px]">
                            {ownedCount > 0 ? `Dimiliki: ${ownedCount}x` : 'Belum Ada'}
                          </span>
                          <span className="font-black text-blue-700">
                            💎 {item.price} Gems
                          </span>
                        </div>

                        <Button3D
                          variant={isAffordable ? 'blue' : 'ghost'}
                          size="sm"
                          fullWidth
                          onClick={() => handlePurchaseShopItem(item)}
                          className={`text-xs py-2 ${
                            !isAffordable ? 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-500' : ''
                          }`}
                        >
                          {isAffordable ? `Tukar ${item.price} 💎` : 'Gems Kurang'}
                        </Button3D>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (SSOT - Subtask 39.1) ══════ */}
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

      {/* ── 4. TOKYO LEADERBOARD MODAL ── */}
      <TokyoLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  )
}
