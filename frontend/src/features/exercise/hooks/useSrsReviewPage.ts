import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useActiveSpeechLocale } from '@/features/exercise/hooks/useActiveSpeechLocale'
import { useExerciseMedia } from '@/features/exercise/hooks/useExerciseMedia'
import { useExerciseQuestionInputs } from '@/features/exercise/hooks/useExerciseQuestionInputs'
import {
  SRS_DUE_QUERY_KEY,
  exerciseService,
} from '@/features/exercise/services/exerciseService'
import { invalidateLearningSessionCaches } from '@/features/exercise/utils/sessionCache'
import type {
  SubmitExerciseAnswerRequest,
  SubmitExerciseAnswerResponse,
  UserSRSReview,
} from '@/features/exercise/types/exercise'
import {
  computeElapsedSeconds,
  resolveExerciseSpokenText,
} from '@/features/exercise/utils/exerciseHelpers'
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
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')

  const [currentIndex, setCurrentIndex] = useState(0)
  const [submittedResult, setSubmittedResult] =
    useState<SubmitExerciseAnswerResponse | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [isSessionFinished, setIsSessionFinished] = useState(false)
  const [isRefetchingBatch, setIsRefetchingBatch] = useState(false)

  const questionStartedAtRef = useRef<number>(0)
  const actionLockRef = useRef(false)
  const sessionEpochRef = useRef(0)

  const dueQueueQuery = useQuery({
    queryKey: [...SRS_DUE_QUERY_KEY, userId, SRS_BATCH_LIMIT],
    queryFn: ({ signal }) => exerciseService.getDueReviews(SRS_BATCH_LIMIT, { signal }),
    staleTime: Infinity,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: false,
  })

  const items = useMemo<UserSRSReview[]>(
    () => (dueQueueQuery.data?.items ?? []).filter((item) => Boolean(item.exercise)),
    [dueQueueQuery.data]
  )
  const safeIndex = items.length > 0 ? Math.min(currentIndex, items.length - 1) : 0
  const totalDue = dueQueueQuery.data?.total_due ?? items.length
  const currentReviewItem = items[safeIndex] ?? null
  const currentExercise = currentReviewItem?.exercise ?? null

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
  }, [currentIndex, currentExercise?.id])

  const {
    mutateAsync: submitAnswerAsync,
    isPending: isSubmittingAnswer,
  } = useMutation({
    mutationFn: (payload: SubmitExerciseAnswerRequest) =>
      exerciseService.submitAnswer(payload),
  })

  const {
    mutateAsync: processReviewAsync,
    isPending: isProcessingReview,
  } = useMutation({
    mutationFn: (payload: { exercise_id: string; quality: number }) =>
      exerciseService.processReview(payload),
  })

  const resetCardInputs = useCallback(() => {
    stopMediaSession()
    resetInputs()
    setSubmittedResult(null)
    setActionError(null)
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
    if (!currentExercise || !canCheckAnswer || isSubmittingAnswer || actionLockRef.current) {
      return
    }

    actionLockRef.current = true
    const epoch = sessionEpochRef.current
    stopMediaSession()
    setActionError(null)
    const elapsedSeconds = computeElapsedSeconds(questionStartedAtRef.current)

    try {
      const res = await submitAnswerAsync({
        exercise_id: currentExercise.id,
        user_answer: currentUserAnswer,
        time_spent_seconds: elapsedSeconds,
        skip_srs_schedule: true,
      })

      if (epoch !== sessionEpochRef.current) return
      setSubmittedResult(res)
      if (res.is_correct) {
        triggerHaptic('success')
        audioEngine.playSuccess()
      } else {
        triggerHaptic('error')
        audioEngine.playError()
      }
    } catch (err) {
      if (epoch !== sessionEpochRef.current) return
      setActionError(
        extractApiErrorMessage(err, 'Gagal memeriksa jawaban ulasan. Coba lagi.')
      )
      triggerHaptic('error')
      audioEngine.playError()
    } finally {
      actionLockRef.current = false
    }
  }, [
    canCheckAnswer,
    currentExercise,
    currentUserAnswer,
    isSubmittingAnswer,
    stopMediaSession,
    submitAnswerAsync,
  ])

  const handleRateQuality = useCallback(
    async (quality: number) => {
      if (!currentExercise || isProcessingReview || actionLockRef.current) return

      actionLockRef.current = true
      const epoch = sessionEpochRef.current
      setActionError(null)
      try {
        await processReviewAsync({
          exercise_id: currentExercise.id,
          quality,
        })

        if (epoch !== sessionEpochRef.current) return
        const nextReviewedCount = reviewedCount + 1
        setReviewedCount(nextReviewedCount)

        if (safeIndex >= items.length - 1) {
          stopMediaSession()
          setIsSessionFinished(true)
          triggerHaptic('success')
          audioEngine.playFanfare()
          await invalidateLearningSessionCaches(queryClient, { includeSrs: true })
          return
        }

        triggerHaptic('tap')
        audioEngine.playPop()
        setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1))
        resetCardInputs()
      } catch (err) {
        if (epoch !== sessionEpochRef.current) return
        setActionError(
          extractApiErrorMessage(err, 'Gagal menyimpan penilaian memori SRS.')
        )
        triggerHaptic('error')
        audioEngine.playError()
      } finally {
        actionLockRef.current = false
      }
    },
    [
      currentExercise,
      isProcessingReview,
      items.length,
      processReviewAsync,
      queryClient,
      resetCardInputs,
      reviewedCount,
      safeIndex,
      stopMediaSession,
    ]
  )

  const handleEnterShortcut = useCallback(() => {
    if (isSubmittingAnswer || isProcessingReview || actionLockRef.current) return
    if (submittedResult === null && canCheckAnswer) {
      void handleCheckAnswer()
    }
  }, [
    canCheckAnswer,
    handleCheckAnswer,
    isProcessingReview,
    isSubmittingAnswer,
    submittedResult,
  ])

  const handleRestartQueue = useCallback(async () => {
    sessionEpochRef.current += 1
    actionLockRef.current = false
    triggerHaptic('tap')
    audioEngine.playPop()
    setIsRefetchingBatch(true)
    try {
      await dueQueueQuery.refetch()
      setCurrentIndex(0)
      setReviewedCount(0)
      setIsSessionFinished(false)
      resetCardInputs()
    } finally {
      setIsRefetchingBatch(false)
    }
  }, [dueQueueQuery, resetCardInputs])

  const handleBackToCurriculum = useCallback(() => {
    stopMediaSession()
    audioEngine.playPop()
    if (reviewedCount > 0) {
      void invalidateLearningSessionCaches(queryClient, { includeSrs: true })
    }
    navigate('/curriculum')
  }, [navigate, queryClient, reviewedCount, stopMediaSession])

  const hasMoreReviewsAfterBatch =
    isSessionFinished &&
    reviewedCount > 0 &&
    (dueQueueQuery.isFetching ? totalDue > reviewedCount : totalDue > 0)

  const progressPercent = useMemo(() => {
    if (items.length === 0) return 0
    const completed = safeIndex + (submittedResult !== null ? 1 : 0)
    return Math.min(100, Math.round((completed / items.length) * 100))
  }, [items.length, safeIndex, submittedResult])

  const queueErrorMessage = dueQueueQuery.isError
    ? extractApiErrorMessage(
        dueQueueQuery.error,
        'Gagal memuat antrean ulasan SRS dari server.'
      )
    : null

  return {
    items,
    totalDue,
    currentIndex: safeIndex,
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
    isLoading: dueQueueQuery.isLoading || isRefetchingBatch,
    isError: dueQueueQuery.isError && !isSessionFinished,
    queueErrorMessage,
    isChecking: isSubmittingAnswer,
    isSubmittingRating: isProcessingReview,
    isSessionFinished,
    hasMoreReviewsAfterBatch,
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
