import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { z } from 'zod'
import { useAuthStore } from '@/features/auth/store/authStore'
import { extractApiErrorMessage } from '@/shared/services/api'
import {
  getLanguageEnrollmentsQueryKey,
  getProfileQueryKey,
} from '@/shared/constants/queryKeys'
import {
  ONBOARDING_LANGUAGES_QUERY_KEY,
  PLACEMENT_QUESTIONS_QUERY_KEY,
  onboardingService,
} from '../services/onboardingService'
import { useOnboardingStore } from '../store/onboardingStore'
import type { OnboardingPayload, OnboardingProfileResponse } from '../types/onboarding'

const onboardingSubmitSchema = z.object({
  language_id: z.string().min(1, 'Pilih bahasa tujuan terlebih dahulu.'),
  daily_goal_minutes: z.union([z.literal(5), z.literal(15), z.literal(30), z.literal(45)]),
  initial_placement_type: z.enum(['zero_beginner', 'placement_test']),
})

function extractErrorCode(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { code?: unknown; error?: { code?: unknown } } | undefined
    if (typeof data?.code === 'string') return data.code
    if (typeof data?.error?.code === 'string') return data.error.code
  }
  return undefined
}

export function useOnboardingWizard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    currentStep,
    form,
    isLanding,
    setStep,
    updateForm,
    setPlacementAnswer,
    setIsLanding,
    reset,
  } = useOnboardingStore()

  const {
    data: languages = [],
    isLoading: isLoadingLanguages,
    isError: isLanguagesError,
    isFetching: isFetchingLanguages,
    refetch: refetchLanguages,
  } = useQuery({
    queryKey: ONBOARDING_LANGUAGES_QUERY_KEY,
    queryFn: onboardingService.getLanguages,
    staleTime: 5 * 60 * 1000,
  })

  const selectedLanguage = useMemo(
    () => languages.find((lang) => lang.id === form.languageId),
    [languages, form.languageId]
  )

  const shouldLoadPlacementQuestions =
    (currentStep === 2 || currentStep === 3) &&
    form.initialPlacementType === 'placement_test' &&
    Boolean(form.languageId)

  const {
    data: placementData,
    isLoading: isLoadingPlacement,
    isError: isPlacementError,
    isFetching: isFetchingPlacement,
    refetch: refetchPlacement,
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
      updateUser({
        is_onboarded: true,
        xp: result.xp ?? user?.xp ?? 0,
        streak: result.streak ?? user?.streak ?? 0,
        daily_goal_minutes: result.daily_goal_minutes ?? form.dailyGoalMinutes,
      })
      const profileKey = getProfileQueryKey(user?.id)
      queryClient.setQueryData(profileKey, (old: unknown) =>
        old && typeof old === 'object' ? { ...old, is_onboarded: true } : old
      )
      void queryClient.invalidateQueries({ queryKey: profileKey })
      void queryClient.invalidateQueries({ queryKey: ['curriculum'] })
      void queryClient.invalidateQueries({ queryKey: getLanguageEnrollmentsQueryKey(user?.id) })
      reset()
      navigate('/curriculum', { replace: true })
    },
    onError: (error: unknown) => {
      const code = extractErrorCode(error)
      if (code === 'ALREADY_ONBOARDED') {
        updateUser({ is_onboarded: true })
        queryClient.setQueryData(getProfileQueryKey(user?.id), (old: unknown) =>
          old && typeof old === 'object' ? { ...old, is_onboarded: true } : old
        )
        reset()
        navigate('/curriculum', { replace: true })
        return
      }
      setErrorMessage(
        extractApiErrorMessage(error, 'Gagal menyimpan pengaturan awal. Coba lagi ya.')
      )
    },
  })

  const submitOnboarding = () => {
    if (completeMutation.isPending) return
    setErrorMessage(null)
    const parsed = onboardingSubmitSchema.safeParse({
      language_id: form.languageId,
      daily_goal_minutes: form.dailyGoalMinutes,
      initial_placement_type: form.initialPlacementType,
    })
    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message || 'Lengkapi pilihan awal belajarmu dulu ya.')
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
    if (completeMutation.isPending) return
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
    if (completeMutation.isPending) return
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

  return {
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
  }
}
