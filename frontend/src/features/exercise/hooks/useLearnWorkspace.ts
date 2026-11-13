import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  CURRICULUM_QUERY_KEY,
  LESSON_DETAIL_QUERY_KEY,
  curriculumService,
} from '@/features/curriculum/services/curriculumService'
import { LANGUAGE_ENROLLMENTS_QUERY_KEY } from '@/features/curriculum/services/languageService'
import { useActiveSpeechLocale } from '@/features/exercise/hooks/useActiveSpeechLocale'
import { useExerciseMedia } from '@/features/exercise/hooks/useExerciseMedia'
import { useExerciseQuestionInputs } from '@/features/exercise/hooks/useExerciseQuestionInputs'
import {
  SRS_DUE_QUERY_KEY,
  exerciseService,
} from '@/features/exercise/services/exerciseService'
import { resolveExerciseSpokenText } from '@/features/exercise/utils/exerciseHelpers'
import type {
  LessonCompletionNavigationState,
  SubmitExerciseAnswerResponse,
} from '@/features/exercise/types/exercise'
import { PROFILE_QUERY_KEY } from '@/features/user/services/userService'
import {
  DAILY_QUESTS_QUERY_KEY,
  DAILY_REWARDS_QUERY_KEY,
} from '@/shared/hooks/layout/right-sidebar/useQuestsSection'
import { ACTIVITY_LOGS_QUERY_KEY } from '@/shared/hooks/layout/right-sidebar/useStreakSection'
import { extractApiErrorMessage } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/api'
import { audioService } from '@/shared/services/audioService'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'

