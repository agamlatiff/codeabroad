import { useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  Certificate,
  CheckCircle,
  Clock,
  Compass,
  GraduationCap,
  UserPlus,
  type Icon,
} from '@phosphor-icons/react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'
import {
  MeraPolyglotFigure,
  MeraSenseiFigure,
  MeraTimekeeperFigure,
  type MeraShowcaseMood,
} from '@/shared/components/ui/MeraShowcaseFigures'
import { triggerHaptic } from '@/shared/utils/haptics'

type GoalId = 'career' | 'study' | 'certification' | 'beginner'
type TrackCode = 'en-gb' | 'en-us' | 'ja' | 'de' | 'zh' | 'fr'

interface GoalTheme {
  tabBgClass: string
  pillBadgeClass: string
  stepBadgeClass: string
  connectorClass: string
  checkIconClass: string
  blobTint: string
  haloTint: string
}

interface GoalStageItem {
  stageLabel: string
  timeframe: string
  title: string
  description: string
  outcome: string
}

interface GoalTrackChip {
  code: TrackCode
  label: string
}

interface GoalRoadmapConfig {
  id: GoalId
  tabLabel: string
  TabIcon: Icon
  meraFigure: 'polyglot' | 'sensei' | 'timekeeper'
  meraMood: MeraShowcaseMood
  meraBadge: string
  badgeLabel: string
  personaHeadline: string
  personaSummary: string
  dailyRhythm: string
  estimatedHorizon: string
  theme: GoalTheme
  trackChips: readonly GoalTrackChip[]
  stages: readonly [GoalStageItem, GoalStageItem, GoalStageItem]
}

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const

