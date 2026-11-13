import type { FC } from 'react'
import type { SequentialCurriculumUnit } from "@/features/curriculum/types/curriculum"
import { CurriculumUnitCard } from './CurriculumUnitCard'

export interface CurriculumAccordionViewProps {
  units: SequentialCurriculumUnit[]
  isLoading?: boolean
  isUnitCollapsed: (unit: SequentialCurriculumUnit) => boolean
  onToggleCollapse: (unit: SequentialCurriculumUnit) => void
  onLockedClick: (title: string) => void
  onStartLesson: (route: string) => void
}

/**
 * CurriculumAccordionView
 * Structured Syllabus View presenting units as collapsible 3D cards.
 */
export const CurriculumAccordionView: FC<CurriculumAccordionViewProps> = ({
  units,
  isLoading,
  isUnitCollapsed,
  onToggleCollapse,
  onLockedClick,
  onStartLesson,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs font-semibold animate-pulse shadow-xs">
        Memuat silabus kurikulum bahasa...
      </div>
    )
  }

  if (units.length === 0) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs font-semibold shadow-xs">
        Belum ada unit kurikulum yang tersedia untuk level ini.
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-1">
      {units.map((unit) => (
        <CurriculumUnitCard
          key={unit.id}
          unit={unit}
          isCollapsed={isUnitCollapsed(unit)}
          onToggleCollapse={() => onToggleCollapse(unit)}
          onLockedClick={onLockedClick}
          onStartLesson={onStartLesson}
        />
      ))}
    </div>
  )
}
