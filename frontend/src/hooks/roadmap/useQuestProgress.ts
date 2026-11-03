import { useState, useEffect, useCallback } from 'react'
import { questService } from '../../services/questService'

const STORAGE_KEY = 'codeabroad_completed_quests'
const QUEST_COMPLETED_EVENT = 'codeabroad_quest_completed'

export const useQuestProgress = () => {
  const [completedQuestsSet, setCompletedQuestsSet] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? new Set(JSON.parse(stored)) : new Set<string>()
    } catch {
      return new Set<string>()
    }
  })

  // Synchronize with backend API on mount
  useEffect(() => {
    let isMounted = true
    questService
      .listQuests()
      .then((quests) => {
        if (!isMounted || !quests || quests.length === 0) return
        setCompletedQuestsSet((prev) => {
          const next = new Set(prev)
          quests.forEach((q) => {
            if (q.user_status === 'completed') {
              next.add(q.id)
            }
          })
          return next
        })
      })
      .catch(() => {
        // Gracefully continue with cached local storage
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Listen for realtime quest completion events
  useEffect(() => {
    const handleQuestCompleted = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setCompletedQuestsSet(new Set(JSON.parse(stored)))
        }
      } catch (e) {
        console.error('Failed to sync completed quests from storage event:', e)
      }
    }
    window.addEventListener(QUEST_COMPLETED_EVENT, handleQuestCompleted)
    return () => {
      window.removeEventListener(QUEST_COMPLETED_EVENT, handleQuestCompleted)
    }
  }, [])

  const isQuestCompleted = useCallback(
    (questId: string) => completedQuestsSet.has(questId),
    [completedQuestsSet]
  )

  const markQuestCompleted = useCallback((questId: string) => {
    setCompletedQuestsSet((prev) => {
      const next = new Set(prev)
      next.add(questId)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)))
      } catch {
        // Ignore storage write issues
      }
      return next
    })
  }, [])

  return {
    completedQuestsSet,
    isQuestCompleted,
    markQuestCompleted,
  }
}

