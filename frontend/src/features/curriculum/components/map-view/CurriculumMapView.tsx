import { useEffect, useMemo, useRef, useState, type FC } from 'react'
import { ArrowUp, CaretDown, Crosshair, ListNumbers } from '@phosphor-icons/react'
import type { CurriculumResponse } from "@/features/curriculum/types/curriculum"
import { useCurriculumMapView } from "@/features/curriculum/hooks/useCurriculumMapView"
import { MAP_STAGE_TOKENS } from "@/features/curriculum/tokens/curriculumTokens"
import type { GuestLoginPromptReason } from '@/features/auth/components/GuestLoginPromptModal'
import { CurriculumNodeDetailModal } from './CurriculumNodeDetailModal'
import { CurriculumMapUnitSection } from './CurriculumMapUnitSection'

export interface CurriculumMapViewProps {
  className?: string
  curriculum?: CurriculumResponse | null
  isLoading?: boolean
  hasError?: boolean
  isGuest?: boolean
  isViewingInactiveTrack?: boolean
  isActivatingTrack?: boolean
  onActivateTrack?: () => void
  onStartLesson?: (route: string) => void
  onOpenGuestUnlock?: (reason: GuestLoginPromptReason) => void
}

const computeInitialVisibleCount = (totalUnits: number, activeUnitIndex: number): number =>
  Math.max(5, Math.min(totalUnits, activeUnitIndex >= 0 ? activeUnitIndex + 2 : 5))

/**
 * CurriculumMapView
 * Interactive Duolingo 3D Serpentine Path view powered directly by backend CurriculumResponse.
 */
