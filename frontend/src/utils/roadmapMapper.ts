import type {
  Module,
  SequentialCurriculumUnit,
  SequentialPartItem,
  CareerTrackOption,
} from '../types/roadmap'
import type { CareerPath } from '../types/onboarding'
import { resolveUnitTheme, resolveTrackIconType } from '../tokens/roadmapTokens'

/**
 * Pure function that transforms backend database modules into decorated
 * SequentialCurriculumUnit items ready for declarative UI rendering.
 * Zero static dummy curriculum fallback — 100% driven by database seeding.
 */
export const mapModulesToSequentialUnits = (
  modules: Module[] | undefined,
  completedQuestsSet: Set<string> = new Set()
): SequentialCurriculumUnit[] => {
  if (!modules || modules.length === 0) {
    return []
  }

  let partCounter = 1
  const rawUnits: SequentialCurriculumUnit[] = modules.map((m) => {
    const parts: SequentialPartItem[] = []
    if (m.chapters && m.chapters.length > 0) {
      m.chapters.forEach((ch) => {
        if (ch.quests && ch.quests.length > 0) {
          ch.quests.forEach((q) => {
            parts.push({
              id: q.id,
              globalPartNumber: partCounter++,
              title: q.title,
              subtitle: ch.title,
              chipLabel: q.chip_label || `S-${m.module_number}.${ch.chapter_number}`,
              category: q.type === 'boss' ? 'boss' : 'code',
              difficulty: (q.difficulty as 'Pemula' | 'Menengah' | 'Sulit') || 'Pemula',
              estimatedMinutes: q.estimated_minutes || 10,
              xpReward: q.xp_reward || 50,
              route: `/learn/${q.id}`,
              is_completed: q.status === 'completed',
            })
          })
        } else {
          parts.push({
            id: ch.id,
            globalPartNumber: partCounter++,
            title: ch.title,
            subtitle: m.title,
            chipLabel: `CH 0${ch.chapter_number}`,
            category: 'code',
            difficulty: 'Pemula',
            estimatedMinutes: 10,
            xpReward: 50,
            route: `/learn/${ch.id}`,
            is_completed: ch.is_completed,
          })
        }
      })
    }

    return {
      id: m.id,
      unitNumber: m.module_number,
      tag: `MODUL 0${m.module_number}`,
      title: `Unit ${m.module_number}: ${m.title}`,
      description: m.description || '',
      totalXp: parts.reduce((acc, p) => acc + p.xpReward, 0) || 150,
      progressRate: m.progress_rate,
      isUnlocked: m.is_unlocked,
      isCompleted: m.is_completed,
      parts,
    }
  })

  // Find the first incomplete part across all units to mark as nextActive
  const allRawParts = rawUnits.flatMap((u) => u.parts)
  const firstIncompletePart =
    allRawParts.find((p) =>
      p.is_completed !== undefined ? !p.is_completed : !completedQuestsSet.has(p.id)
    ) || allRawParts[0]

  // Pre-decorate units and parts so components do zero computation in render
  return rawUnits.map((unit) => {
    const decoratedParts: SequentialPartItem[] = unit.parts.map((part) => {
      const isCompleted =
        part.is_completed !== undefined ? part.is_completed : completedQuestsSet.has(part.id)
      const isNextActive = !isCompleted && part.id === firstIncompletePart?.id
      const isUnlocked = isCompleted || isNextActive

      return {
        ...part,
        is_completed: isCompleted,
        is_unlocked: isUnlocked,
        isNextActive,
      }
    })

    const completedCount = decoratedParts.filter((p) => p.is_completed).length
    const isUnitCompleted =
      unit.isCompleted !== undefined
        ? unit.isCompleted
        : decoratedParts.length > 0 && completedCount === decoratedParts.length
    const isUnitActive =
      unit.isUnlocked !== undefined
        ? unit.isUnlocked && !isUnitCompleted
        : !isUnitCompleted && decoratedParts.some((p) => p.isNextActive)
    const progressPercent =
      unit.progressRate !== undefined
        ? Math.round(unit.progressRate)
        : decoratedParts.length > 0
          ? Math.round((completedCount / decoratedParts.length) * 100)
          : 0

    return {
      ...unit,
      isCompleted: isUnitCompleted,
      isActive: isUnitActive,
      completedCount,
      progressPercent,
      theme: resolveUnitTheme(unit.unitNumber),
      parts: decoratedParts,
    }
  })
}

/**
 * Transforms backend CareerPath[] (and their active tech_stacks from PostgreSQL)
 * into selectable CareerTrackOption items for the Track Switcher & TopBar.
 */
/**
 * Global Universal Foundations (CS & Web Fundamental).
 * Available to every student across all career specializations.
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
 * Transforms backend CareerPath[] (and user active career stack)
 * into structured CareerTrackOption items with universal foundations and active career role.
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

  // Flatten all active career stacks from backend
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

  // If user has a selected career path/stack, find and add their specific career track
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

  // Fallback: If no user track selected yet, default to all available career tracks
  if (allCareerTracks.length > 0) {
    options.push(...allCareerTracks)
  }

  return options
}
