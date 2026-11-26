import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useIsMutating } from '@tanstack/react-query'
import { Check, X, RocketLaunch, Translate, LockSimple } from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { SWITCH_LANGUAGE_MUTATION_KEY } from '@/shared/constants/queryKeys'
import { triggerHaptic } from '@/shared/utils/haptics'
import type { CareerTrackOption } from '@/features/curriculum/types/curriculum'
import { useCurriculumSwitcherModal } from '@/features/curriculum/hooks/useCurriculumSwitcherModal'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'

export interface TrackSwitcherModalProps {
  isOpen: boolean
  onClose: () => void
  currentTrack: string
  onSelectTrack: (trackIdOrSlug: string) => void | Promise<boolean | void>
  trackProgressMap?: Record<string, { completed: number; total: number }>
}

interface TrackSwitcherDialogProps extends Omit<TrackSwitcherModalProps, 'isOpen'> {
  trackOptions: CareerTrackOption[]
  isLoading: boolean
}

const TrackSwitcherDialog = ({
  onClose,
  currentTrack,
  onSelectTrack,
  trackProgressMap,
  trackOptions,
  isLoading,
}: TrackSwitcherDialogProps) => {
  const [selectedTrack, setSelectedTrack] = useState<string>(currentTrack)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)
  const isMutatingLanguage = useIsMutating({ mutationKey: SWITCH_LANGUAGE_MUTATION_KEY }) > 0
  const isBusy = isSubmitting || isMutatingLanguage

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isBusy) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isBusy, onClose])

  const handleConfirm = async () => {
    if (isBusy || submittingRef.current) return
    triggerHaptic('success')
    const selectedOption = trackOptions.find(
      (t) => t.slug === selectedTrack || t.id === selectedTrack
    )
    const targetIdentifier = selectedOption ? selectedOption.id : selectedTrack
    const shouldActivatePreview = Boolean(selectedOption && !selectedOption.isActive)
    if (targetIdentifier && (targetIdentifier !== currentTrack || shouldActivatePreview)) {
      submittingRef.current = true
      setIsSubmitting(true)
      try {
        const result = await onSelectTrack(targetIdentifier)
        if (result !== false) {
          onClose()
        }
      } finally {
        submittingRef.current = false
        setIsSubmitting(false)
      }
      return
    }
    onClose()
  }

  const enrolledLanguages = trackOptions.filter((t) => t.isEnrolled !== false)
  const catalogLanguages = trackOptions.filter((t) => t.isEnrolled === false)

  const renderTrackCard = (track: CareerTrackOption) => {
    const isUnenrolled = track.isEnrolled === false
    const isCurrent = track.slug === currentTrack || track.id === currentTrack
    const isSelected = track.slug === selectedTrack || track.id === selectedTrack
    const stats = trackProgressMap?.[track.slug] || trackProgressMap?.[track.id]
    const completed = stats?.completed ?? 0
    const total = stats?.total ?? 0
    const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0

    return (
      <button
        key={track.id}
        type="button"
        disabled={isBusy}
        aria-pressed={isSelected}
        onClick={() => {
          triggerHaptic('tap')
          setSelectedTrack(track.id)
        }}
        className={`group text-left rounded-2xl p-4 border-2 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-65 flex flex-col justify-between gap-3 ${
          isSelected
            ? 'bg-blue-50/70 border-[#2563EB] shadow-sm -translate-y-0.5'
            : isUnenrolled
              ? 'bg-slate-50/70 enabled:hover:bg-white border-slate-200 enabled:hover:border-blue-300'
              : 'bg-white enabled:hover:bg-slate-50 border-slate-200 enabled:hover:border-blue-300'
        }`}
      >
        <div className="flex items-start justify-between gap-2 w-full">
          <div className="w-14 h-10 rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
            <LanguageFlagIllustration code={track.languageCode} className="w-full h-full object-contain" />
          </div>

          {isSelected ? (
            <span className="bg-emerald-100 border border-emerald-200 text-emerald-700 font-brand font-black text-[11px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0">
              <Check weight="bold" className="w-3 h-3" />
              <span>{isCurrent ? 'Aktif' : 'Dipilih'}</span>
            </span>
          ) : isUnenrolled ? (
            <span className="bg-slate-100 text-slate-600 font-brand font-bold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0">
              <LockSimple weight="bold" className="w-2.5 h-2.5 text-blue-600" />
              <span>Daftar</span>
            </span>
          ) : null}
        </div>

        <div className="min-w-0 w-full">
          <h4 className="font-brand font-black text-base text-slate-900 truncate">
            {track.title}
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
            {track.subtitle}
          </p>
        </div>

        {total > 0 && (
          <div className="w-full space-y-1.5 pt-1">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
              <div
                className={`h-full rounded-full transition-all ${
                  isSelected ? 'bg-[#2563EB]' : 'bg-slate-300'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              {completed}/{total} Lesson ({percent}%)
            </div>
          </div>
        )}
      </button>
    )
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ganti Bahasa"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none"
    >
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!isBusy) onClose()
        }}
      />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-200/90 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-pop">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Translate weight="bold" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-brand font-black text-lg text-slate-900">
                Ganti Bahasa
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Progres tiap bahasa tersimpan terpisah.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isBusy}
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-full bg-slate-100 enabled:hover:bg-slate-200 enabled:active:scale-95 text-slate-500 enabled:hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Tutup popup ganti bahasa"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
          {isLoading && enrolledLanguages.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
          ) : enrolledLanguages.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">
              Belum ada bahasa terdaftar yang ditemukan.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {enrolledLanguages.map(renderTrackCard)}
            </div>
          )}

          {catalogLanguages.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-brand font-black uppercase tracking-wider text-slate-500 block">
                Bahasa Lainnya
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {catalogLanguages.map(renderTrackCard)}
              </div>
            </div>
          )}

          {!isLoading && catalogLanguages.length === 0 && enrolledLanguages.length <= 1 && (
            <p className="text-xs text-slate-500 text-center pt-2 border-t border-slate-100">
              Bahasa destinasi tambahan sedang disiapkan dan akan segera hadir.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
          <Button3D
            variant="blue"
            size="md"
            loading={isBusy}
            loadingText="Mengganti Bahasa..."
            disabled={isBusy || (isLoading && enrolledLanguages.length === 0)}
            icon={<RocketLaunch weight="bold" className="w-4 h-4" />}
            onClick={() => void handleConfirm()}
            className="w-full sm:w-auto text-sm px-6 py-2.5 font-brand font-black"
          >
            Mulai Belajar
          </Button3D>
        </div>
      </div>
    </div>,
    document.body
  )
}

/** Language Switcher Modal for enrolled target languages (shown only when 2+ languages exist). */
export const TrackSwitcherModal = ({
  isOpen,
  onClose,
  currentTrack,
  onSelectTrack,
  trackProgressMap,
}: TrackSwitcherModalProps) => {
  const { trackOptions: languageOptions, isLoading } = useCurriculumSwitcherModal({
    enabled: isOpen,
    onSelectTrack,
    onClose,
  })

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  return (
    <TrackSwitcherDialog
      key={`language-${currentTrack}`}
      onClose={onClose}
      currentTrack={currentTrack}
      onSelectTrack={onSelectTrack}
      trackProgressMap={trackProgressMap}
      trackOptions={languageOptions}
      isLoading={isLoading}
    />
  )
}
