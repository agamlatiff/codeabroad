import { useEffect, useMemo, useState, type FC } from 'react'
import { Crosshair, ListNumbers } from '@phosphor-icons/react'
import type { CurriculumResponse } from "@/features/curriculum/types/curriculum"
import { useCurriculumMapView } from "@/features/curriculum/hooks/useCurriculumMapView"
import { MAP_STAGE_TOKENS } from "@/features/curriculum/tokens/curriculumTokens"
import { CurriculumNodeDetailModal } from './CurriculumNodeDetailModal'
import { CurriculumMapUnitSection } from './CurriculumMapUnitSection'

export interface CurriculumMapViewProps {
  className?: string
  curriculum?: CurriculumResponse | null
  isLoading?: boolean
  hasError?: boolean
  isViewingInactiveTrack?: boolean
  isActivatingTrack?: boolean
  onActivateTrack?: () => void
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
  hasError = false,
  isViewingInactiveTrack = false,
  isActivatingTrack = false,
  onActivateTrack,
  onStartLesson,
}) => {
  const {
    units,
    activeModalNode,
    handleNodeClick,
    handleCloseModal,
  } = useCurriculumMapView({ curriculum })

  const [showFloatingJump, setShowFloatingJump] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => {
      setShowFloatingJump(window.scrollY > 420)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const activeUnit = useMemo(() => {
    const withActiveNode = units.find((u) => u.parts.some((p) => p.status === 'active'))
    if (withActiveNode) return withActiveNode
    const unlockedUnits = units.filter((u) =>
      u.parts.some((p) => p.status !== 'locked')
    )
    return unlockedUnits[unlockedUnits.length - 1] ?? units[0] ?? null
  }, [units])

  const scrollToUnit = (unitNumber: number) => {
    if (typeof document === 'undefined') return
    const target = document.getElementById(`unit-section-${unitNumber}`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToActiveLesson = () => {
    if (typeof document === 'undefined') return
    const activeEl = document.querySelector('[data-tour="active-lesson-node"]')
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    if (activeUnit) {
      scrollToUnit(activeUnit.unitNumber)
    }
  }

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
    <div className={`space-y-8 sm:space-y-12 select-none ${className}`}>
      {/* ── INTERACTIVE LESSON MODAL ── */}
      <CurriculumNodeDetailModal
        node={activeModalNode}
        onClose={handleCloseModal}
        onStartLesson={onStartLesson}
        isViewingInactiveTrack={isViewingInactiveTrack}
        isActivatingTrack={isActivatingTrack}
        onActivateTrack={onActivateTrack}
      />

      {/* ── QUICK UNIT & ACTIVE LESSON JUMP BAR ── */}
      {units.length > 1 && !hasError && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white border-2 border-slate-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_3px_0_0_#E2E8F0]">
          <div className="flex items-center gap-2 min-w-0">
            <ListNumbers weight="bold" className="w-4 h-4 text-blue-600 shrink-0" />
            <label htmlFor="map-unit-jump-select" className="sr-only">
              Pilih Unit Kurikulum
            </label>
            <select
              id="map-unit-jump-select"
              aria-label="Pilih Unit Kurikulum"
              value=""
              onChange={(e) => {
                const unitNo = Number.parseInt(e.target.value, 10)
                if (Number.isFinite(unitNo)) {
                  scrollToUnit(unitNo)
                }
              }}
              className="max-w-[230px] sm:max-w-xs truncate rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-brand font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="" disabled>
                Lompat ke Unit (1–{units.length})...
              </option>
              {units.map((u) => {
                const doneCount = u.parts.filter((p) => p.status === 'completed').length
                return (
                  <option key={u.id} value={u.unitNumber}>
                    Unit {u.unitNumber}: {u.title} ({doneCount}/{u.parts.length})
                  </option>
                )
              })}
            </select>
          </div>

          {activeUnit && (
            <button
              type="button"
              onClick={scrollToActiveLesson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-brand font-black text-blue-700 transition-colors cursor-pointer shrink-0"
            >
              <Crosshair weight="bold" className="w-3.5 h-3.5" />
              <span>Lompat ke Aktif • Unit {activeUnit.unitNumber}</span>
            </button>
          )}
        </div>
      )}

      {/* ── UNIFIED ADVENTURE GAME STAGE ── */}
      {units.length === 0 && hasError ? null : (
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
      )}

      {/* ── FLOATING QUICK RETURN TO ACTIVE LESSON WHEN SCROLLED ── */}
      {showFloatingJump && activeUnit && !hasError && (
        <button
          type="button"
          onClick={scrollToActiveLesson}
          className="fixed bottom-24 md:bottom-6 right-5 z-30 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-700 shadow-lg text-xs font-brand font-black transition-all active:scale-95 cursor-pointer"
        >
          <Crosshair weight="bold" className="w-4 h-4" />
          <span>Ke Pelajaran Aktif</span>
        </button>
      )}
    </div>
  )
}
