import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { questService } from '../services/questService'
import { useQuestStore } from '../store/questStore'
import { useAuthStore } from '../store/authStore'
import { triggerHaptic } from '../utils/haptics'
import { audioEngine } from '../utils/audio'
import {
  getWorkspaceQuestFallback,
  evaluateWorkspaceCode,
  generateSubmitResponse,
} from '../data/workspaceCatalog'

export const useLearnWorkspace = () => {
  const { id } = useParams<{ id: string }>()
  const {
    currentQuest,
    userCode,
    isRunningTests,
    testResult,
    isSubmitting,
    submitResult,
    error,
    setQuest,
    setUserCode,
    resetUserCode,
    setIsRunningTests,
    setTestResult,
    setIsSubmitting,
    setSubmitResult,
    setError,
    clearWorkspace,
  } = useQuestStore()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)

  const fetchQuest = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await questService.getQuestDetails(id)
      setQuest(data)
    } catch {
      // Gracefully fallback to rich workspace catalog so any curriculum track is fully playable
      const fallback = getWorkspaceQuestFallback(id)
      setQuest(fallback)
    } finally {
      setIsLoading(false)
    }
  }, [id, setQuest, setError])

  useEffect(() => {
    fetchQuest()
    return () => {
      // Don't wipe submitResult if we are navigating to completion screen
    }
  }, [fetchQuest])

  // Run automated unit tests in the sandbox
  const handleRunTests = async () => {
    if (!id || isRunningTests) return
    setIsRunningTests(true)
    setError(null)
    triggerHaptic('tap')

    try {
      const res = await questService.runTests(id, {
        code: userCode,
        filename: currentQuest?.starter_code?.filename,
      })
      setTestResult(res)
      if (res.success) {
        triggerHaptic('success')
        audioEngine.playSuccess()
      } else {
        triggerHaptic('error')
        audioEngine.playError()
      }
    } catch {
      // Heuristic fallback testing engine
      if (currentQuest) {
        const fallbackRes = evaluateWorkspaceCode(currentQuest, userCode)
        setTestResult(fallbackRes)
        if (fallbackRes.success) {
          triggerHaptic('success')
          audioEngine.playSuccess()
        } else {
          triggerHaptic('error')
          audioEngine.playError()
        }
      } else {
        setError('Gagal mengevaluasi kode')
        triggerHaptic('error')
        audioEngine.playError()
      }
    } finally {
      setIsRunningTests(false)
    }
  }

  // Submit final verified code solution
  const handleSubmit = async () => {
    if (!id || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    triggerHaptic('tap')

    try {
      const res = await questService.submitQuest(id, { code: userCode })
      setSubmitResult(res)

      // Sync gamification state to global user store immediately
      updateUser({
        xp: res.current_xp,
        current_level: res.current_level,
        streak: res.streak,
      })

      // Persist completed quest for instant multi-page reactivity
      try {
        const stored = JSON.parse(localStorage.getItem('codeabroad_completed_quests') || '[]')
        if (!stored.includes(id)) {
          stored.push(id)
          localStorage.setItem('codeabroad_completed_quests', JSON.stringify(stored))
          window.dispatchEvent(new Event('codeabroad_quest_completed'))
        }
      } catch {
        // Ignore localStorage error
      }

      triggerHaptic('stampImpact')
      audioEngine.playSuccess()
    } catch {
      // Fallback submit completion response
      if (currentQuest) {
        const fallbackRes = generateSubmitResponse(currentQuest, user)
        setSubmitResult(fallbackRes)

        updateUser({
          xp: fallbackRes.current_xp,
          streak: fallbackRes.streak,
        })

        try {
          const stored = JSON.parse(localStorage.getItem('codeabroad_completed_quests') || '[]')
          if (!stored.includes(id)) {
            stored.push(id)
            localStorage.setItem('codeabroad_completed_quests', JSON.stringify(stored))
            window.dispatchEvent(new Event('codeabroad_quest_completed'))
          }
        } catch {
          // Ignore localStorage error
        }

        triggerHaptic('stampImpact')
        audioEngine.playSuccess()
      } else {
        setError('Gagal menyelesaikan quest')
        triggerHaptic('error')
        audioEngine.playError()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Keyboard shortcut listener: Ctrl+Enter / Cmd+Enter runs tests
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRunTests()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRunTests])

  return {
    quest: currentQuest,
    userCode,
    setUserCode,
    resetUserCode,
    isRunningTests,
    testResult,
    isSubmitting,
    submitResult,
    dismissModal: () => setSubmitResult(null),
    isLoading,
    error,
    handleRunTests,
    handleSubmit,
    clearWorkspace,
  }
}
