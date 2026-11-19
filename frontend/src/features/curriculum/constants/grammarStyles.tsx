import type { ReactNode } from 'react'
import {
  BookOpen,
  SquaresFour,
  TextAa,
  ArrowsLeftRight,
  LinkSimple,
  ClockCounterClockwise,
  CrownSimple,
} from '@phosphor-icons/react'

export const CATEGORY_LABELS: Record<string, string> = {
  sentence_pattern: 'Pola Kalimat',
  conjugation: 'Konjugasi',
  particle: 'Partikel',
  tense: 'Tense',
  honorific: 'Keigo & Sopan',
}

export interface LevelAccentTheme {
  topStrip: string
  badge: string
  hoverBorder: string
  border: string
  bgSoft: string
}

export const LEVEL_ACCENT_STYLES: Record<string, LevelAccentTheme> = {
  N5: {
    topStrip: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    hoverBorder: 'hover:border-emerald-300/90',
    border: 'border-emerald-200',
    bgSoft: 'bg-emerald-50/40',
  },
  N4: {
    topStrip: 'bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-500',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    hoverBorder: 'hover:border-sky-300/90',
    border: 'border-sky-200',
    bgSoft: 'bg-sky-50/40',
  },
  N3: {
    topStrip: 'bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-500',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    hoverBorder: 'hover:border-violet-300/90',
    border: 'border-violet-200',
    bgSoft: 'bg-violet-50/40',
  },
  N2: {
    topStrip: 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    hoverBorder: 'hover:border-amber-300/90',
    border: 'border-amber-200',
    bgSoft: 'bg-amber-50/40',
  },
  N1: {
    topStrip: 'bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    hoverBorder: 'hover:border-rose-300/90',
    border: 'border-rose-200',
    bgSoft: 'bg-rose-50/40',
  },
}

export const DEFAULT_LEVEL_ACCENT: LevelAccentTheme = {
  topStrip: 'bg-gradient-to-r from-slate-400 to-slate-500',
  badge: 'bg-slate-100 text-slate-700 border-slate-200',
  hoverBorder: 'hover:border-blue-300/90',
  border: 'border-slate-200',
  bgSoft: 'bg-slate-50/40',
}

export function formatCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category.replace(/_/g, ' ')
}

export function renderCategoryIcon(category: string, className = 'w-3.5 h-3.5'): ReactNode {
  switch (category) {
    case 'ALL':
      return <SquaresFour weight="bold" className={className} />
    case 'sentence_pattern':
      return <TextAa weight="bold" className={className} />
    case 'conjugation':
      return <ArrowsLeftRight weight="bold" className={className} />
    case 'particle':
      return <LinkSimple weight="bold" className={className} />
    case 'tense':
      return <ClockCounterClockwise weight="bold" className={className} />
    case 'honorific':
      return <CrownSimple weight="fill" className={className} />
    default:
      return <BookOpen weight="bold" className={className} />
  }
}
