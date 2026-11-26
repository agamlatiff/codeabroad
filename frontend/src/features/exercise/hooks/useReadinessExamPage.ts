import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useActiveSpeechLocale } from '@/features/exercise/hooks/useActiveSpeechLocale'
import { useExerciseMedia } from '@/features/exercise/hooks/useExerciseMedia'
import {
  EXAM_QUESTIONS_QUERY_KEY,
  EXAM_RESULT_QUERY_KEY,
  exerciseService,
} from '@/features/exercise/services/exerciseService'
import { invalidateLearningSessionCaches } from '@/features/exercise/utils/sessionCache'
import type {
  ParsedExerciseContent,
  ReadinessExamResponse,
} from '@/features/exercise/types/exercise'
import {
  computeElapsedSeconds,
  formatUserAnswerForSubmission,
  parseExerciseContent,
  resolveExerciseSpokenText,
  resolveSelectedTokens,
} from '@/features/exercise/utils/exerciseHelpers'
import { extractApiErrorMessage } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/api'
import { useAudioStore } from '@/shared/store/audioStore'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'

const isExamAlreadyPassedError = (err: unknown): boolean =>
  isAxiosError<ApiResponse<unknown>>(err) &&
  err.response?.data?.code === 'EXAM_ALREADY_PASSED'

/**
 * Headless controller hook powering the 4-pillar level Readiness Exam (/exam/:levelId).
 */
