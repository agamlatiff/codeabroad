import type { LeagueDivision } from "@/features/leaderboard/types/leaderboard"

export interface DivisionConfig {
  id: LeagueDivision
  name: string
  tier: string
  xpRange: string
  levelLabel: string
  iconColor: string
  badgeColor: string
  description: string
}

export const LEAGUE_DIVISIONS: DivisionConfig[] = [
  {
    id: 'bronze',
    name: 'Liga Perunggu',
    tier: 'Bronze League',
    xpRange: '0 – 299 XP',
    levelLabel: 'Pemula',
    iconColor: 'text-[#B45309]',
    badgeColor: 'border-amber-500 bg-amber-50 text-amber-900',
    description: 'Zona kompetisi bagi pembelajar baru yang memulai dasar kosakata & tata bahasa.',
  },
  {
    id: 'silver',
    name: 'Liga Perak',
    tier: 'Silver League',
    xpRange: '300 – 799 XP',
    levelLabel: 'Menengah',
    iconColor: 'text-[#94A3B8]',
    badgeColor: 'border-slate-400 bg-slate-50 text-slate-800',
    description: 'Kompetisi aktif bagi pembelajar yang menguasai tata bahasa inti & percakapan harian.',
  },
  {
    id: 'gold',
    name: 'Liga Emas',
    tier: 'Gold League',
    xpRange: '800 – 1.499 XP',
    levelLabel: 'Lanjutan',
    iconColor: 'text-[#F59E0B]',
    badgeColor: 'border-amber-400 bg-amber-50/60 text-amber-900',
    description: 'Pembelajar tingkat lanjut dengan penguasaan membaca, menyimak & komunikasi formal.',
  },
  {
    id: 'diamond',
    name: 'Liga Berlian',
    tier: 'Diamond Master',
    xpRange: '1.500+ XP',
    levelLabel: 'Master',
    iconColor: 'text-[#06B6D4]',
    badgeColor: 'border-cyan-500 bg-cyan-50/70 text-cyan-950',
    description: 'Puncak liga global: siap sertifikasi JLPT / IELTS / Goethe / HSK / DELF dan karier internasional.',
  },
]

/**
 * Normalizes backend division codes (including legacy Japanese station names)
 * into canonical LeagueDivision keys.
 */
export const normalizeLeagueDivision = (division?: string | null): LeagueDivision => {
  switch (division?.trim().toLowerCase()) {
    case 'silver':
    case 'shibuya':
      return 'silver'
    case 'gold':
    case 'akihabara':
      return 'gold'
    case 'diamond':
    case 'roppongi':
      return 'diamond'
    case 'bronze':
    case 'shinjuku':
    default:
      return 'bronze'
  }
}

export const TOKYO_DIVISIONS = LEAGUE_DIVISIONS
