import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { extractApiErrorMessage } from "@/shared/services/api"
import { useAuthStore } from "@/features/auth/store/authStore"
import { useCurriculumStore } from "@/features/curriculum/store/curriculumStore"
import {
  curriculumService,
  CURRICULUM_QUERY_KEY,
  GRAMMAR_POINTS_QUERY_KEY,
} from "@/features/curriculum/services/curriculumService"
import {
  languageService,
  LANGUAGE_ENROLLMENTS_QUERY_KEY,
} from "@/features/curriculum/services/languageService"
import { userService, PROFILE_QUERY_KEY } from "@/features/user/services/userService"
import { useUser } from "@/features/user/hooks/useUser"
import { triggerHaptic } from "@/shared/utils/haptics"
import { playSound, playBgm, stopBgm } from "@/shared/utils/sound"
import type {
  CurriculumViewMode,
  SequentialCurriculumUnit,
} from "@/features/curriculum/types/curriculum"
import { computeCurriculumPageMetrics } from "@/features/curriculum/utils/curriculumMapTransformer"

const TOAST_DURATION_MS = 3200

const isViewMode = (value: string | null): value is CurriculumViewMode =>
  value === 'map' || value === 'syllabus'

/** Locked units (not active, not completed) start collapsed unless the user toggles them. */
const isCollapsedByDefault = (unit: SequentialCurriculumUnit): boolean =>
  !unit.isActive && !unit.isCompleted

/**
 * 1:1 Headless controller hook for CurriculumPage.
 * Orchestrates backend curriculum synchronization via TanStack Query,
 * active language switching, unit accordion state, view mode (Map vs Syllabus),
 * level grammar reference modal, and user profile view persistence.
 */
