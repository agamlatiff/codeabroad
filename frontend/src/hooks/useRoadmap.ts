import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { roadmapService } from '../services/roadmapService'
import type { Roadmap, Module } from '../types/roadmap'

export const useRoadmap = (explicitTrack?: string) => {
  const { track: routeTrack } = useParams<{ track?: string }>()
  const effectiveTrack = explicitTrack || routeTrack
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [openChapterIds, setOpenChapterIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoadmap = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = effectiveTrack
        ? await roadmapService.getTrackRoadmap(effectiveTrack)
        : await roadmapService.getActiveRoadmap()

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
  }, [effectiveTrack])

  const toggleChapter = (chapterId: string) => {
    setOpenChapterIds((prev) => {
      const next = new Set(prev)
      if (next.has(chapterId)) {
        next.delete(chapterId)
      } else {
        next.add(chapterId)
      }
      return next
    })
  }

  const selectedModule: Module | undefined = useMemo(() => {
    const modules = roadmap?.modules || []
    if (modules.length === 0) return undefined
    return modules.find((m) => m.id === selectedModuleId) || modules[0]
  }, [roadmap, selectedModuleId])

  const overallProgress = useMemo(() => {
    const modules = roadmap?.modules || []
    if (modules.length === 0) return 0
    const totalRate = modules.reduce((acc, m) => acc + (m.progress_rate || 0), 0)
    return Math.round(totalRate / modules.length)
  }, [roadmap])

  return {
    roadmap,
    modules: roadmap?.modules || [],
    selectedModule,
    selectedModuleId,
    setSelectedModuleId,
    openChapterIds,
    toggleChapter,
    overallProgress,
    isLoading,
    error,
    refetch: fetchRoadmap,
  }
}
