/* eslint-disable react-refresh/only-export-components */
import type { FC, ReactNode } from 'react'
import {
  Check,
  Gift,
  Trophy,
  Translate,
  BookOpen,
  Play,
} from '@phosphor-icons/react'
import type { PathMapNode, MapNodeCategory } from "@/features/curriculum/types/curriculum"
import { MAP_MODAL_TOKENS } from "@/features/curriculum/tokens/curriculumTokens"

/**
 * Renders the symbol or lesson number inside the 3D map node disc.
 */
export const renderNodeSymbol = (node: PathMapNode, iconClass: string): ReactNode => {
  if (node.category === 'language' && node.number !== undefined) {
    return <span>{node.number}</span>
  }
  if (node.category === 'language') {
    return <Translate weight="bold" className={iconClass} />
  }
  return <span>{node.number ?? <BookOpen weight="bold" className={iconClass} />}</span>
}

/**
 * Renders the action icon inside the active popover CTA button.
 */
export const renderActionIcon = (category?: MapNodeCategory): ReactNode => {
  if (category === 'language') {
    return <Translate weight="bold" className="w-3.5 h-3.5" />
  }
  return <Play weight="fill" className="w-3.5 h-3.5" />
}

export interface CurriculumModalNodeIconProps {
  node: PathMapNode
  modalIconBg: string
}

/**
 * Renders the leading hero icon inside CurriculumNodeDetailModal.
 */
export const CurriculumModalNodeIcon: FC<CurriculumModalNodeIconProps> = ({
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
        {node.status === 'completed' ? (
          <Check weight="bold" className="w-6 h-6 text-emerald-600" />
        ) : (
          <Translate weight="bold" className="w-6 h-6" />
        )}
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

