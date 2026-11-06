import {
  LockSimple,
  Sparkle,
  Lightning,
  Play,
  CheckFat,
  Clock,
} from '@phosphor-icons/react'
import { Button3D } from '../../ui/Button3D'
import type { SequentialPartItem } from '../../../types/roadmap'
import { resolvePartTokens, ACCORDION_ACTION_TOKENS } from '../../../tokens/roadmapTokens'

export interface RoadmapPartItemProps {
  part: SequentialPartItem
  onLockedClick: (title: string) => void
  onStartQuest: (route: string) => void
}

export const RoadmapPartItem = ({
  part,
  onLockedClick,
  onStartQuest,
}: RoadmapPartItemProps) => {
  const isCompleted = part.is_completed
  const isNextActive = part.isNextActive
  const isUnlocked = part.is_unlocked || isCompleted || isNextActive
  const tokens = resolvePartTokens(part)

  return (
    <div
      className={`p-3.5 sm:p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 transition-all duration-200 ${tokens.card}`}
    >
      {/* Left: 3D Tactile Token Cube + Details */}
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform ${tokens.cube}`}
        >
          {isCompleted ? (
            <CheckFat weight="fill" className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-xs" />
          ) : isNextActive ? (
            <span className="font-brand font-black text-sm sm:text-lg text-white">
              {part.globalPartNumber}
            </span>
          ) : (
            <LockSimple weight="bold" className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          )}
        </div>

        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${tokens.chip}`}
            >
              {part.chipLabel}
            </span>

            {isNextActive && (
              <span className="bg-blue-100 text-blue-700 border border-blue-200 font-brand font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                <Sparkle weight="fill" className="w-3 h-3 text-blue-600" />
                <span>MODUL AKTIF</span>
              </span>
            )}
          </div>

          <h4
            className={`text-xs sm:text-base font-brand font-bold tracking-tight leading-snug line-clamp-2 ${tokens.title}`}
          >
            Part {part.globalPartNumber}: {part.title}
          </h4>

          <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed flex items-center gap-1.5 flex-wrap">
            <span>{part.subtitle}</span>
            <span>•</span>
            <span>{part.difficulty}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock weight="bold" className="w-3 h-3 text-slate-400" />
              <span>Estimasi {part.estimatedMinutes} Menit</span>
            </span>
          </p>
        </div>
      </div>

      {/* Right: XP Chip & Tactile Action */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <span className={ACCORDION_ACTION_TOKENS.xpChip}>
          <Lightning weight="fill" className="w-3.5 h-3.5 text-amber-600" />
          <span>+{part.xpReward} XP</span>
        </span>

        {isCompleted ? (
          <div className={ACCORDION_ACTION_TOKENS.completedPill}>
            <CheckFat weight="fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>SELESAI</span>
          </div>
        ) : isUnlocked ? (
          <Button3D
            variant="blue"
            size="sm"
            onClick={() => onStartQuest(part.route)}
            className="text-xs px-4 sm:px-5 py-2 sm:py-2.5 shadow-[0_3px_0_0_#1D4ED8] sm:shadow-[0_3.5px_0_0_#1D4ED8] font-brand font-black"
          >
            <div className="flex items-center gap-1.5">
              <Play weight="fill" className="w-3.5 h-3.5" />
              <span>MULAI KODING</span>
            </div>
          </Button3D>
        ) : (
          <button
            type="button"
            onClick={() => onLockedClick(part.title)}
            className={ACCORDION_ACTION_TOKENS.lockedButton}
            title="Modul ini masih terkunci. Klik untuk informasi."
          >
            <LockSimple weight="bold" className="w-3.5 h-3.5" />
            <span>Terkunci</span>
          </button>
        )}
      </div>
    </div>
  )
}

