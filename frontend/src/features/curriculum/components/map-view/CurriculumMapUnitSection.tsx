import { useId, useMemo } from 'react'
import type { FC } from 'react'
import { Check, LockSimple, Sparkle } from '@phosphor-icons/react'
import type { CurriculumUnitData, PathMapNode } from "@/features/curriculum/types/curriculum"
import {
  MAP_GEOMETRY,
  MAP_TRACK_TOKENS,
  MAP_BIOME_AURA_TOKENS,
} from "@/features/curriculum/tokens/curriculumTokens"
import { assembleUnitNodes } from './curriculumMapLayout'
import { CurriculumPathNode } from './CurriculumPathNode'
import {
  UnitBannerIllustration,
  UnitCanvasAmbientBackdrop,
  UnitSerpentineLandmarkIsland,
} from './CurriculumMapIllustrations'

const KANJI_CHAPTER_NUMERALS = ['壱', '弐', '参', '肆', '伍', '陸', '漆', '捌'] as const

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
  const unitPatternId = `unit-banner-seigaiha-${useId().replace(/:/g, '')}`
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
        className={`sticky top-3 z-20 w-full text-white rounded-2xl px-5 py-4 sm:px-6 sm:py-4.5 shadow-[0_4px_0_0_rgba(0,0,0,0.18)] relative overflow-hidden flex items-center justify-between gap-4 border ${unit.bannerBorder} ${unit.bannerGradient}`}
      >
        {/* Subtle Japanese Seigaiha Background Pattern */}
        <svg
          className="absolute inset-0 w-full h-full text-white opacity-[0.08] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id={unitPatternId} width="48" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M0 24A12 12 0 0 1 24 24M24 24A12 12 0 0 1 48 24M12 12A12 12 0 0 1 36 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${unitPatternId})`} />
        </svg>

        {/* Glossy Glass Reflection Highlight + Chapter Kanji Watermark */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/5 to-transparent rounded-t-2xl pointer-events-none" />
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <span
          aria-hidden="true"
          className="pointer-events-none select-none hidden md:block absolute right-64 -bottom-3 text-7xl font-black text-white/10 leading-none"
        >
          {KANJI_CHAPTER_NUMERALS[(Math.max(1, unit.unitNumber) - 1) % KANJI_CHAPTER_NUMERALS.length]}
        </span>

        <UnitBannerIllustration
          unitNumber={unit.unitNumber}
          className="hidden sm:flex !absolute right-36 bottom-0 !w-[220px] !h-[120px] opacity-60 z-0"
        />

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
          Belum ada lesson tersedia pada unit ini.
        </div>
      ) : (
        <div className="relative py-6 sm:py-8 overflow-visible">
          {/* Soft Ambient Spotlight Glow (Biome Aura) */}
          <div
            className={`absolute top-6 left-1/2 -translate-x-1/2 w-96 sm:w-[560px] h-[520px] -z-10 pointer-events-none rounded-full blur-3xl opacity-30 ${
              isUnitCompleted
                ? MAP_BIOME_AURA_TOKENS.completed
                : isUnitActive
                  ? MAP_BIOME_AURA_TOKENS.active
                  : MAP_BIOME_AURA_TOKENS.locked
            }`}
          />

          {/* Seamless Background Scenery Backdrop */}
          <UnitCanvasAmbientBackdrop unitNumber={unit.unitNumber} totalHeight={totalHeight} />

          <div
            className="relative w-full max-w-2xl mx-auto overflow-visible"
            style={{ height: `${totalHeight}px` }}
          >
            {/* ── JAPANESE SCENIC LANDMARK ISLANDS IN OPPOSITE S-CURVE POCKETS ── */}
            {allNodes.map((node, nIdx) => {
              const coord = coords[nIdx]
              if (!coord) return null
              const isOffCenter = coord.x < 160 || coord.x > 240
              const hasKodiBesideNode = node.status === 'active' && !node.isChest && !node.isTrophy
              if (!isOffCenter || hasKodiBesideNode) return null

              const islandSide: 'left' | 'right' = coord.x < 160 ? 'right' : 'left'
              return (
                <UnitSerpentineLandmarkIsland
                  key={`island-${node.id}`}
                  sceneIndex={(unit.unitNumber - 1) * 3 + nIdx}
                  side={islandSide}
                  topPx={coord.y}
                />
              )
            })}

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

