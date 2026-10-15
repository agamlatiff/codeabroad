import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { useRoadmap } from '../hooks/useRoadmap'
import { authService } from '../services/authService'
import type { UserActivitySummary } from '../types/auth'
import { Button3D } from '../components/ui/Button3D'
import { triggerHaptic } from '../utils/haptics'
import { audioEngine } from '../utils/audio'
import {
  CourseSwitcherModal,
  CAREER_TRACKS,
  TechNihongoCard,
} from '../components/game'
import {
  GolangLogo,
  ReactLogo,
  DockerLogo,
  FundamentalLogo,
  TechNihongoLogo,
} from '../components/ui/BrandLogos'
import {
  MagnifyingGlass,
  CalendarBlank,
  LockSimple,
  CaretDown,
  Sparkle,
  Fire,
  Star,
  Lightning,
  CheckCircle,
  Clock,
  Target,
  Gift,
  Translate,
  Code,
  ArrowSquareOut,
  CheckFat,
  Play,
  BookOpen,
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
} from '@phosphor-icons/react'
import doodleCoding from '../assets/kodi/doodle-coding.png'
import doodleThinking from '../assets/kodi/doodle-thinking.png'

// Standard Flat Sequential Curriculum Unit Definition (Clean Technical Only)
export interface SequentialPartItem {
  id: string
  globalPartNumber: number
  title: string
  subtitle: string
  chipLabel: string
  category: 'code' | 'nihongo' | 'capstone'
  difficulty: 'Pemula' | 'Menengah' | 'Sulit'
  estimatedMinutes: number
  xpReward: number
  route: string
}

export interface SequentialCurriculumUnit {
  id: string
  unitNumber: number
  tag: string
  title: string
  description: string
  totalXp: number
  parts: SequentialPartItem[]
}

// Canonical Real Technical Curriculum for Go Backend Engineer
const GOLANG_CURRICULUM_UNITS: SequentialCurriculumUnit[] = [
  {
    id: 'unit-1-fondasi-go',
    unitNumber: 1,
    tag: 'SINTAKS DASAR & MEMORI POINTER',
    title: 'Unit 1: Fondasi Sintaks Go & Memory Pointer',
    description: 'Arsitektur runtime Go, alokasi memori stack vs heap, manipulasi pointer dan etika code review tim engineering.',
    totalXp: 150,
    parts: [
      {
        id: 'part-1-variabel-dan-tipe-data',
        globalPartNumber: 1,
        title: 'Variabel, Strict Typing & Memori Stack',
        subtitle: 'Deklarasi variabel, primitive types, dan alokasi stack CPU',
        chipLabel: 'GO 01',
        category: 'code',
        difficulty: 'Pemula',
        estimatedMinutes: 10,
        xpReward: 50,
        route: '/learn/part-1-variabel-dan-tipe-data',
      },
      {
        id: 'part-2-pointer-dan-struktur-data',
        globalPartNumber: 2,
        title: 'Pointer, Dereferencing & Struct Memory',
        subtitle: 'Address memory & dan *pointer mutation tanpa copy payload',
        chipLabel: 'GO 02',
        category: 'code',
        difficulty: 'Pemula',
        estimatedMinutes: 12,
        xpReward: 50,
        route: '/learn/part-2-pointer-dan-struktur-data',
      },
      {
        id: 'part-3-aisatsu-onboarding-tokyo',
        globalPartNumber: 3,
        title: 'Aisatsu & Etika Code Review Tim Engineering',
        subtitle: 'Salam pagi standup, perkenalan diri & budaya Pull Request tim engineering',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Pemula',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/part-3-aisatsu-onboarding-tokyo',
      },
    ],
  },
  {
    id: 'unit-2-gin-rest-api',
    unitNumber: 2,
    tag: 'REST API & CLEAN ARCHITECTURE',
    title: 'Unit 2: Gin REST API & Middleware Engine',
    description: 'Membangun RESTful API enterprise dengan Gin framework, middleware auth guard JWT, DTO validation, dan Clean Architecture.',
    totalXp: 150,
    parts: [
      {
        id: 'part-4-routing-dan-jwt-middleware',
        globalPartNumber: 4,
        title: 'Gin Radix Router & JSON Response Envelope',
        subtitle: 'Setup router engine, parameter binding, dan standard response envelope',
        chipLabel: 'GIN 01',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/part-4-routing-dan-jwt-middleware',
      },
      {
        id: 'part-5-jwt-auth-middleware-guard',
        globalPartNumber: 5,
        title: 'JWT Auth Middleware & Context Injection',
        subtitle: 'Header parsing, token verification, dan user context injection',
        chipLabel: 'GIN 02',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/part-5-jwt-auth-middleware-guard',
      },
      {
        id: 'part-6-database-connection-pool',
        globalPartNumber: 6,
        title: 'Database Connection Pool Pgx & GORM',
        subtitle: 'Manajemen koneksi PostgreSQL, transaksi atomik ACID dan migrasi schema',
        chipLabel: 'GIN 03',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 20,
        xpReward: 50,
        route: '/learn/part-6-database-connection-pool',
      },
    ],
  },
  {
    id: 'unit-3-concurrency-channels',
    unitNumber: 3,
    tag: 'HIGH CONCURRENCY & WORKER POOL',
    title: 'Unit 3: Concurrency Engine & Worker Pool',
    description: 'Kuasai goroutines, buffered channels, select statement, dan worker pool pattern untuk pemrosesan paralel anti-race condition.',
    totalXp: 175,
    parts: [
      {
        id: 'part-7-goroutines-dan-channels',
        globalPartNumber: 7,
        title: 'Goroutines, Buffered Channels & WaitGroup',
        subtitle: 'Asynchronous task execution tanpa resource exhaustion thread OS',
        chipLabel: 'CONC 01',
        category: 'code',
        difficulty: 'Sulit',
        estimatedMinutes: 20,
        xpReward: 75,
        route: '/learn/part-7-goroutines-dan-channels',
      },
      {
        id: 'part-8-high-concurrency-worker-pool',
        globalPartNumber: 8,
        title: 'High-Concurrency Worker Pool Engine',
        subtitle: 'Pola worker pool distribusi beban komputasi server backend performa tinggi',
        chipLabel: 'CONC 02',
        category: 'code',
        difficulty: 'Sulit',
        estimatedMinutes: 25,
        xpReward: 100,
        route: '/learn/part-8-high-concurrency-worker-pool',
      },
    ],
  },
  {
    id: 'unit-4-docker-microservices',
    unitNumber: 4,
    tag: 'CONTAINER & CLOUD DEPLOYMENT',
    title: 'Unit 4: Microservices & Cloud Deployment',
    description: 'Packaging container Docker multi-stage, scratch image, API gateway, dan pengujian end-to-end siap produksi.',
    totalXp: 300,
    parts: [
      {
        id: 'part-9-docker-multistage-build',
        globalPartNumber: 9,
        title: 'Docker Multi-Stage Build & Scratch Image',
        subtitle: 'Optimasi image container Go dari 800MB menjadi 15MB untuk lingkungan produksi',
        chipLabel: 'CLOUD 01',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 20,
        xpReward: 100,
        route: '/learn/part-9-docker-multistage-build',
      },
      {
        id: 'part-10-tokyo-capstone-portfolio',
        globalPartNumber: 10,
        title: 'Final Capstone: Repositori API Siap Produksi',
        subtitle: 'Implementasi lengkap Clean Architecture dengan unit test dan dokumentasi OpenAPI',
        chipLabel: 'CAPSTONE',
        category: 'capstone',
        difficulty: 'Sulit',
        estimatedMinutes: 30,
        xpReward: 200,
        route: '/learn/part-10-tokyo-capstone-portfolio',
      },
    ],
  },
]

