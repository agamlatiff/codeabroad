import { useMemo } from 'react'
import type { FC } from 'react'
import { Check, LockSimple, Sparkle } from '@phosphor-icons/react'
import type { CurriculumUnitData, PathMapNode } from "@/features/curriculum/types/curriculum"
import {
  MAP_GEOMETRY,
  MAP_TRACK_TOKENS,
} from "@/features/curriculum/tokens/curriculumTokens"
import { assembleUnitNodes } from './curriculumMapLayout'
import { CurriculumPathNode } from './CurriculumPathNode'

export interface CurriculumMapUnitSectionProps {
  unit: CurriculumUnitData
  onNodeClick: (node: PathMapNode) => void
  onStartLesson?: (route: string) => void
}

/**
 * Presentational component rendering a single sequential curriculum unit in the Map View,
 * including its checkpoint archway banner, SVG serpentine bezier tracks, and stepping stone nodes.
 */
export const CurriculumMapUnitSection: FC<CurriculumMapUnitSectionProps> = ({
  unit,
  onNodeClick,
  onStartLesson,
}) => {
  const {
    allNodes,
    coords,
    totalHeight,
    svgPathString,
    isUnitCompleted,
    isUnitActive,
  } = useMemo(() => assembleUnitNodes(unit), [unit])

  const completedLessonsCount = unit.parts.filter((p) => p.status === 'completed').length
  const totalLessonsCount = unit.parts.length
  const unitProgressPercent =
    totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0

  const dashConfig = isUnitCompleted
    ? MAP_TRACK_TOKENS.dash.completed
    : isUnitActive
      ? MAP_TRACK_TOKENS.dash.active
      : MAP_TRACK_TOKENS.dash.locked

  return (
    <section id={`unit-section-${unit.unitNumber}`} className="space-y-4 scroll-mt-6">
      {/* ── UNIT BANNER HEADER (Sticky per unit section on scroll) ── */}
      <div
        className={`sticky top-3 z-20 w-full text-white rounded-2xl px-5 py-4 sm:px-6 sm:py-4.5 shadow-[0_4px_0_0_rgba(0,0,0,0.18)] overflow-hidden flex items-center justify-between gap-4 border ${unit.bannerBorder} ${unit.bannerGradient}`}
      >
        <div className="space-y-1 min-w-0 relative z-10 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-brand font-black text-xs sm:text-[13px] uppercase tracking-wider text-white/90">
              UNIT {unit.unitNumber}
            </span>
            <span className="text-white/40 text-xs">•</span>
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              {isUnitCompleted ? (
                <>
                  <Check weight="bold" className="w-3 h-3 text-emerald-200" />
                  <span>SELESAI</span>
                </>
              ) : isUnitActive ? (
                <>
                  <Sparkle weight="fill" className="w-3 h-3 text-amber-300" />
                  <span>AKTIF</span>
                </>
              ) : (
                <>
                  <LockSimple weight="bold" className="w-3 h-3 text-white/80" />
                  <span>TERKUNCI</span>
                </>
              )}
            </span>
          </div>
          <h2 className="text-sm sm:text-base md:text-lg font-brand font-black tracking-tight text-white leading-snug line-clamp-2">
            {unit.title}
          </h2>
          {unit.description && (
            <p className="text-xs sm:text-[13px] text-white/85 font-medium leading-relaxed line-clamp-2">
              {unit.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">

          <div className="rounded-2xl bg-black/22 border border-white/25 px-3.5 py-2 backdrop-blur-xs min-w-[116px] space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs font-brand font-black text-white whitespace-nowrap tabular-nums">
              <span>{completedLessonsCount}/{totalLessonsCount} Pelajaran</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-300 transition-all duration-300"
                style={{ width: `${unitProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── SERPENTINE SNAKE PATH ── */}
      {allNodes.length === 0 ? (
        <div className="max-w-2xl mx-auto py-8 text-center text-xs font-medium text-slate-500">
          Belum ada pelajaran di unit ini.
        </div>
      ) : (
        <div className="relative py-6 sm:py-8 overflow-visible">
          <div
            className="relative w-full max-w-2xl mx-auto overflow-visible"
            style={{ height: `${totalHeight}px` }}
          >
            {/* ── CONTINUOUS SERPENTINE SVG TRACK ── */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${MAP_GEOMETRY.viewboxWidth} ${totalHeight}`}
              preserveAspectRatio="none"
              fill="none"
            >
              {isUnitActive && (
                <path
                  d={svgPathString}
                  stroke={MAP_TRACK_TOKENS.glow.stroke}
                  strokeWidth={MAP_TRACK_TOKENS.glow.strokeWidth}
                  strokeLinecap="round"
                  opacity={MAP_TRACK_TOKENS.glow.opacity}
                />
              )}

              <path
                d={svgPathString}
                stroke={MAP_TRACK_TOKENS.base.stroke}
                strokeWidth={MAP_TRACK_TOKENS.base.strokeWidth}
                strokeLinecap="round"
              />

              <path
                d={svgPathString}
                stroke={dashConfig.stroke}
                strokeWidth={MAP_TRACK_TOKENS.dash.strokeWidth}
                strokeDasharray={MAP_TRACK_TOKENS.dash.dashArray}
                strokeLinecap="round"
                opacity={dashConfig.opacity}
              />
            </svg>

            {/* ── STEPPING STONE NODES ── */}
            {allNodes.map((node, nIdx) => (
              <CurriculumPathNode
                key={node.id}
                node={node}
                coord={coords[nIdx]}
                onClick={onNodeClick}
                onStartLesson={onStartLesson}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

