import { MAP_GEOMETRY } from "@/features/curriculum/tokens/curriculumTokens"
import type { CurriculumUnitData, PathMapNode } from "@/features/curriculum/types/curriculum"

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
 * Assembles real lesson nodes and optional unit exam trophy nodes,
 * computes their Serpentine S-Curve coordinates, and generates the SVG track path.
 * 100% Pure & Declarative (strictly driven by backend lesson unlock/completion state).
 */
export const assembleUnitNodes = (unit: CurriculumUnitData): UnitLayoutAssembly => {
  const isUnitCompleted =
    unit.parts.length > 0 && unit.parts.every((p) => p.status === 'completed')
  const isUnitActive = unit.parts.some((p) => p.status === 'active')

  const lessonNodes: PathMapNode[] = unit.parts.map((p): PathMapNode => ({
    id: p.id,
    title: `Pelajaran ${p.number}: ${p.title}`,
    subtitle: p.subtitle,
    number: p.number,
    iconName: p.iconName,
    xpReward: p.xpReward,
    score: p.score,
    isSkipped: p.isSkipped,
    status: p.status,
    route: p.route,
    category: p.category,
    badgeLabel: p.badgeLabel,
  }))

  const allNodes: PathMapNode[] = unit.bossQuest
    ? [
        ...lessonNodes,
        {
          id: unit.bossQuest.id,
          title: unit.bossQuest.title,
          subtitle: unit.bossQuest.subtitle,
          xpReward: unit.bossQuest.xpReward,
          gemsReward: unit.bossQuest.gemsReward,
          score: unit.bossQuest.score,
          isSkipped: unit.bossQuest.isSkipped,
          status: unit.bossQuest.status,
          route: unit.bossQuest.route,
          isTrophy: true,
        },
      ]
    : lessonNodes

  const {
    xSequence,
    verticalSpacing,
    activePopoverExtraSpace,
    startY,
    bottomPadding,
  } = MAP_GEOMETRY

  let currentY = startY
  const coords = allNodes.map((node, idx) => {
    const coord = {
      x: xSequence[idx % xSequence.length],
      y: currentY,
    }
    const isActiveLessonNode = node.status === 'active' && !node.isChest && !node.isTrophy
    currentY += verticalSpacing + (isActiveLessonNode ? activePopoverExtraSpace : 0)
    return coord
  })

  const lastNode = allNodes[allNodes.length - 1]
  const isLastNodeActive =
    Boolean(lastNode) && lastNode.status === 'active' && !lastNode.isChest && !lastNode.isTrophy
  const lastCoord = coords[coords.length - 1]

  const totalHeight = lastCoord
    ? lastCoord.y +
      verticalSpacing * 0.6 +
      bottomPadding +
      (isLastNodeActive ? activePopoverExtraSpace : 0)
    : bottomPadding

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

