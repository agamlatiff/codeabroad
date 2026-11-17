import { ArrowLeft, ArrowRight, Compass, Sparkle } from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
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
      'Pilih bahasa target untuk menyusun kurikulum, latihan aksara, dan rute belajarmu.',
  },
  2: {
    title: 'Atur ritme harian & titik awalmu',
    subtitle:
      'Sesuaikan target waktu belajar harian dan pilih mulai dari nol atau lewat tes penempatan.',
  },
  3: {
    title: 'Tes Penempatan Singkat',
    subtitle:
      'Jawab soal diagnostik berikut. Skor ≥ 80% akan otomatis membuka level lanjutan!',
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
    isLoadingPlacement,
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Compass className="h-8 w-8" weight="duotone" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-4">
            <Sparkle className="h-3.5 w-3.5" weight="fill" />
            <span>CodeAbroad Language Mastery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Halo{user?.name ? `, ${user.name}` : ''}! Siap mulai perjalanan bahasamu?
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
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
              className="px-8 py-3.5 text-base font-semibold"
            >
              Mulai Setup Belajar
              <ArrowRight className="ml-2 inline h-5 w-5" weight="bold" />
            </Button3D>
          </div>
        </div>
      </div>
    )
  }

  const copy = STEP_COPY[currentStep]
  const totalProgressSteps = form.initialPlacementType === 'placement_test' ? 3 : 2
  const progressValue = Math.round((currentStep / totalProgressSteps) * 100)
  const stepBadge = `Langkah ${currentStep} dari ${totalProgressSteps}`

  const showSharedFooter = currentStep === 1 || currentStep === 2

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Progress Bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                handleBack()
              }}
              disabled={isSubmitting}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-4 w-4" weight="bold" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {stepBadge}
            </span>
          </div>

          <div className="w-36 sm:w-56">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="mb-8 max-w-2xl text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {copy.title}
            </h1>
            <p className="mt-2.5 text-sm text-slate-600 sm:text-base">
              {copy.subtitle}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 w-full max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          )}

          {currentStep === 1 && (
            isLoadingLanguages ? (
              <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm font-medium text-slate-500">
                Memuat daftar bahasa...
              </div>
            ) : (
              <Step1LanguagePicker
                languages={languages}
                selectedLanguageId={form.languageId}
                onSelectLanguage={(languageId) =>
                  updateForm({ languageId })
                }
              />
            )
          )}

          {currentStep === 2 && (
            <Step2PaceAndPlacement
              dailyGoalMinutes={form.dailyGoalMinutes}
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
              answers={form.placementAnswers}
              onAnswerChange={setPlacementAnswer}
              onSubmit={submitOnboarding}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </main>

      {/* Shared Footer for Steps 1 & 2 */}
      {showSharedFooter && (
        <footer className="sticky bottom-0 z-20 border-t border-slate-200/80 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Button3D
              type="button"
              variant="white"
              onClick={() => {
                triggerHaptic('tap')
                handleBack()
              }}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold"
            >
              Kembali
            </Button3D>

            <Button3D
              type="button"
              variant="blue"
              onClick={() => {
                triggerHaptic('tap')
                handleNext()
              }}
              disabled={!canProceed || isSubmitting}
              className="px-6 py-2.5 text-sm font-semibold"
            >
              {currentStep === 2 && form.initialPlacementType === 'zero_beginner'
                ? isSubmitting
                  ? 'Menyimpan...'
                  : 'Mulai Belajar'
                : 'Lanjutkan'}
              <ArrowRight className="ml-1.5 inline h-4 w-4" weight="bold" />
            </Button3D>
          </div>
        </footer>
      )}
    </div>
  )
}

export default OnboardingPage
