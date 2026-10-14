import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { useRoadmap } from '../hooks/useRoadmap'
import { authService } from '../services/authService'
import type { UserActivitySummary } from '../types/auth'
import { TokyoPassportWidget } from '../components/game/TokyoPassportWidget'
import { Button3D } from '../components/ui/Button3D'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { DoodleHanko } from '../components/illustrations/doodles'
import doodleCoding from '../assets/kodi/doodle-coding.png'
import { triggerHaptic } from '../utils/haptics'
import {
  MagnifyingGlass,
  CalendarBlank,
  LockSimple,
  CaretDown,
  CaretUp,
  ArrowClockwise,
  Sparkle,
  Medal,
  Trophy,
  Fire,
  Star,
  Check,
  Lightning,
} from '@phosphor-icons/react'
import type { Station, Chapter } from '../types/roadmap'
import type { QuestSummary } from '../types/quest'

// Fallback curriculum stations if backend is offline
const FALLBACK_STATIONS: Station[] = [
  {
    id: 'st-01-go-foundations',
    roadmap_id: 'default-go-roadmap',
    station_number: 1,
    title: 'Fondasi Sintaks Go & Memory Pointer',
    chip_label: 'STN-01 • GO',
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
    chip_label: 'STN-02 • GO',
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
            title: 'Pointer & Struktur Data Memori',
            chip_label: 'GO 02',
            type: 'main',
            difficulty: 'Pemula',
            xp_reward: 50,
            estimated_minutes: 15,
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
    chip_label: 'STN-03 • GIN',
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
        title: 'Gin Routing & Request Binding',
        description: 'Inisialisasi Gin engine, group routes, dan validation tags.',
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
    chip_label: 'STN-04 • CONC',
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
    chip_label: 'STN-05 • CLOUD',
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

  const effectiveTrack = routeTrack || user?.primary_stack || user?.career_path?.slug || 'golang'
  const { roadmap, overallProgress, isLoading } = useRoadmap(effectiveTrack)

  const [searchQuery, setSearchQuery] = useState('')
  const [expandedStationIds, setExpandedStationIds] = useState<Set<string>>(() => new Set(['st-03-gin-rest-api']))
  const [activitySummary, setActivitySummary] = useState<UserActivitySummary | null>(null)

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

  // Day of week calculation for 7-day streak row
  const currentDayIndex = new Date().getDay() // 0 = Sun, 1 = Mon ... 6 = Sat
  const dayNames = ['M', 'S', 'S', 'R', 'K', 'J', 'S']

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex">
      {/* ── 1. LEFT NAV RAIL ── */}
      <NavRail />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8">
        {/* ══════ CENTER CONTENT STAGE ══════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 space-y-6">
          {/* ── 1. HEADER ROW ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🎌</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  {roadmap?.title || 'Silabus Kurikulum Spesialisasi'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Target Karier Tokyo 2026 • {stations.length} Stasiun Kurikulum • {totalQuests} Sesi Koding • {overallProgress}% Selesai 🚀
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Input */}
              <div className="relative w-56 sm:w-64">
                <MagnifyingGlass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari modul, sintaks, materi..."
                  className="w-full bg-white text-xs font-semibold pl-9 pr-4 py-2 rounded-2xl border-2 border-slate-200 focus:border-[#2563EB] focus:outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                />
              </div>

              {/* Game Status HUD */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-1.5 flex items-center gap-3 shadow-xs">
                <div className="flex items-center gap-1.5 font-black text-xs text-[#DC2626]">
                  <Fire weight="fill" className="w-4 h-4 text-orange-500" />
                  <span>{userStreak} Hari</span>
                </div>
                <div className="w-[1px] h-3.5 bg-slate-200" />
                <div className="flex items-center gap-1.5 font-black text-xs text-[#F59E0B]">
                  <Star weight="fill" className="w-4 h-4 text-amber-500" />
                  <span>{userXp} XP</span>
                </div>
                <div className="w-[1px] h-3.5 bg-slate-200" />
                <div className="flex items-center gap-1.5 font-black text-xs text-[#2563EB]">
                  <Sparkle weight="fill" className="w-3.5 h-3.5" />
                  <span>Lv. {userLevel} Kodi</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. HERO ACTIVE EXPEDITION UNIT (STAGE KODI) ── */}
          <div className="rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-white to-sky-50/70 border-2 border-[#BFDBFE] p-5 sm:p-7 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 w-full lg:w-auto">
              {/* Kodi Mascot with Glass Base */}
              <div className="relative flex flex-col items-center justify-center shrink-0 group">
                <div className="w-24 h-7 bg-blue-200/50 rounded-[50%] absolute -bottom-2 z-0 blur-[1px]" />
                <img
                  src={doodleCoding}
                  alt="Kodi Coding"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative z-10 select-none drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-1"
                />
              </div>

              {/* Narrative & Info */}
              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <SpeechBubble direction="left" variant="light" className="shadow-xs py-1.5 px-3 max-w-md">
                  <span className="text-xs font-bold text-slate-800">
                    Sugoi, <strong className="text-[#2563EB]">{userName}-san</strong>! 🏙️ Siap menaklukkan sesi koding hari ini!
                  </span>
                </SpeechBubble>

                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="bg-[#DBEAFE] text-[#1D4ED8] font-black text-[11px] px-2.5 py-0.5 rounded-md">
                      {activeQuestInfo
                        ? `STASIUN 0${activeQuestInfo.station.station_number} • ${activeQuestInfo.station.chip_label}`
                        : 'KURIKULUM TOKYO'}
                    </span>
                    <span className="text-[#047857] font-bold text-xs">
                      {completedQuests} dari {totalQuests} Sesi Tuntas ({overallProgress}%)
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
                    {activeQuestInfo?.station.title || 'Modul Spesialisasi Industri'}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    {activeQuestInfo
                      ? `Bab ${activeQuestInfo.chapter.chapter_number}: ${activeQuestInfo.quest.title} • Estimasi ${activeQuestInfo.quest.estimated_minutes} Menit`
                      : 'Selamat! Seluruh materi modul kurikulum telah terselesaikan.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Action */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end gap-2 shrink-0 w-full sm:w-auto relative z-10">
              <Button3D
                variant="blue"
                size="md"
                onClick={() => {
                  triggerHaptic('success')
                  navigate(`/learn/${activeQuestInfo?.quest.id || 'part-1-variabel-dan-tipe-data'}`)
                }}
                className="w-full sm:w-auto text-xs px-6 py-3 shadow-[0_4px_0_0_#1D4ED8]"
              >
                <span>LANJUTKAN KODING ▶</span>
              </Button3D>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  navigate('/dashboard')
                }}
                className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1 cursor-pointer py-1"
              >
                <ArrowClockwise className="w-3.5 h-3.5" />
                <span>Lihat Ringkasan Dashboard</span>
              </button>
            </div>
          </div>

          {/* ── 3. DYNAMIC SYLLABUS STATIONS ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
                <span>Peta Modul Ekspedisi Karier</span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  ({stations.length} Stasiun Utama)
                </span>
              </h3>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                    <ArrowClockwise className="w-3.5 h-3.5 animate-spin" />
                    <span>Memuat...</span>
                  </span>
                )}
                <span className="text-xs font-black text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                  {stations.filter((s) => s.is_completed).length} Stasiun Lulus ✓
                </span>
              </div>
            </div>

            {filteredStations.map((station) => {
              const isExpanded = expandedStationIds.has(station.id)
              const stationQuests = (station.chapters || []).flatMap((c) => c.quests || [])
              const stationTotalXp = stationQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0)
              const stationCompletedQuests = stationQuests.filter((q) => q.status === 'completed').length

              return (
                <div
                  key={station.id}
                  className={`bg-white rounded-3xl transition-all duration-200 ${
                    station.is_completed
                      ? 'border-2 border-slate-200/90 p-4 sm:p-5 shadow-xs hover:border-slate-300'
                      : station.is_unlocked
                      ? 'border-2 border-[#2563EB] p-5 sm:p-6 shadow-md shadow-blue-500/10 ring-4 ring-blue-500/10'
                      : 'border-2 border-slate-200 p-4 sm:p-5 opacity-75 bg-[#F8FAFC]'
                  }`}
                >
                  {/* Station Header Bar */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                    onClick={() => toggleStation(station.id)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          station.is_completed
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                            : station.is_unlocked
                            ? 'bg-blue-100 border border-blue-300 text-[#2563EB]'
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
                            className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
                              station.is_completed
                                ? 'bg-slate-100 text-slate-700'
                                : station.is_unlocked
                                ? 'bg-[#2563EB] text-white font-black'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            STN-0{station.station_number} • {station.chip_label}
                          </span>
                          <span
                            className={`text-xs font-black ${
                              station.is_completed
                                ? 'text-emerald-700'
                                : station.is_unlocked
                                ? 'text-[#2563EB]'
                                : 'text-slate-500'
                            }`}
                          >
                            {stationCompletedQuests}/{stationQuests.length || 1} Sesi ({Math.round(station.progress_rate || 0)}%)
                          </span>
                        </div>
                        <h4 className="font-black text-sm sm:text-base text-[#0F172A] truncate">
                          {station.title}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {station.description || 'Modul terpadu berstandar industri koding Tokyo'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <span className="bg-[#FFFBEB] text-[#B45309] font-black text-xs px-3 py-1 rounded-full border border-amber-200/60 flex items-center gap-1">
                        <Lightning weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                        <span>+{stationTotalXp || 400} XP</span>
                      </span>

                      {station.is_completed ? (
                        <div className="flex items-center gap-1 bg-[#DCFCE7] text-[#059669] font-black text-xs px-3 py-1 rounded-full border border-emerald-200">
                          <Check weight="bold" className="w-3.5 h-3.5" />
                          <span>LULUS</span>
                          <DoodleHanko text="合格" className="w-5 h-5 ml-1" />
                        </div>
                      ) : station.is_unlocked ? (
                        <span className="bg-[#2563EB] text-white font-black text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-xs">
                          <span>{isExpanded ? 'TUTUP BAB' : 'BUKA DAFTAR BAB'}</span>
                          {isExpanded ? <CaretUp weight="bold" className="w-3.5 h-3.5 ml-1" /> : <CaretDown weight="bold" className="w-3.5 h-3.5 ml-1" />}
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 font-black text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-200">
                          <LockSimple weight="bold" className="w-3.5 h-3.5" />
                          <span>TERKUNCI</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Chapters & Quests List */}
                  {isExpanded && (
                    <div className="space-y-4 pt-4 mt-4 border-t border-slate-100">
                      {(station.chapters || []).map((chapter) => (
                        <div key={chapter.id} className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <span>Bab {chapter.chapter_number}: {chapter.title}</span>
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {chapter.quests?.length || 0} Materi Praktik
                            </span>
                          </div>

                          <div className="space-y-2">
                            {(chapter.quests || []).map((quest) => {
                              const isCompleted = quest.status === 'completed'
                              const isAvailable = quest.status === 'available'

                              return (
                                <div
                                  key={quest.id}
                                  className={`rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-all ${
                                    isCompleted
                                      ? 'bg-[#F8FAFC] border border-slate-200/80'
                                      : isAvailable
                                      ? 'bg-[#EFF6FF] border-2 border-[#2563EB] shadow-xs'
                                      : 'bg-white border border-slate-200 opacity-60'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <span
                                      className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                                        isCompleted
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : isAvailable
                                          ? 'bg-[#2563EB] text-white shadow-xs'
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
                                          className={`text-xs sm:text-sm font-bold truncate ${
                                            isAvailable ? 'text-[#1E3A8A] font-black' : 'text-slate-800'
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
                                      <span className="text-xs font-black text-[#059669]">
                                        ✓ Selesai (+{quest.xp_reward} XP)
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
                                        Mulai Sekarang ▶
                                      </Button3D>
                                    ) : (
                                      <span className="text-xs font-bold text-slate-400">
                                        🔒 Terkunci
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}

                      {/* Station Capstone Badge */}
                      <div className="bg-[#FFFBEB] border-2 border-amber-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-xl bg-[#F59E0B] text-white font-black text-sm flex items-center justify-center shrink-0">
                            <Trophy weight="fill" className="w-4 h-4" />
                          </span>
                          <div className="truncate">
                            <span className="text-xs font-black text-amber-950 block truncate">
                              Boss Challenge: Verifikasi Kompetensi Stasiun 0{station.station_number}
                            </span>
                            <span className="text-[10px] text-amber-800 font-bold">
                              Kunci Validasi Portofolio Kerja Tokyo & Rekomendasi Visa
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#B45309] shrink-0 bg-amber-100 px-2.5 py-1 rounded-xl">
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
        <aside className="w-full xl:w-[354px] shrink-0 border-t-2 xl:border-t-0 xl:border-l-2 border-[#E2E8F0] bg-white p-5 sm:p-6 space-y-5">
          {/* ── 1. UNIFIED STREAK AND SCHEDULE CARD ── */}
          <div className="border-2 border-slate-200 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarBlank weight="bold" className="w-4 h-4 text-[#2563EB]" />
                <h4 className="font-black text-xs text-[#0F172A]">Streak & Jadwal Live</h4>
              </div>
              <span className="bg-[#FEF2F2] text-[#DC2626] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
                <Fire weight="fill" className="w-3.5 h-3.5 text-red-500" />
                <span>{userStreak} Hari Aktif</span>
              </span>
            </div>

            {/* 7 Days Row */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {(
                activitySummary?.weekly_logs && activitySummary.weekly_logs.length === 7
                  ? activitySummary.weekly_logs.map((log) => ({
                      dayOffset: log.day_index,
                      dayLabel: log.day_label,
                      isToday: log.is_today,
                      isActive: log.is_active,
                    }))
                  : [0, 1, 2, 3, 4, 5, 6].map((dayOffset) => ({
                      dayOffset,
                      dayLabel: dayNames[(dayOffset + 1) % 7],
                      isToday: dayOffset === (currentDayIndex === 0 ? 6 : currentDayIndex - 1),
                      isActive:
                        dayOffset < (currentDayIndex === 0 ? 6 : currentDayIndex - 1)
                          ? (currentDayIndex === 0 ? 6 : currentDayIndex - 1) - dayOffset < Math.max(1, userStreak)
                          : dayOffset === (currentDayIndex === 0 ? 6 : currentDayIndex - 1) && userStreak > 0,
                    }))
              ).map((day) => {
                return (
                  <div key={day.dayOffset} className="flex flex-col items-center gap-1">
                    <span className={`text-[9px] font-bold ${day.isToday ? 'text-[#0284C7]' : 'text-slate-400'}`}>
                      {day.dayLabel}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-[11px] transition-all ${
                        day.isActive
                          ? 'bg-[#10B981] text-white shadow-2xs'
                          : day.isToday
                          ? 'bg-[#2563EB] text-white shadow-xs ring-2 ring-blue-200'
                          : 'bg-[#F1F5F9] text-[#475569]'
                      }`}
                      title={day.isActive ? `${day.dayLabel}: Hari Aktif Belajar ✓` : day.isToday ? 'Hari Ini' : `${day.dayLabel}: Belum Belajar`}
                    >
                      {day.isActive ? '✓' : day.isToday ? '🔥' : '•'}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Live Event Notification Box */}
            <div className="bg-[#EFF6FF] border border-blue-200 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-[11px] font-black text-[#1E40AF]">
                  Mock Interview Tokyo (Zoom)
                </p>
                <p className="text-[10px] text-[#2563EB] font-semibold">
                  Besok • 09:00 JST (07:00 WIB)
                </p>
              </div>
              <button
                type="button"
                onClick={() => triggerHaptic('tap')}
                className="bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-[10px] px-2.5 py-1.5 rounded-xl shrink-0 cursor-pointer shadow-xs transition-all"
              >
                Ingatkan 🔔
              </button>
            </div>
          </div>

          {/* ── 2. SKILL COMPETENCIES CARD ── */}
          <div className="border-2 border-slate-200 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xs">
            <h4 className="font-black text-xs text-[#0F172A] flex items-center gap-1.5">
              <span>Kompetensi Standar Tokyo</span>
              <span className="text-xs">🇯🇵</span>
            </h4>

            <div className="space-y-2.5">
              {[
                { label: 'Golang Core & Memory Pointer', badge: 'Mahir 100%', bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]' },
                { label: 'Concurrency Engine & Channels', badge: 'Mahir 100%', bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]' },
                { label: 'REST API & Gin Framework', badge: 'Aktif 60%', bg: 'bg-[#DBEAFE]', text: 'text-[#2563EB]' },
                { label: 'PostgreSQL Pgxpool & GORM', badge: 'Berikutnya', bg: 'bg-[#F1F5F9]', text: 'text-[#94A3B8]' },
                { label: 'Business IT Nihongo N3', badge: 'Aktif 45%', bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]' },
              ].map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{skill.label}</span>
                  <span className={`${skill.bg} ${skill.text} font-black text-[10px] px-2.5 py-0.5 rounded-full`}>
                    {skill.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. TOKYO PASSPORT WIDGET ── */}
          <TokyoPassportWidget user={user} readinessScore={75} />
        </aside>
      </div>
    </div>
  )
}
