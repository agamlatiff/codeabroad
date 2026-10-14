import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { useRoadmap } from '../hooks/useRoadmap'
import { authService } from '../services/authService'
import type { UserActivitySummary } from '../types/auth'
import { Button3D } from '../components/ui/Button3D'
import { DoodleHanko } from '../components/illustrations/doodles'
import { triggerHaptic } from '../utils/haptics'
import {
  CourseSwitcherModal,
  CAREER_TRACKS,
} from '../components/game/CourseSwitcherModal'
import { UnitGuidebookModal } from '../components/game/UnitGuidebookModal'
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
  Medal,
  Trophy,
  Fire,
  Star,
  Check,
  Lightning,
  Briefcase,
  ArrowSquareOut,
  CheckCircle,
  BookOpen,
  Clock,
  Code,
} from '@phosphor-icons/react'

// Standard Flat Sequential Curriculum Unit Definition
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
  capstoneTitle: string
  capstoneDescription: string
  parts: SequentialPartItem[]
}

// Canonical Curriculum Blueprint for Go Backend Engineer
const GOLANG_CURRICULUM_UNITS: SequentialCurriculumUnit[] = [
  {
    id: 'unit-1-fondasi-go',
    unitNumber: 1,
    tag: 'FONDASI SINTAKS GO & MEMORI POINTER',
    title: 'Fondasi Sintaks Go & Memory Pointer',
    description: 'Pahami arsitektur runtime Go, alokasi memori heap vs stack, manipulasi pointer dan tata krama aisatsu di kantor Tokyo.',
    totalXp: 150,
    capstoneTitle: 'Verifikasi Modul Memori: Profiler CPU & Pointer Allocation',
    capstoneDescription: 'Validasi pemahaman escape analysis dan memory safety standar rekrutmen Tokyo.',
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
        title: 'Aisatsu & Jikoshoukai di Kantor Tokyo',
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
    tag: 'GIN REST API & CLEAN ARCHITECTURE',
    title: 'Sintaks Go & Gin REST API Engine',
    description: 'Bangun RESTful API enterprise dengan Gin framework, middleware auth guard JWT, DTO validation, dan Clean Architecture.',
    totalXp: 200,
    capstoneTitle: 'Capstone Project: Tokyo E-Commerce Auth & Product API Gateway',
    capstoneDescription: 'Arsitektur Clean Architecture dengan database PostgreSQL Pgx connection pool.',
    parts: [
      {
        id: 'part-4-routing-dan-jwt-middleware',
        globalPartNumber: 4,
        title: 'Gin Radix Router & JSON Envelope',
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
        title: 'JWT Middleware & Auth Guard Tokyo',
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
    title: 'Concurrency Engine & Worker Pool',
    description: 'Kuasai goroutines, buffered channels, select statement, dan worker pool pattern untuk pemrosesan paralel anti-race condition.',
    totalXp: 175,
    capstoneTitle: 'Capstone Project: Batch Event Pipeline & Asynchronous Notifier',
    capstoneDescription: 'Pemrosesan 10,000 transaksi bersamaan dengan zero memory leak.',
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
        title: 'High-Concurrency Worker Pool Tokyo',
        subtitle: 'Pola distribusi beban komputasi server backend di kawasan Shibuya',
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
    tag: 'CONTAINER & CAPSTONE PORTOFOLIO',
    title: 'Microservices & Capstone Portofolio',
    description: 'Packaging container Docker multi-stage, deployment cloud server, dan verifikasi repositori portofolio kerja Tokyo.',
    totalXp: 300,
    capstoneTitle: 'Grand Capstone: Repositori Portofolio Siap Review Shibuya & Sponsor Visa',
    capstoneDescription: 'Lengkap dengan Swagger/OpenAPI docs, unit test 80% coverage, dan CI/CD pipeline.',
    parts: [
      {
        id: 'part-9-docker-multistage-build',
        globalPartNumber: 9,
        title: 'Docker Multi-Stage Build & Scratch Image',
        subtitle: 'Optimasi image container Go dari 800MB menjadi 15MB untuk produksi',
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
        title: 'Grand Capstone Portofolio Shibuya-Ready',
        subtitle: 'Verifikasi repositori GitHub standar wawancara teknis perusahaan teknologi Jepang',
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

export const RoadmapPage = () => {
  const navigate = useNavigate()
  const { track: routeTrack } = useParams<{ track?: string }>()
  const { user } = useAuthStore()

  // Track state management
  const [activeTrack, setActiveTrack] = useState(() => {
    return routeTrack || user?.primary_stack || user?.career_path?.slug || 'golang'
  })
  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)

  // Guidebook Modal State
  const [selectedGuidebookUnit, setSelectedGuidebookUnit] = useState<{
    unitNumber: number
    unitTitle: string
  } | null>(null)

  // Filter Tabs: 'all' | 'active' | 'completed' | 'nihongo'
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'active' | 'completed' | 'nihongo'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 7-day activity summary
  const [activitySummary, setActivitySummary] = useState<UserActivitySummary | null>(null)

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

  // Fetch real 7-day activity logs from backend
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
    return () => {
      isMounted = false
    }
  }, [])

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

  // Flat Sequential Units
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
                title="Peminatan karier saat ini. Klik untuk beralih jalur silabus."
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
                  placeholder="Cari part, sintaks, materi..."
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
              </div>
            </div>
          </div>

          {/* ── 2. CURRICULUM MASTER OVERVIEW BANNER (ELEGANT 3D HEADER) ── */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 shadow-md relative overflow-hidden border-2 border-indigo-900/60">
            {/* Background ambient pattern */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-brand font-black px-2.5 py-0.5 rounded-lg tracking-wider">
                    SILABUS KURIKULUM TOKYO 2026
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• {units.length} Unit Utama</span>
                </div>
                <h1 className="font-brand font-black text-xl sm:text-2xl text-white tracking-tight">
                  {roadmap?.title || currentTrackConfig.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  Pohon kompetensi resmi berstandar industri koding Tokyo. Setiap modul dirancang berurutan (Part 1, 2, 3...) untuk menghasilkan portofolio kerja yang siap diuji di Shibuya.
                </p>
              </div>

              {/* Master Metrics HUD Card */}
              <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 shrink-0 text-center">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1 text-slate-300 text-[10px] font-bold">
                    <Clock weight="bold" className="w-3 h-3 text-sky-300" />
                    <span>Durasi</span>
                  </div>
                  <span className="text-xs sm:text-sm font-brand font-black text-white">~{totalHours} Jam</span>
                </div>

                <div className="space-y-0.5 border-x border-white/10 px-2">
                  <div className="flex items-center justify-center gap-1 text-slate-300 text-[10px] font-bold">
                    <Lightning weight="fill" className="w-3 h-3 text-amber-300" />
                    <span>Total XP</span>
                  </div>
                  <span className="text-xs sm:text-sm font-brand font-black text-amber-300">+{totalCurriculumXp}</span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1 text-slate-300 text-[10px] font-bold">
                    <CheckCircle weight="fill" className="w-3 h-3 text-emerald-300" />
                    <span>Tuntas</span>
                  </div>
                  <span className="text-xs sm:text-sm font-brand font-black text-emerald-300">{curriculumProgressPercent}%</span>
                </div>
              </div>
            </div>

            {/* Next Active Part Quick Action CTA */}
            {nextActivePart && (
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-blue-500 text-white font-brand font-black text-[11px] flex items-center justify-center shadow-xs">
                    {nextActivePart.globalPartNumber}
                  </span>
                  <span className="text-slate-300">
                    Modul aktif Anda berikutnya:{' '}
                    <strong className="text-white font-black">{nextActivePart.title}</strong>
                  </span>
                </div>

                <Button3D
                  variant="blue"
                  size="sm"
                  onClick={() => {
                    triggerHaptic('success')
                    navigate(nextActivePart.route)
                  }}
                  className="text-xs px-4 py-2 shadow-[0_3px_0_0_#1D4ED8] shrink-0"
                >
                  <span>LANJUTKAN KODING ▶</span>
                </Button3D>
              </div>
            )}
          </div>

          {/* ── 3. FILTER TABS & SEARCH BAR ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
              {[
                { id: 'all', label: `Semua Part (${totalPartsCount})` },
                { id: 'active', label: 'Sedang Berjalan ⚡' },
                { id: 'completed', label: `Sudah Lulus ✓ (${completedPartsCount})` },
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

          {/* ── 4. DIRECT SEQUENTIAL CURRICULUM UNITS ── */}
          <div className="space-y-6">
            {isLoading && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs font-semibold animate-pulse">
                Memuat silabus kurikulum spesialisasi...
              </div>
            )}

            {!isLoading && filteredUnits.length === 0 && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs">
                Tidak ada part atau modul yang cocok dengan kriteria filter saat ini.
              </div>
            )}

            {filteredUnits.map((unit) => {
              const unitParts = unit.parts
              const unitCompletedCount = unitParts.filter((p) => completedQuestsSet.has(p.id)).length
              const isUnitCompleted = unitCompletedCount === unitParts.length
              const isUnitActive = !isUnitCompleted && unitParts.some((p) => p.id === nextActivePart?.id)

              return (
                <div
                  key={unit.id}
                  className={`bg-white rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-2xs ${
                    isUnitCompleted
                      ? 'border-slate-200/90'
                      : isUnitActive
                      ? 'border-blue-500 ring-4 ring-blue-500/10'
                      : 'border-slate-200/80 opacity-90'
                  }`}
                >
                  {/* ── UNIT BANNER HEADER ── */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-white to-blue-50/30 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs font-brand font-black text-lg ${
                          isUnitCompleted
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                            : isUnitActive
                            ? 'bg-blue-600 text-white shadow-[0_3px_0_0_#1D4ED8]'
                            : 'bg-slate-100 border border-slate-200 text-slate-400'
                        }`}
                      >
                        {isUnitCompleted ? (
                          <Medal weight="fill" className="w-6 h-6" />
                        ) : isUnitActive ? (
                          <Sparkle weight="fill" className="w-6 h-6" />
                        ) : (
                          <LockSimple weight="bold" className="w-6 h-6" />
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs ${
                              isUnitCompleted
                                ? 'bg-slate-100 text-slate-700'
                                : isUnitActive
                                ? 'bg-blue-600 text-white font-black'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            UNIT 0{unit.unitNumber} • {unit.tag}
                          </span>
                          <span
                            className={`text-xs font-black ${
                              isUnitCompleted
                                ? 'text-emerald-700'
                                : isUnitActive
                                ? 'text-blue-700'
                                : 'text-slate-500'
                            }`}
                          >
                            {unitCompletedCount}/{unitParts.length} Sesi Tuntas ({Math.round((unitCompletedCount / unitParts.length) * 100)}%)
                          </span>
                        </div>

                        <h3 className="font-brand font-black text-base sm:text-lg text-slate-900 tracking-tight">
                          {unit.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {unit.description}
                        </p>
                      </div>
                    </div>

                    {/* Unit Actions: Guidebook Button & Hanko Stamp */}
                    <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
                      {/* 📖 BUKU PANDUAN UNIT BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('tap')
                          setSelectedGuidebookUnit({
                            unitNumber: unit.unitNumber,
                            unitTitle: unit.title,
                          })
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 active:translate-y-0.5 border-2 border-slate-200 hover:border-blue-400 text-slate-800 text-xs font-brand font-black transition-all shadow-2xs cursor-pointer group"
                        title="Buka contekan sintaks, teori dan Nihongo IT untuk unit ini"
                      >
                        <BookOpen weight="fill" className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span>BUKU PANDUAN</span>
                      </button>

                      {isUnitCompleted ? (
                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 font-black text-xs px-3 py-1.5 rounded-xl border border-emerald-200">
                          <Check weight="bold" className="w-3.5 h-3.5" />
                          <span>LULUS</span>
                          <DoodleHanko text="合格" className="w-5 h-5 ml-1" />
                        </div>
                      ) : isUnitActive ? (
                        <span className="bg-blue-50 text-blue-700 font-brand font-black text-xs px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1">
                          <Sparkle weight="fill" className="w-3.5 h-3.5" />
                          <span>SEDANG BERJALAN</span>
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1">
                          <LockSimple weight="bold" className="w-3.5 h-3.5" />
                          <span>TERKUNCI</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── DIRECT SEQUENTIAL PART BREAKDOWN (FLAT 3D ROWS) ── */}
                  <div className="p-4 sm:p-5 space-y-2.5 bg-white">
                    {unit.filteredParts.map((part) => {
                      const isCompleted = completedQuestsSet.has(part.id)
                      const isNextActive = part.id === nextActivePart?.id
                      const isUnlocked = isCompleted || isNextActive

                      return (
                        <div
                          key={part.id}
                          className={`p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3.5 transition-all ${
                            isCompleted
                              ? 'bg-slate-50/70 border-2 border-slate-200/80 hover:bg-slate-50'
                              : isNextActive
                              ? 'bg-blue-50/60 border-2 border-blue-500 shadow-sm ring-2 ring-blue-500/10'
                              : 'bg-white border-2 border-slate-100 opacity-60'
                          }`}
                        >
                          {/* Left: Sequential Number Badge + Meta */}
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* 3D Tactile Global Number Badge */}
                            <div
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-brand font-black text-sm flex items-center justify-center shrink-0 transition-transform ${
                                isCompleted
                                  ? 'bg-emerald-500 text-white shadow-[0_2.5px_0_0_#047857]'
                                  : isNextActive
                                  ? 'bg-blue-600 text-white shadow-[0_2.5px_0_0_#1D4ED8]'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200'
                              }`}
                            >
                              {isCompleted ? '✓' : part.globalPartNumber}
                            </div>

                            <div className="space-y-0.5 truncate">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                    part.category === 'nihongo'
                                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {part.chipLabel}
                                </span>
                                <h4
                                  className={`text-xs sm:text-sm font-brand font-bold truncate ${
                                    isNextActive ? 'text-blue-950 font-black' : 'text-slate-900'
                                  }`}
                                >
                                  Part {part.globalPartNumber}: {part.title}
                                </h4>
                              </div>

                              <p className="text-[11px] text-slate-500 font-medium truncate">
                                {part.subtitle} • {part.difficulty} • Estimasi {part.estimatedMinutes} Menit
                              </p>
                            </div>
                          </div>

                          {/* Right: Action Button */}
                          <div className="shrink-0 flex items-center gap-2.5">
                            <span className="hidden sm:inline-flex bg-amber-50 text-amber-800 text-[11px] font-black px-2 py-0.5 rounded-lg border border-amber-200">
                              +{part.xpReward} XP
                            </span>

                            {isCompleted ? (
                              <span className="text-xs font-brand font-black text-emerald-600 flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                                <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500" />
                                <span>Lulus ✓</span>
                              </span>
                            ) : isUnlocked ? (
                              <Button3D
                                variant="blue"
                                size="sm"
                                onClick={() => {
                                  triggerHaptic('tap')
                                  navigate(part.route)
                                }}
                                className="text-xs px-4 py-2 shadow-[0_3px_0_0_#1D4ED8]"
                              >
                                Mulai Koding ▶
                              </Button3D>
                            ) : (
                              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                                <LockSimple weight="bold" className="w-3.5 h-3.5" />
                                <span>Terkunci</span>
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}

                    {/* Unit Capstone Project Challenge */}
                    <div className="mt-3 bg-amber-50/70 border-2 border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-[0_2px_0_0_#B45309]">
                          <Trophy weight="fill" className="w-4 h-4" />
                        </span>
                        <div className="truncate">
                          <span className="text-xs font-brand font-black text-amber-950 block truncate">
                            Capstone Challenge: {unit.capstoneTitle}
                          </span>
                          <span className="text-[11px] text-amber-800 font-medium">
                            {unit.capstoneDescription}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-brand font-black text-amber-900 shrink-0 bg-amber-200/80 px-3 py-1 rounded-xl self-end sm:self-center">
                        +200 XP ⚡
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (354px width SSOT) ══════ */}
        <aside className="w-full xl:w-[354px] shrink-0 border-t-2 xl:border-t-0 xl:border-l-2 border-slate-200/90 bg-white p-5 sm:p-6 space-y-5">
          {/* ── 1. UNIFIED 7-DAY STREAK TRACKER (IDENTICAL TO DASHBOARD) ── */}
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

          {/* ── 2. TOKYO JOB READINESS PASSPORT CARD ── */}
          <div className="border-2 border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xs bg-white">
            <div className="flex items-center justify-between">
              <h4 className="font-brand font-black text-xs text-slate-900 flex items-center gap-1.5">
                <span>Paspor Kesiapan Kerja Tokyo</span>
                <span className="text-xs">🇯🇵</span>
              </h4>
              <span className="text-[10px] font-brand font-black text-blue-600 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
                Relokasi 2026
              </span>
            </div>

            {/* Readiness Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-brand font-black text-slate-700">Skor Kelulusan Tokyo:</span>
                <span className="font-brand font-black text-blue-600">{Math.max(65, curriculumProgressPercent)}% / 100%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#1D4ED8]"
                  style={{ width: `${Math.max(65, curriculumProgressPercent)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Target: Sponsor Visa Gijinkoku (技術・人文知識・国際業務)
              </p>
            </div>

            {/* Competency Checklist */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              {[
                { label: 'Sintaks & Memori Pointer', badge: 'Mahir 100%', variant: 'emerald' },
                { label: 'REST API & Clean Architecture', badge: 'Mahir 100%', variant: 'emerald' },
                { label: 'Docker Container Deployment', badge: 'Aktif 60%', variant: 'blue' },
                { label: 'Business Nihongo N3', badge: 'Aktif 45%', variant: 'amber' },
              ].map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 truncate pr-2">{skill.label}</span>
                  <span
                    className={`font-brand font-black text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                      skill.variant === 'emerald'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : skill.variant === 'blue'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {skill.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. CAREER PORTFOLIO SUMMARY CARD ── */}
          <div className="border-2 border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-2xs bg-gradient-to-b from-white to-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <Briefcase weight="bold" className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-brand font-black text-xs text-slate-900">Portofolio Tokyo IT</h4>
                <p className="text-[10px] text-slate-500">4 Proyek Capstone Kurikulum</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Tokyo REST API Gateway', isReady: true },
                { name: 'High-Concurrency Worker Pool', isReady: true },
                { name: 'Dockerized Microservices Cloud', isReady: false },
                { name: 'Tokyo Business IT Passport', isReady: false },
              ].map((proj, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 flex items-center gap-1.5 truncate pr-2">
                    <Code weight="bold" className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{proj.name}</span>
                  </span>
                  <span
                    className={`text-[10px] font-brand font-black px-2 py-0.5 rounded-full shrink-0 ${
                      proj.isReady
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {proj.isReady ? 'Siap Review ✓' : 'Dalam Proses'}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/career"
              onClick={() => triggerHaptic('tap')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-400 rounded-2xl text-xs font-brand font-black text-blue-600 transition-all shadow-2xs cursor-pointer group"
            >
              <span>Buka Portofolio Lengkap</span>
              <ArrowSquareOut weight="bold" className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </aside>
      </div>

      {/* ── 4. TRACK SWITCHER MODAL ── */}
      <CourseSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
      />

      {/* ── 5. UNIT GUIDEBOOK MODAL (THEORY CHEATSHEET & NIHONGO) ── */}
      {selectedGuidebookUnit && (
        <UnitGuidebookModal
          isOpen={!!selectedGuidebookUnit}
          onClose={() => setSelectedGuidebookUnit(null)}
          unitNumber={selectedGuidebookUnit.unitNumber}
          unitTitle={selectedGuidebookUnit.unitTitle}
        />
      )}
    </div>
  )
}
