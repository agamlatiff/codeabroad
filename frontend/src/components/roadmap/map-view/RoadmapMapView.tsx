import type { FC } from 'react'
import type { Roadmap } from '../../../types/roadmap'
import { useRoadmapMapView } from '../../../hooks/roadmap/useRoadmapMapView'
import { MAP_STAGE_TOKENS } from '../../../tokens/roadmapTokens'
import { RoadmapNodeDetailModal } from './RoadmapNodeDetailModal'
import { RoadmapMapUnitSection } from './RoadmapMapUnitSection'

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
  trackSlug = 'golang',
  roadmap = null,
  currentPart,
  onStartQuest,
}) => {
  const {
    units,
    activeModalNode,
    handleNodeClick,
    handleCloseModal,
  } = useRoadmapMapView({
    trackSlug,
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
