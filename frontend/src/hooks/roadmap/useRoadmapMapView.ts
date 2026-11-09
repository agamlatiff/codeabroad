import { useState, useMemo, useCallback } from 'react'
import { triggerHaptic } from '../../utils/haptics'
import { playSound } from '../../utils/sound'
import type { Roadmap, CurriculumUnitData, PathMapNode } from '../../types/roadmap'
import {
  transformRoadmapToMapUnits,
  resolveCompletedQuestSet,
} from '../../utils/roadmapMapTransformer'
import { useRoadmapStore } from '../../store/roadmapStore'

export interface UseRoadmapMapViewProps {
  trackSlug?: string
  roadmap?: Roadmap | null
  currentPart?: number
}

/**
 * Headless controller hook for the 3D Serpentine Map View (RoadmapMapView).
 * 1 Component = 1 Headless Hook architecture.
 * Coordinates real-time quest sync via useRoadmapStore, unit data derivation, and modal state.
 */
export const useRoadmapMapView = ({
  roadmap = null,
}: UseRoadmapMapViewProps) => {
  const [activeModalNode, setActiveModalNode] = useState<PathMapNode | null>(null)
  const completedQuestIds = useRoadmapStore((s) => s.completedQuestIds)

  const completedSet = useMemo(() => {
    // If store has items, use them; also check legacy localStorage fallback if store is freshly initialized
    let localIds = completedQuestIds
    if (localIds.length === 0 && typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem('codeabroad_completed_quests')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) localIds = parsed
        }
      } catch {
        // Ignore JSON error
      }
    }
    return resolveCompletedQuestSet(roadmap, localIds)
  }, [roadmap, completedQuestIds])

  const units: CurriculumUnitData[] = useMemo(() => {
    if (roadmap?.modules && roadmap.modules.length > 0) {
      return transformRoadmapToMapUnits(roadmap, completedSet)
    }
    return []
  }, [roadmap, completedSet])

  const handleNodeClick = useCallback((node: PathMapNode) => {
    triggerHaptic('tap')
    if (node.isTrophy || node.isChest) {
      playSound('trophy_tap')
    } else if (node.status === 'locked') {
      playSound('node_locked')
    } else {
      playSound('node_tap')
    }
    setActiveModalNode(node)
  }, [])

  const handleCloseModal = useCallback(() => {
    playSound('modal_close')
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
