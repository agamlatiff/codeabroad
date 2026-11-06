import { useState, useMemo, useCallback } from 'react'
import { triggerHaptic } from '../../utils/haptics'
import type { Roadmap, CurriculumUnitData, PathMapNode } from '../../types/roadmap'
import { useQuestCompletionSync } from './useQuestCompletionSync'
import {
  transformRoadmapToMapUnits,
  transformFallbackToMapUnits,
} from '../../utils/roadmapMapTransformer'

export interface UseRoadmapMapViewProps {
  trackSlug?: string
  roadmap?: Roadmap | null
  currentPart?: number
}

/**
 * Headless controller hook for the 3D Serpentine Map View.
 * Coordinates real-time quest sync, unit data derivation, and modal state.
 */
export const useRoadmapMapView = ({
  trackSlug = 'golang',
  roadmap = null,
  currentPart,
}: UseRoadmapMapViewProps) => {
  const [activeModalNode, setActiveModalNode] = useState<PathMapNode | null>(null)
  const completedSet = useQuestCompletionSync(roadmap)

  const units: CurriculumUnitData[] = useMemo(() => {
    if (roadmap?.modules && roadmap.modules.length > 0) {
      return transformRoadmapToMapUnits(roadmap, completedSet)
    }
    return transformFallbackToMapUnits(trackSlug, completedSet, currentPart)
  }, [roadmap, trackSlug, currentPart, completedSet])

  const handleNodeClick = useCallback((node: PathMapNode) => {
    triggerHaptic('tap')
    setActiveModalNode(node)
  }, [])

  const handleCloseModal = useCallback(() => {
    setActiveModalNode(null)
  }, [])

  return {
    units,
    activeModalNode,
    setActiveModalNode,
    handleNodeClick,
    handleCloseModal,
  }
}
