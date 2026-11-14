import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'
import { CURRICULUM_QUERY_KEY } from '@/features/curriculum/services/curriculumService'
import { LANGUAGE_ENROLLMENTS_QUERY_KEY } from '@/features/curriculum/services/languageService'
import { useActiveSpeechLocale } from '@/features/exercise/hooks/useActiveSpeechLocale'
import { useExerciseMedia } from '@/features/exercise/hooks/useExerciseMedia'
import {
  EXAM_QUESTIONS_QUERY_KEY,
  EXAM_RESULT_QUERY_KEY,
  exerciseService,
} from '@/features/exercise/services/exerciseService'
import type {
  ParsedExerciseContent,
  ReadinessExamResponse,
} from '@/features/exercise/types/exercise'
import {
  formatUserAnswerForSubmission,
  parseExerciseContent,
  resolveExerciseSpokenText,
} from '@/features/exercise/utils/exerciseHelpers'
import { PROFILE_QUERY_KEY } from '@/features/user/services/userService'
import { DAILY_QUESTS_QUERY_KEY } from '@/shared/hooks/layout/right-sidebar/useQuestsSection'
import { ACTIVITY_LOGS_QUERY_KEY } from '@/shared/hooks/layout/right-sidebar/useStreakSection'
import { extractApiErrorMessage } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/api'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'

const isExamAlreadyPassedError = (err: unknown): boolean =>
  isAxiosError<ApiResponse<unknown>>(err) &&
  err.response?.data?.code === 'EXAM_ALREADY_PASSED'

/**
 * Headless controller hook powering the 4-pillar level Readiness Exam (/exam/:levelId).
 */
