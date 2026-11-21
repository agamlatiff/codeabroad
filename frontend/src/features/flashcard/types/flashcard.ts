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
  slug?: string
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

/** Converts a deck title into a clean lowercase URL slug (matching backend SlugifyDeckTitle). */
export function slugifyFlashcardDeckTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Resolves the canonical URL slug for a flashcard deck. */
export function getFlashcardDeckSlug(
  deck: Pick<FlashcardDeck, 'id' | 'title' | 'slug'>
): string {
  const explicit = deck.slug?.trim()
  if (explicit) return explicit
  return slugifyFlashcardDeckTitle(deck.title) || deck.id
}

/** Matches a `?deck=` query value against a deck's slug, slugified title, UUID, or category. */
export function matchesFlashcardDeckParam(deck: FlashcardDeck, rawParam: string): boolean {
  const normalized = rawParam.trim().toLowerCase()
  if (!normalized) return false
  return (
    deck.id.toLowerCase() === normalized ||
    (deck.slug?.trim().toLowerCase() ?? '') === normalized ||
    slugifyFlashcardDeckTitle(deck.title) === normalized ||
    deck.category.toLowerCase() === normalized
  )
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
