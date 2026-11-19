export type FlashcardSampleCardStatus = 'new' | 'due' | 'mastered'

/** Compact preview card bundled with a deck (first cards by sort order) for fanned UI previews. */
export interface FlashcardSampleCard {
  id: string
  front_text: string
  reading: string
  back_meaning: string
  status?: FlashcardSampleCardStatus
}

export interface FlashcardDeck {
  id: string
  language_code: string
  title: string
  description: string
  category: string
  icon_name: string
  accent_color: string
  jlpt_level: string
  sort_order: number
  total_cards: number
  learned_cards: number
  due_cards: number
  new_cards: number
  scheduled_cards: number
  sample_cards?: FlashcardSampleCard[]
  created_at: string
}

export interface FlashcardCard {
  id: string
  deck_id: string
  front_text: string
  reading: string
  back_meaning: string
  part_of_speech: string
  sort_order: number
  ease_factor: number
  interval_days: number
  repetitions: number
  next_review_at?: string | null
  last_reviewed_at?: string | null
}

export interface FlashcardDeckDetail {
  deck: FlashcardDeck
  cards: FlashcardCard[]
}

export interface FlashcardDueQueue {
  total_due: number
  total_learned: number
  cards: FlashcardCard[]
}

export interface FlashcardReviewResponse {
  card_id: string
  ease_factor: number
  interval_days: number
  repetitions: number
  next_review_at: string
  xp_awarded: number
}
