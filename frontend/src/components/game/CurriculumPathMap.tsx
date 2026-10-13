import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  LockSimple,
  Sparkle,
  BookOpen,
  Gift,
  Trophy,
  Lightning,
  Translate,
  ArrowsLeftRight,
  Cpu,
} from '@phosphor-icons/react'
import doodleCoding from '../../assets/kodi/doodle-coding.png'
import doodleThinking from '../../assets/kodi/doodle-thinking.png'
import { Button3D } from '../ui/Button3D'
import { triggerHaptic } from '../../utils/haptics'

export interface CurriculumPartNode {
  id: string
  number: number
  title: string
  subtitle: string
  status: 'completed' | 'active' | 'locked'
  route: string
  xpReward: number
  category?: 'code' | 'nihongo' | 'integration' | 'devops'
  badgeLabel?: string
}

export interface CurriculumUnitData {
  id: string
  unitNumber: number
  tag: string
  title: string
  description: string
  statusBadge: string
  badgeType: 'completed' | 'active' | 'locked'
  bannerGradient: string
  bannerBorder: string
  parts: CurriculumPartNode[]
}

export interface PathMapNode {
  id: string
  title: string
  subtitle: string
  number?: number
  xpReward: number
  status: 'completed' | 'active' | 'locked'
  route: string
  category?: 'code' | 'nihongo' | 'integration' | 'devops'
  badgeLabel?: string
  isChest?: boolean
  isTrophy?: boolean
}

export interface CurriculumPathMapProps {
  className?: string
  currentPart?: number
  trackSlug?: string
  unitTag?: string
  unitTitle?: string
  unitDescription?: string
}

// ── DATA KURIKULUM MULTI-TRACK (GLOBAL & REUSABLE LINTAS NEGARA) ──
interface RawTrackConfig {
  defaultActivePart: number
  units: {
    id: string
    unitNumber: number
    tag: string
    title: string
    description: string
    statusBadge: string
    badgeType: 'completed' | 'active' | 'locked'
    bannerGradient: string
    bannerBorder: string
    parts: Omit<CurriculumPartNode, 'status'>[]
  }[]
}

