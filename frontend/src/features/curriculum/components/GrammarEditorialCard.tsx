import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Quotes } from '@phosphor-icons/react'
import type { GrammarPoint } from '@/features/curriculum/types/curriculum'
import {
  DEFAULT_LEVEL_ACCENT,
  LEVEL_ACCENT_STYLES,
  formatCategoryLabel,
  renderCategoryIcon,
} from '@/features/curriculum/constants/grammarStyles'
import { KodiCharacter, type KodiEmotion } from '@/shared/components/ui/KodiCharacter'
import { triggerHaptic } from '@/shared/utils/haptics'

interface EditorialCoverTheme {
  backdrop: string
  pillClass: string
  accentText: string
  orbBg: string
  tagline: string
  kodiEmotion: KodiEmotion
}

const CATEGORY_COVER_THEMES: Record<string, EditorialCoverTheme> = {
  particle: {
    backdrop: 'bg-gradient-to-br from-[#FEF9E7] via-[#FFFDF4] to-[#FDE68A]/55',
    pillClass: 'bg-slate-900 text-amber-300',
    accentText: 'text-amber-700',
    orbBg: 'bg-amber-300/30',
    tagline: 'Hubung. Fokus. Jelas.',
    kodiEmotion: 'studying',
  },
  sentence_pattern: {
    backdrop: 'bg-gradient-to-br from-[#EFF6FF] via-[#F8FBFF] to-[#BFDBFE]/55',
    pillClass: 'bg-slate-900 text-sky-300',
    accentText: 'text-blue-700',
    orbBg: 'bg-sky-300/30',
    tagline: 'Pola. Struktur. Lancar.',
    kodiEmotion: 'welcome',
  },
  conjugation: {
    backdrop: 'bg-gradient-to-br from-[#ECFDF5] via-[#F6FEFA] to-[#A7F3D0]/55',
    pillClass: 'bg-slate-900 text-emerald-300',
    accentText: 'text-emerald-700',
    orbBg: 'bg-emerald-300/30',
    tagline: 'Ubah. Bentuk. Tepat.',
    kodiEmotion: 'thinking',
  },
  tense: {
    backdrop: 'bg-gradient-to-br from-[#FFF1F2] via-[#FFF9FA] to-[#FECDD3]/60',
    pillClass: 'bg-slate-900 text-rose-300',
    accentText: 'text-rose-700',
    orbBg: 'bg-rose-300/30',
    tagline: 'Waktu. Masa. Konteks.',
    kodiEmotion: 'celebrate',
  },
  honorific: {
    backdrop: 'bg-gradient-to-br from-[#F5F3FF] via-[#FAF8FF] to-[#DDD6FE]/65',
    pillClass: 'bg-slate-900 text-violet-300',
    accentText: 'text-violet-700',
    orbBg: 'bg-violet-300/30',
    tagline: 'Sopan. Bisnis. Hormat.',
    kodiEmotion: 'onFire',
  },
}

const DEFAULT_COVER_THEME: EditorialCoverTheme = CATEGORY_COVER_THEMES.sentence_pattern

function splitEditorialTitle(title: string, category: string): {
  primary: string
  accentSub: string
} {
  const match = title.match(/^([^(]+)\(([^)]+)\)\s*$/)
  if (match) {
    return {
      primary: match[1].trim(),
      accentSub: match[2].trim(),
    }
  }
  return {
    primary: title,
    accentSub: formatCategoryLabel(category),
  }
}

export interface GrammarEditorialCardProps {
  point: GrammarPoint
  index: number
}

/**
 * LingoDeer-inspired full-width horizontal editorial card for /grammar:
 * - Left graphic poster panel: dark brand pill, stacked poster typography, tagline, and Kodi mascot.
 * - Right content panel: level/category badges, full single-line formula + Romaji strip, explanation, and CTA.
 */
