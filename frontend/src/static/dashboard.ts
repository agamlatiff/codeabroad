import type { KodiPose } from '../components/ui/MascotCard'

export interface RoadmapNodeItem {
  id: number
  title: string
  desc: string
  status: 'completed' | 'active' | 'locked'
  xp: string
  level: string
}

/**
 * Initial curriculum roadmap nodes for career dashboard.
 */
export const INITIAL_ROADMAP_NODES: RoadmapNodeItem[] = [
  {
    id: 1,
    title: 'Fondasi Git & Go CLI',
    desc: 'Penguasaan toolchain & syntax standar industri global',
    status: 'completed',
    xp: '+50 XP',
    level: 'Lv. 1',
  },
  {
    id: 2,
    title: 'Clean Architecture & REST API',
    desc: 'Implementasi 4-layer Gin, domain modeling & unit test',
    status: 'active',
    xp: '+80 XP',
    level: 'Lv. 2',
  },
  {
    id: 3,
    title: 'Concurrency, Redis & Kafka',
    desc: 'Goroutine pipeline, event streaming & distributed cache',
    status: 'locked',
    xp: '+120 XP',
    level: 'Lv. 3',
  },
  {
    id: 4,
    title: 'Tokyo Technical Mock Interview',
    desc: 'Simulasi live coding & interview kultur kerja Jepang',
    status: 'locked',
    xp: '+200 XP',
    level: 'Lv. 4',
  },
]

export interface DailyQuestItem {
  id: number
  title: string
  category: string
  xp: number
  completed: boolean
  difficulty: 'Mudah' | 'Menengah' | 'Spesial'
  diffColor: string
}

/**
 * Initial daily coding quests for dashboard gamification.
 */
export const INITIAL_DAILY_QUESTS: DailyQuestItem[] = [
  {
    id: 1,
    title: 'Pecahkan 1 Algoritma Two-Pointer',
    category: 'LeetCode Tokyo',
    xp: 25,
    completed: true,
    difficulty: 'Mudah',
    diffColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 2,
    title: 'Implementasikan Domain Layer di Clean Arch',
    category: 'Backend Mastery',
    xp: 35,
    completed: false,
    difficulty: 'Menengah',
    diffColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 3,
    title: 'Pelajari 5 Kosakata Tech Business Japanese',
    category: 'Kultur & Bahasa',
    xp: 40,
    completed: false,
    difficulty: 'Spesial',
    diffColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
]

/**
 * Returns dynamic speech bubble message for Kodi mascot.
 */
export const getKodiPoseMessage = (
  pose: KodiPose,
  firstName: string = 'Developer',
  destinationName: string = 'Tokyo, Jepang'
): string => {
  const messages: Record<KodiPose, string> = {
    welcome: `Konnichiwa, ${firstName}-san! Kodi siap mendampingi persiapan teknismu menuju karier global di ${destinationName}! 🎌`,
    coding: `Mode fokus AKTIF! Ayo selesaikan quest harian untuk mendongkrak skor interview teknismu... 💻`,
    celebrate: `Yatta! Paspor karier aktif, streak 1 hari bertambah, dan bonus +50 XP siap digunakan! 🎉`,
  }
  return messages[pose] || messages.welcome
}