const TRACK_CURRICULA: Record<string, RawTrackConfig> = {
  fundamental: {
    defaultActivePart: 1,
    units: [
      {
        id: 'fund-unit-1',
        unitNumber: 1,
        tag: 'UNIT 1 • FONDASI LOGIKA CPU & ALOKASI MEMORI',
        title: 'Arsitektur Komputer, Heap vs Stack & Pointer Referensi',
        description: 'Pahami cara CPU dan RAM bekerja, referensi pointer, dan etika sapaan Aisatsu hari pertama.',
        statusBadge: 'SEDANG BERJALAN',
        badgeType: 'active',
        bannerGradient: 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700',
        bannerBorder: 'border-indigo-500/40',
        parts: [
          {
            id: 'fund-part-1',
            number: 1,
            title: 'Memori Stack vs Heap & Pointer',
            subtitle: 'Alokasi memori komputer dan referensi pointer',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fund-part-2',
            number: 2,
            title: 'Tipe Data Primitif & Struct',
            subtitle: 'Data types, memory alignment & composite struct',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fund-part-3',
            number: 3,
            title: 'Aisatsu & Jikoshoukai di Kantor',
            subtitle: 'Salam pagi, perkenalan diri & etika onboarding engineering Tokyo',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
        ],
      },
      {
        id: 'fund-unit-2',
        unitNumber: 2,
        tag: 'UNIT 2 • STRUKTUR DATA, BIG-O & CALL STACK',
        title: 'Hash Map, Kompleksitas Algoritma & Asakai Standup',
        description: 'Kuasai struktur data kunci, analisis Big-O, dan komunikasi progres tiket koding di standup.',
        statusBadge: 'TERKUNCI',
        badgeType: 'locked',
        bannerGradient: 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700',
        bannerBorder: 'border-blue-500/40',
        parts: [
          {
            id: 'fund-part-4',
            number: 4,
            title: 'Dynamic Array & Hash Map',
            subtitle: 'Collision handling, lookup time & key-value indexing',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fund-part-5',
            number: 5,
            title: 'Looping, Recursion & Call Stack',
            subtitle: 'Eksekusi recursive call & stack overflow guard',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fund-part-6',
            number: 6,
            title: 'Asakai (朝会) Standup Meeting',
            subtitle: 'Lapor progres tiket Jira & blocker harian dalam bahasa Jepang',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
        ],
      },
      {
        id: 'fund-unit-3',
        unitNumber: 3,
        tag: 'UNIT 3 • PROTOKOL JARINGAN HTTP & GIT COLLABORATIVE',
        title: 'Client-Server Request, REST Handshake & Git Branching',
        description: 'Alat kerja wajib software engineer: Terminal Linux, Git PR review, dan protokol HTTP/REST.',
        statusBadge: 'TERKUNCI',
        badgeType: 'locked',
        bannerGradient: 'bg-gradient-to-r from-slate-700 via-slate-800 to-indigo-900',
        bannerBorder: 'border-slate-500/40',
        parts: [
          {
            id: 'fund-part-7',
            number: 7,
            title: 'Git Collaborative & Pull Request',
            subtitle: 'Branch, Pull Request, merge conflict & review PR bilingual',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fund-part-8',
            number: 8,
            title: 'Protokol Client-Server & HTTP Request',
            subtitle: 'Cara kerja HTTP GET/POST, status code 200/404 & format payload JSON',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fund-part-9',
            number: 9,
            title: 'Simulasi Wawancara Fondasi (Mensetsu)',
            subtitle: 'Tanya jawab logika koding & motivasi karir global di Tokyo',
            route: '/courses',
            xpReward: 100,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
        ],
      },
    ],
  },

  golang: {
    defaultActivePart: 4,
    units: [
      {
        id: 'unit-1',
        unitNumber: 1,
        tag: 'UNIT 1 • ARSITEKTUR MEMORI & LOGIKA EKSEKUSI (GOLANG)',
        title: 'Manajemen Heap/Stack, Pointer & Salam Kantor Tokyo',
        description: 'Pahami cara CPU & memori bekerja, alokasi pointer statis Go, dan etika sapaan Aisatsu hari pertama.',
        statusBadge: 'SELESAI (100%)',
        badgeType: 'completed',
        bannerGradient: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700',
        bannerBorder: 'border-emerald-500/40',
        parts: [
          {
            id: 'part-1',
            number: 1,
            title: 'Variabel & Tipe Data',
            subtitle: 'Strict typing dan alokasi memori Go',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'part-2',
            number: 2,
            title: 'Pointer & Struktur Data',
            subtitle: 'Pengelolaan referensi memori & Struct',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'part-3',
            number: 3,
            title: 'Aisatsu & Jikoshoukai di Kantor',
            subtitle: 'Salam pagi, perkenalan diri & etika onboarding engineering Tokyo',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
        ],
      },
      {
        id: 'unit-2',
        unitNumber: 2,
        tag: 'UNIT 2 • DESAIN SISTEM REST API & KONTRAK DATA',
        title: 'Gin Routing Engine, JWT Auth, Database & Asakai Standup',
        description: 'Bangun API backend Go berstandar internasional, query database PostgreSQL, dan lapor di Asakai.',
        statusBadge: 'SEDANG BERJALAN',
        badgeType: 'active',
        bannerGradient: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700',
        bannerBorder: 'border-blue-500/40',
        parts: [
          {
            id: 'part-4',
            number: 4,
            title: 'Gin Routing Engine',
            subtitle: 'HTTP method, path parameter & handler',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'part-5',
            number: 5,
            title: 'Routing & JWT Middleware',
            subtitle: 'Autentikasi token claims & context guard',
            route: '/learn/station-3-jwt-middleware',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'part-6',
            number: 6,
            title: 'Asakai (朝会) Standup Meeting',
            subtitle: 'Lapor progres tiket Jira & blocker harian dalam bahasa Jepang',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
          {
            id: 'part-7',
            number: 7,
            title: 'Format Response JSON & Standar API',
            subtitle: 'Desain format response JSON yang konsisten, CORS & HTTP error codes',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'part-8',
            number: 8,
            title: 'Pgxpool Database Transaction',
            subtitle: 'Integrasi connection pool PostgreSQL, CRUD & ACID isolation',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
        ],
      },
      {
        id: 'unit-3',
        unitNumber: 3,
        tag: 'UNIT 3 • HIGH-THROUGHPUT CONCURRENCY & DOCKER',
        title: 'Worker Pool, Multi-Stage Container & Wawancara Tokyo',
        description: 'Optimalkan konkurensi asinkronus, kemas container Docker, dan taklukkan wawancara kerja.',
        statusBadge: 'TERKUNCI',
        badgeType: 'locked',
        bannerGradient: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800',
        bannerBorder: 'border-purple-500/40',
        parts: [
          {
            id: 'part-9',
            number: 9,
            title: 'Worker Pool & Concurrency',
            subtitle: 'Goroutine, buffered channel & sync.WaitGroup',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'part-10',
            number: 10,
            title: 'Multi-Stage Docker Packaging',
            subtitle: 'Kemas binary Go ke image Docker ringan < 25MB siap deploy produksi',
            route: '/courses',
            xpReward: 50,
            category: 'devops',
            badgeLabel: '⚙️ DEVOPS',
          },
          {
            id: 'part-11',
            number: 11,
            title: 'Simulasi Wawancara Kerja Tokyo (Mensetsu)',
            subtitle: 'Pitching arsitektur Go, live coding & etika wawancara bilingual',
            route: '/courses',
            xpReward: 100,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
        ],
      },
    ],
  },

  frontend: {
    defaultActivePart: 1,
    units: [
      {
        id: 'fe-unit-1',
        unitNumber: 1,
        tag: 'UNIT 1 • ARSITEKTUR KOMPONEN & TYPE SAFETY (REACT)',
        title: 'Strict Generics, Component Decoupling & Salam Kantor',
        description: 'Kuasai TypeScript generics, arsitektur komponen React, dan salam perkenalan kantor Tokyo.',
        statusBadge: 'SEDANG BERJALAN',
        badgeType: 'active',
        bannerGradient: 'bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700',
        bannerBorder: 'border-cyan-500/40',
        parts: [
          {
            id: 'fe-part-1',
            number: 1,
            title: 'TypeScript Type & Interface',
            subtitle: 'Strict generics dan type safety komponen',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fe-part-2',
            number: 2,
            title: 'Arsitektur Komponen React',
            subtitle: 'Clean JSX, props decoupling & atomic layout',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fe-part-3',
            number: 3,
            title: 'Aisatsu & Jikoshoukai di Kantor',
            subtitle: 'Salam pagi, perkenalan diri & etika onboarding engineering Tokyo',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
        ],
      },
      {
        id: 'fe-unit-2',
        unitNumber: 2,
        tag: 'UNIT 2 • STATE CONTROLLER & KONSUMSI REST API',
        title: 'Custom Hooks, Integrasi REST API & Asakai Standup',
        description: 'Hubungkan React UI dengan REST API, validasi data Zod, dan lapor di Asakai standup.',
        statusBadge: 'TERKUNCI',
        badgeType: 'locked',
        bannerGradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700',
        bannerBorder: 'border-blue-500/40',
        parts: [
          {
            id: 'fe-part-4',
            number: 4,
            title: 'Custom Hooks & State Logic',
            subtitle: 'Modular state controller & reactive event handling',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fe-part-5',
            number: 5,
            title: 'Fetch & Integrasi REST API',
            subtitle: 'Mengambil data API, handle error response & autentikasi JWT token',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fe-part-6',
            number: 6,
            title: 'Asakai (朝会) Standup Meeting',
            subtitle: 'Lapor progres tiket Jira & blocker harian dalam bahasa Jepang',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
          {
            id: 'fe-part-7',
            number: 7,
            title: 'TanStack Query State Cache',
            subtitle: 'Server state caching, optimistic updates & refetch',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
        ],
      },
      {
        id: 'fe-unit-3',
        unitNumber: 3,
        tag: 'UNIT 3 • PRODUCTION RENDERING & CLOUD DEPLOY',
        title: 'Next.js SSR Streaming, Deploy Web & Wawancara Tokyo',
        description: 'Kuasai Next.js App Router, deploy web ke server cloud, dan hadapi wawancara kerja Tokyo.',
        statusBadge: 'TERKUNCI',
        badgeType: 'locked',
        bannerGradient: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800',
        bannerBorder: 'border-purple-500/40',
        parts: [
          {
            id: 'fe-part-8',
            number: 8,
            title: 'Next.js Server Actions & SSR',
            subtitle: 'Fullstack React production architecture & Web Vitals',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fe-part-9',
            number: 9,
            title: 'Build Produksi & Deploy Web ke Cloud',
            subtitle: 'Optimasi bundle produksi, Dockerfile Nginx & hosting cloud siap pakai',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'fe-part-10',
            number: 10,
            title: 'Simulasi Wawancara Kerja Tokyo (Mensetsu)',
            subtitle: 'Presentasi portofolio UI/UX, code review & tanya jawab bilingual',
            route: '/courses',
            xpReward: 100,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
        ],
      },
    ],
  },

  devops: {
    defaultActivePart: 1,
    units: [
      {
        id: 'devops-unit-1',
        unitNumber: 1,
        tag: 'UNIT 1 • ARSITEKTUR SISTEM OPERASI & AUTOMASI',
        title: 'Linux Kernel Permissions, Systemd & Salam Kantor',
        description: 'Kuasai terminal Linux, izin file, systemd service, dan etika sapaan Aisatsu hari pertama.',
        statusBadge: 'SEDANG BERJALAN',
        badgeType: 'active',
        bannerGradient: 'bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700',
        bannerBorder: 'border-orange-500/40',
        parts: [
          {
            id: 'devops-part-1',
            number: 1,
            title: 'Linux Permissions & Systemd',
            subtitle: 'User access control, service daemon & env',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'devops-part-2',
            number: 2,
            title: 'Shell Scripting & Automasi',
            subtitle: 'Pipes, filters & cron job automation',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'devops-part-3',
            number: 3,
            title: 'Aisatsu & Jikoshoukai di Kantor',
            subtitle: 'Salam pagi, perkenalan diri & etika onboarding engineering Tokyo',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
        ],
      },
      {
        id: 'devops-unit-2',
        unitNumber: 2,
        tag: 'UNIT 2 • CONTAINERIZATION & MULTI-SERVICE ORKESTRASI',
        title: 'Multi-Stage Dockerfile, Compose & Laporan Insiden',
        description: 'Paketkan app Go & React dalam multi-container, dan tulis laporan insiden Shougai Houkoku.',
        statusBadge: 'TERKUNCI',
        badgeType: 'locked',
        bannerGradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-700',
        bannerBorder: 'border-blue-500/40',
        parts: [
          {
            id: 'devops-part-4',
            number: 4,
            title: 'Multi-Stage Dockerfile',
            subtitle: 'Optimasi ukuran image < 30MB & security audit',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'devops-part-5',
            number: 5,
            title: 'Docker Compose Multi-Container',
            subtitle: 'Menjalankan backend API, frontend web, dan database dalam 1 jaringan',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'devops-part-6',
            number: 6,
            title: 'Shougai Houkoku (障害報告) Insiden Server',
            subtitle: 'Menulis post-mortem downtime & komunikasi darurat bahasa Jepang',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
          {
            id: 'devops-part-7',
            number: 7,
            title: 'Automated CI/CD Pipeline',
            subtitle: 'GitHub Actions workflow & automated testing gate',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
        ],
      },
      {
        id: 'devops-unit-3',
        unitNumber: 3,
        tag: 'UNIT 3 • CLUSTER RELIABILITY & OBSERVABILITY',
        title: 'Kubernetes Mesh, Prometheus SLO & Wawancara Tokyo',
        description: 'Kelola microservice di Kubernetes, pantau Prometheus metrics, dan hadapi wawancara SRE.',
        statusBadge: 'TERKUNCI',
        badgeType: 'locked',
        bannerGradient: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800',
        bannerBorder: 'border-purple-500/40',
        parts: [
          {
            id: 'devops-part-8',
            number: 8,
            title: 'Kubernetes Pod & Service Mesh',
            subtitle: 'K8s manifest, ingress routing & autoscaling',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'devops-part-9',
            number: 9,
            title: 'Prometheus & Grafana Observability',
            subtitle: 'SLO, error budget tracking & alert manager',
            route: '/courses',
            xpReward: 50,
            category: 'code',
          },
          {
            id: 'devops-part-10',
            number: 10,
            title: 'Simulasi Wawancara Kerja Tokyo (Mensetsu)',
            subtitle: 'Studi kasus troubleshooting outage, infra design & wawancara bilingual',
            route: '/courses',
            xpReward: 100,
            category: 'nihongo',
            badgeLabel: '🌸 NIHONGO',
          },
        ],
      },
    ],
  },

  nihongo: {
    defaultActivePart: 1,
    units: [
      {
        id: 'nihongo-unit-1',
        unitNumber: 1,
        tag: 'UNIT 1 • SURVIVAL SEHARIAN & ONBOARDING KANTOR',
        title: 'Aisatsu, Jikoshoukai & Kehidupan di Tokyo',
        description: 'Kuasai salam harian, perkenalan diri engineer, pesan makanan konbini & naik kereta Yamanote.',
        statusBadge: 'SEDANG BERJALAN',
        badgeType: 'active',
        bannerGradient: 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700',
        bannerBorder: 'border-rose-500/40',
        parts: [
          {
            id: 'nihongo-part-1',
            number: 1,
            title: 'Aisatsu & Salam Sehari-hari',
            subtitle: 'Ohayou gozaimasu, Otsukaresama desu & etika sapaan kantor',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 SURVIVAL',
          },
          {
            id: 'nihongo-part-2',
            number: 2,
            title: 'Jikoshoukai Perkenalan Diri',
            subtitle: 'Memperkenalkan diri sebagai software engineer dari Indonesia',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 SURVIVAL',
          },
          {
            id: 'nihongo-part-3',
            number: 3,
            title: 'Navigasi Kereta Tokyo & Konbini',
            subtitle: 'Beli Suica/Pasmo, tanya arah stasiun & pesan makanan',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 SEIKATSU',
          },
        ],
      },
      {
        id: 'nihongo-unit-2',
        unitNumber: 2,
        tag: 'UNIT 2 • KOMUNIKASI TIM IT & STANDUP ASAKAI',
        title: 'Daily Standup, Kosakata Bug & Review PR',
        description: 'Latih kelancaran saat morning standup Asakai, tiket Jira, istilah jissou & fuguai, serta komentar PR.',
        statusBadge: 'TERKUNCI',
        badgeType: 'locked',
        bannerGradient: 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700',
        bannerBorder: 'border-amber-500/40',
        parts: [
          {
            id: 'nihongo-part-4',
            number: 4,
            title: 'Pola Laporan Asakai (Standup)',
            subtitle: 'Pola: Kinou yatta koto, Kyou yaru koto, Kadai/Blocker',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 BISNIS IT',
          },
          {
            id: 'nihongo-part-5',
            number: 5,
            title: 'Istilah Teknis: Jissou & Fuguai',
            subtitle: 'Komunikasi bug, feature update & spec requirement di Slack',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 BISNIS IT',
          },
          {
            id: 'nihongo-part-6',
            number: 6,
            title: 'Review Pull Request & Etika Git',
            subtitle: 'Menulis komentar PR yang sopan & saran refactor kode',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 BISNIS IT',
          },
        ],
      },
      {
        id: 'nihongo-unit-3',
        unitNumber: 3,
        tag: 'UNIT 3 • WAWANCARA KERJA & LIVE CODING TOKYO',
        title: 'Persiapan Mensetsu & Live Coding Bilingual',
        description: 'Kuasai teknik menjawab pertanyaan teknis wawancara kerja, motivasi masuk & live coding.',
        statusBadge: 'TERKUNCI',
        badgeType: 'locked',
        bannerGradient: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-800',
        bannerBorder: 'border-purple-500/40',
        parts: [
          {
            id: 'nihongo-part-7',
            number: 7,
            title: 'Shibou Douki (Motivasi Kerja)',
            subtitle: 'Mengapa ingin berkarir di Jepang & visi engineering 3 tahun ke depan',
            route: '/courses',
            xpReward: 50,
            category: 'nihongo',
            badgeLabel: '🌸 MENSETSU',
          },
          {
            id: 'nihongo-part-8',
            number: 8,
            title: 'Simulasi Wawancara Teknis (Mensetsu)',
            subtitle: 'Tanya-jawab portofolio, arsitektur & live coding bilingual',
            route: '/courses',
            xpReward: 100,
            category: 'nihongo',
            badgeLabel: '🌸 MENSETSU',
          },
        ],
      },
    ],
  },
}

/**
 * CurriculumPathMap — Jalur Belajar Berangka Duolingo 3D Serpentine Snake Path.
 * Menghadirkan jalur berkelok berkesinambungan tanpa tabrakan teks,
 * dilengkapi Peti Hadiah Unit, Trofi Ujian Praktik, dan maskot Kodi pendamping.
 */
export const CurriculumPathMap = ({
  className = '',
  currentPart,
  trackSlug = 'golang',
}: CurriculumPathMapProps) => {
  const navigate = useNavigate()
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null)
  const [activeModalNode, setActiveModalNode] = useState<PathMapNode | null>(null)

  const activeTrackConfig = TRACK_CURRICULA[trackSlug] || TRACK_CURRICULA['golang']
  const activePartNumber = currentPart ?? activeTrackConfig.defaultActivePart

  // Hitung status setiap part secara dinamis berdasarkan activePartNumber
  const units: CurriculumUnitData[] = activeTrackConfig.units.map((u) => ({
    ...u,
    parts: u.parts.map((p) => ({
      ...p,
      status:
        p.number < activePartNumber
          ? 'completed'
          : p.number === activePartNumber
          ? 'active'
          : 'locked',
    })),
  }))

  const handleNodeClick = (node: PathMapNode) => {
    triggerHaptic('tap')
    setActiveModalNode(node)
  }

  const handleGuidebookClick = (unitTitle: string) => {
    triggerHaptic('tap')
    setSelectedNotice(`Buku Panduan "${unitTitle}" memuat ringkasan konsep, cheatsheet sintaks & contoh kode produksi.`)
    setTimeout(() => setSelectedNotice(null), 4000)
  }

  // ── GENERATOR JALUR SERPENTINE BEZIER MULUS ──
  const buildSvgPath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return ''
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`

    let path = `M ${coords[0].x} ${coords[0].y}`
    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i]
      const p2 = coords[i + 1]
      const midY = (p1.y + p2.y) / 2
      path += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`
    }
    return path
  }

  return (
    <div className={`space-y-12 sm:space-y-16 select-none ${className}`}>
      {/* ── TOAST NOTIFIKASI DARI KODI (JIKA KLIK BUKU PANDUAN) ── */}
      {selectedNotice && (
        <div className="bg-amber-50 border-2 border-amber-200 text-amber-900 p-3.5 rounded-2xl text-xs font-medium flex items-center justify-between gap-3 transition-all animate-pop shadow-xs sticky top-3 z-40">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={doodleThinking}
              alt="Kodi Berpikir"
              className="w-10 h-10 object-contain shrink-0"
            />
            <span className="font-semibold">{selectedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedNotice(null)}
            className="text-amber-700 hover:text-amber-900 font-bold shrink-0 text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── INTERACTIVE LESSON MODAL / POPOVER ── */}
      {activeModalNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl animate-pop relative">
            <button
              type="button"
              onClick={() => setActiveModalNode(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              {activeModalNode.isChest ? (
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs">
                  <Gift weight="fill" className="w-6 h-6" />
                </div>
              ) : activeModalNode.isTrophy ? (
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center text-yellow-700 shadow-2xs">
                  <Trophy weight="fill" className="w-6 h-6" />
                </div>
              ) : activeModalNode.category === 'nihongo' ? (
                <div
                  className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${
                    activeModalNode.status === 'completed'
                      ? 'bg-rose-100 border-rose-300 text-rose-700'
                      : activeModalNode.status === 'active'
                      ? 'bg-rose-500 border-rose-600 text-white shadow-[0_3px_0_0_#9F1239]'
                      : 'bg-slate-100 border-slate-300 text-slate-500'
                  }`}
                >
                  <Translate weight="bold" className="w-6 h-6" />
                </div>
              ) : activeModalNode.category === 'integration' ? (
                <div
                  className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${
                    activeModalNode.status === 'completed'
                      ? 'bg-cyan-100 border-cyan-300 text-cyan-700'
                      : activeModalNode.status === 'active'
                      ? 'bg-cyan-600 border-cyan-700 text-white shadow-[0_3px_0_0_#0E7490]'
                      : 'bg-slate-100 border-slate-300 text-slate-500'
                  }`}
                >
                  <ArrowsLeftRight weight="bold" className="w-6 h-6" />
                </div>
              ) : activeModalNode.category === 'devops' ? (
                <div
                  className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${
                    activeModalNode.status === 'completed'
                      ? 'bg-amber-100 border-amber-300 text-amber-700'
                      : activeModalNode.status === 'active'
                      ? 'bg-amber-600 border-amber-700 text-white shadow-[0_3px_0_0_#B45309]'
                      : 'bg-slate-100 border-slate-300 text-slate-500'
                  }`}
                >
                  <Cpu weight="fill" className="w-6 h-6" />
                </div>
              ) : (
                <div
                  className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${
                    activeModalNode.status === 'completed'
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                      : activeModalNode.status === 'active'
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-100 border-slate-300 text-slate-500'
                  }`}
                >
                  {activeModalNode.status === 'completed' ? (
                    <Check weight="bold" className="w-6 h-6" />
                  ) : (
                    activeModalNode.number
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-400">
                    {activeModalNode.status === 'completed'
                      ? 'Selesai 100%'
                      : activeModalNode.status === 'active'
                      ? 'Sedang Berjalan'
                      : 'Modul Terkunci'}
                  </span>
                  {activeModalNode.badgeLabel && (
                    <span
                      className={`text-[9px] font-brand font-black uppercase px-1.5 py-0.5 rounded ${
                        activeModalNode.category === 'nihongo'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : activeModalNode.category === 'integration'
                          ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                          : activeModalNode.category === 'devops'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {activeModalNode.badgeLabel}
                    </span>
                  )}
                </div>
                <h3 className="font-brand font-black text-base text-slate-900 leading-tight mt-0.5">
                  {activeModalNode.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {activeModalNode.subtitle}
            </p>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-amber-700">
                <Lightning weight="fill" className="w-4 h-4 text-amber-500" />
                <span>+{activeModalNode.xpReward} XP Reward</span>
              </span>
              {activeModalNode.isChest && <span className="text-amber-600">+20 💎 Permata</span>}
            </div>

            {activeModalNode.status === 'locked' ? (
              <Button3D
                variant="white"
                size="md"
                fullWidth
                onClick={() => setActiveModalNode(null)}
                className="text-xs py-2.5 opacity-80"
              >
                TERKUNCI • SELESAIKAN MODUL SEBELUMNYA
              </Button3D>
            ) : (
              <Button3D
                variant={
                  activeModalNode.status === 'completed'
                    ? 'emerald'
                    : activeModalNode.category === 'nihongo'
                    ? 'rose'
                    : activeModalNode.category === 'integration'
                    ? 'cyan'
                    : 'blue'
                }
                size="md"
                fullWidth
                onClick={() => {
                  setActiveModalNode(null)
                  navigate(activeModalNode.route)
                }}
                className="text-xs py-2.5 shadow-[0_3px_0_0_#047857]"
              >
                {activeModalNode.status === 'completed'
                  ? 'KODING ULANG (LATIHAN)'
                  : 'MULAI KODING SEKARANG'}
              </Button3D>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── UNIFIED ADVENTURE GAME STAGE (PANGGUNG KANVAS UTAMA) ───── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-2xl mx-auto w-full bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-7 relative overflow-visible space-y-12 sm:space-y-16 bg-[radial-gradient(#E2E8F0_1.2px,transparent_1.2px)] [background-size:24px_24px]">
        {units.map((unit) => {
        // Buat daftar lengkap stepping stone (Part + Peti Emas + Trofi Ujian)
        const allNodes: PathMapNode[] = [
          ...unit.parts.map((p) => ({
            id: p.id,
            title: `Part ${p.number}: ${p.title}`,
            subtitle: p.subtitle,
            number: p.number,
            xpReward: p.xpReward,
            status: p.status,
            route: p.route,
            category: p.category,
            badgeLabel: p.badgeLabel,
          })),
        ]

        // Tambahkan Milestone Peti Emas & Trofi Ujian
        const isUnitCompleted = unit.parts.every((p) => p.status === 'completed')
        const isUnitActive = unit.parts.some((p) => p.status === 'active')

        // Node Milestone Peti Hadiah
        allNodes.push({
          id: `${unit.id}-chest`,
          title: `Peti Emas Hadiah ${unit.title.split(',')[0]}`,
          subtitle: 'Klaim bonus permata dan pelindung streak untuk penyelesaian modul unit.',
          xpReward: 30,
          status: isUnitCompleted ? 'completed' : isUnitActive ? 'active' : 'locked',
          route: '/dashboard',
          isChest: true,
        })

        // Node Milestone Trofi Ujian Praktik
        allNodes.push({
          id: `${unit.id}-trophy`,
          title: `Tantangan Praktik Unit ${unit.unitNumber}`,
          subtitle: 'Uji pemahaman koding secara komprehensif untuk membuka unit berikutnya.',
          xpReward: 50,
          status: isUnitCompleted ? 'completed' : 'locked',
          route: '/courses',
          isTrophy: true,
        })

        // Tentukan koordinat Serpentine S-Curve lega untuk setiap node
        // Pola ayunan 4 titik mulus: Kiri (135px) -> Tengah (200px) -> Kanan (265px) -> Tengah (200px)
        const xSequence = [135, 200, 265, 200]
        const VERTICAL_SPACING = 175 // Jarak lega 175px mencegah tabrakan kartu & disc
        const START_Y = 135 // Margin atas 135px memberi ruang bebas sempurna untuk popover aktif (-top-28)

        const coords = allNodes.map((_, idx) => {
          const y = START_Y + idx * VERTICAL_SPACING
          const x = xSequence[idx % 4]
          return { x, y }
        })

        const totalHeight = START_Y + allNodes.length * VERTICAL_SPACING + 70
        const svgPathString = buildSvgPath(coords)

        return (
          <section key={unit.id} className="space-y-4">
            {/* ── UNIT BANNER HEADER (COMPACT DUOLINGO CHECKPOINT ARCHWAY) ── */}
            <div
              className={`max-w-xl mx-auto w-full text-white rounded-2xl px-5 py-3.5 sm:px-6 sm:py-4 shadow-[0_4px_0_0_rgba(0,0,0,0.18)] relative overflow-hidden flex items-center justify-between gap-4 border ${unit.bannerBorder} ${unit.bannerGradient}`}
            >
              {/* Glossy Glass Reflection Highlight */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/5 to-transparent rounded-t-2xl pointer-events-none" />

              {/* Decorative Subtle Ambient Glow Bubble */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="space-y-1 min-w-0 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-brand font-black text-xs uppercase tracking-wider text-white/90">
                    UNIT {unit.unitNumber}
                  </span>
                  <span className="text-white/40 text-xs">•</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                    {isUnitCompleted ? (
                      <>
                        <Check weight="bold" className="w-3 h-3 text-emerald-200" />
                        <span>SELESAI</span>
                      </>
                    ) : isUnitActive ? (
                      <>
                        <Sparkle weight="fill" className="w-3 h-3 text-amber-300" />
                        <span>AKTIF</span>
                      </>
                    ) : (
                      <>
                        <LockSimple weight="bold" className="w-3 h-3 text-white/80" />
                        <span>TERKUNCI</span>
                      </>
                    )}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-brand font-black tracking-tight text-white leading-snug truncate">
                  {unit.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => handleGuidebookClick(unit.title)}
                className="shrink-0 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-brand font-black text-xs px-3.5 py-2 rounded-xl border border-white/30 flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs shadow-2xs relative z-10"
              >
                <BookOpen weight="bold" className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">BUKU PANDUAN</span>
                <span className="sm:hidden">PANDUAN</span>
              </button>
            </div>

            {/* ── SERPENTINE SNAKE PATH (OPEN WORLD CANVAS) ── */}
            <div className="relative py-4 sm:py-6 overflow-visible">
              {/* Soft Ambient Spotlight Glow (Biome Aura) */}
              <div
                className={`absolute top-6 left-1/2 -translate-x-1/2 w-80 sm:w-[440px] h-[450px] -z-10 pointer-events-none rounded-full blur-3xl opacity-30 ${
                  isUnitCompleted
                    ? 'bg-emerald-400'
                    : isUnitActive
                    ? 'bg-blue-400'
                    : 'bg-indigo-400'
                }`}
              />

              {/* Decorative Ambient Code Stamps on Margins */}
              <div className="hidden lg:block absolute left-4 top-16 text-slate-300 font-mono font-black text-2xl select-none pointer-events-none opacity-60">
                {'{ }'}
              </div>
              <div className="hidden lg:block absolute right-4 top-28 text-slate-400 font-mono font-bold text-[10px] select-none pointer-events-none bg-white/80 border border-slate-200/80 px-2 py-1 rounded-lg shadow-2xs backdrop-blur-xs">
                func() : tokyo_prod
              </div>
              <div className="hidden lg:block absolute left-4 bottom-24 text-slate-400 font-mono font-bold text-[10px] select-none pointer-events-none bg-white/80 border border-slate-200/80 px-2 py-1 rounded-lg shadow-2xs backdrop-blur-xs">
                := stack alloc
              </div>
              <div className="hidden lg:block absolute right-4 bottom-16 text-slate-300 font-brand font-black text-xl select-none pointer-events-none opacity-50">
                ⚡ +50XP
              </div>

              <div
                className="relative w-full max-w-lg mx-auto overflow-visible"
                style={{ height: `${totalHeight}px` }}
              >
                {/* ── CONTINUOUS SERPENTINE SVG TRACK ── */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox={`0 0 400 ${totalHeight}`}
                  preserveAspectRatio="none"
                  fill="none"
                >
                  {/* Outer Subtle Ambient Glow for Active Track */}
                  {isUnitActive && (
                    <path
                      d={svgPathString}
                      stroke="#93C5FD"
                      strokeWidth="20"
                      strokeLinecap="round"
                      opacity="0.35"
                    />
                  )}

                  {/* Thick Base Foundation Track */}
                  <path
                    d={svgPathString}
                    stroke="#E2E8F0"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Inner Active / Completed Dashed Line */}
                  <path
                    d={svgPathString}
                    stroke={
                      isUnitCompleted
                        ? '#10B981'
                        : isUnitActive
                        ? '#2563EB'
                        : '#94A3B8'
                    }
                    strokeWidth="4"
                    strokeDasharray="10 12"
                    strokeLinecap="round"
                    opacity={isUnitCompleted || isUnitActive ? '0.75' : '0.4'}
                  />
                </svg>

                {/* ── STEPPING STONE NODES ── */}
                {allNodes.map((node, nIdx) => {
                  const coord = coords[nIdx]
                  const leftPercent = (coord.x / 400) * 100
                  const topPx = coord.y - 36 // Center the 72px disc

                  return (
                    <div
                      key={node.id}
                      className="absolute -translate-x-1/2 flex flex-col items-center group cursor-pointer"
                      style={{
                        left: `${leftPercent}%`,
                        top: `${topPx}px`,
                      }}
                      onClick={() => handleNodeClick(node)}
                    >
                      {/* ── DUOLINGO FLOATING POPOVER CARD FOR ACTIVE LESSON ── */}
                      {node.status === 'active' && !node.isChest && !node.isTrophy && (
                        <div className="absolute -top-28 z-30 flex flex-col items-center select-none animate-bounce-subtle pointer-events-auto">
                          <div
                            className={`bg-white border-2 rounded-2xl p-3 shadow-md text-center max-w-[210px] space-y-1.5 relative ${
                              node.category === 'nihongo'
                                ? 'border-rose-400'
                                : node.category === 'integration'
                                ? 'border-cyan-400'
                                : node.category === 'devops'
                                ? 'border-amber-400'
                                : 'border-blue-400'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              <span
                                className={`text-[10px] font-brand font-black uppercase tracking-wider flex items-center justify-center gap-1 ${
                                  node.category === 'nihongo'
                                    ? 'text-rose-600'
                                    : node.category === 'integration'
                                    ? 'text-cyan-600'
                                    : node.category === 'devops'
                                    ? 'text-amber-600'
                                    : 'text-blue-600'
                                }`}
                              >
                                <Sparkle weight="fill" className="w-3 h-3" />
                                <span>Sedang Berjalan</span>
                              </span>
                              {node.badgeLabel && (
                                <span
                                  className={`text-[9px] font-brand font-black uppercase px-1 py-0.2 rounded ${
                                    node.category === 'nihongo'
                                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                      : node.category === 'integration'
                                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {node.badgeLabel}
                                </span>
                              )}
                            </div>
                            <h4 className="font-brand font-black text-xs text-slate-900 leading-snug">
                              {node.title}
                            </h4>
                            <Button3D
                              variant={
                                node.category === 'nihongo'
                                  ? 'rose'
                                  : node.category === 'integration'
                                  ? 'cyan'
                                  : 'blue'
                              }
                              size="sm"
                              fullWidth
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(node.route)
                              }}
                              className="text-[10px] py-1.5"
                            >
                              {node.category === 'nihongo'
                                ? 'MULAI NIHONGO 🌸'
                                : node.category === 'integration'
                                ? 'HANDSHAKE FITUR 🔗'
                                : 'LANJUTKAN KODING 💻'}
                            </Button3D>

                            {/* Downward Speech Bubble Triangle */}
                            <div
                              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r-2 border-b-2 rotate-45 ${
                                node.category === 'nihongo'
                                  ? 'border-rose-400'
                                  : node.category === 'integration'
                                  ? 'border-cyan-400'
                                  : node.category === 'devops'
                                  ? 'border-amber-400'
                                  : 'border-blue-400'
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      {/* ── KODI CHEERING COMPANION BESIDE ACTIVE LESSON ── */}
                      {node.status === 'active' && (
                        <div
                          className={`absolute ${
                            coord.x > 200 ? '-left-32 sm:-left-36' : '-right-32 sm:-right-36'
                          } top-2 hidden md:flex flex-col items-center select-none z-20 pointer-events-none`}
                        >
                          <div className="relative flex flex-col items-center animate-bounce-subtle">
                            <img
                              src={doodleCoding}
                              alt="Kodi Ngoding"
                              className="w-16 h-16 object-contain drop-shadow-md transition-transform hover:-translate-y-1"
                            />
                            <div className="w-14 h-2.5 bg-slate-300/60 rounded-[50%] blur-2xs -mt-1" />
                          </div>
                        </div>
                      )}

                      {/* ── STEPPING STONE 3D DISC ── */}
                      <div className="relative z-10">
                        {node.isChest ? (
                          /* 3D Milestone Chest Node */
                          <div
                            className={`w-18 h-18 rounded-2xl flex items-center justify-center transition-all shadow-[0_5px_0_0_#B45309] active:shadow-none active:translate-y-1 border-2 ${
                              node.status === 'completed'
                                ? 'bg-gradient-to-b from-amber-300 to-amber-500 border-amber-600 shadow-[0_5px_0_0_#92400E]'
                                : node.status === 'active'
                                ? 'bg-gradient-to-b from-amber-400 to-orange-500 border-amber-600 ring-4 ring-amber-200 animate-pulse'
                                : 'bg-slate-100 border-slate-300 shadow-[0_4px_0_0_#CBD5E1]'
                            }`}
                            title={node.title}
                          >
                            <Gift
                              weight="fill"
                              className={`w-9 h-9 drop-shadow-xs ${
                                node.status === 'locked' ? 'text-slate-400' : 'text-amber-950'
                              }`}
                            />
                            {node.status === 'completed' && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
                                <Check weight="bold" className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                        ) : node.isTrophy ? (
                          /* 3D Milestone Trophy Node */
                          <div
                            className={`w-18 h-18 rounded-2xl flex items-center justify-center transition-all shadow-[0_5px_0_0_#CA8A04] active:shadow-none active:translate-y-1 border-2 ${
                              node.status === 'completed'
                                ? 'bg-gradient-to-b from-yellow-300 to-amber-500 border-yellow-600 shadow-[0_5px_0_0_#A16207]'
                                : 'bg-slate-100 border-slate-300 shadow-[0_4px_0_0_#CBD5E1]'
                            }`}
                            title={node.title}
                          >
                            <Trophy
                              weight="fill"
                              className={`w-9 h-9 drop-shadow-xs ${
                                node.status === 'completed' ? 'text-amber-950' : 'text-slate-400'
                              }`}
                            />
                            {node.status === 'completed' && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
                                <Check weight="bold" className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                        ) : node.status === 'completed' ? (
                          /* 3D Completed Lesson Node */
                          <div className="relative">
                            <div
                              className={`w-16 h-16 rounded-full hover:brightness-105 active:translate-y-1 text-white font-brand font-black text-2xl active:shadow-none flex items-center justify-center transition-all group-hover:scale-105 ${
                                node.category === 'nihongo'
                                  ? 'bg-rose-500 shadow-[0_5px_0_0_#9F1239]'
                                  : node.category === 'integration'
                                  ? 'bg-cyan-600 shadow-[0_5px_0_0_#0E7490]'
                                  : node.category === 'devops'
                                  ? 'bg-amber-600 shadow-[0_5px_0_0_#B45309]'
                                  : 'bg-emerald-500 shadow-[0_5px_0_0_#047857]'
                              }`}
                            >
                              {node.category === 'nihongo' ? (
                                <Translate weight="bold" className="w-7 h-7" />
                              ) : node.category === 'integration' ? (
                                <ArrowsLeftRight weight="bold" className="w-7 h-7" />
                              ) : node.category === 'devops' ? (
                                <Cpu weight="fill" className="w-7 h-7" />
                              ) : (
                                <span>{node.number}</span>
                              )}
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
                              <Check weight="bold" className="w-3.5 h-3.5 stroke-[2]" />
                            </div>
                          </div>
                        ) : node.status === 'active' ? (
                          /* 3D Active Lesson Node with Pulsing Ring */
                          <div className="relative">
                            <div
                              className={`w-18 h-18 rounded-full hover:brightness-105 active:translate-y-1 text-white font-brand font-black text-3xl active:shadow-none flex items-center justify-center transition-all group-hover:scale-105 ${
                                node.category === 'nihongo'
                                  ? 'bg-rose-500 shadow-[0_6px_0_0_#BE123C] ring-8 ring-rose-100'
                                  : node.category === 'integration'
                                  ? 'bg-cyan-600 shadow-[0_6px_0_0_#0E7490] ring-8 ring-cyan-100'
                                  : node.category === 'devops'
                                  ? 'bg-amber-600 shadow-[0_6px_0_0_#B45309] ring-8 ring-amber-100'
                                  : 'bg-blue-600 shadow-[0_6px_0_0_#1D4ED8] ring-8 ring-blue-100'
                              }`}
                            >
                              {node.category === 'nihongo' ? (
                                <Translate weight="bold" className="w-8 h-8" />
                              ) : node.category === 'integration' ? (
                                <ArrowsLeftRight weight="bold" className="w-8 h-8" />
                              ) : node.category === 'devops' ? (
                                <Cpu weight="fill" className="w-8 h-8" />
                              ) : (
                                <span>{node.number}</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* 3D Locked Lesson Node */
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-slate-100 hover:bg-slate-200 active:translate-y-1 text-slate-400 font-brand font-black text-2xl border-2 border-slate-200 shadow-[0_4px_0_0_#CBD5E1] active:shadow-none flex items-center justify-center transition-all">
                              {node.category === 'nihongo' ? (
                                <Translate weight="bold" className="w-7 h-7 text-slate-400" />
                              ) : node.category === 'integration' ? (
                                <ArrowsLeftRight weight="bold" className="w-7 h-7 text-slate-400" />
                              ) : node.category === 'devops' ? (
                                <Cpu weight="fill" className="w-7 h-7 text-slate-400" />
                              ) : (
                                <span>{node.number}</span>
                              )}
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-slate-600 shadow-2xs">
                              <LockSimple weight="bold" className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── COLLISION-FREE PILLS & LABELS ── */}
                      {node.isChest ? (
                        <div className="mt-2.5 z-20 bg-amber-50 border border-amber-200/90 rounded-full px-3 py-0.5 text-center shadow-2xs">
                          <span className="font-brand font-black text-[10px] text-amber-800">
                            {node.status === 'completed' ? '🎁 Diklaim (+30 XP)' : '🎁 Peti Hadiah (+30 XP)'}
                          </span>
                        </div>
                      ) : node.isTrophy ? (
                        <div className="mt-2.5 z-20 bg-yellow-50 border border-yellow-200/90 rounded-full px-3 py-0.5 text-center shadow-2xs">
                          <span className="font-brand font-black text-[10px] text-yellow-800">
                            {node.status === 'completed' ? '🏆 Lulus (+50 XP)' : '🏆 Ujian Praktik (+50 XP)'}
                          </span>
                        </div>
                      ) : node.status !== 'active' ? (
                        <div className="mt-2 z-20 max-w-[170px] bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl px-2.5 py-1 text-center shadow-2xs group-hover:border-blue-400 transition-colors">
                          {node.badgeLabel && (
                            <span
                              className={`text-[9px] font-brand font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md inline-block mb-0.5 ${
                                node.category === 'nihongo'
                                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {node.badgeLabel}
                            </span>
                          )}
                          <h5 className="font-brand font-black text-[11px] text-slate-900 leading-snug line-clamp-2">
                            {node.title}
                          </h5>
                          <span
                            className={`text-[10px] font-bold block mt-0.5 ${
                              node.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          >
                            {node.status === 'completed'
                              ? `Selesai (+${node.xpReward} XP)`
                              : 'Terkunci'}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}
      </div>
    </div>
  )
}

