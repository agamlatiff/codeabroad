import type {
  CurriculumResponse,
  Language,
  SequentialCurriculumUnit,
  SequentialPartItem,
  CareerTrackOption,
  UserLanguageEnrollment,
} from "@/features/curriculum/types/curriculum"
import type { CareerPath } from "@/features/onboarding/types/onboarding"
import { resolveUnitTheme, resolveTrackIconType } from "@/features/curriculum/tokens/curriculumTokens"

/**
 * Pure mapper transforming backend CurriculumResponse units and lessons into
 * SequentialCurriculumUnit view models strictly driven by backend unlock and completion flags.
 */
export const mapCurriculumUnitsToSequentialUnits = (
  curriculum: CurriculumResponse | null | undefined
): SequentialCurriculumUnit[] => {
  if (!curriculum || !curriculum.units || curriculum.units.length === 0) {
    return []
  }

  let lessonCounter = 1
  const languageCode = curriculum.language?.code?.toUpperCase() || 'LANG'
  const levelCode = curriculum.level?.code || ''

  return curriculum.units.map((unit, unitIndex): SequentialCurriculumUnit => {
    const unitNumber = unit.order_index || unitIndex + 1
    const lessons = unit.lessons || []

    const parts: SequentialPartItem[] = lessons.map((lesson) => {
      const partNumber = lessonCounter++
      const isCurrentActive = Boolean(
        lesson.is_unlocked &&
          !lesson.is_completed &&
          curriculum.current_lesson_id === lesson.id
      )

      return {
        id: lesson.id,
        globalPartNumber: partNumber,
        title: lesson.title,
        subtitle: lesson.is_skipped
          ? `Dilewati otomatis via placement • ${levelCode || languageCode}`
          : lesson.is_completed
            ? `Selesai dengan skor ${lesson.score}%`
            : levelCode
              ? `${curriculum.language?.name || languageCode} • ${levelCode}`
              : unit.title,
        chipLabel: `${languageCode} ${String(unitNumber).padStart(2, '0')}.${String(lesson.order_index || partNumber).padStart(2, '0')}`,
        category: unit.unit_type === 'diagnostic_exam' ? 'boss' : 'language',
        difficulty:
          curriculum.level?.tier === 'advanced'
            ? 'Sulit'
            : curriculum.level?.tier === 'intermediate'
              ? 'Menengah'
              : 'Pemula',
        estimatedMinutes: 10,
        xpReward: lesson.xp_reward || 15,
        route:
          unit.unit_type === 'diagnostic_exam' && curriculum.level?.id
            ? `/exam/${curriculum.level.id}`
            : `/learn/${lesson.id}`,
        score: lesson.score,
        is_skipped: lesson.is_skipped,
        is_completed: lesson.is_completed,
        is_unlocked: lesson.is_unlocked,
        isNextActive: isCurrentActive,
      }
    })

    const totalCount = unit.total_lessons > 0 ? unit.total_lessons : parts.length
    const completedCount =
      unit.completed_lessons > 0
        ? unit.completed_lessons
        : parts.filter((p) => p.is_completed).length

    const isCompleted = totalCount > 0 && completedCount >= totalCount
    const isActive = Boolean(unit.is_unlocked && !isCompleted)
    const progressPercent =
      totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0

    return {
      id: unit.id,
      unitNumber,
      tag: `UNIT ${String(unitNumber).padStart(2, '0')}`,
      title: unit.title,
      description: unit.description || '',
      unitType: unit.unit_type,
      totalXp: parts.reduce((acc, p) => acc + p.xpReward, 0),
      progressRate: progressPercent,
      isUnlocked: unit.is_unlocked,
      isCompleted,
      isActive,
      progressPercent,
      completedCount,
      theme: resolveUnitTheme(unitNumber),
      parts,
    }
  })
}

/**
 * Maps user language enrollments and catalog languages into selectable track options
 * for AppTopBar and the Language Switcher Modal.
 */
