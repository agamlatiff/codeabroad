export interface VocabularyItem {
  id: string
  term: string
  target_text?: string
  reading: string
  meaning: string
  translation?: string
  category: string
  example_ja: string
  example_target?: string
  example_id: string
  example_translation?: string
  difficulty_level: string
}
