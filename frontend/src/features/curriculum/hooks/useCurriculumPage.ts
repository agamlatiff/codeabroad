import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { extractApiErrorMessage } from "@/shared/services/api"
import {
  getProfileQueryKey,
  getLanguageEnrollmentsQueryKey,
  DAILY_VOCABULARIES_QUERY_KEY,
  SRS_DUE_QUERY_KEY,
} from "@/shared/constants/queryKeys"
import { useAuthStore } from "@/features/auth/store/authStore"
import {
  curriculumService,
  CURRICULUM_QUERY_KEY,
  GRAMMAR_POINTS_QUERY_KEY,
} from "@/features/curriculum/services/curriculumService"
import {
  languageService,
  LANGUAGE_ENROLLMENTS_QUERY_KEY,
} from "@/features/curriculum/services/languageService"
import { userService } from "@/features/user/services/userService"
import { useUser } from "@/features/user/hooks/useUser"
import { triggerHaptic } from "@/shared/utils/haptics"
import { playSound, playBgm, stopBgm } from "@/shared/utils/sound"
import { computeCurriculumPageMetrics } from "@/features/curriculum/utils/curriculumMapTransformer"

const TOAST_DURATION_MS = 3200

/**
 * 1:1 Headless controller hook for CurriculumPage.
 * Orchestrates backend curriculum synchronization via TanStack Query,
 * active language switching, level grammar reference modal, and audio state.
 */
export const useCurriculumPage = (explicitLanguageId?: string) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { languageId: routeLanguageId } = useParams<{ languageId?: string }>()

  // Strip legacy ?view=map|syllabus query param if present in bookmarks/tabs
  useEffect(() => {
    if (!searchParams.has('view')) return
    const next = new URLSearchParams(searchParams)
    next.delete('view')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const { data: userData } = useUser()
  const user = userData.user
  const userIdKey = user?.id ?? 'anonymous'
  const updateUser = useAuthStore((s) => s.updateUser)

  // ── 1. RESOLVE REQUESTED LANGUAGE & ENROLLMENTS ──
  const targetLanguageId = explicitLanguageId || routeLanguageId || ''

  const { data: enrollments = [] } = useQuery({
    queryKey: getLanguageEnrollmentsQueryKey(userIdKey),
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
    totalLessonsCount,
    completedLessonsCount,
    overallProgress,
    trackProgressMap,
  } = useMemo(() => computeCurriculumPageMetrics(curriculumData), [curriculumData])

  // ── 4. PAGE UI & TOAST STATES ──
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isSwitchingLanguage, setIsSwitchingLanguage] = useState(false)
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

  // ── 4a. DATABASE-BACKED FIRST-TIME TOUR ONBOARDING ──
  const hasSeenTour = user?.has_seen_roadmap_tour
  const hasTriggeredTourRef = useRef(false)
  const isTourPersistingRef = useRef(false)

  useEffect(() => {
    if (hasSeenTour === false && enrollments.length >= 2 && !hasTriggeredTourRef.current) {
      hasTriggeredTourRef.current = true
      setIsSwitcherOpen(true)
    }
  }, [hasSeenTour, enrollments.length])

  const markTourSeen = useCallback(async () => {
    if (hasSeenTour !== false || isTourPersistingRef.current) return
    isTourPersistingRef.current = true

    updateUser({ has_seen_roadmap_tour: true })
    try {
      await userService.updateProfile({ has_seen_roadmap_tour: true })
      await queryClient.invalidateQueries({ queryKey: getProfileQueryKey(userIdKey) })
    } catch (err: unknown) {
      updateUser({ has_seen_roadmap_tour: false })
      console.error('[useCurriculumPage] Failed to persist has_seen_roadmap_tour:', err)
    } finally {
      isTourPersistingRef.current = false
    }
  }, [hasSeenTour, updateUser, queryClient, userIdKey])

  // ── 5. LANGUAGE SWITCHING & INTERACTION HANDLERS ──
  const isSwitchingRef = useRef(false)

  const handleSelectLanguage = useCallback(
    async (nextLanguageId: string) => {
      if (!nextLanguageId || isSwitchingRef.current) return
      triggerHaptic('success')
      playSound('track_change')
      void markTourSeen()

      if (nextLanguageId === activeLanguageId && !isViewingInactiveTrack) {
        return
      }

      isSwitchingRef.current = true
      setIsSwitchingLanguage(true)
      try {
        const isEnrolled = enrollments.some((e) => e.language_id === nextLanguageId)
        if (!isEnrolled) {
          await languageService.enrollLanguage(nextLanguageId)
        }
        await languageService.switchActiveLanguage(nextLanguageId)
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: CURRICULUM_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: LANGUAGE_ENROLLMENTS_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: GRAMMAR_POINTS_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: getProfileQueryKey(userIdKey) }),
          queryClient.invalidateQueries({ queryKey: DAILY_VOCABULARIES_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: SRS_DUE_QUERY_KEY }),
        ])
        navigate('/curriculum', { replace: true })
      } catch (err: unknown) {
        const msg = extractApiErrorMessage(
          err,
          'Gagal mengganti bahasa aktif. Pastikan bahasa tersedia.'
        )
        showNotification(msg, true)
      } finally {
        isSwitchingRef.current = false
        setIsSwitchingLanguage(false)
      }
    },
    [
      activeLanguageId,
      enrollments,
      isViewingInactiveTrack,
      markTourSeen,
      navigate,
      queryClient,
      showNotification,
      userIdKey,
    ]
  )

  const handleActivateCurrentTrack = useCallback(() => {
    if (!activeLanguageId) return
    void handleSelectLanguage(activeLanguageId)
  }, [activeLanguageId, handleSelectLanguage])

  const openSwitcher = useCallback(() => {
    if (enrollments.length < 2) return
    playSound('modal_open')
    setIsSwitcherOpen(true)
  }, [enrollments.length])

  const closeSwitcher = useCallback(() => {
    playSound('modal_close')
    setIsSwitcherOpen(false)
    void markTourSeen()
  }, [markTourSeen])

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

  return {
    curriculum: {
      currentLanguageId: activeLanguageId,
      data: curriculumData,
      enrollments,
      isViewingInactiveTrack,
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
      error,
      notification,
    },
    modals: {
      isSwitcherOpen,
      isMobileDrawerOpen,
    },
    actions: {
      refetch: handleRefetch,
      openSwitcher,
      closeSwitcher,
      setIsMobileDrawerOpen,
      handleSelectLanguage,
      handleActivateCurrentTrack,
      handleStartLesson,
    },
  }
}

