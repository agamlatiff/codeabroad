import { useMemo } from 'react'
import type { FC } from 'react'
import { Check, LockSimple, Sparkle } from '@phosphor-icons/react'
import type { CurriculumUnitData, PathMapNode } from '../../../types/roadmap'
import {
  MAP_GEOMETRY,
  MAP_TRACK_TOKENS,
  MAP_BIOME_AURA_TOKENS,
} from '../../../tokens/roadmapTokens'
import { assembleUnitNodes } from './roadmapMapLayout'
import { RoadmapPathNode } from './RoadmapPathNode'

export interface RoadmapMapUnitSectionProps {
  unit: CurriculumUnitData
  onNodeClick: (node: PathMapNode) => void
  onStartQuest?: (route: string) => void
}

/**
 * Presentational component rendering a single sequential curriculum unit in the Map View,
 * including its checkpoint archway banner, SVG serpentine bezier tracks, and stepping stone nodes.
 */
export const RoadmapMapUnitSection: FC<RoadmapMapUnitSectionProps> = ({
  unit,
  onNodeClick,
  onStartQuest,
}) => {
  const {
    allNodes,
    coords,
    totalHeight,
    svgPathString,
    isUnitCompleted,
    isUnitActive,
  } = useMemo(() => assembleUnitNodes(unit), [unit])

  return (
    <section className="space-y-4">
      {/* ── UNIT BANNER HEADER (COMPACT DUOLINGO CHECKPOINT ARCHWAY) ── */}
      <div
        className={`max-w-xl mx-auto w-full text-white rounded-2xl px-5 py-3.5 sm:px-6 sm:py-4 shadow-[0_4px_0_0_rgba(0,0,0,0.18)] relative overflow-hidden flex items-center justify-between gap-4 border ${unit.bannerBorder} ${unit.bannerGradient}`}
      >
        {/* Glossy Glass Reflection Highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/5 to-transparent rounded-t-2xl pointer-events-none" />

        {/* Decorative Subtle Ambient Glow Bubble */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="space-y-1 min-w-0 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-brand font-black text-xs uppercase tracking-wider text-white/90">
              UNIT {unit.unitNumber}
            </span>
            <span className="text-white/40 text-xs">•</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
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
          <h2 className="text-xs sm:text-sm md:text-base font-brand font-black tracking-tight text-white leading-snug line-clamp-2">
            {unit.title}
          </h2>
        </div>
      </div>

      {/* ── SERPENTINE SNAKE PATH (OPEN WORLD CANVAS) ── */}
      <div className="relative py-4 sm:py-6 overflow-visible">
        {/* Soft Ambient Spotlight Glow (Biome Aura) */}
        <div
          className={`absolute top-6 left-1/2 -translate-x-1/2 w-80 sm:w-[440px] h-[450px] -z-10 pointer-events-none rounded-full blur-3xl opacity-30 ${
            isUnitCompleted
              ? MAP_BIOME_AURA_TOKENS.completed
              : isUnitActive
              ? MAP_BIOME_AURA_TOKENS.active
              : MAP_BIOME_AURA_TOKENS.locked
          }`}
        />

        {/* Decorative Ambient Code Stamps on Margins */}
        <div className="hidden lg:block absolute left-4 top-16 text-slate-300 font-mono font-black text-2xl select-none pointer-events-none opacity-60">
          {'{ }'}
        </div>
        <div className="hidden lg:block absolute right-4 top-28 text-slate-400 font-mono font-bold text-[10px] select-none pointer-events-none bg-white/80 border border-slate-200/80 px-2 py-1 rounded-lg shadow-2xs backdrop-blur-xs">
          func() : tokyo_prod
        </div>
        <div className="hidden lg:block absolute left-4 bottom-24 text-slate-400 font-mono font-bold text-[10px] select-none pointer-events-none bg-white/80 border border-slate-200/80 px-2 py-1 rounded-lg shadow-2xs backdrop-blur-xs">
          := stack alloc
        </div>
        <div className="hidden lg:block absolute right-4 bottom-16 text-slate-300 font-brand font-black text-xl select-none pointer-events-none opacity-50">
          ⚡ +50XP
        </div>

        <div
          className="relative w-full max-w-lg mx-auto overflow-visible"
          style={{ height: `${totalHeight}px` }}
        >
          {/* ── CONTINUOUS SERPENTINE SVG TRACK ── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${MAP_GEOMETRY.viewboxWidth} ${totalHeight}`}
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Outer Subtle Ambient Glow for Active Track */}
            {isUnitActive && (
              <path
                d={svgPathString}
                stroke={MAP_TRACK_TOKENS.glow.stroke}
                strokeWidth={MAP_TRACK_TOKENS.glow.strokeWidth}
                strokeLinecap="round"
                opacity={MAP_TRACK_TOKENS.glow.opacity}
              />
            )}

            {/* Thick Base Foundation Track */}
            <path
              d={svgPathString}
              stroke={MAP_TRACK_TOKENS.base.stroke}
              strokeWidth={MAP_TRACK_TOKENS.base.strokeWidth}
              strokeLinecap="round"
            />
            {/* Inner Active / Completed Dashed Line */}
            {(() => {
              const dashConfig = isUnitCompleted
                ? MAP_TRACK_TOKENS.dash.completed
                : isUnitActive
                ? MAP_TRACK_TOKENS.dash.active
                : MAP_TRACK_TOKENS.dash.locked

              return (
                <path
                  d={svgPathString}
                  stroke={dashConfig.stroke}
                  strokeWidth={MAP_TRACK_TOKENS.dash.strokeWidth}
                  strokeDasharray={MAP_TRACK_TOKENS.dash.dashArray}
                  strokeLinecap="round"
                  opacity={dashConfig.opacity}
                />
              )
            })()}
          </svg>

          {/* ── STEPPING STONE NODES ── */}
          {allNodes.map((node, nIdx) => (
            <RoadmapPathNode
              key={node.id}
              node={node}
              coord={coords[nIdx]}
              onClick={onNodeClick}
              onStartQuest={onStartQuest}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