const GOAL_ROADMAPS: readonly GoalRoadmapConfig[] = [
  {
    id: 'career',
    tabLabel: 'Karier Global',
    TabIcon: Briefcase,
    meraFigure: 'polyglot',
    meraMood: 'excited',
    meraBadge: 'Karier',
    badgeLabel: 'Jalur Profesional & Kerja Internasional',
    personaHeadline: 'Siap kerja, wawancara, dan komunikasi tim lintas negara',
    personaSummary:
      'Difokuskan untuk ekspatriat, pencari kerja luar negeri, dan profesional yang butuh komunikasi kerja natural.',
    dailyRhythm: '15–20 mnt/hari',
    estimatedHorizon: 'Target awal: 3–4 bulan',
    theme: {
      tabBgClass: 'bg-[#2563EB] shadow-[0_3px_10px_-2px_rgba(37,99,235,0.45)]',
      pillBadgeClass: 'bg-[#EFF6FF] border-blue-200/90 text-[#1D4ED8]',
      stepBadgeClass: 'bg-[#2563EB] text-white shadow-[0_3px_0_0_#1D4ED8]',
      connectorClass: 'from-[#BFDBFE] via-[#60A5FA] to-[#BFDBFE]',
      checkIconClass: 'text-[#2563EB]',
      blobTint: '#DBEAFE',
      haloTint: 'rgba(37, 99, 235, 0.14)',
    },
    trackChips: [
      { code: 'en-gb', label: 'IELTS' },
      { code: 'en-us', label: 'TOEFL' },
      { code: 'ja', label: 'JLPT N4–N2' },
      { code: 'de', label: 'Goethe B1–B2' },
      { code: 'zh', label: 'HSK 3–5' },
      { code: 'fr', label: 'DELF B1–B2' },
    ],
    stages: [
      {
        stageLabel: 'Tahap 1',
        timeframe: 'Minggu 1–3',
        title: 'Fondasi Ungkapan & Etika Kerja',
        description:
          'Bangun intonasi perkenalan formal, cara bertanya yang sopan, dan pembacaan aksara atau istilah dasar dunia kerja.',
        outcome: 'Mampu memperkenalkan diri & peran kerja secara profesional.',
      },
      {
        stageLabel: 'Tahap 2',
        timeframe: 'Bulan 1–2',
        title: 'Komunikasi Rapat & Email Profesional',
        description:
          'Latih kalimat terstruktur untuk menjadwalkan agenda, menyampaikan progres tim, dan menulis respons singkat yang lugas.',
        outcome: 'Mengikuti alur rapat harian & diskusi teknis tanpa gugup.',
      },
      {
        stageLabel: 'Tahap 3',
        timeframe: 'Bulan 3–4',
        title: 'Simulasi Wawancara & Kesiapan Penempatan',
        description:
          'Uji pemahaman mendengarkan aksen penutur asli dan susun argumen karier sesuai standar kerja negara tujuan.',
        outcome: 'Siap menghadapi wawancara user & lingkungan kantor global.',
      },
    ],
  },
  {
    id: 'study',
    tabLabel: 'Studi & Beasiswa',
    TabIcon: GraduationCap,
    meraFigure: 'sensei',
    meraMood: 'happy',
    meraBadge: 'Studi',
    badgeLabel: 'Jalur Akademik & Persiapan Kuliah',
    personaHeadline: 'Siapkan syarat bahasa untuk kampus impian dan beasiswa luar negeri',
    personaSummary:
      'Dirancang untuk calon mahasiswa S1/S2/S3 agar terbiasa membaca teks akademik dan berdiskusi di kelas internasional.',
    dailyRhythm: '20 mnt/hari',
    estimatedHorizon: 'Target awal: 3–5 bulan',
    theme: {
      tabBgClass: 'bg-[#0284C7] shadow-[0_3px_10px_-2px_rgba(2,132,199,0.42)]',
      pillBadgeClass: 'bg-[#F0F9FF] border-sky-200/90 text-[#0369A1]',
      stepBadgeClass: 'bg-[#0284C7] text-white shadow-[0_3px_0_0_#0369A1]',
      connectorClass: 'from-[#BAE6FD] via-[#38BDF8] to-[#BAE6FD]',
      checkIconClass: 'text-[#0284C7]',
      blobTint: '#E0F2FE',
      haloTint: 'rgba(2, 132, 199, 0.14)',
    },
    trackChips: [
      { code: 'en-gb', label: 'IELTS Academic' },
      { code: 'en-us', label: 'TOEFL iBT' },
      { code: 'ja', label: 'JLPT / EJU' },
      { code: 'de', label: 'Goethe / TestDaF' },
      { code: 'zh', label: 'HSK' },
      { code: 'fr', label: 'DELF / DALF' },
    ],
    stages: [
      {
        stageLabel: 'Tahap 1',
        timeframe: 'Minggu 1–4',
        title: 'Struktur Kalimat & Kosakata Akademik',
        description:
          'Pahami pola tata bahasa inti dengan kartu pengantar terstruktur sebelum masuk ke bacaan dan latihan menyimak.',
        outcome: 'Memahami kalimat penjelas, instruksi tugas, & istilah kampus.',
      },
      {
        stageLabel: 'Tahap 2',
        timeframe: 'Bulan 2–3',
        title: 'Membaca Kritis & Diskusi Seminar',
        description:
          'Latih membaca paragraf panjang, menangkap ide utama kuliah, dan menyusun opini terstruktur lengkap dengan alasan.',
        outcome: 'Terbiasa merangkum materi perkuliahan & memberi argumen.',
      },
      {
        stageLabel: 'Tahap 3',
        timeframe: 'Bulan 4–5',
        title: 'Pemantapan Ujian Bahasa & Adaptasi Kampus',
        description:
          'Kuatkan retensi kosakata akademik via jadwal ulasan adaptif dan latih percakapan seputar riset, asrama, & administrasi.',
        outcome: 'Percaya diri mengejar skor syarat beasiswa & daftar kampus.',
      },
    ],
  },
  {
    id: 'certification',
    tabLabel: 'Target Sertifikasi',
    TabIcon: Certificate,
    meraFigure: 'timekeeper',
    meraMood: 'pointing',
    meraBadge: 'JLPT',
    badgeLabel: 'Jalur Evaluasi Terukur & Target Skor',
    personaHeadline: 'Progres sistematis mengikuti kisi-kisi ujian resmi internasional',
    personaSummary:
      'Cocok untuk kamu yang mengejar sertifikat bahasa dengan peta materi per tingkat dan ulasan memori otomatis.',
    dailyRhythm: '15–30 mnt/hari',
    estimatedHorizon: 'Target awal: 2–4 bulan',
    theme: {
      tabBgClass: 'bg-[#059669] shadow-[0_3px_10px_-2px_rgba(5,150,105,0.4)]',
      pillBadgeClass: 'bg-[#ECFDF5] border-emerald-200/90 text-[#047857]',
      stepBadgeClass: 'bg-[#059669] text-white shadow-[0_3px_0_0_#047857]',
      connectorClass: 'from-[#A7F3D0] via-[#34D399] to-[#A7F3D0]',
      checkIconClass: 'text-[#059669]',
      blobTint: '#D1FAE5',
      haloTint: 'rgba(5, 150, 105, 0.14)',
    },
    trackChips: [
      { code: 'en-gb', label: 'IELTS' },
      { code: 'en-us', label: 'TOEFL' },
      { code: 'ja', label: 'JLPT N5–N1' },
      { code: 'de', label: 'Goethe A1–C1' },
      { code: 'zh', label: 'HSK 1–6' },
      { code: 'fr', label: 'DELF A1–C1' },
    ],
    stages: [
      {
        stageLabel: 'Tahap 1',
        timeframe: 'Minggu 1–2',
        title: 'Pemetaan Level & Penutupan Celah Dasar',
        description:
          'Mulai dari Unit 1 atau ikuti penempatan awal untuk mengunci daftar aksara, partikel, dan pola dasar sesuai standar ujian.',
        outcome: 'Peta kelemahan & prioritas materi tersusun jelas per unit.',
      },
      {
        stageLabel: 'Tahap 2',
        timeframe: 'Minggu 3–8',
        title: 'Latihan Terarah Tata Bahasa & Menyimak',
        description:
          'Ulangi pola soal yang sering menjebak lewat audio 0.6x pelan dan dek flashcard bertopik dengan pengingat otomatis.',
        outcome: 'Akurasi menjawab pola grammar & listening naik stabil.',
      },
      {
        stageLabel: 'Tahap 3',
        timeframe: 'Bulan 3–4',
        title: 'Kalibrasi Skor & Retensi Jangka Panjang',
        description:
          'Gabungkan latihan gabungan membaca-menyimak dan evaluasi kesalahan berulang sampai hafalan benar-benar melekat.',
        outcome: 'Siap duduk di ujian sertifikasi resmi dengan target skor terukur.',
      },
    ],
  },
  {
    id: 'beginner',
    tabLabel: 'Mulai dari Nol',
    TabIcon: Compass,
    meraFigure: 'sensei',
    meraMood: 'excited',
    meraBadge: 'Unit 1',
    badgeLabel: 'Ramah Pemula Tanpa Pengalaman',
    personaHeadline: 'Dipandu pelan dari bunyi pertama hingga berani merangkai kalimat',
    personaSummary:
      'Dibuat khusus untuk pemula mutlak agar tidak kaget saat bertemu huruf baru, pengucapan asing, atau tata bahasa awal.',
    dailyRhythm: '10–15 mnt/hari',
    estimatedHorizon: 'Target awal: 2–4 minggu',
    theme: {
      tabBgClass: 'bg-[#4F46E5] shadow-[0_3px_10px_-2px_rgba(79,70,229,0.4)]',
      pillBadgeClass: 'bg-[#EEF2FF] border-indigo-200/90 text-[#4338CA]',
      stepBadgeClass: 'bg-[#4F46E5] text-white shadow-[0_3px_0_0_#3730A3]',
      connectorClass: 'from-[#C7D2FE] via-[#818CF8] to-[#C7D2FE]',
      checkIconClass: 'text-[#4F46E5]',
      blobTint: '#E0E7FF',
      haloTint: 'rgba(79, 70, 229, 0.14)',
    },
    trackChips: [
      { code: 'en-gb', label: 'Inggris UK' },
      { code: 'en-us', label: 'Inggris US' },
      { code: 'ja', label: 'Jepang' },
      { code: 'de', label: 'Jerman' },
      { code: 'zh', label: 'Mandarin' },
      { code: 'fr', label: 'Prancis' },
    ],
    stages: [
      {
        stageLabel: 'Tahap 1',
        timeframe: 'Hari 1–7',
        title: 'Kenalan dengan Bunyi & Huruf Pertama',
        description:
          'Setiap unit diawali kartu pengantar ringkas lengkap dengan pelafalan asli sebelum satu pun soal latihan muncul.',
        outcome: 'Mengenali bunyi dasar & aksara awal tanpa merasa terburu-buru.',
      },
      {
        stageLabel: 'Tahap 2',
        timeframe: 'Minggu 2–3',
        title: 'Sapaan Harian & Kosakata Hidup',
        description:
          'Pelajari ungkapan salam, angka, dan tanya-jawab sederhana lewat latihan interaktif singkat berdurasi 3–5 menit.',
        outcome: 'Bisa menyapa, bertanya arah, & membaca frasa sehari-hari.',
      },
      {
        stageLabel: 'Tahap 3',
        timeframe: 'Minggu 4+',
        title: 'Kalimat Pertama & Kebiasaan Konsisten',
        description:
          'Rangkai kalimat pertamamu dari kosakata yang sudah dikuasai sambil menjaga ritme ulasan ringan harian bersama Mera.',
        outcome: 'Punya pondasi percaya diri untuk naik ke level sertifikasi awal.',
      },
    ],
  },
]