export const CurriculumMapView: FC<CurriculumMapViewProps> = ({
  className = '',
  curriculum = null,
  isLoading = false,
  hasError = false,
  isGuest = false,
  isViewingInactiveTrack = false,
  isActivatingTrack = false,
  onActivateTrack,
  onStartLesson,
  onOpenGuestUnlock,
}) => {
  const {
    units,
    activeModalNode,
    handleNodeClick,
    handleCloseModal,
  } = useCurriculumMapView({ curriculum })

  const activeUnit = useMemo(() => {
    const withActiveNode = units.find((u) => u.parts.some((p) => p.status === 'active'))
    if (withActiveNode) return withActiveNode
    const unlockedUnits = units.filter((u) =>
      u.parts.some((p) => p.status !== 'locked')
    )
    return unlockedUnits[unlockedUnits.length - 1] ?? units[0] ?? null
  }, [units])

  const activeUnitIndex = useMemo(() => {
    if (!activeUnit) return -1
    return units.findIndex((u) => u.id === activeUnit.id)
  }, [units, activeUnit])

  // Render-time reset whenever curriculum language/level/unit count changes (React 19 safe, no setState in useEffect)
  const batchResetKey = `${curriculum?.language?.code ?? ''}:${curriculum?.level?.code ?? ''}:${units.length}`
  const [prevBatchKey, setPrevBatchKey] = useState(batchResetKey)
  const [visibleCount, setVisibleCount] = useState(() =>
    computeInitialVisibleCount(units.length, activeUnitIndex)
  )

  if (prevBatchKey !== batchResetKey) {
    setPrevBatchKey(batchResetKey)
    setVisibleCount(computeInitialVisibleCount(units.length, activeUnitIndex))
  }

  const effectiveVisibleCount = Math.min(visibleCount, units.length)
  const visibleUnits = useMemo(
    () => units.slice(0, effectiveVisibleCount),
    [units, effectiveVisibleCount]
  )

  const [showFloatingNav, setShowFloatingNav] = useState(false)
  const [isQuickJumpOpen, setIsQuickJumpOpen] = useState(false)
  const quickNavRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleScroll = () => {
      const shouldShow = window.scrollY > 360
      setShowFloatingNav(shouldShow)
      if (!shouldShow) {
        setIsQuickJumpOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isQuickJumpOpen) return
    const handlePointerDown = (event: MouseEvent) => {
      if (quickNavRef.current && !quickNavRef.current.contains(event.target as Node)) {
        setIsQuickJumpOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsQuickJumpOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isQuickJumpOpen])

  const scrollToUnit = (unitNumber: number) => {
    if (typeof document === 'undefined') return
    const targetIndex = units.findIndex((u) => u.unitNumber === unitNumber)
    if (targetIndex >= effectiveVisibleCount) {
      setVisibleCount(targetIndex + 1)
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          const target = document.getElementById(`unit-section-${unitNumber}`)
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 60)
      })
      return
    }
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

  const scrollToTop = () => {
    if (typeof window === 'undefined') return
    setIsQuickJumpOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const remainingUnitsCount = Math.max(0, units.length - effectiveVisibleCount)
  const batchProgressPercent =
    units.length > 0 ? Math.round((effectiveVisibleCount / units.length) * 100) : 0

  return (
    <div className={`space-y-8 sm:space-y-12 select-none ${className}`}>
      {/* ── INTERACTIVE LESSON MODAL ── */}
      <CurriculumNodeDetailModal
        node={activeModalNode}
        onClose={handleCloseModal}
        onStartLesson={onStartLesson}
        isGuest={isGuest}
        onOpenGuestUnlock={onOpenGuestUnlock}
        isViewingInactiveTrack={isViewingInactiveTrack}
        isActivatingTrack={isActivatingTrack}
        onActivateTrack={onActivateTrack}
      />

      {/* ── QUICK UNIT & ACTIVE LESSON JUMP BAR ── */}
      {units.length > 1 && !hasError && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white border-2 border-slate-200/90 rounded-2xl p-3 sm:px-3.5 sm:py-2.5 shadow-[0_3px_0_0_#E2E8F0]">
          <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto sm:flex-1">
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
              className="w-full sm:max-w-xs truncate rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 sm:py-1.5 text-xs font-brand font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-brand font-black text-blue-700 transition-colors cursor-pointer shrink-0"
            >
              <Crosshair weight="bold" className="w-3.5 h-3.5" />
              <span>Lompat ke Aktif · Unit {activeUnit.unitNumber}</span>
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
                Pilih atau aktifkan bahasa targetmu lewat pilihan bahasa di atas.
              </p>
            </div>
          ) : (
            <>
              {visibleUnits.map((unit) => (
                <CurriculumMapUnitSection
                  key={unit.id}
                  unit={unit}
                  onNodeClick={handleNodeClick}
                  onStartLesson={onStartLesson}
                />
              ))}

              {/* ── PROGRESSIVE UNIT BATCHING FOOTER ── */}
              {effectiveVisibleCount < units.length && (
                <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-[0_4px_0_0_#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 min-w-0">
                    <p className="font-brand font-black text-sm text-slate-800">
                      Menampilkan {effectiveVisibleCount} dari {units.length} unit
                    </p>
                    <div className="w-full sm:w-56 h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/80">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${batchProgressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((c) => Math.min(units.length, c + 5))
                      }
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-700 shadow-[0_3px_0_0_#1D4ED8] text-xs font-brand font-black transition-all active:translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <CaretDown weight="bold" className="w-3.5 h-3.5 shrink-0" />
                      <span>Tampilkan 5 Unit Berikutnya</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibleCount(units.length)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border-2 border-slate-200 shadow-[0_3px_0_0_#E2E8F0] text-xs font-brand font-black transition-all active:translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <span>Tampilkan Semua ({remainingUnitsCount} lagi)</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── FLOATING QUICK-NAV BAR (Sticky Centered in Curriculum Column) ── */}
      {showFloatingNav && units.length > 1 && !hasError && (
        <div
          ref={quickNavRef}
          className="sticky bottom-20 md:bottom-5 z-30 flex flex-col items-center pointer-events-none pt-2"
        >
          {isQuickJumpOpen && (
            <div
              role="dialog"
              aria-label="Daftar lompat unit"
              className="pointer-events-auto mb-2.5 w-72 sm:w-80 max-h-72 overflow-y-auto bg-white border-2 border-blue-200 rounded-2xl shadow-[0_6px_0_0_#DBEAFE,0_16px_32px_-8px_rgba(15,23,42,0.18)] p-2 space-y-1"
            >
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100">
                <span className="font-brand font-black text-xs text-slate-800">
                  Lompat ke Unit
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  1–{units.length}
                </span>
              </div>
              <div className="space-y-0.5">
                {units.map((u) => {
                  const doneCount = u.parts.filter((p) => p.status === 'completed').length
                  const isAllCompleted = u.parts.length > 0 && doneCount === u.parts.length
                  const hasActivePart = u.parts.some((p) => p.status === 'active')
                  const isUnlocked = u.parts.some((p) => p.status !== 'locked')

                  const statusDotClass = isAllCompleted
                    ? 'bg-emerald-500'
                    : hasActivePart
                      ? 'bg-blue-600'
                      : isUnlocked
                        ? 'bg-amber-400'
                        : 'bg-slate-300'

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        scrollToUnit(u.unitNumber)
                        setIsQuickJumpOpen(false)
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                        hasActivePart
                          ? 'bg-blue-50/80 hover:bg-blue-100/80 text-blue-900'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${statusDotClass}`}
                          aria-hidden="true"
                        />
                        <span className="text-xs font-brand font-black shrink-0">
                          Unit {u.unitNumber}
                        </span>
                        <span className="text-xs font-medium text-slate-500 truncate">
                          {u.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 shrink-0 tabular-nums">
                        {doneCount}/{u.parts.length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="pointer-events-auto bg-white/95 backdrop-blur-md border-2 border-blue-200 rounded-2xl p-1.5 shadow-[0_4px_0_0_#DBEAFE,0_12px_24px_-6px_rgba(37,99,235,0.18)] flex items-center gap-1">
            <button
              type="button"
              aria-expanded={isQuickJumpOpen}
              onClick={() => setIsQuickJumpOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-brand font-black transition-all active:translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isQuickJumpOpen
                  ? 'bg-blue-700 text-white shadow-[0_2px_0_0_#1E40AF]'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_2px_0_0_#1D4ED8]'
              }`}
            >
              <ListNumbers weight="bold" className="w-4 h-4 shrink-0" />
              <span>Lompat Unit</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsQuickJumpOpen(false)
                scrollToActiveLesson()
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-brand font-black transition-all active:translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Crosshair weight="bold" className="w-4 h-4 shrink-0" />
              <span>Aktif</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Kembali ke atas"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-brand font-black transition-all active:translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ArrowUp weight="bold" className="w-4 h-4 shrink-0" />
              <span>Atas</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
