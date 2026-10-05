import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Plane, ShieldCheck, Sparkles, Check, Lock, Clock, Languages } from 'lucide-react'
import { onboardingService } from '../services/onboardingService'
import { useAuthStore } from '../store/authStore'
import type { Country, CareerPath, OnboardingProfileResponse, TargetTimeline, LanguageLevel } from '../types/onboarding'
import { Logo } from '../components/ui/Logo'
import {
  JapanFlagIllustration,
  SingaporeFlagIllustration,
  GermanyFlagIllustration,
  BackendIllustration,
  FrontendIllustration,
  FullstackIllustration,
  DevOpsIllustration,
  BeginnerIllustration,
  ExperiencedIllustration,
  FundamentalGuideIllustration,
  AcceleratedSystemIllustration,
  TechIcon,
} from '../components/illustrations/OnboardingIllustrations'

export const OnboardingPage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()

  // Wizard state: 1 (Destinasi), 2 (Spesialisasi & Stack), 3 (Kesiapan), 4 (Tiket)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  // Sub-step for Step 2: 'track' (choose role) -> 'stack' (choose tech)
  const [trackSubStep, setTrackSubStep] = useState<'track' | 'stack'>('track')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Master data from backend
  const [countries, setCountries] = useState<Country[]>([])
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])

  // User selections
  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const [selectedCareerPathId, setSelectedCareerPathId] = useState<string>('')
  const [selectedStackSlug, setSelectedStackSlug] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate'>('beginner')
  const [selectedTimeline] = useState<TargetTimeline>('1_year')
  const [selectedLanguageLevel] = useState<LanguageLevel>('basic')

  // Submission result
  const [completionResult, setCompletionResult] = useState<OnboardingProfileResponse | null>(null)

  // Fetch master data on mount
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

  // Handle path selection
  const handleSelectCareerPath = (path: CareerPath) => {
    setSelectedCareerPathId(path.id)
    const activeStack = path.stacks.find((s) => s.is_active) || path.stacks[0]
    if (activeStack) {
      setSelectedStackSlug(activeStack.slug)
    }
  }

  // Handle final submission
  const handleSubmitOnboarding = async () => {
    if (!selectedCountryId || !selectedCareerPathId || !selectedStackSlug) {
      setErrorMsg('Mohon lengkapi preferensi pilihanmu terlebih dahulu.')
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

      updateUser({ is_onboarded: true })
      setCompletionResult(result)
      setCurrentStep(4)
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyelesaikan onboarding. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Step Validation
  const isStepValid = useCallback(() => {
    if (currentStep === 1) return !!selectedCountryId
    if (currentStep === 2) {
      if (trackSubStep === 'track') return !!selectedCareerPathId
      return !!selectedCareerPathId && !!selectedStackSlug
    }
    if (currentStep === 3) return !!selectedLevel
    return true
  }, [currentStep, trackSubStep, selectedCountryId, selectedCareerPathId, selectedStackSlug, selectedLevel])

  // Handle Next button click
  const handleNext = () => {
    if (!isStepValid() || loading) return

    if (currentStep === 1) {
      setCurrentStep(2)
      setTrackSubStep('track')
    } else if (currentStep === 2) {
      if (trackSubStep === 'track') {
        setTrackSubStep('stack')
      } else {
        setCurrentStep(3)
      }
    } else if (currentStep === 3) {
      handleSubmitOnboarding()
    } else if (currentStep === 4) {
      navigate('/dashboard', { replace: true })
    }
  }

  // Handle Back button click
  const handleBack = () => {
    if (currentStep === 2) {
      if (trackSubStep === 'stack') {
        setTrackSubStep('track')
      } else {
        setCurrentStep(1)
      }
    } else if (currentStep === 3) {
      setCurrentStep(2)
      setTrackSubStep('stack')
    }
  }

  // Active entities
  const selectedCountry = countries.find((c) => c.id === selectedCountryId)
  const selectedCareerPath = careerPaths.find((c) => c.id === selectedCareerPathId) || careerPaths[0]

  // Step Prompt for Stepper Pill
  const getStepPrompt = (step: number) => {
    switch (step) {
      case 1:
        return 'Destinasi Impian'
      case 2:
        return trackSubStep === 'track' ? 'Pilih Spesialisasi' : 'Pilih Teknologi Stack'
      case 3:
        return 'Kesiapan & Ritme'
      default:
        return ''
    }
  }

  // Step Header Content
  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return 'Pilih Destinasi Karier Impianmu'
      case 2:
        return trackSubStep === 'track'
          ? 'Spesialisasi apa yang ingin kamu tekuni?'
          : `Pilih Teknologi Utama ${selectedCareerPath?.label || ''}`
      case 3:
        return 'Bagaimana Pengalaman Codingmu?'
      case 4:
        return 'Tiket Karier Internasionalmu Terbit!'
      default:
        return ''
    }
  }

  const getStepSubtitle = (step: number) => {
    switch (step) {
      case 1:
        return 'Tentukan negara tujuan untuk menyesuaikan standar visa, budaya kerja, dan kurikulum belajarmu ✈️'
      case 2:
        return trackSubStep === 'track'
          ? 'Semua 4 jalur rekayasa software dengan permintaan visa kerja aktif di pasar global 🚀'
          : 'Daily quest, kurikulum belajar, dan simulasi interview akan diselaraskan dengan stack ini ⚡'
      case 3:
        return 'Kurikulum belajar dan intensitas daily quest akan disesuaikan dengan titik awalmu saat ini 🌱'
      case 4:
        return 'Paspor karier resmi terverifikasi. Selamat bergabung dalam ekosistem CodeAbroad!'
      default:
        return ''
    }
  }

  // Helper to render track illustration by slug
  const renderTrackIllustration = (slug: string) => {
    switch (slug) {
      case 'frontend':
        return <FrontendIllustration />
      case 'backend':
        return <BackendIllustration />
      case 'fullstack':
        return <FullstackIllustration />
      case 'devops':
        return <DevOpsIllustration />
      default:
        return <BackendIllustration />
    }
  }

  // Helper to render country flag by code
  const renderCountryFlag = (code: string) => {
    switch (code?.toUpperCase()) {
      case 'JP':
        return <JapanFlagIllustration />
      case 'SG':
        return <SingaporeFlagIllustration />
      case 'DE':
        return <GermanyFlagIllustration />
      default:
        return <JapanFlagIllustration />
    }
  }

  // Track Badges
  const getTrackBadge = (slug: string) => {
    switch (slug) {
      case 'backend':
        return { text: 'High Demand Tokyo', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
      case 'frontend':
        return { text: 'Tokyo Standard', color: 'bg-sky-100 text-sky-700 border-sky-200' }
      case 'fullstack':
        return { text: 'Startup Demand', color: 'bg-amber-100 text-amber-700 border-amber-200' }
      case 'devops':
        return { text: 'Highest Salary Tokyo', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
      default:
        return { text: 'Active Track', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
    }
  }

  // Helper to describe stack details
  const getStackDescription = (slug: string) => {
    switch (slug) {
      case 'golang':
        return 'Bahasa performa tinggi untuk microservices & sistem konkurensi di Tokyo.'
      case 'java':
        return 'Paling banyak digunakan di enterprise dan institusi finansial Tokyo.'
      case 'node':
        return 'Pengembangan cepat arsitektur API berbasis Node.js & TypeScript.'
      case 'react':
        return 'Standar industri utama untuk aplikasi web interaktif skala global di Tokyo.'
      case 'vue':
        return 'Framework reaktif yang populer di banyak startup dan tech agency Jepang.'
      case 'svelte':
        return 'Teknologi frontend generasi baru dengan performa ultra-ringan.'
      case 'react_golang':
        return 'Kombinasi paling dicari untuk full product delivery frontend & cloud API.'
      case 'react_node':
        return 'Full JavaScript/TypeScript stack dari UI hingga serverless cloud.'
      case 'devops_cloud':
        return 'Otomatisasi infrastruktur cloud menggunakan Docker, K8s, dan AWS/GCP.'
      default:
        return 'Standar rekayasa teknologi berstandar industri global.'
    }
  }

  // Helper to format stack badge (removes corrupted ???? and Rakuten mention)
  const formatStackBadge = (badge?: string, isActive?: boolean) => {
    if (!badge) return isActive ? 'Tersedia' : 'Coming Soon'
    const cleaned = badge
      .replace(/\s*\(Rakuten\)/gi, '')
      .replace(/^[\?\s\uFFFD]+/, '')
      .trim()
    return cleaned || (isActive ? 'Tersedia' : 'Coming Soon')
  }

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
          {/* ── CONNECTED MINI STEPPER PILL ── */}
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
        <div key={`${currentStep}-${trackSubStep}`} className="animate-stepTransition w-full flex flex-col items-center">
          
          {/* ── TAHAP 1: DESTINASI NEGARA (ENLARGED CARDS) ── */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-7 max-w-5xl w-full justify-items-center">
              {countries.map((country) => {
                const isSelected = selectedCountryId === country.id
                const isActive = country.is_active

                return (
                  <div
                    key={country.id}
                    onClick={() => {
                      if (isActive) {
                        setSelectedCountryId(country.id)
                      }
                    }}
                    className={`rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200 max-w-[340px] sm:max-w-[350px] w-full relative ${
                      isActive
                        ? isSelected
                          ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10 cursor-pointer'
                          : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm cursor-pointer'
                        : 'bg-slate-50/70 border border-dashed border-slate-300/80 opacity-60 cursor-not-allowed select-none'
                    }`}
                  >
                    {/* Top Flag Frame (Enlarged Height) */}
                    <div className={`w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative ${isActive ? 'bg-[#F8FAFC]' : 'bg-slate-100/70'}`}>
                      {renderCountryFlag(country.code)}

                      {/* Status Badge */}
                      <span
                        className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          isActive
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                            : 'bg-slate-200/80 text-slate-600 border-slate-300'
                        }`}
                      >
                        {!isActive && <Lock className="w-2.5 h-2.5 stroke-[2.5]" />}
                        {isActive ? 'Active Track' : 'Coming Soon'}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h2 className={`text-lg sm:text-xl font-bold mb-1.5 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                      {country.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                      {country.code === 'JP' && 'Peluang visa sponsor langsung untuk software engineer Indonesia dengan gaji kompetitif.'}
                      {country.code === 'SG' && 'Hub teknologi Asia Tenggara dengan pajak kompetitif dan kedekatan jarak penerbangan.'}
                      {country.code === 'DE' && 'Pusat teknologi Eropa dengan EU Blue Card dan perlindungan work-life balance tinggi.'}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── TAHAP 2A: GRID 2X2 BESAR & GAGAH (ENLARGED TO ~460px) ── */}
          {currentStep === 2 && trackSubStep === 'track' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7 max-w-5xl w-full justify-items-center">
              {careerPaths.map((path) => {
                const isSelected = selectedCareerPathId === path.id
                const badge = getTrackBadge(path.slug)

                return (
                  <div
                    key={path.id}
                    onClick={() => handleSelectCareerPath(path)}
                    className={`cursor-pointer rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200 max-w-[430px] sm:max-w-[460px] w-full ${
                      isSelected
                        ? 'bg-indigo-50/70 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10'
                        : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {/* Top Vector Frame (Enlarged to h-44 / h-48) */}
                    <div className="w-full h-44 sm:h-48 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mb-4 overflow-hidden relative">
                      {renderTrackIllustration(path.slug)}
                      <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1.5">
                      {path.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3.5">
                      {path.description || 'Standar kurikulum teknologi global.'}
                    </p>

                    {/* Selection Indicator */}
                    <div className="mt-auto pt-2 flex items-center justify-center text-xs sm:text-sm font-semibold">
                      {isSelected ? (
                        <span className="text-[#4F46E5] font-bold flex items-center gap-1.5">
                          <Check className="w-4 h-4 stroke-[2.5]" /> Jalur Terpilih
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          Klik untuk memilih
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── TAHAP 2B: PILIH TEKNOLOGI UTAMA (ENLARGED PORTRAIT CARDS) ── */}
          {currentStep === 2 && trackSubStep === 'stack' && selectedCareerPath && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-5xl w-full justify-items-center">
              {selectedCareerPath.stacks.map((stack) => {
                const isSelected = selectedStackSlug === stack.slug
                const isActive = stack.is_active

                return (
                  <div
                    key={stack.slug}
                    onClick={() => {
                      if (isActive) {
                        setSelectedStackSlug(stack.slug)
                      }
                    }}
                    className={`rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200 max-w-[310px] sm:max-w-[330px] w-full relative ${
                      isActive
                        ? isSelected
                          ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10 cursor-pointer'
                          : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm cursor-pointer'
                        : 'bg-slate-50/70 border border-dashed border-slate-300/80 opacity-60 cursor-not-allowed select-none'
                    }`}
                  >
                    {/* Top Tech Logo Frame */}
                    <div className={`w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative ${isActive ? 'bg-[#F8FAFC]' : 'bg-slate-100/70'}`}>
                      <TechIcon slug={stack.slug} className="w-16 h-16" />

                      {/* Stack Badge */}
                      <span
                        className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          isActive
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                            : 'bg-slate-200/80 text-slate-600 border-slate-300'
                        }`}
                      >
                        {!isActive && <Lock className="w-2.5 h-2.5 stroke-[2.5]" />}
                        {formatStackBadge(stack.badge, isActive)}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className={`text-lg sm:text-xl font-bold mb-1.5 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                      {stack.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                      {getStackDescription(stack.slug)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── TAHAP 3: TINGKAT PENGALAMAN & DETAIL BREAKDOWN (ENLARGED) ── */}
          {currentStep === 3 && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              {/* 2 Main Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7 w-full justify-items-center mb-5">
                {/* Card 1: Mulai dari Dasar */}
                <div
                  onClick={() => setSelectedLevel('beginner')}
                  className={`cursor-pointer rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200 max-w-[380px] sm:max-w-[400px] w-full ${
                    selectedLevel === 'beginner'
                      ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10'
                      : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="w-full h-44 sm:h-48 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mb-4 overflow-hidden relative">
                    <BeginnerIllustration />
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                      Step by Step
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
                    Mulai dari Dasar
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    Baru belajar coding atau pindah karier. Bimbingan fundamental dari nol hingga siap kerja global.
                  </p>
                </div>

                {/* Card 2: Sudah Berpengalaman */}
                <div
                  onClick={() => setSelectedLevel('intermediate')}
                  className={`cursor-pointer rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200 max-w-[380px] sm:max-w-[400px] w-full ${
                    selectedLevel === 'intermediate'
                      ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10'
                      : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="w-full h-44 sm:h-48 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mb-4 overflow-hidden relative">
                    <ExperiencedIllustration />
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Akselerasi
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
                    Sudah Berpengalaman
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    Sudah terbiasa ngoding dan ingin langsung akselerasi ke standar arsitektur dan interview Tokyo.
                  </p>
                </div>
              </div>

              {/* Detail Breakdown Box */}
              <div className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl p-4.5 sm:p-5 shadow-xs animate-in fade-in duration-200">
                {selectedLevel === 'beginner' ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="shrink-0">
                      <FundamentalGuideIllustration className="w-14 h-14" />
                    </div>
                    <div className="text-left space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Fokus Jalur: Fundamental &amp; Habit Belajar
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                        <li>Daily quest ringan 15 menit/hari membangun konsistensi coding.</li>
                        <li>Struktur data, algoritma dasar, dan best practice clean code.</li>
                        <li>Pengenalan kosakata teknis bahasa kerja negara tujuan.</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="shrink-0">
                      <AcceleratedSystemIllustration className="w-14 h-14" />
                    </div>
                    <div className="text-left space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#4F46E5]" />
                        Fokus Jalur: Arsitektur &amp; Interview Global
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                        <li>System design, concurrency, dan high-scale distributed systems.</li>
                        <li>Simulasi coding interview teknis berstandar perusahaan global.</li>
                        <li>Penyusunan CV internasional dan bimbingan visa Highly Skilled Professional.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Preferences: Target Timeline & Language Level */}
              <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3.5">
                {/* Timeline Selector */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs text-left">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Clock className="w-4 h-4 text-[#4F46E5]" />
                    <span className="text-xs font-bold text-slate-800">Target Durasi Berangkat</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-100/70 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSelectedTimeline('6_months')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        selectedTimeline === '6_months'
                          ? 'bg-white text-[#4F46E5] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      6 Bulan
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTimeline('1_year')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        selectedTimeline === '1_year'
                          ? 'bg-white text-[#4F46E5] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      1 Tahun
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTimeline('exploring')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        selectedTimeline === 'exploring'
                          ? 'bg-white text-[#4F46E5] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Santai
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    {selectedTimeline === '6_months' && '⚡ Ritme intensif (Sprint target wawancara).'}
                    {selectedTimeline === '1_year' && '🎯 Ritme ideal & terstruktur (Paling direkomendasikan).'}
                    {selectedTimeline === 'exploring' && '🧭 Eksplorasi sambil membangun fondasi skill.'}
                  </p>
                </div>

                {/* Language Level Selector */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs text-left">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Languages className="w-4 h-4 text-[#4F46E5]" />
                    <span className="text-xs font-bold text-slate-800">Kemampuan Bahasa Jepang</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-100/70 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSelectedLanguageLevel('none')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        selectedLanguageLevel === 'none'
                          ? 'bg-white text-[#4F46E5] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Nol
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguageLevel('basic')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        selectedLanguageLevel === 'basic'
                          ? 'bg-white text-[#4F46E5] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Dasar
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguageLevel('conversational')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        selectedLanguageLevel === 'conversational'
                          ? 'bg-white text-[#4F46E5] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Lancar
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    {selectedLanguageLevel === 'none' && '🌱 Modul kosakata teknis harian dari nol.'}
                    {selectedLanguageLevel === 'basic' && '📖 Paham Hiragana/Katakana atau level N5.'}
                    {selectedLanguageLevel === 'conversational' && '🗣️ Siap simulasi interview bahasa Jepang.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── TAHAP 4: TIKET PENERBANGAN RESMI ── */}
          {currentStep === 4 && (
            <div className="max-w-md w-full mx-auto">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden text-left relative">
                {/* Ticket Top Banner */}
                <div className="bg-gradient-to-r from-[#4F46E5] via-[#4338CA] to-[#312E81] px-6 py-4.5 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">
                      Official Boarding Pass
                    </span>
                    <h3 className="text-base font-black tracking-tight mt-0.5">
                      CodeAbroad Global Journey
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <Plane className="w-4.5 h-4.5 text-white" />
                  </div>
                </div>

                {/* Ticket Body Details */}
                <div className="p-5 sm:p-6 space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500">Nama Rekayasa</span>
                    <span className="font-bold text-slate-800">{completionResult?.name || user?.name || user?.username}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500">Rute Destinasi</span>
                    <span className="font-bold text-[#4F46E5] flex items-center gap-1.5">
                      Jakarta (CGK) <ArrowRight className="w-3.5 h-3.5" /> {selectedCountry?.name || 'Japan'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500">Spesialisasi</span>
                    <span className="font-bold text-slate-800">{selectedCareerPath?.label || 'Backend Engineer'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500">Teknologi Utama</span>
                    <span className="font-bold text-[#4F46E5] uppercase">{selectedStackSlug}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500">Tingkat Awal</span>
                    <span className="font-bold text-slate-800 capitalize">
                      {selectedLevel === 'beginner' ? 'Mulai dari Dasar' : 'Sudah Berpengalaman'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500">Target Waktu</span>
                    <span className="font-bold text-slate-800">
                      {selectedTimeline === '6_months'
                        ? '6 Bulan (Sprint)'
                        : selectedTimeline === '1_year'
                        ? '1 Tahun (Ideal)'
                        : 'Eksplorasi Mandiri'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500">Bahasa Kerja</span>
                    <span className="font-bold text-slate-800">
                      {selectedLanguageLevel === 'none'
                        ? 'Belum Ada (Nol)'
                        : selectedLanguageLevel === 'basic'
                        ? 'Dasar (N5/N4)'
                        : 'Percakapan (N3+)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-[#4F46E5] font-medium text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
                    <span>Paspor aktif &amp; kurikulum siap diakses</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── CENTERED BOTTOM ACTION (COMPACT SPACING) ── */}
        <div className="flex flex-col items-center justify-center mt-5 sm:mt-6 gap-2">
          <button
            onClick={handleNext}
            disabled={loading || !isStepValid()}
            className="px-8 sm:px-10 py-3 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#4338CA] hover:to-[#3730A3] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              'Memproses...'
            ) : currentStep === 4 ? (
              <>
                Masuk ke Dashboard <ArrowRight className="w-4 h-4" />
              </>
            ) : currentStep === 3 ? (
              <>
                Terbitkan Tiket <Sparkles className="w-4 h-4" />
              </>
            ) : currentStep === 2 && trackSubStep === 'track' ? (
              <>
                Pilih Stack Teknologi <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              "Let's start"
            )}
          </button>

          {/* Contextual Back Navigation */}
          {((currentStep > 1 && currentStep < 4) || (currentStep === 2 && trackSubStep === 'stack')) && (
            <button
              onClick={handleBack}
              className="text-xs font-semibold text-slate-400 hover:text-[#4F46E5] transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {currentStep === 2 && trackSubStep === 'stack'
                ? 'Ganti Jalur Spesialisasi'
                : currentStep === 2 && trackSubStep === 'track'
                ? 'Kembali ke pilihan negara'
                : 'Kembali ke pilihan teknologi'}
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
