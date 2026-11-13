import type { GrammarPoint } from '@/features/curriculum/types/curriculum'
import { BookOpen, X } from '@phosphor-icons/react'

interface LessonGrammarDrawerProps {
  isOpen: boolean
  grammarPoints: GrammarPoint[]
  onClose: () => void
}

/**
 * Quick grammar reference drawer displaying formulas tied to the active lesson.
 */
export const LessonGrammarDrawer = ({
  isOpen,
  grammarPoints,
  onClose,
}: LessonGrammarDrawerProps) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Referensi Tata Bahasa Pelajaran"
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l-2 border-slate-200 flex flex-col">
        <header className="px-5 py-4 border-b-2 border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <BookOpen weight="bold" className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-brand font-extrabold text-slate-900">
                Catatan Tata Bahasa
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pola kalimat & partikel untuk pelajaran ini
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup catatan tata bahasa"
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {grammarPoints.length === 0 ? (
            <p className="text-sm text-slate-500 font-medium">
              Tidak ada catatan tata bahasa tambahan untuk pelajaran ini.
            </p>
          ) : (
            grammarPoints.map((gp) => (
              <article
                key={gp.id}
                className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-[11px] font-mono font-bold">
                    {gp.code}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {gp.category}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">{gp.title}</h3>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-blue-700">
                  {gp.formula}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {gp.explanation}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

