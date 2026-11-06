import type { FC } from 'react'
import { MapTrifold, ListBullets } from '@phosphor-icons/react'
import { triggerHaptic } from '../../utils/haptics'

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
          Tampilan Roadmap:
        </span>
        <span className="text-xs font-brand font-bold text-slate-800">
          {viewMode === 'map' ? '🗺️ Peta Petualangan RPG' : '📋 Silabus Teknis Berurutan'}
        </span>
      </div>

      {/* Right: Tactile 3D Segmented Control */}
      <div className="bg-slate-200/90 p-1 rounded-2xl border-2 border-slate-300 flex items-center gap-1 shadow-2xs">
        {/* 1. Mode Peta Button */}
        <button
          type="button"
          onClick={() => handleSelect('map')}
          className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer ${
            viewMode === 'map'
              ? 'bg-white text-blue-700 font-brand font-black border-2 border-blue-400 shadow-[0_2.5px_0_0_#93C5FD] translate-y-0'
              : 'text-slate-600 hover:text-slate-900 font-brand font-bold border-2 border-transparent hover:bg-white/50'
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
              ? 'bg-white text-blue-700 font-brand font-black border-2 border-blue-400 shadow-[0_2.5px_0_0_#93C5FD] translate-y-0'
              : 'text-slate-600 hover:text-slate-900 font-brand font-bold border-2 border-transparent hover:bg-white/50'
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
                    ? 'bg-blue-100 text-blue-800 font-black'
                    : 'bg-slate-300/70 text-slate-700 font-bold'
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

