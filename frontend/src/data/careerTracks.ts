import { CURRICULUM_TRACKS_MAP } from './curriculumData'

export interface CareerTrackItem {
  id: string
  slug: string
  title: string
  subtitle: string
  category: 'coding' | 'language'
  iconType: 'fundamental' | 'golang' | 'frontend' | 'devops' | 'nihongo'
  badgeLabel: string
  badgeVariant: 'active' | 'available' | 'featured'
  progressPercent: number
  partsCompleted: number
  totalParts: number
}

export const CAREER_TRACKS: CareerTrackItem[] = [
  {
    id: 'track-golang',
    slug: 'golang',
    title: 'Backend Engineer (Golang)',
    subtitle: 'Arsitektur Server, REST API Gin, Database Pgx, Concurrency & Nihongo Kerja Tokyo',
    category: 'coding',
    iconType: 'golang',
    badgeLabel: 'Sedang Populer',
    badgeVariant: 'active',
    progressPercent: 0,
    partsCompleted: 0,
    totalParts: CURRICULUM_TRACKS_MAP['golang']?.flatMap((u) => u.parts).length || 12,
  },
  {
    id: 'track-frontend',
    slug: 'frontend',
    title: 'Frontend Engineer (React & TS)',
    subtitle: 'Strict TypeScript, Arsitektur Komponen, Custom Hooks, REST API & Nihongo Kerja Tokyo',
    category: 'coding',
    iconType: 'frontend',
    badgeLabel: 'Populer',
    badgeVariant: 'featured',
    progressPercent: 0,
    partsCompleted: 0,
    totalParts: CURRICULUM_TRACKS_MAP['frontend']?.flatMap((u) => u.parts).length || 12,
  },
  {
    id: 'track-devops',
    slug: 'devops',
    title: 'DevOps & Cloud Engineer',
    subtitle: 'Linux Systemd, Container Docker, CI/CD Pipeline, Cloud Infra & Nihongo Kerja Tokyo',
    category: 'coding',
    iconType: 'devops',
    badgeLabel: 'Tersedia',
    badgeVariant: 'available',
    progressPercent: 0,
    partsCompleted: 0,
    totalParts: CURRICULUM_TRACKS_MAP['devops']?.flatMap((u) => u.parts).length || 12,
  },
  {
    id: 'track-fundamental',
    slug: 'fundamental',
    title: 'Dasar IT & Computer Science',
    subtitle: 'Arsitektur CPU, Stack vs Heap, Algoritma, Big-O, Git Collaborative & Protokol HTTP',
    category: 'coding',
    iconType: 'fundamental',
    badgeLabel: 'Fondasi',
    badgeVariant: 'available',
    progressPercent: 0,
    partsCompleted: 0,
    totalParts: CURRICULUM_TRACKS_MAP['fundamental']?.flatMap((u) => u.parts).length || 9,
  },
  {
    id: 'track-nihongo',
    slug: 'nihongo',
    title: 'Tech Nihongo & Kerja Tokyo',
    subtitle: 'Aisatsu, Standup Meeting Asakai, Sekkeisho, Code Review & Simulasi Mensetsu Tokyo',
    category: 'language',
    iconType: 'nihongo',
    badgeLabel: 'Bahasa Kerja',
    badgeVariant: 'available',
    progressPercent: 0,
    partsCompleted: 0,
    totalParts: CURRICULUM_TRACKS_MAP['nihongo']?.flatMap((u) => u.parts).length || 9,
  },
]
