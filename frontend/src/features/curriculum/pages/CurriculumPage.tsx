import { LockSimple, Sparkle, WarningCircle } from '@phosphor-icons/react'
import { AppLeftSidebar } from "@/shared/components/layout/left-sidebar/AppLeftSidebar"
import { AppTopBar } from "@/shared/components/layout/top-bar/AppTopBar"
import { AppRightSidebar } from "@/shared/components/layout/right-sidebar/AppRightSidebar"
import { TrackSwitcherModal } from "@/shared/components/layout/top-bar/TrackSwitcherModal"
import { Button3D } from "@/shared/components/ui/Button3D"
import { CurriculumMapView } from "@/features/curriculum/components/map-view/CurriculumMapView"
import { useCurriculumPage } from "@/features/curriculum/hooks/useCurriculumPage"

/**
 * CurriculumPage (SSOT Master Language Learning Screen)
 * Declarative learning hub hosting the Interactive Peta Belajar Map View,
 * Grammar Reference modal, and enrolled Language Switcher powered by backend Curriculum APIs.
 */
export const CurriculumPage = () => {
  const { curriculum, status, modals, actions } = useCurriculumPage()
  const activeLanguage = curriculum.data?.language

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. LEFT COMPACT NAV RAIL (SSOT) ── */}
      <AppLeftSidebar />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8 xl:pb-0">
        {/* ══════ CENTER CONTENT STAGE ══════ */}
        <main className="flex-1 min-w-0 px-3.5 sm:px-8 py-5 sm:py-6 pb-12 space-y-6">
          {/* ── CONTEXTUAL TOP BAR ── */}
          <AppTopBar
            activeTrack={curriculum.currentLanguageId}
            onOpenCourseSwitcher={actions.openSwitcher}
            onOpenMobileSidebar={() => actions.setIsMobileDrawerOpen(true)}
            completedCount={curriculum.metrics.completedLessonsCount}
            totalCount={curriculum.metrics.totalLessonsCount}
            progressPercent={curriculum.metrics.overallProgress}
            unitLabel="Lesson"
            breadcrumbs={[
              { label: 'Beranda', to: '/curriculum' },
              { label: 'Kurikulum' },
              ...(curriculum.data?.level?.code
                ? [{ label: `JLPT ${curriculum.data.level.code}` }]
                : []),
            ]}
          />

          {/* ── INACTIVE LANGUAGE ACTIVATION BANNER ── */}
          {curriculum.isViewingInactiveTrack && activeLanguage && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5 min-w-0">
                <Sparkle weight="fill" className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-brand font-black text-xs sm:text-sm text-amber-950">
                    Sedang Mempratinjau Kurikulum {activeLanguage.name}
                  </p>
                  <p className="text-xs text-amber-800 font-medium">
                    Aktifkan bahasa ini untuk membuka akses latihan dan menyimpan progres harian Anda.
                  </p>
                </div>
              </div>
              <Button3D
                variant="amber"
                size="sm"
                onClick={actions.handleActivateCurrentTrack}
                disabled={status.isSwitchingLanguage}
                className="shrink-0 text-xs"
              >
                {status.isSwitchingLanguage ? 'Mengaktifkan...' : 'Aktifkan Bahasa Ini'}
              </Button3D>
            </div>
          )}

          {/* ── NETWORK ERROR BANNER ── */}
          {status.error && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 text-rose-800 flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <WarningCircle weight="fill" className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="text-xs font-semibold">{status.error}</span>
              </div>
              <button
                type="button"
                onClick={actions.refetch}
                className="min-h-[44px] px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs shrink-0"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* ── PETA BELAJAR ── */}
          <CurriculumMapView
            curriculum={curriculum.data}
            isLoading={status.isLoading}
            hasError={Boolean(status.error)}
            isViewingInactiveTrack={curriculum.isViewingInactiveTrack}
            isActivatingTrack={status.isSwitchingLanguage}
            onActivateTrack={actions.handleActivateCurrentTrack}
            onStartLesson={actions.handleStartLesson}
          />
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (SSOT) ══════ */}
        <AppRightSidebar
          activeTrack={curriculum.currentLanguageId}
          isMobileDrawerOpen={modals.isMobileDrawerOpen}
          onCloseMobileDrawer={() => actions.setIsMobileDrawerOpen(false)}
        />
      </div>

      {/* ── LANGUAGE SWITCHER MODAL ── */}
      <TrackSwitcherModal
        isOpen={modals.isSwitcherOpen && curriculum.enrollments.length >= 2}
        onClose={actions.closeSwitcher}
        currentTrack={curriculum.currentLanguageId}
        onSelectTrack={actions.handleSelectLanguage}
        trackProgressMap={curriculum.metrics.trackProgressMap}
      />

      {/* ── TOAST NOTIFICATION ── */}
      {status.notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-md">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <LockSimple weight="bold" className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">{status.notification}</span>
        </div>
      )}
    </div>
  )
}

