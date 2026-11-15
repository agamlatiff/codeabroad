import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Check,
  CaretRight,
  Sparkle,
  X,
  MapTrifold,
  ListChecks,
  RocketLaunch,
  Translate,
  LockSimple,
} from '@phosphor-icons/react'
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"
import {
  GolangLogo,
  ReactLogo,
  DockerLogo,
  FundamentalLogo,
  TechNihongoLogo,
} from "@/shared/components/ui/BrandLogos"
import { Button3D } from "@/shared/components/ui/Button3D"
import { triggerHaptic } from "@/shared/utils/haptics"
import type { CareerTrackOption } from "@/features/curriculum/types/curriculum"
import { useCurriculumSwitcherModal } from "@/features/curriculum/hooks/useCurriculumSwitcherModal"
import { onboardingService, CAREER_PATHS_QUERY_KEY } from "@/features/onboarding/services/onboardingService"
import { useUser } from "@/features/user/hooks/useUser"
import { mapCareerPathsToTrackOptions } from "@/features/curriculum/utils/curriculumMapper"

export interface TrackSwitcherModalProps {
  isOpen: boolean
  onClose: () => void
  currentTrack: string
  onSelectTrack: (trackIdOrSlug: string) => void
  trackProgressMap?: Record<string, { completed: number; total: number }>
  viewMode?: 'map' | 'syllabus'
  onChangeViewMode?: (mode: 'map' | 'syllabus') => void
  mode?: 'language' | 'career'
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
    case 'english':
    case 'korean':
    case 'german':
    case 'mandarin':
    default:
      return <Translate weight="bold" className="w-6 h-6 text-blue-600" />
  }
}

interface TrackSwitcherDialogProps extends Omit<TrackSwitcherModalProps, 'isOpen'> {
  trackOptions: CareerTrackOption[]
}

