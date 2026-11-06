import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { roadmapService } from '../../services/roadmapService'
import { authService } from '../../services/authService'
import { triggerHaptic } from '../../utils/haptics'
import type { SequentialCurriculumUnit } from '../../types/roadmap'
import { mapModulesToSequentialUnits } from '../../utils/roadmapMapper'
import { PROFILE_QUERY_KEY } from '../layout/top-bar/useAppTopBar'

export const ROADMAP_QUERY_KEY = 'roadmap' as const
export const CURRICULUM_VIEW_STORAGE_KEY = 'codeabroad_curriculum_view' as const
export type CurriculumViewMode = 'map' | 'syllabus'
const TOAST_DURATION_MS = 3200

/**
 * 1:1 Headless controller hook for RoadmapPage and DashboardPage.
 * Orchestrates backend syllabus synchronization via TanStack Query,
 * career track switching, unit accordion state, view mode (Map vs Syllabus),
 * and modal dialog visibility.
 */
export const useRoadmapPage = (explicitTrack?: string) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { track: routeTrack } = useParams<{ track?: string }>()
  const { user } = useAuthStore()

  // 0. Curriculum View Mode (Peta RPG vs Silabus Modul)
  const [viewMode, setViewModeState] = useState<CurriculumViewMode>(() => {
    const queryView = searchParams.get('view')
    if (queryView === 'map' || queryView === 'syllabus') {
      return queryView
    }
    if (location.pathname.startsWith('/roadmap')) {
      return 'syllabus'
    }
    try {
      const stored = localStorage.getItem(CURRICULUM_VIEW_STORAGE_KEY)
      if (stored === 'map' || stored === 'syllabus') {
        return stored
      }
    } catch {
      /* ignore storage failure */
    }
    return 'map'
  })

  const setViewMode = useCallback((mode: CurriculumViewMode) => {
    triggerHaptic('tap')
    setViewModeState(mode)
    try {
      localStorage.setItem(CURRICULUM_VIEW_STORAGE_KEY, mode)
    } catch {
      /* ignore storage failure */
    }
  }, [])

  // 1. Resolve requested track from explicit prop, URL route, or user's registered stack
  const userRegisteredTrack = user?.primary_stack || user?.career_path?.slug || undefined
  const requestedTrack = explicitTrack || routeTrack || userRegisteredTrack || ''

  // 2. Fetch career track syllabus and progress from backend PostgreSQL via TanStack Query
  const {
    data: roadmap = null,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [ROADMAP_QUERY_KEY, requestedTrack || 'active'],
    queryFn: () =>
      requestedTrack
        ? roadmapService.getTrackRoadmap(requestedTrack)
        : roadmapService.getActiveRoadmap(),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  })

  const currentTrack = roadmap?.slug || requestedTrack
  const error = queryError instanceof Error ? queryError.message : null

  // 3. Transform database modules into decorated sequential units
  const units: SequentialCurriculumUnit[] = useMemo(
    () => mapModulesToSequentialUnits(roadmap?.modules),
    [roadmap]
  )

  const allParts = useMemo(() => units.flatMap((u) => u.parts), [units])
  const totalPartsCount = allParts.length
  const completedPartsCount = useMemo(
    () => allParts.filter((p) => p.is_completed).length,
    [allParts]
  )

  const overallProgress = useMemo(() => {
    const modules = roadmap?.modules || []
    if (modules.length > 0) {
      const totalRate = modules.reduce((acc, m) => acc + (m.progress_rate || 0), 0)
      return Math.round(totalRate / modules.length)
    }
    if (totalPartsCount === 0) return 0
    return Math.min(100, Math.round((completedPartsCount / totalPartsCount) * 100))
  }, [roadmap, totalPartsCount, completedPartsCount])

  const trackProgressMap = useMemo(() => {
    if (!currentTrack) return {}
    return {
      [currentTrack]: {
        completed: completedPartsCount,
        total: totalPartsCount,
      },
    }
  }, [currentTrack, completedPartsCount, totalPartsCount])

  // 4. Page UI & Modal visibility states
  const [isTrackSwitcherOpen, setIsTrackSwitcherOpen] = useState(false)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [collapsedOverrides, setCollapsedOverrides] = useState<Record<string, boolean>>({})
  const [lockedNotification, setLockedNotification] = useState<string | null>(null)

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  // 4b. Auto-open curriculum intro modal if user has never seen the tour in database
  const hasTriggeredTourRef = useRef(false)
  useEffect(() => {
    if (user && user.has_seen_roadmap_tour === false && !hasTriggeredTourRef.current) {
      hasTriggeredTourRef.current = true
      setIsTrackSwitcherOpen(true)
    }
  }, [user])

  const markTourSeen = useCallback(async () => {
    if (user && user.has_seen_roadmap_tour === false) {
      useAuthStore.getState().updateUser({ has_seen_roadmap_tour: true })
      try {
        await authService.updateProfile({ has_seen_roadmap_tour: true })
        await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      } catch (err: unknown) {
        console.warn('Failed to persist has_seen_roadmap_tour to backend:', err)
      }
    }
  }, [user, queryClient])

  // 5. Action handlers
  const handleSelectTrack = useCallback(
    async (trackSlug: string) => {
      triggerHaptic('success')
      navigate(`/roadmap/${trackSlug}`)
      void markTourSeen()
      useAuthStore.getState().updateUser({ primary_stack: trackSlug })
      try {
        await authService.updateProfile({ primary_stack: trackSlug })
        await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      } catch (err: unknown) {
        console.warn('Failed to persist selected track to backend profile:', err)
      }
    },
    [navigate, queryClient, markTourSeen]
  )

  const handleCloseTrackSwitcher = useCallback(() => {
    setIsTrackSwitcherOpen(false)
    void markTourSeen()
  }, [markTourSeen])

  // Locked units (!isActive && !isCompleted) are collapsed by default unless toggled by the user
  const isUnitCollapsed = useCallback(
    (unit: SequentialCurriculumUnit): boolean => {
      if (unit.id in collapsedOverrides) {
        return collapsedOverrides[unit.id]
      }
      return !unit.isActive && !unit.isCompleted
    },
    [collapsedOverrides]
  )

  const toggleUnitCollapse = useCallback((unit: SequentialCurriculumUnit) => {
    triggerHaptic('tap')
    setCollapsedOverrides((prev) => {
      const currentCollapsed =
        unit.id in prev ? prev[unit.id] : !unit.isActive && !unit.isCompleted
      return {
        ...prev,
        [unit.id]: !currentCollapsed,
      }
    })
  }, [])

  const handleLockedNodeClick = useCallback((title: string) => {
    triggerHaptic('error')
    setLockedNotification(`Selesaikan sesi sebelumnya untuk membuka "${title}"`)

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }

    toastTimerRef.current = setTimeout(() => {
      setLockedNotification(null)
      toastTimerRef.current = null
    }, TOAST_DURATION_MS)
  }, [])

  const handleStartQuest = useCallback(
    (route: string) => {
      triggerHaptic('success')
      navigate(route)
    },
    [navigate]
  )

  return {
    currentTrack,
    roadmap,
    units,
    totalPartsCount,
    completedPartsCount,
    overallProgress,
    trackProgressMap,
    isLoading,
    error,
    refetch: () => {
      void refetch()
    },
    isTrackSwitcherOpen,
    setIsTrackSwitcherOpen,
    handleCloseTrackSwitcher,
    isLeaderboardOpen,
    setIsLeaderboardOpen,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    isUnitCollapsed,
    toggleUnitCollapse,
    lockedNotification,
    handleLockedNodeClick,
    handleSelectTrack,
    handleStartQuest,
    viewMode,
    setViewMode,
  }
}