export const useReadinessExamPage = () => {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')

  const [trackedLevelId, setTrackedLevelId] = useState<string | undefined>(levelId)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [tokenIndicesById, setTokenIndicesById] = useState<Record<string, number[]>>({})
  const [optionById, setOptionById] = useState<Record<string, string>>({})
  const [textById, setTextById] = useState<Record<string, string>>({})
  const [showHint, setShowHint] = useState(false)
  const [examResult, setExamResult] = useState<ReadinessExamResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isAlreadyPassed, setIsAlreadyPassed] = useState(false)

  if (levelId !== trackedLevelId) {
    setTrackedLevelId(levelId)
    setCurrentIndex(0)
    setTokenIndicesById({})
    setOptionById({})
    setTextById({})
    setShowHint(false)
    setExamResult(null)
    setSubmitError(null)
    setIsAlreadyPassed(false)
  }

  const questionsQuery = useQuery({
    queryKey: [...EXAM_QUESTIONS_QUERY_KEY, userId, levelId],
    queryFn: ({ signal }) => exerciseService.getExamQuestions(levelId!, { signal }),
    enabled: Boolean(levelId),
    retry: false,
  })

  const isQuestionsAlreadyPassed =
    questionsQuery.isError && isExamAlreadyPassedError(questionsQuery.error)
  const shouldLoadPassedResult =
    Boolean(levelId) && (isQuestionsAlreadyPassed || isAlreadyPassed)

  const passedResultQuery = useQuery({
    queryKey: [...EXAM_RESULT_QUERY_KEY, userId, levelId],
    queryFn: ({ signal }) => exerciseService.getExamResult(levelId!, { signal }),
    enabled: shouldLoadPassedResult,
    retry: false,
  })

  const resolvedExamResult = examResult ?? passedResultQuery.data ?? null

  const speechLocale = useActiveSpeechLocale()

  const questions = useMemo(() => questionsQuery.data ?? [], [questionsQuery.data])
  const currentExercise = questions[currentIndex] ?? null

  const parsedContentById = useMemo(() => {
    const map: Record<string, ParsedExerciseContent> = {}
    for (const q of questions) {
      map[q.id] = parseExerciseContent(q)
    }
    return map
  }, [questions])

  const currentParsedContent = currentExercise
    ? parsedContentById[currentExercise.id] ?? null
    : null

  const currentSelectedTokenIndices = useMemo(
    () => (currentExercise ? tokenIndicesById[currentExercise.id] ?? [] : []),
    [currentExercise, tokenIndicesById]
  )

  const currentSelectedTokens = useMemo(() => {
    if (!currentParsedContent) return []
    return currentSelectedTokenIndices
      .map((idx) => currentParsedContent.tokens[idx])
      .filter((token): token is string => typeof token === 'string')
  }, [currentParsedContent, currentSelectedTokenIndices])

  const currentSelectedOptionValue = currentExercise
    ? optionById[currentExercise.id] ?? ''
    : ''

  const currentTextInput = currentExercise ? textById[currentExercise.id] ?? '' : ''

  const answersById = useMemo(() => {
    const formatted: Record<string, string> = {}
    for (const q of questions) {
      const parsed = parsedContentById[q.id]
      const selectedTokens = (tokenIndicesById[q.id] ?? [])
        .map((idx) => parsed?.tokens[idx])
        .filter((token): token is string => typeof token === 'string')

      formatted[q.id] = formatUserAnswerForSubmission(q, {
        selectedTokens,
        selectedOptionValue: optionById[q.id] ?? '',
        textInput: textById[q.id] ?? '',
      })
    }
    return formatted
  }, [optionById, parsedContentById, questions, textById, tokenIndicesById])

  const answeredCount = useMemo(
    () => questions.filter((q) => (answersById[q.id] ?? '').length > 0).length,
    [answersById, questions]
  )

  const allAnswered = questions.length > 0 && answeredCount === questions.length
  const isFirstQuestion = currentIndex === 0
  const isLastQuestion = questions.length > 0 && currentIndex >= questions.length - 1

  const handleTranscript = useCallback(
    (transcript: string) => {
      if (!currentExercise || resolvedExamResult !== null) return
      setTextById((prev) => ({ ...prev, [currentExercise.id]: transcript }))
    },
    [currentExercise, resolvedExamResult]
  )

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
    isLocked: resolvedExamResult !== null,
    onTranscript: handleTranscript,
  })

  useEffect(() => {
    stopMediaSession()
  }, [levelId, stopMediaSession])

  const {
    mutateAsync: submitExamAsync,
    isPending: isSubmittingExam,
  } = useMutation({
    mutationFn: (payload: {
      level_id: string
      answers: { exercise_id: string; user_answer: string }[]
    }) => exerciseService.submitExam(payload),
  })

  const runUnlockedTap = useCallback(
    (action: () => void) => {
      if (!currentExercise || resolvedExamResult !== null) return
      triggerHaptic('tap')
      audioEngine.playPop()
      action()
    },
    [currentExercise, resolvedExamResult]
  )

  const handleAddToken = useCallback(
    (tokenIndex: number) => {
      if (!currentExercise) return
      const exerciseId = currentExercise.id
      runUnlockedTap(() => {
        setTokenIndicesById((prev) => {
          const existing = prev[exerciseId] ?? []
          return existing.includes(tokenIndex)
            ? prev
            : { ...prev, [exerciseId]: [...existing, tokenIndex] }
        })
      })
    },
    [currentExercise, runUnlockedTap]
  )

  const handleRemoveToken = useCallback(
    (selectedPosition: number) => {
      if (!currentExercise) return
      const exerciseId = currentExercise.id
      runUnlockedTap(() => {
        setTokenIndicesById((prev) => ({
          ...prev,
          [exerciseId]: (prev[exerciseId] ?? []).filter(
            (_, idx) => idx !== selectedPosition
          ),
        }))
      })
    },
    [currentExercise, runUnlockedTap]
  )

  const handleClearTokens = useCallback(() => {
    if (!currentExercise) return
    const exerciseId = currentExercise.id
    runUnlockedTap(() => {
      setTokenIndicesById((prev) => ({ ...prev, [exerciseId]: [] }))
    })
  }, [currentExercise, runUnlockedTap])

  const handleSelectOption = useCallback(
    (optionValue: string) => {
      if (!currentExercise) return
      const exerciseId = currentExercise.id
      runUnlockedTap(() => {
        setOptionById((prev) => ({ ...prev, [exerciseId]: optionValue }))
      })
    },
    [currentExercise, runUnlockedTap]
  )

  const handleSetTextInput = useCallback(
    (value: string) => {
      if (!currentExercise || resolvedExamResult !== null) return
      setTextById((prev) => ({ ...prev, [currentExercise.id]: value }))
    },
    [currentExercise, resolvedExamResult]
  )

  const handlePlayAudio = useCallback(() => {
    if (!currentParsedContent) return
    playExerciseAudio(
      currentParsedContent.audioUrl,
      resolveExerciseSpokenText(currentParsedContent, currentExercise?.prompt)
    )
  }, [currentExercise?.prompt, currentParsedContent, playExerciseAudio])

  const handleToggleHint = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.playPop()
    setShowHint((prev) => !prev)
  }, [])

  const handlePreviousQuestion = useCallback(() => {
    if (currentIndex === 0) return
    stopMediaSession()
    triggerHaptic('tap')
    audioEngine.playPop()
    setShowHint(false)
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }, [currentIndex, stopMediaSession])

  const handleNextQuestion = useCallback(() => {
    if (currentIndex >= questions.length - 1) return
    stopMediaSession()
    triggerHaptic('tap')
    audioEngine.playPop()
    setShowHint(false)
    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
  }, [currentIndex, questions.length, stopMediaSession])

  const handleJumpToQuestion = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= questions.length) return
      stopMediaSession()
      triggerHaptic('tap')
      audioEngine.playPop()
      setShowHint(false)
      setCurrentIndex(targetIndex)
    },
    [questions.length, stopMediaSession]
  )

  const handleEnterShortcut = useCallback(() => {
    if (!isLastQuestion) {
      handleNextQuestion()
    }
  }, [handleNextQuestion, isLastQuestion])

  const handleSubmitExam = useCallback(async () => {
    if (!levelId || !allAnswered || isSubmittingExam) return

    setSubmitError(null)
    stopMediaSession()

    try {
      const res = await submitExamAsync({
        level_id: levelId,
        answers: questions.map((q) => ({
          exercise_id: q.id,
          user_answer: answersById[q.id] ?? '',
        })),
      })

      setExamResult(res)
      if (res.attempt.is_passed) {
        triggerHaptic('success')
        audioEngine.playFanfare()
      } else {
        triggerHaptic('tap')
        audioEngine.playPop()
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CURRICULUM_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: LANGUAGE_ENROLLMENTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: DAILY_QUESTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: EXAM_QUESTIONS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: EXAM_RESULT_QUERY_KEY }),
      ])
    } catch (err) {
      if (isExamAlreadyPassedError(err)) {
        setIsAlreadyPassed(true)
        triggerHaptic('tap')
        audioEngine.playPop()
        return
      }
      setSubmitError(
        extractApiErrorMessage(err, 'Gagal mengumpulkan jawaban ujian kesiapan.')
      )
      triggerHaptic('error')
      audioEngine.playError()
    }
  }, [
    allAnswered,
    answersById,
    isSubmittingExam,
    levelId,
    queryClient,
    questions,
    stopMediaSession,
    submitExamAsync,
  ])

  const handleRetryExam = useCallback(() => {
    stopMediaSession()
    triggerHaptic('tap')
    audioEngine.playPop()
    setExamResult(null)
    setSubmitError(null)
    setIsAlreadyPassed(false)
    setCurrentIndex(0)
    setTokenIndicesById({})
    setOptionById({})
    setTextById({})
    setShowHint(false)
  }, [stopMediaSession])

  const handleBackToCurriculum = useCallback(() => {
    stopMediaSession()
    audioEngine.playPop()
    navigate('/curriculum')
  }, [navigate, stopMediaSession])

  const progressPercent = useMemo(() => {
    if (questions.length === 0) return 0
    return Math.min(100, Math.round((answeredCount / questions.length) * 100))
  }, [answeredCount, questions.length])

  const loadErrorMessage = questionsQuery.isError
    ? extractApiErrorMessage(
        questionsQuery.error,
        'Gagal memuat soal ujian kesiapan level ini.'
      )
    : null

  return {
    levelId,
    questions,
    answersById,
    currentIndex,
    answeredCount,
    progressPercent,
    currentExercise,
    parsedContent: currentParsedContent,
    selectedTokenIndices: currentSelectedTokenIndices,
    selectedTokens: currentSelectedTokens,
    selectedOptionValue: currentSelectedOptionValue,
    textInput: currentTextInput,
    showHint,
    isSpeakingAudio,
    isRecordingSpeech,
    speechRecognitionSupported,
    audioPlaybackError,
    isFirstQuestion,
    isLastQuestion,
    allAnswered,
    examResult: resolvedExamResult,
    isAlreadyPassed:
      shouldLoadPassedResult && !resolvedExamResult && !passedResultQuery.isLoading,
    submitError,
    isLoading:
      questionsQuery.isLoading ||
      (shouldLoadPassedResult && passedResultQuery.isLoading),
    isError: questionsQuery.isError && !shouldLoadPassedResult,
    loadErrorMessage,
    isSubmitting: isSubmittingExam,
    refetchQuestions: questionsQuery.refetch,
    handleAddToken,
    handleRemoveToken,
    handleClearTokens,
    handleSelectOption,
    handleSetTextInput,
    handlePlayAudio,
    handleToggleRecording,
    handleToggleHint,
    handlePreviousQuestion,
    handleNextQuestion,
    handleJumpToQuestion,
    handleEnterShortcut,
    handleSubmitExam,
    handleRetryExam,
    handleBackToCurriculum,
  }
}
