import { useQuestProgress } from './useQuestProgress'
import { useRoadmapModals } from './useRoadmapModals'
import { useRoadmapData } from './useRoadmapData'

export { useQuestProgress } from './useQuestProgress'
export { useRoadmapModals } from './useRoadmapModals'
export { useRoadmapData } from './useRoadmapData'

export const useRoadmap = (explicitTrack?: string) => {
  const questProgress = useQuestProgress()
  const modals = useRoadmapModals()
  const roadmapData = useRoadmapData({
    explicitTrack,
    completedQuestsSet: questProgress.completedQuestsSet,
  })

  return {
    ...questProgress,
    ...modals,
    ...roadmapData,
  }
}

