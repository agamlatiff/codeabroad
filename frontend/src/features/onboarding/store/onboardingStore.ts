import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { OnboardingProfileResponse } from "@/features/onboarding/types/onboarding"

export type DailyGoalMinutes = 5 | 15 | 30 | 45
export type InitialPlacementType = 'zero_beginner' | 'placement_test'

export interface OnboardingForm {
  languageId: string
  dailyGoalMinutes: DailyGoalMinutes
  initialPlacementType: InitialPlacementType
  placementAnswers: Record<string, string>
}

export interface OnboardingStore {
  currentStep: 1 | 2 | 3 | 4
  form: OnboardingForm
  isLanding: boolean
  completionResult: OnboardingProfileResponse | null

  setStep: (step: 1 | 2 | 3 | 4) => void
  updateForm: (updates: Partial<OnboardingForm>) => void
  setPlacementAnswer: (exerciseId: string, answer: string) => void
  setIsLanding: (isLanding: boolean) => void
  setCompletionResult: (result: OnboardingProfileResponse | null) => void
  reset: () => void
}

const initialForm: OnboardingForm = {
  languageId: '',
  dailyGoalMinutes: 15,
  initialPlacementType: 'zero_beginner',
  placementAnswers: {},
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      form: initialForm,
      isLanding: false,
      completionResult: null,

      setStep: (currentStep) => set({ currentStep }),
      updateForm: (updates) => set((state) => ({ form: { ...state.form, ...updates } })),
      setPlacementAnswer: (exerciseId, answer) =>
        set((state) => ({
          form: {
            ...state.form,
            placementAnswers: {
              ...state.form.placementAnswers,
              [exerciseId]: answer,
            },
          },
        })),
      setIsLanding: (isLanding) => set({ isLanding }),
      setCompletionResult: (completionResult) => set({ completionResult }),
      reset: () =>
        set({
          currentStep: 1,
          form: initialForm,
          isLanding: false,
          completionResult: null,
        }),
    }),
    {
      name: 'codeabroad_onboarding_v3_draft',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentStep: state.currentStep === 4 ? 1 : state.currentStep,
        form: state.form,
      }),
    }
  )
)
