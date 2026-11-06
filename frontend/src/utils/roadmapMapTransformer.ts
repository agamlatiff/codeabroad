import type { Roadmap, Module, CurriculumUnitData, CurriculumPartNode } from '../types/roadmap'
import { resolveMapUnitPalette, MAP_MILESTONE_REWARDS } from '../tokens/roadmapTokens'
import { TRACK_CURRICULA } from '../data/roadmapMapFallback'

/**
 * Builds an aggregated lookup Set of completed quest IDs from backend and local storage.
 */
export const resolveCompletedQuestSet = (
  roadmap?: Roadmap | null,
  localCompletedIds: string[] = []
): Set<string> => {
  const set = new Set<string>()

  if (roadmap?.modules) {
    for (const mod of roadmap.modules) {
      if (!mod.chapters) continue
      for (const ch of mod.chapters) {
        if (!ch.quests) continue
        for (const q of ch.quests) {
          if (q.status === 'completed') {
            set.add(q.id)
            if (q.chip_label) set.add(q.chip_label)
          }
        }
      }
    }
  }

  for (const id of localCompletedIds) {
    set.add(id)
  }

  return set
}

/**
 * Pure single-pass transformer converting backend Roadmap data into
 * Duolingo 3D Serpentine Map Unit structures without redundant multi-pass scans.
 */
export const transformRoadmapToMapUnits = (
  roadmap: Roadmap,
  completedSet: Set<string>
): CurriculumUnitData[] => {
  if (!roadmap.modules || roadmap.modules.length === 0) {
    return []
  }

  let globalPartCounter = 1
  let hasFoundActiveQuest = false

  return roadmap.modules.map((st: Module, stIdx: number): CurriculumUnitData => {
    const palette = resolveMapUnitPalette(stIdx)
    const stationQuests: CurriculumPartNode[] = []
    let unitBossQuest: CurriculumPartNode | undefined = undefined

    let allQuestsCompleted = true
    let hasActiveInUnit = false

    if (st.chapters && st.chapters.length > 0) {
      for (const ch of st.chapters) {
        if (ch.quests && ch.quests.length > 0) {
          for (const q of ch.quests) {
            const isQuestCompleted = q.status === 'completed' || completedSet.has(q.id)

            let questStatus: 'completed' | 'active' | 'locked'
            if (isQuestCompleted) {
              questStatus = 'completed'
            } else if (!hasFoundActiveQuest) {
              questStatus = 'active'
              hasFoundActiveQuest = true
              hasActiveInUnit = true
              allQuestsCompleted = false
            } else {
              questStatus = 'locked'
              allQuestsCompleted = false
            }

            // Route boss/capstone exams to the unit Trophy Milestone
            if (q.type === 'boss') {
              unitBossQuest = {
                id: q.id,
                number: 0,
                title: q.title,
                subtitle: q.chip_label ? `${q.chip_label} • ${q.difficulty}` : (q.difficulty || 'Tantangan Praktik'),
                status: questStatus,
                route: `/learn/${q.id}`,
                xpReward: q.xp_reward || 250,
                gemsReward: q.gems_reward || 30,
                isBoss: true,
              }
              continue
            }

            stationQuests.push({
              id: q.id,
              number: globalPartCounter++,
              title: q.title,
              subtitle: q.chip_label ? `${q.chip_label} • ${q.difficulty}` : q.difficulty,
              status: questStatus,
              route: `/learn/${q.id}`,
              xpReward: q.xp_reward || MAP_MILESTONE_REWARDS.defaultQuestXp,
              gemsReward: q.gems_reward,
              category:
                (q.type as string) === 'nihongo' || (q.type as string) === 'language'
                  ? 'language'
                  : 'code',
              badgeLabel: (q.type as string) === 'nihongo' ? 'NIHONGO' : undefined,
            })
          }
        } else {
          // Chapter-level fallback node when no individual quests exist
          let chapterStatus: 'completed' | 'active' | 'locked'
          if (ch.is_completed) {
            chapterStatus = 'completed'
          } else if (!hasFoundActiveQuest) {
            chapterStatus = 'active'
            hasFoundActiveQuest = true
            hasActiveInUnit = true
            allQuestsCompleted = false
          } else {
            chapterStatus = 'locked'
            allQuestsCompleted = false
          }

          stationQuests.push({
            id: ch.id,
            number: globalPartCounter++,
            title: ch.title,
            subtitle: ch.description || 'Modul Pembelajaran',
            status: chapterStatus,
            route: `/learn/${ch.id}`,
            xpReward: MAP_MILESTONE_REWARDS.defaultQuestXp,
            category: 'code',
          })
        }
      }
    }

    if (stationQuests.length === 0) {
      let stStatus: 'completed' | 'active' | 'locked'
      if (st.is_completed) {
        stStatus = 'completed'
      } else if (!hasFoundActiveQuest) {
        stStatus = 'active'
        hasFoundActiveQuest = true
        hasActiveInUnit = true
        allQuestsCompleted = false
      } else {
        stStatus = 'locked'
        allQuestsCompleted = false
      }

      stationQuests.push({
        id: st.id,
        number: globalPartCounter++,
        title: st.title,
        subtitle: st.description || 'Pondasi Modul',
        status: stStatus,
        route: `/courses`,
        xpReward: MAP_MILESTONE_REWARDS.defaultQuestXp,
        category: 'code',
      })
    }

    // O(1) status resolution derived directly from linear loop flags
    const isStationCompleted =
      st.is_completed || (stationQuests.length > 0 && allQuestsCompleted)
    const isStationActive = !isStationCompleted && hasActiveInUnit

    return {
      id: st.id,
      unitNumber: st.module_number || stIdx + 1,
      tag: `UNIT ${st.module_number || stIdx + 1}`,
      title: st.title,
      description: st.description || '',
      statusBadge: isStationCompleted
        ? 'SELESAI (100%)'
        : isStationActive
        ? 'SEDANG BERJALAN'
        : 'TERKUNCI',
      badgeType: isStationCompleted
        ? 'completed'
        : isStationActive
        ? 'active'
        : 'locked',
      bannerGradient: palette.gradient,
      bannerBorder: palette.border,
      parts: stationQuests,
      bossQuest: unitBossQuest,
    }
  })
}

