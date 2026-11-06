import type { FC } from 'react'
import { MapTrifold, ListBullets } from '@phosphor-icons/react'
import { triggerHaptic } from '../../utils/haptics'
import { VIEW_TOGGLE_TOKENS } from '../../tokens/roadmapTokens'

export type CurriculumViewMode = 'map' | 'syllabus'

export interface RoadmapViewToggleProps {
  viewMode: CurriculumViewMode
  onChangeViewMode: (mode: CurriculumViewMode) => void
  totalUnitsCount?: number
}

/**
 * RoadmapViewToggle
 * Duolingo 3D Tactile Segmented Control to switch between
 * Interactive RPG Path Map (Yamanote Line) and Structured Syllabus Cards.
 */
export const RoadmapViewToggle: FC<RoadmapViewToggleProps> = ({
  viewMode,
  onChangeViewMode,
  totalUnitsCount,
}) => {
  const handleSelect = (mode: CurriculumViewMode) => {
    if (mode === viewMode) return
    triggerHaptic('tap')
    onChangeViewMode(mode)
  }

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Left: View Mode Caption */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-brand font-black uppercase tracking-wider text-slate-500">
          Tampilan:
        </span>
        <span className="text-xs font-brand font-black text-slate-800 inline-flex items-center gap-1.5">
          {viewMode === 'map' ? (
            <>
              <MapTrifold weight="fill" className="w-3.5 h-3.5 text-blue-600" />
              <span>Peta Petualangan RPG</span>
            </>
          ) : (
            <>
              <ListBullets weight="bold" className="w-3.5 h-3.5 text-blue-600" />
              <span>Silabus Modul Terstruktur</span>
            </>
          )}
        </span>
      </div>

      {/* Right: Tactile 3D Segmented Control */}
      <div className={VIEW_TOGGLE_TOKENS.container}>
        {/* 1. Mode Peta Button */}
        <button
          type="button"
          onClick={() => handleSelect('map')}
          className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer ${
            viewMode === 'map'
              ? VIEW_TOGGLE_TOKENS.buttonActive
              : VIEW_TOGGLE_TOKENS.buttonInactive
          }`}
          title="Tampilan Peta Petualangan Stasiun Tokyo (Duolingo RPG)"
        >
          <MapTrifold
            weight={viewMode === 'map' ? 'fill' : 'bold'}
            className={`w-4 h-4 ${viewMode === 'map' ? 'text-blue-600' : 'text-slate-500'}`}
          />
          <span>Peta Jalur</span>
        </button>

        {/* 2. Mode Silabus Button */}
        <button
          type="button"
          onClick={() => handleSelect('syllabus')}
          className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer ${
            viewMode === 'syllabus'
              ? VIEW_TOGGLE_TOKENS.buttonActive
              : VIEW_TOGGLE_TOKENS.buttonInactive
          }`}
          title="Tampilan Kartu Silabus Modul Terstruktur"
        >
          <ListBullets
            weight={viewMode === 'syllabus' ? 'bold' : 'regular'}
            className={`w-4 h-4 ${viewMode === 'syllabus' ? 'text-blue-600' : 'text-slate-500'}`}
          />
          <div className="flex items-center gap-1.5">
            <span>Silabus Modul</span>
            {totalUnitsCount && totalUnitsCount > 0 ? (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  viewMode === 'syllabus'
                    ? VIEW_TOGGLE_TOKENS.badgeActive
                    : VIEW_TOGGLE_TOKENS.badgeInactive
                }`}
              >
                {totalUnitsCount}
              </span>
            ) : null}
          </div>
        </button>
      </div>
    </div>
  )
}

