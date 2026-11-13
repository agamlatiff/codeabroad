import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { CURRICULUM_QUERY_KEY } from '@/features/curriculum/services/curriculumService'
import {
  LANGUAGE_ENROLLMENTS_QUERY_KEY,
  languageService,
} from '@/features/curriculum/services/languageService'
import { useExerciseMedia } from '@/features/exercise/hooks/useExerciseMedia'
import {
  EXAM_QUESTIONS_QUERY_KEY,
  exerciseService,
} from '@/features/exercise/services/exerciseService'
import type {
  ParsedExerciseContent,
  ReadinessExamResponse,
} from '@/features/exercise/types/exercise'
import {
  formatUserAnswerForSubmission,
  parseExerciseContent,
  resolveSpeechLocale,
} from '@/features/exercise/utils/exerciseHelpers'
import { PROFILE_QUERY_KEY } from '@/features/user/services/userService'
import { DAILY_QUESTS_QUERY_KEY } from '@/shared/hooks/layout/right-sidebar/useQuestsSection'
import { ACTIVITY_LOGS_QUERY_KEY } from '@/shared/hooks/layout/right-sidebar/useStreakSection'
import { extractApiErrorMessage } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/api'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'

/**
 * Headless controller hook powering the 4-pillar level Readiness Exam (/exam/:levelId).
 */
export const useReadinessExamPage = () => {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [tokenIndicesById, setTokenIndicesById] = useState<Record<string, number[]>>({})
  const [optionById, setOptionById] = useState<Record<string, string>>({})
  const [textById, setTextById] = useState<Record<string, string>>({})
  const [showHint, setShowHint] = useState(false)
  const [examResult, setExamResult] = useState<ReadinessExamResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const questionsQuery = useQuery({
    queryKey: [...EXAM_QUESTIONS_QUERY_KEY, levelId],
    queryFn: ({ signal }) => exerciseService.getExamQuestions(levelId!, { signal }),
    enabled: Boolean(levelId),
    retry: false,
  })

  const enrollmentsQuery = useQuery({
    queryKey: LANGUAGE_ENROLLMENTS_QUERY_KEY,
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    staleTime: 60_000,
    retry: false,
  })

  const activeEnrollment = useMemo(() => {
    const enrollments = enrollmentsQuery.data ?? []
    return enrollments.find((item) => item.is_active) ?? enrollments[0] ?? null
  }, [enrollmentsQuery.data])

  const speechLocale = useMemo(
    () => resolveSpeechLocale(activeEnrollment?.language?.code),
    [activeEnrollment?.language?.code]
  )

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
      if (!currentExercise || examResult !== null) return
      setTextById((prev) => ({ ...prev, [currentExercise.id]: transcript }))
    },
    [currentExercise, examResult]
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
    isLocked: examResult !== null,
    onTranscript: handleTranscript,
  })

  const submitExamMutation = useMutation({
    mutationFn: (payload: {
      level_id: string
      answers: { exercise_id: string; user_answer: string }[]
    }) => exerciseService.submitExam(payload),
  })

  const runUnlockedTap = useCallback(
    (action: () => void) => {
      if (!currentExercise || examResult !== null) return
      triggerHaptic('tap')
      audioEngine.playPop()
      action()
    },
    [currentExercise, examResult]
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
      if (!currentExercise || examResult !== null) return
      setTextById((prev) => ({ ...prev, [currentExercise.id]: value }))
    },
    [currentExercise, examResult]
  )

  const handleConfirmSpokenSample = useCallback(() => {
    if (!currentExercise || !currentParsedContent?.displayText) return
    const exerciseId = currentExercise.id
    const sample = currentParsedContent.displayText
    runUnlockedTap(() => {
      setTextById((prev) => ({ ...prev, [exerciseId]: sample }))
    })
  }, [currentExercise, currentParsedContent, runUnlockedTap])

  const handlePlayAudio = useCallback(() => {
    if (!currentParsedContent) return
    const spokenText =
      currentParsedContent.audioText ??
      currentParsedContent.displayText ??
      currentExercise?.prompt
    playExerciseAudio(currentParsedContent.audioUrl, spokenText)
  }, [currentExercise, currentParsedContent, playExerciseAudio])

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
    if (!levelId || !allAnswered || submitExamMutation.isPending) return

    setSubmitError(null)
    stopMediaSession()

    try {
      const res = await submitExamMutation.mutateAsync({
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
      ])
    } catch (err) {
      const message =
        isAxiosError<ApiResponse<unknown>>(err) &&
        err.response?.data?.code === 'EXAM_ALREADY_PASSED'
          ? 'Kamu sudah lulus ujian kesiapan untuk level ini.'
          : extractApiErrorMessage(err, 'Gagal mengumpulkan jawaban ujian kesiapan.')
      setSubmitError(message)
      triggerHaptic('error')
      audioEngine.playError()
    }
  }, [
    allAnswered,
    answersById,
    levelId,
    queryClient,
    questions,
    stopMediaSession,
    submitExamMutation,
  ])

  const handleRetryExam = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.playPop()
    setExamResult(null)
    setSubmitError(null)
    setCurrentIndex(0)
    setShowHint(false)
  }, [])

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
    examResult,
    submitError,
    isLoading: questionsQuery.isLoading,
    isError: questionsQuery.isError,
    loadErrorMessage,
    isSubmitting: submitExamMutation.isPending,
    refetchQuestions: questionsQuery.refetch,
    handleAddToken,
    handleRemoveToken,
    handleClearTokens,
    handleSelectOption,
    handleSetTextInput,
    handleConfirmSpokenSample,
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

