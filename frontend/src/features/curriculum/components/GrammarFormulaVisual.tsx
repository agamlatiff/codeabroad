import type { FC } from 'react'
import { Check, Copy, Plus, Sparkle } from '@phosphor-icons/react'
import type { GrammarFormulaPart } from '@/features/curriculum/types/curriculum'
import { getGrammarRoleStyle } from '@/features/curriculum/constants/grammarStyles'
import { humanizeFormulaSlotText } from '@/features/curriculum/constants/grammarSlotPresets'

export interface GrammarFormulaVisualProps {
  formula: string
  formulaReading?: string
  formulaParts?: GrammarFormulaPart[]
  showRomaji: boolean
  isCopied: boolean
  onCopy: () => void
}

/**
 * Renders a color-coded visual formula block diagram so beginners can immediately see
 * how each Japanese slot (Topik / Partikel / Predikat) snaps together.
 */
export const GrammarFormulaVisual: FC<GrammarFormulaVisualProps> = ({
  formula,
  formulaReading,
  formulaParts,
  showRomaji,
  isCopied,
  onCopy,
}) => {
  const hasParts = Array.isArray(formulaParts) && formulaParts.length > 0

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-white border-2 border-slate-200/90 p-4 sm:p-5 space-y-3.5 shadow-2xs">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] font-brand font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
          <Sparkle weight="fill" className="w-3.5 h-3.5" />
          Pola Susunan Kalimat
        </span>
        <button
          type="button"
          onClick={onCopy}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-brand font-black transition-all cursor-pointer active:translate-y-0.5 shadow-2xs ${
            isCopied
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700'
          }`}
        >
          {isCopied ? (
            <>
              <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600" />
              <span>Disalin</span>
            </>
          ) : (
            <>
              <Copy weight="bold" className="w-3.5 h-3.5" />
              <span>Salin Pola</span>
            </>
          )}
        </button>
      </div>

      {hasParts ? (
        <div className="flex flex-wrap items-center gap-2">
          {formulaParts.map((part, idx) => {
            const style = getGrammarRoleStyle(part.role)
            return (
              <div key={`${part.text}-${idx}`} className="flex items-center gap-2">
                <div
                  className={`rounded-xl border-2 px-3.5 py-2 shadow-2xs ${style.block}`}
                >
                  <div className="font-mono text-sm sm:text-base font-black leading-snug">
                    {humanizeFormulaSlotText(part.text)}
                  </div>
                  <div className={`text-[11px] font-brand font-bold leading-tight mt-0.5 ${style.label}`}>
                    {humanizeFormulaSlotText(part.label)}
                  </div>
                </div>
                {idx < formulaParts.length - 1 && (
                  <Plus weight="bold" className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <code className="block font-mono text-base sm:text-lg font-black text-blue-950 break-words leading-relaxed">
          {formula}
        </code>
      )}

      {showRomaji && formulaReading && (
        <div className="pt-2 border-t border-slate-200/70 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-brand font-bold text-slate-500">Cara baca:</span>
          <p className="text-xs sm:text-sm font-bold text-blue-700 break-words">
            {humanizeFormulaSlotText(formulaReading)}
          </p>
        </div>
      )}
    </div>
  )
}
