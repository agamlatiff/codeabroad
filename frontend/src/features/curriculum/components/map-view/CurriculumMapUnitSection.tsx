import { useMemo } from 'react'
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

  const dashConfig = isUnitCompleted
    ? MAP_TRACK_TOKENS.dash.completed
    : isUnitActive
      ? MAP_TRACK_TOKENS.dash.active
      : MAP_TRACK_TOKENS.dash.locked

  return (
    <section className="space-y-4">
      {/* ── UNIT BANNER HEADER (Sticky per unit section on scroll) ── */}
      <div
        className={`sticky top-3 z-20 w-full text-white rounded-2xl px-6 py-4 sm:px-7 sm:py-5 shadow-[0_4px_0_0_rgba(0,0,0,0.18)] relative overflow-hidden flex items-center justify-between gap-4 border ${unit.bannerBorder} ${unit.bannerGradient}`}
      >
        {/* Glossy Glass Reflection Highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/5 to-transparent rounded-t-2xl pointer-events-none" />
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="space-y-1 min-w-0 relative z-10">
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

        <span className="shrink-0 relative z-10 text-xs font-brand font-black px-3 py-1.5 rounded-full bg-black/20 border border-white/20 text-white whitespace-nowrap">
          {unit.parts.filter((p) => p.status === 'completed').length}/{unit.parts.length} Pelajaran
        </span>
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

          {/* Decorative Ambient Language Learning Stamps on Margins */}
          <div className="hidden lg:block absolute right-6 top-28 text-slate-500 font-brand font-extrabold text-xs select-none pointer-events-none bg-white/90 border border-slate-200/90 px-3.5 py-1.5 rounded-xl shadow-xs backdrop-blur-xs">
            Kosakata & Tata Bahasa
          </div>
          <div className="hidden lg:block absolute left-6 bottom-28 text-slate-500 font-brand font-extrabold text-xs select-none pointer-events-none bg-white/90 border border-slate-200/90 px-3.5 py-1.5 rounded-xl shadow-xs backdrop-blur-xs">
            Latihan Konteks
          </div>
          <div className="hidden lg:block absolute right-6 bottom-16 text-slate-400 font-brand font-black text-xl sm:text-2xl select-none pointer-events-none opacity-60">
            ⚡ +{unit.parts.reduce((sum, p) => sum + p.xpReward, 0)} XP
          </div>

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

