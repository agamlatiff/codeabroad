import type { FlashcardCard } from '@/features/flashcard/types/flashcard'

export interface AnkiIntervalPreviews {
  again: string
  hard: string
  good: string
  easy: string
}

/** Formats day intervals into concise Indonesian Anki labels. */
export function formatAnkiIntervalDays(days: number): string {
  if (days >= 365) {
    const years = days / 365
    const rounded = Number.isInteger(years) ? String(years) : years.toFixed(1).replace(/\.0$/, '')
    return `${rounded} thn`
  }
  if (days >= 30) {
    const months = Math.max(1, Math.round(days / 30))
    return `${months} bln`
  }
  return `${Math.max(1, days)} hr`
}

/**
 * Mirrors backend `CalculateSM2` (Anki-modified SM-2) to display live next-interval
 * previews on the 4 self-rating buttons before the user submits a card review.
 */
export function previewAnkiIntervals(card: FlashcardCard): AnkiIntervalPreviews {
  const prevReps = card.repetitions ?? 0
  const prevInterval = card.interval_days ?? 0
  const prevEase = (card.ease_factor ?? 0) < 1.3 ? 2.5 : card.ease_factor

  const hard =
    prevReps === 0
      ? '10 mnt'
      : formatAnkiIntervalDays(Math.max(1, Math.round(Math.max(1, prevInterval) * 1.2)))

  const nextGoodReps = prevReps + 1
  const goodDays =
    nextGoodReps === 1
      ? 1
      : nextGoodReps === 2
        ? 3
        : Math.max(4, Math.round(prevInterval * prevEase))

  const easyDays =
    prevReps === 0 ? 4 : Math.max(4, Math.round(prevInterval * prevEase * 1.3))

  return {
    again: '1 mnt',
    hard,
    good: formatAnkiIntervalDays(goodDays),
    easy: formatAnkiIntervalDays(easyDays),
  }
}

/** Local fallback state when a card rated Again (1) fails network sync mid-session. */
export function resetCardForAnkiRequeue(card: FlashcardCard): FlashcardCard {
  const prevEase = (card.ease_factor ?? 0) < 1.3 ? 2.5 : card.ease_factor
  const nextEase = Math.max(1.3, Math.round((prevEase - 0.2) * 100) / 100)
  return {
    ...card,
    repetitions: 0,
    interval_days: 1,
    ease_factor: nextEase,
  }
}
