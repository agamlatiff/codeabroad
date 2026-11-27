import type {
  CurriculumResponse,
  CurriculumUnitData,
  CurriculumPartNode,
  CurriculumNodeStatus,
} from "@/features/curriculum/types/curriculum"
import { resolveMapUnitPalette } from "@/features/curriculum/tokens/curriculumTokens"

/**
 * Resolves visual node status strictly from backend SSOT flags without client-side unlock overrides.
 */
const resolveLessonStatus = (
  isCompleted: boolean,
  isUnlocked: boolean,
  isCurrentLesson: boolean
): CurriculumNodeStatus => {
  if (isCompleted) return 'completed'
  if (isCurrentLesson || isUnlocked) return 'active'
  return 'locked'
}

/**
 * Pure single-pass transformer converting backend CurriculumResponse into
 * Merantalk 3D Serpentine Map Unit structures strictly respecting backend unlock status.
 */
export const transformCurriculumToMapUnits = (
  curriculum: CurriculumResponse | null | undefined,
  options?: { isGuest?: boolean }
): CurriculumUnitData[] => {
  if (!curriculum || !curriculum.units || curriculum.units.length === 0) {
    return []
  }

  const isGuest = Boolean(options?.isGuest)

  let globalLessonCounter = 1
  let hasAssignedActiveNode = false
  let hasAnyLesson = false
  let allLessonsCompleted = true
  const langCode = curriculum.language?.code?.toUpperCase() || 'LANG'
  const levelCode = curriculum.level?.code || ''

  return curriculum.units.map((unit, unitIndex): CurriculumUnitData => {
    const palette = resolveMapUnitPalette(unitIndex)
    const unitNumber = unitIndex + 1
    const lessons = unit.lessons || []

    const parts: CurriculumPartNode[] = lessons.map((lesson) => {
      hasAnyLesson = true
      if (!lesson.is_completed) {
        allLessonsCompleted = false
      }

      const lessonNum = globalLessonCounter++
      const isCurrentLesson =
        curriculum.current_lesson_id === lesson.id ||
        (!curriculum.current_lesson_id && !lesson.is_completed && lesson.is_unlocked && !hasAssignedActiveNode)
      const status = resolveLessonStatus(
        lesson.is_completed,
        lesson.is_unlocked,
        isCurrentLesson
      )
      if (status === 'active') {
        hasAssignedActiveNode = true
      }

      const subtitle = lesson.is_skipped
        ? 'Sudah dikuasai dari tes awal'
        : lesson.is_completed
          ? `Skor ${lesson.score}% • Selesai`
          : levelCode
            ? `${curriculum.language?.name || langCode} • ${levelCode}`
            : `Lesson ${lesson.order_index}`

      const cleanLessonTitle =
        lesson.title.replace(/^(?:pelajaran|lesson|node)\s*\d+\s*[:.\-–—]\s*/i, '').trim() ||
        lesson.title

      return {
        id: lesson.id,
        number: lessonNum,
        title: cleanLessonTitle,
        shortTitle: lesson.short_title?.trim() || cleanLessonTitle,
        subtitle,
        iconName: lesson.icon_name || undefined,
        totalExercises: lesson.total_exercises ?? 0,
        completedExercises: lesson.completed_exercises ?? 0,
        status,
        route:
          unit.unit_type === 'diagnostic_exam' && curriculum.level?.id
            ? `/exam/${curriculum.level.id}`
            : `/learn/${lesson.slug || lesson.id}`,
        xpReward: lesson.xp_reward || 15,
        score: lesson.score,
        isSkipped: lesson.is_skipped,
        category: 'language',
        badgeLabel: levelCode || langCode,
        isBoss: unit.unit_type === 'diagnostic_exam',
      }
    })

    const cleanTitle = unit.title.replace(/^unit\s*\d+\s*[:.\-–—]\s*/i, '').trim() || unit.title
    const isLastUnit = unitIndex === curriculum.units.length - 1
    const allLevelLessonsCompleted = isLastUnit && hasAnyLesson && allLessonsCompleted

    const bossQuest: CurriculumPartNode | undefined =
      isLastUnit && curriculum.level?.id
        ? {
            id: `exam-${curriculum.level.id}`,
            number: globalLessonCounter,
            title: `Ujian Kesiapan ${levelCode || langCode}`,
            subtitle: isGuest
              ? 'Daftar gratis untuk mengikuti ujian kesiapan dan membuka level berikutnya'
              : allLevelLessonsCompleted
                ? 'Simulasi Ujian Akhir Level • Siap Diuji'
                : 'Tantang Ujian Kesiapan kapan saja untuk langsung naik tingkat — pelajaran di atas opsional sebagai persiapan',
            status: isGuest ? 'locked' : 'active',
            route: `/exam/${curriculum.level.id}`,
            xpReward: 50,
            category: 'boss',
            badgeLabel: levelCode || langCode,
            isBoss: true,
          }
        : undefined

    return {
      id: unit.id,
      unitNumber,
      title: cleanTitle,
      description: unit.description || '',
      bannerGradient: palette.gradient,
      bannerBorder: palette.border,
      parts,
      bossQuest,
    }
  })
}

export interface CurriculumPageMetrics {
  totalLessonsCount: number
  completedLessonsCount: number
  overallProgress: number
  trackProgressMap: Record<string, { completed: number; total: number }>
}

/**
 * Computes derived curriculum metrics from backend SSOT totals and units.
 */
export const computeCurriculumPageMetrics = (
  curriculum: CurriculumResponse | null | undefined
): CurriculumPageMetrics => {
  const rawUnits = curriculum?.units ?? []

  const totalLessonsCount =
    curriculum?.total_lessons ??
    rawUnits.reduce((acc, u) => acc + (u.total_lessons > 0 ? u.total_lessons : (u.lessons?.length ?? 0)), 0)
  const completedLessonsCount =
    curriculum?.completed_lessons ??
    rawUnits.reduce(
      (acc, u) =>
        acc +
        (u.completed_lessons > 0
          ? u.completed_lessons
          : (u.lessons?.filter((l) => l.is_completed).length ?? 0)),
      0
    )

  const overallProgress =
    curriculum?.progress_percent ??
    (totalLessonsCount === 0 ? 0 : Math.round((completedLessonsCount / totalLessonsCount) * 100))

  const activeLangId = curriculum?.language?.id
  const trackProgressMap = activeLangId
    ? {
        [activeLangId]: {
          completed: completedLessonsCount,
          total: totalLessonsCount,
        },
      }
    : {}

  return {
    totalLessonsCount,
    completedLessonsCount,
    overallProgress,
    trackProgressMap,
  }
}

