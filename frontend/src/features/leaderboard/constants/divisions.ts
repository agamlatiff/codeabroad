import type { TokyoDivision } from "@/features/leaderboard/types/leaderboard"

export interface DivisionConfig {
  id: TokyoDivision
  name: string
  tier: string
  xpRange: string
  levelLabel: string
  iconColor: string
  badgeColor: string
  description: string
}

export const TOKYO_DIVISIONS: DivisionConfig[] = [
  {
    id: 'shinjuku',
    name: 'Liga Perunggu',
    tier: 'Bronze League',
    xpRange: '0 – 299 XP',
    levelLabel: 'Pemula',
    iconColor: 'text-[#B45309]',
    badgeColor: 'border-amber-500 bg-amber-50 text-amber-900',
    description: 'Zona kompetisi bagi pembelajar baru yang memulai dasar aksara & kosakata global.',
  },
  {
    id: 'shibuya',
    name: 'Liga Perak',
    tier: 'Silver League',
    xpRange: '300 – 799 XP',
    levelLabel: 'Menengah',
    iconColor: 'text-[#94A3B8]',
    badgeColor: 'border-slate-400 bg-slate-50 text-slate-800',
    description: 'Kompetisi aktif bagi pembelajar yang menguasai tata bahasa inti & percakapan harian.',
  },
  {
    id: 'akihabara',
    name: 'Liga Emas',
    tier: 'Gold League',
    xpRange: '800 – 1.499 XP',
    levelLabel: 'Lanjutan',
    iconColor: 'text-[#F59E0B]',
    badgeColor: 'border-amber-400 bg-amber-50/60 text-amber-900',
    description: 'Pembelajar tingkat lanjut dengan penguasaan Kanji menengah, listening & Keigo.',
  },
  {
    id: 'roppongi',
    name: 'Liga Berlian',
    tier: 'Diamond Master',
    xpRange: '1.500+ XP',
    levelLabel: 'Master',
    iconColor: 'text-[#06B6D4]',
    badgeColor: 'border-cyan-500 bg-cyan-50/70 text-cyan-950',
    description: 'Puncak liga global: siap sertifikasi JLPT/Goethe/IELTS dan komunikasi profesional.',
  },
]
