import { Link } from 'react-router-dom'
import { CheckCircle, Crown, LockSimple, Sparkle, UserPlus, WarningCircle, X } from '@phosphor-icons/react'
import { AppLeftSidebar } from "@/shared/components/layout/left-sidebar/AppLeftSidebar"
import { AppTopBar } from "@/shared/components/layout/top-bar/AppTopBar"
import { AppRightSidebar } from "@/shared/components/layout/right-sidebar/AppRightSidebar"
import { TrackSwitcherModal } from "@/shared/components/layout/top-bar/TrackSwitcherModal"
import { GuestLoginPromptModal } from "@/features/auth/components/GuestLoginPromptModal"
import { Button3D } from "@/shared/components/ui/Button3D"
import { TierUpgradeBanner } from "@/shared/components/ui/TierUpgradeBanner"
import { checkLevelAccess } from "@/shared/utils/levelAccess"
import { BUTTON_3D_TOKENS } from "@/shared/tokens/elevationTokens"
import {
  SpotlightTourOverlay,
  type SpotlightTourStep,
} from "@/shared/components/ui/SpotlightTourOverlay"
import { CurriculumMapView } from "@/features/curriculum/components/map-view/CurriculumMapView"
import { useCurriculumPage } from "@/features/curriculum/hooks/useCurriculumPage"
import { formatLevelDisplayLabel } from "@/shared/constants/languageCatalog"

const CURRICULUM_TOUR_STEPS: SpotlightTourStep[] = [
  {
    id: 'active-node',
    targetSelector: '[data-tour="active-lesson-node"]',
    badge: 'Peta Belajar',
    title: 'Mulai dari Pelajaran yang Aktif',
    description:
      'Setiap lingkaran di peta ini adalah satu pelajaran singkat. Klik lingkaran yang menyala untuk membaca materi pengantar sebelum mulai latihan.',
    mascotEmotion: 'studying',
    placement: 'bottom',
    padding: 12,
  },
  {
    id: 'nav-kana',
    targetSelector: '[data-tour="nav-kana"]',
    badge: 'Langkah 1',
    title: 'Kenali Aksara Dasar',
    description:
      'Baru mulai dari nol? Pelajari huruf Hiragana, Katakana, dan Kanji lengkap dengan audio penutur asli dan latihan cepat di menu Aksara.',
    mascotEmotion: 'explaining',
    placement: 'right',
    padding: 8,
  },
  {
    id: 'nav-flashcards',
    targetSelector: '[data-tour="nav-flashcards"]',
    badge: 'Langkah 2',
    title: 'Hafalan Cerdas dengan Flashcard',
    description:
      'Ulangi huruf dan kosakata harian memakai dek Flashcard pintar. Sistem pengingat otomatis menjadwalkan kartu sebelum kamu sempat lupa.',
    mascotEmotion: 'idea',
    placement: 'right',
    padding: 8,
  },
  {
    id: 'nav-grammar',
    targetSelector: '[data-tour="nav-grammar"]',
    badge: 'Langkah 3',
    title: 'Pahami Rumus Pola Kalimat',
    description:
      'Bingung cara menyusun kalimat? Buka menu Grammar untuk melihat rumus warna-warni, arti kata per bagian, dan kuis pemahaman singkat.',
    mascotEmotion: 'reading',
    placement: 'right',
    padding: 8,
  },
  {
    id: 'right-streak-quests',
    targetSelector: '[data-tour="right-streak-quests"]',
    badge: 'Target Harian',
    title: 'Jaga Api Streak & Misi Harian',
    description:
      'Belajar 5–15 menit setiap hari untuk menjaga streak harian dan menuntaskan Misi Harian agar bonus XP serta Gems cepat terkumpul.',
    mascotEmotion: 'onFire',
    placement: 'left',
    padding: 10,
  },
  {
    id: 'right-daily-card',
    targetSelector: '[data-tour="right-daily-card"]',
    badge: 'Kosakata Harian',
    title: 'Kartu Bahasa Harian',
    description:
      'Temukan satu kosakata praktis baru setiap hari di sini agar kosakata kerja dan sehari-hari makin menempel.',
    mascotEmotion: 'celebrate',
    placement: 'left',
    padding: 10,
  },
]

const LEVEL_TRACK_SUBLABELS: Record<string, string> = {
  N5: 'Pemula',
  N4: 'Dasar Kerja',
  N3: 'Menengah',
  N2: 'Karier · Pro',
  N1: 'Mahir · Pro',
  A1: 'Pemula',
  A2: 'Dasar',
  B1: 'Menengah',
  B2: 'TOEFL · Pro',
  C1: 'Akademik · Pro',
  C2: 'Mastery · Pro',
}

/**
 * CurriculumPage (SSOT Master Language Learning Screen)
 * Declarative learning hub hosting the Interactive Peta Belajar Map View,
 * Grammar Reference modal, and enrolled Language Switcher powered by backend Curriculum APIs.
 */