export const mapEnrollmentsToTrackOptions = (
  enrollments: UserLanguageEnrollment[],
  catalogLanguages: Language[] = []
): CareerTrackOption[] => {
  const enrolledByLangId = new Map<string, UserLanguageEnrollment>()
  for (const enrollment of enrollments) {
    enrolledByLangId.set(enrollment.language_id, enrollment)
  }

  const options: CareerTrackOption[] = []

  for (const enrollment of enrollments) {
    const lang = enrollment.language
    const langCode = lang?.code || 'lang'
    const langName = lang?.name || 'Bahasa Asing'
    const levelLabel = enrollment.current_level
      ? `${enrollment.current_level.code}${enrollment.current_level.official_exam_name ? ` (${enrollment.current_level.official_exam_name})` : ''}`
      : 'Level Dasar'

    options.push({
      id: enrollment.language_id,
      slug: enrollment.language_id,
      title: `${langName} • ${enrollment.current_level?.code || 'Kurikulum'}`,
      shortTitle: `${langName} ${enrollment.current_level?.code || ''}`.trim(),
      subtitle: `Level aktif: ${levelLabel}`,
      category: 'language',
      iconType: resolveTrackIconType(langCode),
      badgeLabel: enrollment.is_active ? 'Aktif' : 'Terdaftar',
      badgeVariant: enrollment.is_active ? 'active' : 'available',
      isActive: enrollment.is_active,
      isEnrolled: true,
      group: 'career',
    })
  }

  // Append catalog languages not yet enrolled as preview items (only if active in DB)
  for (const lang of catalogLanguages) {
    if (enrolledByLangId.has(lang.id) || !lang.is_active) continue
    options.push({
      id: lang.id,
      slug: lang.id,
      title: lang.name,
      shortTitle: lang.name,
      subtitle: `Kurikulum Bahasa ${lang.name}`,
      category: 'language',
      iconType: resolveTrackIconType(lang.code),
      badgeLabel: 'Belum Terdaftar',
      badgeVariant: 'available',
      isActive: false,
      isEnrolled: false,
      group: 'foundation',
    })
  }

  return options
}

/**
 * Universal foundation tracks retained for legacy settings compatibility.
 */
export const UNIVERSAL_FOUNDATION_TRACKS: CareerTrackOption[] = [
  {
    id: 'foundation-cs-fundamental',
    slug: 'cs_fundamental',
    title: 'Computer Science & Algorithm',
    shortTitle: 'CS Fundamental',
    subtitle: 'Fondasi struktur data, algoritma, Big-O, pointers, dan sistem operasi.',
    category: 'coding',
    iconType: 'fundamental',
    badgeLabel: 'Fondasi Utama',
    badgeVariant: 'featured',
    isActive: true,
    group: 'foundation',
  },
  {
    id: 'foundation-web-fundamental',
    slug: 'web_fundamental',
    title: 'Web Fundamental (HTML/CSS/JS)',
    shortTitle: 'Web Fundamental',
    subtitle: 'Fondasi web modern, semantic HTML, modern CSS, a11y, dan JavaScript DOM.',
    category: 'coding',
    iconType: 'frontend',
    badgeLabel: 'Fondasi Web',
    badgeVariant: 'available',
    isActive: true,
    group: 'foundation',
  },
]

/**
 * Legacy helper retained for non-curriculum callers (useSettingsModal) until user/onboarding migration.
 */
export const mapCareerPathsToTrackOptions = (
  careerPaths: CareerPath[],
  activeUser?: {
    primary_stack?: string | null
    career_path_id?: string | null
    career_path?: { id: string; slug: string; label: string } | null
  } | null
): CareerTrackOption[] => {
  const options: CareerTrackOption[] = [...UNIVERSAL_FOUNDATION_TRACKS]

  const allCareerTracks: CareerTrackOption[] = []
  for (const path of careerPaths) {
    const activeStacks = (path.stacks || []).filter((s) => s.is_active)
    for (const stack of activeStacks) {
      allCareerTracks.push({
        id: `${path.id}-${stack.slug}`,
        slug: stack.slug,
        title: `${path.label} (${stack.label})`,
        shortTitle: stack.label,
        subtitle: path.description || stack.label,
        category: 'coding',
        iconType: resolveTrackIconType(stack.slug),
        badgeLabel: stack.badge || 'Tersedia',
        badgeVariant: stack.badge === 'Recommended' ? 'active' : 'available',
        isActive: stack.is_active,
        group: 'career',
      })
    }
  }

  if (activeUser?.primary_stack || activeUser?.career_path_id || activeUser?.career_path?.slug) {
    const matchedTrack =
      allCareerTracks.find(
        (t) =>
          t.slug === activeUser.primary_stack ||
          (activeUser.career_path && t.id.startsWith(activeUser.career_path.id)) ||
          (activeUser.career_path_id && t.id.startsWith(activeUser.career_path_id))
      ) ||
      allCareerTracks.find((t) => t.slug === activeUser.career_path?.slug)

    if (matchedTrack) {
      options.push({
        ...matchedTrack,
        badgeLabel: 'Karier Aktif',
        badgeVariant: 'active',
        group: 'career',
      })
      return options
    }
  }

  if (allCareerTracks.length > 0) {
    options.push(...allCareerTracks)
  }

  return options
}

