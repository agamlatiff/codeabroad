import { useEffect, type FC } from 'react'
import { createPortal } from 'react-dom'
import { BookOpenText, X, ArrowClockwise } from '@phosphor-icons/react'
import { Button3D } from "@/shared/components/ui/Button3D"
import type { GrammarPoint } from "@/features/curriculum/types/curriculum"

export interface GrammarPointsModalProps {
  isOpen: boolean
  onClose: () => void
  levelName?: string
  levelCode?: string
  grammarPoints: GrammarPoint[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  tense: 'Tense',
  conjugation: 'Konjugasi',
  particle: 'Partikel',
  honorific: 'Honorifik / Keigo',
  sentence_pattern: 'Pola Kalimat',
}

/**
 * Modal displaying level-scoped grammar points fetched from GET /api/v1/curriculum/grammar-points.
 */
export const GrammarPointsModal: FC<GrammarPointsModalProps> = ({
  isOpen,
  onClose,
  levelName,
  levelCode,
  grammarPoints,
  isLoading,
  error,
  onRetry,
}) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/55 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-200/90 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-pop">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpenText weight="fill" className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-brand font-black text-base text-slate-900 truncate">
                Panduan Grammar {levelCode ? `• ${levelCode}` : ''}
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate">
                {levelName || 'Ringkasan rumus tata bahasa dan pola kalimat pada level aktif'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Tutup panduan grammar"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar space-y-3 flex-1">
          {isLoading ? (
            <div className="py-10 text-center text-xs font-semibold text-slate-500 animate-pulse">
              Memuat poin grammar untuk level ini...
            </div>
          ) : error ? (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-rose-800">{error}</span>
              <Button3D
                variant="rose"
                size="sm"
                icon={<ArrowClockwise weight="bold" className="w-3.5 h-3.5" />}
                onClick={onRetry}
              >
                Coba Lagi
              </Button3D>
            </div>
          ) : grammarPoints.length === 0 ? (
            <div className="py-10 text-center text-xs font-semibold text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
              Belum ada catatan grammar yang terdaftar untuk level ini.
            </div>
          ) : (
            grammarPoints.map((point) => (
              <div
                key={point.id}
                className="p-4 rounded-2xl border-2 border-slate-200/90 bg-white space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {point.code}
                    </span>
                    <span className="text-[10px] font-brand font-black uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {CATEGORY_LABELS[point.category] || point.category}
                    </span>
                  </div>
                </div>

                <h4 className="font-brand font-black text-sm text-slate-900">
                  {point.title}
                </h4>

                <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-blue-900">
                  {point.formula}
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {point.explanation}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end shrink-0">
          <Button3D variant="white" size="sm" onClick={onClose}>
            Tutup
          </Button3D>
        </div>
      </div>
    </div>,
    document.body
  )
}

