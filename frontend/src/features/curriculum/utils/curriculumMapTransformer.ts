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
 * Duolingo 3D Serpentine Map Unit structures strictly respecting backend unlock status.
 */
export const transformCurriculumToMapUnits = (
  curriculum: CurriculumResponse | null | undefined
): CurriculumUnitData[] => {
  if (!curriculum || !curriculum.units || curriculum.units.length === 0) {
    return []
  }

  let globalLessonCounter = 1
  let hasAssignedActiveNode = false
  const langCode = curriculum.language?.code?.toUpperCase() || 'LANG'
  const levelCode = curriculum.level?.code || ''

  return curriculum.units.map((unit, unitIndex): CurriculumUnitData => {
    const palette = resolveMapUnitPalette(unitIndex)
    const unitNumber = unitIndex + 1
    const lessons = unit.lessons || []

    const parts: CurriculumPartNode[] = lessons.map((lesson) => {
      const lessonNum = globalLessonCounter++
      const isCurrentLesson =
        curriculum.current_lesson_id === lesson.id ||
        (!curriculum.current_lesson_id && !lesson.is_completed && lesson.is_unlocked && !hasAssignedActiveNode)
      const canBeActive = !hasAssignedActiveNode && (isCurrentLesson || (!lesson.is_completed && lesson.is_unlocked && !curriculum.current_lesson_id))
      const status = resolveLessonStatus(
        lesson.is_completed,
        lesson.is_unlocked && (canBeActive || !curriculum.current_lesson_id),
        isCurrentLesson
      )
      if (status === 'active') {
        hasAssignedActiveNode = true
      }

      const subtitle = lesson.is_skipped
        ? 'Dilewati otomatis via placement'
        : lesson.is_completed
          ? `Skor ${lesson.score}% • Selesai`
          : levelCode
            ? `${curriculum.language?.name || langCode} • ${levelCode}`
            : `Lesson ${lesson.order_index}`

      const cleanLessonTitle =
        lesson.title.replace(/^(?:pelajaran|lesson)\s*\d+\s*[:.\-–—]\s*/i, '').trim() ||
        lesson.title

      return {
        id: lesson.id,
        number: lessonNum,
        title: cleanLessonTitle,
        subtitle,
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
    const allLevelLessonsCompleted =
      curriculum.units.every((u) => (u.lessons ?? []).every((l) => l.is_completed)) &&
      curriculum.units.some((u) => (u.lessons?.length ?? 0) > 0)

    const bossQuest: CurriculumPartNode | undefined =
      isLastUnit && curriculum.level?.id
        ? {
            id: `exam-${curriculum.level.id}`,
            number: globalLessonCounter,
            title: `Ujian Evaluasi Kesiapan ${levelCode || langCode}`,
            subtitle: allLevelLessonsCompleted
              ? 'Simulasi Ujian Akhir Level • Siap Diuji'
              : 'Selesaikan seluruh pelajaran level ini untuk membuka ujian akhir',
            status: allLevelLessonsCompleted ? 'active' : 'locked',
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

