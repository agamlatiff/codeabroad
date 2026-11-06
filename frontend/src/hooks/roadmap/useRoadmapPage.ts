import { useState, useCallback, useRef, useEffect } from 'react'
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
 * 1:1 Headless controller hook for RoadmapPage.
 * Orchestrates backend syllabus synchronization via TanStack Query,
 * career track switching, unit accordion state, view mode (Map vs Syllabus),
 * optimistic state updates with rollback on network failure, and modal visibility.
 */
export const useRoadmapPage = (explicitTrack?: string) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { track: routeTrack } = useParams<{ track?: string }>()

  // Reactive selector for auth store
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)

  // ── 0. CURRICULUM VIEW MODE (Peta RPG vs Silabus Modul) ──
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
    } catch (error: unknown) {
      console.warn('[useRoadmapPage] Failed to read view preference from localStorage:', error)
    }
    return 'map'
  })

  // Synchronize viewMode if URL query param changes dynamically
  useEffect(() => {
    const queryView = searchParams.get('view')
    if ((queryView === 'map' || queryView === 'syllabus') && queryView !== viewMode) {
      setViewModeState(queryView)
    }
  }, [searchParams, viewMode])

  const setViewMode = useCallback((mode: CurriculumViewMode) => {
    triggerHaptic('tap')
    setViewModeState(mode)
    try {
      localStorage.setItem(CURRICULUM_VIEW_STORAGE_KEY, mode)
    } catch (error: unknown) {
      console.warn('[useRoadmapPage] Failed to persist view preference to localStorage:', error)
    }
  }, [])

  // ── 1. RESOLVE REQUESTED TRACK ──
  const userRegisteredTrack = user?.primary_stack || user?.career_path?.slug || undefined
  const requestedTrack = explicitTrack || routeTrack || userRegisteredTrack || ''

  // ── 2. FETCH SYLLABUS & PROGRESS VIA TANSTACK QUERY (SSOT) ──
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

  // ── 3. DERIVED METRICS (LIGHTWEIGHT DIRECT COMPUTATION) ──
  // No excessive useMemo chains needed for small arrays (~5 modules, ~15 quests)
  const units: SequentialCurriculumUnit[] = mapModulesToSequentialUnits(roadmap?.modules)
  const allParts = units.flatMap((u) => u.parts)
  const totalPartsCount = allParts.length
  const completedPartsCount = allParts.filter((p) => p.is_completed).length

  const overallProgress = (() => {
    const modules = roadmap?.modules || []
    if (modules.length > 0) {
      const totalRate = modules.reduce((acc, m) => acc + (m.progress_rate || 0), 0)
      return Math.round(totalRate / modules.length)
    }
    if (totalPartsCount === 0) return 0
    return Math.min(100, Math.round((completedPartsCount / totalPartsCount) * 100))
  })()

  const trackProgressMap = currentTrack
    ? {
        [currentTrack]: {
          completed: completedPartsCount,
          total: totalPartsCount,
        },
      }
    : {}

  // ── 4. PAGE UI & MODAL VISIBILITY STATES ──
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

  const showNotification = useCallback((message: string, isError = false) => {
    triggerHaptic(isError ? 'error' : 'tap')
    setLockedNotification(message)

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }

    toastTimerRef.current = setTimeout(() => {
      setLockedNotification(null)
      toastTimerRef.current = null
    }, TOAST_DURATION_MS)
  }, [])

  // ── 4b. DATABASE-BACKED FIRST-TIME TOUR ONBOARDING ──
  const hasSeenTour = user?.has_seen_roadmap_tour
  const hasTriggeredTourRef = useRef(false)

  useEffect(() => {
    if (hasSeenTour === false && !hasTriggeredTourRef.current) {
      hasTriggeredTourRef.current = true
      setIsTrackSwitcherOpen(true)
    }
  }, [hasSeenTour])

  const markTourSeen = useCallback(async () => {
    if (hasSeenTour === false) {
      // Optimistic update
      updateUser({ has_seen_roadmap_tour: true })
      try {
        await authService.updateProfile({ has_seen_roadmap_tour: true })
        await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      } catch (err: unknown) {
        // Rollback state on failure
        updateUser({ has_seen_roadmap_tour: false })
        console.error('Failed to persist has_seen_roadmap_tour to backend:', err)
      }
    }
  }, [hasSeenTour, updateUser, queryClient])

  // ── 5. ACTION HANDLERS WITH ROLLBACK ON ERROR ──
  const currentStack = user?.primary_stack
  const handleSelectTrack = useCallback(
    async (trackSlug: string) => {
      triggerHaptic('success')
      const previousStack = currentStack
      navigate(`/roadmap/${trackSlug}`)
      void markTourSeen()

      // Optimistic client update
      updateUser({ primary_stack: trackSlug })
      try {
        await authService.updateProfile({ primary_stack: trackSlug })
        await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      } catch (err: unknown) {
        // Rollback on network failure
        if (previousStack) {
          updateUser({ primary_stack: previousStack })
        }
        showNotification('Gagal menyimpan preferensi kurikulum ke server', true)
        console.error('Failed to persist selected track to backend profile:', err)
      }
    },
    [currentStack, navigate, markTourSeen, updateUser, queryClient, showNotification]
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

  const handleLockedNodeClick = useCallback(
    (title: string) => {
      showNotification(`Selesaikan sesi sebelumnya untuk membuka "${title}"`, true)
    },
    [showNotification]
  )

  const handleStartQuest = useCallback(
    (route: string) => {
      triggerHaptic('success')
      navigate(route)
    },
    [navigate]
  )

  const handleRefetch = useCallback(() => {
    void refetch()
  }, [refetch])

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
    refetch: handleRefetch,
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
