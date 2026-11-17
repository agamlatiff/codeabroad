import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CurriculumViewMode } from "@/features/curriculum/types/curriculum"
import { registerSessionResetHandler } from "@/shared/services/sessionCleanup"

interface CurriculumState {
  viewMode: CurriculumViewMode
  setViewMode: (mode: CurriculumViewMode) => void
  reset: () => void
}

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set) => ({
      viewMode: 'map',
      setViewMode: (viewMode) => set({ viewMode }),
      reset: () => set({ viewMode: 'map' }),
    }),
    {
      name: 'codeabroad_curriculum_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

registerSessionResetHandler(() => {
  useCurriculumStore.getState().reset()
})

