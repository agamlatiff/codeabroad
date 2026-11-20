import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkle } from '@phosphor-icons/react'
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
        isViewingInactiveTrack={isViewingInactiveTrack}
        isActivatingTrack={isActivatingTrack}
        onActivateTrack={onActivateTrack}
      />

      {/* ── UNIFIED ADVENTURE GAME STAGE ── */}
      {units.length === 0 && hasError ? null : (
        <div className={MAP_STAGE_TOKENS.canvasContainer}>
          {/* ── FONDASI ALFABET BANNER (HINGGA PEMULA BISA BELAJAR HIRAGANA/KATAKANA DULU) ── */}
          {units.length > 0 && (!curriculum?.language?.code || curriculum.language.code === 'ja') && (
            <Link
              to="/kana/hiragana"
              className="group block w-full rounded-2xl border-2 border-emerald-200/90 bg-gradient-to-r from-emerald-50 via-white to-teal-50/80 hover:border-emerald-400 hover:shadow-md transition-all p-4 sm:px-5 sm:py-4 shadow-[0_3px_0_0_rgba(16,185,129,0.14)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white border-b-4 border-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                    <span className="font-brand font-black text-2xl leading-none">あ</span>
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-[10px] font-brand font-black uppercase tracking-wider text-emerald-700">
                        <Sparkle weight="fill" className="w-3 h-3" />
                        ALFABET • WAJIB PEMULA
                      </span>
                    </div>
                    <h3 className="font-brand font-black text-sm sm:text-base text-slate-900 leading-snug">
                      Belajar Huruf Dasar (Hiragana & Katakana)
                    </h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Belum hafal あ・い・う atau ア・イ・ウ? Pelajari suara, trik ingat, dan latihan menulis dulu sebelum kuis.
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white font-brand font-black text-xs border-b-4 border-emerald-800 shrink-0 transition-colors self-start sm:self-center whitespace-nowrap">
                  Buka Tabel Aksara
                  <ArrowRight weight="bold" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          )}

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
    </div>
  )
}
