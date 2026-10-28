import type { QuestSummary } from './quest'

export interface Chapter {
  id: string
  module_id: string
  chapter_number: number
  title: string
  description?: string
  is_unlocked: boolean
  is_completed: boolean
  quests?: QuestSummary[]
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  tech_stack_id: string
  module_number: number
  title: string
  description?: string
  is_unlocked: boolean
  is_completed: boolean
  progress_rate: number
  chapters?: Chapter[]
  created_at: string
  updated_at: string
}

// Backward compatibility type alias
export type Station = Module

export interface Roadmap {
  id: string
  career_path_id: string
  slug?: string
  title: string
  description?: string
  is_active: boolean
  modules?: Module[]
  stations?: Module[] // Compatibility alias
  created_at: string
  updated_at: string
}

export interface RoadmapApiResponse {
  success: boolean
  data: Roadmap
  message?: string
}
