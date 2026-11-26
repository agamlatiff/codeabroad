import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { extractApiErrorMessage } from "@/shared/services/api"
import {
  getProfileQueryKey,
  getLanguageEnrollmentsQueryKey,
  DAILY_VOCABULARIES_QUERY_KEY,
  SRS_DUE_QUERY_KEY,
  SWITCH_LANGUAGE_MUTATION_KEY,
} from "@/shared/constants/queryKeys"
import { useAuthStore } from "@/features/auth/store/authStore"
import {
  getGuestTotalXp,
  isGuestLessonCompleted,
  findGuestCompletedLesson,
  useGuestTrialStore,
} from "@/features/auth/store/guestTrialStore"
import { useGuestTrialSync } from "@/features/auth/hooks/useGuestTrialSync"
import type { GuestLoginPromptReason } from "@/features/auth/components/GuestLoginPromptModal"
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
import { checkLevelAccess, isUserPro } from "@/shared/utils/levelAccess"

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
  const isGuest = !user
  const isPro = isUserPro(user)
  const userIdKey = user?.id ?? 'anonymous'
  const updateUser = useAuthStore((s) => s.updateUser)

  const requestedLevelCode = (searchParams.get('level') ?? '').trim().toUpperCase()
  const effectiveLevelCode = requestedLevelCode || 'N5'
  const levelAccess = useMemo(
    () =>
      checkLevelAccess(effectiveLevelCode, {
        isAuthenticated: !isGuest,
        isPro,
      }),
    [effectiveLevelCode, isGuest, isPro]
  )

  const handleSelectLevel = useCallback(
    (nextLevelCode: string) => {
      const normalized = (nextLevelCode.trim().toUpperCase() || 'N5')
      if (normalized === effectiveLevelCode) return
      triggerHaptic('tap')
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('level', normalized)
          return next
        },
        { replace: true }
      )
    },
    [effectiveLevelCode, setSearchParams]
  )

  const guestCompletedLessons = useGuestTrialStore((s) => s.completedLessons)
  const guestPendingXp = useMemo(
    () => getGuestTotalXp(guestCompletedLessons),
    [guestCompletedLessons]
  )
  const { syncedSummary, dismissSyncedSummary } = useGuestTrialSync()

  // ── 1. RESOLVE REQUESTED LANGUAGE & ENROLLMENTS ──
  const targetLanguageId = explicitLanguageId || routeLanguageId || ''

  const { data: enrollments = [] } = useQuery({
    queryKey: getLanguageEnrollmentsQueryKey(userIdKey),
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 5,
  })

  // ── 2. FETCH CURRICULUM TREE VIA TANSTACK QUERY (SSOT) ──
  const {
    data: rawCurriculumData = null,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      ...CURRICULUM_QUERY_KEY,
      userIdKey,
      targetLanguageId || 'active',
      effectiveLevelCode,
    ],
    queryFn: ({ signal }) =>
      curriculumService.getCurriculum(
        targetLanguageId || undefined,
        { signal },
        requestedLevelCode || undefined
      ),
    enabled: levelAccess.allowed,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  })

  // In guest preview mode, overlay locally completed Unit-1 trial lessons onto the map cleanly
  const curriculumData = useMemo(() => {
    if (!rawCurriculumData) return null
    if (!isGuest || guestCompletedLessons.length === 0) {
      return rawCurriculumData
    }

    let completedTotal = 0
    let lessonsTotal = 0
    let nextActiveLessonId: string | null = null
    const overlaidUnits = rawCurriculumData.units.map((unit) => {
      let unitCompleted = 0
      const overlaidLessons = (unit.lessons ?? []).map((lesson) => {
        lessonsTotal += 1
        const matched =
          findGuestCompletedLesson(guestCompletedLessons, lesson.id) ??
          findGuestCompletedLesson(guestCompletedLessons, lesson.slug)
        if (matched || isGuestLessonCompleted(guestCompletedLessons, lesson.id)) {
          unitCompleted += 1
          completedTotal += 1
          return {
            ...lesson,
            is_completed: true,
            score: matched?.accuracyPercent ?? lesson.score,
            completed_exercises: lesson.total_exercises || lesson.completed_exercises,
          }
        }
        if (lesson.is_unlocked && nextActiveLessonId === null) {
          nextActiveLessonId = lesson.id
        }
        return lesson
      })
      return {
        ...unit,
        completed_lessons: unitCompleted,
        lessons: overlaidLessons,
      }
    })

    return {
      ...rawCurriculumData,
      completed_lessons: completedTotal,
      total_lessons: lessonsTotal,
      current_lesson_id: nextActiveLessonId,
      progress_percent:
        lessonsTotal > 0 ? Math.round((completedTotal / lessonsTotal) * 100) : 0,
      units: overlaidUnits,
    }
  }, [guestCompletedLessons, isGuest, rawCurriculumData])

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
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [guestPromptReason, setGuestPromptReason] = useState<GuestLoginPromptReason | null>(null)
  const [isGuestBannerDismissed, setIsGuestBannerDismissed] = useState(false)
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

  // ── 4a. DATABASE-BACKED FIRST-TIME SPOTLIGHT TOUR & REPLAY ──
  const hasSeenTour = user?.has_seen_roadmap_tour
  const hasTriggeredTourRef = useRef(false)
  const isTourPersistingRef = useRef(false)
  const tourRequestedViaUrl = searchParams.get('tour') === '1'

  useEffect(() => {
    if (isLoading || !curriculumData) return

    if (tourRequestedViaUrl) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('tour')
      const timer = window.setTimeout(() => {
        setSearchParams(nextParams, { replace: true })
        setIsTourOpen(true)
      }, 150)
      return () => window.clearTimeout(timer)
    }

    if (hasSeenTour === false && !hasTriggeredTourRef.current) {
      const timer = window.setTimeout(() => {
        hasTriggeredTourRef.current = true
        setIsTourOpen(true)
      }, 450)
      return () => window.clearTimeout(timer)
    }
  }, [curriculumData, hasSeenTour, isLoading, searchParams, setSearchParams, tourRequestedViaUrl])

  const markTourSeen = useCallback(async () => {
    if (!user || hasSeenTour !== false || isTourPersistingRef.current) return
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
  }, [hasSeenTour, queryClient, updateUser, user, userIdKey])

  const completeTour = useCallback(() => {
    setIsTourOpen(false)
    void markTourSeen()
  }, [markTourSeen])

  const skipTour = useCallback(() => {
    setIsTourOpen(false)
    void markTourSeen()
  }, [markTourSeen])

  // ── 5. LANGUAGE SWITCHING & INTERACTION HANDLERS ──
  const isSwitchingRef = useRef(false)
  const { mutateAsync: switchLanguageMutation } = useMutation({
    mutationKey: SWITCH_LANGUAGE_MUTATION_KEY,
    mutationFn: async (nextLanguageId: string) => {
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
    },
  })

  const handleSelectLanguage = useCallback(
    async (nextLanguageId: string) => {
      if (!nextLanguageId || isSwitchingRef.current) return
      if (!user) {
        triggerHaptic('success')
        playSound('track_change')
        if (nextLanguageId !== activeLanguageId) {
          navigate(`/curriculum/${nextLanguageId}`)
        }
        return
      }
      triggerHaptic('success')
      playSound('track_change')
      void markTourSeen()

      if (nextLanguageId === activeLanguageId && !isViewingInactiveTrack) {
        return
      }

      isSwitchingRef.current = true
      setIsSwitchingLanguage(true)
      try {
        await switchLanguageMutation(nextLanguageId)
        navigate('/curriculum', { replace: true })
        return true
      } catch (err: unknown) {
        const msg = extractApiErrorMessage(
          err,
          'Gagal mengganti bahasa aktif. Pastikan bahasa tersedia.'
        )
        showNotification(msg, true)
        return false
      } finally {
        isSwitchingRef.current = false
        setIsSwitchingLanguage(false)
      }
    },
    [
      activeLanguageId,
      isViewingInactiveTrack,
      markTourSeen,
      navigate,
      showNotification,
      switchLanguageMutation,
      user,
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

  const openGuestPrompt = useCallback((reason: GuestLoginPromptReason = 'locked_unit') => {
    triggerHaptic('tap')
    playSound('modal_open')
    setGuestPromptReason(reason)
  }, [])

  const closeGuestPrompt = useCallback(() => {
    playSound('modal_close')
    setGuestPromptReason(null)
  }, [])

  const dismissGuestBanner = useCallback(() => {
    setIsGuestBannerDismissed(true)
  }, [])

  const handleStartLesson = useCallback(
    (route: string) => {
      if (isGuest && route.startsWith('/exam/')) {
        openGuestPrompt('exam')
        return
      }
      triggerHaptic('success')
      playSound('quest_start')
      navigate(route)
    },
    [isGuest, navigate, openGuestPrompt]
  )

  const handleRefetch = useCallback(() => {
    void refetch()
  }, [refetch])

  const selectedLevelCode =
    requestedLevelCode || (curriculumData?.level?.code ?? 'N5').toUpperCase()

  const availableLevelCodes = useMemo(() => {
    const fromApi = rawCurriculumData?.available_levels?.map((lvl) => lvl.code.toUpperCase()) ?? []
    if (fromApi.length > 0) return fromApi
    const langCode = (rawCurriculumData?.language?.code ?? 'ja').toLowerCase()
    if (langCode === 'ja') return ['N5', 'N4', 'N3', 'N2', 'N1']
    return [selectedLevelCode]
  }, [rawCurriculumData?.available_levels, rawCurriculumData?.language?.code, selectedLevelCode])

  return {
    curriculum: {
      currentLanguageId: activeLanguageId,
      data: curriculumData,
      enrollments,
      isViewingInactiveTrack,
      guestPendingXp,
      selectedLevelCode,
      availableLevelCodes,
      levelAccess,
      metrics: {
        totalLessonsCount,
        completedLessonsCount,
        overallProgress,
        trackProgressMap,
      },
    },
    status: {
      isGuest,
      isPro,
      isGuestBannerDismissed,
      syncedSummary,
      isLoading,
      isFetching,
      isSwitchingLanguage,
      error,
      notification,
    },
    modals: {
      isSwitcherOpen,
      isMobileDrawerOpen,
      isTourOpen,
      guestPromptReason,
    },
    actions: {
      refetch: handleRefetch,
      handleSelectLevel,
      openSwitcher,
      closeSwitcher,
      setIsMobileDrawerOpen,
      handleSelectLanguage,
      handleActivateCurrentTrack,
      handleStartLesson,
      completeTour,
      skipTour,
      openGuestPrompt,
      closeGuestPrompt,
      dismissGuestBanner,
      dismissSyncedSummary,
    },
  }
}