export const CurriculumPage = () => {
  const { curriculum, status, modals, actions } = useCurriculumPage()
  const activeLanguage = curriculum.data?.language

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. LEFT COMPACT NAV RAIL (SSOT) ── */}
      <AppLeftSidebar />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8 xl:pb-0">
        {/* ══════ CENTER CONTENT STAGE ══════ */}
        <main className="flex-1 min-w-0 px-3.5 sm:px-8 py-5 sm:py-6 pb-12 space-y-6">
          {/* ── CONTEXTUAL TOP BAR ── */}
          <AppTopBar
            activeTrack={curriculum.currentLanguageId}
            activeLevelCode={curriculum.selectedLevelCode}
            onOpenCourseSwitcher={actions.openSwitcher}
            onOpenMobileSidebar={() => actions.setIsMobileDrawerOpen(true)}
            completedCount={curriculum.metrics.completedLessonsCount}
            totalCount={curriculum.metrics.totalLessonsCount}
            progressPercent={curriculum.metrics.overallProgress}
            unitLabel="Pelajaran"
            breadcrumbs={[
              { label: 'Beranda', to: '/curriculum' },
              { label: 'Kurikulum' },
              ...(curriculum.data?.level?.code
                ? [{ label: formatLevelDisplayLabel(curriculum.data.level) }]
                : []),
            ]}
          />

          {/* ── CELEBRATORY TRIAL SYNC BANNER (AFTER LOGIN/REGISTER) ── */}
          {status.syncedSummary && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs animate-pop">
              <div className="flex items-start gap-2.5 min-w-0">
                <CheckCircle weight="fill" className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-brand font-black text-xs sm:text-sm text-emerald-950">
                    Progres Mode Coba Berhasil Disimpan ke Akunmu!
                  </p>
                  <p className="text-xs text-emerald-800 font-medium">
                    {status.syncedSummary.lessonsCount} pelajaran Unit 1 dan +{status.syncedSummary.xpEarned} XP sudah resmi tercatat di profilmu.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={actions.dismissSyncedSummary}
                aria-label="Tutup pemberitahuan sinkronisasi"
                className="w-8 h-8 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <X weight="bold" className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── GUEST PREVIEW MODE WELCOME BANNER ── */}
          {status.isGuest && !status.isGuestBannerDismissed && (
            <div className="bg-gradient-to-r from-blue-50 via-sky-50/75 to-white border-2 border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-2.5 min-w-0">
                <Sparkle weight="fill" className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-brand font-black text-xs sm:text-sm text-slate-900">
                    Mode Coba Tanpa Login Aktif — Unit 1 Terbuka Penuh!
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    Klik pelajaran Unit 1 di bawah untuk langsung belajar. Daftar akun gratis kapan saja untuk menyimpan XP &amp; membuka seluruh unit lanjutan.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/register?from=guest"
                  className={`${BUTTON_3D_TOKENS.base} ${BUTTON_3D_TOKENS.variants.blue} ${BUTTON_3D_TOKENS.sizes.sm} text-xs`}
                >
                  <UserPlus weight="bold" className="w-4 h-4 shrink-0" />
                  <span>Daftar Gratis</span>
                </Link>
                <button
                  type="button"
                  onClick={actions.dismissGuestBanner}
                  aria-label="Tutup banner mode coba"
                  className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
                >
                  <X weight="bold" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── INACTIVE LANGUAGE ACTIVATION BANNER ── */}
          {curriculum.isViewingInactiveTrack && activeLanguage && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5 min-w-0">
                <Sparkle weight="fill" className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-brand font-black text-xs sm:text-sm text-amber-950">
                    Sedang Melihat Kurikulum {activeLanguage.name}
                  </p>
                  <p className="text-xs text-amber-800 font-medium">
                    Aktifkan bahasa ini untuk membuka akses latihan dan menyimpan progres harianmu.
                  </p>
                </div>
              </div>
              <Button3D
                variant="amber"
                size="sm"
                onClick={actions.handleActivateCurrentTrack}
                loading={status.isSwitchingLanguage}
                loadingText="Mengaktifkan..."
                className="shrink-0 text-xs"
              >
                Aktifkan Bahasa Ini
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
              <Button3D
                variant="rose"
                size="sm"
                loading={status.isFetching}
                loadingText="Memuat..."
                onClick={actions.refetch}
                className="shrink-0 text-xs"
              >
                Coba Lagi
              </Button3D>
            </div>
          )}

          {/* ── LEVEL SWITCHER (5-Column JLPT or 6-Column CEFR) ── */}
          {curriculum.availableLevelCodes.length > 1 && (
            <section
              aria-label="Pilih level kurikulum"
              className="bg-white border-2 border-slate-200/90 rounded-2xl p-2 shadow-[0_4px_0_0_#E2E8F0]"
            >
              <div
                role="group"
                aria-label="Level kurikulum"
                className={`grid gap-1.5 sm:gap-2 ${
                  curriculum.availableLevelCodes.length === 6
                    ? 'grid-cols-3 sm:grid-cols-6'
                    : 'grid-cols-5'
                }`}
              >
                {curriculum.availableLevelCodes.map((code) => {
                  const isActive = curriculum.selectedLevelCode === code
                  const access = checkLevelAccess(code, {
                    isAuthenticated: !status.isGuest,
                    isPro: status.isPro,
                  })
                  const isProTier = access.requiredTier === 'pro'
                  const subLabel = LEVEL_TRACK_SUBLABELS[code] ?? 'Level'

                  return (
                    <button
                      key={code}
                      type="button"
                      disabled={status.isSwitchingLanguage}
                      aria-pressed={isActive}
                      onClick={() => actions.handleSelectLevel(code)}
                      className={`flex flex-col items-center sm:items-start justify-center px-1.5 py-2 sm:px-3 sm:py-2.5 rounded-xl border-2 text-center sm:text-left transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-w-0 ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-700 shadow-[0_3px_0_0_#1D4ED8]'
                          : !access.allowed
                            ? 'bg-slate-50/90 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 hover:text-slate-800'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="w-full flex items-center justify-center sm:justify-between gap-1">
                        <span className="font-brand font-black text-xs sm:text-sm leading-none tracking-tight">
                          {code}
                        </span>
                        {isActive && status.isFetching && !status.isLoading ? (
                          <span
                            aria-hidden="true"
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-blue-200 border-t-white animate-spin shrink-0"
                          />
                        ) : isProTier ? (
                          <Crown
                            weight="fill"
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${
                              isActive
                                ? 'text-amber-200'
                                : !access.allowed
                                  ? 'text-amber-500'
                                  : 'text-amber-500/80'
                            }`}
                            aria-label="Khusus Pro"
                          />
                        ) : !access.allowed ? (
                          <LockSimple
                            weight="bold"
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${
                              isActive ? 'text-blue-100' : 'text-slate-400'
                            }`}
                            aria-label="Perlu masuk"
                          />
                        ) : null}
                      </div>
                      <span
                        className={`hidden sm:block mt-1 text-[11px] font-semibold leading-tight truncate w-full ${
                          isActive ? 'text-blue-100' : 'text-slate-500'
                        }`}
                      >
                        {subLabel}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── PETA BELAJAR OR TIER GATE ── */}
          {!curriculum.levelAccess.allowed && curriculum.levelAccess.reason !== 'ok' ? (
            <TierUpgradeBanner
              levelCode={curriculum.selectedLevelCode}
              reason={curriculum.levelAccess.reason}
              featureLabel="Kurikulum"
              onSelectFreeLevel={() =>
                actions.handleSelectLevel(curriculum.availableLevelCodes[0] ?? 'N5')
              }
            />
          ) : (
            <CurriculumMapView
              curriculum={curriculum.data}
              isLoading={status.isLoading}
              isFetching={status.isFetching}
              hasError={Boolean(status.error)}
              isGuest={status.isGuest}
              isViewingInactiveTrack={curriculum.isViewingInactiveTrack}
              isActivatingTrack={status.isSwitchingLanguage}
              onActivateTrack={actions.handleActivateCurrentTrack}
              onStartLesson={actions.handleStartLesson}
              onOpenGuestUnlock={actions.openGuestPrompt}
            />
          )}
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
        isOpen={modals.isSwitcherOpen}
        onClose={actions.closeSwitcher}
        currentTrack={curriculum.currentLanguageId}
        onSelectTrack={actions.handleSelectLanguage}
        trackProgressMap={curriculum.metrics.trackProgressMap}
      />

      {/* ── GUEST CONVERSION PROMPT MODAL ── */}
      {status.isGuest && (
        <GuestLoginPromptModal
          isOpen={modals.guestPromptReason !== null}
          onClose={actions.closeGuestPrompt}
          reason={modals.guestPromptReason ?? 'locked_unit'}
          pendingXp={curriculum.guestPendingXp}
        />
      )}

      {/* ── TOAST NOTIFICATION ── */}
      {status.notification && (
        <div role="status" className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-3 animate-fadeIn w-[calc(100vw-2rem)] max-w-md">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <LockSimple weight="bold" className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">{status.notification}</span>
        </div>
      )}

      {/* ── SPOTLIGHT PRODUCT TOUR ── */}
      <SpotlightTourOverlay
        isOpen={modals.isTourOpen}
        steps={CURRICULUM_TOUR_STEPS}
        onComplete={actions.completeTour}
        onSkip={actions.skipTour}
      />
    </div>
  )
}

