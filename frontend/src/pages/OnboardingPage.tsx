import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  Lock,
  ArrowRight,
  ArrowLeft,
  Server,
  Code2,
  Layers,
  Cloud,
  ShieldCheck,
  Plane
} from 'lucide-react'
import { onboardingService } from '../services/onboardingService'
import { useAuthStore } from '../store/authStore'
import type { Country, CareerPath, OnboardingProfileResponse, TargetTimeline, LanguageLevel } from '../types/onboarding'
import { Logo } from '../components/ui/Logo'

// ── 1. VECTOR SVG FLAGS (Compact, Crisp & Consistent on all OS) ──
const CountryFlag = ({ code, className = 'w-10 sm:w-11 h-6.5 sm:h-7' }: { code?: string; className?: string }) => {
  switch (code?.toUpperCase()) {
    case 'JP':
      // Japan: Crisp white field with vermilion crimson sun disc
      return (
        <div className={`${className} rounded-md overflow-hidden border border-slate-200/90 shrink-0 bg-white relative flex items-center justify-center shadow-2xs`}>
          <svg viewBox="0 0 900 600" className="w-full h-full object-cover">
            <rect width="900" height="600" fill="#FFFFFF" />
            <circle cx="450" cy="300" r="180" fill="#BC002D" />
          </svg>
        </div>
      )
    case 'DE':
      // Germany: Black, Red, Gold tricolor
      return (
        <div className={`${className} rounded-md overflow-hidden border border-slate-200/90 shrink-0 bg-white relative shadow-2xs`}>
          <svg viewBox="0 0 5 3" className="w-full h-full object-cover">
            <rect width="5" height="1" y="0" fill="#000000" />
            <rect width="5" height="1" y="1" fill="#DD0000" />
            <rect width="5" height="1" y="2" fill="#FFCE00" />
          </svg>
        </div>
      )
    case 'SG':
      // Singapore: Red & white with crescent moon and stars
      return (
        <div className={`${className} rounded-md overflow-hidden border border-slate-200/90 shrink-0 bg-white relative shadow-2xs`}>
          <svg viewBox="0 0 720 480" className="w-full h-full object-cover">
            <rect width="720" height="240" fill="#ED2939" />
            <rect y="240" width="720" height="240" fill="#FFFFFF" />
            <circle cx="160" cy="120" r="75" fill="#FFFFFF" />
            <circle cx="185" cy="120" r="70" fill="#ED2939" />
            <circle cx="195" cy="85" r="8" fill="#FFFFFF" />
            <circle cx="218" cy="105" r="8" fill="#FFFFFF" />
            <circle cx="218" cy="135" r="8" fill="#FFFFFF" />
            <circle cx="195" cy="155" r="8" fill="#FFFFFF" />
            <circle cx="178" cy="120" r="8" fill="#FFFFFF" />
          </svg>
        </div>
      )
    default:
      return (
        <div className={`${className} rounded-md bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500`}>
          🌐
        </div>
      )
  }
}

// Localized country display name
const getCountryName = (code?: string, fallbackName?: string): string => {
  switch (code?.toUpperCase()) {
    case 'JP':
      return 'Jepang'
    case 'DE':
      return 'Jerman'
    case 'SG':
      return 'Singapura'
    default:
      return fallbackName || 'Destinasi Global'
  }
}

// Localized helpers for boarding pass
const getTargetTimelineLabel = (timeline?: string) => {
  switch (timeline) {
    case '6_months':
      return '3 - 6 Bulan (Sprint)'
    case '1_year':
      return '1 Tahun (Ideal)'
    case 'exploring':
      return 'Eksplorasi Santai'
    default:
      return '1 Tahun'
  }
}

const getLanguageTrackLabel = (lang?: string) => {
  switch (lang) {
    case 'none':
      return 'English-First Track'
    case 'basic':
      return 'JLPT N5 Prep Track'
    case 'conversational':
      return 'JLPT N3+ Bilingual'
    case 'fluent':
      return 'Business Fluent'
    default:
      return 'Bilingual Track'
  }
}

