import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowsClockwise, SpeakerHigh, Swap } from '@phosphor-icons/react'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'
import { AudioWaveformBars } from '@/features/landing/components/LandingIllustrations'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

interface HeroFlipCard {
  id: string
  langCode: string
  langLabel: string
  speechLocale: string
  contextTag: string
  nativeText: string
  phonetic: string
  meaning: string
  example: string
}

const HERO_FLIP_CARDS: ReadonlyArray<HeroFlipCard> = [
  {
    id: 'deck-ja',
    langCode: 'ja',
    langLabel: 'Jepang • JLPT',
    speechLocale: 'ja-JP',
    contextTag: 'Sapaan Kerja',
    nativeText: 'おはようございます',
    phonetic: 'Ohayou gozaimasu',
    meaning: 'Selamat pagi (sopan di kantor)',
    example: 'Dipakai saat baru masuk kantor atau menyapa atasan di pagi hari.',
  },
  {
    id: 'deck-en',
    langCode: 'en-gb',
    langLabel: 'Inggris • IELTS',
    speechLocale: 'en-GB',
    contextTag: 'Rapat Global',
    nativeText: 'Could you repeat that, please?',
    phonetic: '/kʊd juː rɪˈpiːt ðæt pliːz/',
    meaning: 'Bisakah Anda mengulanginya?',
    example: 'Ungkapan sopan saat butuh penjelasan ulang di kelas maupun wawancara.',
  },
  {
    id: 'deck-de',
    langCode: 'de',
    langLabel: 'Jerman • Goethe',
    speechLocale: 'de-DE',
    contextTag: 'Etika Harian',
    nativeText: 'Entschuldigung',
    phonetic: '/ɛntˈʃʊldɪɡʊŋ/',
    meaning: 'Permisi / Mohon maaf',
    example: 'Entschuldigung, wo ist der Bahnhof? (Permisi, di mana stasiunnya?)',
  },
  {
    id: 'deck-fr',
    langCode: 'fr',
    langLabel: 'Prancis • DELF',
    speechLocale: 'fr-FR',
    contextTag: 'Wajib Harian',
    nativeText: 'Merci beaucoup',
    phonetic: '/mɛʁ.si bo.ku/',
    meaning: 'Terima kasih banyak',
    example: 'Ungkapan sopan standar setelah menerima bantuan di kampus atau toko.',
  },
]

/**
 * Interactive 3D Flip-Card Deck showcased in the Landing Hero ("Product-as-Hero").
 */
export const LandingHeroCardDeck = () => {
  const [cardIndex, setCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const currentCard = HERO_FLIP_CARDS[cardIndex] ?? HERO_FLIP_CARDS[0]

  useEffect(() => {
    return () => {
      audioService.stopSpeech()
    }
  }, [])

  const handleToggleFlip = () => {
    triggerHaptic('tap')
    setIsFlipped((prev) => !prev)
  }

  const handleNextCard = () => {
    triggerHaptic('tap')
    audioService.stopSpeech()
    setIsSpeaking(false)
    setIsFlipped(false)
    setCardIndex((prev) => (prev + 1) % HERO_FLIP_CARDS.length)
  }

  const handleSelectCard = (idx: number) => {
    if (idx === cardIndex) return
    triggerHaptic('tap')
    audioService.stopSpeech()
    setIsSpeaking(false)
    setIsFlipped(false)
    setCardIndex(idx)
  }

  const handleSpeak = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    triggerHaptic('tap')
    setIsSpeaking(true)
    audioService.speakLanguage(
      currentCard.nativeText,
      currentCard.speechLocale,
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    )
  }

  return (
    <div className="relative max-w-md mx-auto lg:ml-auto lg:mr-0 w-full select-none">
      {/* Stacked background paper silhouettes for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-x-5 -bottom-3 top-5 rounded-3xl bg-slate-200/70 border border-slate-300/60 rotate-2 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-3 -bottom-1.5 top-3 rounded-3xl bg-blue-100/70 border border-blue-200/80 -rotate-1 pointer-events-none"
      />

      {/* Interactive 3D Perspective Container */}
      <div className="relative" style={{ perspective: '1100px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <motion.div
              role="button"
              tabIndex={0}
              aria-label={`Kartu kosakata ${currentCard.langLabel}. Klik untuk membalik kartu.`}
              onClick={handleToggleFlip}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleToggleFlip()
                }
              }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-full min-h-[270px] cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 rounded-3xl"
            >
              {/* Front Face */}
              <div
                style={{ backfaceVisibility: 'hidden' }}
                className="absolute inset-0 bg-white border-2 border-slate-200/95 rounded-3xl p-6 shadow-[0_8px_0_0_#E2E8F0] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-8 h-5.5 rounded-md overflow-hidden border border-slate-200 shrink-0">
                      <LanguageFlagIllustration
                        code={currentCard.langCode}
                        compact
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-brand font-black text-slate-700">
                      {currentCard.langLabel}
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-brand font-bold text-[11px]">
                    {currentCard.contextTag}
                  </span>
                </div>

                <div className="py-3 text-center space-y-2">
                  <p className="text-2xl sm:text-3xl font-brand font-black text-slate-900 leading-snug">
                    {currentCard.nativeText}
                  </p>
                  <p className="text-sm font-mono font-semibold text-blue-600">
                    {currentCard.phonetic}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSpeak}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-brand font-black transition-colors cursor-pointer ${
                      isSpeaking
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700'
                    }`}
                  >
                    <SpeakerHigh weight="fill" className="w-4 h-4 text-blue-600" />
                    <span>Dengarkan</span>
                    <AudioWaveformBars isPlaying={isSpeaking} />
                  </button>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Swap weight="bold" className="w-3.5 h-3.5" />
                    <span>Ketuk untuk arti</span>
                  </span>
                </div>
              </div>

              {/* Back Face */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className="absolute inset-0 bg-blue-50/75 border-2 border-blue-300 rounded-3xl p-6 shadow-[0_8px_0_0_#BFDBFE] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-blue-200 text-blue-700 font-brand font-black text-[11px]">
                    Arti &amp; Konteks
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-700">
                    {currentCard.langLabel}
                  </span>
                </div>

                <div className="py-3 text-center space-y-2">
                  <p className="text-xl sm:text-2xl font-brand font-black text-slate-900 leading-snug">
                    {currentCard.meaning}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {currentCard.example}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-blue-200/60">
                  <span className="text-xs font-mono font-bold text-blue-700 truncate">
                    {currentCard.nativeText}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 shrink-0">
                    <Swap weight="bold" className="w-3.5 h-3.5" />
                    <span>Ketuk balik</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls: Pagination Dots & Shuffle Next Button */}
      <div className="mt-5 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Pilih kartu bahasa">
          {HERO_FLIP_CARDS.map((card, idx) => (
            <button
              key={card.id}
              type="button"
              role="tab"
              aria-selected={idx === cardIndex}
              aria-label={`Kartu ${card.langLabel}`}
              onClick={() => handleSelectCard(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === cardIndex
                  ? 'w-6 bg-blue-600'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNextCard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-brand font-black text-slate-700 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowsClockwise weight="bold" className="w-3.5 h-3.5 text-blue-600" />
          <span>Kartu Bahasa Lainnya</span>
        </button>
      </div>
    </div>
  )
}
