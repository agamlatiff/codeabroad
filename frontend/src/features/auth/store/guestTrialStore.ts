import { create } from 'zustand'
import { z } from 'zod'

export const GUEST_TRIAL_STORAGE_KEY = 'merantalk_guest_trial_v1'
const MAX_STORED_TRIAL_LESSONS = 5
const MAX_ATTEMPTS_PER_LESSON = 30

const guestTrialAttemptSchema = z.object({
  exerciseId: z.string().min(1),
  userAnswer: z.string().min(1).max(2000),
  timeSpentSeconds: z.number().int().min(0).max(86400),
})

const guestCompletedLessonSchema = z.object({
  lessonId: z.string().min(1),
  lessonSlug: z.string().optional(),
  lessonTitle: z.string().min(1),
  xpReward: z.number().int().min(0).max(500),
  accuracyPercent: z.number().int().min(0).max(100),
  completedAt: z.string().min(1),
  attempts: z.array(guestTrialAttemptSchema).max(MAX_ATTEMPTS_PER_LESSON).default([]),
})

const guestTrialPersistedSchema = z.object({
  completedLessons: z.array(guestCompletedLessonSchema).max(MAX_STORED_TRIAL_LESSONS).default([]),
  demoCompleted: z.boolean().default(false),
  promptDismissedCount: z.number().int().min(0).default(0),
})

export type GuestTrialAttempt = z.infer<typeof guestTrialAttemptSchema>
export type GuestCompletedLesson = z.infer<typeof guestCompletedLessonSchema>
type GuestTrialPersistedState = z.infer<typeof guestTrialPersistedSchema>

export interface GuestTrialState extends GuestTrialPersistedState {
  recordCompletedLesson: (entry: GuestCompletedLesson) => void
  markDemoCompleted: () => void
  incrementPromptDismissed: () => void
  clearGuestTrial: () => void
}

const probeLocalStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null
  try {
    const probeKey = '__merantalk_guest_probe__'
    window.localStorage.setItem(probeKey, '1')
    window.localStorage.removeItem(probeKey)
    return window.localStorage
  } catch {
    return null
  }
}

const cachedStorage = probeLocalStorage()

const EMPTY_PERSISTED_STATE: GuestTrialPersistedState = {
  completedLessons: [],
  demoCompleted: false,
  promptDismissedCount: 0,
}

const loadPersistedGuestTrial = (): GuestTrialPersistedState => {
  if (!cachedStorage) return EMPTY_PERSISTED_STATE
  try {
    const raw = cachedStorage.getItem(GUEST_TRIAL_STORAGE_KEY)
    if (!raw) return EMPTY_PERSISTED_STATE
    const parsed = guestTrialPersistedSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      cachedStorage.removeItem(GUEST_TRIAL_STORAGE_KEY)
      return EMPTY_PERSISTED_STATE
    }
    return parsed.data
  } catch {
    return EMPTY_PERSISTED_STATE
  }
}

const savePersistedGuestTrial = (state: GuestTrialPersistedState): void => {
  if (!cachedStorage) return
  try {
    cachedStorage.setItem(GUEST_TRIAL_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage quota / private mode restrictions
  }
}

export const getGuestTotalXp = (completedLessons: ReadonlyArray<GuestCompletedLesson>): number =>
  completedLessons.reduce((sum, item) => sum + item.xpReward, 0)

export const isGuestLessonCompleted = (
  completedLessons: ReadonlyArray<GuestCompletedLesson>,
  idOrSlug?: string | null
): boolean => {
  if (!idOrSlug) return false
  const target = idOrSlug.trim().toLowerCase()
  return completedLessons.some(
    (item) =>
      item.lessonId.toLowerCase() === target ||
      (item.lessonSlug ? item.lessonSlug.toLowerCase() === target : false)
  )
}

export const findGuestCompletedLesson = (
  completedLessons: ReadonlyArray<GuestCompletedLesson>,
  idOrSlug?: string | null
): GuestCompletedLesson | null => {
  if (!idOrSlug) return null
  const target = idOrSlug.trim().toLowerCase()
  return (
    completedLessons.find(
      (item) =>
        item.lessonId.toLowerCase() === target ||
        (item.lessonSlug ? item.lessonSlug.toLowerCase() === target : false)
    ) ?? null
  )
}

const initialState = loadPersistedGuestTrial()

export const useGuestTrialStore = create<GuestTrialState>((set, get) => ({
  ...initialState,

  recordCompletedLesson: (entry) => {
    const sanitizedEntry: GuestCompletedLesson = {
      ...entry,
      attempts: entry.attempts.slice(0, MAX_ATTEMPTS_PER_LESSON),
    }

    const current = get()
    const filtered = current.completedLessons.filter(
      (item) => item.lessonId !== sanitizedEntry.lessonId
    )
    const nextLessons = [sanitizedEntry, ...filtered].slice(0, MAX_STORED_TRIAL_LESSONS)

    const nextPersisted: GuestTrialPersistedState = {
      completedLessons: nextLessons,
      demoCompleted: current.demoCompleted,
      promptDismissedCount: current.promptDismissedCount,
    }
    savePersistedGuestTrial(nextPersisted)
    set(nextPersisted)
  },

  markDemoCompleted: () => {
    const current = get()
    if (current.demoCompleted) return
    const nextPersisted: GuestTrialPersistedState = {
      completedLessons: current.completedLessons,
      demoCompleted: true,
      promptDismissedCount: current.promptDismissedCount,
    }
    savePersistedGuestTrial(nextPersisted)
    set({ demoCompleted: true })
  },

  incrementPromptDismissed: () => {
    const current = get()
    const nextCount = current.promptDismissedCount + 1
    const nextPersisted: GuestTrialPersistedState = {
      completedLessons: current.completedLessons,
      demoCompleted: current.demoCompleted,
      promptDismissedCount: nextCount,
    }
    savePersistedGuestTrial(nextPersisted)
    set({ promptDismissedCount: nextCount })
  },

  clearGuestTrial: () => {
    if (cachedStorage) {
      try {
        cachedStorage.removeItem(GUEST_TRIAL_STORAGE_KEY)
      } catch {
        // Ignore storage errors
      }
    }
    set(EMPTY_PERSISTED_STATE)
  },
}))
