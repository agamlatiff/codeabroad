import type { FC, ReactNode } from 'react'
import {
  Check,
  Gift,
  Trophy,
  Translate,
  Code,
} from '@phosphor-icons/react'
import type { PathMapNode, MapNodeCategory } from '../../../types/roadmap'
import { MAP_MODAL_TOKENS } from '../../../tokens/roadmapTokens'

/**
 * Renders the symbol or number inside the 3D map node disc.
 */
export const renderNodeSymbol = (node: PathMapNode, iconClass: string): ReactNode => {
  if (node.category === 'language') {
    return <Translate weight="bold" className={iconClass} />
  }
  return <span>{node.number}</span>
}

/**
 * Renders the action icon inside the active popover CTA button.
 */
export const renderActionIcon = (category?: MapNodeCategory): ReactNode => {
  if (category === 'language') {
    return <Translate weight="bold" className="w-3.5 h-3.5" />
  }
  return <Code weight="bold" className="w-3.5 h-3.5" />
}

export interface RoadmapModalNodeIconProps {
  node: PathMapNode
  modalIconBg: string
}

/**
 * Renders the leading hero icon inside RoadmapNodeDetailModal.
 */
export const RoadmapModalNodeIcon: FC<RoadmapModalNodeIconProps> = ({
  node,
  modalIconBg,
}) => {
  if (node.isChest) {
    return (
      <div className={MAP_MODAL_TOKENS.milestones.chest}>
        <Gift weight="fill" className="w-6 h-6" />
      </div>
    )
  }

  if (node.isTrophy) {
    return (
      <div className={MAP_MODAL_TOKENS.milestones.trophy}>
        <Trophy weight="fill" className="w-6 h-6" />
      </div>
    )
  }

  if (node.category === 'language') {
    return (
      <div className={`${MAP_MODAL_TOKENS.iconContainerBase} ${modalIconBg}`}>
        <Translate weight="bold" className="w-6 h-6" />
      </div>
    )
  }

  return (
    <div className={`${MAP_MODAL_TOKENS.iconContainerBase} ${modalIconBg}`}>
      {node.status === 'completed' ? (
        <Check weight="bold" className="w-6 h-6 text-emerald-600" />
      ) : (
        node.number
      )}
    </div>
  )
}

