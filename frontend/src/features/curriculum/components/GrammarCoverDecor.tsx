import type { FC } from 'react'

export interface GrammarCoverDecorProps {
  category: string
}

interface CoverWatermarkConfig {
  kanji: string
  colorClass: string
}

const COVER_WATERMARKS: Record<string, CoverWatermarkConfig> = {
  particle: { kanji: 'は', colorClass: 'text-amber-700' },
  sentence_pattern: { kanji: '文', colorClass: 'text-blue-700' },
  conjugation: { kanji: '変', colorClass: 'text-emerald-700' },
  tense: { kanji: '時', colorClass: 'text-rose-700' },
  honorific: { kanji: '敬', colorClass: 'text-violet-700' },
}

/**
 * Low-opacity Japanese editorial watermark & geometric vector motif tailored to each grammar category.
 */
export const GrammarCoverDecor: FC<GrammarCoverDecorProps> = ({ category }) => {
  const theme = COVER_WATERMARKS[category] ?? COVER_WATERMARKS.sentence_pattern

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${theme.colorClass}`}
    >
      {/* Large Faint Japanese Calligraphic Watermark Behind Kodi */}
      <span className="absolute -right-2 -bottom-6 font-brand font-black text-[96px] leading-none opacity-[0.075]">
        {theme.kanji}
      </span>

      {/* Category-Specific Geometric Vector Accents */}
      {category === 'particle' ? (
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full opacity-[0.14]">
          <path d="M10 16V10H16M108 64V70H102" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="88" cy="18" r="7" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="96" cy="18" r="7" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      ) : category === 'conjugation' ? (
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full opacity-[0.14]">
          <path
            d="M80 18C90 12 102 16 105 26M105 26L108 20M105 26L99 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="86" y="48" width="14" height="14" rx="4" transform="rotate(14 86 48)" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      ) : category === 'tense' ? (
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full opacity-[0.14]">
          <circle cx="96" cy="20" r="10" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 3" />
          <path d="M96 15V20L100 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 68H54" stroke="currentColor" strokeWidth="1.8" strokeDasharray="4 4" strokeLinecap="round" />
        </svg>
      ) : category === 'honorific' ? (
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full opacity-[0.14]">
          <circle cx="84" cy="18" r="3" fill="currentColor" />
          <circle cx="91" cy="15" r="2.8" fill="currentColor" />
          <circle cx="95" cy="21" r="2.8" fill="currentColor" />
          <circle cx="88" cy="24" r="2.8" fill="currentColor" />
          <path d="M12 68C16 54 28 48 42 48L36 68H12Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      ) : (
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full opacity-[0.14]">
          <rect x="78" y="12" width="16" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <rect x="98" y="12" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M14 68H48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  )
}
