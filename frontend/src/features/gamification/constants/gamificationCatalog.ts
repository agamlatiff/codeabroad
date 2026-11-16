import {
  ShieldCheck,
  Flask,
  FileText,
  Microphone,
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
  route: string
  icon: Icon
  progressText: string
  progressPercent: number
}

export interface MilestoneChallengeConfig {
  id: string
  title: string
  subtitle: string
  tags: string[]
  icon: string
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
    id: 'boss-jlpt-n5',
    title: 'Evaluasi Level JLPT N5 & Penguasaan Aksara',
    subtitle:
      'Uji pemahaman Hiragana, Katakana, Kanji dasar, serta tata bahasa inti sebelum naik ke level berikutnya.',
    tags: ['JLPT N5', 'KANJI', 'GRAMMAR'],
    icon: '🔥',
    xp_reward: 250,
    gem_reward: 50,
    route: '/curriculum',
  },
  {
    id: 'capstone-keigo-business',
    title: 'Simulasi Percakapan Kerja & Keigo Jepang',
    subtitle:
      'Latihan dialog situasi kantor, perkenalan profesional (Jikoshoukai), dan tata krama bahasa bisnis.',
    tags: ['KEIGO', 'SPEAKING', 'LISTENING'],
    icon: '🏛️',
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
    iconBg: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    category: 'protection',
  },
  {
    id: 'xp-booster',
    title: 'XP Booster Potion 🧪',
    subtitle: 'Pengganda 2x XP untuk setiap latihan bahasa & kuis selama 30 menit ke depan.',
    price: 35,
    badge: 'BOOSTER ⚡',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Flask,
    iconBg: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    category: 'booster',
  },
  {
    id: 'cv-review',
    title: 'Kupon Review CV Global 📋',
    subtitle: 'Audit CV (Rirekisho/Lebenslauf) dan portofolio persiapan kerja internasional oleh mentor.',
    price: 100,
    badge: 'KARIER GLOBAL 🇯🇵',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: FileText,
    iconBg: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
    category: 'career',
  },
  {
    id: 'mock-interview',
    title: 'Akses VIP Mock Interview 🎙️',
    subtitle: 'Simulasi 1-on-1 wawancara kerja berbahasa Jepang/Inggris bersama mentor via Discord.',
    price: 150,
    badge: 'EKSKLUSIF ⭐',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Microphone,
    iconBg: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    category: 'career',
  },
]
