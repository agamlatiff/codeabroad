import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  useGuestTrialStore,
  type GuestCompletedLesson,
} from '@/features/auth/store/guestTrialStore'
import { curriculumService } from '@/features/curriculum/services/curriculumService'
import { exerciseService } from '@/features/exercise/services/exerciseService'
import { invalidateLearningSessionCaches } from '@/features/exercise/utils/sessionCache'

export interface GuestTrialSyncedSummary {
  lessonsCount: number
  xpEarned: number
}

let activeSyncPromise: Promise<GuestTrialSyncedSummary | null> | null = null

async function replayGuestTrialLessons(
  lessons: ReadonlyArray<GuestCompletedLesson>
): Promise<{
  lessonsCount: number
  syncedLessonIds: string[]
  obsoleteLessonIds: string[]
  xpEarned: number
  latestGamification: {
    xp: number
    current_level: number
    streak: number
    gems?: number
    last_active_at?: string | null
  } | null
}> {
  let syncedCount = 0
  let earnedXp = 0
  const syncedLessonIds: string[] = []
  const obsoleteLessonIds: string[] = []
  let latestGamification: {
    xp: number
    current_level: number
    streak: number
    gems?: number
    last_active_at?: string | null
  } | null = null

  // Replay chronologically (oldest first) so sequential Unit 1 prerequisites pass naturally.
  const chronological = [...lessons].reverse()

  for (const lesson of chronological) {
    if (lesson.attempts.length === 0) {
      obsoleteLessonIds.push(lesson.lessonId)
      continue
    }

    let anyAttemptAccepted = false
    for (const attempt of lesson.attempts) {
      try {
        await exerciseService.submitAnswer({
          exercise_id: attempt.exerciseId,
          user_answer: attempt.userAnswer,
          time_spent_seconds: attempt.timeSpentSeconds,
        })
        anyAttemptAccepted = true
      } catch {
        // Ignore individual locked/inactive-track/already-completed errors cleanly
      }
    }

    if (!anyAttemptAccepted) continue

    try {
      const completion = await curriculumService.completeLesson(lesson.lessonId, {
        lesson_id: lesson.lessonId,
        score: lesson.accuracyPercent,
      })
      syncedCount += 1
      syncedLessonIds.push(lesson.lessonId)
      earnedXp += completion.xp_earned ?? completion.session_xp_earned ?? lesson.xpReward
      if (completion.gamification) {
        latestGamification = {
          xp: completion.gamification.xp,
          current_level: completion.gamification.current_level,
          streak: completion.gamification.streak,
          gems: completion.gamification.gems ?? undefined,
          last_active_at: completion.gamification.last_active_at,
        }
      }
    } catch (completeErr) {
      // Remove lesson only when server confirms conflict (already completed), retaining transient failures for retry
      if (axios.isAxiosError(completeErr) && completeErr.response?.status === 409) {
        obsoleteLessonIds.push(lesson.lessonId)
      }
    }
  }

  return {
    lessonsCount: syncedCount,
    syncedLessonIds,
    obsoleteLessonIds,
    xpEarned: earnedXp,
    latestGamification,
  }
}

/**
 * Automatically carries over saved guest Unit-1 trial progress into the learner's
 * PostgreSQL account once authenticated and onboarded. Guarded with a single-flight lock.
 */
export const useGuestTrialSync = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const updateUser = useAuthStore((s) => s.updateUser)
  const completedLessons = useGuestTrialStore((s) => s.completedLessons)
  const removeCompletedLessons = useGuestTrialStore((s) => s.removeCompletedLessons)

  const [syncedSummary, setSyncedSummary] = useState<GuestTrialSyncedSummary | null>(null)
  const attemptedLessonIdsRef = useRef<Set<string>>(new Set())

  const dismissSyncedSummary = useCallback(() => {
    setSyncedSummary(null)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      attemptedLessonIdsRef.current.clear()
      return
    }
    if (!user?.is_onboarded || completedLessons.length === 0) {
      return
    }

    const pendingLessons = useGuestTrialStore
      .getState()
      .completedLessons.filter((lesson) => !attemptedLessonIdsRef.current.has(lesson.lessonId))
    if (pendingLessons.length === 0 && !activeSyncPromise) {
      return
    }

    let isMounted = true

    const runSync = async (
      snapshot: ReadonlyArray<GuestCompletedLesson>
    ): Promise<GuestTrialSyncedSummary | null> => {
      if (snapshot.length === 0) return null

      const result = await replayGuestTrialLessons(snapshot)
      removeCompletedLessons([...result.syncedLessonIds, ...result.obsoleteLessonIds])

      if (result.latestGamification) {
        updateUser(result.latestGamification)
      }

      if (result.lessonsCount > 0) {
        await invalidateLearningSessionCaches(queryClient, {
          includeCurriculum: true,
          includeLessonDetail: true,
          includeSrs: true,
          includeVocab: true,
        })
        return {
          lessonsCount: result.lessonsCount,
          xpEarned: result.xpEarned,
        }
      }
      return null
    }

    if (!activeSyncPromise) {
      for (const lesson of pendingLessons) {
        attemptedLessonIdsRef.current.add(lesson.lessonId)
      }
      activeSyncPromise = runSync(pendingLessons)
        .catch(() => null)
        .finally(() => {
          activeSyncPromise = null
        })
    }

    void activeSyncPromise.then((summary) => {
      if (isMounted && summary) {
        setSyncedSummary(summary)
      }
    })

    return () => {
      isMounted = false
    }
  }, [
    completedLessons.length,
    isAuthenticated,
    queryClient,
    removeCompletedLessons,
    updateUser,
    user?.id,
    user?.is_onboarded,
  ])

  return {
    syncedSummary,
    dismissSyncedSummary,
  }
}
