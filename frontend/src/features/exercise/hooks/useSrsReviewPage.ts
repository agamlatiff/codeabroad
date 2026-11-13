import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  LANGUAGE_ENROLLMENTS_QUERY_KEY,
  languageService,
} from '@/features/curriculum/services/languageService'
import { useExerciseMedia } from '@/features/exercise/hooks/useExerciseMedia'
import {
  SRS_DUE_QUERY_KEY,
  exerciseService,
} from '@/features/exercise/services/exerciseService'
import type { SubmitExerciseAnswerResponse } from '@/features/exercise/types/exercise'
import {
  formatUserAnswerForSubmission,
  parseExerciseContent,
  resolveSpeechLocale,
} from '@/features/exercise/utils/exerciseHelpers'
import { DAILY_QUESTS_QUERY_KEY } from '@/shared/hooks/layout/right-sidebar/useQuestsSection'
import { ACTIVITY_LOGS_QUERY_KEY } from '@/shared/hooks/layout/right-sidebar/useStreakSection'
import { extractApiErrorMessage } from '@/shared/services/api'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'

const SRS_BATCH_LIMIT = 20

/**
 * Headless controller hook powering the spaced repetition (SM-2) review session (/review).
 */
export const useSrsReviewPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTokenIndices, setSelectedTokenIndices] = useState<number[]>([])
  const [selectedOptionValue, setSelectedOptionValue] = useState('')
  const [textInput, setTextInput] = useState('')
  const [submittedResult, setSubmittedResult] =
    useState<SubmitExerciseAnswerResponse | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [isSessionFinished, setIsSessionFinished] = useState(false)

  const questionStartedAtRef = useRef<number>(0)

  const dueQueueQuery = useQuery({
    queryKey: [...SRS_DUE_QUERY_KEY, SRS_BATCH_LIMIT],
    queryFn: ({ signal }) => exerciseService.getDueReviews(SRS_BATCH_LIMIT, { signal }),
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

  const items = useMemo(
    () => (dueQueueQuery.data?.items ?? []).filter((item) => Boolean(item.exercise)),
    [dueQueueQuery.data]
  )
  const totalDue = dueQueueQuery.data?.total_due ?? items.length
  const currentReviewItem = items[currentIndex] ?? null
  const currentExercise = currentReviewItem?.exercise ?? null

  useEffect(() => {
    questionStartedAtRef.current = Date.now()
  }, [currentIndex, currentExercise?.id])

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

  const submitAnswerMutation = useMutation({
    mutationFn: (payload: {
      exercise_id: string
      user_answer: string
      time_spent_seconds: number
    }) => exerciseService.submitAnswer(payload),
  })

  const processReviewMutation = useMutation({
    mutationFn: (payload: { exercise_id: string; quality: number }) =>
      exerciseService.processReview(payload),
  })

  const resetCardInputs = useCallback(() => {
    stopMediaSession()
    setSelectedTokenIndices([])
    setSelectedOptionValue('')
    setTextInput('')
    setSubmittedResult(null)
    setActionError(null)
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

  const handleToggleHint = useCallback(() => {
    audioEngine.playPop()
    triggerHaptic('tap')
    setShowHint((prev) => !prev)
  }, [])

  const handleCheckAnswer = useCallback(async () => {
    if (!currentExercise || !canCheckAnswer || submitAnswerMutation.isPending) {
      return
    }

    setActionError(null)
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
      } else {
        triggerHaptic('error')
        audioEngine.playError()
      }
    } catch (err) {
      setActionError(
        extractApiErrorMessage(err, 'Gagal memeriksa jawaban ulasan. Coba lagi.')
      )
      triggerHaptic('error')
      audioEngine.playError()
    }
  }, [canCheckAnswer, currentExercise, currentUserAnswer, submitAnswerMutation])

  const handleRateQuality = useCallback(
    async (quality: number) => {
      if (!currentExercise || processReviewMutation.isPending) return

      setActionError(null)
      try {
        await processReviewMutation.mutateAsync({
          exercise_id: currentExercise.id,
          quality,
        })

        const nextReviewedCount = reviewedCount + 1
        setReviewedCount(nextReviewedCount)

        if (currentIndex >= items.length - 1) {
          stopMediaSession()
          setIsSessionFinished(true)
          triggerHaptic('success')
          audioEngine.playFanfare()
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: SRS_DUE_QUERY_KEY }),
            queryClient.invalidateQueries({ queryKey: DAILY_QUESTS_QUERY_KEY }),
            queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
          ])
          return
        }

        triggerHaptic('tap')
        audioEngine.playPop()
        setCurrentIndex((prev) => prev + 1)
        resetCardInputs()
      } catch (err) {
        setActionError(
          extractApiErrorMessage(err, 'Gagal menyimpan penilaian memori SRS.')
        )
        triggerHaptic('error')
        audioEngine.playError()
      }
    },
    [
      currentExercise,
      currentIndex,
      items.length,
      processReviewMutation,
      queryClient,
      resetCardInputs,
      reviewedCount,
      stopMediaSession,
    ]
  )

  const handleEnterShortcut = useCallback(() => {
    if (submittedResult === null && canCheckAnswer) {
      void handleCheckAnswer()
    }
  }, [canCheckAnswer, handleCheckAnswer, submittedResult])

  const handleRestartQueue = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.playPop()
    setCurrentIndex(0)
    setReviewedCount(0)
    setIsSessionFinished(false)
    resetCardInputs()
    void dueQueueQuery.refetch()
  }, [dueQueueQuery, resetCardInputs])

  const handleBackToCurriculum = useCallback(() => {
    stopMediaSession()
    audioEngine.playPop()
    navigate('/curriculum')
  }, [navigate, stopMediaSession])

  const resolvedCorrectAnswer = useMemo(() => {
    const raw = submittedResult?.correct_answer ?? ''
    if (!raw || !parsedContent) return raw
    const matchedOption = parsedContent.choiceOptions.find((opt) => opt.id === raw)
    return matchedOption ? matchedOption.text : raw
  }, [parsedContent, submittedResult?.correct_answer])

  const progressPercent = useMemo(() => {
    if (items.length === 0) return 0
    const completed = currentIndex + (submittedResult !== null ? 1 : 0)
    return Math.min(100, Math.round((completed / items.length) * 100))
  }, [currentIndex, items.length, submittedResult])

  const queueErrorMessage = dueQueueQuery.isError
    ? extractApiErrorMessage(
        dueQueueQuery.error,
        'Gagal memuat antrean ulasan SRS dari server.'
      )
    : null

  return {
    items,
    totalDue,
    currentIndex,
    reviewedCount,
    progressPercent,
    currentReviewItem,
    currentExercise,
    parsedContent,
    selectedTokenIndices,
    selectedTokens,
    selectedOptionValue,
    textInput,
    submittedResult,
    resolvedCorrectAnswer,
    actionError,
    showHint,
    isSpeakingAudio,
    isRecordingSpeech,
    speechRecognitionSupported,
    audioPlaybackError,
    canCheckAnswer,
    isLoading: dueQueueQuery.isLoading,
    isError: dueQueueQuery.isError,
    queueErrorMessage,
    isChecking: submitAnswerMutation.isPending,
    isSubmittingRating: processReviewMutation.isPending,
    isSessionFinished,
    refetchQueue: dueQueueQuery.refetch,
    handleAddToken,
    handleRemoveToken,
    handleClearTokens,
    handleSelectOption,
    handleSetTextInput,
    handleConfirmSpokenSample,
    handlePlayAudio,
    handleToggleRecording,
    handleToggleHint,
    handleCheckAnswer,
    handleRateQuality,
    handleEnterShortcut,
    handleRestartQueue,
    handleBackToCurriculum,
  }
}

