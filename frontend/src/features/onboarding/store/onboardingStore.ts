import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'
import { z } from 'zod'
import { registerSessionResetHandler } from "@/shared/services/sessionCleanup"

export type DailyGoalMinutes = 5 | 15 | 30 | 45
export type InitialPlacementType = 'zero_beginner' | 'placement_test'

export interface OnboardingForm {
  languageId: string
  dailyGoalMinutes: DailyGoalMinutes
  initialPlacementType: InitialPlacementType
  placementAnswers: Record<string, string>
}

export interface OnboardingStore {
  currentStep: 1 | 2 | 3
  form: OnboardingForm
  isLanding: boolean

  setStep: (step: 1 | 2 | 3) => void
  updateForm: (updates: Partial<OnboardingForm>) => void
  setPlacementAnswer: (exerciseId: string, answer: string) => void
  setIsLanding: (isLanding: boolean) => void
  reset: () => void
}

const initialForm: OnboardingForm = {
  languageId: '',
  dailyGoalMinutes: 15,
  initialPlacementType: 'zero_beginner',
  placementAnswers: {},
}

const persistedOnboardingSchema = z.object({
  state: z.object({
    currentStep: z.union([z.literal(1), z.literal(2), z.literal(3)]).catch(1),
    form: z
      .object({
        languageId: z.string().catch(''),
        dailyGoalMinutes: z.union([z.literal(5), z.literal(15), z.literal(30), z.literal(45)]).catch(15),
        initialPlacementType: z.enum(['zero_beginner', 'placement_test']).catch('zero_beginner'),
        placementAnswers: z.record(z.string(), z.string()).catch({}),
      })
      .catch(initialForm),
  }),
  version: z.number().optional(),
})

const LEGACY_ONBOARDING_STORAGE_KEY = 'codeabroad_onboarding_v3_draft'

const validatedSessionStorage: StateStorage = {
  getItem: (name) => {
    let raw = sessionStorage.getItem(name)
    let migratedFromLegacy = false
    if (!raw) {
      raw = sessionStorage.getItem(LEGACY_ONBOARDING_STORAGE_KEY)
      migratedFromLegacy = Boolean(raw)
    }
    if (!raw) return null
    try {
      const parsedJson = JSON.parse(raw)
      const parsed = persistedOnboardingSchema.safeParse(parsedJson)
      if (!parsed.success) {
        sessionStorage.removeItem(name)
        sessionStorage.removeItem(LEGACY_ONBOARDING_STORAGE_KEY)
        return null
      }
      const serialized = JSON.stringify(parsed.data)
      if (migratedFromLegacy) {
        sessionStorage.setItem(name, serialized)
        sessionStorage.removeItem(LEGACY_ONBOARDING_STORAGE_KEY)
      }
      return serialized
    } catch {
      sessionStorage.removeItem(name)
      sessionStorage.removeItem(LEGACY_ONBOARDING_STORAGE_KEY)
      return null
    }
  },
  setItem: (name, value) => {
    sessionStorage.setItem(name, value)
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name)
  },
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      form: initialForm,
      isLanding: false,

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
      reset: () =>
        set({
          currentStep: 1,
          form: initialForm,
          isLanding: false,
        }),
    }),
    {
      name: 'merantalk_onboarding_v3_draft',
      storage: createJSONStorage(() => validatedSessionStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        form: state.form,
      }),
    }
  )
)

registerSessionResetHandler(() => {
  useOnboardingStore.getState().reset()
})
