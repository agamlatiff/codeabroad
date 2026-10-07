import type { TargetTimeline, LanguageLevel } from '../types/onboarding'

/**
 * Static market overview and opportunities description per destination country.
 */
export const COUNTRY_DESCRIPTIONS: Record<string, string> = {
  JP: 'Pusat inovasi teknologi Asia Timur dengan kebutuhan masif talenta engineering global.',
  SG: 'Hub regional fintech & tech unicorn Asia Tenggara dengan ekosistem multikultural.',
  DE: 'Kekuatan industri teknologi Eropa dengan standar rekayasa presisi tinggi dan work-life balance.',
}

/**
 * Static badges and color styles for career tracks.
 */
export const TRACK_BADGES: Record<string, { text: string; color: string }> = {
  backend: { text: 'High Demand Tokyo', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  frontend: { text: 'Tokyo Standard', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  devops: { text: 'Highest Salary Tokyo', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  fullstack: { text: 'High Demand Tokyo', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  product_engineer: { text: 'Coming Soon', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  solutions_architect: { text: 'Coming Soon', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
}

/**
 * Static descriptions for each primary technology stack.
 */
export const STACK_DESCRIPTIONS: Record<string, string> = {
  golang: 'Bahasa performa tinggi untuk microservices & sistem konkurensi di Tokyo.',
  java: 'Paling banyak digunakan di enterprise dan institusi finansial Tokyo.',
  node: 'Pengembangan cepat arsitektur API berbasis Node.js Express.',
  react: 'Standar industri utama untuk aplikasi web interaktif skala global di Tokyo.',
  vue: 'Framework reaktif yang populer di banyak startup dan tech agency Jepang.',
  svelte: 'Teknologi frontend generasi baru dengan performa ultra-ringan.',
  react_golang: 'Kombinasi React + Go (Gin) + AWS paling dicari untuk full product delivery.',
  react_node: 'Full JavaScript stack dari UI, Express API, hingga cloud deployment.',
  devops_aws: 'Otomatisasi kluster Kubernetes, ECS, dan arsitektur cloud serverless di AWS Tokyo.',
  devops_cloud: 'Otomatisasi kluster Kubernetes, ECS, dan arsitektur cloud serverless di AWS Tokyo.',
  devops_gcp: 'Infrastruktur data & Kubernetes Engine (GKE) populer di unicorn Jepang seperti Mercari.',
  devops_terraform: 'Infrastructure as Code (IaC) skala besar dengan automasi CI/CD pipelines modern.',
}

export interface TimelineOptionConfig {
  id: TargetTimeline
  title: string
  badge: string
  badgeColor: string
  description: string
  targetMonths: number
}

/**
 * Static timeline options for Step 3B.
 */
export const TIMELINE_OPTIONS: TimelineOptionConfig[] = [
  {
    id: '6_months',
    title: 'Sprint (6 Bulan)',
    badge: 'Turbo',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200/80',
    description: '2-3 jam/hari • Akselerasi cepat ke interview Tokyo',
    targetMonths: 6,
  },
  {
    id: '1_year',
    title: 'Ideal (1 Tahun)',
    badge: 'Rekomendasi',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200/80',
    description: '1 jam/hari • Ritme belajar seimbang & sustainable',
    targetMonths: 12,
  },
  {
    id: 'exploring',
    title: 'Santai (Fleksibel)',
    badge: 'Mandiri',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    description: 'Waktu fleksibel • Eksplorasi materi tanpa tenggat waktu',
    targetMonths: 18,
  },
]

export interface LanguageOptionConfig {
  id: LanguageLevel
  title: string
  badge: string
  badgeColor: string
  description: string
}

/**
 * Static language readiness cards for Step 3B.
 */
export const LANGUAGE_OPTIONS: LanguageOptionConfig[] = [
  {
    id: 'none',
    title: 'Mulai dari Nol',
    badge: 'Level 0',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200/80',
    description: 'Bimbingan dari abjad Hiragana, Katakana & kosakata harian',
  },
  {
    id: 'basic',
    title: 'Percakapan Dasar',
    badge: 'Level 1',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200/80',
    description: 'Percakapan sehari-hari, salam & perkenalan kerja',
  },
  {
    id: 'conversational',
    title: 'Siap Interview (N3)',
    badge: 'Level 2',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200/80',
    description: 'Standar minimum interview teknis startup Tokyo',
  },
  {
    id: 'fluent',
    title: 'Mahir & Bisnis (N2/N1)',
    badge: 'Level 3',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200/80',
    description: 'Standar enterprise multinasional & eksekutif Jepang',
  },
]

export interface LevelOptionConfig {
  id: 'beginner' | 'intermediate'
  title: string
  subtitle: string
  badge: string
  badgeColor: string
  description: string
  chips: string[]
}

/**
 * Static experience level hero cards for Step 3A.
 */
export const LEVEL_OPTIONS: Record<'beginner' | 'intermediate', LevelOptionConfig> = {
  beginner: {
    id: 'beginner',
    title: 'Mulai dari Dasar',
    subtitle: 'Fundamental & Habit Builder',
    badge: 'Step by Step',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    description: 'Baru belajar coding atau pindah karier. Bimbingan terstruktur dari nol hingga siap kerja global.',
    chips: ['Sintaks & Konsep', 'Daily Quest', 'Proyek Portofolio'],
  },
  intermediate: {
    id: 'intermediate',
    title: 'Sudah Berpengalaman',
    subtitle: 'Tokyo Fast Track Ready',
    badge: 'Akselerasi',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    description: 'Punya pengalaman profesional 1-3+ tahun. Fokus langsung ke arsitektur tingkat lanjut & persiapan wawancara.',
    chips: ['Clean Arch', 'Simulasi Interview', 'Persiapan Visa'],
  },
}