// Lightweight Stepper Stages
const ONBOARDING_STEPS = [
  { id: 1, label: 'Tujuan Karier', shortLabel: 'Destinasi' },
  { id: 2, label: 'Track & Stack', shortLabel: 'Spesialisasi' },
  { id: 3, label: 'Kesiapan & Target', shortLabel: 'Kesiapan' },
  { id: 4, label: 'Paspor Karier', shortLabel: 'Paspor' },
]

export const OnboardingPage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()

  // Wizard state (1 to 4)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Master data
  const [countries, setCountries] = useState<Country[]>([])
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])

  // User selections
  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const [selectedCareerPathId, setSelectedCareerPathId] = useState<string>('')
  const [selectedStackSlug, setSelectedStackSlug] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate'>('beginner')
  const [selectedTimeline, setSelectedTimeline] = useState<TargetTimeline>('1_year')
  const [selectedLanguageLevel, setSelectedLanguageLevel] = useState<LanguageLevel>('basic')

  // Submission result
  const [completionResult, setCompletionResult] = useState<OnboardingProfileResponse | null>(null)

  // Fetch countries & paths on mount
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

        // Preselect active country (Japan)
        const activeCountry = countriesData.find((c) => c.is_active)
        if (activeCountry) {
          setSelectedCountryId(activeCountry.id)
        }

        // Preselect first career path and its active stack
        if (pathsData.length > 0) {
          const firstPath = pathsData[0]
          setSelectedCareerPathId(firstPath.id)
          const firstActiveStack = firstPath.stacks.find((s) => s.is_active)
          if (firstActiveStack) {
            setSelectedStackSlug(firstActiveStack.slug)
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal memuat data onboarding. Silakan coba lagi.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle path change
  const handleSelectCareerPath = (path: CareerPath) => {
    setSelectedCareerPathId(path.id)
    const activeStack = path.stacks.find((s) => s.is_active)
    if (activeStack) {
      setSelectedStackSlug(activeStack.slug)
    } else {
      setSelectedStackSlug('')
    }
  }

  // Handle final submission
  const handleSubmitOnboarding = async () => {
    if (!selectedCountryId || !selectedCareerPathId || !selectedStackSlug) {
      setErrorMsg('Mohon lengkapi seluruh preferensi kariermu terlebih dahulu.')
      return
    }

    try {
      setLoading(true)
      setErrorMsg(null)

      const result = await onboardingService.completeOnboarding({
        country_id: selectedCountryId,
        career_path_id: selectedCareerPathId,
        primary_stack: selectedStackSlug,
        level: selectedLevel,
        target_timeline: selectedTimeline,
        language_level: selectedLanguageLevel,
      })

      setCompletionResult(result)

      updateUser({
        is_onboarded: true,
        xp: result.xp,
        current_level: result.current_level,
        streak: result.streak,
        level: result.level,
        primary_stack: result.primary_stack,
        target_timeline: result.target_timeline,
        language_level: result.language_level,
        country: result.country,
        career_path: result.career_path,
      })

      setCurrentStep(4)
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyelesaikan onboarding. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const selectedCareerPath = careerPaths.find((c) => c.id === selectedCareerPathId)
  const selectedStack = selectedCareerPath?.stacks.find((s) => s.slug === selectedStackSlug)

  // Track icons helper
  const getTrackIcon = (slug: string) => {
    switch (slug) {
      case 'backend':
        return <Server className="w-5 h-5 text-indigo-600" />
      case 'frontend':
        return <Code2 className="w-5 h-5 text-indigo-600" />
      case 'fullstack':
        return <Layers className="w-5 h-5 text-indigo-600" />
      case 'devops':
        return <Cloud className="w-5 h-5 text-indigo-600" />
      default:
        return <Server className="w-5 h-5 text-indigo-600" />
    }
  }

  // Step Validation
  const isStepValid = useCallback(() => {
    if (currentStep === 1) return !!selectedCountryId
    if (currentStep === 2) return !!selectedCareerPathId && !!selectedStackSlug
    if (currentStep === 3) return !!selectedLevel && !!selectedTimeline && !!selectedLanguageLevel
    return true
  }, [currentStep, selectedCountryId, selectedCareerPathId, selectedStackSlug, selectedLevel, selectedTimeline, selectedLanguageLevel])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      if (e.key === 'Enter') {
        e.preventDefault()
        if (currentStep === 4) {
          navigate('/dashboard', { replace: true })
        } else if (currentStep === 3 && isStepValid() && !loading) {
          handleSubmitOnboarding()
        } else if (isStepValid() && !loading) {
          setCurrentStep((prev) => (prev + 1) as any)
        }
      } else if (e.key === 'Backspace' || e.key === 'Escape') {
        if (currentStep > 1 && currentStep < 4) {
          setCurrentStep((prev) => (prev - 1) as any)
        }
      } else if (currentStep === 1) {
        if (e.key === '1') {
          const jp = countries.find((c) => c.code === 'JP')
          if (jp) setSelectedCountryId(jp.id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, isStepValid, loading, countries, navigate])

  return (
    <div className="min-h-screen min-h-dvh bg-[#FAFBFC] text-slate-900 flex flex-col justify-between font-sans selection:bg-indigo-500/20 antialiased relative">
      
      {/* ── SUBTLE AMBIENT RADIAL LIGHT ── */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(91,69,255,0.035),transparent_45%)]" 
        aria-hidden="true" 
      />

      {/* ── 1. HEADER & ONBOARDING PROGRESS ── */}
      <header className="sticky top-0 z-30 bg-[#FAFBFC]/90 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo & Back Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentStep > 1 && currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer active:scale-95 shrink-0 shadow-2xs"
                title="Kembali"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : null}
            <Logo variant="slate" size="sm" linkTo={null} />
          </div>

          {/* Stepper Navigation (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-xs font-medium text-slate-400">
            {ONBOARDING_STEPS.map((step, idx) => {
              const isPast = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div key={step.id} className="flex items-center gap-1.5 lg:gap-2">
                  <span
                    className={`transition-colors whitespace-nowrap ${
                      isCurrent
                        ? 'text-indigo-600 font-semibold'
                        : isPast
                        ? 'text-slate-700 font-medium'
                        : 'text-slate-400 font-normal'
                    }`}
                  >
                    0{step.id} <span className="hidden lg:inline">{step.label}</span>
                    <span className="lg:hidden">{step.shortLabel}</span>
                  </span>
                  {idx < ONBOARDING_STEPS.length - 1 && (
                    <span className="text-slate-300">→</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Compact Progress Indicator */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">
                STEP {currentStep} OF 4
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-700 leading-none mt-1">
                {currentStep * 25}% COMPLETE
              </div>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-12 sm:w-16 lg:w-20 h-1.5 bg-slate-200/80 rounded-full overflow-hidden shrink-0">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. MAIN STAGE (EDITORIAL TYPOGRAPHY & SURFACE SEPARATION) ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex flex-col justify-center relative z-10">
        
        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center justify-between shadow-2xs">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="underline text-rose-800 ml-4 font-semibold cursor-pointer shrink-0"
            >
              Tutup
            </button>
          </div>
        )}

        {/* ── STEP 1: PILIHAN TUJUAN KARIER ── */}
        {currentStep === 1 && (
          <div className="space-y-8 sm:space-y-10 animate-fadeIn">
            
            {/* Editorial Main Heading */}
            <div className="max-w-2xl">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-2">
                ONBOARDING · TAHAP 1
              </span>
              <h1 className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-slate-900 tracking-[-0.035em] leading-[1.1]">
                Mau membangun karier di mana?
              </h1>
              <p className="text-base sm:text-lg text-slate-500 mt-2.5 sm:mt-3 leading-relaxed font-normal">
                Pilih destinasi yang ingin kamu tuju. Kami akan menyesuaikan roadmap belajar dan persiapan kariermu.
              </p>
            </div>

            {/* Destination Selection Cards (Pure White #FFFFFF Surfaces with Aligned Rhythm) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
              
              {/* Japan Card (Currently Selected & Available) */}
              {countries.filter((c) => c.is_active).map((country) => {
                const isSelected = selectedCountryId === country.id
                const countryDisplayName = getCountryName(country.code, country.name)

                return (
                  <div
                    key={country.id}
                    onClick={() => setSelectedCountryId(country.id)}
                    className={`p-6 sm:p-7 rounded-2xl border transition-all duration-200 ease-out cursor-pointer select-none flex flex-col justify-between relative group active:scale-[0.99] ${
                      isSelected
                        ? 'border-indigo-600 bg-gradient-to-b from-[#FAF8FF] to-[#FFFFFF] shadow-[0_8px_30px_rgba(91,69,255,0.08)] md:-translate-y-0.5'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs md:hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex-1 flex flex-col">
                      {/* Flag & Status Checkmark */}
                      <div className="flex items-start justify-between mb-5">
                        <CountryFlag code={country.code} />
                        
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Country Title & Available Status */}
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                          {countryDisplayName}
                        </h2>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          AVAILABLE
                        </span>
                      </div>

                      {/* Track Subtitle */}
                      <span className="text-xs font-semibold text-indigo-600 block mt-1">
                        Tokyo Tech Track
                      </span>

                      {/* Opportunity Description */}
                      <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-relaxed font-normal min-h-[46px] lg:min-h-[50px]">
                        Permintaan tinggi software engineer internasional dengan sponsor visa kerja cepat.
                      </p>
                    </div>

                    {/* Aligned Career & Compensation Information */}
                    <div className="pt-4 mt-6 border-t border-slate-100 space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                          ¥4M – ¥6M
                        </span>
                        <span className="text-xs text-slate-500 font-normal">
                          / tahun
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Engineer / Specialist in Humanities
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Germany & Singapore Cards (Inactive / Coming-Soon) */}
              {countries.filter((c) => !c.is_active).map((country) => {
                const countryDisplayName = getCountryName(country.code, country.name)
                const isGermany = country.code === 'DE'

                return (
                  <div
                    key={country.id}
                    className="p-6 sm:p-7 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs transition-all duration-200 cursor-not-allowed select-none flex flex-col justify-between group"
                  >
                    <div className="flex-1 flex flex-col">
                      {/* Flag & Lock Status */}
                      <div className="flex items-start justify-between mb-5">
                        <CountryFlag code={country.code} className="w-10 sm:w-11 h-6.5 sm:h-7 opacity-90" />
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 flex items-center gap-1 shrink-0">
                          <Lock className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-slate-400" /> Coming soon
                        </span>
                      </div>

                      {/* Country Title & Subtitle */}
                      <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
                        {countryDisplayName}
                      </h2>
                      <span className="text-xs font-medium text-slate-400 block mt-1">
                        {isGermany ? 'Berlin & Munich Track' : 'APAC Regional Hub'}
                      </span>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed font-normal min-h-[46px] lg:min-h-[50px]">
                        {isGermany
                          ? 'Kultur kerja terstruktur dengan standar rekayasa industri teknologi Eropa.'
                          : 'Hub startup unicorn dan institusi finansial global terdepan Asia Pasifik.'}
                      </p>
                    </div>

                    {/* Aligned Footer Information */}
                    <div className="pt-4 mt-6 border-t border-slate-100">
                      <div className="text-xs font-medium text-slate-400 py-0.5">
                        Daftar tunggu segera dibuka
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        )}

        {/* ── STEP 2: TRACK & TECH STACK ── */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="max-w-2xl">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-2">
                ONBOARDING · TAHAP 2
              </span>
              <h1 className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-slate-900 tracking-[-0.035em] leading-[1.1]">
                Pilih jalur dan keahlian teknismu
              </h1>
              <p className="text-base sm:text-lg text-slate-500 mt-2.5 sm:mt-3 leading-relaxed font-normal">
                Fokus kurikulum dan studi kasus akan diselaraskan dengan spesialisasi pilihanmu di Tokyo.
              </p>
            </div>

            {/* 4 Career Tracks in 4-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {careerPaths.map((path) => {
                const isPathSelected = selectedCareerPathId === path.id

                return (
                  <div
                    key={path.id}
                    onClick={() => handleSelectCareerPath(path)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between active:scale-[0.99] ${
                      isPathSelected
                        ? 'border-indigo-600 bg-gradient-to-b from-[#FAF8FF] to-[#FFFFFF] shadow-[0_4px_20px_rgba(91,69,255,0.06)] md:-translate-y-0.5'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          {getTrackIcon(path.slug)}
                        </div>
                        {isPathSelected && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <h2 className="text-sm sm:text-base font-bold text-slate-900">
                        {path.label}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {path.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Tech Stack Selector */}
            {selectedCareerPath && (
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    Tech Stack Utama ({selectedCareerPath.label}):
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Pilih 1 stack</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedCareerPath.stacks.map((stack) => {
                    const isStackSelected = selectedStackSlug === stack.slug
                    const isUnlocked = stack.is_active

                    return (
                      <div
                        key={stack.slug}
                        onClick={() => {
                          if (isUnlocked) setSelectedStackSlug(stack.slug)
                        }}
                        className={`p-3.5 rounded-xl border transition-all select-none min-h-[44px] flex items-center justify-between ${
                          isUnlocked
                            ? isStackSelected
                              ? 'border-indigo-600 bg-indigo-50/40 font-semibold text-indigo-950 cursor-pointer shadow-2xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50 font-medium text-slate-800 cursor-pointer'
                            : 'border-slate-100 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{stack.label}</span>
                        {isUnlocked ? (
                          isStackSelected ? (
                            <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />
                          ) : (
                            <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                              Aktif
                            </span>
                          )
                        ) : (
                          <Lock className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: EXPERIENCE LEVEL & PERSONALIZATION ── */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="max-w-2xl">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-2">
                ONBOARDING · TAHAP 3
              </span>
              <h1 className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-slate-900 tracking-[-0.035em] leading-[1.1]">
                Kesiapan & Target Kariermu
              </h1>
              <p className="text-base sm:text-lg text-slate-500 mt-2.5 sm:mt-3 leading-relaxed font-normal">
                Kami menyesuaikan kurikulum belajar, intensitas daily quest, dan persiapan bahasa sesuai ritmemu.
              </p>
            </div>

            {/* 1. Pengalaman Teknis */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  1. Tingkat Pengalaman Coding:
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Pilih 1 level</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Beginner */}
                <div
                  onClick={() => setSelectedLevel('beginner')}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between active:scale-[0.99] ${
                    selectedLevel === 'beginner'
                      ? 'border-indigo-600 bg-gradient-to-b from-[#FAF8FF] to-[#FFFFFF] shadow-[0_4px_20px_rgba(91,69,255,0.06)] md:-translate-y-0.5'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl shadow-2xs">
                        🌱
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedLevel === 'beginner'
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {selectedLevel === 'beginner' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <h2 className="text-base font-bold text-slate-900">
                      Pemula / Entry-Level
                    </h2>
                    <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
                      &lt; 1 - 2 Tahun Pengalaman
                    </span>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                      Fokus membangun fondasi clean architecture, algoritma terstruktur, dan portofolio GitHub berstandar Tokyo.
                    </p>
                  </div>
                </div>

                {/* Intermediate */}
                <div
                  onClick={() => setSelectedLevel('intermediate')}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between active:scale-[0.99] ${
                    selectedLevel === 'intermediate'
                      ? 'border-indigo-600 bg-gradient-to-b from-[#FAF8FF] to-[#FFFFFF] shadow-[0_4px_20px_rgba(91,69,255,0.06)] md:-translate-y-0.5'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-xl shadow-2xs">
                        🚀
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedLevel === 'intermediate'
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {selectedLevel === 'intermediate' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <h2 className="text-base font-bold text-slate-900">
                      Berpengalaman / Mid-Level
                    </h2>
                    <span className="text-xs text-cyan-700 font-semibold block mt-0.5">
                      2+ Tahun Pengalaman Kerja
                    </span>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                      Akselerasi ke distributed systems, concurrency, technical mock interview, dan fast-track visa sponsorship.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Target Waktu Keberangkatan (Timeline) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  2. Target Waktu Keberangkatan ke Tokyo:
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Bisa diubah nanti</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* 6_months */}
                <div
                  onClick={() => setSelectedTimeline('6_months')}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between active:scale-[0.99] ${
                    selectedTimeline === '6_months'
                      ? 'border-indigo-600 bg-gradient-to-b from-[#FAF8FF] to-[#FFFFFF] shadow-[0_4px_20px_rgba(91,69,255,0.06)] md:-translate-y-0.5'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">⚡</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedTimeline === '6_months' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {selectedTimeline === '6_months' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">3 – 6 Bulan</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">Sprint cepat & intensif untuk persiapan interview segera.</p>
                  </div>
                </div>

                {/* 1_year */}
                <div
                  onClick={() => setSelectedTimeline('1_year')}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between active:scale-[0.99] ${
                    selectedTimeline === '1_year'
                      ? 'border-indigo-600 bg-gradient-to-b from-[#FAF8FF] to-[#FFFFFF] shadow-[0_4px_20px_rgba(91,69,255,0.06)] md:-translate-y-0.5'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">🎯</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedTimeline === '1_year' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {selectedTimeline === '1_year' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900">1 Tahun ke Depan</h3>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 leading-none">Ideal</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">Kurikulum bertahap, mantap bangun portofolio & sertifikasi.</p>
                  </div>
                </div>

                {/* exploring */}
                <div
                  onClick={() => setSelectedTimeline('exploring')}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between active:scale-[0.99] ${
                    selectedTimeline === 'exploring'
                      ? 'border-indigo-600 bg-gradient-to-b from-[#FAF8FF] to-[#FFFFFF] shadow-[0_4px_20px_rgba(91,69,255,0.06)] md:-translate-y-0.5'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">🌱</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedTimeline === 'exploring' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {selectedTimeline === 'exploring' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Eksplorasi Santai</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">Belajar fleksibel sesuai waktu luang tanpa tekanan tenggat waktu.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Kemampuan Bahasa Jepang (Tokyo Track) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  3. Kemampuan Bahasa Jepang Saat Ini:
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Bukan syarat mutlak</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* none */}
                <div
                  onClick={() => setSelectedLanguageLevel('none')}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between active:scale-[0.99] ${
                    selectedLanguageLevel === 'none'
                      ? 'border-indigo-600 bg-gradient-to-b from-[#FAF8FF] to-[#FFFFFF] shadow-[0_4px_20px_rgba(91,69,255,0.06)] md:-translate-y-0.5'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 font-mono">TRACK EN</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedLanguageLevel === 'none' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {selectedLanguageLevel === 'none' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Mulai dari Nol</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">Fokus ke startup Tokyo berbahasa Inggris + adaptasi dasar.</p>
                  </div>
                </div>

                {/* basic */}
                <div
                  onClick={() => setSelectedLanguageLevel('basic')}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between active:scale-[0.99] ${
                    selectedLanguageLevel === 'basic'
                      ? 'border-indigo-600 bg-gradient-to-b from-[#FAF8FF] to-[#FFFFFF] shadow-[0_4px_20px_rgba(91,69,255,0.06)] md:-translate-y-0.5'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600 font-mono">JLPT N5 – N4</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedLanguageLevel === 'basic' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {selectedLanguageLevel === 'basic' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Dasar / Sedang Belajar</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">Paham Hiragana/Katakana & percakapan sehari-hari ringan.</p>
                  </div>
                </div>

                {/* conversational / fluent */}
                <div
                  onClick={() => setSelectedLanguageLevel('conversational')}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between active:scale-[0.99] ${
                    selectedLanguageLevel === 'conversational'
                      ? 'border-indigo-600 bg-gradient-to-b from-[#FAF8FF] to-[#FFFFFF] shadow-[0_4px_20px_rgba(91,69,255,0.06)] md:-translate-y-0.5'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-600 font-mono">JLPT N3+</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedLanguageLevel === 'conversational' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {selectedLanguageLevel === 'conversational' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Percakapan / Siap Wawancara</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">Siap wawancara teknis bilingual Jepang dan Inggris.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: BOARDING PASS (RESPONSIVE TICKET) ── */}
        {currentStep === 4 && (
          <div className="max-w-xl mx-auto w-full space-y-4 sm:space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-indigo-600">
                ONBOARDING · SELESAI
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                Tiket Penerbangan Resmi Terbit
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Paspor kariermu telah terverifikasi. Selamat bergabung di CodeAbroad!
              </p>
            </div>

            {/* Boarding Pass Ticket */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden">
              <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold tracking-wider text-slate-200">
                  <Plane className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-indigo-400" />
                  <span className="truncate">CODEABROAD • BOARDING PASS (搭乗券)</span>
                </div>
                <span className="font-mono text-[10px] sm:text-xs text-slate-400 font-medium shrink-0">
                  CA-2026
                </span>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                {/* Flight Route Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 sm:pb-4">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                      JKT
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Jakarta, ID</div>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-2 sm:px-4">
                    <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-indigo-600 tracking-wider mb-0.5 sm:mb-1">
                      Tokyo Tech Track
                    </span>
                    <div className="w-full flex items-center justify-center relative">
                      <div className="w-full border-t border-dashed border-slate-300" />
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center absolute">
                        <Plane className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-indigo-600 rotate-90" />
                      </div>
                    </div>
                    <span className="text-[8px] sm:text-[9px] text-slate-400 mt-0.5 sm:mt-1 font-mono font-medium">
                      NON-STOP
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono flex items-center justify-end gap-1.5 sm:gap-2">
                      <span>HND</span>
                      <CountryFlag code="JP" className="w-5 sm:w-6 h-3.5 sm:h-4 inline-block shadow-none" />
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Tokyo (Haneda)</div>
                  </div>
                </div>

                {/* Details Grid (6 Essential Attributes) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-semibold">
                      Passenger
                    </span>
                    <span className="font-bold text-slate-900 block truncate mt-0.5 text-xs sm:text-sm">
                      {user?.name || 'Software Engineer'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-semibold">
                      Track
                    </span>
                    <span className="font-semibold text-indigo-600 block truncate mt-0.5 text-xs sm:text-sm">
                      {completionResult?.career_path?.label || selectedCareerPath?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-semibold">
                      Primary Stack
                    </span>
                    <span className="font-semibold text-emerald-700 block truncate mt-0.5 text-xs sm:text-sm">
                      {selectedStack?.label || completionResult?.primary_stack}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-semibold">
                      Class Level
                    </span>
                    <span className="font-bold text-slate-900 block capitalize mt-0.5 text-xs sm:text-sm">
                      {completionResult?.level === 'intermediate' || selectedLevel === 'intermediate' ? 'Mid-Level' : 'Entry-Level'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-semibold">
                      Target Flight
                    </span>
                    <span className="font-semibold text-slate-800 block truncate mt-0.5 text-xs sm:text-sm">
                      {getTargetTimelineLabel(completionResult?.target_timeline || selectedTimeline)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-semibold">
                      Language Track
                    </span>
                    <span className="font-semibold text-indigo-600 block truncate mt-0.5 text-xs sm:text-sm">
                      {getLanguageTrackLabel(completionResult?.language_level || selectedLanguageLevel)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 my-0.5" />

                {/* Seal & Verification */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-red-600 flex items-center justify-center transform -rotate-12 bg-red-50/70 shrink-0">
                      <div className="text-center font-serif text-red-600">
                        <div className="text-sm sm:text-base font-black tracking-widest leading-none">
                          合格
                        </div>
                        <div className="text-[6px] sm:text-[7px] uppercase font-sans font-bold mt-0.5">
                          PASSED
                        </div>
                      </div>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1 text-[11px] sm:text-xs">
                        <ShieldCheck className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-600" />
                        <span>Tokyo Fast-Track Verified</span>
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                        Passport: {user?.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>

                  <div className="text-right hidden sm:block">
                    <div className="font-mono text-[9px] tracking-widest text-slate-400">
                      ||||| | |||| ||| |||||| | |||||
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 font-medium">
                      GATE TOKYO • SEAT 01A
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── 3. REFINED BOTTOM NAVIGATION ── */}
      <footer className="sticky bottom-0 z-30 bg-[#FAFBFC]/90 backdrop-blur-md border-t border-slate-200/60 px-4 sm:px-6 lg:px-8 py-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Step indicator */}
          <div className="text-xs text-slate-500 font-medium shrink-0">
            {currentStep === 4 ? '🎫 Siap ke Dashboard?' : `Langkah ${currentStep} dari 4`}
          </div>

          {/* Primary CTA (Compact, Rounded, Indigo Accent) */}
          <button
            type="button"
            onClick={
              currentStep === 4
                ? () => navigate('/dashboard', { replace: true })
                : currentStep === 3
                ? handleSubmitOnboarding
                : () => setCurrentStep((prev) => (prev + 1) as any)
            }
            disabled={loading || !isStepValid()}
            className={`px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-150 select-none flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer ${
              isStepValid()
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow active:scale-[0.98]'
                : 'bg-slate-200/60 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            {loading ? (
              <span>Memproses...</span>
            ) : currentStep === 4 ? (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : currentStep === 3 ? (
              <span>Terbitkan Boarding Pass</span>
            ) : (
              <>
                <span>Lanjutkan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}
