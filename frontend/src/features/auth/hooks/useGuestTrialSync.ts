import { useCallback, useEffect, useState } from 'react'
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
    if (lesson.attempts.length === 0) continue

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
    } catch {
      // Lesson may already be completed or scored below passing threshold — keep other lessons syncing
    }
  }

  return {
    lessonsCount: syncedCount,
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
  const clearGuestTrial = useGuestTrialStore((s) => s.clearGuestTrial)

  const [syncedSummary, setSyncedSummary] = useState<GuestTrialSyncedSummary | null>(null)

  const dismissSyncedSummary = useCallback(() => {
    setSyncedSummary(null)
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !user?.is_onboarded || completedLessons.length === 0) {
      return
    }
    if (activeSyncPromise) {
      return
    }

    let isMounted = true

    const runSync = async (): Promise<GuestTrialSyncedSummary | null> => {
      const snapshot = useGuestTrialStore.getState().completedLessons
      if (snapshot.length === 0) return null

      const result = await replayGuestTrialLessons(snapshot)
      clearGuestTrial()

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

    activeSyncPromise = runSync()
      .then((summary) => {
        if (isMounted && summary) {
          setSyncedSummary(summary)
        }
        return summary
      })
      .catch(() => null)
      .finally(() => {
        activeSyncPromise = null
      })

    return () => {
      isMounted = false
    }
  }, [clearGuestTrial, completedLessons.length, isAuthenticated, queryClient, updateUser, user?.id, user?.is_onboarded])

  return {
    syncedSummary,
    dismissSyncedSummary,
  }
}
