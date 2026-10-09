import { create } from 'zustand'
import type { Quest, RunTestsResponse, SubmitQuestResponse } from '../types/quest'

interface QuestState {
  currentQuest: Quest | null
  userCode: string
  isRunningTests: boolean
  testResult: RunTestsResponse | null
  isSubmitting: boolean
  submitResult: SubmitQuestResponse | null
  error: string | null

  // Actions
  setQuest: (quest: Quest) => void
  setUserCode: (code: string) => void
  resetUserCode: () => void
  setIsRunningTests: (running: boolean) => void
  setTestResult: (result: RunTestsResponse | null) => void
  setIsSubmitting: (submitting: boolean) => void
  setSubmitResult: (result: SubmitQuestResponse | null) => void
  setError: (error: string | null) => void
  clearWorkspace: () => void
}

export const useQuestStore = create<QuestState>((set, get) => ({
  currentQuest: null,
  userCode: '',
  isRunningTests: false,
  testResult: null,
  isSubmitting: false,
  submitResult: null,
  error: null,

  setQuest: (quest) => {
    // If the user already submitted code previously or if starter code is provided, initialize code buffer
    const initialCode =
      quest.user_code_submission ||
      quest.starter_code?.content ||
      '// Tulis solusi kamu di sini\n'

    set({
      currentQuest: quest,
      userCode: initialCode,
      testResult: null,
      submitResult: null,
      error: null,
    })
  },

  setUserCode: (code) => set({ userCode: code }),

  resetUserCode: () => {
    const { currentQuest } = get()
    const starter = currentQuest?.starter_code?.content || '// Tulis solusi kamu di sini\n'
    set({ userCode: starter, testResult: null })
  },

  setIsRunningTests: (running) => set({ isRunningTests: running }),

  setTestResult: (result) => set({ testResult: result }),

  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

  setSubmitResult: (result) => set({ submitResult: result }),

  setError: (error) => set({ error }),

  clearWorkspace: () =>
    set({
      currentQuest: null,
      userCode: '',
      isRunningTests: false,
      testResult: null,
      isSubmitting: false,
      submitResult: null,
      error: null,
    }),
}))
