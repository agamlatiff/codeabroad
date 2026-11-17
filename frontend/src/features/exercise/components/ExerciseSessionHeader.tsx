import type { ReactNode } from 'react'
import { X } from '@phosphor-icons/react'

interface ExerciseSessionHeaderProps {
  onExit: () => void
  exitAriaLabel: string
  progressPercent: number
  progressFillClass: string
  counterLabel: string
  rightSlot?: ReactNode
}

/**
 * Shared sticky top bar for full-screen Learn, SRS Review, and Readiness Exam players.
 */
export const ExerciseSessionHeader = ({
  onExit,
  exitAriaLabel,
  progressPercent,
  progressFillClass,
  counterLabel,
  rightSlot,
}: ExerciseSessionHeaderProps) => (
  <header className="shrink-0 bg-white border-b-2 border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
    <button
      type="button"
      onClick={onExit}
      aria-label={exitAriaLabel}
      className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
    >
      <X weight="bold" className="w-6 h-6" />
    </button>

    <div className="flex-1 max-w-2xl flex items-center gap-3">
      <div className="flex-1 h-4 rounded-full bg-slate-200 overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${progressFillClass}`}
          style={{ width: `${Math.max(6, progressPercent)}%` }}
        />
      </div>
      <span className="text-xs font-extrabold text-slate-500 tabular-nums shrink-0">
        {counterLabel}
      </span>
    </div>

    {rightSlot}
  </header>
)
