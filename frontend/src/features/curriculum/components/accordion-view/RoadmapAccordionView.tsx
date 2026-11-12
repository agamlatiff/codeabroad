import type { FC } from 'react'
import type { SequentialCurriculumUnit } from "@/features/curriculum/types/roadmap"
import { RoadmapUnitCard } from './RoadmapUnitCard'

export interface RoadmapAccordionViewProps {
  units: SequentialCurriculumUnit[]
  isLoading?: boolean
  isUnitCollapsed: (unit: SequentialCurriculumUnit) => boolean
  onToggleCollapse: (unit: SequentialCurriculumUnit) => void
  onLockedClick: (title: string) => void
  onStartQuest: (route: string) => void
}

/**
 * RoadmapAccordionView
 * Structured Syllabus View presenting modules as collapsible 3D unit cards.
 * Provides a clean birds-eye view of technical topics, time estimates, difficulty, and XP rewards.
 */
export const RoadmapAccordionView: FC<RoadmapAccordionViewProps> = ({
  units,
  isLoading,
  isUnitCollapsed,
  onToggleCollapse,
  onLockedClick,
  onStartQuest,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs font-semibold animate-pulse shadow-xs">
        Memuat silabus kurikulum spesialisasi...
      </div>
    )
  }

  if (units.length === 0) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs font-semibold shadow-xs">
        Belum ada modul kurikulum yang tersedia untuk track ini.
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-1">
      {units.map((unit) => (
        <RoadmapUnitCard
          key={unit.id}
          unit={unit}
          isCollapsed={isUnitCollapsed(unit)}
          onToggleCollapse={() => onToggleCollapse(unit)}
          onLockedClick={onLockedClick}
          onStartQuest={onStartQuest}
        />
      ))}
    </div>
  )
}

