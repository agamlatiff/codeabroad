import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  CURRICULUM_QUERY_KEY,
  LESSON_DETAIL_QUERY_KEY,
  curriculumService,
} from '@/features/curriculum/services/curriculumService'
import {
  LANGUAGE_ENROLLMENTS_QUERY_KEY,
  languageService,
} from '@/features/curriculum/services/languageService'
import { useExerciseMedia } from '@/features/exercise/hooks/useExerciseMedia'
import { exerciseService } from '@/features/exercise/services/exerciseService'
import {
  formatUserAnswerForSubmission,
  parseExerciseContent,
  resolveSpeechLocale,
} from '@/features/exercise/utils/exerciseHelpers'
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
import { audioService } from '@/shared/services/audioService'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'

export const useLearnWorkspace = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const updateUser = useAuthStore((state) => state.updateUser)

  // Session state keyed per route lesson ID cleanly during render on route change
  const [trackedLessonId, setTrackedLessonId] = useState<string | undefined>(id)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTokenIndices, setSelectedTokenIndices] = useState<number[]>([])
  const [selectedOptionValue, setSelectedOptionValue] = useState('')
  const [textInput, setTextInput] = useState('')
  const [submittedResult, setSubmittedResult] =
    useState<SubmitExerciseAnswerResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [isGrammarDrawerOpen, setIsGrammarDrawerOpen] = useState(false)
  const [correctExerciseIds, setCorrectExerciseIds] = useState<string[]>([])

  const questionStartedAtRef = useRef<number>(0)

  if (id !== trackedLessonId) {
    setTrackedLessonId(id)
    setCurrentIndex(0)
    setSelectedTokenIndices([])
    setSelectedOptionValue('')
    setTextInput('')
    setSubmittedResult(null)
    setSubmitError(null)
    setShowHint(false)
    setIsGrammarDrawerOpen(false)
    setCorrectExerciseIds([])
  }

  useEffect(() => {
    questionStartedAtRef.current = Date.now()
  }, [id, currentIndex])

  // Ambient soundscape while inside lesson player
  useEffect(() => {
    audioService.playBgm('universal')
    return () => {
      audioService.stopBgm()
    }
  }, [])

  const lessonQuery = useQuery({
    queryKey: [...LESSON_DETAIL_QUERY_KEY, id],
    queryFn: ({ signal }) => curriculumService.getLessonDetail(id!, { signal }),
    enabled: Boolean(id),
    retry: false,
  })

  const enrollmentsQuery = useQuery({
    queryKey: LANGUAGE_ENROLLMENTS_QUERY_KEY,
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    staleTime: 60_000,
    retry: false,
  })

  const speechLocale = useMemo(() => {
    const enrollments = enrollmentsQuery.data ?? []
    const active = enrollments.find((item) => item.is_active) ?? enrollments[0]
    return resolveSpeechLocale(active?.language?.code)
  }, [enrollmentsQuery.data])

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
    stopMediaSession()
  }, [id, stopMediaSession])

  const lesson = lessonQuery.data ?? null
  const exercises = useMemo(() => lesson?.exercises ?? [], [lesson])
  const currentExercise = exercises[currentIndex] ?? null
  const parsedContent = useMemo(
    () => (currentExercise ? parseExerciseContent(currentExercise) : null),
    [currentExercise]
  )

  const selectedTokens = useMemo(() => {
    if (!parsedContent) return []
    return selectedTokenIndices
      .map((tokenIdx) => parsedContent.tokens[tokenIdx])
      .filter((token): token is string => typeof token === 'string')
  }, [parsedContent, selectedTokenIndices])

  const currentExerciseType = currentExercise?.exercise_type ?? ''

  const currentUserAnswer = useMemo(() => {
    if (!currentExercise) return ''
    return formatUserAnswerForSubmission(currentExercise, {
      selectedTokens,
      selectedOptionValue,
      textInput,
    })
  }, [currentExercise, selectedTokens, selectedOptionValue, textInput])

  const canCheckAnswer =
    currentExercise !== null &&
    submittedResult === null &&
    currentUserAnswer.length > 0

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
    setSelectedTokenIndices([])
    setSelectedOptionValue('')
    setTextInput('')
    setSubmittedResult(null)
    setSubmitError(null)
    setShowHint(false)
    questionStartedAtRef.current = Date.now()
  }, [stopMediaSession])

  const runUnlockedTap = useCallback(
    (action: () => void) => {
      if (submittedResult !== null) return
      triggerHaptic('tap')
      audioEngine.playPop()
      action()
    },
    [submittedResult]
  )

  const handleAddToken = useCallback(
    (tokenIndex: number) => {
      runUnlockedTap(() => {
        setSelectedTokenIndices((prev) =>
          prev.includes(tokenIndex) ? prev : [...prev, tokenIndex]
        )
      })
    },
    [runUnlockedTap]
  )

  const handleRemoveToken = useCallback(
    (selectedPosition: number) => {
      runUnlockedTap(() => {
        setSelectedTokenIndices((prev) =>
          prev.filter((_, idx) => idx !== selectedPosition)
        )
      })
    },
    [runUnlockedTap]
  )

  const handleClearTokens = useCallback(() => {
    runUnlockedTap(() => setSelectedTokenIndices([]))
  }, [runUnlockedTap])

  const handleSelectOption = useCallback(
    (optionValue: string) => {
      runUnlockedTap(() => setSelectedOptionValue(optionValue))
    },
    [runUnlockedTap]
  )

  const handleSetTextInput = useCallback(
    (value: string) => {
      if (submittedResult !== null) return
      setTextInput(value)
    },
    [submittedResult]
  )

  const handleConfirmSpokenSample = useCallback(() => {
    if (!parsedContent?.displayText) return
    const sample = parsedContent.displayText
    runUnlockedTap(() => setTextInput(sample))
  }, [parsedContent, runUnlockedTap])

  const handlePlayAudio = useCallback(() => {
    if (!parsedContent) return
    const spokenText =
      parsedContent.audioText ?? parsedContent.displayText ?? currentExercise?.prompt
    playExerciseAudio(parsedContent.audioUrl, spokenText)
  }, [currentExercise, parsedContent, playExerciseAudio])

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
      setSubmitError(
        extractApiErrorMessage(
          err,
          'Gagal menyelesaikan pelajaran. Pastikan semua soal telah terjawab.'
        )
      )
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

  const handleToggleHint = useCallback(() => {
    audioEngine.playPop()
    triggerHaptic('tap')
    setShowHint((prev) => !prev)
  }, [])

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

  const resolvedCorrectAnswer = useMemo(() => {
    const raw = submittedResult?.correct_answer ?? ''
    if (!raw || !parsedContent) return raw
    const matchedOption = parsedContent.choiceOptions.find((opt) => opt.id === raw)
    return matchedOption ? matchedOption.text : raw
  }, [parsedContent, submittedResult?.correct_answer])

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
    handleToggleHint,
    handleExitToCurriculum,
    handleEnterShortcut,
  }
}