/**
 * Pure single-pass transformer for static fallback curricula when offline or awaiting backend.
 */
export const transformFallbackToMapUnits = (
  trackSlug: string,
  completedSet: Set<string>,
  currentPart?: number
): CurriculumUnitData[] => {
  const fallbackConfig = TRACK_CURRICULA[trackSlug] || TRACK_CURRICULA['golang']
  let hasFoundActiveFallback = false

  return fallbackConfig.units.map((u): CurriculumUnitData => {
    let allPartsCompleted = true
    let hasActivePart = false

    const parts = u.parts.map((p): CurriculumPartNode => {
      const isCompleted =
        completedSet.has(p.id) ||
        completedSet.has(`part-${p.number}`) ||
        (typeof currentPart === 'number' && p.number < currentPart)

      let partStatus: 'completed' | 'active' | 'locked'
      if (isCompleted) {
        partStatus = 'completed'
      } else if (!hasFoundActiveFallback) {
        partStatus = 'active'
        hasFoundActiveFallback = true
        hasActivePart = true
        allPartsCompleted = false
      } else {
        partStatus = 'locked'
        allPartsCompleted = false
      }

      return {
        ...p,
        route: `/learn/${p.id}`,
        status: partStatus,
      }
    })

    // O(1) status resolution without calling parts.every() or parts.some()
    const isCompleted = parts.length > 0 && allPartsCompleted
    const isActive = !isCompleted && hasActivePart

    return {
      ...u,
      parts,
      statusBadge: isCompleted
        ? 'SELESAI (100%)'
        : isActive
        ? 'SEDANG BERJALAN'
        : 'TERKUNCI',
      badgeType: isCompleted
        ? ('completed' as const)
        : isActive
        ? ('active' as const)
        : ('locked' as const),
    }
  })
}
