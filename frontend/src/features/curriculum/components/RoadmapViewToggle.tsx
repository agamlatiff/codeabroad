import { type FC } from 'react'
import {
  MapTrifold,
  ListBullets,
  SpeakerHigh,
  SpeakerLow,
  SpeakerSimpleSlash,
} from '@phosphor-icons/react'
import { triggerHaptic } from "@/shared/utils/haptics"
import { VIEW_TOGGLE_TOKENS } from "@/features/curriculum/tokens/roadmapTokens"
import { useAudioStore } from "@/shared/store/audioStore"

export type CurriculumViewMode = 'map' | 'syllabus'

export interface RoadmapViewToggleProps {
  viewMode: CurriculumViewMode
  onChangeViewMode: (mode: CurriculumViewMode) => void
  totalUnitsCount?: number
}

/**
 * RoadmapViewToggle
 * Duolingo 3D Tactile Segmented Control to switch between
 * Interactive RPG Path Map (Yamanote Line) and Structured Syllabus Cards,
 * equipped with an interactive 3D Audio Soundscape mode cycler.
 */
export const RoadmapViewToggle: FC<RoadmapViewToggleProps> = ({
  viewMode,
  onChangeViewMode,
  totalUnitsCount,
}) => {
  const audioMode = useAudioStore((s) => s.audioMode)
  const cycleAudioMode = useAudioStore((s) => s.cycleAudioMode)

  const handleSelect = (mode: CurriculumViewMode) => {
    if (mode === viewMode) return
    triggerHaptic('tap')
    onChangeViewMode(mode)
  }

  const handleCycleAudio = () => {
    triggerHaptic('tap')
    cycleAudioMode()
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

      {/* Right Controls: Segmented View Switcher & 3D Audio Mode Cycler */}
      <div className="flex items-center gap-2">
        {/* 1. Tactile 3D Segmented Control */}
        <div className={VIEW_TOGGLE_TOKENS.container}>
          {/* 1a. Mode Peta Button */}
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

          {/* 1b. Mode Silabus Button */}
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

        {/* 2. Tactile 3D Audio Soundscape Mode Button */}
        <button
          type="button"
          onClick={handleCycleAudio}
          className="h-9 px-2.5 sm:px-3 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-blue-400 shadow-[0_2px_0_0_#CBD5E1] active:shadow-none active:translate-y-0.5 text-xs font-brand font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          title={`Mode Suara: ${
            audioMode === 'all'
              ? 'Musik Suasana & Efek Suara Aktif (Klik untuk ubah)'
              : audioMode === 'sfx_only'
              ? 'Efek Suara Saja (Klik untuk bisukan)'
              : 'Semua Suara Dibisukan (Klik untuk nyalakan)'
          }`}
        >
          {audioMode === 'all' && (
            <>
              <SpeakerHigh weight="fill" className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-[11px] text-emerald-700 hidden sm:inline">BGM & SFX</span>
            </>
          )}
          {audioMode === 'sfx_only' && (
            <>
              <SpeakerLow weight="bold" className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] text-blue-700 hidden sm:inline">SFX Saja</span>
            </>
          )}
          {audioMode === 'muted' && (
            <>
              <SpeakerSimpleSlash weight="bold" className="w-4 h-4 text-slate-400" />
              <span className="text-[11px] text-slate-400 hidden sm:inline">Hening</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
