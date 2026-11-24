import { memo } from 'react'
import {
  ArrowRight,
  BowlFood,
  Cards,
  Clock,
  HandWaving,
  PersonSimpleRun,
  Sparkle,
  Train,
  Translate,
} from '@phosphor-icons/react'
import type { FlashcardDeck } from '@/features/flashcard/types/flashcard'

interface DeckAccentStyle {
  iconTile: string
  border: string
}

const DECK_ACCENT_STYLES: Record<string, DeckAccentStyle> = {
  emerald: {
    iconTile: 'bg-gradient-to-b from-emerald-400 to-teal-600 shadow-[0_3px_0_0_#0F766E] text-white',
    border: 'hover:border-emerald-300',
  },
  blue: {
    iconTile: 'bg-gradient-to-b from-sky-400 to-blue-600 shadow-[0_3px_0_0_#1D4ED8] text-white',
    border: 'hover:border-blue-300',
  },
  amber: {
    iconTile: 'bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_3px_0_0_#B45309] text-white',
    border: 'hover:border-amber-300',
  },
  violet: {
    iconTile: 'bg-gradient-to-b from-violet-500 to-purple-600 shadow-[0_3px_0_0_#6D28D9] text-white',
    border: 'hover:border-violet-300',
  },
  cyan: {
    iconTile: 'bg-gradient-to-b from-cyan-400 to-sky-600 shadow-[0_3px_0_0_#0369A1] text-white',
    border: 'hover:border-cyan-300',
  },
  rose: {
    iconTile: 'bg-gradient-to-b from-rose-400 to-pink-600 shadow-[0_3px_0_0_#BE123C] text-white',
    border: 'hover:border-rose-300',
  },
}

function renderDeckIcon(iconName: string) {
  switch (iconName) {
    case 'hand-waving':
      return <HandWaving weight="fill" className="w-6 h-6" />
    case 'clock':
      return <Clock weight="fill" className="w-6 h-6" />
    case 'bowl-food':
      return <BowlFood weight="fill" className="w-6 h-6" />
    case 'person-simple-run':
      return <PersonSimpleRun weight="fill" className="w-6 h-6" />
    case 'train':
      return <Train weight="fill" className="w-6 h-6" />
    case 'sparkle':
      return <Sparkle weight="fill" className="w-6 h-6" />
    case 'translate':
      return <Translate weight="fill" className="w-6 h-6" />
    default:
      return <Cards weight="fill" className="w-6 h-6" />
  }
}

interface FlashcardDeckCardProps {
  deck: FlashcardDeck
  disabled?: boolean
  onSelect: (deck: FlashcardDeck) => void
}

/** Memoized topic deck card rendered inside the infinite-scroll flashcard grid. */
export const FlashcardDeckCard = memo(function FlashcardDeckCard({
  deck,
  disabled = false,
  onSelect,
}: FlashcardDeckCardProps) {
  const style = DECK_ACCENT_STYLES[deck.accent_color] ?? DECK_ACCENT_STYLES.blue
  const totalCards = Math.max(1, deck.total_cards || 1)
  const newCards = deck.new_cards ?? 0
  const dueCards = deck.due_cards ?? 0
  const scheduledCards = deck.scheduled_cards ?? 0
  const masteredPercent = Math.round((scheduledCards / totalCards) * 100)
  const duePercent = Math.round((dueCards / totalCards) * 100)

  const ctaLabel =
    dueCards > 0
      ? `Ulas ${dueCards} Kartu`
      : newCards > 0
        ? 'Mulai Belajar'
        : 'Latihan Ulang'

  const sampleCards = (deck.sample_cards ?? []).slice(0, 3)

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(deck)}
      className={`group relative text-left bg-white border-2 border-slate-200/90 ${style.border} rounded-3xl p-5 shadow-[0_4px_0_0_#E2E8F0] hover:shadow-[0_7px_0_0_#CBD5E1] hover:-translate-y-1 active:translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 disabled:opacity-60`}
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${style.iconTile}`}
          >
            {renderDeckIcon(deck.icon_name)}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-brand font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {deck.jlpt_level} • {deck.total_cards} Kartu
              </span>
              {dueCards > 0 && (
                <span className="text-[10px] font-brand font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Perlu Ulas
                </span>
              )}
            </div>
            <h3 className="font-brand font-black text-base text-slate-900 group-hover:text-blue-600 transition-colors">
              {deck.title}
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {deck.description}
            </p>
          </div>
        </div>

        {sampleCards.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {sampleCards.map((card) => (
              <span
                key={card.id}
                className="inline-flex items-center gap-1.5 max-w-full rounded-xl border border-slate-200/80 bg-slate-50/90 px-2.5 py-1 text-[11px] leading-tight"
              >
                <span className="font-brand font-black text-slate-800 truncate max-w-[110px]">
                  {card.front_text}
                </span>
                {card.back_meaning && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">
                      •
                    </span>
                    <span className="font-medium text-slate-500 truncate max-w-[110px]">
                      {card.back_meaning}
                    </span>
                  </>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <div
          aria-hidden="true"
          className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden flex"
        >
          {masteredPercent > 0 && (
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${masteredPercent}%` }}
            />
          )}
          {duePercent > 0 && (
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${duePercent}%` }}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-1.5 text-[10px] font-brand font-extrabold">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/70">
              Baru {newCards}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/70">
              Ulas {dueCards}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              Ingat {scheduledCards}
            </span>
          </div>

          <span className="text-[11px] font-brand font-black text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 shrink-0">
            {ctaLabel} <ArrowRight weight="bold" className="w-3 h-3" />
          </span>
        </div>
      </div>
    </button>
  )
})
