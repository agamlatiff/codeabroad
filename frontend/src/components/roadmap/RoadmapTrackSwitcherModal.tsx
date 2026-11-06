import { createPortal } from 'react-dom'
import {
  Check,
  CaretRight,
  Sparkle,
  X,
} from '@phosphor-icons/react'
import doodleCoding from '../../assets/kodi/doodle-coding.png'
import {
  GolangLogo,
  ReactLogo,
  DockerLogo,
  FundamentalLogo,
  TechNihongoLogo,
} from '../ui/BrandLogos'
import type { CareerTrackOption } from '../../types/roadmap'
import { useRoadmapTrackSwitcherModal } from '../../hooks/roadmap/useRoadmapTrackSwitcherModal'

export interface RoadmapTrackSwitcherModalProps {
  isOpen: boolean
  onClose: () => void
  currentTrack: string
  onSelectTrack: (trackSlug: string) => void
  trackProgressMap?: Record<string, { completed: number; total: number }>
}

export const RoadmapTrackSwitcherModal = ({
  isOpen,
  onClose,
  currentTrack,
  onSelectTrack,
  trackProgressMap,
}: RoadmapTrackSwitcherModalProps) => {
  const { trackOptions, handleSelect } = useRoadmapTrackSwitcherModal({
    onSelectTrack,
    onClose,
  })

  if (!isOpen) return null
  if (typeof document === 'undefined') return null

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
    const stats = trackProgressMap?.[track.slug]
    const completed = stats?.completed ?? 0
    const total = stats?.total ?? 0
    const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0

    return (
      <div
        key={track.id}
        onClick={() => handleSelect(track)}
        className={`group relative rounded-2xl p-4 border-2 transition-all cursor-pointer ${
          isCurrent
            ? 'bg-blue-50/70 border-blue-500 shadow-xs'
            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Official Brand Logo Frame */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                isCurrent
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
                {isCurrent ? (
                  <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 font-brand font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check weight="bold" className="w-3 h-3" />
                    <span>Aktif</span>
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
                        isCurrent ? 'bg-blue-600' : 'bg-slate-300'
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
      <div className="absolute inset-0" onClick={onClose} />

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
                Pilih Kurikulum Belajar
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Fondasi Teknik Global & Program Spesialisasi Karier Anda.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* Structured Track Lists: Universal Foundations & Active Career */}
        <div className="p-4 sm:p-5 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
          {/* ── 1. FONDASI UTAMA (UNIVERSAL) ── */}
          <div className="space-y-2.5">
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

          {/* ── 2. SPESIALISASI KARIER ANDA ── */}
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

        {/* Kodi Motivational Footer Tip */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-600 font-medium">
          <img
            src={doodleCoding}
            alt="Kodi Companion"
            className="w-9 h-9 object-contain shrink-0"
          />
          <p>
            <span className="font-bold text-slate-900">Tips Kodi:</span> Pelajari Fondasi CS & Web terlebih dahulu, lalu tuntaskan Spesialisasi Karier Anda hingga siap kerja di luar negeri!
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}
