export interface VocabularyItem {
  id: string
  deck_id?: string
  deck_title?: string
  language_code?: string
  term: string
  target_text?: string
  kana?: string
  romaji?: string
  reading: string
  meaning: string
  translation?: string
  category: string
  quiz_choices?: string[]
  is_reviewed_today?: boolean
  example_ja: string
  example_target?: string
  example_id: string
  example_translation?: string
  difficulty_level: string
}