const TrackSwitcherDialog = ({
  onClose,
  currentTrack,
  onSelectTrack,
  trackProgressMap,
  viewMode = 'map',
  onChangeViewMode,
  mode = 'career',
  trackOptions,
}: TrackSwitcherDialogProps) => {
  const [selectedTrack, setSelectedTrack] = useState<string>(currentTrack)
  const [selectedView, setSelectedView] = useState<'map' | 'syllabus'>(viewMode)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleTrackCardClick = (track: CareerTrackOption) => {
    if (track.isEnrolled === false) return
    triggerHaptic('tap')
    setSelectedTrack(mode === 'language' ? track.id : track.slug)
  }

  const handleViewModeCardClick = (nextMode: 'map' | 'syllabus') => {
    triggerHaptic('tap')
    setSelectedView(nextMode)
  }

  const handleConfirm = () => {
    triggerHaptic('success')
    const selectedOption = trackOptions.find(
      (t) => t.slug === selectedTrack || t.id === selectedTrack
    )
    const targetIdentifier =
      mode === 'language' && selectedOption ? selectedOption.id : selectedTrack
    const shouldActivatePreview = mode === 'language' && selectedOption && !selectedOption.isActive
    if (targetIdentifier && (targetIdentifier !== currentTrack || shouldActivatePreview)) {
      onSelectTrack(targetIdentifier)
    }
    if (onChangeViewMode && selectedView !== viewMode) {
      onChangeViewMode(selectedView)
    }
    onClose()
  }

  const enrolledLanguages = trackOptions.filter((t) => t.isEnrolled !== false)
  const catalogLanguages = trackOptions.filter((t) => t.isEnrolled === false)
  const foundationOptions = trackOptions.filter((t) => t.group === 'foundation')
  const specializationOptions = trackOptions.filter((t) => t.group === 'career')

  const renderTrackCard = (track: CareerTrackOption) => {
    const isUnenrolled = track.isEnrolled === false
    const isCurrent = track.slug === currentTrack || track.id === currentTrack
    const isSelected = !isUnenrolled && (track.slug === selectedTrack || track.id === selectedTrack)
    const stats = trackProgressMap?.[track.slug] || trackProgressMap?.[track.id]
    const completed = stats?.completed ?? 0
    const total = stats?.total ?? 0
    const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0

    return (
      <div
        key={track.id}
        role={isUnenrolled ? undefined : 'button'}
        tabIndex={isUnenrolled ? undefined : 0}
        aria-disabled={isUnenrolled}
        onClick={() => handleTrackCardClick(track)}
        onKeyDown={(e) => {
          if (!isUnenrolled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleTrackCardClick(track)
          }
        }}
        className={`group relative rounded-2xl p-4 border-2 transition-all ${
          isUnenrolled
            ? 'bg-slate-50/70 border-slate-200/80 opacity-65 cursor-not-allowed'
            : isSelected
              ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-2 ring-blue-400/30 cursor-pointer'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 cursor-pointer'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
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
                  <span className="bg-slate-100 text-slate-700 font-brand font-bold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    {isUnenrolled && <LockSimple weight="bold" className="w-2.5 h-2.5" />}
                    <span>{track.badgeLabel}</span>
                  </span>
                ) : null}
              </div>

              <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
                {track.subtitle}
              </p>

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
                    {completed}/{total} Lesson ({percent}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {!isUnenrolled && (
            <div className="shrink-0 pt-1 text-slate-400 group-hover:text-slate-700 transition-colors">
              <CaretRight weight="bold" className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl border-2 border-slate-200/90 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-pop">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Sparkle weight="fill" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-brand font-black text-base text-slate-900">
                {mode === 'language'
                  ? 'Pilih Bahasa & Gaya Belajar'
                  : 'Pilih Kurikulum & Gaya Belajar'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {mode === 'language'
                  ? 'Beralih antar bahasa target yang terdaftar dan atur tampilan kurikulum Anda.'
                  : 'Tentukan spesialisasi karier dan pilih gaya belajar Anda.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Tutup pengalih kurikulum"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
          {/* ── 1. VIEW MODE SELECTION ── */}
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
                      Peta langkah visual interaktif bersama Kodi & checkpoint setiap unit.
                    </p>
                  </div>
                </div>
              </div>

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
                      Daftar unit & lesson akordion terstruktur rapi dan cepat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. AVAILABLE LANGUAGES OR TRACKS ── */}
          {mode === 'language' ? (
            <>
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-brand font-black text-blue-900 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
                    <Translate weight="bold" className="w-3.5 h-3.5" />
                    <span>BAHASA TERDAFTAR ANDA</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Progres per bahasa tersimpan terpisah
                  </span>
                </div>
                <div className="space-y-2.5">
                  {enrolledLanguages.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">
                      Memuat daftar bahasa terdaftar...
                    </p>
                  ) : (
                    enrolledLanguages.map(renderTrackCard)
                  )}
                </div>
              </div>

              {catalogLanguages.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-brand font-black text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      KATALOG BAHASA LAINNYA
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Pendaftaran bahasa tambahan segera hadir
                    </span>
                  </div>
                  <div className="space-y-2.5">{catalogLanguages.map(renderTrackCard)}</div>
                </div>
              )}
            </>
          ) : (
            <>
              {foundationOptions.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-brand font-black text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
                      <span>🧠</span>
                      <span>FONDASI UTAMA</span>
                    </span>
                  </div>
                  <div className="space-y-2.5">{foundationOptions.map(renderTrackCard)}</div>
                </div>
              )}

              {specializationOptions.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-brand font-black text-blue-900 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
                      <span>🎯</span>
                      <span>SPESIALISASI</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Dapat diubah kapan saja
                    </span>
                  </div>
                  <div className="space-y-2.5">{specializationOptions.map(renderTrackCard)}</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium min-w-0 flex-1">
            <div className="shrink-0 flex items-center justify-center">
              <KodiCharacter emotion="coding" size={38} />
            </div>
            <p className="line-clamp-2">
              <span className="font-bold text-slate-900">Tips Kodi:</span>{' '}
              {mode === 'language'
                ? 'Latihan konsisten 10 menit per hari menjaga streak dan penguasaan bahasa Anda!'
                : 'Pilih jalur belajar sesuai target pekerjaan global Anda!'}
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

/**
 * TrackSwitcherModal
 * Curriculum & Language Selection Modal.
 * Supports both backend-driven target languages (`mode="language"`) and legacy career paths (`mode="career"`).
 */
export const TrackSwitcherModal = ({
  isOpen,
  onClose,
  currentTrack,
  onSelectTrack,
  trackProgressMap,
  viewMode = 'map',
  onChangeViewMode,
  mode = 'career',
}: TrackSwitcherModalProps) => {
  const { trackOptions: languageOptions } = useCurriculumSwitcherModal({
    enabled: isOpen && mode === 'language',
    onSelectTrack,
    onClose,
  })

  const { data: careerPaths = [] } = useQuery({
    queryKey: CAREER_PATHS_QUERY_KEY,
    queryFn: onboardingService.getCareerPaths,
    enabled: isOpen && mode === 'career',
    staleTime: 1000 * 60 * 10,
  })

  const { data: userData } = useUser()
  const careerOptions = mapCareerPathsToTrackOptions(careerPaths, userData.user)

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  const activeOptions = mode === 'language' ? languageOptions : careerOptions

  return (
    <TrackSwitcherDialog
      key={`${mode}-${currentTrack}-${viewMode}`}
      onClose={onClose}
      currentTrack={currentTrack}
      onSelectTrack={onSelectTrack}
      trackProgressMap={trackProgressMap}
      viewMode={viewMode}
      onChangeViewMode={onChangeViewMode}
      mode={mode}
      trackOptions={activeOptions}
    />
  )
}
