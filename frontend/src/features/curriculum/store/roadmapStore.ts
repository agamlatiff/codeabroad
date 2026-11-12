import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CurriculumViewMode = 'map' | 'syllabus'

interface RoadmapState {
  viewMode: CurriculumViewMode
  completedQuestIds: string[]

  // Actions
  setViewMode: (mode: CurriculumViewMode) => void
  markQuestCompleted: (questId: string) => void
  setCompletedQuestIds: (ids: string[]) => void
}

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set) => ({
      viewMode: 'syllabus',
      completedQuestIds: [],

      setViewMode: (viewMode) => set({ viewMode }),

      markQuestCompleted: (questId) =>
        set((state) => {
          if (state.completedQuestIds.includes(questId)) return state
          return { completedQuestIds: [...state.completedQuestIds, questId] }
        }),

      setCompletedQuestIds: (completedQuestIds) => set({ completedQuestIds }),
    }),
    {
      name: 'codeabroad_roadmap_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

