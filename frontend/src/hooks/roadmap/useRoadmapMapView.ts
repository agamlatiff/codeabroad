import { useState, useMemo, useEffect, useCallback } from 'react'
import { triggerHaptic } from '../../utils/haptics'
import type { Roadmap, Module, Chapter } from '../../types/roadmap'
import type { QuestSummary } from '../../types/quest'
import { resolveMapUnitPalette, MAP_MILESTONE_REWARDS } from '../../tokens/roadmapTokens'
import {
  TRACK_CURRICULA,
  type CurriculumPartNode,
  type CurriculumUnitData,
  type PathMapNode,
} from '../../data/roadmapMapFallback'

export interface UseRoadmapMapViewProps {
  trackSlug?: string
  roadmap?: Roadmap | null
  currentPart?: number
}

/**
 * Headless controller hook for the 3D Serpentine Map View.
 * Handles real-time quest completion events, derives sequential curriculum units,
 * and manages interactive node detail modal state.
 */
export const useRoadmapMapView = ({
  trackSlug = 'golang',
  roadmap = null,
  currentPart,
}: UseRoadmapMapViewProps) => {
  const [activeModalNode, setActiveModalNode] = useState<PathMapNode | null>(null)
  const [questCompletionTick, setQuestCompletionTick] = useState(0)

  // Listen for real-time quest completions across the application
  useEffect(() => {
    const handler = () => setQuestCompletionTick((prev) => prev + 1)
    window.addEventListener('codeabroad_quest_completed', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('codeabroad_quest_completed', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  // Aggregated set of all completed quest IDs from backend and local storage
  const completedSet = useMemo(() => {
    const set = new Set<string>()
    // 1. From backend roadmap quests
    if (roadmap?.modules) {
      roadmap.modules.forEach((st: Module) => {
        (st.chapters || []).forEach((ch: Chapter) => {
          (ch.quests || []).forEach((q: QuestSummary) => {
            if (q.status === 'completed') {
              set.add(q.id)
              if (q.chip_label) set.add(q.chip_label)
            }
          })
        })
      })
    }
    // 2. From localStorage
    void questCompletionTick // trigger re-evaluation when storage tick updates
    try {
      const stored = JSON.parse(localStorage.getItem('codeabroad_completed_quests') || '[]')
      if (Array.isArray(stored)) {
        stored.forEach((id: string) => set.add(id))
      }
    } catch {
      /* ignore invalid storage format */
    }
    return set
  }, [roadmap, questCompletionTick])

  // Derive units from backend roadmap if available, with graceful fallback to TRACK_CURRICULA
  const units: CurriculumUnitData[] = useMemo(() => {
    if (roadmap?.modules && roadmap.modules.length > 0) {
      let globalPartCounter = 1
      let hasFoundActiveQuest = false

      return roadmap.modules.map((st: Module, stIdx: number) => {
        const palette = resolveMapUnitPalette(stIdx)
        const stationQuests: CurriculumPartNode[] = []
        let unitBossQuest: CurriculumPartNode | undefined = undefined

        if (st.chapters && st.chapters.length > 0) {
          st.chapters.forEach((ch: Chapter) => {
            if (ch.quests && ch.quests.length > 0) {
              ch.quests.forEach((q: QuestSummary) => {
                const isQuestCompleted = q.status === 'completed' || completedSet.has(q.id)
                let questStatus: 'completed' | 'active' | 'locked'
                if (isQuestCompleted) {
                  questStatus = 'completed'
                } else if (!hasFoundActiveQuest) {
                  questStatus = 'active'
                  hasFoundActiveQuest = true
                } else {
                  questStatus = 'locked'
                }

                // If quest is a boss/capstone exam, route it to the unit Trophy Milestone directly
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
                  return
                }

                const partNum = globalPartCounter++
                stationQuests.push({
                  id: q.id,
                  number: partNum,
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
              })
            } else {
              const partNum = globalPartCounter++
              let chapterStatus: 'completed' | 'active' | 'locked'
              if (ch.is_completed) {
                chapterStatus = 'completed'
              } else if (!hasFoundActiveQuest) {
                chapterStatus = 'active'
                hasFoundActiveQuest = true
              } else {
                chapterStatus = 'locked'
              }

              stationQuests.push({
                id: ch.id,
                number: partNum,
                title: ch.title,
                subtitle: ch.description || 'Modul Pembelajaran',
                status: chapterStatus,
                route: `/learn/${ch.id}`,
                xpReward: MAP_MILESTONE_REWARDS.defaultQuestXp,
                category: 'code',
              })
            }
          })
        }

        if (stationQuests.length === 0) {
          let stStatus: 'completed' | 'active' | 'locked'
          if (st.is_completed) {
            stStatus = 'completed'
          } else if (!hasFoundActiveQuest) {
            stStatus = 'active'
            hasFoundActiveQuest = true
          } else {
            stStatus = 'locked'
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

        const isStationCompleted =
          st.is_completed || stationQuests.every((p) => p.status === 'completed')
        const isStationActive =
          !isStationCompleted && stationQuests.some((p) => p.status === 'active')

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

    // Fallback to local structured curriculum with dynamic completion checking
    const fallbackConfig = TRACK_CURRICULA[trackSlug] || TRACK_CURRICULA['golang']
    let hasFoundActiveFallback = false

    return fallbackConfig.units.map((u) => {
      const parts = u.parts.map((p) => {
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
        } else {
          partStatus = 'locked'
        }

        return {
          ...p,
          route: `/learn/${p.id}`,
          status: partStatus,
        }
      })

      const isCompleted = parts.length > 0 && parts.every((p) => p.status === 'completed')
      const isActive = !isCompleted && parts.some((p) => p.status === 'active')

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
  }, [roadmap, trackSlug, currentPart, completedSet])

  const handleNodeClick = useCallback((node: PathMapNode) => {
    triggerHaptic('tap')
    setActiveModalNode(node)
  }, [])

  const handleCloseModal = useCallback(() => {
    setActiveModalNode(null)
  }, [])

  return {
    units,
    activeModalNode,
    setActiveModalNode,
    handleNodeClick,
    handleCloseModal,
  }
}