// Duolingo 3D Tactile Unit Visual Theme Configurations
interface UnitTheme {
  gradientBg: string
  border3D: string
  tagBg: string
  tagText: string
  accentGlow: string
  btnGuideBg: string
}

const UNIT_THEMES: Record<number, UnitTheme> = {
  1: {
    gradientBg: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700',
    border3D: 'border-b-[5px] border-blue-900',
    tagBg: 'bg-blue-500/30 border border-blue-300/30 text-white',
    tagText: 'text-white',
    accentGlow: 'ring-blue-500/15',
    btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
  },
  2: {
    gradientBg: 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700',
    border3D: 'border-b-[5px] border-emerald-900',
    tagBg: 'bg-emerald-500/30 border border-emerald-300/30 text-white',
    tagText: 'text-white',
    accentGlow: 'ring-emerald-500/15',
    btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
  },
  3: {
    gradientBg: 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700',
    border3D: 'border-b-[5px] border-purple-900',
    tagBg: 'bg-purple-500/30 border border-purple-300/30 text-white',
    tagText: 'text-white',
    accentGlow: 'ring-purple-500/15',
    btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
  },
  4: {
    gradientBg: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700',
    border3D: 'border-b-[5px] border-amber-900',
    tagBg: 'bg-amber-500/30 border border-amber-300/30 text-white',
    tagText: 'text-white',
    accentGlow: 'ring-amber-500/15',
    btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
  },
}

