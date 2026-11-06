import type { FC } from 'react'
import { CurriculumPathMap } from '../../game/CurriculumPathMap'

export interface RoadmapMapViewProps {
  trackSlug?: string
}

/**
 * RoadmapMapView
 * Interactive Duolingo 3D Serpentine Snake Path view themed after Tokyo Yamanote Line.
 * Features stepping stone nodes, tactile 3D buttons, and walking Kodi mascot companion.
 */
export const RoadmapMapView: FC<RoadmapMapViewProps> = ({ trackSlug }) => {
  return <CurriculumPathMap trackSlug={trackSlug} />
}

