import type {
  CurriculumResponse,
  CurriculumUnitData,
  CurriculumPartNode,
  CurriculumNodeStatus,
  SequentialCurriculumUnit,
} from "@/features/curriculum/types/curriculum"
import { resolveMapUnitPalette } from "@/features/curriculum/tokens/curriculumTokens"
import { mapCurriculumUnitsToSequentialUnits } from './curriculumMapper'

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
  const langCode = curriculum.language?.code?.toUpperCase() || 'LANG'
  const levelCode = curriculum.level?.code || ''

  return curriculum.units.map((unit, unitIndex): CurriculumUnitData => {
    const palette = resolveMapUnitPalette(unitIndex)
    const unitNumber = unit.order_index || unitIndex + 1
    const lessons = unit.lessons || []

    const parts: CurriculumPartNode[] = lessons.map((lesson) => {
      const lessonNum = globalLessonCounter++
      const isCurrentLesson = curriculum.current_lesson_id === lesson.id
      const status = resolveLessonStatus(
        lesson.is_completed,
        lesson.is_unlocked,
        isCurrentLesson
      )

      const subtitle = lesson.is_skipped
        ? 'Dilewati otomatis via placement'
        : lesson.is_completed
          ? `Skor ${lesson.score}% • Selesai`
          : levelCode
            ? `${curriculum.language?.name || langCode} • ${levelCode}`
            : `Lesson ${lesson.order_index}`

      return {
        id: lesson.id,
        number: lessonNum,
        title: lesson.title,
        subtitle,
        status,
        route: `/learn/${lesson.id}`,
        xpReward: lesson.xp_reward || 15,
        score: lesson.score,
        isSkipped: lesson.is_skipped,
        category: 'language',
        badgeLabel: levelCode || langCode,
        isBoss: unit.unit_type === 'diagnostic_exam',
      }
    })

    const totalLessons = unit.total_lessons > 0 ? unit.total_lessons : parts.length
    const completedLessons =
      unit.completed_lessons > 0
        ? unit.completed_lessons
        : parts.filter((p) => p.status === 'completed').length

    const isUnitCompleted = totalLessons > 0 && completedLessons >= totalLessons
    const isUnitActive = Boolean(unit.is_unlocked && !isUnitCompleted)

    return {
      id: unit.id,
      unitNumber,
      tag: `UNIT ${unitNumber}`,
      title: unit.title,
      description: unit.description || '',
      statusBadge: isUnitCompleted
        ? 'SELESAI (100%)'
        : isUnitActive
          ? 'SEDANG BERJALAN'
          : 'TERKUNCI',
      badgeType: isUnitCompleted
        ? 'completed'
        : isUnitActive
          ? 'active'
          : 'locked',
      bannerGradient: palette.gradient,
      bannerBorder: palette.border,
      parts,
    }
  })
}

export interface CurriculumPageMetrics {
  units: SequentialCurriculumUnit[]
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
  const units = mapCurriculumUnitsToSequentialUnits(curriculum)

  const totalLessonsCount = curriculum?.total_lessons ?? units.reduce((acc, u) => acc + u.parts.length, 0)
  const completedLessonsCount =
    curriculum?.completed_lessons ??
    units.reduce((acc, u) => acc + (u.completedCount ?? 0), 0)

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
    units,
    totalLessonsCount,
    completedLessonsCount,
    overallProgress,
    trackProgressMap,
  }
}
