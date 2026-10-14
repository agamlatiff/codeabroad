import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { useRoadmap } from '../hooks/useRoadmap'
import { authService } from '../services/authService'
import type { UserActivitySummary } from '../types/auth'
import { Button3D } from '../components/ui/Button3D'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { DoodleHanko } from '../components/illustrations/doodles'
import doodleCoding from '../assets/kodi/doodle-coding.png'
import { triggerHaptic } from '../utils/haptics'
import {
  CourseSwitcherModal,
  CAREER_TRACKS,
} from '../components/game/CourseSwitcherModal'
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
  CaretUp,
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
} from '@phosphor-icons/react'
import type { Station, Chapter } from '../types/roadmap'
import type { QuestSummary } from '../types/quest'

// Fallback curriculum units if backend is offline
const FALLBACK_STATIONS: Station[] = [
  {
    id: 'st-01-go-foundations',
    roadmap_id: 'default-go-roadmap',
    station_number: 1,
    title: 'Fondasi Sintaks Go & Memory Pointer',
    chip_label: 'GO 01',
    description: 'Fondasi kompilasi, strict typing, slice, map, dan alokasi memori pointer.',
    order_index: 1,
    is_unlocked: true,
    is_completed: true,
    progress_rate: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    chapters: [
      {
        id: 'ch-01-syntax-variables',
        station_id: 'st-01-go-foundations',
        chapter_number: 1,
        title: 'Variabel, Tipe Data & Control Flow',
        description: 'Deklarasi variabel, primitive types, loop for, dan idiomatic if/else.',
        order_index: 1,
        is_unlocked: true,
        is_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        quests: [
          {
            id: 'part-1-variabel-dan-tipe-data',
            chapter_id: 'ch-01-syntax-variables',
            station_number: 1,
            chapter_number: 1,
            title: 'Variabel & Primitive Types Go',
            chip_label: 'GO 01',
            type: 'main',
            difficulty: 'Pemula',
            xp_reward: 50,
            estimated_minutes: 10,
            order_index: 1,
            status: 'completed',
          },
        ],
      },
    ],
  },
  {
    id: 'st-02-go-oop-error',
    roadmap_id: 'default-go-roadmap',
    station_number: 2,
    title: 'Struct, Abstraksi Interface & Error Handling',
    chip_label: 'GO 02',
    description: 'Pola komposisi struct, idiomatic error return, dan custom error types standar Tokyo.',
    order_index: 2,
    is_unlocked: true,
    is_completed: true,
    progress_rate: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    chapters: [
      {
        id: 'ch-02-struct-interface',
        station_id: 'st-02-go-oop-error',
        chapter_number: 1,
        title: 'Struct Methods & Interface Abstraction',
        description: 'Implicit interface implementation dan receiver function.',
        order_index: 1,
        is_unlocked: true,
        is_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        quests: [
          {
            id: 'part-2-pointer-dan-struktur-data',
            chapter_id: 'ch-02-struct-interface',
            station_number: 2,
            chapter_number: 1,
            title: 'Pointer & Struktur Data Memory',
            chip_label: 'GO 02',
            type: 'main',
            difficulty: 'Pemula',
            xp_reward: 50,
            estimated_minutes: 12,
            order_index: 1,
            status: 'completed',
          },
        ],
      },
    ],
  },
  {
    id: 'st-03-gin-rest-api',
    roadmap_id: 'default-go-roadmap',
    station_number: 3,
    title: 'Sintaks Go & Gin REST API Engine',
    chip_label: 'GIN 01',
    description: 'Routing engine, JWT middleware auth guard, DTO model binding, dan Clean Architecture.',
    order_index: 3,
    is_unlocked: true,
    is_completed: false,
    progress_rate: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    chapters: [
      {
        id: 'ch-03-gin-router',
        station_id: 'st-03-gin-rest-api',
        chapter_number: 1,
        title: 'Gin Engine & REST Endpoint Setup',
        description: 'Inisialisasi router, parameter binding, dan JSON envelope.',
        order_index: 1,
        is_unlocked: true,
        is_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        quests: [
          {
            id: 'part-3-gin-routing-engine',
            chapter_id: 'ch-03-gin-router',
            station_number: 3,
            chapter_number: 1,
            title: 'Setup Gin Router & Endpoints',
            chip_label: 'GIN 01',
            type: 'main',
            difficulty: 'Menengah',
            xp_reward: 50,
            estimated_minutes: 15,
            order_index: 1,
            status: 'completed',
          },
        ],
      },
      {
        id: 'ch-04-jwt-middleware',
        station_id: 'st-03-gin-rest-api',
        chapter_number: 2,
        title: 'JWT Middleware & Auth Guard Tokyo',
        description: 'Header parsing, token verification, dan context injection.',
        order_index: 2,
        is_unlocked: true,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        quests: [
          {
            id: 'part-4-routing-dan-jwt-middleware',
            chapter_id: 'ch-04-jwt-middleware',
            station_number: 3,
            chapter_number: 2,
            title: 'JWT Middleware & Auth Guard Tokyo',
            chip_label: 'GIN 02',
            type: 'main',
            difficulty: 'Menengah',
            xp_reward: 50,
            estimated_minutes: 15,
            order_index: 2,
            status: 'available',
          },
          {
            id: 'part-5-database-connection-pool',
            chapter_id: 'ch-04-jwt-middleware',
            station_number: 3,
            chapter_number: 2,
            title: 'Database Connection Pool Pgx',
            chip_label: 'GIN 03',
            type: 'main',
            difficulty: 'Menengah',
            xp_reward: 50,
            estimated_minutes: 20,
            order_index: 3,
            status: 'locked',
          },
        ],
      },
    ],
  },
  {
    id: 'st-04-concurrency-channels',
    roadmap_id: 'default-go-roadmap',
    station_number: 4,
    title: 'Concurrency Engine & Worker Pool',
    chip_label: 'CONC 01',
    description: 'Goroutines, buffered channels, select timeout, dan worker pool pattern.',
    order_index: 4,
    is_unlocked: false,
    is_completed: false,
    progress_rate: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    chapters: [
      {
        id: 'ch-05-worker-pool',
        station_id: 'st-04-concurrency-channels',
        chapter_number: 1,
        title: 'High-Concurrency Worker Pool',
        description: 'Distribusi beban pemrosesan batching async di server Tokyo.',
        order_index: 1,
        is_unlocked: false,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        quests: [
          {
            id: 'part-6-worker-pool-concurrency',
            chapter_id: 'ch-05-worker-pool',
            station_number: 4,
            chapter_number: 1,
            title: 'Worker Pool & Concurrency Engine',
            chip_label: 'CONC 01',
            type: 'main',
            difficulty: 'Sulit',
            xp_reward: 100,
            estimated_minutes: 25,
            order_index: 1,
            status: 'locked',
          },
        ],
      },
    ],
  },
  {
    id: 'st-05-tokyo-capstone',
    roadmap_id: 'default-go-roadmap',
    station_number: 5,
    title: 'Microservices & Capstone Portofolio',
    chip_label: 'CLOUD 01',
    description: 'Docker multi-stage, container deployment, dan verifikasi portofolio Tokyo.',
    order_index: 5,
    is_unlocked: false,
    is_completed: false,
    progress_rate: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    chapters: [],
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

  // Sync track when route parameter changes
  useEffect(() => {
    if (routeTrack && routeTrack !== activeTrack) {
      setActiveTrack(routeTrack)
    }
  }, [routeTrack, activeTrack])

  const { roadmap, overallProgress, isLoading } = useRoadmap(activeTrack)

  const [searchQuery, setSearchQuery] = useState('')
  const [expandedStationIds, setExpandedStationIds] = useState<Set<string>>(() => new Set(['st-03-gin-rest-api']))
  const [activitySummary, setActivitySummary] = useState<UserActivitySummary | null>(null)

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

  const toggleStation = (stationId: string) => {
    triggerHaptic('tap')
    setExpandedStationIds((prev) => {
      const next = new Set(prev)
      if (next.has(stationId)) {
        next.delete(stationId)
      } else {
        next.add(stationId)
      }
      return next
    })
  }

  // Stations source: Prefer API roadmap stations, fallback to structured offline data
  const stations: Station[] = useMemo(() => {
    if (roadmap?.stations && roadmap.stations.length > 0) {
      return roadmap.stations
    }
    return FALLBACK_STATIONS
  }, [roadmap])

  // Aggregate Quests Metrics
  const { totalQuests, completedQuests, activeQuestInfo } = useMemo(() => {
    let total = 0
    let completed = 0
    let firstActive: { quest: QuestSummary; station: Station; chapter: Chapter } | null = null

    for (const st of stations) {
      for (const ch of st.chapters || []) {
        for (const q of ch.quests || []) {
          total++
          if (q.status === 'completed') {
            completed++
          } else if (!firstActive && st.is_unlocked) {
            firstActive = { quest: q, station: st, chapter: ch }
          }
        }
      }
    }

    // Default fallback active quest if everything completed or none found
    if (!firstActive && stations.length > 0) {
      const st = stations[0]
      const ch = st.chapters?.[0]
      const q = ch?.quests?.[0]
      if (q && ch) {
        firstActive = { quest: q, station: st, chapter: ch }
      }
    }

    return { totalQuests: total, completedQuests: completed, activeQuestInfo: firstActive }
  }, [stations])

  // Real calculated progress percentage (avoids contradictory 0% vs 3/6 completed)
  const computedProgressPercent = useMemo(() => {
    if (totalQuests === 0) return overallProgress || 0
    return Math.min(100, Math.round((completedQuests / totalQuests) * 100))
  }, [totalQuests, completedQuests, overallProgress])

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

  // Filter stations based on search query
  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return stations
    const q = searchQuery.toLowerCase()
    return stations.filter((st) => {
      const matchTitle = st.title.toLowerCase().includes(q)
      const matchDesc = st.description?.toLowerCase().includes(q)
      const matchChapter = (st.chapters || []).some(
        (ch) =>
          ch.title.toLowerCase().includes(q) ||
          (ch.quests || []).some((quest) => quest.title.toLowerCase().includes(q))
      )
      return matchTitle || matchDesc || matchChapter
    })
  }, [stations, searchQuery])

  // User Stats (Clean SSOT)
  const userXp = user?.xp ? user.xp.toLocaleString() : '0'
  const userStreak = user?.streak || 1
  const userName = user?.name ? user.name.split(' ')[0] : user?.username || 'Developer'
  const userLevel = user?.current_level || 1

  // Handle track switch from CourseSwitcherModal
  const handleSelectTrack = (trackSlug: string) => {
    triggerHaptic('success')
    setActiveTrack(trackSlug)
    setIsCourseSwitcherOpen(false)
    navigate(`/roadmap/${trackSlug}`)
  }

  // Helper to sanitize chip labels and prevent "STN-01 • STN-01 • GO" duplication
  const getCleanUnitChip = (station: Station) => {
    const rawChip = station.chip_label || ''
    // Strip redundant "STN-XX • " if already present in raw string
    const cleanLabel = rawChip.replace(/^STN-\d+\s*•\s*/i, '').trim()
    return `UNIT 0${station.station_number} • ${cleanLabel || 'MODUL'}`
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
                    style={{ width: `${computedProgressPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-brand font-black text-slate-700 whitespace-nowrap">
                  {completedQuests}/{totalQuests} Sesi ({computedProgressPercent}%)
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
                  placeholder="Cari modul, sintaks, materi..."
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

          {/* ── 2. SPOTLIGHT HERO BANNER (UNIT AKTIF PENGEMBANGAN) ── */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 border-2 border-blue-200 p-5 sm:p-7 shadow-xs relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 w-full lg:w-auto">
              {/* Kodi Mascot with 3D Drop Glow */}
              <div className="relative flex flex-col items-center justify-center shrink-0 group">
                <div className="w-24 h-6 bg-blue-300/40 rounded-[50%] absolute -bottom-1.5 z-0 blur-[2px]" />
                <img
                  src={doodleCoding}
                  alt="Kodi Coding"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative z-10 select-none drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-1"
                />
              </div>

              {/* Narrative & Active Unit Information */}
              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <SpeechBubble direction="left" variant="light" className="shadow-2xs py-1.5 px-3 max-w-md">
                  <span className="text-xs font-bold text-slate-800">
                    Sugoi, <strong className="text-blue-600">{userName}-san</strong>! 🏙️ Siap menaklukkan kurikulum spesialisasi hari ini!
                  </span>
                </SpeechBubble>

                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="bg-blue-600 text-white font-brand font-black text-[10px] px-2.5 py-0.5 rounded-lg shadow-2xs">
                      UNIT 0{activeQuestInfo?.station.station_number || 1} • {activeQuestInfo?.quest.chip_label || 'AKTIF'}
                    </span>
                    <span className="text-xs font-black text-blue-700">
                      {completedQuests} dari {totalQuests} Sesi Tuntas ({computedProgressPercent}%)
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-brand font-black text-slate-900 tracking-tight">
                    {activeQuestInfo?.station.title || 'Modul Spesialisasi Industri'}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    {activeQuestInfo
                      ? `Bab ${activeQuestInfo.chapter.chapter_number}: ${activeQuestInfo.quest.title} • Estimasi ${activeQuestInfo.quest.estimated_minutes} Menit`
                      : 'Selamat! Seluruh materi modul kurikulum telah terselesaikan dengan sempurna.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Action: Lanjutkan Belajar 3D CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end gap-2.5 shrink-0 w-full sm:w-auto relative z-10">
              <Button3D
                variant="blue"
                size="md"
                onClick={() => {
                  triggerHaptic('success')
                  navigate(`/learn/${activeQuestInfo?.quest.id || 'part-1-variabel-dan-tipe-data'}`)
                }}
                className="w-full sm:w-auto text-xs px-6 py-3 shadow-[0_4px_0_0_#1D4ED8]"
              >
                <span>LANJUTKAN BELAJAR ▶</span>
              </Button3D>
              <Link
                to="/dashboard"
                onClick={() => triggerHaptic('tap')}
                className="text-[11px] font-brand font-bold text-slate-500 hover:text-blue-600 transition-colors"
              >
                ← Kembali ke Peta S-Curve Dasbor
              </Link>
            </div>
          </div>

          {/* ── 3. LIST OF CURRICULUM UNITS (DUOLINGO 3D TACTILE ACCORDION) ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-brand font-black text-base text-slate-900 tracking-tight">
                  Daftar Unit Kurikulum ({stations.length} Unit Utama)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Pelajari modul berurutan dari dasar hingga siap diverifikasi oleh engineering lead Tokyo.
                </p>
              </div>

              {filteredStations.length > 0 && (
                <span className="text-xs font-brand font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-xl">
                  {stations.filter((s) => s.is_completed).length} Unit Lulus ✓
                </span>
              )}
            </div>

            {isLoading && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs font-semibold animate-pulse">
                Memuat silabus kurikulum spesialisasi...
              </div>
            )}

            {!isLoading && filteredStations.length === 0 && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs">
                Tidak ada unit atau modul yang cocok dengan pencarian &quot;{searchQuery}&quot;.
              </div>
            )}

            {filteredStations.map((station) => {
              const isExpanded = expandedStationIds.has(station.id)
              const stationQuests = (station.chapters || []).flatMap((c) => c.quests || [])
              const stationTotalXp = stationQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0)
              const stationCompletedQuests = stationQuests.filter((q) => q.status === 'completed').length
              const cleanUnitTag = getCleanUnitChip(station)

              return (
                <div
                  key={station.id}
                  className={`bg-white rounded-3xl transition-all duration-200 ${
                    station.is_completed
                      ? 'border-2 border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:border-slate-300'
                      : station.is_unlocked
                      ? 'border-2 border-blue-500 p-5 sm:p-6 shadow-sm ring-4 ring-blue-500/10'
                      : 'border-2 border-slate-200/80 p-4 sm:p-5 opacity-80 bg-slate-50/60'
                  }`}
                >
                  {/* Unit Header Bar (Clickable Toggle) */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                    onClick={() => toggleStation(station.id)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                          station.is_completed
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                            : station.is_unlocked
                            ? 'bg-blue-600 text-white shadow-[0_3px_0_0_#1D4ED8]'
                            : 'bg-slate-100 border border-slate-200 text-slate-400'
                        }`}
                      >
                        {station.is_completed ? (
                          <Medal weight="fill" className="w-6 h-6" />
                        ) : station.is_unlocked ? (
                          <Sparkle weight="fill" className="w-6 h-6" />
                        ) : (
                          <LockSimple weight="bold" className="w-6 h-6" />
                        )}
                      </div>

                      <div className="space-y-0.5 truncate">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs ${
                              station.is_completed
                                ? 'bg-slate-100 text-slate-700'
                                : station.is_unlocked
                                ? 'bg-blue-600 text-white font-black'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {cleanUnitTag}
                          </span>
                          <span
                            className={`text-xs font-black ${
                              station.is_completed
                                ? 'text-emerald-700'
                                : station.is_unlocked
                                ? 'text-blue-700'
                                : 'text-slate-500'
                            }`}
                          >
                            {stationCompletedQuests}/{stationQuests.length || 1} Sesi ({Math.round(station.progress_rate || 0)}%)
                          </span>
                        </div>
                        <h4 className="font-brand font-black text-sm sm:text-base text-slate-900 truncate">
                          {station.title}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {station.description || 'Modul kurikulum terpadu berstandar industri koding Tokyo'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <span className="bg-amber-50 text-amber-800 font-black text-xs px-3 py-1 rounded-full border border-amber-200/80 flex items-center gap-1 shadow-2xs">
                        <Lightning weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                        <span>+{stationTotalXp || 200} XP</span>
                      </span>

                      {station.is_completed ? (
                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 font-black text-xs px-3 py-1 rounded-full border border-emerald-200">
                          <Check weight="bold" className="w-3.5 h-3.5" />
                          <span>LULUS</span>
                          <DoodleHanko text="合格" className="w-5 h-5 ml-1" />
                        </div>
                      ) : station.is_unlocked ? (
                        <button
                          type="button"
                          className="bg-blue-600 text-white font-brand font-black text-xs px-3 py-1.5 rounded-xl shadow-[0_2.5px_0_0_#1D4ED8] flex items-center gap-1.5 transition-all"
                        >
                          <span>{isExpanded ? 'TUTUP UNIT' : 'BUKA UNIT'}</span>
                          {isExpanded ? <CaretUp weight="bold" className="w-3.5 h-3.5" /> : <CaretDown weight="bold" className="w-3.5 h-3.5" />}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 bg-slate-100 text-slate-500 font-bold text-xs px-3 py-1 rounded-full border border-slate-200">
                          <LockSimple weight="bold" className="w-3.5 h-3.5" />
                          <span>TERKUNCI</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Chapters & Coding Slices */}
                  {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                      {(station.chapters || []).map((chapter) => (
                        <div key={chapter.id} className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-brand font-black text-slate-700">
                              Bab {chapter.chapter_number}: {chapter.title}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {chapter.description}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {(chapter.quests || []).map((quest) => {
                              const isCompleted = quest.status === 'completed'
                              const isAvailable = quest.status === 'available' || (station.is_unlocked && !isCompleted)

                              return (
                                <div
                                  key={quest.id}
                                  className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                                    isCompleted
                                      ? 'bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50'
                                      : isAvailable
                                      ? 'bg-blue-50/50 border-2 border-blue-400 shadow-2xs'
                                      : 'bg-white border border-slate-200/60 opacity-60'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <span
                                      className={`w-7 h-7 rounded-xl font-brand font-black text-xs flex items-center justify-center shrink-0 ${
                                        isCompleted
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : isAvailable
                                          ? 'bg-blue-600 text-white shadow-2xs'
                                          : 'bg-slate-100 text-slate-500'
                                      }`}
                                    >
                                      {isCompleted ? '✓' : `0${quest.order_index}`}
                                    </span>
                                    <div className="truncate">
                                      <div className="flex items-center gap-2">
                                        <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                                          {quest.chip_label}
                                        </span>
                                        <span
                                          className={`text-xs sm:text-sm font-brand font-bold truncate ${
                                            isAvailable ? 'text-blue-950 font-black' : 'text-slate-800'
                                          }`}
                                        >
                                          {quest.title}
                                        </span>
                                      </div>
                                      <span className="text-[11px] text-slate-500 font-medium">
                                        {quest.difficulty} • Estimasi {quest.estimated_minutes} Menit
                                      </span>
                                    </div>
                                  </div>

                                  <div className="shrink-0">
                                    {isCompleted ? (
                                      <span className="text-xs font-brand font-black text-emerald-600 flex items-center gap-1">
                                        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500" />
                                        <span>✓ Selesai (+{quest.xp_reward} XP)</span>
                                      </span>
                                    ) : isAvailable ? (
                                      <Button3D
                                        variant="blue"
                                        size="sm"
                                        onClick={() => {
                                          triggerHaptic('tap')
                                          navigate(`/learn/${quest.id}`)
                                        }}
                                        className="text-xs px-3.5 py-1.5 shadow-[0_3px_0_0_#1D4ED8]"
                                      >
                                        Mulai Koding ▶
                                      </Button3D>
                                    ) : (
                                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                        <LockSimple weight="bold" className="w-3.5 h-3.5" />
                                        <span>Terkunci</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}

                      {/* Unit Capstone Project Challenge */}
                      <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                            <Trophy weight="fill" className="w-4 h-4" />
                          </span>
                          <div className="truncate">
                            <span className="text-xs font-brand font-black text-amber-950 block truncate">
                              Capstone Challenge: Verifikasi Portofolio Unit 0{station.station_number}
                            </span>
                            <span className="text-[10px] text-amber-800 font-bold">
                              Validasi kode standar Shibuya & persiapan kurikulum sponsor visa Tokyo
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-brand font-black text-amber-900 shrink-0 bg-amber-200/80 px-2.5 py-1 rounded-xl">
                          +200 XP ⚡
                        </span>
                      </div>
                    </div>
                  )}
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
                <span className="font-brand font-black text-blue-600">{Math.max(65, computedProgressPercent)}% / 100%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#1D4ED8]"
                  style={{ width: `${Math.max(65, computedProgressPercent)}%` }}
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

          {/* ── 3. CAREER PORTFOLIO SHORTCUT CARD ── */}
          <div className="border-2 border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-3 shadow-2xs bg-gradient-to-b from-white to-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <Briefcase weight="bold" className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-brand font-black text-xs text-slate-900">Portofolio Tokyo IT</h4>
                <p className="text-[10px] text-slate-500">Proyek GitHub standar Shibuya</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Setiap unit kurikulum menghasilkan 1 repositori portofolio siap review untuk wawancara kerja teknis di Tokyo.
            </p>

            <Link
              to="/career"
              onClick={() => triggerHaptic('tap')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-400 rounded-2xl text-xs font-brand font-black text-blue-600 transition-all shadow-2xs cursor-pointer group"
            >
              <span>Lihat Status Portofolio</span>
              <ArrowSquareOut weight="bold" className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </aside>
      </div>

      {/* ── 4. TRACK SWITCHER MODAL (PORTAL) ── */}
      <CourseSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
      />
    </div>
  )
}
