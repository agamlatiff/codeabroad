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
import { triggerHaptic } from '@/shared/utils/haptics'

const CATEGORY_SPINE_BARS: Record<string, string> = {
  particle: 'bg-gradient-to-b from-amber-400 to-orange-500',
  sentence_pattern: 'bg-gradient-to-b from-sky-400 to-blue-600',
  conjugation: 'bg-gradient-to-b from-emerald-400 to-teal-600',
  tense: 'bg-gradient-to-b from-rose-400 to-pink-600',
  honorific: 'bg-gradient-to-b from-violet-500 to-purple-600',
}

const DEFAULT_SPINE_BAR = CATEGORY_SPINE_BARS.sentence_pattern

export interface GrammarEditorialCardProps {
  point: GrammarPoint
  index: number
}

/**
 * Clean single-body stationery editorial card for /grammar:
 * - Tactile left book-spine accent bar by grammar category.
 * - Scannable header badges, full title, formula/reading strip, explanation preview, and CTA.
 */
export const GrammarEditorialCard: FC<GrammarEditorialCardProps> = ({ point, index }) => {
  const levelCode = (point.level_code ?? 'N5').toUpperCase()
  const accent = LEVEL_ACCENT_STYLES[levelCode] ?? DEFAULT_LEVEL_ACCENT
  const spineBar = CATEGORY_SPINE_BARS[point.category] ?? DEFAULT_SPINE_BAR
  const exampleCount = point.learning_guide?.breakdowns?.length ?? point.examples?.length ?? 0
  const hasGuide = Boolean(point.learning_guide?.breakdowns?.length)
  const previewText = point.learning_guide?.analogy || point.explanation
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
      <div aria-hidden="true" className={`h-1.5 w-full md:h-auto md:w-2 shrink-0 ${spineBar}`} />

      {/* ── SINGLE-BODY STATIONERY CONTENT PANEL ── */}
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
                    <span>Paham ✓</span>
                  </span>
                )
              )}
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

          {/* Indonesian beginner-friendly analogy or explanation */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
            {previewText}
          </p>
        </div>

        {/* Footer metadata + CTA */}
        <div className="pt-2.5 flex items-center justify-between gap-2 border-t border-slate-100">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-brand font-bold text-slate-500">
            <Quotes weight="fill" className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {hasGuide
                ? `${exampleCount} contoh pecah kata • Kuis 3 soal • Audio 0.6x`
                : `${exampleCount} contoh kalimat • Audio 0.6x`}
            </span>
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs sm:text-[13px] font-brand font-black group-hover:gap-1.5 transition-all ${
              isDueForReview ? 'text-amber-700' : 'text-blue-600'
            }`}
          >
            {isDueForReview ? 'Ulas Sekarang' : 'Pelajari Materi'}
            <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
