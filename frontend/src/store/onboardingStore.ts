import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { TargetTimeline, LanguageLevel, OnboardingProfileResponse } from '../types/onboarding'
import type { Step2SubStep } from '../components/onboarding/Step2CareerTracks'
import type { Step3SubStep } from '../components/onboarding/Step3Readiness'

export interface OnboardingForm {
  countryId: string
  careerPathId: string
  stackSlug: string
  fullstackFe: string
  fullstackBe: string
  level: 'beginner' | 'intermediate'
  timeline: TargetTimeline
  languageLevel: LanguageLevel
}

export interface OnboardingNavigation {
  currentStep: 1 | 2 | 3 | 4
  trackSubStep: Step2SubStep
  step3SubStep: Step3SubStep
  mindsetTab: 'specialist' | 'generalist'
}

export interface OnboardingStore extends OnboardingNavigation {
  form: OnboardingForm
  isLanding: boolean
  completionResult: OnboardingProfileResponse | null

  setStep: (step: 1 | 2 | 3 | 4) => void
  setNavigation: (updates: Partial<OnboardingNavigation>) => void
  updateForm: (updates: Partial<OnboardingForm>) => void
  setIsLanding: (isLanding: boolean) => void
  setCompletionResult: (result: OnboardingProfileResponse | null) => void
  reset: () => void
}

const initialForm: OnboardingForm = {
  countryId: '',
  careerPathId: '',
  stackSlug: '',
  fullstackFe: 'react',
  fullstackBe: 'golang',
  level: 'beginner',
  timeline: '1_year',
  languageLevel: 'basic',
}

const initialNavigation: OnboardingNavigation = {
  currentStep: 1,
  trackSubStep: 'mindset',
  step3SubStep: 'level',
  mindsetTab: 'specialist',
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...initialNavigation,
      form: initialForm,
      isLanding: false,
      completionResult: null,

      setStep: (currentStep) => set({ currentStep }),
      setNavigation: (updates) => set(updates),
      updateForm: (updates) => set((state) => ({ form: { ...state.form, ...updates } })),
      setIsLanding: (isLanding) => set({ isLanding }),
      setCompletionResult: (completionResult) => set({ completionResult }),
      reset: () =>
        set({
          ...initialNavigation,
          form: initialForm,
          isLanding: false,
          completionResult: null,
        }),
    }),
    {
      name: 'codeabroad_onboarding_draft',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        trackSubStep: state.trackSubStep,
        step3SubStep: state.step3SubStep,
        mindsetTab: state.mindsetTab,
        form: state.form,
      }),
    }
  )
)
