import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { LessonCompletionNavigationState } from '@/features/exercise/types/exercise'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'

/**
 * Headless hook powering the lesson completion summary view (/learn/:id/complete).
 */
export const useLessonCompletePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((state) => state.user)

  const state = (location.state ?? null) as LessonCompletionNavigationState | null

  useEffect(() => {
    audioEngine.playFanfare()
  }, [])

  const completionResult = state?.completionResult
  const lesson = state?.lesson

  const lessonTitle = lesson?.title ?? 'Pelajaran Kurikulum'
  const xpEarned = state?.totalXpEarned ?? lesson?.xp_reward ?? 15
  const totalXp = completionResult?.gamification?.xp ?? user?.xp ?? xpEarned
  const streakDays = completionResult?.gamification?.streak ?? user?.streak ?? 1
  const currentLevel =
    completionResult?.gamification?.current_level ?? user?.current_level ?? 1
  const accuracyPercent =
    state?.accuracyPercent ?? completionResult?.progress?.score ?? 100
  const unlockedNextLessonId = completionResult?.unlocked_next_lesson_id ?? null
  const awardedBadges = completionResult?.awarded_badges ?? []

  const handleNextLesson = useCallback(() => {
    triggerHaptic('success')
    audioEngine.playSuccess()
    if (unlockedNextLessonId) {
      navigate(`/learn/${unlockedNextLessonId}`)
      return
    }
    navigate('/curriculum')
  }, [navigate, unlockedNextLessonId])

  const handleReplayLesson = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.playPop()
    const targetLessonId = lesson?.id ?? id
    if (targetLessonId) {
      navigate(`/learn/${targetLessonId}`)
      return
    }
    navigate('/curriculum')
  }, [id, lesson?.id, navigate])

  const handleBackToCurriculum = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.playPop()
    navigate('/curriculum')
  }, [navigate])

  return {
    lessonTitle,
    xpEarned,
    totalXp,
    streakDays,
    currentLevel,
    accuracyPercent,
    unlockedNextLessonId,
    awardedBadges,
    handleNextLesson,
    handleReplayLesson,
    handleBackToCurriculum,
  }
}