export const GrammarEditorialCard: FC<GrammarEditorialCardProps> = ({ point, index }) => {
  const levelCode = (point.level_code ?? 'N5').toUpperCase()
  const accent = LEVEL_ACCENT_STYLES[levelCode] ?? DEFAULT_LEVEL_ACCENT
  const cover = CATEGORY_COVER_THEMES[point.category] ?? DEFAULT_COVER_THEME
  const exampleCount = point.examples?.length ?? 0
  const { primary, accentSub } = splitEditorialTitle(point.title, point.category)

  return (
    <Link
      to={`/grammar/${encodeURIComponent(point.code || point.id)}`}
      onClick={() => triggerHaptic('tap')}
      aria-label={`Pelajari materi: ${point.title}`}
      className={`group bg-white border-2 border-slate-200/90 ${accent.hoverBorder} rounded-3xl overflow-hidden shadow-[0_4px_0_0_#E2E8F0] hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_#CBD5E1] active:translate-y-0.5 active:shadow-[0_2px_0_0_#E2E8F0] transition-all flex flex-col md:flex-row focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200`}
    >
      {/* ── LEFT GRAPHIC EDITORIAL COVER PANEL ── */}
      <div
        className={`relative md:w-[320px] lg:w-[360px] shrink-0 p-5 sm:p-6 ${cover.backdrop} border-b md:border-b-0 md:border-r border-slate-200/70 flex items-center justify-between gap-3 overflow-hidden`}
      >
        {/* Soft background motif */}
        <div
          aria-hidden="true"
          className={`absolute -right-8 -bottom-10 w-36 h-36 rounded-full blur-2xl ${cover.orbBg} pointer-events-none`}
        />
        <div
          aria-hidden="true"
          className="absolute right-12 top-3 w-10 h-10 rounded-full bg-white/50 pointer-events-none"
        />

        {/* Editorial typography stack */}
        <div className="relative z-10 min-w-0 space-y-2 flex-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-brand font-black uppercase tracking-wider shadow-2xs ${cover.pillClass}`}
          >
            CODEABROAD • {levelCode}
          </span>

          <div className="space-y-0.5">
            <p className="font-brand font-black text-base sm:text-lg text-slate-900 leading-[1.15] line-clamp-2">
              {primary}
            </p>
            <p className={`font-brand font-extrabold text-xs leading-snug line-clamp-1 ${cover.accentText}`}>
              {accentSub}
            </p>
          </div>

          <p className="text-[10px] font-bold tracking-wide text-slate-600 pt-0.5">
            {cover.tagline}
          </p>
        </div>

        {/* Expressive Kodi companion inside poster illustration */}
        <div className="relative z-10 shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2">
          <KodiCharacter emotion={cover.kodiEmotion} size={86} interactive={false} />
        </div>
      </div>

      {/* ── RIGHT CONTENT PANEL ── */}
      <div className="flex-1 min-w-0 p-5 sm:p-6 flex flex-col justify-between gap-3.5 bg-white">
        <div className="space-y-3">
          {/* Badges + Order */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center flex-wrap gap-1.5">
              <span
                className={`text-[10px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${accent.badge}`}
              >
                {levelCode}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                {renderCategoryIcon(point.category, 'w-3 h-3')}
                <span>{formatCategoryLabel(point.category)}</span>
              </span>
            </div>
            <span className="text-[11px] font-mono font-black text-slate-400">
              #{String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Full title */}
          <h2 className="font-brand font-black text-base sm:text-lg text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
            {point.title}
          </h2>

          {/* Wide formula & Romaji strip */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/45 to-white border border-blue-200/80 border-l-4 border-l-blue-500 px-4 py-2.5 space-y-0.5">
            <code className="block font-mono text-xs sm:text-sm font-extrabold text-blue-950 break-words">
              {point.formula}
            </code>
            {point.formula_reading && (
              <p className="text-[11px] sm:text-xs font-bold text-blue-600 break-words">
                {point.formula_reading}
              </p>
            )}
          </div>

          {/* Indonesian explanation */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
            {point.explanation}
          </p>
        </div>

        {/* Footer metadata + CTA */}
        <div className="pt-2.5 flex items-center justify-between gap-2 border-t border-slate-100">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-brand font-bold text-slate-500">
            <Quotes weight="fill" className="w-3.5 h-3.5 text-blue-400" />
            <span>{exampleCount} contoh kalimat • Audio 0.6x</span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-brand font-black text-blue-600 group-hover:gap-1.5 transition-all">
            Pelajari Materi
            <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