export const useReadinessExamPage = (levelId?: string) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')

  const [currentIndex, setCurrentIndex] = useState(0)
  const [tokenIndicesById, setTokenIndicesById] = useState<Record<string, number[]>>({})
  const [optionById, setOptionById] = useState<Record<string, string>>({})
  const [textById, setTextById] = useState<Record<string, string>>({})
  const [showHint, setShowHint] = useState(false)
  const [examResult, setExamResult] = useState<ReadinessExamResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isAlreadyPassed, setIsAlreadyPassed] = useState(false)
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false)

  const timeSpentByIdRef = useRef<Record<string, number>>({})
  const questionStartedAtRef = useRef<number>(0)
  const submitLockRef = useRef(false)
  const sessionEpochRef = useRef(0)

  const questionsQuery = useQuery({
    queryKey: [...EXAM_QUESTIONS_QUERY_KEY, userId, levelId],
    queryFn: ({ signal }) => exerciseService.getExamQuestions(levelId!, { signal }),
    enabled: Boolean(levelId) && examResult === null && !isAlreadyPassed,
    retry: false,
  })

  const isQuestionsAlreadyPassed =
    questionsQuery.isError && isExamAlreadyPassedError(questionsQuery.error)
  const shouldLoadPassedResult =
    Boolean(levelId) && (isQuestionsAlreadyPassed || isAlreadyPassed)

  const passedResultQuery = useQuery({
    queryKey: [...EXAM_RESULT_QUERY_KEY, userId, levelId],
    queryFn: ({ signal }) => exerciseService.getExamResult(levelId!, { signal }),
    enabled: shouldLoadPassedResult && examResult === null,
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

  const currentSelectedTokens = useMemo(
    () => resolveSelectedTokens(currentParsedContent?.tokens, currentSelectedTokenIndices),
    [currentParsedContent?.tokens, currentSelectedTokenIndices]
  )

  const currentSelectedOptionValue = currentExercise
    ? optionById[currentExercise.id] ?? ''
    : ''

  const currentTextInput = currentExercise ? textById[currentExercise.id] ?? '' : ''

  const answersById = useMemo(() => {
    const formatted: Record<string, string> = {}
    for (const q of questions) {
      const parsed = parsedContentById[q.id]
      const selectedTokens = resolveSelectedTokens(parsed?.tokens, tokenIndicesById[q.id])

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
    timeSpentByIdRef.current = {}
    questionStartedAtRef.current = Date.now()
    stopMediaSession()
  }, [levelId, stopMediaSession])

  useEffect(() => {
    if (resolvedExamResult === null && currentExercise?.id) {
      questionStartedAtRef.current = Date.now()
    }
  }, [currentExercise?.id, currentIndex, resolvedExamResult])

  const commitCurrentQuestionElapsed = useCallback(() => {
    if (!currentExercise || resolvedExamResult !== null || questionStartedAtRef.current <= 0) {
      return
    }
    const elapsed = computeElapsedSeconds(questionStartedAtRef.current)
    const prev = timeSpentByIdRef.current[currentExercise.id] ?? 0
    timeSpentByIdRef.current[currentExercise.id] = Math.min(86400, prev + elapsed)
    questionStartedAtRef.current = Date.now()
  }, [currentExercise, resolvedExamResult])

  const {
    mutateAsync: submitExamAsync,
    isPending: isSubmittingExam,
  } = useMutation({
    mutationFn: (payload: {
      level_id: string
      answers: { exercise_id: string; user_answer: string; time_spent_seconds?: number }[]
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

  const handlePlayAudio = useCallback(
    (rate?: number) => {
      if (!currentParsedContent) return
      playExerciseAudio(
        currentParsedContent.audioUrl,
        resolveExerciseSpokenText(currentParsedContent, currentExercise?.prompt),
        rate
      )
    },
    [currentExercise?.prompt, currentParsedContent, playExerciseAudio]
  )

  // Auto-play listening/speaking prompts on Readiness Exam questions when autoPlayVoice is active
  useEffect(() => {
    if (resolvedExamResult !== null || !currentExercise || !currentParsedContent) return
    if (
      currentExercise.exercise_type !== 'listening_choice' &&
      currentExercise.exercise_type !== 'speaking_repeat'
    ) {
      return
    }
    const spokenTarget = currentParsedContent.audioText ?? currentParsedContent.displayText
    if (!currentParsedContent.audioUrl && !spokenTarget) return

    const timer = window.setTimeout(() => {
      const { autoPlayVoice, audioMode } = useAudioStore.getState()
      if (!autoPlayVoice || audioMode === 'muted') return
      playExerciseAudio(currentParsedContent.audioUrl, spokenTarget, undefined, { isAutoPlay: true })
    }, 220)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    currentExercise,
    currentParsedContent,
    playExerciseAudio,
    resolvedExamResult,
  ])

  const handleToggleHint = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.playPop()
    setShowHint((prev) => !prev)
  }, [])

  const handlePreviousQuestion = useCallback(() => {
    if (currentIndex === 0 || isSubmittingExam || submitLockRef.current) return
    commitCurrentQuestionElapsed()
    stopMediaSession()
    triggerHaptic('tap')
    audioEngine.playPop()
    setShowHint(false)
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }, [commitCurrentQuestionElapsed, currentIndex, isSubmittingExam, stopMediaSession])

  const handleNextQuestion = useCallback(() => {
    if (currentIndex >= questions.length - 1 || isSubmittingExam || submitLockRef.current) return
    commitCurrentQuestionElapsed()
    stopMediaSession()
    triggerHaptic('tap')
    audioEngine.playPop()
    setShowHint(false)
    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
  }, [commitCurrentQuestionElapsed, currentIndex, isSubmittingExam, questions.length, stopMediaSession])

  const handleJumpToQuestion = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= questions.length || isSubmittingExam || submitLockRef.current) {
        return
      }
      commitCurrentQuestionElapsed()
      stopMediaSession()
      triggerHaptic('tap')
      audioEngine.playPop()
      setShowHint(false)
      setCurrentIndex(targetIndex)
    },
    [commitCurrentQuestionElapsed, isSubmittingExam, questions.length, stopMediaSession]
  )

  const openSubmitConfirm = useCallback(() => {
    if (!levelId || !allAnswered || isSubmittingExam || submitLockRef.current) return
    triggerHaptic('tap')
    setIsSubmitConfirmOpen(true)
  }, [allAnswered, isSubmittingExam, levelId])

  const closeSubmitConfirm = useCallback(() => {
    setIsSubmitConfirmOpen(false)
  }, [])

  const handleSubmitExam = useCallback(async () => {
    if (!levelId || !allAnswered || isSubmittingExam || submitLockRef.current) return

    submitLockRef.current = true
    const epoch = sessionEpochRef.current
    setIsSubmitConfirmOpen(false)
    commitCurrentQuestionElapsed()
    setSubmitError(null)
    stopMediaSession()

    try {
      const res = await submitExamAsync({
        level_id: levelId,
        answers: questions.map((q) => ({
          exercise_id: q.id,
          user_answer: answersById[q.id] ?? '',
          time_spent_seconds: Math.max(1, timeSpentByIdRef.current[q.id] ?? 1),
        })),
      })

      if (epoch !== sessionEpochRef.current) return
      setExamResult(res)
      if (res.attempt.is_passed) {
        triggerHaptic('success')
        audioEngine.playFanfare()
        queryClient.setQueryData([...EXAM_RESULT_QUERY_KEY, userId, levelId], res)
      } else {
        triggerHaptic('tap')
        audioEngine.playPop()
      }

      await invalidateLearningSessionCaches(queryClient, {
        includeCurriculum: true,
        includeVocab: res.attempt.is_passed,
        includeExamRetry: !res.attempt.is_passed,
      })
    } catch (err) {
      if (epoch !== sessionEpochRef.current) return
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
    } finally {
      if (epoch === sessionEpochRef.current) {
        submitLockRef.current = false
      }
    }
  }, [
    allAnswered,
    answersById,
    commitCurrentQuestionElapsed,
    isSubmittingExam,
    levelId,
    queryClient,
    questions,
    stopMediaSession,
    submitExamAsync,
    userId,
  ])

  const handleEnterShortcut = useCallback(() => {
    const hasCurrentAnswer = Boolean(
      currentExercise && (answersById[currentExercise.id] ?? '').trim().length > 0
    )
    if (!hasCurrentAnswer || isSubmittingExam || submitLockRef.current) return

    if (!isLastQuestion) {
      handleNextQuestion()
      return
    }

    if (allAnswered) {
      setIsSubmitConfirmOpen(true)
    }
  }, [
    allAnswered,
    answersById,
    currentExercise,
    handleNextQuestion,
    isLastQuestion,
    isSubmittingExam,
  ])

  const handleRetryExam = useCallback(() => {
    sessionEpochRef.current += 1
    submitLockRef.current = false
    stopMediaSession()
    triggerHaptic('tap')
    audioEngine.playPop()
    timeSpentByIdRef.current = {}
    questionStartedAtRef.current = Date.now()
    setExamResult(null)
    setSubmitError(null)
    setIsAlreadyPassed(false)
    setIsSubmitConfirmOpen(false)
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
    isSubmitConfirmOpen,
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
    openSubmitConfirm,
    closeSubmitConfirm,
    handleSubmitExam,
    handleRetryExam,
    handleBackToCurriculum,
  }
}
