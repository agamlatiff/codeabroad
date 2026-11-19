import type { FC } from 'react'
import {
  BookOpen,
  Cards,
  Check,
  Lightning,
  Target,
  Translate,
} from '@phosphor-icons/react'

interface QuestIconVisual {
  gradient: string
  renderIcon: (className: string) => React.ReactNode
}

const QUEST_ICON_STYLES: Record<string, QuestIconVisual> = {
  cards: {
    gradient: 'from-rose-400 to-pink-500 shadow-[0_2px_0_0_#9F1239]',
    renderIcon: (cls) => <Cards weight="bold" className={cls} />,
  },
  translate: {
    gradient: 'from-fuchsia-500 to-rose-500 shadow-[0_2px_0_0_#9F1239]',
    renderIcon: (cls) => <Translate weight="bold" className={cls} />,
  },
  lightning: {
    gradient: 'from-amber-400 to-orange-500 shadow-[0_2px_0_0_#B45309]',
    renderIcon: (cls) => <Lightning weight="fill" className={cls} />,
  },
  target: {
    gradient: 'from-emerald-500 to-teal-600 shadow-[0_2px_0_0_#0F766E]',
    renderIcon: (cls) => <Target weight="bold" className={cls} />,
  },
  'book-open': {
    gradient: 'from-blue-500 to-indigo-600 shadow-[0_2px_0_0_#1E3A8A]',
    renderIcon: (cls) => <BookOpen weight="bold" className={cls} />,
  },
}

export interface DailyQuestIconBadgeProps {
  iconName?: string
  size?: 'sm' | 'md'
  isCompleted?: boolean
  showCompletedCheck?: boolean
  className?: string
}

/**
 * Shared 3D icon badge for Daily Quests (SSOT across Right Sidebar and /quests).
 * Always preserves the quest's thematic icon even when completed.
 */
export const DailyQuestIconBadge: FC<DailyQuestIconBadgeProps> = ({
  iconName = 'book-open',
  size = 'sm',
  isCompleted = false,
  showCompletedCheck = false,
  className = '',
}) => {
  const visual = QUEST_ICON_STYLES[iconName] ?? QUEST_ICON_STYLES['book-open']
  const boxClass = size === 'md' ? 'w-13 h-13 rounded-2xl' : 'w-8 h-8 rounded-xl'
  const iconClass = size === 'md' ? 'w-6 h-6 text-white' : 'w-4 h-4 text-white'

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div
        className={`${boxClass} bg-gradient-to-b ${visual.gradient} text-white flex items-center justify-center transition-transform group-hover:scale-105`}
      >
        {visual.renderIcon(iconClass)}
      </div>
      {showCompletedCheck && isCompleted && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-2xs"
        >
          <Check weight="bold" className="w-2.5 h-2.5" />
        </span>
      )}
    </div>
  )
}
