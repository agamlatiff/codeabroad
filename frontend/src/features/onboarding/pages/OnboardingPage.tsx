import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Compass, Sparkle } from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { triggerHaptic } from '@/shared/utils/haptics'
import { useOnboardingWizard } from '../hooks/useOnboardingWizard'
import { Step1LanguagePicker } from '../components/Step1LanguagePicker'
import { Step2PaceAndPlacement } from '../components/Step2PaceAndPlacement'
import { Step3PlacementTest } from '../components/Step3PlacementTest'

const STEP_COPY: Record<
  1 | 2 | 3,
  { title: string; subtitle: string }
> = {
  1: {
    title: 'Bahasa apa yang ingin kamu kuasai?',
    subtitle:
      'Pilih bahasa target untuk menyusun kurikulum, kosakata, dan rute belajarmu.',
  },
  2: {
    title: 'Atur ritme harian & titik awalmu',
    subtitle:
      'Sesuaikan target waktu belajar harian dan pilih mulai dari nol atau lewat tes penempatan.',
  },
  3: {
    title: 'Tes Penempatan Singkat',
    subtitle:
      'Jawab beberapa soal singkat berikut. Skor ≥ 80% akan otomatis membuka level lanjutan yang sudah tersedia.',
  },
}

export function OnboardingPage() {
  const {
    user,
    currentStep,
    form,
    isLanding,
    languages,
    selectedLanguage,
    placementQuestions,
    isLoadingLanguages,
    isLanguagesError,
    isFetchingLanguages,
    refetchLanguages,
    isLoadingPlacement,
    isPlacementError,
    isFetchingPlacement,
    refetchPlacement,
    isSubmitting,
    errorMessage,
    canProceed,
    updateForm,
    setPlacementAnswer,
    setIsLanding,
    submitOnboarding,
    handleNext,
    handleBack,
  } = useOnboardingWizard()

  if (isLanding) {
    return (
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen min-h-dvh w-full max-w-full overflow-x-clip bg-[#FAFAF9] flex flex-col items-center justify-center px-4 py-10 sm:py-12">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Compass className="h-8 w-8" weight="duotone" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
              <Sparkle className="h-3.5 w-3.5" weight="fill" />
              <span>Belajar Bahasa Bersama Merantalk</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-brand font-black tracking-tight text-slate-900">
              Halo{user?.name ? `, ${user.name}` : ''}! Siap mulai perjalanan bahasamu?
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Dalam kurang dari 2 menit, kami akan menyiapkan kurikulum terstruktur, target harian, dan titik awal belajar yang pas untukmu.
            </p>
            <div className="mt-8 flex justify-center">
              <Button3D
                type="button"
                variant="blue"
                onClick={() => {
                  triggerHaptic('tap')
                  setIsLanding(false)
                }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 text-sm sm:text-base font-semibold"
              >
                Mulai Atur Belajarmu
                <ArrowRight className="ml-2 inline h-5 w-5" weight="bold" />
              </Button3D>
            </div>
          </div>
        </div>
      </MotionConfig>
    )
  }

  const copy = STEP_COPY[currentStep]
  const totalProgressSteps = form.initialPlacementType === 'placement_test' ? 3 : 2
  const progressValue = Math.round((currentStep / totalProgressSteps) * 100)
  const stepBadge = `Langkah ${currentStep} dari ${totalProgressSteps}`

  const showSharedFooter = currentStep === 1 || currentStep === 2

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen min-h-dvh w-full max-w-full overflow-x-clip bg-[#FAFAF9] flex flex-col">
        {/* Top Progress Bar */}
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-3.5 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  handleBack()
                }}
                disabled={isSubmitting}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                aria-label="Kembali"
              >
                <ArrowLeft className="h-4 w-4" weight="bold" />
              </button>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 truncate">
                {stepBadge}
              </span>
            </div>

            <div className="flex-1 max-w-[116px] sm:max-w-[224px] min-w-[64px]">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 px-3.5 py-5 sm:px-6 sm:py-10">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center min-w-0">
            <div className="mb-5 sm:mb-8 max-w-2xl w-full text-center px-1">
              <h1 className="font-brand font-black text-xl sm:text-3xl tracking-tight text-slate-900 leading-snug">
                {copy.title}
              </h1>
              <p className="mt-2 text-xs sm:text-base text-slate-600 leading-relaxed">
                {copy.subtitle}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 w-full max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {errorMessage}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full min-w-0 flex flex-col items-center"
              >
                {currentStep === 1 && (
                  isLoadingLanguages ? (
                    <div
                      role="status"
                      aria-label="Memuat daftar bahasa"
                      className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 max-w-5xl w-full min-w-0"
                    >
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="rounded-2xl sm:rounded-3xl border-2 border-slate-200/80 bg-white p-4 sm:p-6 flex flex-col items-center gap-3 shadow-xs"
                        >
                          <Skeleton variant="pill" className="h-5 w-20" />
                          <Skeleton className="h-14 w-20 sm:h-20 sm:w-24" />
                          <Skeleton className="h-5 w-28" />
                          <Skeleton className="h-3.5 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : isLanguagesError ? (
                    <div className="w-full max-w-xl rounded-3xl border-2 border-rose-200 bg-rose-50/70 p-6 sm:p-8 text-center space-y-4">
                      <p className="text-sm font-bold text-rose-700">
                        Gagal memuat daftar bahasa. Periksa koneksi internet kamu lalu coba lagi.
                      </p>
                      <Button3D
                        variant="rose"
                        size="sm"
                        loading={isFetchingLanguages}
                        loadingText="Memuat..."
                        onClick={() => void refetchLanguages()}
                      >
                        Coba Lagi
                      </Button3D>
                    </div>
                  ) : (
                    <Step1LanguagePicker
                      languages={languages}
                      selectedLanguageId={form.languageId}
                      disabled={isSubmitting}
                      onSelectLanguage={(languageId) =>
                        updateForm(
                          languageId !== form.languageId
                            ? { languageId, placementAnswers: {} }
                            : { languageId }
                        )
                      }
                    />
                  )
                )}

                {currentStep === 2 && (
                  <Step2PaceAndPlacement
                    dailyGoalMinutes={form.dailyGoalMinutes}
                    disabled={isSubmitting}
                    onSelectDailyGoal={(dailyGoalMinutes) =>
                      updateForm({ dailyGoalMinutes })
                    }
                    initialPlacementType={form.initialPlacementType}
                    onSelectPlacementType={(initialPlacementType) =>
                      updateForm({ initialPlacementType })
                    }
                  />
                )}

                {currentStep === 3 && (
                  <Step3PlacementTest
                    questions={placementQuestions}
                    languageCode={selectedLanguage?.code}
                    isLoading={isLoadingPlacement}
                    isError={isPlacementError}
                    isRetrying={isFetchingPlacement}
                    onRetry={() => void refetchPlacement()}
                    answers={form.placementAnswers}
                    onAnswerChange={setPlacementAnswer}
                    onSubmit={submitOnboarding}
                    isSubmitting={isSubmitting}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Shared Footer for Steps 1 & 2 */}
        {showSharedFooter && (
          <footer className="sticky bottom-0 z-20 border-t border-slate-200/80 bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2.5 sm:gap-4 px-3.5 py-3 sm:px-6 sm:py-4">
              <Button3D
                type="button"
                variant="white"
                onClick={() => {
                  triggerHaptic('tap')
                  handleBack()
                }}
                disabled={isSubmitting}
                className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold shrink-0"
              >
                Kembali
              </Button3D>

              <Button3D
                type="button"
                variant="blue"
                loading={isSubmitting}
                loadingText="Menyimpan..."
                onClick={() => {
                  triggerHaptic('tap')
                  handleNext()
                }}
                disabled={!canProceed || isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold min-w-0"
              >
                {currentStep === 2 && form.initialPlacementType === 'zero_beginner'
                  ? 'Mulai Belajar'
                  : 'Lanjutkan'}
                <ArrowRight className="ml-1.5 inline h-4 w-4" weight="bold" />
              </Button3D>
            </div>
          </footer>
        )}
      </div>
    </MotionConfig>
  )
}

export default OnboardingPage
