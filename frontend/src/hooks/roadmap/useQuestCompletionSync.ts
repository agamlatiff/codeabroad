import { useState, useEffect, useMemo } from 'react'
import type { Roadmap } from '../../types/roadmap'
import { resolveCompletedQuestSet } from '../../utils/roadmapMapTransformer'

const STORAGE_KEY = 'codeabroad_completed_quests'

const readLocalCompletedQuests = (): string[] => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return []
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Headless synchronization hook that listens for real-time quest completions
 * across the application and aggregates completed IDs into a fast lookup Set.
 */
export const useQuestCompletionSync = (roadmap?: Roadmap | null): Set<string> => {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleSync = () => setTick((prev) => prev + 1)

    window.addEventListener('codeabroad_quest_completed', handleSync)
    window.addEventListener('storage', handleSync)

    return () => {
      window.removeEventListener('codeabroad_quest_completed', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  return useMemo(() => {
    void tick // Re-evaluate when storage or custom event fires
    const localIds = readLocalCompletedQuests()
    return resolveCompletedQuestSet(roadmap, localIds)
  }, [roadmap, tick])
}
