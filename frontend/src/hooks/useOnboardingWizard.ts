import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { onboardingService } from '../services/onboardingService'
import { useAuthStore } from '../store/authStore'
import { useOnboardingStore } from '../store/onboardingStore'
import type { CareerPath } from '../types/onboarding'
import {
  getOnboardingStepPrompt,
  getOnboardingStepTitle,
  getOnboardingStepSubtitle,
} from '../static/onboarding'

/**
 * Headless controller hook managing state machine, form mutations, and validations
 * for the multi-step Onboarding experience.
 */
export const useOnboardingWizard = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()

  // 1. Grouped Form & Navigation State from Zustand
  const {
    currentStep,
    trackSubStep,
    step3SubStep,
    mindsetTab,
    form,
    isLanding,
    completionResult,
    setStep,
    setNavigation,
    updateForm,
    setIsLanding,
    setCompletionResult,
    reset,
  } = useOnboardingStore()

  const [formError, setFormError] = useState<string | null>(null)

  // 2. Master Data Queries from TanStack Query
  const {
    data: countries = [],
    isLoading: loadingCountries,
    error: countriesError,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: onboardingService.getCountries,
  })

  const {
    data: careerPaths = [],
    isLoading: loadingPaths,
    error: pathsError,
  } = useQuery({
    queryKey: ['careerPaths'],
    queryFn: onboardingService.getCareerPaths,
  })

  const loadingMasterData = loadingCountries || loadingPaths

  // 3. Fallback Initial Preselection on Cold Mount
  useEffect(() => {
    if (countries.length > 0 && !form.countryId) {
      const activeCountry = countries.find((c) => c.is_active)
      if (activeCountry) updateForm({ countryId: activeCountry.id })
    }
    if (careerPaths.length > 0 && !form.careerPathId) {
      const defaultPath = careerPaths.find((p) => p.slug === 'backend') || careerPaths[0]
      const firstActiveStack = defaultPath.stacks?.find((s) => s.is_active) || defaultPath.stacks?.[0]
      updateForm({
        careerPathId: defaultPath.id,
        stackSlug: firstActiveStack ? firstActiveStack.slug : '',
      })
    }
  }, [countries, careerPaths, form.countryId, form.careerPathId, updateForm])

  // 4. Submission Mutation
  const completeMutation = useMutation({
    mutationFn: onboardingService.completeOnboarding,
    onSuccess: (result) => {
      setCompletionResult(result)
      setTimeout(() => {
        setIsLanding(false)
        setStep(4)
      }, 350)
    },
    onError: (err: any) => {
      setIsLanding(false)
      // Gracefully handle 409 Conflict if user is already onboarded
      if (
        err?.response?.status === 409 ||
        err?.message?.includes('ALREADY_ONBOARDED') ||
        err?.response?.data?.code === 'ALREADY_ONBOARDED'
      ) {
        reset()
        updateUser({ is_onboarded: true })
        navigate('/dashboard', { replace: true })
        return
      }
      setFormError(err.message || 'Gagal menyelesaikan onboarding. Silakan coba lagi.')
    },
  })

  // Handle career path selection
  const handleSelectCareerPath = (path: CareerPath) => {
    if (path.slug === 'fullstack') {
      updateForm({
        careerPathId: path.id,
        fullstackFe: 'react',
        fullstackBe: 'golang',
        stackSlug: 'react_golang',
      })
      setNavigation({ trackSubStep: 'stack_fe' })
    } else {
      const activeStack = path.stacks?.find((s) => s.is_active) || path.stacks?.[0]
      updateForm({
        careerPathId: path.id,
        stackSlug: activeStack ? activeStack.slug : '',
      })
      setNavigation({ trackSubStep: 'stack' })
    }
  }

  // Handle mindset tab switch
  const handleSwitchMindsetTab = (tab: 'specialist' | 'generalist') => {
    setNavigation({ mindsetTab: tab, trackSubStep: 'track' })
    const candidatePaths =
      tab === 'specialist'
        ? careerPaths.filter((p) => ['frontend', 'backend', 'devops'].includes(p.slug))
        : careerPaths.filter((p) => ['fullstack', 'product_engineer', 'solutions_architect'].includes(p.slug))

    if (candidatePaths.length > 0) {
      const firstActivePath =
        candidatePaths.find((p) => p.slug !== 'product_engineer' && p.slug !== 'solutions_architect') ||
        candidatePaths[0]

      if (firstActivePath.slug === 'fullstack') {
        updateForm({
          careerPathId: firstActivePath.id,
          fullstackFe: 'react',
          fullstackBe: 'golang',
          stackSlug: 'react_golang',
        })
      } else {
        const activeStack = firstActivePath.stacks?.find((s) => s.is_active) || firstActivePath.stacks?.[0]
        updateForm({
          careerPathId: firstActivePath.id,
          stackSlug: activeStack ? activeStack.slug : '',
        })
      }
    }
  }

  // Submit onboarding selections to backend
  const handleSubmitOnboarding = async () => {
    if (!form.countryId || !form.careerPathId || !form.stackSlug) {
      setFormError('Mohon lengkapi preferensi pilihanmu terlebih dahulu.')
      return
    }

    setIsLanding(true)
    setFormError(null)

    const flightDurationPromise = new Promise((resolve) => setTimeout(resolve, 1500))
    const mutationPromise = completeMutation.mutateAsync({
      country_id: form.countryId,
      career_path_id: form.careerPathId,
      primary_stack: form.stackSlug,
      level: form.level,
      target_timeline: form.timeline,
      language_level: form.languageLevel,
    })

    try {
      await Promise.all([flightDurationPromise, mutationPromise])
    } catch {
      // Handled in completeMutation.onError
    }
  }

  // Active entities
  const selectedCountry = countries.find((c) => c.id === form.countryId)
  const selectedCareerPath = careerPaths.find((c) => c.id === form.careerPathId) || careerPaths[0]

  // Step validation
  const isStepValid = useCallback(() => {
    if (currentStep === 1) return !!form.countryId
    if (currentStep === 2) {
      if (trackSubStep === 'mindset') return !!mindsetTab
      if (trackSubStep === 'track') return !!form.careerPathId
      if (trackSubStep === 'stack_fe') return !!form.fullstackFe
      if (trackSubStep === 'stack_be') return !!form.fullstackBe
      return !!form.careerPathId && !!form.stackSlug
    }
    if (currentStep === 3) {
      if (step3SubStep === 'level') return !!form.level
      if (step3SubStep === 'readiness') return !!form.timeline && !!form.languageLevel
    }
    return true
  }, [
    currentStep,
    trackSubStep,
    step3SubStep,
    mindsetTab,
    form.countryId,
    form.careerPathId,
    form.stackSlug,
    form.fullstackFe,
    form.fullstackBe,
    form.level,
    form.timeline,
    form.languageLevel,
  ])

  // Handle Next button click
  const handleNext = () => {
    if (!isStepValid() || completeMutation.isPending || loadingMasterData) return

    if (currentStep === 1) {
      setStep(2)
      setNavigation({ trackSubStep: 'mindset' })
    } else if (currentStep === 2) {
      if (trackSubStep === 'mindset') {
        setNavigation({ trackSubStep: 'track' })
      } else if (trackSubStep === 'track') {
        if (selectedCareerPath?.slug === 'fullstack') {
          updateForm({ stackSlug: `${form.fullstackFe}_${form.fullstackBe}` })
          setNavigation({ trackSubStep: 'stack_fe' })
        } else {
          setNavigation({ trackSubStep: 'stack' })
        }
      } else if (trackSubStep === 'stack_fe') {
        updateForm({ stackSlug: `${form.fullstackFe}_${form.fullstackBe}` })
        setNavigation({ trackSubStep: 'stack_be' })
      } else if (trackSubStep === 'stack_be') {
        updateForm({ stackSlug: `${form.fullstackFe}_${form.fullstackBe}` })
        setStep(3)
        setNavigation({ step3SubStep: 'level' })
      } else {
        setStep(3)
        setNavigation({ step3SubStep: 'level' })
      }
    } else if (currentStep === 3) {
      if (step3SubStep === 'level') {
        setNavigation({ step3SubStep: 'readiness' })
      } else {
        handleSubmitOnboarding()
      }
    } else if (currentStep === 4) {
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
      reset()
      navigate('/dashboard', { replace: true })
    }
  }

  // Handle Back button click
  const handleBack = () => {
    if (currentStep === 2) {
      if (trackSubStep === 'stack_be') {
        setNavigation({ trackSubStep: 'stack_fe' })
      } else if (trackSubStep === 'stack_fe') {
        setNavigation({ trackSubStep: 'track' })
      } else if (trackSubStep === 'stack') {
        setNavigation({ trackSubStep: 'track' })
      } else if (trackSubStep === 'track') {
        setNavigation({ trackSubStep: 'mindset' })
      } else {
        setStep(1)
      }
    } else if (currentStep === 3) {
      if (step3SubStep === 'readiness') {
        setNavigation({ step3SubStep: 'level' })
      } else {
        setStep(2)
        setNavigation({
          trackSubStep: selectedCareerPath?.slug === 'fullstack' ? 'stack_be' : 'stack',
        })
      }
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

  const headerContext = {
    currentStep,
    trackSubStep,
    step3SubStep,
    mindsetTab,
    careerPathLabel: selectedCareerPath?.label,
    countryName: selectedCountry?.name,
  }

  const displayError = formError || (countriesError as Error)?.message || (pathsError as Error)?.message

  return {
    user,

    // 1. Wizard Navigation & Dynamic Copywriting
    navigation: {
      step: currentStep,
      trackSubStep,
      setTrackSubStep: (sub: typeof trackSubStep) => setNavigation({ trackSubStep: sub }),
      step3SubStep,
      mindsetTab,
      prompt: getOnboardingStepPrompt(headerContext),
      title: getOnboardingStepTitle(headerContext),
      subtitle: getOnboardingStepSubtitle(headerContext),
      isValid: isStepValid(),
      next: handleNext,
      back: handleBack,
    },

    // 2. User Form Preferences
    form: {
      values: form,
      update: updateForm,
      isLanding,
      completionResult,
    },

    // 3. Master Data from Backend
    masterData: {
      countries,
      careerPaths,
      selectedCountry,
      selectedCareerPath,
      feOptions,
      beOptions,
    },

    // 4. Request Status & Banner Error
    status: {
      loading: loadingMasterData || completeMutation.isPending,
      error: displayError,
      clearError: () => setFormError(null),
    },

    // 5. Step Interaction Actions
    actions: {
      selectCareerPath: handleSelectCareerPath,
      switchMindsetTab: handleSwitchMindsetTab,
    },
  }
}