export const RoadmapPage = () => {
  const navigate = useNavigate()
  const { track: routeTrack } = useParams<{ track?: string }>()
  const { user, updateUser } = useAuthStore()

  // Track state management
  const [activeTrack, setActiveTrack] = useState(() => {
    return routeTrack || user?.primary_stack || user?.career_path?.slug || 'golang'
  })
  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)

  // Filter Tabs: 'all' | 'active' | 'completed' | 'nihongo'
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'active' | 'completed' | 'nihongo'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 7-day activity summary and daily rewards status
  const [activitySummary, setActivitySummary] = useState<UserActivitySummary | null>(null)
  const [isChestModalOpen, setIsChestModalOpen] = useState(false)

  // Local storage keys for daily rewards & completions
  const todayDateStr = new Date().toISOString().split('T')[0]
  const chestStorageKey = `codeabroad_daily_chest_claimed_${todayDateStr}`
  const claimedVocabQuestKey = `codeabroad_vocab_quest_claimed_${todayDateStr}`
  const reviewedNihongoKey = `codeabroad_nihongo_reviewed_${todayDateStr}`

  const [isChestClaimedToday, setIsChestClaimedToday] = useState(() => {
    try {
      return localStorage.getItem(chestStorageKey) === 'true'
    } catch {
      return false
    }
  })
  const [reviewedNihongoToday, setReviewedNihongoToday] = useState(() => {
    try {
      return localStorage.getItem(reviewedNihongoKey) === 'true'
    } catch {
      return false
    }
  })
  const [claimedLocalQuest, setClaimedLocalQuest] = useState(() => {
    try {
      return localStorage.getItem(claimedVocabQuestKey) === 'true'
    } catch {
      return false
    }
  })
  const [isMuted, setIsMuted] = useState(() => audioEngine.isMuted())

  useEffect(() => {
    const handleSoundToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>
      setIsMuted(customEvent.detail.muted)
    }
    window.addEventListener('codeabroad_sound_toggle', handleSoundToggle)
    return () => window.removeEventListener('codeabroad_sound_toggle', handleSoundToggle)
  }, [])

  const handleToggleSound = () => {
    triggerHaptic('tap')
    const nextMuted = audioEngine.toggleMute()
    setIsMuted(nextMuted)
    if (!nextMuted) {
      audioEngine.playPop()
    }
  }

  // Completed quests persistence set
  const [completedQuestsSet, setCompletedQuestsSet] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('codeabroad_completed_quests')
      return stored ? new Set(JSON.parse(stored)) : new Set(['part-1-variabel-dan-tipe-data'])
    } catch {
      return new Set(['part-1-variabel-dan-tipe-data'])
    }
  })

  // Sync track when route parameter changes
  useEffect(() => {
    if (routeTrack && routeTrack !== activeTrack) {
      setActiveTrack(routeTrack)
    }
  }, [routeTrack, activeTrack])

  const { roadmap, isLoading } = useRoadmap(activeTrack)

  // Fetch real 7-day activity logs & daily rewards status from backend
  useEffect(() => {
    let isMounted = true
    authService
      .getActivityLogs()
      .then((data) => {
        if (isMounted) setActivitySummary(data)
      })
      .catch((err) => {
        console.warn('Using offline activity log fallback in Roadmap:', err)
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
        console.warn('Using offline daily rewards status fallback in Roadmap:', err)
      })

    return () => {
      isMounted = false
    }
  }, [claimedVocabQuestKey, chestStorageKey])

  // Listen for quest completion events
  useEffect(() => {
    const handleQuestCompleted = () => {
      try {
        const stored = localStorage.getItem('codeabroad_completed_quests')
        if (stored) {
          setCompletedQuestsSet(new Set(JSON.parse(stored)))
        }
      } catch (e) {
        console.error('Failed to sync completed quests in Roadmap:', e)
      }
    }
    window.addEventListener('codeabroad_quest_completed', handleQuestCompleted)
    return () => {
      window.removeEventListener('codeabroad_quest_completed', handleQuestCompleted)
    }
  }, [])

  // Active track configuration from CAREER_TRACKS
  const currentTrackConfig = useMemo(() => {
    return (
      CAREER_TRACKS.find(
        (t) =>
          t.slug === activeTrack ||
          (activeTrack === 'backend' && t.slug === 'golang') ||
          (activeTrack === 'devops_aws' && t.slug === 'devops') ||
          (activeTrack === 'react' && t.slug === 'frontend')
      ) || CAREER_TRACKS[1]
    )
  }, [activeTrack])

  // Flat Sequential Units (Pure Technical)
  const units: SequentialCurriculumUnit[] = useMemo(() => {
    return GOLANG_CURRICULUM_UNITS
  }, [])

  // Compute metrics across all parts
  const allParts = useMemo(() => units.flatMap((u) => u.parts), [units])
  const totalPartsCount = allParts.length
  const completedPartsCount = allParts.filter((p) => completedQuestsSet.has(p.id)).length
  const curriculumProgressPercent = Math.min(
    100,
    Math.round((completedPartsCount / totalPartsCount) * 100)
  )
  const totalCurriculumXp = units.reduce((sum, u) => sum + u.totalXp, 0)
  const totalEstimatedMinutes = allParts.reduce((sum, p) => sum + p.estimatedMinutes, 0)
  const totalHours = (totalEstimatedMinutes / 60).toFixed(1)

  // First active part (next unlocked part)
  const nextActivePart = useMemo(() => {
    return allParts.find((p) => !completedQuestsSet.has(p.id)) || allParts[0]
  }, [allParts, completedQuestsSet])

  // Filter parts based on search and active tab
  const filteredUnits = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()

    return units
      .map((unit) => {
        const matchingParts = unit.parts.filter((part) => {
          const isCompleted = completedQuestsSet.has(part.id)
          const isNextActive = part.id === nextActivePart?.id

          // Tab filter
          if (activeFilterTab === 'completed' && !isCompleted) return false
          if (activeFilterTab === 'active' && !isNextActive && isCompleted) return false
          if (activeFilterTab === 'nihongo' && part.category !== 'nihongo') return false

          // Search query filter
          if (q) {
            const matchTitle = part.title.toLowerCase().includes(q)
            const matchSubtitle = part.subtitle.toLowerCase().includes(q)
            const matchChip = part.chipLabel.toLowerCase().includes(q)
            const matchUnit = unit.title.toLowerCase().includes(q)
            return matchTitle || matchSubtitle || matchChip || matchUnit
          }
          return true
        })

        return {
          ...unit,
          filteredParts: matchingParts,
        }
      })
      .filter((u) => u.filteredParts.length > 0)
  }, [units, searchQuery, activeFilterTab, completedQuestsSet, nextActivePart])

  // User Stats (Clean SSOT)
  const userXp = user?.xp ? user.xp.toLocaleString() : '0'
  const userStreak = user?.streak || 1
  const userLevel = user?.current_level || 1

  // Handle track switch from CourseSwitcherModal
  const handleSelectTrack = (trackSlug: string) => {
    triggerHaptic('success')
    setActiveTrack(trackSlug)
    setIsCourseSwitcherOpen(false)
    navigate(`/roadmap/${trackSlug}`)
  }

  // Daily XP Goal Calculations
  const isPart1Done = completedQuestsSet.has('part-1-variabel-dan-tipe-data')
  const isPart2Done = completedQuestsSet.has('part-2-pointer-dan-struktur-data')
  const baseEarnedXp = (isPart1Done ? 50 : 0) + (isPart2Done ? 50 : 0) + (claimedLocalQuest ? 30 : 0)
  const todayEarnedXp = Math.min(50, baseEarnedXp)
  const dailyTargetXp = 50
  const dailyProgressPercent = Math.min(100, Math.round((todayEarnedXp / dailyTargetXp) * 100))
  const remainingXp = Math.max(0, dailyTargetXp - todayEarnedXp)
  const isChestUnlocked = todayEarnedXp >= dailyTargetXp

  const handleVocabReview = () => {
    triggerHaptic('success')
    setReviewedNihongoToday(true)
    localStorage.setItem(reviewedNihongoKey, 'true')
  }

  const handleClaimVocabQuest = async () => {
    triggerHaptic('success')
    setClaimedLocalQuest(true)
    localStorage.setItem(claimedVocabQuestKey, 'true')
    try {
      await authService.claimDailyReward('vocab_quest')
      updateUser({})
    } catch {
      // Gracefully continue with local state
    }
  }

  const handleClaimGoldenChest = async () => {
    triggerHaptic('streakIgnite')
    setIsChestClaimedToday(true)
    localStorage.setItem(chestStorageKey, 'true')
    try {
      await authService.claimDailyReward('golden_chest')
      updateUser({})
    } catch {
      // Gracefully continue with local state
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. LEFT NAV RAIL (SSOT) ── */}
      <NavRail />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8">
        {/* ══════ CENTER CONTENT STAGE ══════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 space-y-6">
          {/* ── 1. CLEAN CONTEXTUAL TOP BAR (TRACK SELECTOR & HUD) ── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Track Switcher & Linear Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
              {/* Clickable Track Switcher Pill */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setIsCourseSwitcherOpen(true)
                }}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-white border-2 border-slate-200/90 hover:border-blue-400 rounded-2xl shadow-2xs text-xs font-brand font-black text-slate-800 transition-all cursor-pointer group shrink-0"
                title="Peminatan kurikulum saat ini. Klik untuk berganti jalur spesialisasi."
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
                    style={{ width: `${curriculumProgressPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-brand font-black text-slate-700 whitespace-nowrap">
                  {completedPartsCount}/{totalPartsCount} Part ({curriculumProgressPercent}%)
                </span>
              </div>
            </div>

            {/* Right: Search & Game Stats HUD */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Input */}
              <div className="relative w-full sm:w-60">
                <MagnifyingGlass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari modul, topik, sintaks..."
                  className="w-full bg-white text-xs font-semibold pl-9 pr-4 py-2 rounded-2xl border-2 border-slate-200/90 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                />
              </div>

              {/* Game Status HUD */}
              <div className="bg-white border-2 border-slate-200/90 rounded-2xl px-3.5 py-1.5 flex items-center gap-3 shadow-2xs">
                <div className="flex items-center gap-1.5 font-black text-xs text-orange-600">
                  <Fire weight="fill" className="w-4 h-4 text-orange-500" />
                  <span>{userStreak} Hari</span>
                </div>
                <div className="w-[1px] h-3.5 bg-slate-200" />
                <div className="flex items-center gap-1.5 font-black text-xs text-amber-600">
                  <Star weight="fill" className="w-4 h-4 text-amber-500" />
                  <span>{userXp} XP</span>
                </div>
                <div className="w-[1px] h-3.5 bg-slate-200" />
                <div className="flex items-center gap-1.5 font-black text-xs text-blue-600">
                  <Sparkle weight="fill" className="w-3.5 h-3.5" />
                  <span>Lv. {userLevel} Kodi</span>
                </div>
                <div className="w-[1px] h-3.5 bg-slate-200" />
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center justify-center p-1 rounded-lg hover:bg-slate-100 active:translate-y-0.5"
                  title={isMuted ? 'Aktifkan Efek Suara' : 'Bisukan Efek Suara'}
                >
                  {isMuted ? (
                    <SpeakerSimpleSlash weight="bold" className="w-4 h-4 text-slate-400" />
                  ) : (
                    <SpeakerSimpleHigh weight="bold" className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── 2. LIGHT DUOLINGO 3D HERO HEADER (CLEAN & BRIGHT) ── */}
          <div className="rounded-3xl bg-white border-2 border-slate-200/90 p-6 sm:p-7 shadow-2xs relative overflow-hidden space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-brand font-black px-2.5 py-0.5 rounded-lg tracking-wider">
                    KURIKULUM TEKNIS RELEVAN
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• {units.length} Unit Utama</span>
                </div>
                <h1 className="font-brand font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  {roadmap?.title || currentTrackConfig.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Pohon kompetensi berjenjang dari alokasi memori dasar hingga arsitektur high-concurrency siap produksi. Setiap modul disusun berurutan untuk fondasi koding yang kuat.
                </p>
              </div>

              {/* Master Curriculum Metrics */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 shrink-0 text-center">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-bold">
                    <Clock weight="bold" className="w-3 h-3 text-blue-600" />
                    <span>Durasi</span>
                  </div>
                  <span className="text-xs sm:text-sm font-brand font-black text-slate-900">~{totalHours} Jam</span>
                </div>

                <div className="space-y-0.5 border-x border-slate-200 px-2">
                  <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-bold">
                    <Lightning weight="fill" className="w-3 h-3 text-amber-500" />
                    <span>Total XP</span>
                  </div>
                  <span className="text-xs sm:text-sm font-brand font-black text-amber-600">+{totalCurriculumXp}</span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-bold">
                    <CheckCircle weight="fill" className="w-3 h-3 text-emerald-500" />
                    <span>Tuntas</span>
                  </div>
                  <span className="text-xs sm:text-sm font-brand font-black text-emerald-600">{curriculumProgressPercent}%</span>
                </div>
              </div>
            </div>

            {/* Next Active Part Kodi Companion Hero CTA */}
            {nextActivePart && (
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={doodleCoding}
                      alt="Kodi Ngoding"
                      className="w-14 h-14 object-contain drop-shadow-sm select-none"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white font-brand font-black text-[10px] flex items-center justify-center border-2 border-white shadow-xs">
                      {nextActivePart.globalPartNumber}
                    </span>
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-brand font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        🎯 TARGET KAMU HARI INI
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                        +{nextActivePart.xpReward} XP
                      </span>
                    </div>
                    <h3 className="font-brand font-black text-sm sm:text-base text-slate-900 truncate">
                      Part {nextActivePart.globalPartNumber}: {nextActivePart.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {nextActivePart.subtitle} • Estimasi {nextActivePart.estimatedMinutes} Menit
                    </p>
                  </div>
                </div>

                <Button3D
                  variant="blue"
                  size="sm"
                  onClick={() => {
                    triggerHaptic('success')
                    navigate(nextActivePart.route)
                  }}
                  className="text-xs px-5 py-2.5 shadow-[0_3px_0_0_#1D4ED8] font-brand font-black shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Play weight="fill" className="w-3.5 h-3.5" />
                  <span>LANJUTKAN KODING ▶</span>
                </Button3D>
              </div>
            )}
          </div>

          {/* ── 3. FILTER TABS & S-CURVE LINK ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
              {[
                { id: 'all', label: `Semua Part (${totalPartsCount})` },
                { id: 'active', label: 'Sedang Berjalan ⚡' },
                { id: 'completed', label: `Sudah Lulus (${completedPartsCount})` },
                { id: 'nihongo', label: 'Nihongo IT 🌸' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap')
                    setActiveFilterTab(tab.id as typeof activeFilterTab)
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-brand font-black transition-all cursor-pointer whitespace-nowrap ${
                    activeFilterTab === tab.id
                      ? 'bg-blue-600 text-white shadow-[0_2.5px_0_0_#1D4ED8]'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Link
              to="/dashboard"
              onClick={() => triggerHaptic('tap')}
              className="text-xs font-brand font-bold text-slate-500 hover:text-blue-600 transition-colors ml-auto flex items-center gap-1"
            >
              <span>Lihat di Peta S-Curve Dasbor</span>
              <ArrowSquareOut weight="bold" className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── 4. DIRECT SEQUENTIAL TECHNICAL UNIT CARDS ── */}
          <div className="space-y-6">
            {isLoading && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs font-semibold animate-pulse">
                Memuat silabus kurikulum spesialisasi...
              </div>
            )}

            {!isLoading && filteredUnits.length === 0 && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center space-y-3">
                <img
                  src={doodleThinking}
                  alt="Kodi Thinking"
                  className="w-20 h-20 mx-auto object-contain drop-shadow-sm select-none"
                />
                <h4 className="font-brand font-black text-sm text-slate-800">
                  Tidak Ada Modul di Kategori Ini
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Coba ubah filter atau pilih tab "Semua Part" untuk melihat seluruh pohon kompetensi kurikulum.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveFilterTab('all')}
                  className="text-xs font-brand font-black text-blue-600 hover:underline cursor-pointer"
                >
                  Lihat Semua Part ({totalPartsCount})
                </button>
              </div>
            )}

            {filteredUnits.map((unit) => {
              const unitParts = unit.parts
              const unitCompletedCount = unitParts.filter((p) => completedQuestsSet.has(p.id)).length
              const isUnitCompleted = unitCompletedCount === unitParts.length
              const isUnitActive = !isUnitCompleted && unitParts.some((p) => p.id === nextActivePart?.id)
              const unitPercent = Math.round((unitCompletedCount / unitParts.length) * 100)
              const theme = UNIT_THEMES[unit.unitNumber] || UNIT_THEMES[1]

              return (
                <div
                  key={unit.id}
                  className={`bg-white rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-2xs ${
                    isUnitCompleted
                      ? 'border-emerald-300 ring-4 ring-emerald-500/10'
                      : isUnitActive
                      ? 'border-blue-500 ring-4 ring-blue-500/15'
                      : 'border-slate-200/90'
                  }`}
                >
                  {/* ── DUOLINGO 3D UNIT BANNER HEADER ── */}
                  <div
                    className={`p-5 sm:p-6 transition-all ${
                      isUnitCompleted
                        ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white border-b-[5px] border-emerald-900'
                        : isUnitActive
                        ? `${theme.gradientBg} text-white ${theme.border3D}`
                        : 'bg-slate-100 text-slate-800 border-b-[4px] border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-mono font-bold text-[10px] px-2.5 py-1 rounded-lg ${
                              isUnitCompleted
                                ? 'bg-emerald-500/30 border border-emerald-300/30 text-white'
                                : isUnitActive
                                ? theme.tagBg
                                : 'bg-slate-200 border border-slate-300 text-slate-700'
                            }`}
                          >
                            UNIT 0{unit.unitNumber} • {unit.tag}
                          </span>

                          {isUnitCompleted ? (
                            <span className="bg-white/20 text-white font-brand font-black text-[10px] px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-white/25">
                              <CheckFat weight="fill" className="w-3 h-3 text-emerald-200" />
                              <span>LULUS SEMUA SESI</span>
                            </span>
                          ) : isUnitActive ? (
                            <span className="bg-white/20 text-white font-brand font-black text-[10px] px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-white/25">
                              <Sparkle weight="fill" className="w-3 h-3 text-amber-300" />
                              <span>SEDANG AKTIF</span>
                            </span>
                          ) : (
                            <span className="bg-slate-200/90 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 border border-slate-300">
                              <LockSimple weight="bold" className="w-3 h-3" />
                              <span>TERKUNCI</span>
                            </span>
                          )}
                        </div>

                        <h3
                          className={`font-brand font-black text-lg sm:text-xl tracking-tight ${
                            isUnitCompleted || isUnitActive ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {unit.title}
                        </h3>
                        <p
                          className={`text-xs leading-relaxed max-w-2xl font-medium ${
                            isUnitCompleted || isUnitActive ? 'text-white/80' : 'text-slate-600'
                          }`}
                        >
                          {unit.description}
                        </p>
                      </div>

                      {/* Guidebook Button */}
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('tap')
                          const firstPart = unit.parts[0]
                          if (firstPart) navigate(firstPart.route)
                        }}
                        className={`self-start sm:self-center px-4 py-2 rounded-xl text-xs font-brand font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${
                          isUnitCompleted || isUnitActive
                            ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 active:translate-y-0.5'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 active:translate-y-0.5'
                        }`}
                      >
                        <BookOpen weight="bold" className="w-4 h-4" />
                        <span>Buku Panduan Unit</span>
                      </button>
                    </div>

                    {/* 3D Segmented Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1 max-w-md">
                        <div
                          className={`h-3 rounded-full overflow-hidden p-0.5 border ${
                            isUnitCompleted || isUnitActive
                              ? 'bg-black/25 border-white/20'
                              : 'bg-slate-200 border-slate-300'
                          }`}
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-500 shadow-xs ${
                              isUnitCompleted
                                ? 'bg-emerald-300'
                                : isUnitActive
                                ? 'bg-white'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.max(5, unitPercent)}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className={`text-xs font-brand font-black shrink-0 ${
                          isUnitCompleted || isUnitActive ? 'text-white' : 'text-slate-600'
                        }`}
                      >
                        {unitCompletedCount}/{unitParts.length} Sesi Selesai ({unitPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* ── SEQUENTIAL PART BREAKDOWN (DUOLINGO 3D TACTILE CARDS) ── */}
                  <div className="p-4 sm:p-5 space-y-3 bg-white">
                    {unit.filteredParts.map((part) => {
                      const isCompleted = completedQuestsSet.has(part.id)
                      const isNextActive = part.id === nextActivePart?.id
                      const isUnlocked = isCompleted || isNextActive

                      return (
                        <div
                          key={part.id}
                          className={`p-4 sm:p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 ${
                            isCompleted
                              ? 'bg-white border-2 border-slate-200/90 border-b-[4px] border-b-slate-300 hover:border-b-[5px] hover:-translate-y-0.5'
                              : isNextActive
                              ? 'bg-blue-50/50 border-2 border-blue-500 border-b-[5px] border-b-blue-600 ring-4 ring-blue-500/10 shadow-sm hover:border-b-[6px] hover:-translate-y-0.5'
                              : 'bg-slate-50/70 border-2 border-slate-200/70 border-b-[3px] border-b-slate-200 opacity-60'
                          } ${
                            part.category === 'nihongo' && !isCompleted && !isNextActive
                              ? 'bg-rose-50/40 border-rose-200/60'
                              : ''
                          }`}
                        >
                          {/* Left: 3D Tactile Token Cube + Details */}
                          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                            {/* 3D Tactile Token Cube */}
                            <div
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                                isCompleted
                                  ? 'bg-emerald-500 border-2 border-emerald-300 text-white shadow-[0_3.5px_0_0_#047857]'
                                  : isNextActive
                                  ? 'bg-blue-600 border-2 border-blue-400 text-white shadow-[0_3.5px_0_0_#1D4ED8] animate-pulse'
                                  : 'bg-slate-100 border-2 border-slate-200 text-slate-400'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckFat weight="fill" className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-xs" />
                              ) : isNextActive ? (
                                <span className="font-brand font-black text-base sm:text-lg text-white">
                                  {part.globalPartNumber}
                                </span>
                              ) : (
                                <LockSimple weight="bold" className="w-5 h-5 text-slate-400" />
                              )}
                            </div>

                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                    part.category === 'nihongo'
                                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {part.chipLabel}
                                </span>

                                {isNextActive && (
                                  <span className="bg-blue-100 text-blue-700 border border-blue-200 font-brand font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                                    <Sparkle weight="fill" className="w-3 h-3 text-blue-600" />
                                    <span>MODUL AKTIF</span>
                                  </span>
                                )}
                              </div>

                              <h4
                                className={`text-sm sm:text-base font-brand font-bold tracking-tight truncate ${
                                  isNextActive ? 'text-blue-950 font-black' : 'text-slate-900'
                                }`}
                              >
                                Part {part.globalPartNumber}: {part.title}
                              </h4>

                              <p className="text-xs text-slate-500 font-medium truncate">
                                {part.subtitle} • {part.difficulty} • ⏱️ Estimasi {part.estimatedMinutes} Menit
                              </p>
                            </div>
                          </div>

                          {/* Right: XP Chip & Tactile Action */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <span className="bg-amber-50 text-amber-900 border border-amber-300 font-brand font-black text-xs px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1">
                              <Lightning weight="fill" className="w-3.5 h-3.5 text-amber-600" />
                              <span>+{part.xpReward} XP</span>
                            </span>

                            {isCompleted ? (
                              <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 font-brand font-black text-xs flex items-center gap-1.5 shadow-[0_2px_0_0_#A7F3D0]">
                                <CheckFat weight="fill" className="w-4 h-4 text-emerald-600" />
                                <span>SELESAI</span>
                              </div>
                            ) : isUnlocked ? (
                              <Button3D
                                variant="blue"
                                size="sm"
                                onClick={() => {
                                  triggerHaptic('success')
                                  navigate(part.route)
                                }}
                                className="text-xs px-5 py-2.5 shadow-[0_3.5px_0_0_#1D4ED8] font-brand font-black"
                              >
                                <div className="flex items-center gap-1.5">
                                  <Play weight="fill" className="w-3.5 h-3.5" />
                                  <span>MULAI KODING</span>
                                </div>
                              </Button3D>
                            ) : (
                              <div className="px-3.5 py-2 rounded-xl bg-slate-100 border-2 border-slate-200 text-slate-400 text-xs font-bold flex items-center gap-1.5">
                                <LockSimple weight="bold" className="w-3.5 h-3.5" />
                                <span>Terkunci</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (100% IDENTICAL TO DASHBOARD) ══════ */}
        <aside className="w-full xl:w-[354px] shrink-0 border-t-2 xl:border-t-0 xl:border-l-2 border-slate-200/90 bg-white p-5 sm:p-6 space-y-6">
          {/* ── 1. RENTETAN BELAJAR (7-DAY STREAK TRACKER) ── */}
          <div className="border-2 border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-2xs bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarBlank weight="bold" className="w-4 h-4 text-blue-600" />
                <h4 className="font-brand font-black text-xs text-slate-900">Rentetan Belajar</h4>
              </div>
              <span className="bg-red-50 text-red-600 text-[10px] font-brand font-black px-2.5 py-0.5 rounded-full border border-red-200/80 flex items-center gap-1">
                <Fire weight="fill" className="w-3.5 h-3.5 text-red-500" />
                <span>{userStreak} Hari Aktif</span>
              </span>
            </div>

            {/* 7 Days Row */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {(activitySummary?.weekly_logs && activitySummary.weekly_logs.length === 7
                ? activitySummary.weekly_logs.map((log) => ({
                    label: log.day_label,
                    isToday: log.is_today,
                    isCompleted: log.is_active,
                  }))
                : [
                    { label: 'Sen', dayIndex: 0 },
                    { label: 'Sel', dayIndex: 1 },
                    { label: 'Rab', dayIndex: 2 },
                    { label: 'Kam', dayIndex: 3 },
                    { label: 'Jum', dayIndex: 4 },
                    { label: 'Sab', dayIndex: 5 },
                    { label: 'Min', dayIndex: 6 },
                  ].map((item) => {
                    const todayDayIndex = (new Date().getDay() + 6) % 7
                    return {
                      label: item.label,
                      isToday: item.dayIndex === todayDayIndex,
                      isCompleted:
                        item.dayIndex < todayDayIndex
                          ? todayDayIndex - item.dayIndex < Math.max(1, userStreak)
                          : item.dayIndex === todayDayIndex && userStreak > 0,
                    }
                  })
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
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-b from-amber-400 via-orange-400 to-orange-500 shadow-[0_2.5px_0_0_#C2410C] flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 cursor-default"
                        title={`${item.label}: Hari Aktif Belajar 🔥`}
                      >
                        <Fire weight="fill" className="w-3.5 h-3.5 text-amber-100 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] animate-pulse" />
                      </div>
                    ) : isToday ? (
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-50 border-2 border-dashed border-orange-400 flex items-center justify-center text-orange-500 shadow-2xs relative"
                        title="Hari ini: Belajar 1 modul untuk menyalakan api!"
                      >
                        <Fire weight="bold" className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
                      </div>
                    ) : (
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

          {/* ── 2. MISI & TARGET HARIAN (IDENTICAL TO DASHBOARD) ── */}
          <div className="space-y-2.5">
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
                <span>4j 20m</span>
              </span>
            </div>

            {/* Duolingo Integrated Progress Track with Golden Chest */}
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

              {/* Progress Bar Track with Golden Chest Anchor */}
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
              {/* Quest 1: Code Quest */}
              <div className="p-2.5 bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-xs transition-all group">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-blue-500 to-indigo-600 shadow-[0_2px_0_0_#1E3A8A] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Code weight="bold" className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="font-brand font-black text-[11px] text-slate-900 leading-tight line-clamp-2">
                      Selesaikan 1 Bab Coding
                    </p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[9px] font-brand font-black px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow-2xs">
                        <Lightning weight="fill" className="w-2.5 h-2.5 text-amber-500" />
                        <span>+50 XP</span>
                      </span>
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider bg-slate-100 border border-slate-200/60 px-1 py-0.2 rounded">
                        KODING
                      </span>
                    </div>
                  </div>
                </div>

                {isPart1Done ? (
                  <span className="bg-emerald-50 border border-emerald-300 text-emerald-700 font-brand font-black text-[9px] px-2 py-1 rounded-lg flex items-center gap-0.5 shrink-0 shadow-2xs">
                    <CheckCircle weight="fill" className="w-3 h-3 text-emerald-600" />
                    <span>SELESAI</span>
                  </span>
                ) : (
                  <Button3D
                    variant="blue"
                    size="sm"
                    onClick={() => {
                      triggerHaptic('tap')
                      navigate('/learn/part-1-variabel-dan-tipe-data')
                    }}
                    className="text-[10px] font-black tracking-wide px-2.5 py-1 shrink-0 shadow-[0_2px_0_0_#1D4ED8]"
                  >
                    MULAI ▶
                  </Button3D>
                )}
              </div>

              {/* Quest 2: Japanese Vocab Quest */}
              <div className="p-2.5 bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-xs transition-all group">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-rose-400 to-pink-500 shadow-[0_2px_0_0_#9F1239] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Translate weight="bold" className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="font-brand font-black text-[11px] text-slate-900 leading-tight line-clamp-2">
                      Review Kosakata IT Hari Ini
                    </p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[9px] font-brand font-black px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow-2xs">
                        <Lightning weight="fill" className="w-2.5 h-2.5 text-amber-500" />
                        <span>+30 XP</span>
                      </span>
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider bg-slate-100 border border-slate-200/60 px-1 py-0.2 rounded">
                        BAHASA
                      </span>
                    </div>
                  </div>
                </div>

                {claimedLocalQuest ? (
                  <span className="bg-emerald-50 border border-emerald-300 text-emerald-700 font-brand font-black text-[9px] px-2 py-1 rounded-lg flex items-center gap-0.5 shrink-0 shadow-2xs">
                    <CheckCircle weight="fill" className="w-3 h-3 text-emerald-600" />
                    <span>SELESAI</span>
                  </span>
                ) : reviewedNihongoToday ? (
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
                      const el = document.getElementById('tech-nihongo-card')
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        el.classList.add('ring-4', 'ring-blue-400', 'rounded-2xl', 'transition-all')
                        setTimeout(() => {
                          el.classList.remove('ring-4', 'ring-blue-400', 'rounded-2xl')
                        }, 2000)
                      }
                    }}
                    className="text-[10px] font-black tracking-wide px-2.5 py-1 shrink-0 shadow-[0_2px_0_0_#1D4ED8]"
                  >
                    MULAI ▶
                  </Button3D>
                )}
              </div>
            </div>
          </div>

          {/* ── SUBTLE SECTION DIVIDER ── */}
          <div className="h-[1px] bg-slate-100" />

          {/* ── 3. KOSAKATA KANTOR TOKYO (TECH NIHONGO CARD SSOT) ── */}
          <div id="tech-nihongo-card">
            <TechNihongoCard
              isReviewed={reviewedNihongoToday}
              isClaimed={claimedLocalQuest}
              onReview={handleVocabReview}
            />
          </div>
        </aside>
      </div>

      {/* ── 3. DUOLINGO-STYLE COURSE SWITCHER MODAL ── */}
      <CourseSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
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
              ✕
            </button>

            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-b from-amber-400 to-yellow-500 flex items-center justify-center text-3xl shadow-[0_4px_0_0_#B45309] animate-bounce">
              🎁
            </div>

            <div>
              <h3 className="font-brand font-black text-lg text-slate-900">
                {isChestUnlocked ? 'Peti Hadiah Emas Terbuka!' : 'Peti Hadiah Harian'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isChestUnlocked
                  ? 'Selamat! Kamu mencapai target 50 XP hari ini. Klaim hadiah kristalmu!'
                  : `Kumpulkan ${remainingXp} XP lagi hari ini untuk membuka peti hadiah emas!`}
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-around">
              <div className="text-center">
                <span className="text-[10px] text-amber-700 font-bold block">Hadiah Kristal</span>
                <span className="font-brand font-black text-sm text-amber-900">+20 💎</span>
              </div>
              <div className="w-[1px] h-6 bg-amber-200" />
              <div className="text-center">
                <span className="text-[10px] text-amber-700 font-bold block">XP Bonus</span>
                <span className="font-brand font-black text-sm text-amber-900">+50 ⚡</span>
              </div>
            </div>

            {isChestClaimedToday ? (
              <div className="py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 font-brand font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs">
                <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600" />
                <span>Peti Sudah Diklaim Hari Ini</span>
              </div>
            ) : isChestUnlocked ? (
              <Button3D
                variant="amber"
                size="md"
                className="w-full shadow-[0_4px_0_0_#B45309]"
                onClick={() => {
                  handleClaimGoldenChest()
                  setIsChestModalOpen(false)
                }}
              >
                KLAIM HADIAH 🎁
              </Button3D>
            ) : (
              <Button3D
                variant="blue"
                size="md"
                className="w-full shadow-[0_4px_0_0_#1D4ED8]"
                onClick={() => {
                  triggerHaptic('tap')
                  setIsChestModalOpen(false)
                  if (nextActivePart) navigate(nextActivePart.route)
                }}
              >
                LANJUT KODING ▶
              </Button3D>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
