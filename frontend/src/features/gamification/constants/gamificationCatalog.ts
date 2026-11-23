import {
  ShieldCheck,
  Flask,
  FileText,
  Microphone,
  type Icon,
} from '@phosphor-icons/react'
import type { ReadinessExamResponse } from '@/features/exercise/types/exercise'

export type QuestPageTab = 'daily' | 'milestones' | 'shop'

export type ShopCategoryFilter = 'all' | 'protection' | 'booster' | 'career'

export type BadgeFilterTab = 'all' | 'earned' | 'locked'

export interface ShopItem {
  id: string
  title: string
  subtitle: string
  price: number
  badge: string
  badgeColor: string
  icon: Icon
  iconBg: string
  iconColor: string
  category: 'protection' | 'booster' | 'career'
}

export interface DailyChestTierConfig {
  tier: 1 | 2 | 3
  label: string
  reward: string
  gemReward: number
  xpReward: number
  icon: string
}

export interface DailyChestItem extends DailyChestTierConfig {
  unlocked: boolean
}

export interface DailyQuestViewItem {
  id: string
  title: string
  chip_label: string
  difficulty: string
  xp_reward: number
  gem_reward: number
  estimated_minutes: number
  isCompleted: boolean
  isClaimed?: boolean
  route: string
  icon: Icon
  iconName?: string
  progressText: string
  progressPercent: number
}

export interface LevelExamSummary {
  levelId: string
  levelCode: string
  languageName: string
  examName: string
  passingScorePercent: number
  completedLessons: number
  totalLessons: number
  progressPercent: number
  status: 'locked' | 'ready' | 'passed'
  nextLessonRoute: string
  nextLessonTitle: string | null
  examRoute: string
  passedResult: ReadinessExamResponse | null
}

export interface AchievementBadgeViewItem {
  id: string
  title: string
  description: string
  category: string
  icon: string
  xpReward: number
  isEarned: boolean
  awardedAt: string | null
  currentProgress: number
  targetProgress: number
  progressLabel: string
  progressPercent: number
  actionLabel: string | null
  actionType: 'navigate' | 'switch_tab_daily' | 'open_track_switcher' | null
  actionRoute?: string
}

export const DAILY_CHEST_TIERS: DailyChestTierConfig[] = [
  {
    tier: 1,
    label: 'Peti Perunggu',
    reward: '+5 Gems · +20 XP',
    gemReward: 5,
    xpReward: 20,
    icon: 'bronze',
  },
  {
    tier: 2,
    label: 'Peti Perak',
    reward: '+15 Gems · +50 XP',
    gemReward: 15,
    xpReward: 50,
    icon: 'silver',
  },
  {
    tier: 3,
    label: 'Peti Emas',
    reward: '+30 Gems · +100 XP',
    gemReward: 30,
    xpReward: 100,
    icon: 'gold',
  },
]

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'streak-freeze',
    title: 'Streak Freeze',
    subtitle: 'Perlindungan 1 hari penuh agar streak tetap aman saat kamu berhalangan belajar.',
    price: 20,
    badge: 'POPULER',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: ShieldCheck,
    iconBg: 'bg-gradient-to-b from-sky-400 to-blue-600 shadow-[0_3px_0_0_#1D4ED8]',
    iconColor: 'text-white',
    category: 'protection',
  },
  {
    id: 'xp-booster',
    title: 'Bonus 2x XP',
    subtitle: 'Gandakan perolehan XP selama 15 menit saat belajar pelajaran maupun flashcard.',
    price: 35,
    badge: 'BONUS XP',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Flask,
    iconBg: 'bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_3px_0_0_#B45309]',
    iconColor: 'text-white',
    category: 'booster',
  },
  {
    id: 'cv-review',
    title: 'Kupon Review CV Global',
    subtitle: 'Audit CV (Rirekisho / Lebenslauf / Resume Internasional) dan portofolio bersama mentor.',
    price: 100,
    badge: 'KARIER GLOBAL',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: FileText,
    iconBg: 'bg-gradient-to-b from-emerald-400 to-teal-600 shadow-[0_3px_0_0_#0F766E]',
    iconColor: 'text-white',
    category: 'career',
  },
  {
    id: 'mock-interview',
    title: 'Akses VIP Mock Interview',
    subtitle: 'Simulasi 1-on-1 wawancara kerja berbahasa target bersama mentor via Discord Voice.',
    price: 150,
    badge: 'EKSKLUSIF',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Microphone,
    iconBg: 'bg-gradient-to-b from-violet-500 to-purple-600 shadow-[0_3px_0_0_#6D28D9]',
    iconColor: 'text-white',
    category: 'career',
  },
]
