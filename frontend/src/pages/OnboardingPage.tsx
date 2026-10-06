import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Plane, ShieldCheck, Sparkles, Check, Lock } from 'lucide-react'
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
  ProductEngineerIllustration,
  SolutionsArchitectIllustration,
  SpecialistMindsetIllustration,
  GeneralistMindsetIllustration,
  BeginnerIllustration,
  ExperiencedIllustration,
  FundamentalGuideIllustration,
  AcceleratedSystemIllustration,
  FlightRoadmapGraphic,
  TechIcon,
} from '../components/illustrations/OnboardingIllustrations'

export const OnboardingPage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()

  // Wizard state: 1 (Destinasi), 2 (Spesialisasi & Stack), 3 (Kesiapan), 4 (Tiket)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  // Sub-step for Step 2:
  // 'mindset' -> 'track' -> 'stack' (or 'stack_fe' -> 'stack_be')
  type Step2SubStep = 'mindset' | 'track' | 'stack' | 'stack_fe' | 'stack_be'
  const [trackSubStep, setTrackSubStep] = useState<Step2SubStep>('mindset')

  // Sub-step for Step 3:
  // 'level' (Pengalaman coding) -> 'readiness' (Target Durasi & Bahasa)
  type Step3SubStep = 'level' | 'readiness'
  const [step3SubStep, setStep3SubStep] = useState<Step3SubStep>('level')

  // Mindset Filter for Step 2: Specialist vs Generalist
  const [mindsetTab, setMindsetTab] = useState<'specialist' | 'generalist'>('specialist')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Master data from backend
  const [countries, setCountries] = useState<Country[]>([])
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])

  // User selections
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
  }

  // Switch between Specialist and Generalist track tabs
  const handleSwitchMindsetTab = (tab: 'specialist' | 'generalist') => {
    setMindsetTab(tab)
    if (tab === 'specialist') {
      const defaultSpecialist = careerPaths.find((p) => p.slug === 'backend')
      if (defaultSpecialist) handleSelectCareerPath(defaultSpecialist)
    } else {
      const defaultGeneralist = careerPaths.find((p) => p.slug === 'fullstack')
      if (defaultGeneralist) handleSelectCareerPath(defaultGeneralist)
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
      setIsLanding(true)
      setErrorMsg(null)

      const result = await onboardingService.completeOnboarding({
        country_id: selectedCountryId,
        career_path_id: selectedCareerPathId,
        primary_stack: selectedStackSlug,
        level: selectedLevel,
        target_timeline: selectedTimeline,
        language_level: selectedLanguageLevel,
      })

      // Sync complete profile from database response into global auth store
      updateUser({
        is_onboarded: true,
        xp: result.xp,
        current_level: result.current_level,
        streak: result.streak,
        primary_stack: result.primary_stack,
        target_timeline: result.target_timeline,
        language_level: result.language_level,
        country: result.country,
        career_path: result.career_path,
        level: result.level,
      })
      setCompletionResult(result)

      // Cinematic touchdown delay (1.25s) before revealing official Boarding Pass
      setTimeout(() => {
        setIsLanding(false)
        setCurrentStep(4)
      }, 1250)
    } catch (err: any) {
      setIsLanding(false)
      setErrorMsg(err.message || 'Gagal menyelesaikan onboarding. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Active entities
  const selectedCountry = countries.find((c) => c.id === selectedCountryId)
  const selectedCareerPath = careerPaths.find((c) => c.id === selectedCareerPathId) || careerPaths[0]

  // Step Validation
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

  // Step Prompt for Stepper Pill
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

  // Step Header Content
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

  const getStepSubtitle = (step: number) => {
    switch (step) {
      case 1:
        return 'Tentukan negara tujuan untuk menyesuaikan standar visa, budaya kerja, dan kurikulum belajarmu ✈️'
      case 2:
        if (trackSubStep === 'mindset') return 'Pilih antara mendalami satu spesialisasi teknis secara vertikal atau memegang spektrum produk dari hulu ke hilir 🚀'
        if (trackSubStep === 'track') {
          return mindsetTab === 'specialist'
            ? 'Kuasai satu domain rekayasa dengan standar arsitektur mendalam dan permintaan visa aktif 🎯'
            : 'Kuasai siklus delivery produk dari hulu ke hilir dengan kemampuan lintas domain 🌐'
        }
        if (trackSubStep === 'stack_fe') return 'Tentukan teknologi antarmuka (UI/UX) modern untuk pondasi aplikasi webmu 🎨'
        if (trackSubStep === 'stack_be') return 'Tentukan arsitektur API dan server yang akan berduet dengan frontend pilihanmu ⚙️'
        return 'Daily quest, kurikulum belajar, dan simulasi interview akan diselaraskan dengan stack ini ⚡'
      case 3:
        if (step3SubStep === 'level') return 'Kurikulum belajar dan intensitas daily quest akan disesuaikan dengan titik awalmu saat ini 🌱'
        return 'Sesuaikan ritme belajar harian dan modul bahasa kerja dengan target keberangkatanmu 🎯'
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
      case 'product_engineer':
        return <ProductEngineerIllustration />
      case 'solutions_architect':
        return <SolutionsArchitectIllustration />
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
      case 'devops':
        return { text: 'Highest Salary Tokyo', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
      case 'fullstack':
        return { text: 'High Demand Tokyo', color: 'bg-amber-100 text-amber-700 border-amber-200' }
      case 'product_engineer':
        return { text: 'Coming Soon', color: 'bg-purple-100 text-purple-700 border-purple-200' }
      case 'solutions_architect':
        return { text: 'Coming Soon', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' }
      default:
        return { text: 'Jalur Aktif', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
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
        return 'Pengembangan cepat arsitektur API berbasis Node.js Express.'
      case 'react':
        return 'Standar industri utama untuk aplikasi web interaktif skala global di Tokyo.'
      case 'vue':
        return 'Framework reaktif yang populer di banyak startup dan tech agency Jepang.'
      case 'svelte':
        return 'Teknologi frontend generasi baru dengan performa ultra-ringan.'
      case 'react_golang':
        return 'Kombinasi React + Go (Gin) + AWS paling dicari untuk full product delivery.'
      case 'react_node':
        return 'Full JavaScript stack dari UI, Express API, hingga cloud deployment.'
      case 'devops_aws':
      case 'devops_cloud':
        return 'Otomatisasi kluster Kubernetes, ECS, dan arsitektur cloud serverless di AWS Tokyo.'
      case 'devops_gcp':
        return 'Infrastruktur data & Kubernetes Engine (GKE) populer di unicorn Jepang seperti Mercari.'
      case 'devops_terraform':
        return 'Infrastructure as Code (IaC) skala besar dengan automasi CI/CD pipelines modern.'
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

  // Fullstack options derived from frontend and backend career paths
  const feOptions = [
    { slug: 'react', label: 'React', is_active: true, badge: 'Tokyo Standard' },
    { slug: 'vue', label: 'Vue.js', is_active: false, badge: 'Coming Soon' },
    { slug: 'svelte', label: 'Svelte', is_active: false, badge: 'Coming Soon' },
  ]

  const beOptions = [
    { slug: 'golang', label: 'Go (Gin Framework)', is_active: true, badge: 'High Demand Tokyo' },
    { slug: 'node', label: 'Node.js (Express)', is_active: false, badge: 'Coming Soon' },
    { slug: 'java', label: 'Java (Spring Boot)', is_active: false, badge: 'Coming Soon' },
  ]

  const formatSelectedStackLabel = (slug: string) => {
    switch (slug) {
      case 'golang':
        return 'Go (Gin Framework)'
      case 'java':
        return 'Java (Spring Boot)'
      case 'node':
        return 'Node.js (Express)'
      case 'react':
        return 'React'
      case 'vue':
        return 'Vue.js'
      case 'svelte':
        return 'Svelte'
      case 'react_golang':
        return 'React + Go (Gin) + AWS'
      case 'react_node':
        return 'React + Node (Express) + AWS'
      case 'devops_aws':
      case 'devops_cloud':
        return 'AWS Cloud Native'
      case 'devops_gcp':
        return 'GCP Cloud Native'
      case 'devops_terraform':
        return 'Terraform & GitOps'
      case 'product_fullstack':
        return 'Fullstack Product Delivery'
      case 'cloud_architecture':
        return 'Enterprise Cloud Architecture'
      default:
        return slug.replace(/_/g, ' + ').toUpperCase()
    }
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
        <div key={`${currentStep}-${trackSubStep}-${step3SubStep}`} className="animate-stepTransition w-full flex flex-col items-center">
          
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
                        {isActive ? 'Jalur Aktif' : 'Coming Soon'}
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

          {/* ── TAHAP 2A: PILIH MINDSET KARIER (2 HERO CARDS) ── */}
          {currentStep === 2 && trackSubStep === 'mindset' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 max-w-4xl w-full justify-items-center">
              {/* Card 1: Specialist Track */}
              <div
                onClick={() => handleSwitchMindsetTab('specialist')}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col text-center transition-all duration-200 max-w-[380px] w-full relative ${
                  mindsetTab === 'specialist'
                    ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10 cursor-pointer'
                    : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm cursor-pointer'
                }`}
              >
                {/* Top Illustration Frame */}
                <div className="w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative bg-[#F8FAFC]">
                  <SpecialistMindsetIllustration />
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-indigo-100 text-indigo-700 border-indigo-200">
                    3 Jalur Tersedia
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-base">🎯</span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Specialist Track
                  </h2>
                </div>
                <p className="text-xs font-semibold text-indigo-600 mb-2">Deep Domain Mastery</p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-4">
                  Fokus mendalam pada satu ranah rekayasa software spesifik dengan standar arsitektur mendalam.
                </p>

                {/* Sub-track preview chips */}
                <div className="mt-auto pt-3 border-t border-slate-100/90 flex flex-wrap gap-1.5 justify-center">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Backend</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Frontend</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Cloud &amp; DevOps</span>
                </div>

                <div className="mt-3 text-xs font-semibold">
                  {mindsetTab === 'specialist' ? (
                    <span className="text-[#4F46E5] flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Mindset Terpilih
                    </span>
                  ) : (
                    <span className="text-slate-400">Klik untuk memilih</span>
                  )}
                </div>
              </div>

              {/* Card 2: Generalist Track */}
              <div
                onClick={() => handleSwitchMindsetTab('generalist')}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col text-center transition-all duration-200 max-w-[380px] w-full relative ${
                  mindsetTab === 'generalist'
                    ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10 cursor-pointer'
                    : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm cursor-pointer'
                }`}
              >
                {/* Top Illustration Frame */}
                <div className="w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative bg-[#F8FAFC]">
                  <GeneralistMindsetIllustration />
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-amber-100 text-amber-700 border-amber-200">
                    3 Jalur Tersedia
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-base">🌐</span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Generalist Track
                  </h2>
                </div>
                <p className="text-xs font-semibold text-amber-600 mb-2">End-to-End Product Impact</p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-4">
                  Kuasai delivery produk dari hulu ke hilir dengan perpaduan frontend, backend, cloud, dan pemikiran produk.
                </p>

                {/* Sub-track preview chips */}
                <div className="mt-auto pt-3 border-t border-slate-100/90 flex flex-wrap gap-1.5 justify-center">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Fullstack &amp; Cloud</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Product Engineer</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Solutions Architect</span>
                </div>

                <div className="mt-3 text-xs font-semibold">
                  {mindsetTab === 'generalist' ? (
                    <span className="text-[#4F46E5] flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Mindset Terpilih
                    </span>
                  ) : (
                    <span className="text-slate-400">Klik untuk memilih</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── TAHAP 2B: PILIH JALUR SPESIFIK SESUAI MINDSET (3 CARDS) ── */}
          {currentStep === 2 && trackSubStep === 'track' && (
            <div className="flex flex-col items-center w-full">
              {/* Subtle Mindset Context Header */}
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-2xs">
                  <span>{mindsetTab === 'specialist' ? '🎯' : '🌐'}</span>
                  <span>{mindsetTab === 'specialist' ? 'Specialist Track' : 'Generalist Track'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setTrackSubStep('mindset')}
                  className="text-xs text-slate-400 hover:text-indigo-600 font-semibold cursor-pointer transition-colors"
                >
                  (Ubah Mindset)
                </button>
              </div>

              {/* 3 Symmetrical Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-5xl w-full justify-items-center">
                {(mindsetTab === 'specialist'
                  ? careerPaths.filter((p) => ['frontend', 'backend', 'devops'].includes(p.slug))
                  : careerPaths.filter((p) => ['fullstack', 'product_engineer', 'solutions_architect'].includes(p.slug))
                ).map((path) => {
                  const isSelected = selectedCareerPathId === path.id
                  const badge = getTrackBadge(path.slug)
                  const isComingSoon = path.slug === 'product_engineer' || path.slug === 'solutions_architect'

                  return (
                    <div
                      key={path.id}
                      onClick={() => {
                        if (!isComingSoon) {
                          handleSelectCareerPath(path)
                        }
                      }}
                      className={`rounded-3xl p-6 sm:p-7 flex flex-col text-center transition-all duration-200 max-w-[310px] sm:max-w-[330px] w-full relative ${
                        isComingSoon
                          ? 'bg-slate-50/70 border border-dashed border-slate-300/80 opacity-60 cursor-not-allowed select-none'
                          : isSelected
                          ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10 cursor-pointer'
                          : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm cursor-pointer'
                      }`}
                    >
                      {/* Top Illustration Frame */}
                      <div className={`w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative ${isComingSoon ? 'bg-slate-100/70' : 'bg-[#F8FAFC]'}`}>
                        {renderTrackIllustration(path.slug)}
                        <span
                          className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            isComingSoon
                              ? 'bg-slate-200/80 text-slate-600 border-slate-300'
                              : badge.color
                          }`}
                        >
                          {isComingSoon && <Lock className="w-2.5 h-2.5 stroke-[2.5]" />}
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
                        {isComingSoon ? (
                          <span className="text-slate-400 font-medium">Coming Soon</span>
                        ) : isSelected ? (
                          <span className="text-[#4F46E5] font-bold flex items-center gap-1.5">
                            <Check className="w-4 h-4 stroke-[2.5]" /> Jalur Terpilih
                          </span>
                        ) : (
                          <span className="text-slate-400">Klik untuk memilih</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
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
                      <TechIcon slug={stack.slug} className="w-20 h-20" />

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

          {/* ── TAHAP 2 (FULLSTACK STEP 1/2): PILIH FRONTEND STACK ── */}
          {currentStep === 2 && trackSubStep === 'stack_fe' && (
            <div className="flex flex-col items-center w-full">
              {/* Stepper Progress Pill */}
              <div className="mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/90 text-xs font-semibold text-[#4F46E5] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse"></span>
                <span>Langkah 1 dari 2: Rekayasa Frontend</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-5xl w-full justify-items-center">
                {feOptions.map((stack) => {
                  const isSelected = selectedFullstackFe === stack.slug
                  const isActive = stack.is_active

                  return (
                    <div
                      key={stack.slug}
                      onClick={() => {
                        if (isActive) {
                          setSelectedFullstackFe(stack.slug)
                          setSelectedStackSlug(`${stack.slug}_${selectedFullstackBe}`)
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
                        <TechIcon slug={stack.slug} className="w-20 h-20" />

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
            </div>
          )}

          {/* ── TAHAP 2 (FULLSTACK STEP 2/2): PILIH BACKEND STACK ── */}
          {currentStep === 2 && trackSubStep === 'stack_be' && (
            <div className="flex flex-col items-center w-full">
              {/* Stepper Progress Pill with Selected FE */}
              <div className="mb-5 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/90 text-xs font-semibold text-[#4F46E5] shadow-2xs">
                <span>Frontend: <strong className="text-indigo-900">{selectedFullstackFe === 'react' ? 'React + TypeScript' : selectedFullstackFe}</strong></span>
                <span className="text-indigo-300">➔</span>
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse"></span>
                  Langkah 2 dari 2: Pilih Backend Pendamping
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-5xl w-full justify-items-center">
                {beOptions.map((stack) => {
                  const isSelected = selectedFullstackBe === stack.slug
                  const isActive = stack.is_active

                  return (
                    <div
                      key={stack.slug}
                      onClick={() => {
                        if (isActive) {
                          setSelectedFullstackBe(stack.slug)
                          setSelectedStackSlug(`${selectedFullstackFe}_${stack.slug}`)
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
                        <TechIcon slug={stack.slug} className="w-20 h-20" />

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
            </div>
          )}

          {/* ── TAHAP 3A: TINGKAT PENGALAMAN CODING (2 HERO CARDS) ── */}
          {currentStep === 3 && step3SubStep === 'level' && (
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 justify-items-center">
              {/* Card 1: Mulai dari Dasar */}
              <div
                onClick={() => setSelectedLevel('beginner')}
                className={`cursor-pointer rounded-3xl p-6 sm:p-7 flex flex-col text-center transition-all duration-200 max-w-[390px] w-full relative ${
                  selectedLevel === 'beginner'
                    ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10'
                    : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="w-full h-40 sm:h-44 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mb-4 overflow-hidden relative">
                  <BeginnerIllustration />
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    Step by Step
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                  Mulai dari Dasar
                </h2>
                <p className="text-xs font-semibold text-indigo-600 mb-2">Fundamental &amp; Habit Builder</p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-4">
                  Baru belajar coding atau pindah karier. Bimbingan terstruktur dari nol hingga siap kerja global.
                </p>

                {/* Checklist Kurikulum */}
                <div className="mt-auto pt-3 border-t border-slate-100/90 text-left space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Daily quest ringan 15 mnt/hari bangun habit</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Struktur data, algoritma &amp; clean code dasar</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Pengenalan kosakata teknis bahasa kerja</span>
                  </div>
                </div>

                <div className="text-xs font-semibold">
                  {selectedLevel === 'beginner' ? (
                    <span className="text-[#4F46E5] flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Level Terpilih
                    </span>
                  ) : (
                    <span className="text-slate-400">Klik untuk memilih</span>
                  )}
                </div>
              </div>

              {/* Card 2: Sudah Berpengalaman */}
              <div
                onClick={() => setSelectedLevel('intermediate')}
                className={`cursor-pointer rounded-3xl p-6 sm:p-7 flex flex-col text-center transition-all duration-200 max-w-[390px] w-full relative ${
                  selectedLevel === 'intermediate'
                    ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10'
                    : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="w-full h-40 sm:h-44 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mb-4 overflow-hidden relative">
                  <ExperiencedIllustration />
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Akselerasi
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                  Sudah Berpengalaman
                </h2>
                <p className="text-xs font-semibold text-amber-600 mb-2">Fast-Track &amp; System Design</p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-4">
                  Sudah terbiasa ngoding dan ingin langsung akselerasi ke standar arsitektur dan interview Tokyo.
                </p>

                {/* Checklist Kurikulum */}
                <div className="mt-auto pt-3 border-t border-slate-100/90 text-left space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />
                    <span>System design &amp; high-concurrency systems</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />
                    <span>Simulasi live coding technical interview Tokyo</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />
                    <span>Portofolio global &amp; bimbingan visa sponsor</span>
                  </div>
                </div>

                <div className="text-xs font-semibold">
                  {selectedLevel === 'intermediate' ? (
                    <span className="text-[#4F46E5] flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Level Terpilih
                    </span>
                  ) : (
                    <span className="text-slate-400">Klik untuk memilih</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── TAHAP 3B: GRAND PANORAMIC JOURNEY THEATER (OPSI C) ── */}
          {currentStep === 3 && step3SubStep === 'readiness' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              {/* Grand Panoramic Canvas Card */}
              <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm text-left relative overflow-hidden">
                {/* Header route ribbon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                      Rute Persiapan Karier Internasional
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Jakarta (CGK) → {selectedCountry?.name || 'Tokyo'} ({selectedCountry?.code === 'DE' ? 'BER' : selectedCountry?.code === 'SG' ? 'SIN' : 'NRT'})
                    </h3>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold self-start sm:self-auto shadow-2xs">
                    <span>
                      {isLanding
                        ? 'Pesawat Mendarat di Narita...'
                        : selectedTimeline === '6_months'
                        ? 'Target Landing: April 2027 (Sprint 6 Bulan)'
                        : selectedTimeline === '1_year'
                        ? 'Target Landing: Oktober 2027 (Ideal 1 Tahun)'
                        : 'Target Landing: Fleksibel (Self-Paced)'}
                    </span>
                  </div>
                </div>

                {/* SVG Visual Scenic Trajectory Map */}
                <div className="w-full py-1">
                  <FlightRoadmapGraphic
                    timeline={selectedTimeline}
                    countryCode={selectedCountry?.code}
                    isLanding={isLanding}
                  />
                </div>

                {/* FLOATING GLASS HUD CONTROLS (OPSI C: Terintegrasi Ramping di Bawah Peta) */}
                <div className="mt-3 pt-3 border-t border-slate-100/90 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Glass Capsule 1: Target Waktu */}
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">
                        Target Waktu Belajar
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">
                        {selectedTimeline === '6_months' ? '2-3 jam/hari' : selectedTimeline === '1_year' ? '1 jam/hari' : 'Mandiri'}
                      </span>
                    </div>
                    {/* 3 Pill Chips */}
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setSelectedTimeline('6_months')}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedTimeline === '6_months'
                            ? 'bg-[#4F46E5] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        Sprint (6 Bln)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTimeline('1_year')}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedTimeline === '1_year'
                            ? 'bg-[#4F46E5] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        Ideal (1 Thn)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTimeline('exploring')}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedTimeline === 'exploring'
                            ? 'bg-[#4F46E5] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        Santai
                      </button>
                    </div>
                  </div>

                  {/* Glass Capsule 2: Kemampuan Bahasa */}
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">
                        Kemampuan Bahasa {selectedCountry?.code === 'JP' ? 'Jepang' : 'Kerja'}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">
                        {selectedLanguageLevel === 'none' ? 'Dari Awal' : selectedLanguageLevel === 'basic' ? 'Tata Bahasa' : 'Interview Siap'}
                      </span>
                    </div>
                    {/* 3 Pill Chips */}
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setSelectedLanguageLevel('none')}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedLanguageLevel === 'none'
                            ? 'bg-[#4F46E5] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        Mulai Nol
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedLanguageLevel('basic')}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedLanguageLevel === 'basic'
                            ? 'bg-[#4F46E5] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        Dasar (N5/N4)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedLanguageLevel('conversational')}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedLanguageLevel === 'conversational'
                            ? 'bg-[#4F46E5] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        Lancar (N3+)
                      </button>
                    </div>
                  </div>
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
                    <span className="font-bold text-[#4F46E5]">{formatSelectedStackLabel(selectedStackSlug)}</span>
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
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[#4F46E5] font-medium text-xs">
                      <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
                      <span>Paspor aktif &amp; kurikulum siap diakses</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-bold">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      +50 XP
                    </span>
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
