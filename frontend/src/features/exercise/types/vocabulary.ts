export interface VocabularyItem {
  id: string
  career_path_id?: string
  term: string
  reading: string
  meaning: string
  category: string
  example_ja: string
  example_id: string
  difficulty_level: string
  order_index?: number
  created_at?: string
  updated_at?: string
}
