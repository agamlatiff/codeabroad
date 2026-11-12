import {
  LockSimple,
  CaretDown,
  Sparkle,
  CaretUp,
  CheckFat,
  Trophy,
} from '@phosphor-icons/react'
import { RoadmapPartItem } from './RoadmapPartItem'
import type { SequentialCurriculumUnit } from "@/features/curriculum/types/roadmap"
import { resolveUnitCardTokens, ACCORDION_ACTION_TOKENS } from "@/features/curriculum/tokens/roadmapTokens"

export interface RoadmapUnitCardProps {
  unit: SequentialCurriculumUnit
  isCollapsed: boolean
  onToggleCollapse: () => void
  onLockedClick: (title: string) => void
  onStartQuest: (route: string) => void
}

export const RoadmapUnitCard = ({
  unit,
  isCollapsed,
  onToggleCollapse,
  onLockedClick,
  onStartQuest,
}: RoadmapUnitCardProps) => {
  const isUnitCompleted = unit.isCompleted
  const isUnitActive = unit.isActive
  const unitPercent = unit.progressPercent ?? 0
  const completedCount = unit.completedCount ?? 0
  const tokens = resolveUnitCardTokens(unit)

  return (
    <div
      className={`bg-white rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-2xs ${tokens.containerRing}`}
    >
      {/* ── DUOLINGO 3D UNIT BANNER HEADER ── */}
      <div className={`p-4 sm:p-6 transition-all ${tokens.bannerHeader}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-mono font-bold text-[10px] px-2.5 py-1 rounded-lg ${tokens.unitTag}`}
              >
                {unit.tag}
              </span>

              {isUnitCompleted ? (
                <span className="bg-white/20 text-white font-brand font-black text-[10px] px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-white/25">
                  <CheckFat weight="fill" className="w-3 h-3 text-emerald-200" />
                  <span>LULUS SEMUA SESI</span>
                </span>
              ) : isUnitActive ? (
                <span className="bg-white/20 text-white font-brand font-black text-[10px] px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-white/25">
                  <Sparkle weight="fill" className="w-3 h-3 text-amber-300" />
                  <span>SEDANG AKTIF</span>
                </span>
              ) : (
                <span className="bg-slate-200/90 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 border border-slate-300">
                  <LockSimple weight="bold" className="w-3 h-3" />
                  <span>TERKUNCI</span>
                </span>
              )}
            </div>

            <h3
              className={`font-brand font-black text-lg sm:text-xl tracking-tight leading-snug ${tokens.titleText}`}
            >
              {unit.title}
            </h3>
            <p
              className={`text-xs leading-relaxed max-w-2xl font-medium ${tokens.descriptionText}`}
            >
              {unit.description}
            </p>
          </div>

          {/* Action Button: Collapse toggle */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={onToggleCollapse}
              className={`p-2 rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-2xs ${tokens.collapseButton}`}
              title={isCollapsed ? 'Buka Sesi Unit' : 'Lipat Sesi Unit'}
            >
              {isCollapsed ? (
                <CaretDown weight="bold" className="w-4 h-4" />
              ) : (
                <CaretUp weight="bold" className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 3D Segmented Progress Bar */}
        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <div
              className={`h-2.5 sm:h-3 rounded-full overflow-hidden p-0.5 border ${tokens.progressTrack}`}
            >
              <div
                className={`h-full rounded-full transition-all duration-500 shadow-xs ${tokens.progressFill}`}
                style={{ width: `${unitPercent}%` }}
              />
            </div>
          </div>
          <span
            className={`text-xs font-brand font-black shrink-0 whitespace-nowrap ${tokens.progressLabel}`}
          >
            {completedCount}/{unit.parts.length} Sesi ({unitPercent}%)
          </span>
        </div>
      </div>

      {/* ── SEQUENTIAL PART BREAKDOWN (COLLAPSIBLE) ── */}
      {!isCollapsed && (
        <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-3 bg-white">
          {unit.parts.map((part) => (
            <RoadmapPartItem
              key={part.id}
              part={part}
              onLockedClick={onLockedClick}
              onStartQuest={onStartQuest}
            />
          ))}
        </div>
      )}

      {/* Unit Milestone Trophy Badge */}
      {isUnitCompleted && (
        <div className={ACCORDION_ACTION_TOKENS.completionBanner}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={ACCORDION_ACTION_TOKENS.trophyIconBox}>
              <Trophy weight="fill" className="w-4 h-4 text-amber-200" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-brand font-black text-emerald-950 truncate">
                Unit 0{unit.unitNumber} Lulus 100%!
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                Seluruh sesi Unit 0{unit.unitNumber} tuntas (+{unit.totalXp} XP total terkumpul).
              </span>
            </div>
          </div>
          <span className={ACCORDION_ACTION_TOKENS.verifiedBadge}>
            <CheckFat weight="fill" className="w-3 h-3 text-emerald-100" />
            <span>TERVERIFIKASI</span>
          </span>
        </div>
      )}
    </div>
  )
}

