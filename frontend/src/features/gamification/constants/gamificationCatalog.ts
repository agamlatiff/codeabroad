import {
  ShieldCheck,
  Flask,
  FileText,
  Microphone,
  Fire,
  GraduationCap,
  type Icon,
} from '@phosphor-icons/react'

export type QuestPageTab = 'daily' | 'boss' | 'shop'

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

export interface MilestoneChallengeConfig {
  id: string
  title: string
  subtitle: string
  tags: string[]
  icon: string
  iconComponent: Icon
  iconBg: string
  xp_reward: number
  gem_reward: number
  route: string
}

export interface MilestoneChallengeViewItem extends MilestoneChallengeConfig {
  isCompleted: boolean
}

export const DAILY_CHEST_TIERS: DailyChestTierConfig[] = [
  {
    tier: 1,
    label: 'Peti Perunggu',
    reward: '+5 💎 & XP',
    gemReward: 5,
    xpReward: 20,
    icon: '🥉',
  },
  {
    tier: 2,
    label: 'Peti Perak',
    reward: '+15 💎 & XP',
    gemReward: 15,
    xpReward: 50,
    icon: '🥈',
  },
  {
    tier: 3,
    label: 'Peti Emas',
    reward: '+30 💎 & XP',
    gemReward: 30,
    xpReward: 100,
    icon: '👑',
  },
]

export const MILESTONE_CHALLENGES: MilestoneChallengeConfig[] = [
  {
    id: 'boss-level-evaluation',
    title: 'Evaluasi Kesiapan Level & Kosakata Inti',
    subtitle:
      'Uji penguasaan membaca, menyimak, menulis, dan berbicara pada kurikulum bahasa aktif sebelum naik tingkat.',
    tags: ['EVALUASI LEVEL', 'READING', 'LISTENING'],
    icon: '🔥',
    iconComponent: Fire,
    iconBg: 'bg-gradient-to-b from-orange-400 to-rose-500 shadow-[0_3px_0_0_#BE123C]',
    xp_reward: 250,
    gem_reward: 50,
    route: '/curriculum',
  },
  {
    id: 'capstone-global-communication',
    title: 'Simulasi Komunikasi Profesional & Sertifikasi',
    subtitle:
      'Latihan dialog situasi kerja internasional, tata bahasa formal, serta kesiapan ujian resmi (JLPT / IELTS / Goethe / HSK / DELF).',
    tags: ['SPEAKING', 'WRITING', 'SERTIFIKASI'],
    icon: '🏛️',
    iconComponent: GraduationCap,
    iconBg: 'bg-gradient-to-b from-indigo-500 to-violet-600 shadow-[0_3px_0_0_#4338CA]',
    xp_reward: 500,
    gem_reward: 100,
    route: '/curriculum',
  },
]

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'streak-freeze',
    title: 'Streak Freeze ❄️',
    subtitle: 'Perlindungan 1 hari penuh dari pemutusan streak saat Anda berhalangan hadir.',
    price: 20,
    badge: 'POPULER 🔥',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: ShieldCheck,
    iconBg: 'bg-gradient-to-b from-sky-400 to-blue-600 shadow-[0_3px_0_0_#1D4ED8]',
    iconColor: 'text-white',
    category: 'protection',
  },
  {
    id: 'xp-booster',
    title: 'XP Booster Potion 🧪',
    subtitle: 'Bonus perlengkapan koleksi & booster fokus untuk mempercepat progres belajar bahasa.',
    price: 35,
    badge: 'BOOSTER ⚡',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Flask,
    iconBg: 'bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_3px_0_0_#B45309]',
    iconColor: 'text-white',
    category: 'booster',
  },
  {
    id: 'cv-review',
    title: 'Kupon Review CV Global 📋',
    subtitle: 'Audit CV (Rirekisho / Lebenslauf / Resume Internasional) dan portofolio bersama mentor.',
    price: 100,
    badge: 'KARIER GLOBAL 🌐',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: FileText,
    iconBg: 'bg-gradient-to-b from-emerald-400 to-teal-600 shadow-[0_3px_0_0_#0F766E]',
    iconColor: 'text-white',
    category: 'career',
  },
  {
    id: 'mock-interview',
    title: 'Akses VIP Mock Interview 🎙️',
    subtitle: 'Simulasi 1-on-1 wawancara kerja berbahasa target bersama mentor via Discord Voice.',
    price: 150,
    badge: 'EKSKLUSIF ⭐',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Microphone,
    iconBg: 'bg-gradient-to-b from-violet-500 to-purple-600 shadow-[0_3px_0_0_#6D28D9]',
    iconColor: 'text-white',
    category: 'career',
  },
]
