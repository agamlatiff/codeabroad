import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Check,
  CaretRight,
  Sparkle,
  X,
  MapTrifold,
  ListChecks,
  RocketLaunch,
} from '@phosphor-icons/react'
import { KodiCharacter } from '../../ui/KodiCharacter'
import {
  GolangLogo,
  ReactLogo,
  DockerLogo,
  FundamentalLogo,
  TechNihongoLogo,
} from '../../ui/BrandLogos'
import { Button3D } from '../../ui/Button3D'
import { triggerHaptic } from '../../../utils/haptics'
import type { CareerTrackOption } from '../../../types/roadmap'
import { useRoadmapTrackSwitcherModal } from '../../../hooks/roadmap/useRoadmapTrackSwitcherModal'

export interface TrackSwitcherModalProps {
  isOpen: boolean
  onClose: () => void
  currentTrack: string
  onSelectTrack: (trackSlug: string) => void
  trackProgressMap?: Record<string, { completed: number; total: number }>
  viewMode?: 'map' | 'syllabus'
  onChangeViewMode?: (mode: 'map' | 'syllabus') => void
}

/**
 * TrackSwitcherModal
 * Curriculum selection and learning preference modal.
 * Allows users to choose between Universal Foundations (CS & Web Fundamental)
 * and Active Career Track Specializations (Go, React, DevOps AWS),
 * as well as selecting their preferred Roadmap View Style (RPG Path Map vs Syllabus List).
 */
