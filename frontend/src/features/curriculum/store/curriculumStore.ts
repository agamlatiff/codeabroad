import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CurriculumViewMode } from "@/features/curriculum/types/curriculum"

interface CurriculumState {
  viewMode: CurriculumViewMode
  setViewMode: (mode: CurriculumViewMode) => void
}

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set) => ({
      viewMode: 'map',
      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: 'codeabroad_curriculum_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

