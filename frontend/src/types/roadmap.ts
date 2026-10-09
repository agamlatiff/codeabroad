import type { QuestSummary } from './quest'

export interface Chapter {
  id: string
  station_id: string
  chapter_number: number
  title: string
  description?: string
  order_index: number
  is_unlocked: boolean
  is_completed: boolean
  quests?: QuestSummary[]
  created_at: string
  updated_at: string
}

export interface Station {
  id: string
  roadmap_id: string
  station_number: number
  title: string
  chip_label: string
  description?: string
  order_index: number
  is_unlocked: boolean
  is_completed: boolean
  progress_rate: number
  chapters?: Chapter[]
  created_at: string
  updated_at: string
}

export interface Roadmap {
  id: string
  career_path_id: string
  title: string
  description?: string
  is_active: boolean
  stations?: Station[]
  created_at: string
  updated_at: string
}

export interface RoadmapApiResponse {
  success: boolean
  data: Roadmap
  message?: string
}
