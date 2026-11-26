import type { LeagueDivision } from "@/features/leaderboard/types/leaderboard"

export interface DivisionConfig {
  id: LeagueDivision
  name: string
  tier: string
  xpRange: string
  minXP: number
  maxXP: number | null
  nextDivisionName: string | null
  levelLabel: string
  iconColor: string
  badgeColor: string
  heroGradient: string
  heroBorder: string
  topStrip: string
  accentBadgeClass: string
  activeTabClass: string
  progressFillClass: string
  description: string
}

export const LEAGUE_DIVISIONS: DivisionConfig[] = [
  {
    id: 'bronze',
    name: 'Liga Perunggu',
    tier: 'Divisi Pemula (0 – 299 XP)',
    xpRange: '0 – 299 XP',
    minXP: 0,
    maxXP: 300,
    nextDivisionName: 'Liga Perak',
    levelLabel: 'Pemula',
    iconColor: 'text-[#B45309]',
    badgeColor: 'border-amber-500 bg-amber-50 text-amber-900',
    heroGradient: 'bg-gradient-to-br from-amber-50/85 via-white to-orange-50/55',
    heroBorder: 'border-amber-200/90',
    topStrip: 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500',
    accentBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    activeTabClass: 'bg-amber-50/85 border-amber-500 shadow-[0_3px_0_0_#D97706]',
    progressFillClass: 'bg-gradient-to-r from-amber-600 to-orange-500',
    description: 'Zona kompetisi bagi pembelajar baru yang memulai dasar kosakata & tata bahasa.',
  },
  {
    id: 'silver',
    name: 'Liga Perak',
    tier: 'Divisi Menengah (300 – 799 XP)',
    xpRange: '300 – 799 XP',
    minXP: 300,
    maxXP: 800,
    nextDivisionName: 'Liga Emas',
    levelLabel: 'Menengah',
    iconColor: 'text-[#64748B]',
    badgeColor: 'border-slate-400 bg-slate-50 text-slate-800',
    heroGradient: 'bg-gradient-to-br from-slate-100/90 via-white to-indigo-50/60',
    heroBorder: 'border-indigo-200/90',
    topStrip: 'bg-gradient-to-r from-slate-500 via-indigo-500 to-blue-500',
    accentBadgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    activeTabClass: 'bg-indigo-50/85 border-indigo-600 shadow-[0_3px_0_0_#4F46E5]',
    progressFillClass: 'bg-gradient-to-r from-indigo-600 to-blue-500',
    description: 'Kompetisi aktif bagi pembelajar yang menguasai tata bahasa inti & percakapan harian.',
  },
  {
    id: 'gold',
    name: 'Liga Emas',
    tier: 'Divisi Lanjutan (800 – 1.499 XP)',
    xpRange: '800 – 1.499 XP',
    minXP: 800,
    maxXP: 1500,
    nextDivisionName: 'Liga Berlian',
    levelLabel: 'Lanjutan',
    iconColor: 'text-[#F59E0B]',
    badgeColor: 'border-amber-400 bg-amber-50/60 text-amber-900',
    heroGradient: 'bg-gradient-to-br from-yellow-50/90 via-white to-amber-50/65',
    heroBorder: 'border-amber-300/90',
    topStrip: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400',
    accentBadgeClass: 'bg-yellow-100 text-amber-950 border-amber-300',
    activeTabClass: 'bg-amber-50/90 border-amber-500 shadow-[0_3px_0_0_#F59E0B]',
    progressFillClass: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    description: 'Pembelajar tingkat lanjut dengan penguasaan membaca, menyimak & komunikasi formal.',
  },
  {
    id: 'diamond',
    name: 'Liga Berlian',
    tier: 'Divisi Master (1.500+ XP)',
    xpRange: '1.500+ XP',
    minXP: 1500,
    maxXP: null,
    nextDivisionName: null,
    levelLabel: 'Master',
    iconColor: 'text-[#06B6D4]',
    badgeColor: 'border-cyan-500 bg-cyan-50/70 text-cyan-950',
    heroGradient: 'bg-gradient-to-br from-cyan-50/90 via-white to-violet-50/65',
    heroBorder: 'border-cyan-300/90',
    topStrip: 'bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500',
    accentBadgeClass: 'bg-cyan-100 text-cyan-950 border-cyan-300',
    activeTabClass: 'bg-cyan-50/90 border-cyan-500 shadow-[0_3px_0_0_#06B6D4]',
    progressFillClass: 'bg-gradient-to-r from-cyan-500 to-violet-500',
    description: 'Puncak liga global: siap sertifikasi JLPT / IELTS / Goethe / HSK / DELF dan karier internasional.',
  },
]

export const resolveDivisionByTotalXP = (totalXP: number): LeagueDivision => {
  if (totalXP >= 1500) return 'diamond'
  if (totalXP >= 800) return 'gold'
  if (totalXP >= 300) return 'silver'
  return 'bronze'
}

export interface NextDivisionProgress {
  currentDivision: DivisionConfig
  nextDivisionName: string | null
  currentXP: number
  targetXP: number | null
  remainingXP: number
  progressPercent: number
  isMaxDivision: boolean
}

export const getNextDivisionProgress = (totalXP: number): NextDivisionProgress => {
  const safeXP = Math.max(0, Math.floor(totalXP))
  const currentId = resolveDivisionByTotalXP(safeXP)
  const currentDivision =
    LEAGUE_DIVISIONS.find((d) => d.id === currentId) ?? LEAGUE_DIVISIONS[0]

  if (currentDivision.maxXP === null) {
    return {
      currentDivision,
      nextDivisionName: null,
      currentXP: safeXP,
      targetXP: null,
      remainingXP: 0,
      progressPercent: 100,
      isMaxDivision: true,
    }
  }

  const targetXP = currentDivision.maxXP
  const remainingXP = Math.max(0, targetXP - safeXP)
  const progressPercent = Math.max(4, Math.min(100, Math.round((safeXP / targetXP) * 100)))

  return {
    currentDivision,
    nextDivisionName: currentDivision.nextDivisionName,
    currentXP: safeXP,
    targetXP,
    remainingXP,
    progressPercent,
    isMaxDivision: false,
  }
}

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
