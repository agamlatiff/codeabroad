import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { roadmapService } from '../../services/roadmapService'
import { authService } from '../../services/authService'
import { triggerHaptic } from '../../utils/haptics'
import { playSound, playBgm, stopBgm } from '../../utils/sound'
import type { SequentialCurriculumUnit } from '../../types/roadmap'
import { computeRoadmapPageMetrics } from '../../utils/roadmapMapTransformer'
import { PROFILE_QUERY_KEY } from '../../constants/queryKeys'

export const ROADMAP_QUERY_KEY = 'roadmap' as const
export const CURRICULUM_VIEW_STORAGE_KEY = 'codeabroad_curriculum_view' as const
export type CurriculumViewMode = 'map' | 'syllabus'
const TOAST_DURATION_MS = 3200
const DEFAULT_VIEW_MODE: CurriculumViewMode = 'syllabus'

const isViewMode = (value: string | null): value is CurriculumViewMode =>
  value === 'map' || value === 'syllabus'

const readStoredViewMode = (): CurriculumViewMode => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return DEFAULT_VIEW_MODE
  }
  try {
    const stored = localStorage.getItem(CURRICULUM_VIEW_STORAGE_KEY)
    if (isViewMode(stored)) return stored
  } catch (error: unknown) {
    console.warn('[useRoadmapPage] Failed to read view preference from localStorage:', error)
  }
  return DEFAULT_VIEW_MODE
}

/** Locked units (not active, not completed) start collapsed unless the user toggles them. */
const isCollapsedByDefault = (unit: SequentialCurriculumUnit): boolean =>
  !unit.isActive && !unit.isCompleted

/**
 * 1:1 Headless controller hook for RoadmapPage.
 * Orchestrates backend syllabus synchronization via TanStack Query,
 * career track switching, unit accordion state, view mode (Map vs Syllabus),
 * optimistic state updates with rollback on network failure, and modal visibility.
 */
export const useRoadmapPage = (explicitTrack?: string) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { track: routeTrack } = useParams<{ track?: string }>()

  // Reactive selector for auth store & database profile synchronization
  const storeUser = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)

  const { data: profileUser } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: authService.getProfile,
    staleTime: 1000 * 60 * 5,
  })

  const user = profileUser || storeUser

  // ── 0. CURRICULUM VIEW MODE (Peta RPG vs Silabus Modul) ──
  // URL `?view=` is the source of truth; localStorage is only the fallback preference.
  const [storedViewMode] = useState(readStoredViewMode)
  const queryView = searchParams.get('view')
  const viewMode: CurriculumViewMode = isViewMode(queryView) ? queryView : storedViewMode

  const setViewMode = useCallback(
    (mode: CurriculumViewMode) => {
      triggerHaptic('tap')
      if (mode === 'map') {
        playSound('yamanote_jingle')
      } else {
        playSound('view_switch')
      }
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('view', mode)
          return next
        },
        { replace: true }
      )
      try {
        localStorage.setItem(CURRICULUM_VIEW_STORAGE_KEY, mode)
      } catch (error: unknown) {
        console.warn('[useRoadmapPage] Failed to persist view preference to localStorage:', error)
      }
    },
    [setSearchParams]
  )

  // ── 1. RESOLVE REQUESTED TRACK ──
  const userRegisteredTrack = user?.primary_stack || user?.career_path?.slug
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

  // ── 2b. SOUNDSCAPE & CULTURAL BGM SYNCHRONIZATION ──
  useEffect(() => {
    const isJapanTrack =
      currentTrack === 'tech-nihongo' ||
      currentTrack.includes('nihongo') ||
      currentTrack.includes('japan')

    playBgm(isJapanTrack ? 'japan' : 'universal')

    return () => {
      stopBgm()
    }
  }, [currentTrack])

  // ── 3. DERIVED METRICS (SINGLE-PASS O(N) MEMOIZED COMPUTATION) ──
  // Compute total, completed counts, and unit data in one pass, memoized
  // to avoid redundant layout recalculations on UI modal toggles.
  const {
    units,
    totalPartsCount,
    completedPartsCount,
    overallProgress,
    trackProgressMap,
  } = useMemo(
    () => computeRoadmapPageMetrics(roadmap?.modules, currentTrack),
    [roadmap?.modules, currentTrack]
  )

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
  // Guards against duplicate PATCH requests (select track + close modal both mark the tour)
  const isTourPersistingRef = useRef(false)

  useEffect(() => {
    if (hasSeenTour === false && !hasTriggeredTourRef.current) {
      hasTriggeredTourRef.current = true
      setIsTrackSwitcherOpen(true)
    }
  }, [hasSeenTour])

  const markTourSeen = useCallback(async () => {
    if (hasSeenTour !== false || isTourPersistingRef.current) return
    isTourPersistingRef.current = true

    // Optimistic update
    updateUser({ has_seen_roadmap_tour: true })
    try {
      await authService.updateProfile({ has_seen_roadmap_tour: true })
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    } catch (err: unknown) {
      // Rollback state on failure and allow a retry
      updateUser({ has_seen_roadmap_tour: false })
      isTourPersistingRef.current = false
      console.error('[useRoadmapPage] Failed to persist has_seen_roadmap_tour:', err)
    }
  }, [hasSeenTour, updateUser, queryClient])

  // ── 5. ACTION HANDLERS WITH ROLLBACK ON ERROR ──
  const currentStack = user?.primary_stack
  const handleSelectTrack = useCallback(
    async (trackSlug: string) => {
      triggerHaptic('success')
      playSound('track_change')
      const previousStack = currentStack
      navigate(`/roadmap/${trackSlug}`)
      void markTourSeen()

      // Optimistic client update
      updateUser({ primary_stack: trackSlug })
      try {
        await authService.updateProfile({ primary_stack: trackSlug })
        await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      } catch (err: unknown) {
        // Rollback on network failure (restores `undefined` for first-time users too)
        updateUser({ primary_stack: previousStack })
        showNotification('Gagal menyimpan preferensi kurikulum ke server', true)
        console.error('[useRoadmapPage] Failed to persist selected track:', err)
      }
    },
    [currentStack, navigate, markTourSeen, updateUser, queryClient, showNotification]
  )

  const openTrackSwitcher = useCallback(() => {
    playSound('modal_open')
    setIsTrackSwitcherOpen(true)
  }, [])

  const closeTrackSwitcher = useCallback(() => {
    playSound('modal_close')
    setIsTrackSwitcherOpen(false)
    void markTourSeen()
  }, [markTourSeen])

  const isUnitCollapsed = useCallback(
    (unit: SequentialCurriculumUnit): boolean =>
      collapsedOverrides[unit.id] ?? isCollapsedByDefault(unit),
    [collapsedOverrides]
  )

  const toggleUnitCollapse = useCallback((unit: SequentialCurriculumUnit) => {
    triggerHaptic('tap')
    playSound('node_tap')
    setCollapsedOverrides((prev) => ({
      ...prev,
      [unit.id]: !(prev[unit.id] ?? isCollapsedByDefault(unit)),
    }))
  }, [])

  const handleLockedNodeClick = useCallback(
    (title: string) => {
      playSound('node_locked')
      showNotification(`Selesaikan sesi sebelumnya untuk membuka "${title}"`, true)
    },
    [showNotification]
  )

  const handleStartQuest = useCallback(
    (route: string) => {
      triggerHaptic('success')
      playSound('quest_start')
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
    openTrackSwitcher,
    closeTrackSwitcher,
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
