import type { FC } from 'react'
import type { Roadmap } from "@/features/curriculum/types/roadmap"
import { useRoadmapMapView } from "@/features/curriculum/hooks/useRoadmapMapView"
import { MAP_STAGE_TOKENS } from "@/features/curriculum/tokens/roadmapTokens"
import { RoadmapNodeDetailModal } from './RoadmapNodeDetailModal'
import { RoadmapMapUnitSection } from './RoadmapMapUnitSection'
import { useAuthStore } from "@/features/auth/store/authStore"

export interface RoadmapMapViewProps {
  className?: string
  trackSlug?: string
  roadmap?: Roadmap | null
  currentPart?: number
  onStartQuest?: (route: string) => void
}

/**
 * RoadmapMapView
 * Interactive Duolingo 3D Serpentine Snake Path view themed after Tokyo Yamanote Line.
 * Orchestrates sequential unit sections, stepping stone nodes, and interactive quest modals.
 */
export const RoadmapMapView: FC<RoadmapMapViewProps> = ({
  className = '',
  trackSlug,
  roadmap = null,
  currentPart,
  onStartQuest,
}) => {
  const user = useAuthStore((s) => s.user)
  // Priority 1: prop trackSlug -> Priority 2: roadmap.slug -> Priority 3: user's primary stack
  const effectiveTrack = trackSlug || roadmap?.slug || user?.primary_stack || user?.career_path?.slug || ''

  const {
    units,
    activeModalNode,
    handleNodeClick,
    handleCloseModal,
  } = useRoadmapMapView({
    trackSlug: effectiveTrack,
    roadmap,
    currentPart,
  })

  return (
    <div className={`space-y-12 sm:space-y-16 select-none ${className}`}>
      {/* ── INTERACTIVE LESSON MODAL / POPOVER ── */}
      <RoadmapNodeDetailModal
        node={activeModalNode}
        onClose={handleCloseModal}
        onStartQuest={onStartQuest}
      />

      {/* ── UNIFIED ADVENTURE GAME STAGE (PANGGUNG KANVAS UTAMA) ── */}
      <div className={MAP_STAGE_TOKENS.canvasContainer}>
        {units.map((unit) => (
          <RoadmapMapUnitSection
            key={unit.id}
            unit={unit}
            onNodeClick={handleNodeClick}
            onStartQuest={onStartQuest}
          />
        ))}
      </div>
    </div>
  )
}
