import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { roadmapService } from '../services/roadmapService'
import type { Roadmap, Station } from '../types/roadmap'

export const useRoadmap = () => {
  const { track } = useParams<{ track?: string }>()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const [openChapterIds, setOpenChapterIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoadmap = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = track
        ? await roadmapService.getTrackRoadmap(track)
        : await roadmapService.getActiveRoadmap()
      setRoadmap(data)

      // Auto-select the first active (unlocked but not completed) or first station
      if (data.stations && data.stations.length > 0) {
        const activeStation =
          data.stations.find((s) => s.is_unlocked && !s.is_completed) || data.stations[0]
        setSelectedStationId(activeStation.id)

        // Automatically expand the first chapter of that station
        if (activeStation.chapters && activeStation.chapters.length > 0) {
          setOpenChapterIds(new Set([activeStation.chapters[0].id]))
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat silabus roadmap'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [track])

  useEffect(() => {
    fetchRoadmap()
  }, [fetchRoadmap])

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

  const selectedStation: Station | undefined = useMemo(() => {
    if (!roadmap?.stations) return undefined
    return roadmap.stations.find((s) => s.id === selectedStationId) || roadmap.stations[0]
  }, [roadmap, selectedStationId])

  // Overall roadmap progress percentage
  const overallProgress = useMemo(() => {
    if (!roadmap?.stations || roadmap.stations.length === 0) return 0
    const totalRate = roadmap.stations.reduce((acc, s) => acc + (s.progress_rate || 0), 0)
    return Math.round(totalRate / roadmap.stations.length)
  }, [roadmap])

  return {
    roadmap,
    selectedStation,
    selectedStationId,
    setSelectedStationId,
    openChapterIds,
    toggleChapter,
    overallProgress,
    isLoading,
    error,
    refetch: fetchRoadmap,
  }
}
