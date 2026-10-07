import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { onboardingService } from '../services/onboardingService'
import { useAuthStore } from '../store/authStore'
import type { Country, CareerPath, OnboardingProfileResponse, TargetTimeline, LanguageLevel } from '../types/onboarding'
import { Logo } from '../components/ui/Logo'
import { Step1Destination } from '../components/onboarding/Step1Destination'
import { Step2CareerTracks, type Step2SubStep } from '../components/onboarding/Step2CareerTracks'
import { Step3Readiness, type Step3SubStep } from '../components/onboarding/Step3Readiness'
import { Step4BoardingPass } from '../components/onboarding/Step4BoardingPass'

export const OnboardingPage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()

  // Wizard state: 1 (Destination), 2 (Track & Stack), 3 (Readiness), 4 (Ticket)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [trackSubStep, setTrackSubStep] = useState<Step2SubStep>('mindset')
  const [step3SubStep, setStep3SubStep] = useState<Step3SubStep>('level')

  // Mindset filter for Step 2: Specialist vs Generalist
  const [mindsetTab, setMindsetTab] = useState<'specialist' | 'generalist'>('specialist')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Master data fetched from backend
  const [countries, setCountries] = useState<Country[]>([])
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])

  // User preference selections
  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const [selectedCareerPathId, setSelectedCareerPathId] = useState<string>('')
  const [selectedStackSlug, setSelectedStackSlug] = useState<string>('')
  const [selectedFullstackFe, setSelectedFullstackFe] = useState<string>('react')
  const [selectedFullstackBe, setSelectedFullstackBe] = useState<string>('golang')
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate'>('beginner')
  const [selectedTimeline, setSelectedTimeline] = useState<TargetTimeline>('1_year')
  const [selectedLanguageLevel, setSelectedLanguageLevel] = useState<LanguageLevel>('basic')

  // Submission & landing state
  const [isLanding, setIsLanding] = useState(false)
  const [completionResult, setCompletionResult] = useState<OnboardingProfileResponse | null>(null)

  // Fetch master data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [countriesData, pathsData] = await Promise.all([
          onboardingService.getCountries(),
          onboardingService.getCareerPaths(),
        ])
        setCountries(countriesData)
        setCareerPaths(pathsData)

        // Restore draft from sessionStorage if available
        const savedDraft = sessionStorage.getItem('codeabroad_onboarding_draft')
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft)
            if (parsed.selectedCountryId) setSelectedCountryId(parsed.selectedCountryId)
            if (parsed.selectedCareerPathId) setSelectedCareerPathId(parsed.selectedCareerPathId)
            if (parsed.selectedStackSlug) setSelectedStackSlug(parsed.selectedStackSlug)
            if (parsed.selectedFullstackFe) setSelectedFullstackFe(parsed.selectedFullstackFe)
            if (parsed.selectedFullstackBe) setSelectedFullstackBe(parsed.selectedFullstackBe)
            if (parsed.selectedLevel) setSelectedLevel(parsed.selectedLevel)
            if (parsed.selectedTimeline) setSelectedTimeline(parsed.selectedTimeline)
            if (parsed.selectedLanguageLevel) setSelectedLanguageLevel(parsed.selectedLanguageLevel)
            if (parsed.mindsetTab) setMindsetTab(parsed.mindsetTab)
            if (parsed.currentStep && parsed.currentStep < 4) setCurrentStep(parsed.currentStep)
            if (parsed.trackSubStep) setTrackSubStep(parsed.trackSubStep)
            if (parsed.step3SubStep) setStep3SubStep(parsed.step3SubStep)
            return
          } catch {
            // Invalid draft; fallback to defaults
          }
        }

        // Preselect active country (Japan)
        const activeCountry = countriesData.find((c) => c.is_active)
        if (activeCountry) {
          setSelectedCountryId(activeCountry.id)
        }

        // Preselect Backend as default major track and its active stack (Go)
        if (pathsData.length > 0) {
          const defaultPath = pathsData.find((p) => p.slug === 'backend') || pathsData[0]
          setSelectedCareerPathId(defaultPath.id)
          const firstActiveStack = defaultPath.stacks.find((s) => s.is_active) || defaultPath.stacks[0]
          if (firstActiveStack) {
            setSelectedStackSlug(firstActiveStack.slug)
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal memuat data onboarding. Silakan muat ulang halaman.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Persist draft to sessionStorage on state updates
  useEffect(() => {
    if (currentStep < 4 && selectedCountryId) {
      const draft = {
        currentStep,
        trackSubStep,
        step3SubStep,
        mindsetTab,
        selectedCountryId,
        selectedCareerPathId,
        selectedStackSlug,
        selectedFullstackFe,
        selectedFullstackBe,
        selectedLevel,
        selectedTimeline,
        selectedLanguageLevel,
      }
      sessionStorage.setItem('codeabroad_onboarding_draft', JSON.stringify(draft))
    }
  }, [
    currentStep,
    trackSubStep,
    step3SubStep,
    mindsetTab,
    selectedCountryId,
    selectedCareerPathId,
    selectedStackSlug,
    selectedFullstackFe,
    selectedFullstackBe,
    selectedLevel,
    selectedTimeline,
    selectedLanguageLevel,
  ])

  // Handle path selection
  const handleSelectCareerPath = (path: CareerPath) => {
    setSelectedCareerPathId(path.id)
    if (path.slug === 'fullstack') {
      setSelectedFullstackFe('react')
      setSelectedFullstackBe('golang')
      setSelectedStackSlug('react_golang')
    } else if (path.stacks && path.stacks.length > 0) {
      const activeStack = path.stacks.find((s) => s.is_active) || path.stacks[0]
      if (activeStack) {
        setSelectedStackSlug(activeStack.slug)
      }
    }
    // Auto-advance to stack sub-step upon selecting career path
    if (path.slug === 'fullstack') {
      setTrackSubStep('stack_fe')
    } else {
      setTrackSubStep('stack')
    }
  }

  // Handle mindset tab switch
  const handleSwitchMindsetTab = (tab: 'specialist' | 'generalist') => {
    setMindsetTab(tab)
    setTrackSubStep('track')
    // Automatically select first path within chosen mindset
    const candidatePaths =
      tab === 'specialist'
        ? careerPaths.filter((p) => ['frontend', 'backend', 'devops'].includes(p.slug))
        : careerPaths.filter((p) => ['fullstack', 'product_engineer', 'solutions_architect'].includes(p.slug))

    if (candidatePaths.length > 0) {
      const firstActivePath = candidatePaths.find((p) => p.slug !== 'product_engineer' && p.slug !== 'solutions_architect') || candidatePaths[0]
      setSelectedCareerPathId(firstActivePath.id)
      if (firstActivePath.slug === 'fullstack') {
        setSelectedFullstackFe('react')
        setSelectedFullstackBe('golang')
        setSelectedStackSlug('react_golang')
      } else if (firstActivePath.stacks && firstActivePath.stacks.length > 0) {
        const activeStack = firstActivePath.stacks.find((s) => s.is_active) || firstActivePath.stacks[0]
        if (activeStack) setSelectedStackSlug(activeStack.slug)
      }
    }
  }

  // Submit onboarding selections to backend API
  const handleSubmitOnboarding = async () => {
    if (!selectedCountryId || !selectedCareerPathId || !selectedStackSlug) {
      setErrorMsg('Mohon lengkapi preferensi pilihanmu terlebih dahulu.')
      return
    }

    try {
      setLoading(true)
      setIsLanding(true)
      setErrorMsg(null)

      // Run 1.5s flight animation simultaneously with network request
      const flightDurationPromise = new Promise((resolve) => setTimeout(resolve, 1500))
      const onboardingPromise = onboardingService.completeOnboarding({
        country_id: selectedCountryId,
        career_path_id: selectedCareerPathId,
        primary_stack: selectedStackSlug,
        level: selectedLevel,
        target_timeline: selectedTimeline,
        language_level: selectedLanguageLevel,
      })

      const [, result] = await Promise.all([flightDurationPromise, onboardingPromise])

      // Stash complete profile response in local state for Step 4 Boarding Pass rendering
      // NOTE: We defer updating the global auth store (is_onboarded: true) until the user clicks
      // "Masuk ke Dashboard" on Step 4, preventing <OnboardingRoute /> from prematurely redirecting away!
      setCompletionResult(result)

      // Brief touchdown celebration delay (350ms) before revealing official Boarding Pass
      setTimeout(() => {
        setIsLanding(false)
        setCurrentStep(4)
      }, 350)
    } catch (err: any) {
      setIsLanding(false)
      // Gracefully handle 409 Conflict if user is already onboarded
      if (
        err?.response?.status === 409 ||
        err?.message?.includes('ALREADY_ONBOARDED') ||
        err?.response?.data?.code === 'ALREADY_ONBOARDED'
      ) {
        sessionStorage.removeItem('codeabroad_onboarding_draft')
        updateUser({ is_onboarded: true })
        navigate('/dashboard', { replace: true })
        return
      }
      setErrorMsg(err.message || 'Gagal menyelesaikan onboarding. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Active entities
  const selectedCountry = countries.find((c) => c.id === selectedCountryId)
  const selectedCareerPath = careerPaths.find((c) => c.id === selectedCareerPathId) || careerPaths[0]

  // Step validation
  const isStepValid = useCallback(() => {
    if (currentStep === 1) return !!selectedCountryId
    if (currentStep === 2) {
      if (trackSubStep === 'mindset') return !!mindsetTab
      if (trackSubStep === 'track') return !!selectedCareerPathId
      if (trackSubStep === 'stack_fe') return !!selectedFullstackFe
      if (trackSubStep === 'stack_be') return !!selectedFullstackBe
      return !!selectedCareerPathId && !!selectedStackSlug
    }
    if (currentStep === 3) {
      if (step3SubStep === 'level') return !!selectedLevel
      if (step3SubStep === 'readiness') return !!selectedTimeline && !!selectedLanguageLevel
    }
    return true
  }, [currentStep, trackSubStep, step3SubStep, selectedCountryId, selectedCareerPathId, selectedStackSlug, selectedLevel, selectedFullstackFe, selectedFullstackBe, selectedTimeline, selectedLanguageLevel, mindsetTab])

  // Handle Next button click
  const handleNext = () => {
    if (!isStepValid() || loading) return

    if (currentStep === 1) {
      setCurrentStep(2)
      setTrackSubStep('mindset')
    } else if (currentStep === 2) {
      if (trackSubStep === 'mindset') {
        setTrackSubStep('track')
      } else if (trackSubStep === 'track') {
        if (selectedCareerPath?.slug === 'fullstack') {
          setTrackSubStep('stack_fe')
          setSelectedStackSlug(`${selectedFullstackFe}_${selectedFullstackBe}`)
        } else {
          setTrackSubStep('stack')
        }
      } else if (trackSubStep === 'stack_fe') {
        setTrackSubStep('stack_be')
        setSelectedStackSlug(`${selectedFullstackFe}_${selectedFullstackBe}`)
      } else if (trackSubStep === 'stack_be') {
        setSelectedStackSlug(`${selectedFullstackFe}_${selectedFullstackBe}`)
        setCurrentStep(3)
        setStep3SubStep('level')
      } else {
        setCurrentStep(3)
        setStep3SubStep('level')
      }
    } else if (currentStep === 3) {
      if (step3SubStep === 'level') {
        setStep3SubStep('readiness')
      } else {
        handleSubmitOnboarding()
      }
    } else if (currentStep === 4) {
      // Sync complete profile from database response into global auth store right as the user departs for the dashboard
      if (completionResult) {
        updateUser({
          is_onboarded: true,
          xp: completionResult.xp,
          current_level: completionResult.current_level,
          streak: completionResult.streak,
          primary_stack: completionResult.primary_stack,
          target_timeline: completionResult.target_timeline,
          language_level: completionResult.language_level,
          country: completionResult.country,
          career_path: completionResult.career_path,
          level: completionResult.level,
        })
      } else {
        updateUser({ is_onboarded: true })
      }
      sessionStorage.removeItem('codeabroad_onboarding_draft')
      navigate('/dashboard', { replace: true })
    }
  }

  // Handle Back button click
  const handleBack = () => {
    if (currentStep === 2) {
      if (trackSubStep === 'stack_be') {
        setTrackSubStep('stack_fe')
      } else if (trackSubStep === 'stack_fe') {
        setTrackSubStep('track')
      } else if (trackSubStep === 'stack') {
        setTrackSubStep('track')
      } else if (trackSubStep === 'track') {
        setTrackSubStep('mindset')
      } else {
        setCurrentStep(1)
      }
    } else if (currentStep === 3) {
      if (step3SubStep === 'readiness') {
        setStep3SubStep('level')
      } else {
        setCurrentStep(2)
        if (selectedCareerPath?.slug === 'fullstack') {
          setTrackSubStep('stack_be')
        } else {
          setTrackSubStep('stack')
        }
      }
    }
  }

  // Step prompt for Stepper Pill
  const getStepPrompt = (step: number) => {
    switch (step) {
      case 1:
        return 'Destinasi Impian'
      case 2:
        if (trackSubStep === 'mindset') return 'Pilih Mindset Rekayasa'
        if (trackSubStep === 'track') return mindsetTab === 'specialist' ? 'Jalur Specialist' : 'Jalur Generalist'
        if (trackSubStep === 'stack_fe') return 'Fullstack: Pilih Frontend (1/2)'
        if (trackSubStep === 'stack_be') return 'Fullstack: Pilih Backend (2/2)'
        return 'Pilih Teknologi Stack'
      case 3:
        if (step3SubStep === 'level') return 'Pengalaman Coding'
        return 'Target Waktu & Bahasa'
      default:
        return ''
    }
  }

  // Step title header
  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return 'Pilih Destinasi Karier Impianmu'
      case 2:
        if (trackSubStep === 'mindset') return 'Pilih Pendekatan Karier Rekayasamu'
        if (trackSubStep === 'track') {
          return mindsetTab === 'specialist'
            ? 'Spesialisasi apa yang ingin kamu tekuni?'
            : 'Peran generalist mana yang ingin kamu tekuni?'
        }
        if (trackSubStep === 'stack_fe') return 'Langkah 1/2: Pilih Frontend Stack Impianmu'
        if (trackSubStep === 'stack_be') return 'Langkah 2/2: Pilih Backend Pendamping'
        return `Pilih Teknologi Utama ${selectedCareerPath?.label || ''}`
      case 3:
        if (step3SubStep === 'level') return 'Bagaimana Pengalaman Codingmu?'
        return `Target Durasi & Kemampuan Bahasa ke ${selectedCountry?.name || 'Tokyo'}`
      case 4:
        return 'Tiket Karier Internasionalmu Terbit!'
      default:
        return ''
    }
  }

  // Step subtitle description
  const getStepSubtitle = (step: number) => {
    switch (step) {
      case 1:
        return 'Tentukan negara targetmu untuk kurikulum spesifik standar industri lokal dan peluang sponsor visa.'
      case 2:
        if (trackSubStep === 'mindset') {
          return 'Pilih apakah ingin menjadi spesialis mendalam di satu bidang atau generalis berdampak luas pada seluruh lapisan produk.'
        }
        if (trackSubStep === 'track') {
          return mindsetTab === 'specialist'
            ? 'Fokus pada keahlian mendalam sesuai ekosistem dan kebutuhan perusahaan teknologi global.'
            : 'Bangun portofolio menyeluruh yang mencakup integrasi frontend, backend, hingga arsitektur cloud.'
        }
        if (trackSubStep === 'stack_fe') {
          return 'Teknologi antarmuka utama yang akan menjadi fondasi visual aplikasi web modernmu.'
        }
        if (trackSubStep === 'stack_be') {
          return 'Bahasa backend yang mendampingi frontend untuk arsitektur API dan pemrosesan data.'
        }
        return `Kurikulum akan disesuaikan dengan standar industri global ${selectedCareerPath?.label || ''}.`
      case 3:
        if (step3SubStep === 'level') {
          return 'Kami akan menyesuaikan titik awal kurikulum dan rekomendasi quest harian agar sesuai dengan kesiapanmu.'
        }
        return 'Tentukan tenggat target serta kesiapan kemampuan bahasa kerjamu menuju keberangkatan global.'
      case 4:
        return 'Paspor karier resmi terverifikasi. Selamat bergabung dalam ekosistem CodeAbroad!'
      default:
        return ''
    }
  }



  // Fullstack options derived dynamically from frontend and backend career paths
  const feCareerPath = careerPaths.find((p) => p.slug === 'frontend')
  const beCareerPath = careerPaths.find((p) => p.slug === 'backend')

  const feOptions = feCareerPath?.stacks?.length
    ? feCareerPath.stacks
    : [
        { slug: 'react', label: 'React', is_active: true, badge: 'Tokyo Standard' },
        { slug: 'vue', label: 'Vue.js', is_active: false, badge: 'Coming Soon' },
        { slug: 'svelte', label: 'Svelte', is_active: false, badge: 'Coming Soon' },
      ]

  const beOptions = beCareerPath?.stacks?.length
    ? beCareerPath.stacks
    : [
        { slug: 'golang', label: 'Go (Gin Framework)', is_active: true, badge: 'High Demand Tokyo' },
        { slug: 'node', label: 'Node.js (Express)', is_active: false, badge: 'Coming Soon' },
        { slug: 'java', label: 'Java (Spring Boot)', is_active: false, badge: 'Coming Soon' },
      ]

  return (
    <div className="min-h-screen min-h-dvh bg-[#FAFAF9] text-slate-900 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500/20 antialiased relative">
      {/* ── TOP HEADER (COMPACT & BALANCED) ── */}
      <header className="w-full max-w-6xl mx-auto px-6 py-3 sm:py-4 flex items-center justify-between relative z-10 shrink-0">
        <Logo variant="slate" size="md" linkTo={null} />

        {/* User Profile Pill */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-[#4F46E5] font-bold text-xs flex items-center justify-center border border-indigo-200/90 shadow-2xs">
              {user.name ? user.name.charAt(0).toUpperCase() : user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 hidden sm:inline">
              {user.name || user.username}
            </span>
          </div>
        )}
      </header>

      {/* ── MAIN STAGE ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-2 sm:py-4 flex flex-col justify-center items-center relative z-10">
        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="w-full max-w-xl mb-3.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center justify-between shadow-2xs">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="underline text-rose-800 ml-4 font-semibold cursor-pointer shrink-0"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Hero Area: Mini Stepper Pill + Compact Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-6 flex flex-col items-center">
          {/* Connected Mini Stepper Pill */}
          {currentStep <= 3 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/90 shadow-2xs mb-2 transition-all">
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((stepNum) => {
                  const isPast = currentStep > stepNum
                  const isCurrent = currentStep === stepNum
                  return (
                    <div key={stepNum} className="flex items-center">
                      <div
                        className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                          isPast
                            ? 'bg-[#4F46E5] text-white'
                            : isCurrent
                            ? 'bg-[#4F46E5] text-white ring-2 ring-indigo-200 shadow-2xs'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isPast ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : stepNum}
                      </div>
                      {stepNum < 3 && (
                        <div
                          className={`w-3 sm:w-4 h-0.5 mx-1 rounded-full transition-all duration-300 ${
                            currentStep > stepNum ? 'bg-[#4F46E5]' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="w-px h-3 bg-slate-200" />

              <span className="text-[11px] sm:text-xs font-semibold text-slate-600">
                Tahap {currentStep} dari 3: <strong className="text-[#4F46E5] font-bold">{getStepPrompt(currentStep)}</strong>
              </span>
            </div>
          )}

          <h1 className="text-xl sm:text-2.5xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {getStepTitle(currentStep)}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-lg">
            {getStepSubtitle(currentStep)}
          </p>
        </div>

        {/* ── ANIMATED STEP CONTENT CONTAINER ── */}
        <div key={`${currentStep}-${trackSubStep}-${step3SubStep}`} className="animate-stepTransition w-full flex flex-col items-center">
          {/* Step 1: Destination Selection */}
          {currentStep === 1 && (
            <Step1Destination
              countries={countries}
              selectedCountryId={selectedCountryId}
              onSelectCountry={(id) => setSelectedCountryId(id)}
            />
          )}

          {/* Step 2: Mindset, Tracks & Stacks Selection */}
          {currentStep === 2 && (
            <Step2CareerTracks
              trackSubStep={trackSubStep}
              setTrackSubStep={setTrackSubStep}
              mindsetTab={mindsetTab}
              onSwitchMindsetTab={handleSwitchMindsetTab}
              careerPaths={careerPaths}
              selectedCareerPathId={selectedCareerPathId}
              selectedCareerPath={selectedCareerPath}
              onSelectCareerPath={handleSelectCareerPath}
              selectedStackSlug={selectedStackSlug}
              onSelectStackSlug={(slug) => setSelectedStackSlug(slug)}
              selectedFullstackFe={selectedFullstackFe}
              onSelectFullstackFe={(fe) => setSelectedFullstackFe(fe)}
              selectedFullstackBe={selectedFullstackBe}
              onSelectFullstackBe={(be) => setSelectedFullstackBe(be)}
              feOptions={feOptions}
              beOptions={beOptions}
            />
          )}

          {/* Step 3: Coding Experience & Grand Panoramic Journey Theater */}
          {currentStep === 3 && (
            <Step3Readiness
              step3SubStep={step3SubStep}
              selectedLevel={selectedLevel}
              onSelectLevel={(lvl) => setSelectedLevel(lvl)}
              selectedCountry={selectedCountry}
              selectedTimeline={selectedTimeline}
              onSelectTimeline={(timeline) => setSelectedTimeline(timeline)}
              selectedLanguageLevel={selectedLanguageLevel}
              onSelectLanguageLevel={(lvl) => setSelectedLanguageLevel(lvl)}
              isLanding={isLanding}
            />
          )}

          {/* Step 4: Official Boarding Pass Ticket */}
          {currentStep === 4 && (
            <Step4BoardingPass
              completionResult={completionResult}
              user={user}
              selectedCountry={selectedCountry}
              selectedCareerPath={selectedCareerPath}
              selectedStackSlug={selectedStackSlug}
              selectedLevel={selectedLevel}
              selectedTimeline={selectedTimeline}
              selectedLanguageLevel={selectedLanguageLevel}
            />
          )}
        </div>

        {/* ── CENTERED BOTTOM ACTION (COMPACT SPACING) ── */}
        <div className="flex flex-col items-center justify-center mt-5 sm:mt-6 gap-2">
          <button
            onClick={handleNext}
            disabled={loading || isLanding || !isStepValid()}
            className="px-8 sm:px-10 py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              isLanding ? 'Mendarat di Tokyo & Menyiapkan Tiket...' : 'Memproses...'
            ) : currentStep === 4 ? (
              <>
                Masuk ke Dashboard <ArrowRight className="w-4 h-4" />
              </>
            ) : currentStep === 3 && step3SubStep === 'level' ? (
              <>
                Lanjut ke Target &amp; Bahasa <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : currentStep === 3 && step3SubStep === 'readiness' ? (
              isLanding ? (
                <>
                  Mendarat di Tokyo &amp; Menyiapkan Tiket...
                </>
              ) : (
                <>
                  Terbitkan Tiket Boarding <ArrowRight className="w-4 h-4" />
                </>
              )
            ) : currentStep === 2 && trackSubStep === 'mindset' ? (
              <>
                Lanjut Pilih Jalur Spesifik <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : currentStep === 2 && trackSubStep === 'track' ? (
              <>
                Pilih Stack Teknologi <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : currentStep === 2 && trackSubStep === 'stack_fe' ? (
              <>
                Lanjut ke Pilihan Backend <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : currentStep === 2 && (trackSubStep === 'stack' || trackSubStep === 'stack_be') ? (
              <>
                Lanjutkan ke Kesiapan <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              'Lanjutkan ke Pilihan Jalur'
            )}
          </button>

          {/* Contextual Back Navigation */}
          {(currentStep > 1 && currentStep < 4) && (
            <button
              onClick={handleBack}
              className="text-xs font-semibold text-slate-400 hover:text-[#4F46E5] transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {currentStep === 3 && step3SubStep === 'readiness'
                ? 'Kembali ke pilihan pengalaman coding'
                : currentStep === 3 && step3SubStep === 'level'
                ? 'Kembali ke pilihan teknologi'
                : currentStep === 2 && trackSubStep === 'stack_be'
                ? 'Kembali ke pilihan Frontend'
                : currentStep === 2 && (trackSubStep === 'stack' || trackSubStep === 'stack_fe')
                ? 'Ganti Jalur Spesialisasi'
                : currentStep === 2 && trackSubStep === 'track'
                ? 'Kembali ke pilihan tipe track'
                : currentStep === 2 && trackSubStep === 'mindset'
                ? 'Kembali ke pilihan negara'
                : 'Kembali'}
            </button>
          )}
        </div>
      </main>

      {/* ── FOOTER WATERMARK ── */}
      <footer className="w-full text-center py-2.5 text-[11px] text-slate-400 shrink-0">
        CodeAbroad &copy; {new Date().getFullYear()} &mdash; Pelopor Karier Global Software Engineer Indonesia
      </footer>
    </div>
  )
}
