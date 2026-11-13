import { useState, useMemo, useCallback } from 'react'
import { triggerHaptic } from "@/shared/utils/haptics"
import { playSound } from "@/shared/utils/sound"
import type {
  CurriculumResponse,
  CurriculumUnitData,
  PathMapNode,
} from "@/features/curriculum/types/curriculum"
import { transformCurriculumToMapUnits } from "@/features/curriculum/utils/curriculumMapTransformer"

export interface UseCurriculumMapViewProps {
  curriculum?: CurriculumResponse | null
}

/**
 * Headless controller hook for the 3D Serpentine Map View (CurriculumMapView).
 * Strictly driven by backend CurriculumResponse without local storage overrides.
 */
export const useCurriculumMapView = ({ curriculum = null }: UseCurriculumMapViewProps) => {
  const [activeModalNode, setActiveModalNode] = useState<PathMapNode | null>(null)

  const units: CurriculumUnitData[] = useMemo(
    () => transformCurriculumToMapUnits(curriculum),
    [curriculum]
  )

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
