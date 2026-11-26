import type { ReactNode } from 'react'
import { X } from '@phosphor-icons/react'

export interface TimelineStepSegment {
  kind: 'study' | 'exercise'
  state: 'done' | 'current' | 'upcoming'
}

interface ExerciseSessionHeaderProps {
  onExit: () => void
  exitAriaLabel: string
  exitDisabled?: boolean
  progressPercent: number
  progressFillClass: string
  counterLabel: string
  timelineSteps?: TimelineStepSegment[]
  rightSlot?: ReactNode
}

/**
 * Shared sticky top bar for full-screen Learn, SRS Review, and Readiness Exam players,
 * optionally rendering an interleaved Study/Exercise mini-stepper row underneath.
 */
export const ExerciseSessionHeader = ({
  onExit,
  exitAriaLabel,
  exitDisabled = false,
  progressPercent,
  progressFillClass,
  counterLabel,
  timelineSteps,
  rightSlot,
}: ExerciseSessionHeaderProps) => (
  <div className="shrink-0 bg-white border-b-2 border-slate-200">
    <header className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      <button
        type="button"
        disabled={exitDisabled}
        onClick={onExit}
        aria-label={exitAriaLabel}
        className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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

    {timelineSteps && timelineSteps.length > 0 && (
      <div
        aria-label="Alur materi dan soal"
        className="px-4 sm:px-6 pb-2.5 flex items-center justify-center gap-1 overflow-x-auto"
      >
        {timelineSteps.map((step, idx) => {
          const isStudy = step.kind === 'study'
          let cls = 'bg-slate-200/80'
          if (step.state === 'done') {
            cls = isStudy ? 'bg-blue-400' : 'bg-emerald-500'
          } else if (step.state === 'current') {
            cls = isStudy
              ? 'bg-blue-600 ring-2 ring-blue-200 scale-y-125'
              : 'bg-emerald-500 ring-2 ring-emerald-200 scale-y-125'
          }
          return (
            <span
              key={`${step.kind}-${idx}`}
              title={isStudy ? 'Tahap Materi' : 'Soal Latihan'}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                isStudy ? 'w-5 sm:w-6' : 'w-3 sm:w-4'
              } ${cls}`}
            />
          )
        })}
      </div>
    )}
  </div>
)
