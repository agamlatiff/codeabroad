import { useEffect, type FC } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  ListBullets,
  X,
} from '@phosphor-icons/react'
import type { GrammarPoint } from '@/features/curriculum/types/curriculum'
import { humanizeFormulaSlotText } from '@/features/curriculum/constants/grammarSlotPresets'
import { triggerHaptic } from '@/shared/utils/haptics'

export interface GrammarOutlineDrawerProps {
  isOpen: boolean
  onClose: () => void
  levelCode: string
  siblingPoints: GrammarPoint[]
  currentPointId: string
  understoodInLevel: number
  levelProgressPct: number
  onSelectPoint: (point: GrammarPoint) => void
}

/**
 * Accessible slide-over drawer displaying all grammar points in the active JLPT level
 * along with mastery progress, replacing the cramped right-hand sidebar.
 */
export const GrammarOutlineDrawer: FC<GrammarOutlineDrawerProps> = ({
  isOpen,
  onClose,
  levelCode,
  siblingPoints,
  currentPointId,
  understoodInLevel,
  levelProgressPct,
  onSelectPoint,
}) => {
  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grammar-outline-drawer-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Tutup daftar materi"
        onClick={() => {
          triggerHaptic('tap')
          onClose()
        }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity cursor-pointer"
      />

      {/* Slide-over panel */}
      <div className="relative z-10 w-full max-w-sm bg-white h-full border-l-2 border-slate-200 shadow-2xl flex flex-col">
        {/* Drawer header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 space-y-3 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <h2
              id="grammar-outline-drawer-title"
              className="inline-flex items-center gap-2 font-brand font-black text-sm text-slate-900"
            >
              <ListBullets weight="bold" className="w-4 h-4 text-blue-600" />
              <span>Daftar Materi JLPT {levelCode}</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                onClose()
              }}
              aria-label="Tutup daftar materi"
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X weight="bold" className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-brand font-bold">
              <span className="text-slate-500">Progres Level</span>
              <span className="text-emerald-700">
                {understoodInLevel}/{siblingPoints.length} Paham
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable topic list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {siblingPoints.map((item, idx) => {
            const isActive = item.id === currentPointId
            const friendlyFormula = humanizeFormulaSlotText(item.formula)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectPoint(item)
                  onClose()
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
                  isActive
                    ? 'bg-blue-50/90 border-l-4 border-l-blue-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                <span
                  className={`mt-0.5 w-6 h-6 rounded-lg text-[11px] font-mono font-black flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : item.is_understood
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`font-brand font-black text-xs leading-snug line-clamp-1 ${
                        isActive ? 'text-blue-900' : 'text-slate-800'
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.is_understood && (
                      <CheckCircle
                        weight="fill"
                        className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                        aria-label="Sudah paham"
                      />
                    )}
                  </div>
                  <p className="font-mono text-[11px] font-semibold text-slate-500 truncate">
                    {friendlyFormula}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Drawer footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/70 shrink-0">
          <Link
            to={`/grammar?level=${encodeURIComponent(levelCode)}`}
            onClick={() => {
              triggerHaptic('tap')
              onClose()
            }}
            className="inline-flex items-center gap-1.5 text-xs font-brand font-black text-blue-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
          >
            <span>Lihat Semua Materi</span>
            <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
