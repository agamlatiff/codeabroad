import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { useRoadmap } from '../hooks/useRoadmap'
import { Button3D } from '../components/ui/Button3D'
import { triggerHaptic } from '../utils/haptics'
import { audioEngine } from '../utils/audio'
import {
  CourseSwitcherModal,
  GameSidebarRail,
  GameTopBar,
} from '../components/game'
import {
  LockSimple,
  CaretDown,
  Sparkle,
  Lightning,
  Play,
  BookOpen,
  CaretUp,
  CheckFat,
  Trophy,
} from '@phosphor-icons/react'
import { UnitGuidebookModal } from '../components/game/UnitGuidebookModal'
import type { GuidebookContent } from '../components/game/UnitGuidebookModal'
import { TokyoLeaderboardModal } from '../components/game/TokyoLeaderboardModal'

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
  const { user } = useAuthStore()

  // Track state management
  const [activeTrack, setActiveTrack] = useState(() => {
    return routeTrack || user?.primary_stack || user?.career_path?.slug || 'golang'
  })
  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const [guidebookModalUnit, setGuidebookModalUnit] = useState<GuidebookContent | null>(null)
  const [collapsedUnitIds, setCollapsedUnitIds] = useState<Set<string>>(new Set())

  const toggleUnitCollapse = (unitId: string) => {
    triggerHaptic('tap')
    setCollapsedUnitIds((prev) => {
      const next = new Set(prev)
      if (next.has(unitId)) {
        next.delete(unitId)
      } else {
        next.add(unitId)
      }
      return next
    })
  }

  const handleOpenGuidebook = (unit: SequentialCurriculumUnit) => {
    triggerHaptic('tap')
    audioEngine.playPop()

    const GUIDEBOOK_DATA: Record<string, GuidebookContent> = {
      'unit-1-fondasi-go': {
        unitNumber: 1,
        unitTag: 'SINTAKS DASAR & MEMORI POINTER',
        title: 'Unit 1: Fondasi Sintaks Go & Memory Pointer',
        summary:
          'Go mengalokasikan variabel pada stack secara default dan memindahkannya ke heap hanya saat lolos analisis escape (escape analysis). Memahami pointer (& dan *) sangat penting untuk menghindari alokasi payload berlebih saat memanggil fungsi atau method.',
        codeSnippetTitle: 'Manipulasi Pointer & Alokasi Memori Tanpa Copy',
        codeSnippet: `package main\n\nimport "fmt"\n\ntype TokyoEngineer struct {\n    Name  string\n    Track string\n    Level int\n}\n\nfunc promoteLevel(eng *TokyoEngineer) {\n    // Dereferencing pointer langsung memodifikasi nilai memori asli\n    eng.Level++\n}\n\nfunc main() {\n    dev := TokyoEngineer{Name: "Kodi", Track: "Go Backend", Level: 1}\n    promoteLevel(&dev)\n    fmt.Println(dev.Level) // Output: 2 (zero payload copy)\n}`,
        codeExplanation:
          'Dengan meneruskan address &dev ke fungsi promoteLevel, kita menghindari overhead copy struct pada memori stack CPU.',
        nihongoTerms: [
          { term: '朝会 (Asakai)', reading: 'あさかい', meaning: 'Daily Standup Meeting pagi hari' },
          { term: '実装 (Jissou)', reading: 'じっそう', meaning: 'Implementasi / Coding fitur' },
          { term: '修正 (Shuusei)', reading: 'しゅうせい', meaning: 'Perbaikan bug / Revisi kode' },
        ],
        tokyoIndustryTip:
          'Di code review perusahaan Tokyo (seperti Mercari atau Rakuten), selalu utamakan pointer receiver untuk method yang memodifikasi state struct atau struct berukuran besar.',
      },
      'unit-2-gin-rest-api': {
        unitNumber: 2,
        unitTag: 'REST API & CLEAN ARCHITECTURE',
        title: 'Unit 2: Gin REST API & Middleware Engine',
        summary:
          'Gin menggunakan Radix Tree Routing berkecepatan tinggi dengan memory footprint yang minimal. Middleware chaining memungkinkan authentication guard JWT dan graceful error recovery sebelum request sampai ke controller layer.',
        codeSnippetTitle: 'Standard Gin Router & JWT Auth Middleware',
        codeSnippet: `func AuthGuard(secret string) gin.HandlerFunc {\n    return func(c *gin.Context) {\n        auth := c.GetHeader("Authorization")\n        if !strings.HasPrefix(auth, "Bearer ") {\n            c.AbortWithStatusJSON(401, gin.H{"error": "Unauthorized"})\n            return\n        }\n        token := strings.TrimPrefix(auth, "Bearer ")\n        claims, err := parseJWT(token, secret)\n        if err != nil {\n            c.AbortWithStatusJSON(401, gin.H{"error": "Invalid Token"})\n            return\n        }\n        c.Set("userID", claims.UserID)\n        c.Next()\n    }\n}`,
        codeExplanation:
          'Fungsi c.AbortWithStatusJSON() menghentikan pipeline middleware seketika, mencegah unauthorized request menyentuh logic handler.',
        nihongoTerms: [
          { term: '本番環境 (Honban Kankyou)', reading: 'ほんばんかんきょう', meaning: 'Production Environment' },
          { term: '不具合 (Fuguai)', reading: 'ふぐあい', meaning: 'Bug / Defect sistem' },
          { term: '確認 (Kakunin)', reading: 'かくにん', meaning: 'Konfirmasi / Verification' },
        ],
        tokyoIndustryTip:
          'Selalu gunakan standard response envelope (success, message, data, error) agar mudah diintegrasikan dengan frontend TypeScript web app.',
      },
      'unit-3-concurrency': {
        unitNumber: 3,
        unitTag: 'GOROUTINE & CHANNEL PIPELINE',
        title: 'Unit 3: Goroutine, Channel & Concurrency Patterns',
        summary:
          'Concurrency di Go menganut prinsip CSP (Communicating Sequential Processes): Jangan berkomunikasi dengan membagi memori, melainkan bagikan memori dengan berkomunikasi melalui Channels.',
        codeSnippetTitle: 'Worker Pool Pattern dengan Buffered Channels',
        codeSnippet: `func worker(id int, jobs <-chan int, results chan<- int) {\n    for j := range jobs {\n        results <- j * 2\n    }\n}\n\nfunc main() {\n    jobs := make(chan int, 100)\n    results := make(chan int, 100)\n    for w := 1; w <= 3; w++ {\n        go worker(w, jobs, results)\n    }\n}`,
        codeExplanation:
          'Buffered channel mencegah blocking yang tidak diinginkan dan membatasi jumlah goroutine simultan agar tidak terjadi memory leak.',
        nihongoTerms: [
          { term: '共有 (Kyouyuu)', reading: 'きょうゆう', meaning: 'Share / Berbagi informasi' },
          { term: '同期 (Douki)', reading: 'どうき', meaning: 'Synchronous' },
          { term: '非同期 (Hidouki)', reading: 'ひどうき', meaning: 'Asynchronous' },
        ],
        tokyoIndustryTip:
          'Tes wawancara teknis senior backend di Tokyo kerap menguji penanganan context.Context timeout dan pencegahan goroutine leak.',
      },
      'unit-4-postgres-dan-pgx': {
        unitNumber: 4,
        unitTag: 'POSTGRESQL & PGX CONNECTION POOL',
        title: 'Unit 4: Database Pooling Pgx & Clean Architecture',
        summary:
          'Menggunakan pgxpool untuk mengelola koneksi database secara efisien dengan prepared statements, database migrations, dan pemisahan layer Entity, Repository, Usecase, dan Handler.',
        codeSnippetTitle: 'Clean Architecture Repository Interface & Pgxpool',
        codeSnippet: `type UserRepository interface {\n    GetByID(ctx context.Context, id string) (*domain.User, error)\n}\n\ntype pgUserRepo struct {\n    pool *pgxpool.Pool\n}\n\nfunc (r *pgUserRepo) GetByID(ctx context.Context, id string) (*domain.User, error) {\n    var u domain.User\n    err := r.pool.QueryRow(ctx, "SELECT id, name FROM users WHERE id=$1", id).Scan(&u.ID, &u.Name)\n    return &u, err\n}`,
        codeExplanation:
          'Pemisahan interface di domain layer memudahkan testing menggunakan mock repository tanpa perlu database nyata saat unit test.',
        nihongoTerms: [
          { term: '設計 (Sekkei)', reading: 'せっけい', meaning: 'Software Architecture / Design' },
          { term: '移行 (Ikou)', reading: 'いこう', meaning: 'Database Migration' },
          { term: '障害 (Shougai)', reading: 'しょうがい', meaning: 'System Outage / Incident' },
        ],
        tokyoIndustryTip:
          'Standar Clean Architecture diakui secara luas oleh tech lead di Tokyo karena mempermudah kolaborasi multi-engineer berskala besar.',
      },
    }

    const fallbackGuidebook: GuidebookContent = {
      unitNumber: unit.unitNumber,
      unitTag: unit.tag,
      title: unit.title,
      summary: unit.description,
      codeSnippetTitle: `Contoh Sintaks & Best Practice: Unit 0${unit.unitNumber}`,
      codeSnippet: `// Contoh implementasi untuk ${unit.title}\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("CodeAbroad Tokyo Curriculum - Unit 0${unit.unitNumber}")\n}`,
      codeExplanation:
        'Pahami pola penulisan kode di atas dan pastikan Anda menguji kode secara menyeluruh sebelum mengirim Pull Request.',
      nihongoTerms: [
        { term: '設計書 (Sekkeisho)', reading: 'せっけいしょ', meaning: 'Dokumen Spesifikasi / Architecture Design' },
        { term: '開発 (Kaihatsu)', reading: 'かいはつ', meaning: 'Software Development' },
        { term: 'テスト (Tesuto)', reading: 'てすと', meaning: 'Unit Testing & Quality Assurance' },
      ],
      tokyoIndustryTip:
        'Di industri rekrutmen Tokyo, pemahaman konseptual yang kokoh dinilai sama tingginya dengan kecepatan mengetik kode.',
      firstPartRoute: unit.parts[0]?.route,
    }

    setGuidebookModalUnit(GUIDEBOOK_DATA[unit.id] || fallbackGuidebook)
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

  const { isLoading } = useRoadmap(activeTrack)


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

  // First active part (next unlocked part)
  const nextActivePart = useMemo(() => {
    return allParts.find((p) => !completedQuestsSet.has(p.id)) || allParts[0]
  }, [allParts, completedQuestsSet])



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
          {/* ── 1. CLEAN CONTEXTUAL TOP BAR (SSOT - GameTopBar) ── */}
          <GameTopBar
            activeTrack={activeTrack}
            onOpenCourseSwitcher={() => setIsCourseSwitcherOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            completedCount={completedPartsCount}
            totalCount={totalPartsCount}
            progressPercent={curriculumProgressPercent}
            unitLabel="Modul"
          />

          {/* ── 2. DIRECT SEQUENTIAL TECHNICAL UNIT CARDS (IMMERSIVE UNIT STAGE) ── */}
          <div className="space-y-6 pt-1">
            {isLoading && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs font-semibold animate-pulse">
                Memuat silabus kurikulum spesialisasi...
              </div>
            )}

            {units.map((unit) => {
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

                      {/* Guidebook Button (Subtask 33.1) */}
                      <button
                        type="button"
                        onClick={() => handleOpenGuidebook(unit)}
                        className={`self-start sm:self-center px-4 py-2 rounded-xl text-xs font-brand font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${
                          isUnitCompleted || isUnitActive
                            ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 active:translate-y-0.5'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 active:translate-y-0.5'
                        }`}
                        title="Buka ringkasan teori, sintaks kode, dan kosakata unit"
                      >
                        <BookOpen weight="bold" className="w-4 h-4" />
                        <span>Buku Panduan Unit</span>
                      </button>

                      {/* Expand / Collapse Button (Subtask 33.3) */}
                      <button
                        type="button"
                        onClick={() => toggleUnitCollapse(unit.id)}
                        className={`self-start sm:self-center p-2 rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                          isUnitCompleted || isUnitActive
                            ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                        }`}
                        title={collapsedUnitIds.has(unit.id) ? 'Buka Sesi Unit' : 'Lipat Sesi Unit'}
                      >
                        {collapsedUnitIds.has(unit.id) ? (
                          <CaretDown weight="bold" className="w-4 h-4" />
                        ) : (
                          <CaretUp weight="bold" className="w-4 h-4" />
                        )}
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

                  {/* ── SEQUENTIAL PART BREAKDOWN (COLLAPSIBLE - Subtask 33.3) ── */}
                  {!collapsedUnitIds.has(unit.id) && (
                    <div className="p-4 sm:p-5 space-y-3 bg-white">
                      {unitParts.map((part) => {
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
                  )}

                  {/* Unit Milestone Trophy Badge (Subtask 33.4) */}
                  {isUnitCompleted && (
                    <div className="p-3.5 sm:p-4 bg-emerald-50/90 border-t-2 border-emerald-200/90 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Trophy weight="fill" className="w-4 h-4 text-amber-200" />
                        </div>
                        <div>
                          <span className="font-brand font-black text-emerald-950 block">
                            Unit 0{unit.unitNumber} Lulus 100%!
                          </span>
                          <span className="text-[11px] text-emerald-700 font-medium">
                            +{unit.totalXp} XP telah ditambahkan ke profil Anda.
                          </span>
                        </div>
                      </div>
                      <span className="bg-emerald-600 text-white font-brand font-black text-[10px] px-2.5 py-1 rounded-xl shadow-xs">
                        TERVERIFIKASI ✓
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (SSOT - Subtask 34.4) ══════ */}
        <GameSidebarRail activeTrack={activeTrack} />
      </div>

      {/* ── 3. DUOLINGO-STYLE COURSE SWITCHER MODAL ── */}
      <CourseSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
      />


      {/* ── TOKYO LEADERBOARD MODAL (Subtask 33.2) ── */}
      <TokyoLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* ── UNIT GUIDEBOOK MODAL (Subtask 33.1) ── */}
      <UnitGuidebookModal
        isOpen={guidebookModalUnit !== null}
        content={guidebookModalUnit}
        onClose={() => setGuidebookModalUnit(null)}
        onStartUnit={() => {
          if (guidebookModalUnit?.firstPartRoute) {
            navigate(guidebookModalUnit.firstPartRoute)
          }
        }}
      />
    </div>
  )
}
