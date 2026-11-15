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
import type {
  SubmitExerciseAnswerRequest,
  SubmitExerciseAnswerResponse,
} from '@/features/exercise/types/exercise'
import { resolveExerciseSpokenText } from '@/features/exercise/utils/exerciseHelpers'
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
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')

  const [currentIndex, setCurrentIndex] = useState(0)
  const [submittedResult, setSubmittedResult] =
    useState<SubmitExerciseAnswerResponse | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [isSessionFinished, setIsSessionFinished] = useState(false)
  const [isRefetchingBatch, setIsRefetchingBatch] = useState(false)

  const questionStartedAtRef = useRef<number>(0)

  const dueQueueQuery = useQuery({
    queryKey: [...SRS_DUE_QUERY_KEY, userId, SRS_BATCH_LIMIT],
    queryFn: ({ signal }) => exerciseService.getDueReviews(SRS_BATCH_LIMIT, { signal }),
    refetchOnMount: 'always',
    retry: false,
  })

  const items = useMemo(
    () => (dueQueueQuery.data?.items ?? []).filter((item) => Boolean(item.exercise)),
    [dueQueueQuery.data]
  )
  const totalDue = dueQueueQuery.data?.total_due ?? items.length
  const currentReviewItem = items[currentIndex] ?? null
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
    if (!currentExercise || !canCheckAnswer || isSubmittingAnswer) {
      return
    }

    stopMediaSession()
    setActionError(null)
    const elapsedSeconds =
      questionStartedAtRef.current > 0
        ? Math.max(1, Math.round((Date.now() - questionStartedAtRef.current) / 1000))
        : 1

    try {
      const res = await submitAnswerAsync({
        exercise_id: currentExercise.id,
        user_answer: currentUserAnswer,
        time_spent_seconds: elapsedSeconds,
        skip_srs_schedule: true,
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
      if (!currentExercise || isProcessingReview) return

      setActionError(null)
      try {
        await processReviewAsync({
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
      isProcessingReview,
      items.length,
      processReviewAsync,
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

  const handleRestartQueue = useCallback(async () => {
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
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: SRS_DUE_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: DAILY_QUESTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
      ])
    }
    navigate('/curriculum')
  }, [navigate, queryClient, reviewedCount, stopMediaSession])

  const hasMoreReviewsAfterBatch =
    isSessionFinished &&
    reviewedCount > 0 &&
    (dueQueueQuery.isFetching ? totalDue > reviewedCount : totalDue > 0)

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
    isLoading: dueQueueQuery.isLoading || isRefetchingBatch,
    isError: dueQueueQuery.isError,
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
