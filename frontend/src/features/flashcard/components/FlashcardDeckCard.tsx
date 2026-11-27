import { memo, useState } from 'react'
import {
  ArrowRight,
  BowlFood,
  Cards,
  Check,
  CircleNotch,
  Clock,
  HandWaving,
  PersonSimpleRun,
  Sparkle,
  Train,
  Translate,
} from '@phosphor-icons/react'
import { FlashcardDeckStageDecor } from '@/features/flashcard/components/FlashcardDeckStageDecor'
import type { FlashcardDeck, FlashcardSampleCard } from '@/features/flashcard/types/flashcard'

interface DeckAccentStyle {
  iconTile: string
  border: string
  stageBg: string
  frontBorder: string
  innerBorder: string
  cardTopStrip: string
  levelPill: string
  dotHex: string
}

const FAN_ARC_TRANSFORMS = [
  { rest: 'rotate-[-13deg] translate-y-3', spreadLeft: 'group-hover:rotate-[-18deg] group-hover:-translate-x-2' },
  { rest: 'rotate-[-5deg] translate-y-1', spreadLeft: 'group-hover:rotate-[-7deg] group-hover:-translate-x-1' },
  { rest: 'rotate-[3deg] translate-y-0.5', spreadLeft: 'group-hover:rotate-[5deg] group-hover:translate-x-1' },
  { rest: 'rotate-[11deg] translate-y-2.5', spreadLeft: 'group-hover:rotate-[15deg] group-hover:translate-x-2' },
] as const

function getAdaptiveTermSizeClass(text: string): string {
  const len = text.trim().length
  if (len <= 3) return 'text-lg sm:text-xl leading-none'
  if (len <= 5) return 'text-sm sm:text-[15px] leading-tight'
  if (len <= 7) return 'text-xs leading-tight'
  if (len <= 9) return 'text-[10px] leading-tight'
  return 'text-[9px] leading-tight'
}

function getThematicDeckKanji(iconName: string): string {
  switch (iconName) {
    case 'hand-waving':
      return '礼'
    case 'clock':
      return '時'
    case 'bowl-food':
      return '食'
    case 'person-simple-run':
      return '動'
    case 'train':
      return '旅'
    case 'sparkle':
      return '彩'
    case 'translate':
      return '字'
    default:
      return '語'
  }
}