export const useCurriculumPage = (explicitLanguageId?: string) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { languageId: routeLanguageId } = useParams<{ languageId?: string }>()

  const { data: userData } = useUser()
  const user = userData.user
  const userIdKey = user?.id ?? 'anonymous'
  const updateUser = useAuthStore((s) => s.updateUser)

  // ── 0. CURRICULUM VIEW MODE (Peta Jalur vs Silabus Modul) ──
  const storedViewMode = useCurriculumStore((s) => s.viewMode)
  const setStoreViewMode = useCurriculumStore((s) => s.setViewMode)

  const queryView = searchParams.get('view')
  const userDbView =
    user?.preferred_roadmap_view && isViewMode(user.preferred_roadmap_view)
      ? user.preferred_roadmap_view
      : null
  const viewMode: CurriculumViewMode = isViewMode(queryView)
    ? queryView
    : userDbView || storedViewMode

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

      setStoreViewMode(mode)
      updateUser({ preferred_roadmap_view: mode })
      queryClient.setQueryData(PROFILE_QUERY_KEY, (old: typeof user) =>
        old ? { ...old, preferred_roadmap_view: mode } : old
      )
      userService.updateProfile({ preferred_roadmap_view: mode }).catch((err: unknown) => {
        console.warn('[useCurriculumPage] Failed to persist view mode to backend profile:', err)
      })
    },
    [setSearchParams, setStoreViewMode, updateUser, queryClient]
  )

  // ── 1. RESOLVE REQUESTED LANGUAGE & ENROLLMENTS ──
  const targetLanguageId = explicitLanguageId || routeLanguageId || ''

  const { data: enrollments = [] } = useQuery({
    queryKey: [...LANGUAGE_ENROLLMENTS_QUERY_KEY, userIdKey],
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    staleTime: 1000 * 60 * 5,
  })

  // ── 2. FETCH CURRICULUM TREE VIA TANSTACK QUERY (SSOT) ──
  const {
    data: curriculumData = null,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [...CURRICULUM_QUERY_KEY, userIdKey, targetLanguageId || 'active'],
    queryFn: ({ signal }) =>
      curriculumService.getCurriculum(targetLanguageId || undefined, { signal }),
    staleTime: 1000 * 60 * 2,
  })

  const activeLanguageId = curriculumData?.language?.id || targetLanguageId || ''
  const activeLanguageCode = curriculumData?.language?.code || ''
  const activeLevelId = curriculumData?.level?.id || ''

  const currentEnrollment = useMemo(
    () =>
      enrollments.find((e) => e.language_id === activeLanguageId) ||
      enrollments.find((e) => e.is_active) ||
      null,
    [enrollments, activeLanguageId]
  )

  const isViewingInactiveTrack = Boolean(
    currentEnrollment && !currentEnrollment.is_active
  )

  const error = queryError ? extractApiErrorMessage(queryError, 'Gagal memuat kurikulum belajar.') : null

  // ── 2b. SOUNDSCAPE & CULTURAL BGM SYNCHRONIZATION ──
  useEffect(() => {
    if (!activeLanguageCode) return

    const isJapanTrack =
      activeLanguageCode.toLowerCase() === 'ja' ||
      activeLanguageCode.toLowerCase().includes('jp')

    playBgm(isJapanTrack ? 'japan' : 'universal')

    return () => {
      stopBgm()
    }
  }, [activeLanguageCode])

  // ── 3. DERIVED METRICS (BACKEND SSOT) ──
  const {
    units,
    totalLessonsCount,
    completedLessonsCount,
    overallProgress,
    trackProgressMap,
  } = useMemo(() => computeCurriculumPageMetrics(curriculumData), [curriculumData])

  // ── 4. PAGE UI, GRAMMAR MODAL & TOAST STATES ──
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const [isGrammarOpen, setIsGrammarOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isSwitchingLanguage, setIsSwitchingLanguage] = useState(false)
  const [collapsedOverrides, setCollapsedOverrides] = useState<Record<string, boolean>>({})
  const [notification, setNotification] = useState<string | null>(null)

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
    setNotification(message)

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }

    toastTimerRef.current = setTimeout(() => {
      setNotification(null)
      toastTimerRef.current = null
    }, TOAST_DURATION_MS)
  }, [])

  // ── 4a. LEVEL GRAMMAR POINTS QUERY (LAZY ON OPEN) ──
  const {
    data: grammarPoints = [],
    isLoading: isGrammarLoading,
    error: grammarQueryError,
    refetch: refetchGrammarPoints,
  } = useQuery({
    queryKey: [...GRAMMAR_POINTS_QUERY_KEY, userIdKey, activeLevelId],
    queryFn: ({ signal }) => curriculumService.getGrammarPoints(activeLevelId, { signal }),
    enabled: isGrammarOpen && Boolean(activeLevelId),
    staleTime: 1000 * 60 * 10,
  })

  const grammarError = grammarQueryError
    ? extractApiErrorMessage(grammarQueryError, 'Gagal memuat daftar grammar level.')
    : null

  const openGrammarModal = useCallback(() => {
    triggerHaptic('tap')
    playSound('modal_open')
    setIsGrammarOpen(true)
  }, [])

  const closeGrammarModal = useCallback(() => {
    playSound('modal_close')
    setIsGrammarOpen(false)
  }, [])

  // ── 4b. DATABASE-BACKED FIRST-TIME TOUR ONBOARDING ──
  const hasSeenTour = user?.has_seen_roadmap_tour
  const hasTriggeredTourRef = useRef(false)
  const isTourPersistingRef = useRef(false)

  useEffect(() => {
    if (hasSeenTour === false && !hasTriggeredTourRef.current) {
      hasTriggeredTourRef.current = true
      setIsSwitcherOpen(true)
    }
  }, [hasSeenTour])

  const markTourSeen = useCallback(async () => {
    if (hasSeenTour !== false || isTourPersistingRef.current) return
    isTourPersistingRef.current = true

    updateUser({ has_seen_roadmap_tour: true })
    try {
      await userService.updateProfile({ has_seen_roadmap_tour: true })
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    } catch (err: unknown) {
      updateUser({ has_seen_roadmap_tour: false })
      console.error('[useCurriculumPage] Failed to persist has_seen_roadmap_tour:', err)
    } finally {
      isTourPersistingRef.current = false
    }
  }, [hasSeenTour, updateUser, queryClient])

  // ── 5. LANGUAGE SWITCHING & INTERACTION HANDLERS ──
  const handleSelectLanguage = useCallback(
    async (nextLanguageId: string) => {
      if (!nextLanguageId) return
      triggerHaptic('success')
      playSound('track_change')
      void markTourSeen()

      if (nextLanguageId === activeLanguageId && !isViewingInactiveTrack) {
        return
      }

      setIsSwitchingLanguage(true)
      try {
        await languageService.switchActiveLanguage(nextLanguageId)
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: CURRICULUM_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: LANGUAGE_ENROLLMENTS_QUERY_KEY }),
        ])
        navigate('/curriculum', { replace: true })
      } catch (err: unknown) {
        const msg = extractApiErrorMessage(
          err,
          'Gagal mengganti bahasa aktif. Pastikan bahasa sudah terdaftar.'
        )
        showNotification(msg, true)
      } finally {
        setIsSwitchingLanguage(false)
      }
    },
    [
      activeLanguageId,
      isViewingInactiveTrack,
      markTourSeen,
      navigate,
      queryClient,
      showNotification,
    ]
  )

  const handleActivateCurrentTrack = useCallback(() => {
    if (!activeLanguageId) return
    void handleSelectLanguage(activeLanguageId)
  }, [activeLanguageId, handleSelectLanguage])

  const openSwitcher = useCallback(() => {
    playSound('modal_open')
    setIsSwitcherOpen(true)
  }, [])

  const closeSwitcher = useCallback(() => {
    playSound('modal_close')
    setIsSwitcherOpen(false)
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
      if (isViewingInactiveTrack) {
        showNotification(`Aktifkan track bahasa ini terlebih dahulu untuk membuka "${title}"`, true)
        return
      }
      showNotification(`Selesaikan lesson sebelumnya untuk membuka "${title}"`, true)
    },
    [isViewingInactiveTrack, showNotification]
  )

  const handleStartLesson = useCallback(
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

  const handleRefetchGrammar = useCallback(() => {
    void refetchGrammarPoints()
  }, [refetchGrammarPoints])

  return {
    curriculum: {
      currentLanguageId: activeLanguageId,
      data: curriculumData,
      enrollments,
      units,
      viewMode,
      isViewingInactiveTrack,
      grammarPoints,
      metrics: {
        totalLessonsCount,
        completedLessonsCount,
        overallProgress,
        trackProgressMap,
      },
    },
    status: {
      isLoading,
      isSwitchingLanguage,
      isGrammarLoading,
      error,
      grammarError,
      notification,
    },
    modals: {
      isSwitcherOpen,
      isLeaderboardOpen,
      isGrammarOpen,
      isMobileDrawerOpen,
      isUnitCollapsed,
    },
    actions: {
      refetch: handleRefetch,
      refetchGrammar: handleRefetchGrammar,
      setViewMode,
      openSwitcher,
      closeSwitcher,
      openGrammarModal,
      closeGrammarModal,
      setIsLeaderboardOpen,
      setIsMobileDrawerOpen,
      toggleUnitCollapse,
      handleLockedNodeClick,
      handleSelectLanguage,
      handleActivateCurrentTrack,
      handleStartLesson,
    },
  }
}

