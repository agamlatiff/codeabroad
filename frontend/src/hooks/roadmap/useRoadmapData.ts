import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { roadmapService } from '../../services/roadmapService'
import { authService } from '../../services/authService'
import { triggerHaptic } from '../../utils/haptics'
import type { Roadmap, Module } from '../../types/roadmap'
import {
  CURRICULUM_TRACKS_MAP,
  type SequentialCurriculumUnit,
  type SequentialPartItem,
} from '../../data/curriculumData'

export interface UseRoadmapDataOptions {
  explicitTrack?: string
  completedQuestsSet?: Set<string>
}

export const useRoadmapData = (options?: UseRoadmapDataOptions) => {
  const { explicitTrack, completedQuestsSet = new Set<string>() } = options || {}
  const navigate = useNavigate()
  const { track: routeTrack } = useParams<{ track?: string }>()
  const { user } = useAuthStore()

  // Dynamic track resolution (Zero hardcoding)
  const defaultTrack = Object.keys(CURRICULUM_TRACKS_MAP)[0] || 'golang'
  const userRegisteredTrack = user?.primary_stack || user?.career_path?.slug || undefined
  const effectiveTrack = explicitTrack || routeTrack || userRegisteredTrack || defaultTrack

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [openChapterIds, setOpenChapterIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoadmap = useCallback(async () => {
    if (!effectiveTrack) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await roadmapService.getTrackRoadmap(effectiveTrack)
      setRoadmap(data)

      const modules = data.modules || []
      if (modules.length > 0) {
        const activeModule =
          modules.find((m) => m.is_unlocked && !m.is_completed) || modules[0]
        setSelectedModuleId(activeModule.id)

        if (activeModule.chapters && activeModule.chapters.length > 0) {
          setOpenChapterIds(new Set([activeModule.chapters[0].id]))
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat silabus roadmap'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [effectiveTrack])

  useEffect(() => {
    fetchRoadmap()
  }, [fetchRoadmap])

  const toggleChapter = useCallback((chapterId: string) => {
    setOpenChapterIds((prev) => {
      const next = new Set(prev)
      if (next.has(chapterId)) {
        next.delete(chapterId)
      } else {
        next.add(chapterId)
      }
      return next
    })
  }, [])

  // Dynamic Sequential Units: Prioritizes backend modules with graceful fallback to curriculumData
  const units: SequentialCurriculumUnit[] = useMemo(() => {
    const modules = roadmap?.modules || []
    if (modules.length > 0) {
      let partCounter = 1
      return modules.map((m) => {
        const parts: SequentialPartItem[] = []
        if (m.chapters && m.chapters.length > 0) {
          m.chapters.forEach((ch) => {
            if (ch.quests && ch.quests.length > 0) {
              ch.quests.forEach((q) => {
                parts.push({
                  id: q.id,
                  globalPartNumber: partCounter++,
                  title: q.title,
                  subtitle: ch.title,
                  chipLabel: q.chip_label || `S-${m.module_number}.${ch.chapter_number}`,
                  category: q.type === 'boss' ? 'capstone' : 'code',
                  difficulty: (q.difficulty as 'Pemula' | 'Menengah' | 'Sulit') || 'Pemula',
                  estimatedMinutes: q.estimated_minutes || 10,
                  xpReward: q.xp_reward || 50,
                  route: `/learn/${q.id}`,
                  is_unlocked: q.status !== 'locked',
                  is_completed: q.status === 'completed',
                })
              })
            } else {
              parts.push({
                id: ch.id,
                globalPartNumber: partCounter++,
                title: ch.title,
                subtitle: m.title,
                chipLabel: `CH 0${ch.chapter_number}`,
                category: 'code',
                difficulty: 'Pemula',
                estimatedMinutes: 10,
                xpReward: 50,
                route: `/learn/${ch.id}`,
                is_unlocked: ch.is_unlocked,
                is_completed: ch.is_completed,
              })
            }
          })
        }

        return {
          id: m.id,
          unitNumber: m.module_number,
          tag: `MODUL 0${m.module_number}`,
          title: `Unit ${m.module_number}: ${m.title}`,
          description: m.description || '',
          totalXp: parts.reduce((acc, p) => acc + p.xpReward, 0) || 150,
          progressRate: m.progress_rate,
          isUnlocked: m.is_unlocked,
          isCompleted: m.is_completed,
          parts,
        }
      })
    }

    return CURRICULUM_TRACKS_MAP[effectiveTrack] || CURRICULUM_TRACKS_MAP[defaultTrack]
  }, [roadmap, effectiveTrack, defaultTrack])

  // Compute metrics across all parts of current active track
  const allParts = useMemo(() => units.flatMap((u) => u.parts), [units])
  const totalPartsCount = allParts.length
  const completedPartsCount = useMemo(() => {
    return allParts.filter((p) =>
      p.is_completed !== undefined ? p.is_completed : completedQuestsSet.has(p.id)
    ).length
  }, [allParts, completedQuestsSet])

  // Overall roadmap progress percentage (backend progressRate preferred)
  const overallProgress = useMemo(() => {
    const modules = roadmap?.modules || []
    if (modules.length > 0) {
      const totalRate = modules.reduce((acc, m) => acc + (m.progress_rate || 0), 0)
      return Math.round(totalRate / modules.length)
    }
    if (totalPartsCount === 0) return 0
    return Math.min(100, Math.round((completedPartsCount / totalPartsCount) * 100))
  }, [roadmap, totalPartsCount, completedPartsCount])

  const curriculumProgressPercent = overallProgress

  // First active part (next unlocked part in active track)
  const nextActivePart = useMemo(() => {
    return (
      allParts.find((p) =>
        p.is_completed !== undefined ? !p.is_completed : !completedQuestsSet.has(p.id)
      ) || allParts[0]
    )
  }, [allParts, completedQuestsSet])

  // Multi-track progress map for CourseSwitcherModal
  const trackProgressMap = useMemo(() => {
    const progressMap: Record<string, { completed: number; total: number }> = {}
    Object.entries(CURRICULUM_TRACKS_MAP).forEach(([trackSlug, trackUnits]) => {
      const parts = trackUnits.flatMap((u) => u.parts)
      const completed = parts.filter((p) => completedQuestsSet.has(p.id)).length
      progressMap[trackSlug] = {
        completed,
        total: parts.length > 0 ? parts.length : 10,
      }
    })
    return progressMap
  }, [completedQuestsSet])

  // Handle track switch from CourseSwitcherModal
  const handleSelectTrack = useCallback(
    async (trackSlug: string) => {
      triggerHaptic('success')
      navigate(`/roadmap/${trackSlug}`)
      useAuthStore.getState().updateUser({ primary_stack: trackSlug })
      try {
        await authService.updateProfile({ primary_stack: trackSlug })
      } catch {
        // Gracefully continue with local state
      }
    },
    [navigate]
  )

  const selectedModule: Module | undefined = useMemo(() => {
    const modules = roadmap?.modules || []
    if (modules.length === 0) return undefined
    return modules.find((m) => m.id === selectedModuleId) || modules[0]
  }, [roadmap, selectedModuleId])

  return {
    activeTrack: effectiveTrack,
    currentTrack: effectiveTrack,
    roadmap,
    modules: roadmap?.modules || [],
    units,
    allParts,
    totalPartsCount,
    completedPartsCount,
    curriculumProgressPercent,
    overallProgress,
    nextActivePart,
    trackProgressMap,
    handleSelectTrack,
    selectedModule,
    selectedModuleId,
    setSelectedModuleId,
    openChapterIds,
    toggleChapter,
    isLoading,
    error,
    refetch: fetchRoadmap,
  }
}

