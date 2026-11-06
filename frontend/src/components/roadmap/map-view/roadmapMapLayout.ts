import { MAP_GEOMETRY, MAP_MILESTONE_REWARDS } from '../../../tokens/roadmapTokens'
import type { CurriculumUnitData, PathMapNode } from '../../../data/roadmapMapFallback'

export interface UnitLayoutAssembly {
  allNodes: PathMapNode[]
  coords: { x: number; y: number }[]
  totalHeight: number
  svgPathString: string
  isUnitCompleted: boolean
  isUnitActive: boolean
}

/**
 * Builds a smooth continuous cubic Bezier SVG path through a series of 2D coordinates.
 */
export const buildSvgPath = (coords: { x: number; y: number }[]): string => {
  if (coords.length === 0) return ''
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`

  let path = `M ${coords[0].x} ${coords[0].y}`
  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = coords[i]
    const p2 = coords[i + 1]
    const midY = (p1.y + p2.y) / 2
    path += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`
  }
  return path
}

/**
 * Assembles unit nodes (including golden chest and exam trophy milestones),
 * computes their Serpentine S-Curve coordinates, and generates the SVG line path.
 */
export const assembleUnitNodes = (unit: CurriculumUnitData): UnitLayoutAssembly => {
  const isUnitCompleted = unit.parts.every((p) => p.status === 'completed')
  const isUnitActive = unit.parts.some((p) => p.status === 'active')

  const allNodes: PathMapNode[] = [
    ...unit.parts.map((p) => ({
      id: p.id,
      title: `Part ${p.number}: ${p.title}`,
      subtitle: p.subtitle,
      number: p.number,
      xpReward: p.xpReward,
      status: p.status,
      route: p.route,
      category: p.category,
      badgeLabel: p.badgeLabel,
    })),
  ]

  // Node Milestone 1: Peti Emas Hadiah
  allNodes.push({
    id: `${unit.id}-chest`,
    title: `Peti Emas Hadiah ${unit.title.split(',')[0]}`,
    subtitle: 'Klaim bonus permata dan pelindung streak untuk penyelesaian modul unit.',
    xpReward: MAP_MILESTONE_REWARDS.chestXp,
    status: isUnitCompleted ? 'completed' : isUnitActive ? 'active' : 'locked',
    route: '/dashboard',
    isChest: true,
  })

  // Node Milestone 2: Trofi Ujian Praktik
  allNodes.push({
    id: `${unit.id}-trophy`,
    title: `Tantangan Praktik Unit ${unit.unitNumber}`,
    subtitle: 'Uji pemahaman koding secara komprehensif untuk membuka unit berikutnya.',
    xpReward: MAP_MILESTONE_REWARDS.trophyXp,
    status: isUnitCompleted ? 'completed' : 'locked',
    route: '/courses',
    isTrophy: true,
  })

  // S-Curve Coordinates
  const { xSequence, verticalSpacing, startY, bottomPadding } = MAP_GEOMETRY
  const coords = allNodes.map((_, idx) => {
    const y = startY + idx * verticalSpacing
    const x = xSequence[idx % xSequence.length]
    return { x, y }
  })

  const totalHeight = startY + allNodes.length * verticalSpacing + bottomPadding
  const svgPathString = buildSvgPath(coords)

  return {
    allNodes,
    coords,
    totalHeight,
    svgPathString,
    isUnitCompleted,
    isUnitActive,
  }
}
