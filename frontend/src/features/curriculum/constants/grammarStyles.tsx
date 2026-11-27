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
import type { GrammarPoint } from '@/features/curriculum/types/curriculum'

export const CATEGORY_LABELS: Record<string, string> = {
  sentence_pattern: 'Pola Kalimat',
  conjugation: 'Bentuk Kata',
  particle: 'Partikel',
  tense: 'Waktu',
  honorific: 'Keigo & Sopan',
}

export const ENGLISH_CATEGORY_LABELS: Record<string, string> = {
  sentence_pattern: 'Pola Kalimat',
  conjugation: 'Bentuk Kata Kerja',
  particle: 'Preposisi & Penghubung',
  tense: 'Waktu (Tense)',
  honorific: 'Sopan & Formal',
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
  A1: {
    topStrip: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    hoverBorder: 'hover:border-emerald-300/90',
    border: 'border-emerald-200',
    bgSoft: 'bg-emerald-50/40',
  },
  A2: {
    topStrip: 'bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-500',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    hoverBorder: 'hover:border-sky-300/90',
    border: 'border-sky-200',
    bgSoft: 'bg-sky-50/40',
  },
  B1: {
    topStrip: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    hoverBorder: 'hover:border-blue-300/90',
    border: 'border-blue-200',
    bgSoft: 'bg-blue-50/40',
  },
  B2: {
    topStrip: 'bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    hoverBorder: 'hover:border-violet-300/90',
    border: 'border-violet-200',
    bgSoft: 'bg-violet-50/40',
  },
  C1: {
    topStrip: 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    hoverBorder: 'hover:border-amber-300/90',
    border: 'border-amber-200',
    bgSoft: 'bg-amber-50/40',
  },
  C2: {
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

export interface GrammarRoleStyle {
  block: string
  label: string
  dot: string
}

const GRAMMAR_ROLE_STYLE_MAP: Record<string, GrammarRoleStyle> = {
  topic: {
    block: 'bg-blue-50 border-blue-200 text-blue-950',
    label: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  subject: {
    block: 'bg-blue-50 border-blue-200 text-blue-950',
    label: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  particle: {
    block: 'bg-amber-50 border-amber-300 text-amber-950',
    label: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  connector: {
    block: 'bg-amber-50 border-amber-300 text-amber-950',
    label: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  predicate: {
    block: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    label: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  verb: {
    block: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    label: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  object: {
    block: 'bg-violet-50 border-violet-200 text-violet-950',
    label: 'text-violet-700',
    dot: 'bg-violet-500',
  },
  noun: {
    block: 'bg-violet-50 border-violet-200 text-violet-950',
    label: 'text-violet-700',
    dot: 'bg-violet-500',
  },
  adjective: {
    block: 'bg-rose-50 border-rose-200 text-rose-950',
    label: 'text-rose-700',
    dot: 'bg-rose-500',
  },
  time: {
    block: 'bg-sky-50 border-sky-200 text-sky-950',
    label: 'text-sky-700',
    dot: 'bg-sky-500',
  },
  place: {
    block: 'bg-sky-50 border-sky-200 text-sky-950',
    label: 'text-sky-700',
    dot: 'bg-sky-500',
  },
  ending: {
    block: 'bg-indigo-50 border-indigo-200 text-indigo-950',
    label: 'text-indigo-700',
    dot: 'bg-indigo-500',
  },
}

const DEFAULT_GRAMMAR_ROLE_STYLE: GrammarRoleStyle = {
  block: 'bg-slate-50 border-slate-200 text-slate-900',
  label: 'text-slate-600',
  dot: 'bg-slate-400',
}

export function getGrammarRoleStyle(role?: string): GrammarRoleStyle {
  const key = (role ?? '').trim().toLowerCase()
  return GRAMMAR_ROLE_STYLE_MAP[key] ?? DEFAULT_GRAMMAR_ROLE_STYLE
}

export function formatCategoryLabel(category?: string, languageCode?: string): string {
  const normalizedCategory = category?.trim() ?? ''
  if (!normalizedCategory) return ''
  const isEnglish = languageCode?.trim().toLowerCase().startsWith('en') ?? false
  const labels = isEnglish ? ENGLISH_CATEGORY_LABELS : CATEGORY_LABELS
  return labels[normalizedCategory] ?? normalizedCategory.replace(/_/g, ' ')
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

/** Returns true when a mastered grammar point has reached or passed its scheduled review time. */
export function isGrammarPointDueForReview(
  point: Pick<GrammarPoint, 'is_understood' | 'next_review_at'>
): boolean {
  if (!point.is_understood || !point.next_review_at) return false
  const dueAt = Date.parse(point.next_review_at)
  if (Number.isNaN(dueAt)) return false
  return dueAt <= Date.now()
}
