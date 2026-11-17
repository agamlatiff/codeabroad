import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { z } from 'zod'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  LESSON_DETAIL_QUERY_KEY,
  curriculumService,
} from '@/features/curriculum/services/curriculumService'
import { useActiveSpeechLocale } from '@/features/exercise/hooks/useActiveSpeechLocale'
import { useExerciseMedia } from '@/features/exercise/hooks/useExerciseMedia'
import { useExerciseQuestionInputs } from '@/features/exercise/hooks/useExerciseQuestionInputs'
import { exerciseService } from '@/features/exercise/services/exerciseService'
import { invalidateLearningSessionCaches } from '@/features/exercise/utils/sessionCache'
import {
  computeElapsedSeconds,
  resolveExerciseSpokenText,
} from '@/features/exercise/utils/exerciseHelpers'
import type {
  LessonCompletionNavigationState,
  SubmitExerciseAnswerResponse,
} from '@/features/exercise/types/exercise'
import { extractApiErrorMessage } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/api'
import { audioService } from '@/shared/services/audioService'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'

const lessonDraftSchema = z.object({
  currentIndex: z.number().int().min(0),
  correctExerciseIds: z.array(z.string()),
})

const getLessonDraftKey = (userId: string, lessonId?: string) =>
  lessonId ? `codeabroad_lesson_draft:${userId}:${lessonId}` : null

const loadLessonDraft = (userId: string, lessonId?: string) => {
  const key = getLessonDraftKey(userId, lessonId)
  if (!key) return { currentIndex: 0, correctExerciseIds: [] as string[] }
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return { currentIndex: 0, correctExerciseIds: [] as string[] }
    const parsed = lessonDraftSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      sessionStorage.removeItem(key)
      return { currentIndex: 0, correctExerciseIds: [] as string[] }
    }
    return parsed.data
  } catch {
    return { currentIndex: 0, correctExerciseIds: [] as string[] }
  }
}

