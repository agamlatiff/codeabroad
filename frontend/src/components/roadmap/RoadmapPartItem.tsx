import {
  LockSimple,
  Sparkle,
  Lightning,
  Play,
  CheckFat,
} from '@phosphor-icons/react'
import { Button3D } from '../ui/Button3D'
import type { SequentialPartItem } from '../../data/curriculumData'

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

  return (
    <div
      className={`p-3.5 sm:p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 transition-all duration-200 ${
        isCompleted
          ? 'bg-white border-2 border-slate-200/90 border-b-[4px] border-b-slate-300 hover:border-b-[5px] hover:-translate-y-0.5'
          : isNextActive
            ? 'bg-blue-50/50 border-2 border-blue-500 border-b-[5px] border-b-blue-600 ring-4 ring-blue-500/10 shadow-sm hover:border-b-[6px] hover:-translate-y-0.5'
            : 'bg-slate-50/70 border-2 border-slate-200/70 border-b-[3px] border-b-slate-200 opacity-60'
      } ${part.category === 'nihongo' && !isCompleted && !isNextActive ? 'bg-rose-50/40 border-rose-200/60' : ''}`}
    >
      {/* Left: 3D Tactile Token Cube + Details */}
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
            isCompleted
              ? 'bg-emerald-500 border-2 border-emerald-300 text-white shadow-[0_3px_0_0_#047857] sm:shadow-[0_3.5px_0_0_#047857]'
              : isNextActive
                ? 'bg-blue-600 border-2 border-blue-400 text-white shadow-[0_3px_0_0_#1D4ED8] sm:shadow-[0_3.5px_0_0_#1D4ED8] animate-pulse'
                : 'bg-slate-100 border-2 border-slate-200 text-slate-400'
          }`}
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
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                part.category === 'nihongo'
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
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
            className={`text-xs sm:text-base font-brand font-bold tracking-tight leading-snug line-clamp-2 ${
              isNextActive ? 'text-blue-950 font-black' : 'text-slate-900'
            }`}
          >
            Part {part.globalPartNumber}: {part.title}
          </h4>

          <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
            {part.subtitle} • {part.difficulty} • ⏱️ Estimasi {part.estimatedMinutes} Menit
          </p>
        </div>
      </div>

      {/* Right: XP Chip & Tactile Action */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <span className="bg-amber-50 text-amber-900 border border-amber-300 font-brand font-black text-[11px] sm:text-xs px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1">
          <Lightning weight="fill" className="w-3.5 h-3.5 text-amber-600" />
          <span>+{part.xpReward} XP</span>
        </span>

        {isCompleted ? (
          <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 font-brand font-black text-xs flex items-center gap-1.5 shadow-[0_2px_0_0_#A7F3D0]">
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
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 border-2 border-slate-200 text-slate-400 hover:text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
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

