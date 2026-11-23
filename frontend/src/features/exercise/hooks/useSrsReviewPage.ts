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
import {
  computeElapsedSeconds,
  resolveExerciseSpokenText,
} from '@/features/exercise/utils/exerciseHelpers'
import type {
  SubmitExerciseAnswerResponse,
  UserSRSReview,
} from '@/features/exercise/types/exercise'
import { extractApiErrorMessage } from '@/shared/services/api'
import { audioService } from '@/shared/services/audioService'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'
import { playSound } from '@/shared/utils/sound'

/**
 * Headless controller hook for the cross-unit SRS Mistake Review session (/review).
 * Calls submitAnswer with skip_srs_schedule=true and records the SM-2 review once per exercise ID.
 */
export const useSrsReviewPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')
  const speechLocale = useActiveSpeechLocale()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [extraRetryQueue, setExtraRetryQueue] = useState<UserSRSReview[]>([])
  const [submittedResult, setSubmittedResult] =
    useState<SubmitExerciseAnswerResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0)

  const questionStartedAtRef = useRef<number>(0)
  const submitLockRef = useRef(false)
  const statsRecordedIdsRef = useRef<Set<string>>(new Set())
  const srsSyncedIdsRef = useRef<Set<string>>(new Set())

  const dueQuery = useQuery({
    queryKey: [...SRS_DUE_QUERY_KEY, userId, 'session'],
    queryFn: ({ signal }) => exerciseService.getDueReviews(20, { signal }),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    retry: false,
  })

  const initialItems = useMemo(
    () => (dueQuery.data?.items ?? []).filter((rev) => Boolean(rev.exercise)),
    [dueQuery.data?.items]
  )

  const queue = useMemo(
    () => [...initialItems, ...extraRetryQueue],
    [extraRetryQueue, initialItems]
  )

  const safeIndex = queue.length > 0 ? Math.min(currentIndex, queue.length - 1) : 0
  const currentReviewItem = queue[safeIndex] ?? null
  const currentExercise = currentReviewItem?.exercise ?? null
  const isRetryItem = safeIndex >= initialItems.length && initialItems.length > 0

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
  }, [safeIndex, currentExercise?.id])

  const { mutateAsync: submitAnswerAsync, isPending: isChecking } = useMutation({
    mutationFn: (payload: {
      exercise_id: string
      user_answer: string
      time_spent_seconds: number
      skip_srs_schedule: boolean
    }) => exerciseService.submitAnswer(payload),
  })

  const { mutateAsync: processReviewAsync } = useMutation({
    mutationFn: (payload: { exercise_id: string; quality: number }) =>
      exerciseService.processReview(payload),
  })

  const handlePlayAudio = useCallback(
    (rate?: number) => {
      if (!parsedContent) return
      playExerciseAudio(
        parsedContent.audioUrl,
        resolveExerciseSpokenText(parsedContent, currentExercise?.prompt),
        rate
      )
    },
    [currentExercise?.prompt, parsedContent, playExerciseAudio]
  )

  const handleCheckAnswer = useCallback(async () => {
    if (!currentExercise || !canCheckAnswer || isChecking || submitLockRef.current) {
      return
    }

    submitLockRef.current = true
    stopMediaSession()
    setSubmitError(null)
    const elapsedSeconds = computeElapsedSeconds(questionStartedAtRef.current)

    try {
      const res = await submitAnswerAsync({
        exercise_id: currentExercise.id,
        user_answer: currentUserAnswer,
        time_spent_seconds: elapsedSeconds,
        skip_srs_schedule: true,
      })

      setSubmittedResult(res)

      if (!statsRecordedIdsRef.current.has(currentExercise.id)) {
        statsRecordedIdsRef.current.add(currentExercise.id)
        setReviewedCount((prev) => prev + 1)
        if (res.is_correct) {
          setFirstTryCorrectCount((prev) => prev + 1)
        }
      }

      if (!srsSyncedIdsRef.current.has(currentExercise.id)) {
        try {
          await processReviewAsync({
            exercise_id: currentExercise.id,
            quality: res.is_correct ? 4 : 1,
          })
          srsSyncedIdsRef.current.add(currentExercise.id)
        } catch {
          // Keep feedback unblocked even if SRS schedule update fails transiently;
          // retry queue items can recover SM-2 sync on a subsequent attempt.
        }
      }

      if (res.is_correct) {
        triggerHaptic('success')
        audioEngine.playSuccess()
      } else {
        triggerHaptic('error')
        audioEngine.playError()
        if (currentReviewItem) {
          setExtraRetryQueue((prev) => {
            const existingRetries = prev.filter(
              (item) => item.exercise_id === currentExercise.id
            ).length
            return existingRetries < 1 ? [...prev, currentReviewItem] : prev
          })
        }
      }
    } catch (err) {
      setSubmitError(extractApiErrorMessage(err, 'Gagal memverifikasi jawaban. Coba lagi.'))
      triggerHaptic('error')
      audioEngine.playError()
    } finally {
      submitLockRef.current = false
    }
  }, [
    canCheckAnswer,
    currentExercise,
    currentReviewItem,
    currentUserAnswer,
    isChecking,
    processReviewAsync,
    stopMediaSession,
    submitAnswerAsync,
  ])

  const handleContinue = useCallback(() => {
    if (submittedResult === null && queue.length > 0) return

    if (safeIndex >= queue.length - 1 || queue.length === 0) {
      stopMediaSession()
      playSound('quest_complete')
      triggerHaptic('success')
      setIsCompleted(true)
      void invalidateLearningSessionCaches(queryClient, { includeSrs: true })
      return
    }

    audioEngine.playPop()
    triggerHaptic('tap')
    stopMediaSession()
    resetInputs()
    setSubmittedResult(null)
    setSubmitError(null)
    setCurrentIndex((prev) => prev + 1)
  }, [
    queryClient,
    queue.length,
    resetInputs,
    safeIndex,
    stopMediaSession,
    submittedResult,
  ])

  const handleExitToCurriculum = useCallback(() => {
    stopMediaSession()
    audioService.stopSpeech()
    audioEngine.playPop()
    if (statsRecordedIdsRef.current.size > 0 || srsSyncedIdsRef.current.size > 0) {
      void invalidateLearningSessionCaches(queryClient, { includeSrs: true })
    }
    navigate('/curriculum')
  }, [navigate, queryClient, stopMediaSession])

  const handleEnterShortcut = useCallback(() => {
    if (isChecking || submitLockRef.current) return
    if (submittedResult === null) {
      if (canCheckAnswer) {
        void handleCheckAnswer()
      }
      return
    }
    handleContinue()
  }, [canCheckAnswer, handleCheckAnswer, handleContinue, isChecking, submittedResult])

  const progressPercent =
    queue.length > 0
      ? Math.min(100, Math.round(((safeIndex + (submittedResult !== null ? 1 : 0)) / queue.length) * 100))
      : 0

  return {
    totalDue: dueQuery.data?.total_due ?? initialItems.length,
    initialCount: initialItems.length,
    queueLength: queue.length,
    currentIndex: safeIndex,
    currentExercise,
    parsedContent,
    isRetryItem,
    progressPercent,
    resolvedCorrectAnswer,
    selectedTokenIndices,
    selectedTokens,
    selectedOptionValue,
    textInput,
    submittedResult,
    submitError,
    showHint,
    isCompleted,
    reviewedCount,
    firstTryCorrectCount,
    isSpeakingAudio,
    isRecordingSpeech,
    speechRecognitionSupported,
    audioPlaybackError,
    canCheckAnswer,
    isLastExercise: queue.length > 0 && safeIndex >= queue.length - 1,
    isLoading: dueQuery.isLoading,
    isError: dueQuery.isError,
    loadErrorMessage: dueQuery.isError
      ? extractApiErrorMessage(dueQuery.error, 'Gagal memuat daftar ulasan soal.')
      : null,
    isChecking,
    refetchDue: dueQuery.refetch,
    handleAddToken,
    handleRemoveToken,
    handleClearTokens,
    handleSelectOption,
    handleSetTextInput,
    handlePlayAudio,
    handleToggleRecording,
    handleCheckAnswer,
    handleContinue,
    handleToggleHint,
    handleExitToCurriculum,
    handleEnterShortcut,
    navigateToFlashcards: () => navigate('/flashcards'),
  }
}