const renderGoalMeraFigure = (goal: GoalRoadmapConfig) => {
  switch (goal.meraFigure) {
    case 'polyglot':
      return (
        <MeraPolyglotFigure
          mood={goal.meraMood}
          size={88}
          badgeText={goal.meraBadge}
        />
      )
    case 'timekeeper':
      return (
        <MeraTimekeeperFigure
          mood={goal.meraMood}
          size={88}
          badgeText={goal.meraBadge}
        />
      )
    case 'sensei':
    default:
      return (
        <MeraSenseiFigure
          mood={goal.meraMood}
          size={88}
          badgeText={goal.meraBadge}
        />
      )
  }
}

export const LandingGoalRoadmapSection = () => {
  const [activeGoalId, setActiveGoalId] = useState<GoalId>('career')
  const shouldReduceMotion = Boolean(useReducedMotion())
  const tabRefs = useRef<Partial<Record<GoalId, HTMLButtonElement | null>>>({})

  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated && Boolean(s.user))
  const primaryCtaPath =
    isAuthenticated && user ? (user.is_onboarded ? '/curriculum' : '/onboarding') : '/curriculum'
  const primaryCtaLabel = isAuthenticated && user ? 'Lanjut Belajar' : 'Mulai Unit 1 Gratis'

  const activeGoal =
    GOAL_ROADMAPS.find((goal) => goal.id === activeGoalId) ?? GOAL_ROADMAPS[0]

  const handleSelectGoal = (goalId: GoalId) => {
    if (goalId === activeGoalId) return
    triggerHaptic('tap')
    setActiveGoalId(goalId)
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + direction + GOAL_ROADMAPS.length) % GOAL_ROADMAPS.length
    const nextGoal = GOAL_ROADMAPS[nextIndex]
    if (!nextGoal) return
    triggerHaptic('tap')
    setActiveGoalId(nextGoal.id)
    tabRefs.current[nextGoal.id]?.focus()
  }

  return (
    <section
      id="rute-belajar"
      aria-labelledby="rute-belajar-heading"
      className="landing-cv-section bg-white py-14 sm:py-20 px-4 sm:px-6 overflow-x-clip scroll-mt-20"
    >
      <div className="relative overflow-hidden max-w-[1120px] mx-auto rounded-[28px] sm:rounded-[36px] bg-gradient-to-b from-[#F8FAFF] via-[#F2F7FF] to-[#EEF5FF] border border-[#DBEAFE] shadow-[0_14px_38px_-22px_rgba(37,99,235,0.22)] p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
        {/* Soft Static Pastel Corner Blobs */}
        <svg
          aria-hidden="true"
          viewBox="0 0 360 360"
          className="pointer-events-none select-none absolute -top-24 -right-20 w-72 h-72 opacity-60 transition-colors duration-300"
        >
          <path
            d="M 78 44 C 150 10 264 18 310 92 C 354 162 326 278 242 320 C 160 360 54 316 28 228 C 6 150 16 74 78 44 Z"
            fill={activeGoal.theme.blobTint}
          />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 320 320"
          className="pointer-events-none select-none absolute -bottom-24 -left-20 w-64 h-64 opacity-45 transition-colors duration-300"
        >
          <path
            d="M 68 38 C 142 12 246 28 286 102 C 322 168 292 262 214 294 C 138 326 44 282 22 204 C 4 140 16 64 68 38 Z"
            fill={activeGoal.theme.blobTint}
          />
        </svg>

        {/* Clean Header + 4 Interactive Goal Tabs */}
        <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center space-y-4">
          <div className="space-y-2.5">
            <p className="text-[11px] sm:text-xs font-brand font-extrabold uppercase tracking-[0.18em] text-[#2563EB]">
              PETA TUJUAN &amp; RUTE BELAJAR
            </p>
            <h2
              id="rute-belajar-heading"
              className="text-2xl sm:text-4xl font-brand font-black tracking-tight text-[#0F172A] leading-tight"
            >
              Belajar Sesuai Tujuanmu, Selangkah demi Selangkah
            </h2>
            <p className="text-sm sm:text-base text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Pilih target belajarmu untuk melihat 3 tahap rute, ritme harian, dan jalur sertifikasi
              yang paling sesuai.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Pilih tujuan belajar bahasa"
            className="grid grid-cols-2 lg:inline-grid lg:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 rounded-2xl lg:rounded-full bg-white/95 border border-slate-200/90 shadow-xs w-full lg:w-auto max-w-full"
          >
            {GOAL_ROADMAPS.map((goal, index) => {
              const isSelected = goal.id === activeGoal.id
              const TabIcon = goal.TabIcon

              return (
                <button
                  key={goal.id}
                  ref={(el) => {
                    tabRefs.current[goal.id] = el
                  }}
                  id={`goal-tab-${goal.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls={`goal-panel-${goal.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleSelectGoal(goal.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`relative min-w-0 px-3 sm:px-4 py-2.5 rounded-xl lg:rounded-full text-xs sm:text-sm font-brand font-extrabold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-1 ${
                    isSelected ? 'text-white' : 'text-[#334155] hover:text-[#0F172A] hover:bg-slate-50/80'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="goal-roadmap-tab-pill"
                      aria-hidden="true"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0.01 }
                          : { type: 'spring', stiffness: 420, damping: 32 }
                      }
                      className={`absolute inset-0 rounded-xl lg:rounded-full ${goal.theme.tabBgClass}`}
                    />
                  )}
                  <TabIcon
                    weight={isSelected ? 'fill' : 'bold'}
                    className="relative z-10 w-4 h-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 truncate">{goal.tabLabel}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Goal Panel */}
        <div className="relative z-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeGoal.id}
              id={`goal-panel-${activeGoal.id}`}
              role="tabpanel"
              aria-labelledby={`goal-tab-${activeGoal.id}`}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.08 }
                  : { duration: 0.22, ease: SMOOTH_EASE }
              }
              className="space-y-5 sm:space-y-6"
            >
              {/* A. Goal Brief & Open-Stage Mera Companion */}
              <div className="rounded-2xl bg-white border border-slate-200/85 p-5 sm:p-6 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.12)] flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-7">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 min-w-0">
                  {/* Open-Stage Mera (NO bordered glass box) */}
                  <div className="relative shrink-0 self-start sm:self-center inline-flex items-end justify-center pt-1">
                    <div
                      aria-hidden="true"
                      style={{
                        background: `radial-gradient(circle, ${activeGoal.theme.haloTint} 0%, rgba(255,255,255,0) 72%)`,
                      }}
                      className="absolute inset-x-0 bottom-0 h-20 rounded-full blur-[2px] pointer-events-none"
                    />
                    <div className="relative z-10">{renderGoalMeraFigure(activeGoal)}</div>
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-brand font-extrabold ${activeGoal.theme.pillBadgeClass}`}
                    >
                      {activeGoal.badgeLabel}
                    </span>
                    <h3 className="text-base sm:text-lg font-brand font-extrabold text-[#0F172A] leading-snug break-words">
                      {activeGoal.personaHeadline}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-2xl">
                      {activeGoal.personaSummary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 shrink-0 lg:items-end lg:max-w-[400px]">
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] border border-slate-200 px-3 py-1.5 text-xs font-brand font-bold text-[#1E293B]">
                      <Clock weight="bold" className="w-3.5 h-3.5 text-[#2563EB] shrink-0" aria-hidden="true" />
                      <span>Ritme: {activeGoal.dailyRhythm}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] border border-slate-200 px-3 py-1.5 text-xs font-brand font-bold text-[#1E293B]">
                      <CalendarCheck
                        weight="bold"
                        className="w-3.5 h-3.5 text-[#059669] shrink-0"
                        aria-hidden="true"
                      />
                      <span>{activeGoal.estimatedHorizon}</span>
                    </span>
                  </div>

                  <div
                    aria-label="Jalur bahasa dan standar ujian yang didukung"
                    className="flex flex-wrap items-center gap-1.5 lg:justify-end"
                  >
                    {activeGoal.trackChips.map((chip) => (
                      <span
                        key={chip.code}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] border border-slate-200/85 px-2.5 py-1 text-[11px] font-semibold text-[#334155] whitespace-nowrap"
                      >
                        <span className="w-[18px] h-[12px] rounded-[2px] overflow-hidden shrink-0 inline-flex items-center justify-center">
                          <LanguageFlagIllustration
                            code={chip.code}
                            compact
                            className="w-full h-full object-cover"
                          />
                        </span>
                        <span>{chip.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* B. 3-Stage Connected Roadmap */}
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                <div
                  aria-hidden="true"
                  className={`hidden md:block pointer-events-none absolute top-[34px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r ${activeGoal.theme.connectorClass}`}
                />

                {activeGoal.stages.map((stage) => (
                  <article
                    key={stage.stageLabel}
                    className="relative z-10 min-w-0 rounded-2xl bg-white border border-slate-200/90 p-5 flex flex-col justify-between gap-4 shadow-[0_4px_16px_-10px_rgba(15,23,42,0.08)]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-brand font-black tracking-wide ${activeGoal.theme.stepBadgeClass}`}
                        >
                          {stage.stageLabel}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-[#475569] whitespace-nowrap">
                          {stage.timeframe}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-base sm:text-[17px] font-brand font-extrabold text-[#0F172A] leading-snug break-words">
                          {stage.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-start gap-2">
                      <CheckCircle
                        weight="fill"
                        className={`w-4 h-4 mt-0.5 shrink-0 ${activeGoal.theme.checkIconClass}`}
                        aria-hidden="true"
                      />
                      <p className="text-xs font-semibold text-[#1E293B] leading-snug">
                        {stage.outcome}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* C. Clean Bottom Action Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-1 border-t border-blue-200/60">
          <p className="text-xs sm:text-sm text-[#475569] text-center sm:text-left pt-3 sm:pt-4">
            Unit 1 terbuka gratis tanpa login · Target belajar bisa diubah kapan saja.
          </p>

          <div className="w-full sm:w-auto flex flex-col min-[380px]:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:pt-4">
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-5 py-3 text-xs sm:text-sm font-brand font-bold text-[#1E293B] active:scale-[0.98] transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
              >
                <UserPlus weight="bold" className="w-4 h-4 text-[#2563EB] shrink-0" aria-hidden="true" />
                <span>Daftar Gratis</span>
              </Link>
            )}
            <Link
              to={primaryCtaPath}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-6 py-3 text-xs sm:text-sm font-brand font-black text-white shadow-[0_4px_0_0_#1E40AF] active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
            >
              <span>{primaryCtaLabel}</span>
              <ArrowRight weight="bold" className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
