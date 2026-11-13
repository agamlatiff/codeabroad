import { useCallback, useMemo, useState } from 'react'
import type { CurriculumExercise } from '@/features/curriculum/types/curriculum'
import type { SubmitExerciseAnswerResponse } from '@/features/exercise/types/exercise'
import {
  formatUserAnswerForSubmission,
  parseExerciseContent,
} from '@/features/exercise/utils/exerciseHelpers'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'

interface UseExerciseQuestionInputsOptions {
  currentExercise: CurriculumExercise | null
  submittedResult: SubmitExerciseAnswerResponse | null
}

/**
 * Shared headless input controller for single-question exercise sessions (Lesson & SRS Review).
 */
export const useExerciseQuestionInputs = ({
  currentExercise,
  submittedResult,
}: UseExerciseQuestionInputsOptions) => {
  const [selectedTokenIndices, setSelectedTokenIndices] = useState<number[]>([])
  const [selectedOptionValue, setSelectedOptionValue] = useState('')
  const [textInput, setTextInput] = useState('')
  const [showHint, setShowHint] = useState(false)

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

  const resolvedCorrectAnswer = useMemo(() => {
    const raw = submittedResult?.correct_answer ?? ''
    if (!raw || !parsedContent) return raw
    const matchedOption = parsedContent.choiceOptions.find((opt) => opt.id === raw)
    return matchedOption ? matchedOption.text : raw
  }, [parsedContent, submittedResult?.correct_answer])

  const resetInputs = useCallback(() => {
    setSelectedTokenIndices([])
    setSelectedOptionValue('')
    setTextInput('')
    setShowHint(false)
  }, [])

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

  const handleToggleHint = useCallback(() => {
    audioEngine.playPop()
    triggerHaptic('tap')
    setShowHint((prev) => !prev)
  }, [])

  return {
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
  }
}

