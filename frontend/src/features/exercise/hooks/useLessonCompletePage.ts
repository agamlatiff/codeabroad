import { useCallback, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  curriculumService,
  LESSON_DETAIL_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
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
  const fanfarePlayedRef = useRef(false)

  const state = (location.state ?? null) as LessonCompletionNavigationState | null

  const fallbackLessonQuery = useQuery({
    queryKey: [...LESSON_DETAIL_QUERY_KEY, user?.id ?? 'anonymous', id],
    queryFn: ({ signal }) => curriculumService.getLessonDetail(id!, { signal }),
    enabled: state === null && Boolean(id),
    retry: false,
  })

  useEffect(() => {
    if (state !== null) return
    if (fallbackLessonQuery.isError) {
      navigate('/curriculum', { replace: true })
      return
    }
    if (fallbackLessonQuery.data && !fallbackLessonQuery.data.is_completed) {
      navigate(id ? `/learn/${id}` : '/curriculum', { replace: true })
    }
  }, [fallbackLessonQuery.data, fallbackLessonQuery.isError, id, navigate, state])

  const isConfirmedCompleted =
    state !== null || fallbackLessonQuery.data?.is_completed === true

  useEffect(() => {
    if (!isConfirmedCompleted || fanfarePlayedRef.current) return
    fanfarePlayedRef.current = true
    audioEngine.playFanfare()
  }, [isConfirmedCompleted])

  const completionResult = state?.completionResult
  const lesson = state?.lesson ?? fallbackLessonQuery.data ?? null

  const lessonTitle = lesson?.title ?? 'Pelajaran Kurikulum'
  const xpEarned =
    state?.totalXpEarned ??
    (lesson?.is_skipped ? 0 : lesson?.xp_reward ?? 0)
  const totalXp = completionResult?.gamification?.xp ?? user?.xp ?? xpEarned
  const streakDays = completionResult?.gamification?.streak ?? user?.streak ?? 0
  const currentLevel =
    completionResult?.gamification?.current_level ?? user?.current_level ?? 1
  const accuracyPercent =
    completionResult?.progress?.score ??
    state?.accuracyPercent ??
    lesson?.score ??
    0
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