export const useLearnWorkspace = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const updateUser = useAuthStore((state) => state.updateUser)
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')

  // Session state keyed per route lesson ID cleanly during render on route change
  const [trackedLessonId, setTrackedLessonId] = useState<string | undefined>(id)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submittedResult, setSubmittedResult] =
    useState<SubmitExerciseAnswerResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isScoreTooLowError, setIsScoreTooLowError] = useState(false)
  const [isGrammarDrawerOpen, setIsGrammarDrawerOpen] = useState(false)
  const [correctExerciseIds, setCorrectExerciseIds] = useState<string[]>([])

  const questionStartedAtRef = useRef<number>(0)

  const lessonQuery = useQuery({
    queryKey: [...LESSON_DETAIL_QUERY_KEY, userId, id],
    queryFn: ({ signal }) => curriculumService.getLessonDetail(id!, { signal }),
    enabled: Boolean(id),
    retry: false,
  })

  const lesson = lessonQuery.data ?? null
  const exercises = useMemo(() => lesson?.exercises ?? [], [lesson])
  const currentExercise = exercises[currentIndex] ?? null
  const currentExerciseType = currentExercise?.exercise_type ?? ''

  const speechLocale = useActiveSpeechLocale()

  const {
    parsedContent,
    selectedTokenIndices,
    selectedTokens,
    selectedOptionValue,
    textInput,
    setTextInput,
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

  if (id !== trackedLessonId) {
    setTrackedLessonId(id)
    setCurrentIndex(0)
    setSubmittedResult(null)
    setSubmitError(null)
    setIsScoreTooLowError(false)
    setIsGrammarDrawerOpen(false)
    setCorrectExerciseIds([])
    resetInputs()
  }

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
    onTranscript: setTextInput,
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

  const isLastExercise =
    exercises.length > 0 && currentIndex >= exercises.length - 1

  const submitAnswerMutation = useMutation({
    mutationFn: (payload: {
      exercise_id: string
      user_answer: string
      time_spent_seconds: number
    }) => exerciseService.submitAnswer(payload),
  })

  const completeLessonMutation = useMutation({
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
  }, [resetInputs, stopMediaSession])

  const handlePlayAudio = useCallback(() => {
    if (!parsedContent) return
    playExerciseAudio(
      parsedContent.audioUrl,
      resolveExerciseSpokenText(parsedContent, currentExercise?.prompt)
    )
  }, [currentExercise?.prompt, parsedContent, playExerciseAudio])

  const handleCheckAnswer = useCallback(async () => {
    if (!currentExercise || !canCheckAnswer || submitAnswerMutation.isPending) {
      return
    }

    setSubmitError(null)
    const elapsedSeconds =
      questionStartedAtRef.current > 0
        ? Math.max(1, Math.round((Date.now() - questionStartedAtRef.current) / 1000))
        : 1

    try {
      const res = await submitAnswerMutation.mutateAsync({
        exercise_id: currentExercise.id,
        user_answer: currentUserAnswer,
        time_spent_seconds: elapsedSeconds,
      })

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
      setSubmitError(
        extractApiErrorMessage(err, 'Gagal mengirim jawaban. Coba lagi.')
      )
      triggerHaptic('error')
      audioEngine.playError()
    }
  }, [
    canCheckAnswer,
    currentExercise,
    currentUserAnswer,
    submitAnswerMutation,
  ])

  const handleCompleteLesson = useCallback(async () => {
    if (!lesson || completeLessonMutation.isPending) return

    setSubmitError(null)
    setIsScoreTooLowError(false)
    const total = Math.max(1, exercises.length)
    const accuracyPercent = Math.round((correctExerciseIds.length / total) * 100)

    try {
      const previousUser = useAuthStore.getState().user
      const completionResult = await completeLessonMutation.mutateAsync({
        lessonId: lesson.id,
        score: accuracyPercent,
      })

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
        completionResult.gamification && previousUser
          ? Math.max(0, completionResult.gamification.xp - previousUser.xp)
          : lesson.xp_reward

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CURRICULUM_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: LESSON_DETAIL_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: LANGUAGE_ENROLLMENTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: DAILY_QUESTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: DAILY_REWARDS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: SRS_DUE_QUERY_KEY }),
      ])

      triggerHaptic('success')

      const navState: LessonCompletionNavigationState = {
        completionResult,
        lesson,
        totalExercises: exercises.length,
        correctCount: correctExerciseIds.length,
        totalXpEarned: actualXpEarned,
        accuracyPercent,
      }

      navigate(`/learn/${lesson.id}/complete`, {
        replace: true,
        state: navState,
      })
    } catch (err) {
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
    }
  }, [
    completeLessonMutation,
    correctExerciseIds.length,
    exercises.length,
    lesson,
    navigate,
    queryClient,
    updateUser,
  ])

  const handleContinue = useCallback(() => {
    if (submittedResult === null && exercises.length > 0) return

    if (isLastExercise || exercises.length === 0) {
      void handleCompleteLesson()
      return
    }

    audioEngine.playPop()
    triggerHaptic('tap')
    setCurrentIndex((prev) => prev + 1)
    resetQuestionInputs()
  }, [
    exercises.length,
    handleCompleteLesson,
    isLastExercise,
    resetQuestionInputs,
    submittedResult,
  ])

  const handleExitToCurriculum = useCallback(() => {
    audioEngine.playPop()
    navigate('/curriculum')
  }, [navigate])

  const handleEnterShortcut = useCallback(() => {
    if (submittedResult === null && canCheckAnswer) {
      void handleCheckAnswer()
    }
  }, [canCheckAnswer, handleCheckAnswer, submittedResult])

  const progressPercent = useMemo(() => {
    if (exercises.length === 0) return 0
    const completedSteps = currentIndex + (submittedResult !== null ? 1 : 0)
    return Math.min(100, Math.round((completedSteps / exercises.length) * 100))
  }, [currentIndex, exercises.length, submittedResult])

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
    currentIndex,
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
    isLastExercise,
    isLoading: lessonQuery.isLoading,
    isError: lessonQuery.isError,
    lessonErrorMessage,
    isChecking: submitAnswerMutation.isPending,
    isCompleting: completeLessonMutation.isPending,
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