export const useLearnWorkspace = (id?: string) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const updateUser = useAuthStore((state) => state.updateUser)
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')

  const initialDraft = useMemo(() => loadLessonDraft(userId, id), [userId, id])
  const [currentIndex, setCurrentIndex] = useState(initialDraft.currentIndex)
  const [submittedResult, setSubmittedResult] =
    useState<SubmitExerciseAnswerResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isScoreTooLowError, setIsScoreTooLowError] = useState(false)
  const [isGrammarDrawerOpen, setIsGrammarDrawerOpen] = useState(false)
  const [correctExerciseIds, setCorrectExerciseIds] = useState<string[]>(
    initialDraft.correctExerciseIds
  )

  const questionStartedAtRef = useRef<number>(0)
  const submitLockRef = useRef(false)
  const sessionEpochRef = useRef(0)

  const lessonQuery = useQuery({
    queryKey: [...LESSON_DETAIL_QUERY_KEY, userId, id],
    queryFn: ({ signal }) => curriculumService.getLessonDetail(id!, { signal }),
    enabled: Boolean(id),
    retry: false,
  })

  const lesson = lessonQuery.data ?? null
  const exercises = useMemo(() => lesson?.exercises ?? [], [lesson])
  const safeIndex = exercises.length > 0 ? Math.min(currentIndex, exercises.length - 1) : 0
  const currentExercise = exercises[safeIndex] ?? null
  const currentExerciseType = currentExercise?.exercise_type ?? ''

  const speechLocale = useActiveSpeechLocale()

  const {
    parsedContent,
    selectedTokenIndices,
    selectedTokens,
    selectedOptionValue,
    textInput,
    showHint,
    currentUserAnswer,
    canCheckAnswer,
    resolvedCorrectAnswer,
    resetInputs,
    handleAddToken,
    handleRemoveToken,
    handleClearTokens,
    handleSelectOption,
    handleSetTextInput,
    handleConfirmSpokenSample,
    handleToggleHint,
  } = useExerciseQuestionInputs({
    currentExercise,
    submittedResult,
  })

  useEffect(() => {
    const key = getLessonDraftKey(userId, id)
    if (!key) return
    try {
      sessionStorage.setItem(
        key,
        JSON.stringify({ currentIndex: safeIndex, correctExerciseIds })
      )
    } catch {
      // Ignore storage quota errors
    }
  }, [correctExerciseIds, id, safeIndex, userId])

  const {
    isSpeakingAudio,
    isRecordingSpeech,
    speechRecognitionSupported,
    audioPlaybackError,
    stopMediaSession,
    handlePlayAudio: playExerciseAudio,
    handleToggleRecording,
  } = useExerciseMedia({
    speechLocale,
    isLocked: submittedResult !== null,
    onTranscript: handleSetTextInput,
  })

  useEffect(() => {
    questionStartedAtRef.current = Date.now()
  }, [id, currentIndex])

  useEffect(() => {
    stopMediaSession()
  }, [id, stopMediaSession])

  // Ambient soundscape while inside lesson player
  useEffect(() => {
    audioService.playBgm('universal')
    return () => {
      audioService.stopBgm()
    }
  }, [])

  const {
    mutateAsync: submitAnswerAsync,
    isPending: isSubmittingAnswer,
  } = useMutation({
    mutationFn: (payload: {
      exercise_id: string
      user_answer: string
      time_spent_seconds: number
    }) => exerciseService.submitAnswer(payload),
  })

  const {
    mutateAsync: completeLessonAsync,
    isPending: isCompletingLesson,
  } = useMutation({
    mutationFn: (payload: { lessonId: string; score: number }) =>
      curriculumService.completeLesson(payload.lessonId, {
        lesson_id: payload.lessonId,
        score: payload.score,
      }),
  })

  const resetQuestionInputs = useCallback(() => {
    stopMediaSession()
    resetInputs()
    setSubmittedResult(null)
    setSubmitError(null)
    setIsScoreTooLowError(false)
    questionStartedAtRef.current = Date.now()
  }, [resetInputs, stopMediaSession])

  const handleRetryLesson = useCallback(() => {
    sessionEpochRef.current += 1
    submitLockRef.current = false
    stopMediaSession()
    triggerHaptic('tap')
    audioEngine.playPop()
    resetInputs()
    setCurrentIndex(0)
    setCorrectExerciseIds([])
    setSubmittedResult(null)
    setSubmitError(null)
    setIsScoreTooLowError(false)
    questionStartedAtRef.current = Date.now()
    const key = getLessonDraftKey(userId, id)
    if (key) sessionStorage.removeItem(key)
  }, [id, resetInputs, stopMediaSession, userId])

  const handlePlayAudio = useCallback(() => {
    if (!parsedContent) return
    playExerciseAudio(
      parsedContent.audioUrl,
      resolveExerciseSpokenText(parsedContent, currentExercise?.prompt)
    )
  }, [currentExercise?.prompt, parsedContent, playExerciseAudio])

  const handleCheckAnswer = useCallback(async () => {
    if (
      !currentExercise ||
      !canCheckAnswer ||
      isSubmittingAnswer ||
      submitLockRef.current
    ) {
      return
    }

    submitLockRef.current = true
    const epoch = sessionEpochRef.current
    stopMediaSession()
    setSubmitError(null)
    const elapsedSeconds = computeElapsedSeconds(questionStartedAtRef.current)

    try {
      const res = await submitAnswerAsync({
        exercise_id: currentExercise.id,
        user_answer: currentUserAnswer,
        time_spent_seconds: elapsedSeconds,
      })

      if (epoch !== sessionEpochRef.current) return
      setSubmittedResult(res)
      if (res.is_correct) {
        triggerHaptic('success')
        audioEngine.playSuccess()
        setCorrectExerciseIds((prev) =>
          prev.includes(currentExercise.id) ? prev : [...prev, currentExercise.id]
        )
      } else {
        triggerHaptic('error')
        audioEngine.playError()
      }
    } catch (err) {
      if (epoch !== sessionEpochRef.current) return
      setSubmitError(
        extractApiErrorMessage(err, 'Gagal mengirim jawaban. Coba lagi.')
      )
      triggerHaptic('error')
      audioEngine.playError()
    } finally {
      submitLockRef.current = false
    }
  }, [
    canCheckAnswer,
    currentExercise,
    currentUserAnswer,
    isSubmittingAnswer,
    stopMediaSession,
    submitAnswerAsync,
  ])

  const handleCompleteLesson = useCallback(async () => {
    if (!lesson || isCompletingLesson || submitLockRef.current) return

    submitLockRef.current = true
    const epoch = sessionEpochRef.current
    setSubmitError(null)
    setIsScoreTooLowError(false)
    const total = Math.max(1, exercises.length)
    const accuracyPercent = Math.floor((correctExerciseIds.length / total) * 100)

    try {
      const previousUser = useAuthStore.getState().user
      const completionResult = await completeLessonAsync({
        lessonId: lesson.id,
        score: accuracyPercent,
      })

      if (epoch !== sessionEpochRef.current) return

      const key = getLessonDraftKey(userId, lesson.id)
      if (key) sessionStorage.removeItem(key)

      if (completionResult.gamification) {
        updateUser({
          xp: completionResult.gamification.xp,
          current_level: completionResult.gamification.current_level,
          streak: completionResult.gamification.streak,
          gems: completionResult.gamification.gems,
          last_active_at: completionResult.gamification.last_active_at,
        })
      }

      const actualXpEarned =
        completionResult.session_xp_earned ??
        (completionResult.gamification && previousUser
          ? Math.max(0, completionResult.gamification.xp - previousUser.xp)
          : lesson.xp_reward)

      await invalidateLearningSessionCaches(queryClient, {
        includeCurriculum: true,
        includeLessonDetail: true,
        includeSrs: true,
        includeVocab: true,
      })

      triggerHaptic('success')

      const navState: LessonCompletionNavigationState = {
        completionResult,
        lesson,
        totalExercises: exercises.length,
        correctCount: correctExerciseIds.length,
        totalXpEarned: actualXpEarned,
        accuracyPercent: completionResult.session_score ?? accuracyPercent,
      }

      navigate(`/learn/${lesson.id}/complete`, {
        replace: true,
        state: navState,
      })
    } catch (err) {
      if (epoch !== sessionEpochRef.current) return
      const errorCode = isAxiosError<ApiResponse<unknown>>(err)
        ? err.response?.data?.code
        : undefined
      if (errorCode === 'LESSON_SCORE_TOO_LOW') {
        setIsScoreTooLowError(true)
        setSubmitError(
          `Akurasi sesi kamu ${accuracyPercent}% (minimal 60% untuk lulus). Ulangi latihan untuk melanjutkan.`
        )
      } else {
        setIsScoreTooLowError(false)
        setSubmitError(
          extractApiErrorMessage(
            err,
            'Gagal menyelesaikan pelajaran. Pastikan semua soal telah terjawab.'
          )
        )
      }
      triggerHaptic('error')
      audioEngine.playError()
    } finally {
      submitLockRef.current = false
    }
  }, [
    completeLessonAsync,
    correctExerciseIds.length,
    exercises.length,
    isCompletingLesson,
    lesson,
    navigate,
    queryClient,
    updateUser,
    userId,
  ])

  const handleContinue = useCallback(() => {
    if (submittedResult === null && exercises.length > 0) return

    if (safeIndex >= exercises.length - 1 || exercises.length === 0) {
      void handleCompleteLesson()
      return
    }

    audioEngine.playPop()
    triggerHaptic('tap')
    setCurrentIndex((prev) => Math.min(exercises.length - 1, prev + 1))
    resetQuestionInputs()
  }, [
    exercises.length,
    handleCompleteLesson,
    resetQuestionInputs,
    safeIndex,
    submittedResult,
  ])

  const handleExitToCurriculum = useCallback(() => {
    stopMediaSession()
    audioEngine.playPop()
    navigate('/curriculum')
  }, [navigate, stopMediaSession])

  const handleEnterShortcut = useCallback(() => {
    if (isSubmittingAnswer || isCompletingLesson || submitLockRef.current || isScoreTooLowError) {
      return
    }
    if (submittedResult === null) {
      if (canCheckAnswer) {
        void handleCheckAnswer()
      }
      return
    }
    handleContinue()
  }, [
    canCheckAnswer,
    handleCheckAnswer,
    handleContinue,
    isCompletingLesson,
    isScoreTooLowError,
    isSubmittingAnswer,
    submittedResult,
  ])

  const progressPercent = useMemo(() => {
    if (exercises.length === 0) return 0
    const completedSteps = safeIndex + (submittedResult !== null ? 1 : 0)
    return Math.min(100, Math.round((completedSteps / exercises.length) * 100))
  }, [exercises.length, safeIndex, submittedResult])

  const lessonErrorMessage = lessonQuery.isError
    ? extractApiErrorMessage(
        lessonQuery.error,
        'Gagal memuat detail pelajaran dari server.'
      )
    : null

  return {
    lessonId: id,
    lesson,
    exercises,
    currentExercise,
    currentExerciseType,
    parsedContent,
    currentIndex: safeIndex,
    progressPercent,
    resolvedCorrectAnswer,
    selectedTokenIndices,
    selectedTokens,
    selectedOptionValue,
    textInput,
    submittedResult,
    submitError,
    isScoreTooLowError,
    showHint,
    isGrammarDrawerOpen,
    setIsGrammarDrawerOpen,
    isSpeakingAudio,
    isRecordingSpeech,
    speechRecognitionSupported,
    audioPlaybackError,
    correctCount: correctExerciseIds.length,
    canCheckAnswer,
    isLastExercise: exercises.length > 0 && safeIndex >= exercises.length - 1,
    isLoading: lessonQuery.isLoading,
    isError: lessonQuery.isError,
    lessonErrorMessage,
    isChecking: isSubmittingAnswer,
    isCompleting: isCompletingLesson,
    refetchLesson: lessonQuery.refetch,
    handleAddToken,
    handleRemoveToken,
    handleClearTokens,
    handleSelectOption,
    handleSetTextInput,
    handleConfirmSpokenSample,
    handlePlayAudio,
    handleToggleRecording,
    handleCheckAnswer,
    handleContinue,
    handleRetryLesson,
    handleToggleHint,
    handleExitToCurriculum,
    handleEnterShortcut,
  }
}
