import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowsClockwise, CheckCircle, Quotes } from '@phosphor-icons/react'
import type { GrammarPoint } from '@/features/curriculum/types/curriculum'
import {
  DEFAULT_LEVEL_ACCENT,
  LEVEL_ACCENT_STYLES,
  formatCategoryLabel,
  isGrammarPointDueForReview,
  renderCategoryIcon,
} from '@/features/curriculum/constants/grammarStyles'
import { KodiCharacter, type KodiEmotion } from '@/shared/components/ui/KodiCharacter'
import { GrammarCoverDecor } from '@/features/curriculum/components/GrammarCoverDecor'
import { triggerHaptic } from '@/shared/utils/haptics'

interface EditorialCoverTheme {
  backdrop: string
  spineBar: string
  dotHex: string
  pillClass: string
  accentText: string
  orbBg: string
  tagline: string
  emotions: KodiEmotion[]
}

const CATEGORY_COVER_THEMES: Record<string, EditorialCoverTheme> = {
  particle: {
    backdrop: 'bg-gradient-to-br from-[#FEF9E7] via-[#FFFDF4] to-[#FDE68A]/55',
    spineBar: 'bg-gradient-to-b from-amber-400 to-orange-500',
    dotHex: 'rgba(217, 119, 6, 0.14)',
    pillClass: 'bg-slate-900 text-amber-300',
    accentText: 'text-amber-700',
    orbBg: 'bg-amber-300/30',
    tagline: 'Hubung. Fokus. Jelas.',
    emotions: ['studying', 'writing', 'curious', 'explaining'],
  },
  sentence_pattern: {
    backdrop: 'bg-gradient-to-br from-[#EFF6FF] via-[#F8FBFF] to-[#BFDBFE]/55',
    spineBar: 'bg-gradient-to-b from-sky-400 to-blue-600',
    dotHex: 'rgba(37, 99, 235, 0.12)',
    pillClass: 'bg-slate-900 text-sky-300',
    accentText: 'text-blue-700',
    orbBg: 'bg-sky-300/30',
    tagline: 'Pola. Struktur. Lancar.',
    emotions: ['reading', 'chatting', 'welcome', 'idea'],
  },
  conjugation: {
    backdrop: 'bg-gradient-to-br from-[#ECFDF5] via-[#F6FEFA] to-[#A7F3D0]/55',
    spineBar: 'bg-gradient-to-b from-emerald-400 to-teal-600',
    dotHex: 'rgba(5, 150, 105, 0.14)',
    pillClass: 'bg-slate-900 text-emerald-300',
    accentText: 'text-emerald-700',
    orbBg: 'bg-emerald-300/30',
    tagline: 'Ubah. Bentuk. Tepat.',
    emotions: ['idea', 'explaining', 'writing', 'cheering'],
  },
  tense: {
    backdrop: 'bg-gradient-to-br from-[#FFF1F2] via-[#FFF9FA] to-[#FECDD3]/60',
    spineBar: 'bg-gradient-to-b from-rose-400 to-pink-600',
    dotHex: 'rgba(225, 29, 72, 0.12)',
    pillClass: 'bg-slate-900 text-rose-300',
    accentText: 'text-rose-700',
    orbBg: 'bg-rose-300/30',
    tagline: 'Waktu. Masa. Konteks.',
    emotions: ['clock', 'listening', 'curious', 'reading'],
  },
  honorific: {
    backdrop: 'bg-gradient-to-br from-[#F5F3FF] via-[#FAF8FF] to-[#DDD6FE]/65',
    spineBar: 'bg-gradient-to-b from-violet-500 to-purple-600',
    dotHex: 'rgba(124, 58, 237, 0.13)',
    pillClass: 'bg-slate-900 text-violet-300',
    accentText: 'text-violet-700',
    orbBg: 'bg-violet-300/30',
    tagline: 'Sopan. Bisnis. Hormat.',
    emotions: ['polite', 'chatting', 'welcome', 'cheering'],
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
 * Merantalk full-width horizontal editorial card for /grammar:
 * - Left graphic poster panel: dark brand pill, stacked poster typography, tagline, and Kodi mascot.
 * - Right content panel: level/category badges, full single-line formula + Romaji strip, explanation, and CTA.
 */
export const GrammarEditorialCard: FC<GrammarEditorialCardProps> = ({ point, index }) => {
  const levelCode = (point.level_code ?? 'N5').toUpperCase()
  const accent = LEVEL_ACCENT_STYLES[levelCode] ?? DEFAULT_LEVEL_ACCENT
  const cover = CATEGORY_COVER_THEMES[point.category] ?? DEFAULT_COVER_THEME
  const kodiEmotion = cover.emotions[index % cover.emotions.length]
  const exampleCount = point.learning_guide?.breakdowns?.length ?? point.examples?.length ?? 0
  const hasGuide = Boolean(point.learning_guide?.breakdowns?.length)
  const previewText = point.learning_guide?.analogy || point.explanation
  const { primary, accentSub } = splitEditorialTitle(point.title, point.category)
  const isDueForReview = isGrammarPointDueForReview(point)

  return (
    <Link
      to={`/grammar/${encodeURIComponent(point.code || point.id)}${isDueForReview ? '#grammar-mini-quiz' : ''}`}
      onClick={() => triggerHaptic('tap')}
      aria-label={`Pelajari materi: ${point.title}`}
      className={`group bg-white border-2 ${
        isDueForReview ? 'border-amber-300' : 'border-slate-200/90'
      } ${accent.hoverBorder} rounded-3xl overflow-hidden shadow-[0_4px_0_0_#E2E8F0] hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_#CBD5E1] active:translate-y-0.5 active:shadow-[0_2px_0_0_#E2E8F0] transition-all flex flex-col md:flex-row focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200`}
    >
      {/* ── TACTILE BOOK-SPINE CATEGORY ACCENT BAR ── */}
      <div aria-hidden="true" className={`h-1.5 w-full md:h-auto md:w-2 shrink-0 ${cover.spineBar}`} />

      {/* ── LEFT GRAPHIC EDITORIAL COVER PANEL ── */}
      <div
        className={`relative md:w-[316px] lg:w-[356px] shrink-0 p-5 sm:p-6 ${cover.backdrop} border-b md:border-b-0 md:border-r border-slate-200/70 flex items-center justify-between gap-3 overflow-hidden`}
        style={{
          backgroundImage: `radial-gradient(${cover.dotHex} 1px, transparent 1px)`,
          backgroundSize: '12px 12px',
        }}
      >
        <GrammarCoverDecor category={point.category} />

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
            MERANTALK • {levelCode}
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
          <KodiCharacter emotion={kodiEmotion} size={86} interactive={false} />
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
              {isDueForReview ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                  <ArrowsClockwise weight="bold" className="w-3 h-3 text-amber-700" />
                  <span>Perlu Diulas</span>
                </span>
              ) : (
                point.is_understood && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle weight="fill" className="w-3 h-3 text-emerald-600" />
                    <span>Paham</span>
                  </span>
                )
              )}
            </div>
            <span className="text-[11px] font-mono font-black text-slate-500">
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

          {/* Indonesian beginner-friendly analogy or explanation */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
            {previewText}
          </p>
        </div>

        {/* Footer metadata + CTA */}
        <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
          <span className="inline-flex items-center gap-1.5 min-w-0 text-[11px] font-brand font-bold text-slate-500">
            <Quotes weight="fill" className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>
              {hasGuide
                ? `${exampleCount} contoh pecah kata • Kuis 3 soal • Audio 0.6x`
                : `${exampleCount} contoh kalimat • Audio 0.6x`}
            </span>
          </span>
          <span
            className={`inline-flex items-center gap-1 shrink-0 text-xs sm:text-[13px] font-brand font-black group-hover:gap-1.5 transition-all ${
              isDueForReview ? 'text-amber-700' : 'text-blue-600'
            }`}
          >
            {isDueForReview ? 'Ulas Sekarang' : 'Pelajari Materi'}
            <ArrowRight weight="bold" className="w-3.5 h-3.5 shrink-0" />
          </span>
        </div>
      </div>
    </Link>
  )
}
