import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  findGuestCompletedLesson,
  getGuestTotalXp,
  useGuestTrialStore,
} from '@/features/auth/store/guestTrialStore'
import {
  curriculumService,
  LESSON_DETAIL_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
import {
  buildDynamicLessonIntroDeck,
  type LessonIntroItem,
} from '@/features/exercise/constants/lessonIntroCards'
import type { LessonCompletionNavigationState } from '@/features/exercise/types/exercise'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'
import { useActiveSpeechLocale } from '@/features/exercise/hooks/useActiveSpeechLocale'

/**
 * Headless hook powering the lesson completion summary view (/learn/:id/complete).
 */
export const useLessonCompletePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((state) => state.user)
  const isGuest = !user
  const guestLessons = useGuestTrialStore((state) => state.completedLessons)
  const guestFallback = useMemo(
    () => (isGuest ? findGuestCompletedLesson(guestLessons, id) : null),
    [guestLessons, id, isGuest]
  )
  const guestPendingTotalXp = useMemo(
    () => getGuestTotalXp(guestLessons),
    [guestLessons]
  )
  const speechLocale = useActiveSpeechLocale()
  const fanfarePlayedRef = useRef(false)

  const rawState = (location.state ?? null) as LessonCompletionNavigationState | null
  const state =
    rawState && (!id || rawState.lesson?.id === id || rawState.lesson?.slug === id)
      ? rawState
      : null

  const fallbackLessonQuery = useQuery({
    queryKey: [...LESSON_DETAIL_QUERY_KEY, user?.id ?? 'anonymous', id],
    queryFn: ({ signal }) => curriculumService.getLessonDetail(id!, { signal }),
    enabled: state === null && Boolean(id),
    retry: false,
  })

  useEffect(() => {
    if (state !== null || guestFallback !== null) return
    if (!id || fallbackLessonQuery.isError) {
      navigate('/curriculum', { replace: true })
      return
    }
    if (fallbackLessonQuery.data && !fallbackLessonQuery.data.is_completed) {
      navigate(`/learn/${id}`, { replace: true })
    }
  }, [fallbackLessonQuery.data, fallbackLessonQuery.isError, guestFallback, id, navigate, state])

  const isConfirmedCompleted =
    state !== null ||
    guestFallback !== null ||
    fallbackLessonQuery.data?.is_completed === true

  useEffect(() => {
    if (!isConfirmedCompleted || fanfarePlayedRef.current) return
    fanfarePlayedRef.current = true
    audioEngine.playFanfare()
  }, [isConfirmedCompleted])

  const completionResult = state?.completionResult
  const lesson = state?.lesson ?? fallbackLessonQuery.data ?? null

  const isGuestTrial = Boolean(state?.isGuestTrial || (isGuest && guestFallback))
  const lessonTitle = lesson?.title ?? guestFallback?.lessonTitle ?? 'Pelajaran Kurikulum'
  const xpEarned =
    state?.totalXpEarned ??
    guestFallback?.xpReward ??
    (lesson?.is_skipped ? 0 : lesson?.xp_reward ?? 0)
  const totalXp =
    completionResult?.gamification?.xp ??
    user?.xp ??
    (isGuest ? guestPendingTotalXp || xpEarned : xpEarned)
  const streakDays = completionResult?.gamification?.streak ?? user?.streak ?? 0
  const currentLevel =
    completionResult?.gamification?.current_level ?? user?.current_level ?? 1
  const accuracyPercent =
    completionResult?.progress?.score ??
    state?.accuracyPercent ??
    guestFallback?.accuracyPercent ??
    lesson?.score ??
    0
  const unlockedNextLessonId = completionResult?.unlocked_next_lesson_id ?? null
  const unlockedNextLessonTarget =
    completionResult?.unlocked_next_lesson_slug || unlockedNextLessonId
  const awardedBadges = completionResult?.awarded_badges ?? []

  const learnedItems: LessonIntroItem[] = useMemo(() => {
    if (!lesson) return []
    const deck = buildDynamicLessonIntroDeck(lesson)
    if (deck?.items && deck.items.length > 0) {
      return deck.items.slice(0, 6)
    }
    return (lesson.study_items ?? []).slice(0, 6).map((item) => ({
      symbol: item.symbol,
      reading: item.reading,
      meaning: item.meaning,
      mnemonic: item.mnemonic,
      speakText: item.speak_text || item.symbol,
    }))
  }, [lesson])

  const handleNextLesson = useCallback(() => {
    triggerHaptic('success')
    audioEngine.playSuccess()
    if (unlockedNextLessonTarget) {
      navigate(`/learn/${unlockedNextLessonTarget}`)
      return
    }
    navigate('/curriculum')
  }, [navigate, unlockedNextLessonTarget])

  const handleReplayLesson = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.playPop()
    const targetLesson = lesson?.slug || lesson?.id || id
    if (targetLesson) {
      navigate(`/learn/${targetLesson}`)
      return
    }
    navigate('/curriculum')
  }, [id, lesson?.id, lesson?.slug, navigate])

  const handleBackToCurriculum = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.playPop()
    navigate('/curriculum')
  }, [navigate])

  const handleOpenFlashcards = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.playPop()
    const combined = `${lesson?.slug ?? ''} ${lesson?.title ?? ''}`.toLowerCase()
    const levelMatch = combined.match(/\b(n[1-5])\b/i)
    const targetLevel = levelMatch ? levelMatch[1].toUpperCase() : 'N5'
    const category = combined.includes('katakana')
      ? 'katakana'
      : combined.includes('kanji')
        ? 'kanji'
        : combined.includes('hiragana') || combined.includes('vokal')
          ? 'hiragana'
          : 'vocab'
    navigate(`/flashcards?level=${targetLevel}&category=${category}`)
  }, [lesson?.slug, lesson?.title, navigate])

  return {
    isLoading: !isConfirmedCompleted,
    isGuestTrial,
    guestPendingTotalXp,
    lessonTitle,
    xpEarned,
    totalXp,
    streakDays,
    currentLevel,
    accuracyPercent,
    unlockedNextLessonId,
    awardedBadges,
    learnedItems,
    speechLocale,
    handleNextLesson,
    handleReplayLesson,
    handleBackToCurriculum,
    handleOpenFlashcards,
  }
}