export const TrackSwitcherModal = ({
  isOpen,
  onClose,
  currentTrack,
  onSelectTrack,
  trackProgressMap,
  viewMode = 'map',
  onChangeViewMode,
}: TrackSwitcherModalProps) => {
  const { trackOptions } = useRoadmapTrackSwitcherModal({
    onSelectTrack,
    onClose,
  })

  const [selectedTrack, setSelectedTrack] = useState<string>(currentTrack)
  const [selectedView, setSelectedView] = useState<'map' | 'syllabus'>(viewMode)

  useEffect(() => {
    setSelectedTrack(currentTrack)
  }, [currentTrack])

  useEffect(() => {
    if (viewMode) setSelectedView(viewMode)
  }, [viewMode])

  if (!isOpen) return null
  if (typeof document === 'undefined') return null

  const handleTrackCardClick = (track: CareerTrackOption) => {
    triggerHaptic('tap')
    setSelectedTrack(track.slug)
  }

  const handleViewModeCardClick = (mode: 'map' | 'syllabus') => {
    triggerHaptic('tap')
    setSelectedView(mode)
  }

  const handleConfirm = () => {
    triggerHaptic('success')
    if (selectedTrack !== currentTrack) {
      onSelectTrack(selectedTrack)
    }
    if (onChangeViewMode && selectedView !== viewMode) {
      onChangeViewMode(selectedView)
    }
    onClose()
  }

  const handleDismiss = () => {
    // Apply choices on dismiss/close to keep state synchronized
    if (selectedTrack !== currentTrack) {
      onSelectTrack(selectedTrack)
    }
    if (onChangeViewMode && selectedView !== viewMode) {
      onChangeViewMode(selectedView)
    }
    onClose()
  }

  const renderBrandIcon = (type: CareerTrackOption['iconType']) => {
    switch (type) {
      case 'fundamental':
        return <FundamentalLogo className="w-6 h-6" />
      case 'golang':
        return <GolangLogo className="w-7 h-5" />
      case 'frontend':
        return <ReactLogo className="w-6 h-6" />
      case 'devops':
        return <DockerLogo className="w-6 h-6" />
      case 'nihongo':
        return <TechNihongoLogo className="w-6 h-6" />
    }
  }

  const renderTrackCard = (track: CareerTrackOption) => {
    const isCurrent = track.slug === currentTrack
    const isSelected = track.slug === selectedTrack
    const stats = trackProgressMap?.[track.slug]
    const completed = stats?.completed ?? 0
    const total = stats?.total ?? 0
    const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0

    return (
      <div
        key={track.id}
        onClick={() => handleTrackCardClick(track)}
        className={`group relative rounded-2xl p-4 border-2 transition-all cursor-pointer ${
          isSelected
            ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-2 ring-blue-400/30'
            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Official Brand Logo Frame */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                isSelected
                  ? 'bg-white border-blue-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 group-hover:bg-white'
              }`}
            >
              {renderBrandIcon(track.iconType)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-brand font-black text-sm text-slate-900 truncate">
                  {track.title}
                </h4>
                {isSelected ? (
                  <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 font-brand font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check weight="bold" className="w-3 h-3" />
                    <span>{isCurrent ? 'Aktif' : 'Dipilih'}</span>
                  </span>
                ) : track.badgeVariant === 'featured' ? (
                  <span className="bg-rose-100 border border-rose-200 text-rose-700 font-brand font-black text-[10px] px-2 py-0.5 rounded-full">
                    {track.badgeLabel}
                  </span>
                ) : track.badgeVariant === 'available' ? (
                  <span className="bg-slate-100 text-slate-700 font-brand font-bold text-[10px] px-2 py-0.5 rounded-full">
                    {track.badgeLabel}
                  </span>
                ) : null}
              </div>

              <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
                {track.subtitle}
              </p>

              {/* Progress Bar (shown when progress stats are available) */}
              {total > 0 && (
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isSelected ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 shrink-0">
                    {completed}/{total} Sesi ({percent}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 pt-1 text-slate-400 group-hover:text-slate-700 transition-colors">
            <CaretRight weight="bold" className="w-4 h-4" />
          </div>
        </div>
      </div>
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in select-none">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={handleDismiss} />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl border-2 border-slate-200/90 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-pop">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Sparkle weight="fill" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-brand font-black text-base text-slate-900">
                Pilih Kurikulum & Gaya Belajar
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Kenali fondasi teknis, tentukan spesialisasi karier, dan pilih gaya belajar Anda.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* Structured Content: View Style & Curriculum Tracks */}
        <div className="p-4 sm:p-5 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
          {/* ── 1. PREFERENSI GAYA BELAJAR (VIEW MODE) ── */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-brand font-black text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
                <span>🧭</span>
                <span>PILIH GAYA BELAJAR (TAMPILAN)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Bisa diubah kapan saja
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Peta Jalur (RPG Map) */}
              <div
                onClick={() => handleViewModeCardClick('map')}
                className={`group relative rounded-2xl p-3.5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedView === 'map'
                    ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-2 ring-blue-400/30'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      selectedView === 'map'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-white'
                    }`}
                  >
                    <MapTrifold weight="bold" className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-brand font-black text-xs text-slate-900">
                        Peta Jalur (RPG)
                      </h5>
                      {selectedView === 'map' && (
                        <span className="bg-blue-100 text-blue-700 font-brand font-black text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Check weight="bold" className="w-2.5 h-2.5" />
                          <span>Dipilih</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
                      Visual berliku Yamanote Line bersama Kodi & stepping stones.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 2: Silabus Modul (Structured List) */}
              <div
                onClick={() => handleViewModeCardClick('syllabus')}
                className={`group relative rounded-2xl p-3.5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedView === 'syllabus'
                    ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-2 ring-blue-400/30'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      selectedView === 'syllabus'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-white'
                    }`}
                  >
                    <ListChecks weight="bold" className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-brand font-black text-xs text-slate-900">
                        Silabus Modul
                      </h5>
                      {selectedView === 'syllabus' && (
                        <span className="bg-blue-100 text-blue-700 font-brand font-black text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Check weight="bold" className="w-2.5 h-2.5" />
                          <span>Dipilih</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
                      Daftar unit & bab teknis akordion terstruktur rapi dan cepat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. FONDASI UTAMA (UNIVERSAL) ── */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-brand font-black text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
                <span>🧠</span>
                <span>FONDASI UTAMA (UNIVERSAL)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Wajib untuk semua engineer
              </span>
            </div>
            <div className="space-y-2.5">
              {trackOptions.filter((t) => t.group === 'foundation').map(renderTrackCard)}
            </div>
          </div>

          {/* ── 3. SPESIALISASI KARIER ANDA ── */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-brand font-black text-blue-900 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
                <span>🎯</span>
                <span>SPESIALISASI KARIER ANDA</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Dapat diubah di Pengaturan
              </span>
            </div>
            <div className="space-y-2.5">
              {trackOptions.filter((t) => t.group === 'career').map(renderTrackCard)}
            </div>
          </div>
        </div>

        {/* Footer: Kodi Tip & Primary Action Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium min-w-0 flex-1">
            <div className="shrink-0 flex items-center justify-center">
              <KodiCharacter emotion="coding" size={38} />
            </div>
            <p className="line-clamp-2">
              <span className="font-bold text-slate-900">Tips Kodi:</span> Kuasai Fondasi CS & Web, lalu selesaikan Spesialisasi Karier Anda!
            </p>
          </div>
          <Button3D
            variant="blue"
            size="md"
            icon={<RocketLaunch weight="bold" className="w-4 h-4" />}
            onClick={handleConfirm}
            className="w-full sm:w-auto text-xs px-5 py-2.5 font-brand font-black shrink-0"
          >
            Mulai Belajar
          </Button3D>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Backwards-compatible alias
export { TrackSwitcherModal as RoadmapTrackSwitcherModal }
