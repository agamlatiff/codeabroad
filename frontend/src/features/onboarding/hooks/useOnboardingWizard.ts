import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  ONBOARDING_LANGUAGES_QUERY_KEY,
  PLACEMENT_QUESTIONS_QUERY_KEY,
  onboardingService,
} from '../services/onboardingService'
import { useOnboardingStore } from '../store/onboardingStore'
import type { OnboardingPayload, OnboardingProfileResponse } from '../types/onboarding'

function extractErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  const err = error as {
    response?: { data?: { error?: { code?: string; message?: string }; message?: string } }
  }
  return err.response?.data?.error?.code
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== 'object' || error === null) return fallback
  const err = error as {
    message?: string
    response?: { data?: { error?: { message?: string }; message?: string } }
  }
  return (
    err.response?.data?.error?.message ||
    err.response?.data?.message ||
    err.message ||
    fallback
  )
}

export function useOnboardingWizard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    currentStep,
    form,
    isLanding,
    completionResult,
    setStep,
    updateForm,
    setPlacementAnswer,
    setIsLanding,
    setCompletionResult,
    reset,
  } = useOnboardingStore()

  const { data: languages = [], isLoading: isLoadingLanguages } = useQuery({
    queryKey: ONBOARDING_LANGUAGES_QUERY_KEY,
    queryFn: onboardingService.getLanguages,
    staleTime: 5 * 60 * 1000,
  })

  const selectedLanguage = useMemo(
    () => languages.find((lang) => lang.id === form.languageId),
    [languages, form.languageId]
  )

  const shouldLoadPlacementQuestions =
    currentStep === 3 &&
    form.initialPlacementType === 'placement_test' &&
    Boolean(form.languageId)

  const {
    data: placementData,
    isLoading: isLoadingPlacement,
  } = useQuery({
    queryKey: PLACEMENT_QUESTIONS_QUERY_KEY(form.languageId),
    queryFn: () => onboardingService.getPlacementQuestions(form.languageId),
    enabled: shouldLoadPlacementQuestions,
    staleTime: 5 * 60 * 1000,
  })

  const placementQuestions = placementData?.questions ?? []

  const completeMutation = useMutation({
    mutationFn: (payload: OnboardingPayload) =>
      onboardingService.completeOnboarding(payload),
    onSuccess: (result: OnboardingProfileResponse) => {
      setErrorMessage(null)
      setCompletionResult(result)
      updateUser({
        is_onboarded: true,
        daily_goal_minutes: result.daily_goal_minutes ?? form.dailyGoalMinutes,
      })
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      queryClient.invalidateQueries({ queryKey: ['curriculum'] })
      setStep(4)
    },
    onError: (error: unknown) => {
      const code = extractErrorCode(error)
      if (code === 'ALREADY_ONBOARDED') {
        updateUser({ is_onboarded: true })
        reset()
        navigate('/curriculum', { replace: true })
        return
      }
      setErrorMessage(
        extractErrorMessage(error, 'Gagal menyelesaikan onboarding. Coba lagi.')
      )
    },
  })

  const submitOnboarding = () => {
    setErrorMessage(null)
    if (!form.languageId) {
      setErrorMessage('Pilih bahasa tujuan terlebih dahulu.')
      return
    }

    const placementAnswers =
      form.initialPlacementType === 'placement_test'
        ? Object.entries(form.placementAnswers)
            .filter(([, value]) => value.trim().length > 0)
            .map(([exercise_id, user_answer]) => ({
              exercise_id,
              user_answer: user_answer.trim(),
            }))
        : undefined

    completeMutation.mutate({
      language_id: form.languageId,
      daily_goal_minutes: form.dailyGoalMinutes,
      initial_placement_type: form.initialPlacementType,
      placement_answers: placementAnswers,
    })
  }

  const canProceed = useMemo(() => {
    if (currentStep === 1) {
      return Boolean(form.languageId) && Boolean(selectedLanguage?.is_active)
    }
    if (currentStep === 2) {
      return Boolean(form.dailyGoalMinutes) && Boolean(form.initialPlacementType)
    }
    return true
  }, [currentStep, form, selectedLanguage])

  const handleNext = () => {
    setErrorMessage(null)
    if (!canProceed) return
    if (currentStep === 1) {
      setStep(2)
      return
    }
    if (currentStep === 2) {
      if (form.initialPlacementType === 'placement_test') {
        setStep(3)
      } else {
        submitOnboarding()
      }
    }
  }

  const handleBack = () => {
    setErrorMessage(null)
    if (currentStep === 1) {
      setIsLanding(true)
      return
    }
    if (currentStep === 2) {
      setStep(1)
      return
    }
    if (currentStep === 3) {
      setStep(2)
    }
  }

  const handleFinish = () => {
    reset()
    navigate('/curriculum', { replace: true })
  }

  return {
    user,
    currentStep,
    form,
    isLanding,
    completionResult,
    languages,
    selectedLanguage,
    placementQuestions,
    isLoadingLanguages,
    isLoadingPlacement,
    isSubmitting: completeMutation.isPending,
    errorMessage,
    canProceed,
    setStep,
    updateForm,
    setPlacementAnswer,
    setIsLanding,
    submitOnboarding,
    handleNext,
    handleBack,
    handleFinish,
  }
}
