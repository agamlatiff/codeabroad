import type { FC } from 'react'
import type { CurriculumResponse } from "@/features/curriculum/types/curriculum"
import { useCurriculumMapView } from "@/features/curriculum/hooks/useCurriculumMapView"
import { MAP_STAGE_TOKENS } from "@/features/curriculum/tokens/curriculumTokens"
import { CurriculumNodeDetailModal } from './CurriculumNodeDetailModal'
import { CurriculumMapUnitSection } from './CurriculumMapUnitSection'

export interface CurriculumMapViewProps {
  className?: string
  curriculum?: CurriculumResponse | null
  isLoading?: boolean
  onStartLesson?: (route: string) => void
}

/**
 * CurriculumMapView
 * Interactive Duolingo 3D Serpentine Path view powered directly by backend CurriculumResponse.
 */
export const CurriculumMapView: FC<CurriculumMapViewProps> = ({
  className = '',
  curriculum = null,
  isLoading = false,
  onStartLesson,
}) => {
  const {
    units,
    activeModalNode,
    handleNodeClick,
    handleCloseModal,
  } = useCurriculumMapView({ curriculum })

  if (isLoading && !curriculum) {
    return (
      <div className={MAP_STAGE_TOKENS.canvasContainer}>
        {[1, 2].map((skeletonIdx) => (
          <div
            key={skeletonIdx}
            className="h-64 rounded-2xl bg-slate-100/80 border-2 border-slate-200 animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-12 sm:space-y-16 select-none ${className}`}>
      {/* ── INTERACTIVE LESSON MODAL ── */}
      <CurriculumNodeDetailModal
        node={activeModalNode}
        onClose={handleCloseModal}
        onStartLesson={onStartLesson}
      />

      {/* ── UNIFIED ADVENTURE GAME STAGE ── */}
      <div className={MAP_STAGE_TOKENS.canvasContainer}>
        {units.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <h3 className="font-brand font-black text-base text-slate-800">
              Kurikulum Bahasa Belum Tersedia
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Pilih atau aktifkan bahasa target Anda melalui menu pengalih kurikulum di atas.
            </p>
          </div>
        ) : (
          units.map((unit) => (
            <CurriculumMapUnitSection
              key={unit.id}
              unit={unit}
              onNodeClick={handleNodeClick}
              onStartLesson={onStartLesson}
            />
          ))
        )}
      </div>
    </div>
  )
}