const DECK_ACCENT_STYLES: Record<string, DeckAccentStyle> = {
  emerald: {
    iconTile: 'bg-gradient-to-b from-emerald-400 to-teal-600 shadow-[0_3px_0_0_#0F766E] text-white',
    border: 'hover:border-emerald-300',
    stageBg: 'bg-gradient-to-b from-emerald-50/85 via-emerald-50/35 to-white',
    frontBorder: 'border-emerald-300',
    innerBorder: 'border-emerald-100',
    cardTopStrip: 'bg-gradient-to-r from-emerald-400 to-teal-500',
    levelPill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotHex: 'rgba(16, 185, 129, 0.18)',
  },
  blue: {
    iconTile: 'bg-gradient-to-b from-sky-400 to-blue-600 shadow-[0_3px_0_0_#1D4ED8] text-white',
    border: 'hover:border-blue-300',
    stageBg: 'bg-gradient-to-b from-blue-50/85 via-sky-50/35 to-white',
    frontBorder: 'border-blue-300',
    innerBorder: 'border-blue-100',
    cardTopStrip: 'bg-gradient-to-r from-sky-400 to-blue-500',
    levelPill: 'bg-blue-50 text-blue-700 border-blue-200',
    dotHex: 'rgba(59, 130, 246, 0.18)',
  },
  amber: {
    iconTile: 'bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_3px_0_0_#B45309] text-white',
    border: 'hover:border-amber-300',
    stageBg: 'bg-gradient-to-b from-amber-50/85 via-orange-50/35 to-white',
    frontBorder: 'border-amber-300',
    innerBorder: 'border-amber-100',
    cardTopStrip: 'bg-gradient-to-r from-amber-400 to-orange-500',
    levelPill: 'bg-amber-50 text-amber-800 border-amber-200',
    dotHex: 'rgba(245, 158, 11, 0.20)',
  },
  violet: {
    iconTile: 'bg-gradient-to-b from-violet-500 to-purple-600 shadow-[0_3px_0_0_#6D28D9] text-white',
    border: 'hover:border-violet-300',
    stageBg: 'bg-gradient-to-b from-violet-50/85 via-purple-50/35 to-white',
    frontBorder: 'border-violet-300',
    innerBorder: 'border-violet-100',
    cardTopStrip: 'bg-gradient-to-r from-violet-500 to-purple-500',
    levelPill: 'bg-violet-50 text-violet-700 border-violet-200',
    dotHex: 'rgba(139, 92, 246, 0.18)',
  },
  cyan: {
    iconTile: 'bg-gradient-to-b from-cyan-400 to-sky-600 shadow-[0_3px_0_0_#0369A1] text-white',
    border: 'hover:border-cyan-300',
    stageBg: 'bg-gradient-to-b from-cyan-50/85 via-sky-50/35 to-white',
    frontBorder: 'border-cyan-300',
    innerBorder: 'border-cyan-100',
    cardTopStrip: 'bg-gradient-to-r from-cyan-400 to-sky-500',
    levelPill: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    dotHex: 'rgba(6, 182, 212, 0.18)',
  },
  rose: {
    iconTile: 'bg-gradient-to-b from-rose-400 to-pink-600 shadow-[0_3px_0_0_#BE123C] text-white',
    border: 'hover:border-rose-300',
    stageBg: 'bg-gradient-to-b from-rose-50/85 via-pink-50/35 to-white',
    frontBorder: 'border-rose-300',
    innerBorder: 'border-rose-100',
    cardTopStrip: 'bg-gradient-to-r from-rose-400 to-pink-500',
    levelPill: 'bg-rose-50 text-rose-700 border-rose-200',
    dotHex: 'rgba(244, 63, 94, 0.18)',
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

/**
 * Interactive collectible 4-card arc fan widening to the right:
 * - Supports per-card hover peek (lifts touched card to z-30 with reading & meaning)
 * - Highlights adaptive review card status (mastered check stamp, due amber dot)
 * - Adapts typography cleanly to Japanese word length with zero corner text duplication.
 */
const FannedDeckCardsPreview = ({
  cards,
  deckStyle,
  jlptLevel,
  iconName,
}: {
  cards: FlashcardSampleCard[]
  deckStyle: DeckAccentStyle
  jlptLevel: string
  iconName: string
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const fanCards = cards.slice(0, 4)
  if (fanCards.length === 0) return null
  const offset = FAN_ARC_TRANSFORMS.length - fanCards.length
  const defaultFrontIdx = fanCards.length - 1
  const thematicKanji = getThematicDeckKanji(iconName)

  return (
    <div
      className="relative z-10 flex items-end justify-center h-36 pt-3 pl-6"
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {fanCards.map((card, idx) => {
        const arc = FAN_ARC_TRANSFORMS[idx + offset]
        const isShowcased = hoveredIdx !== null ? hoveredIdx === idx : idx === defaultFrontIdx
        const isPeeking = hoveredIdx === idx
        const isMastered = card.status === 'mastered'
        const isDue = card.status === 'due'

        const positionClass = isPeeking
          ? '-translate-y-4 rotate-0 scale-105'
          : hoveredIdx !== null && idx < hoveredIdx
            ? `${arc.rest} -translate-x-1.5`
            : hoveredIdx !== null && idx > hoveredIdx
              ? `${arc.rest} translate-x-1.5`
              : `${arc.rest} ${arc.spreadLeft}`

        const cardBorderClass = isMastered
          ? 'border-emerald-300 ring-1 ring-amber-300/60 shadow-[0_4px_0_0_#A7F3D0]'
          : isShowcased
            ? `${deckStyle.frontBorder} shadow-[0_4px_0_0_#BFDBFE]`
            : 'border-slate-200/95 shadow-[0_3px_0_0_#E2E8F0]'

        return (
          <div
            key={card.id}
            onMouseEnter={() => setHoveredIdx(idx)}
            style={{ zIndex: isPeeking ? 30 : idx + 1 }}
            className={`relative -ml-7 first:ml-0 w-[92px] sm:w-[100px] h-[120px] rounded-2xl border-2 bg-white origin-bottom-left transition-all duration-300 ease-out overflow-hidden ${positionClass} ${cardBorderClass}`}
          >
            {isShowcased && (
              <div
                aria-hidden="true"
                className={`absolute top-0 inset-x-0 h-1.5 ${deckStyle.cardTopStrip}`}
              />
            )}

            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-1.5 rounded-xl border ${
                isShowcased ? `${deckStyle.innerBorder} top-2` : 'border-slate-100'
              }`}
            />

            {isMastered ? (
              <span
                aria-hidden="true"
                className="absolute top-2.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 border border-white text-white flex items-center justify-center shadow-2xs"
                title="Sudah dikuasai"
              >
                <Check weight="bold" className="w-2.5 h-2.5" />
              </span>
            ) : isDue ? (
              <span
                aria-hidden="true"
                className="absolute top-3 right-2 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-100"
                title="Siap diulas"
              />
            ) : null}

            {isShowcased ? (
              <>
                <span
                  className={`absolute top-2.5 left-2 px-1.5 py-0.5 rounded font-brand font-black text-[8px] uppercase tracking-wider border ${deckStyle.levelPill}`}
                >
                  {jlptLevel}
                </span>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-2 pt-4 text-center gap-0.5">
                  <span
                    className={`font-brand font-black text-slate-900 break-words max-w-full text-center ${getAdaptiveTermSizeClass(
                      card.front_text
                    )}`}
                  >
                    {card.front_text}
                  </span>
                  {card.reading && card.reading !== card.front_text && (
                    <span className="text-[9px] font-bold text-rose-600 truncate max-w-full">
                      {card.reading}
                    </span>
                  )}
                  <span className="text-[9px] font-bold text-blue-600 line-clamp-1 max-w-full">
                    {card.back_meaning}
                  </span>
                </div>
              </>
            ) : (
              <>
                <span className="absolute top-2 left-2 font-brand font-black text-[10px] leading-none text-slate-700 max-w-[54px] truncate">
                  {card.front_text}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center text-slate-200/75 font-brand font-black text-xl pointer-events-none select-none"
                >
                  {thematicKanji}
                </span>
                <span className="absolute bottom-2 right-2 font-brand font-black text-[10px] leading-none text-slate-300 rotate-180 max-w-[54px] truncate">
                  {card.front_text}
                </span>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

interface FlashcardDeckCardProps {
  deck: FlashcardDeck
  disabled?: boolean
  isLoading?: boolean
  onSelect: (deck: FlashcardDeck) => void
}

/** Memoized topic deck card rendered inside the infinite-scroll flashcard grid. */
export const FlashcardDeckCard = memo(function FlashcardDeckCard({
  deck,
  disabled = false,
  isLoading = false,
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

  const sampleCards = deck.sample_cards ?? []

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      onClick={() => onSelect(deck)}
      className={`group relative text-left bg-white border-2 ${
        isLoading
          ? 'border-[#2563EB] ring-2 ring-blue-100'
          : `border-slate-200/90 ${style.border}`
      } rounded-3xl p-5 shadow-[0_4px_0_0_#E2E8F0] enabled:hover:shadow-[0_7px_0_0_#CBD5E1] enabled:hover:-translate-y-1.5 enabled:hover:z-20 enabled:active:translate-y-0.5 transition-all cursor-pointer disabled:cursor-not-allowed flex flex-col justify-between gap-4 disabled:opacity-75 overflow-hidden`}
    >
      {sampleCards.length > 0 && (
        <div
          className={`relative overflow-hidden -mx-5 -mt-5 mb-0.5 px-5 pb-2 border-b border-slate-100 ${style.stageBg}`}
          style={{
            backgroundImage: `radial-gradient(${style.dotHex} 1px, transparent 1px)`,
            backgroundSize: '12px 12px',
          }}
        >
          <FlashcardDeckStageDecor
            iconName={deck.icon_name}
            accentColor={deck.accent_color}
          />
          <FannedDeckCardsPreview
            cards={sampleCards}
            deckStyle={style}
            jlptLevel={deck.jlpt_level}
            iconName={deck.icon_name}
          />
        </div>
      )}
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
            {isLoading ? (
              <>
                <CircleNotch weight="bold" className="w-3.5 h-3.5 animate-spin" />
                <span>Membuka Dek...</span>
              </>
            ) : (
              <>
                <span>{ctaLabel}</span>
                <ArrowRight weight="bold" className="w-3 h-3" />
              </>
            )}
          </span>
        </div>
      </div>
    </button>
  )
})
