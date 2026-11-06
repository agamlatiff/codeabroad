import { useState, useMemo, useCallback, useEffect } from 'react'
import { triggerHaptic } from '../../utils/haptics'
import type { Roadmap, CurriculumUnitData, PathMapNode } from '../../types/roadmap'
import {
  transformRoadmapToMapUnits,
  transformFallbackToMapUnits,
  resolveCompletedQuestSet,
} from '../../utils/roadmapMapTransformer'

export interface UseRoadmapMapViewProps {
  trackSlug?: string
  roadmap?: Roadmap | null
  currentPart?: number
}

const STORAGE_KEY = 'codeabroad_completed_quests'

const readLocalCompletedQuests = (): string[] => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return []
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Headless controller hook for the 3D Serpentine Map View (RoadmapMapView).
 * 1 Component = 1 Headless Hook architecture.
 * Coordinates real-time quest sync, unit data derivation, and modal state.
 */
export const useRoadmapMapView = ({
  trackSlug = 'golang',
  roadmap = null,
  currentPart,
}: UseRoadmapMapViewProps) => {
  const [activeModalNode, setActiveModalNode] = useState<PathMapNode | null>(null)
  const [syncTick, setSyncTick] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleSync = () => setSyncTick((prev) => prev + 1)

    window.addEventListener('codeabroad_quest_completed', handleSync)
    window.addEventListener('storage', handleSync)

    return () => {
      window.removeEventListener('codeabroad_quest_completed', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  const completedSet = useMemo(() => {
    void syncTick
    const localIds = readLocalCompletedQuests()
    return resolveCompletedQuestSet(roadmap, localIds)
  }, [roadmap, syncTick])

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
