import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { Logo, Button3D } from '../components/ui'
import { triggerHaptic } from '../utils/haptics'
import { Step1Destination } from '../components/onboarding/Step1Destination'
import { Step2CareerTracks } from '../components/onboarding/Step2CareerTracks'
import { Step3Readiness } from '../components/onboarding/Step3Readiness'
import { Step4BoardingPass } from '../components/onboarding/Step4BoardingPass'
import { useOnboardingWizard } from '../hooks'

export const OnboardingPage = () => {
  // Categorized headless wizard state
  const { user, navigation, form, masterData, status, actions } = useOnboardingWizard()

  return (
    <div className="min-h-screen min-h-dvh bg-[#FAFAF9] text-slate-900 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] antialiased relative">
      {/* ── TOP HEADER (COMPACT & BALANCED) ── */}
      <header className="w-full max-w-6xl mx-auto px-6 py-3 sm:py-4 flex items-center justify-between relative z-10 shrink-0">
        <Logo variant="slate" size="md" linkTo={null} />

        {/* User Profile Pill */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center border shadow-2xs bg-blue-100 text-blue-600 border-blue-200/90">
              {user.name ? user.name.charAt(0).toUpperCase() : user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs sm:text-sm font-semibold hidden sm:inline text-slate-800">
              {user.name || user.username}
            </span>
          </div>
        )}
      </header>

      {/* ── MAIN STAGE ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-2 sm:py-4 flex flex-col justify-center items-center relative z-10">
        {/* Error Notification Banner */}
        {status.error && (
          <div className="w-full max-w-xl mb-3.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center justify-between shadow-2xs">
            <span>{status.error}</span>
            <button
              onClick={status.clearError}
              className="underline text-rose-800 ml-4 font-semibold cursor-pointer shrink-0"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Hero Area: Mini Stepper Pill + Compact Title & Subtitle (Steps 1 - 3 Only) */}
        {navigation.step <= 3 && (
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-6 flex flex-col items-center">
            {/* Connected Mini Stepper Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/90 shadow-2xs mb-2 transition-all">
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((stepNum) => {
                  const isPast = navigation.step > stepNum
                  const isCurrent = navigation.step === stepNum
                  return (
                    <div key={stepNum} className="flex items-center">
                      <div
                        className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                          isPast
                            ? 'bg-[#2563EB] text-white'
                            : isCurrent
                            ? 'bg-[#2563EB] text-white ring-2 ring-blue-200 shadow-2xs'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isPast ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : stepNum}
                      </div>
                      {stepNum < 3 && (
                        <div
                          className={`w-3 sm:w-4 h-0.5 mx-1 rounded-full transition-all duration-300 ${
                            navigation.step > stepNum ? 'bg-[#2563EB]' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="w-px h-3 bg-slate-200" />

              <span className="text-[11px] sm:text-xs font-semibold text-slate-600">
                Tahap {navigation.step} dari 3: <strong className="text-[#2563EB] font-bold">{navigation.prompt}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2.5xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              {navigation.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-lg">
              {navigation.subtitle}
            </p>
          </div>
        )}

        {/* ── ANIMATED STEP CONTENT CONTAINER ── */}
        <div key={`${navigation.step}-${navigation.trackSubStep}-${navigation.step3SubStep}`} className="animate-stepTransition w-full flex flex-col items-center">
          {/* Step 1: Destination Selection */}
          {navigation.step === 1 && (
            <Step1Destination
              countries={masterData.countries}
              selectedCountryId={form.values.countryId}
              onSelectCountry={(id) => form.update({ countryId: id })}
            />
          )}

          {/* Step 2: Mindset, Tracks & Stacks Selection */}
          {navigation.step === 2 && (
            <Step2CareerTracks
              trackSubStep={navigation.trackSubStep}
              setTrackSubStep={navigation.setTrackSubStep}
              mindsetTab={navigation.mindsetTab}
              onSwitchMindsetTab={actions.switchMindsetTab}
              careerPaths={masterData.careerPaths}
              selectedCareerPathId={form.values.careerPathId}
              selectedCareerPath={masterData.selectedCareerPath}
              onSelectCareerPath={actions.selectCareerPath}
              selectedStackSlug={form.values.stackSlug}
              onSelectStackSlug={(slug) => form.update({ stackSlug: slug })}
              selectedFullstackFe={form.values.fullstackFe}
              onSelectFullstackFe={(fe) => form.update({ fullstackFe: fe })}
              selectedFullstackBe={form.values.fullstackBe}
              onSelectFullstackBe={(be) => form.update({ fullstackBe: be })}
              feOptions={masterData.feOptions}
              beOptions={masterData.beOptions}
            />
          )}

          {/* Step 3: Coding Experience & Grand Panoramic Journey Theater */}
          {navigation.step === 3 && (
            <Step3Readiness
              step3SubStep={navigation.step3SubStep}
              selectedLevel={form.values.level}
              onSelectLevel={(lvl) => form.update({ level: lvl })}
              selectedCountry={masterData.selectedCountry}
              selectedTimeline={form.values.timeline}
              onSelectTimeline={(timeline) => form.update({ timeline })}
              selectedLanguageLevel={form.values.languageLevel}
              onSelectLanguageLevel={(lvl) => form.update({ languageLevel: lvl })}
              isLanding={form.isLanding}
            />
          )}

          {/* Step 4: Official Boarding Pass Ticket */}
          {navigation.step === 4 && (
            <Step4BoardingPass
              completionResult={form.completionResult}
              user={user}
              selectedCountry={masterData.selectedCountry}
              selectedCareerPath={masterData.selectedCareerPath}
              selectedStackSlug={form.values.stackSlug}
              selectedLevel={form.values.level}
              selectedTimeline={form.values.timeline}
              selectedLanguageLevel={form.values.languageLevel}
              onContinue={navigation.next}
              onBack={navigation.back}
            />
          )}
        </div>

        {/* ── CENTERED BOTTOM ACTION (STEPS 1 - 3 ONLY) ── */}
        {navigation.step < 4 && (
          <div className="flex flex-col items-center justify-center mt-5 sm:mt-6 gap-2">
            <Button3D
              variant="blue"
              size="md"
              onClick={() => {
                triggerHaptic('tap')
                navigation.next()
              }}
              disabled={status.loading || form.isLanding || !navigation.isValid}
              className="px-8 sm:px-10 text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              {status.loading ? (
                form.isLanding ? 'Mendarat di Tokyo & Menyiapkan Tiket...' : 'Memproses...'
              ) : navigation.step === 3 && navigation.step3SubStep === 'level' ? (
                <>
                  Lanjut ke Target &amp; Bahasa <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : navigation.step === 3 && navigation.step3SubStep === 'readiness' ? (
                form.isLanding ? (
                  <>
                    Mendarat di Tokyo &amp; Menyiapkan Tiket...
                  </>
                ) : (
                  <>
                    Terbitkan Tiket Boarding <ArrowRight className="w-4 h-4" />
                  </>
                )
              ) : navigation.step === 2 && navigation.trackSubStep === 'mindset' ? (
                <>
                  Lanjut Pilih Jalur Spesifik <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : navigation.step === 2 && navigation.trackSubStep === 'track' ? (
                <>
                  Pilih Stack Teknologi <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : navigation.step === 2 && navigation.trackSubStep === 'stack_fe' ? (
                <>
                  Lanjut ke Pilihan Backend <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : navigation.step === 2 && (navigation.trackSubStep === 'stack' || navigation.trackSubStep === 'stack_be') ? (
                <>
                  Lanjutkan ke Kesiapan <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Lanjutkan ke Pilihan Jalur <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button3D>

            {/* Contextual Back Navigation */}
            {navigation.step > 1 && navigation.step < 4 && (
              <button
                onClick={() => {
                  triggerHaptic('tap')
                  navigation.back()
                }}
                className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1 mt-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {navigation.step === 3 && navigation.step3SubStep === 'readiness'
                  ? 'Kembali ke pilihan pengalaman coding'
                  : navigation.step === 3 && navigation.step3SubStep === 'level'
                  ? 'Kembali ke pilihan teknologi'
                  : navigation.step === 2 && navigation.trackSubStep === 'stack_be'
                  ? 'Kembali ke pilihan Frontend'
                  : navigation.step === 2 && (navigation.trackSubStep === 'stack' || navigation.trackSubStep === 'stack_fe')
                  ? 'Ganti Jalur Spesialisasi'
                  : navigation.step === 2 && navigation.trackSubStep === 'track'
                  ? 'Kembali ke pilihan tipe track'
                  : navigation.step === 2 && navigation.trackSubStep === 'mindset'
                  ? 'Kembali ke pilihan negara'
                  : 'Kembali'}
              </button>
            )}
          </div>
        )}
      </main>

      {/* ── FOOTER WATERMARK ── */}
      <footer className={`w-full text-center py-2.5 text-[11px] shrink-0 transition-colors duration-500 ${
        navigation.step === 4 ? 'text-slate-600' : 'text-slate-400'
      }`}>
        CodeAbroad &copy; {new Date().getFullYear()} &mdash; Pelopor Karier Global Software Engineer Indonesia
      </footer>
    </div>
  )
}
