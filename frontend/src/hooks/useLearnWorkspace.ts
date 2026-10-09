import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { questService } from '../services/questService'
import { useQuestStore } from '../store/questStore'
import { useAuthStore } from '../store/authStore'
import { triggerHaptic } from '../utils/haptics'

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
  const updateUser = useAuthStore((s) => s.updateUser)

  const fetchQuest = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await questService.getQuestDetails(id)
      setQuest(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat detail misi'
      setError(msg)
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
      } else {
        triggerHaptic('error')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menjalankan unit test'
      setError(msg)
      triggerHaptic('error')
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

      triggerHaptic('stampImpact')
      // Modal is opened via submitResult in store
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyelesaikan quest'
      setError(msg)
      triggerHaptic('error')
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
