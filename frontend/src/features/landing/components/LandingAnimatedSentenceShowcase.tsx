import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SpeakerHigh } from '@phosphor-icons/react'
import { MeraSenseiFigure } from '@/shared/components/ui/MeraShowcaseFigures'
import { AudioWaveformBars } from '@/features/landing/components/LandingIllustrations'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

type SentenceLanguageId = 'en' | 'de' | 'fr' | 'ja'
type FlagCode = 'en-gb' | 'en-us' | 'de' | 'fr' | 'zh' | 'ja'

interface SentenceBlockToken {
  id: string
  word: string
  reading: string
  role: string
  meaning: string
}

interface SentenceExamplePack {
  id: SentenceLanguageId
  flagCode: FlagCode
  label: string
  speechLocale: string
  fullSentence: string
  translation: string
  tokens: ReadonlyArray<SentenceBlockToken>
}

interface TileVisualStyle {
  surfaceClass: string
  tiltClass: string
}

const TILE_VISUAL_STYLES: ReadonlyArray<TileVisualStyle> = [
  {
    surfaceClass: 'bg-[#FF575F] shadow-[0_5px_0_0_#D93843]',
    tiltClass: '-rotate-3',
  },
  {
    surfaceClass: 'bg-[#6C6CE5] shadow-[0_5px_0_0_#4C4CC2]',
    tiltClass: 'rotate-3',
  },
  {
    surfaceClass: 'bg-[#2563EB] shadow-[0_5px_0_0_#1D4ED8]',
    tiltClass: '-rotate-2',
  },
  {
    surfaceClass: 'bg-[#10B981] shadow-[0_5px_0_0_#047857]',
    tiltClass: 'rotate-2',
  },
  {
    surfaceClass: 'bg-[#F59E0B] shadow-[0_5px_0_0_#D97706]',
    tiltClass: '-rotate-1',
  },
]

const SENTENCE_EXAMPLES: ReadonlyArray<SentenceExamplePack> = [
  {
    id: 'en',
    flagCode: 'en-gb',
    label: 'Inggris',
    speechLocale: 'en-GB',
    fullSentence: 'She has been studying abroad',
    translation: 'Dia telah belajar di luar negeri.',
    tokens: [
      {
        id: 'en-she',
        word: 'She',
        reading: '/ʃiː/',
        role: 'Subjek',
        meaning: 'Dia (kata ganti orang ketiga tunggal perempuan)',
      },
      {
        id: 'en-has-been',
        word: 'has been',
        reading: '/hæz bɪn/',
        role: 'Auxiliary',
        meaning: 'Penanda durasi yang dimulai di masa lalu dan masih berlanjut',
      },
      {
        id: 'en-studying',
        word: 'studying',
        reading: '/ˈstʌdiɪŋ/',
        role: 'Verb-ing',
        meaning: 'Sedang belajar (bentuk aktif berkelanjutan)',
      },
      {
        id: 'en-abroad',
        word: 'abroad',
        reading: '/əˈbrɔːd/',
        role: 'Keterangan',
        meaning: 'Di luar negeri (keterangan tempat)',
      },
    ],
  },
  {
    id: 'de',
    flagCode: 'de',
    label: 'Jerman',
    speechLocale: 'de-DE',
    fullSentence: 'Morgen gehe ich zur Arbeit',
    translation: 'Besok saya berangkat kerja.',
    tokens: [
      {
        id: 'de-morgen',
        word: 'Morgen',
        reading: '/ˈmɔʁɡn̩/',
        role: 'Waktu',
        meaning: 'Besok (keterangan waktu di awal kalimat)',
      },
      {
        id: 'de-gehe',
        word: 'gehe',
        reading: '/ˈɡeːə/',
        role: 'Verba #2',
        meaning: 'Pergi (kata kerja wajib di posisi kedua)',
      },
      {
        id: 'de-ich',
        word: 'ich',
        reading: '/ɪç/',
        role: 'Subjek',
        meaning: 'Saya (bergeser tepat setelah kata kerja)',
      },
      {
        id: 'de-zur',
        word: 'zur Arbeit',
        reading: '/t͡suːɐ̯ ˈaʁbaɪ̯t/',
        role: 'Tujuan',
        meaning: 'Ke tempat kerja (frasa tujuan)',
      },
    ],
  },
  {
    id: 'fr',
    flagCode: 'fr',
    label: 'Prancis',
    speechLocale: 'fr-FR',
    fullSentence: "Je voudrais un café, s'il vous plaît",
    translation: 'Saya ingin secangkir kopi, tolong.',
    tokens: [
      {
        id: 'fr-je',
        word: 'Je',
        reading: '/ʒə/',
        role: 'Subjek',
        meaning: 'Saya (kata ganti orang pertama tunggal)',
      },
      {
        id: 'fr-voudrais',
        word: 'voudrais',
        reading: '/vu.dʁɛ/',
        role: 'Sopan',
        meaning: 'Ingin (bentuk kondisional sopan saat memesan)',
      },
      {
        id: 'fr-cafe',
        word: 'un café',
        reading: '/œ̃ ka.fe/',
        role: 'Objek',
        meaning: 'Secangkir kopi (artikel maskulin dan kata benda)',
      },
      {
        id: 'fr-svp',
        word: "s'il vous plaît",
        reading: '/sil vu plɛ/',
        role: 'Ungkapan',
        meaning: 'Tolong (ungkapan kesopanan standar)',
      },
    ],
  },
  {
    id: 'ja',
    flagCode: 'ja',
    label: 'Jepang',
    speechLocale: 'ja-JP',
    fullSentence: 'わたしは本を読みます',
    translation: 'Saya membaca buku.',
    tokens: [
      {
        id: 'ja-watashi',
        word: 'わたし',
        reading: 'watashi',
        role: 'Topik',
        meaning: 'Saya (pembicara)',
      },
      {
        id: 'ja-wa',
        word: 'は',
        reading: 'wa',
        role: 'Partikel',
        meaning: 'Penanda topik kalimat (dibaca wa)',
      },
      {
        id: 'ja-hon',
        word: '本',
        reading: 'hon',
        role: 'Objek',
        meaning: 'Buku (benda yang dibaca)',
      },
      {
        id: 'ja-o',
        word: 'を',
        reading: 'o',
        role: 'Partikel',
        meaning: 'Penanda objek kata kerja',
      },
      {
        id: 'ja-yomimasu',
        word: '読みます',
        reading: 'yomimasu',
        role: 'Verba',
        meaning: 'Membaca (bentuk sopan)',
      },
    ],
  },
]

function clearPlaybackTimers(
  intervalRef: { current: number | null },
  timeoutRef: { current: number | null }
) {
  if (intervalRef.current !== null) {
    window.clearInterval(intervalRef.current)
    intervalRef.current = null
  }
  if (timeoutRef.current !== null) {
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }
}

/**
 * Open borderless ClassDojo-style interactive grammar mentor stage with Mera Sensei
 * pointing toward candy-colored tilted squircle word tiles across 4 languages.
 */
export const LandingAnimatedSentenceShowcase = () => {
  const [packId, setPackId] = useState<SentenceLanguageId>('en')
  const [selectedTokenId, setSelectedTokenId] = useState<string>(SENTENCE_EXAMPLES[0].tokens[0].id)
  const [playingTokenIdx, setPlayingTokenIdx] = useState<number | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const shouldReduceMotion = Boolean(useReducedMotion())

  const speechRequestIdRef = useRef(0)
  const spotlightIntervalRef = useRef<number | null>(null)
  const speechFallbackTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      speechRequestIdRef.current += 1
      clearPlaybackTimers(spotlightIntervalRef, speechFallbackTimeoutRef)
      audioService.stopSpeech()
    }
  }, [])

  const currentPack =
    SENTENCE_EXAMPLES.find((pack) => pack.id === packId) ?? SENTENCE_EXAMPLES[0]
  const activeToken =
    currentPack.tokens.find((token) => token.id === selectedTokenId) ?? currentPack.tokens[0]

  const handleSelectLanguage = (nextId: SentenceLanguageId) => {
    if (nextId === packId) return
    triggerHaptic('tap')
    speechRequestIdRef.current += 1
    clearPlaybackTimers(spotlightIntervalRef, speechFallbackTimeoutRef)
    audioService.stopSpeech()
    setIsSpeaking(false)
    setPlayingTokenIdx(null)
    const nextPack = SENTENCE_EXAMPLES.find((pack) => pack.id === nextId) ?? SENTENCE_EXAMPLES[0]
    setPackId(nextId)
    setSelectedTokenId(nextPack.tokens[0].id)
  }

  const handleSpeakSentence = () => {
    triggerHaptic('tap')
    clearPlaybackTimers(spotlightIntervalRef, speechFallbackTimeoutRef)

    const requestId = ++speechRequestIdRef.current
    const tokenCount = currentPack.tokens.length

    setIsSpeaking(true)
    setPlayingTokenIdx(0)

    let stepIdx = 0
    spotlightIntervalRef.current = window.setInterval(() => {
      if (speechRequestIdRef.current !== requestId) {
        clearPlaybackTimers(spotlightIntervalRef, speechFallbackTimeoutRef)
        return
      }
      stepIdx += 1
      if (stepIdx < tokenCount) {
        setPlayingTokenIdx(stepIdx)
      } else if (spotlightIntervalRef.current !== null) {
        window.clearInterval(spotlightIntervalRef.current)
        spotlightIntervalRef.current = null
      }
    }, 460)

    speechFallbackTimeoutRef.current = window.setTimeout(() => {
      if (speechRequestIdRef.current === requestId) {
        clearPlaybackTimers(spotlightIntervalRef, speechFallbackTimeoutRef)
        setIsSpeaking(false)
        setPlayingTokenIdx(null)
      }
    }, Math.max(3200, tokenCount * 650 + 1200))

    const finishSpeech = () => {
      if (speechRequestIdRef.current === requestId) {
        clearPlaybackTimers(spotlightIntervalRef, speechFallbackTimeoutRef)
        setIsSpeaking(false)
        setPlayingTokenIdx(null)
      }
    }

    audioService.speakLanguage(
      currentPack.fullSentence,
      currentPack.speechLocale,
      finishSpeech,
      finishSpeech
    )
  }

  return (
    <div className="relative w-full min-w-0 max-w-full flex flex-col gap-4 py-1">
      {/* Top Compact Floating Language Switcher */}
      <div className="flex justify-center sm:justify-end">
        <div
          role="group"
          aria-label="Pilih bahasa contoh pola kalimat"
          className="inline-flex flex-wrap items-center justify-center gap-1 max-w-full rounded-2xl sm:rounded-full bg-white/95 border-2 border-[#E2E8F0] p-1 shadow-[0_6px_14px_-4px_rgba(15,23,42,0.08),0_3px_0_0_#E2E8F0]"
        >
          {SENTENCE_EXAMPLES.map((pack) => {
            const isActive = pack.id === packId
            return (
              <motion.button
                key={pack.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleSelectLanguage(pack.id)}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-[13px] font-brand font-black transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-[0_2px_0_0_#1D4ED8]'
                    : 'text-[#475569] hover:text-[#1E293B] hover:bg-slate-100/80'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="w-4 h-3 sm:w-4.5 sm:h-3.5 shrink-0 inline-flex items-center justify-center overflow-hidden rounded-[2px]"
                >
                  <LanguageFlagIllustration
                    code={pack.flagCode}
                    compact
                    className="w-full h-full rounded-[2px] shrink-0"
                  />
                </span>
                <span>{pack.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Main Open ClassDojo Stage */}
      <div className="grid grid-cols-1 sm:grid-cols-12 items-end gap-4 sm:gap-5">
        {/* Left Hero Mera Sensei Grounded on Open Pastel Blob */}
        <div className="min-w-0 sm:col-span-5 flex items-end justify-center sm:justify-start relative">
          <div className="relative z-10 w-full max-w-[150px] sm:max-w-[196px] mx-auto sm:mx-0">
            <MeraSenseiFigure
              mood={isSpeaking ? 'listening' : 'pointing'}
              size={196}
              className="w-full h-auto [&_svg]:w-full [&_svg]:h-auto"
            />
          </div>
        </div>

        {/* Right Candy-Colored Tilted Squircle Tile Constellation */}
        <div className="min-w-0 sm:col-span-7 flex items-center justify-center sm:justify-start pb-1">
          <div
            key={currentPack.id}
            className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3.5"
          >
            {currentPack.tokens.map((token, idx) => {
              const tileStyle = TILE_VISUAL_STYLES[idx % TILE_VISUAL_STYLES.length]
              const isSelected = token.id === activeToken.id
              const isSpotlighted =
                playingTokenIdx !== null ? playingTokenIdx === idx : isSelected

              return (
                <div key={token.id} className={tileStyle.tiltClass}>
                  <motion.button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap')
                      setSelectedTokenId(token.id)
                    }}
                    aria-pressed={isSelected}
                    aria-label={`${token.word} (${token.role}): ${token.meaning}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.94 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isSpotlighted && !shouldReduceMotion ? 1.04 : 1,
                    }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            delay: idx * 0.045,
                            type: 'spring',
                            stiffness: 360,
                            damping: 22,
                          }
                    }
                    whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.05 }}
                    whileTap={shouldReduceMotion ? undefined : { y: 2, scale: 0.96 }}
                    className={`rounded-[20px] sm:rounded-[22px] ${tileStyle.surfaceClass} min-w-[84px] sm:min-w-[112px] min-h-[70px] sm:min-h-[84px] px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col items-center justify-center gap-1 sm:gap-1.5 text-center text-white cursor-pointer transition-shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/35 ${
                      isSpotlighted
                        ? 'ring-4 ring-white shadow-lg drop-shadow-[0_10px_14px_rgba(15,23,42,0.16)]'
                        : 'hover:brightness-[1.04]'
                    }`}
                  >
                    <span className="block font-brand font-black text-sm sm:text-[17px] leading-tight tracking-tight [text-shadow:0_1px_1px_rgba(0,0,0,0.16)]">
                      {token.word}
                    </span>
                    <span className="inline-block rounded-full bg-black/15 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono font-bold text-white/95 leading-none">
                      {token.role}
                    </span>
                  </motion.button>
                </div>
              )
            })}

            {/* Cyan Audio Squircle Tile */}
            <div className="rotate-2">
              <motion.button
                type="button"
                onClick={handleSpeakSentence}
                aria-pressed={isSpeaking}
                aria-label={`Dengarkan kalimat bahasa ${currentPack.label}: ${currentPack.fullSentence}`}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isSpeaking && !shouldReduceMotion ? 1.04 : 1,
                }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        delay: currentPack.tokens.length * 0.045,
                        type: 'spring',
                        stiffness: 360,
                        damping: 22,
                      }
                }
                whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.05 }}
                whileTap={shouldReduceMotion ? undefined : { y: 2, scale: 0.96 }}
                className={`rounded-[20px] sm:rounded-[22px] bg-[#00A8FF] shadow-[0_5px_0_0_#0284C7] min-w-[84px] sm:min-w-[112px] min-h-[70px] sm:min-h-[84px] px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col items-center justify-center gap-1 sm:gap-1.5 text-white cursor-pointer transition-shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/35 ${
                  isSpeaking
                    ? 'ring-4 ring-white shadow-lg drop-shadow-[0_10px_14px_rgba(2,132,199,0.28)]'
                    : 'hover:brightness-[1.04]'
                }`}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2 sm:px-2.5 py-1 shadow-2xs">
                  <SpeakerHigh
                    weight="fill"
                    className="w-3.5 h-3.5 text-[#0284C7] shrink-0"
                    aria-hidden="true"
                  />
                  <AudioWaveformBars isPlaying={isSpeaking} />
                </span>
                <span className="font-brand font-black text-xs sm:text-sm leading-none tracking-wide [text-shadow:0_1px_1px_rgba(0,0,0,0.16)]">
                  Dengar
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Explanation Callout Pill */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPack.id}-${activeToken.id}`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            className="w-full rounded-[20px] bg-white border-2 border-[#E2E8F0] shadow-[0_8px_18px_-4px_rgba(15,23,42,0.08),0_3px_0_0_#E2E8F0] px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs sm:text-[13px] font-bold text-[#1E293B]">
                <span className="font-brand font-black text-sm sm:text-[15px] text-[#0F172A]">
                  {activeToken.word}
                </span>
                <span className="font-mono font-semibold text-[#2563EB]">
                  ({activeToken.reading})
                </span>
                <span aria-hidden="true" className="text-slate-300">
                  &middot;
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-brand font-black text-[#475569]">
                  {activeToken.role}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#475569] mt-1 leading-snug">
                {activeToken.meaning}
              </p>
            </div>

            <p className="text-xs font-medium text-[#64748B] sm:text-right sm:border-l sm:border-slate-200/80 sm:pl-4 sm:max-w-[230px] shrink-0 leading-snug">
              Arti: &ldquo;
              <span className="font-bold text-[#1E293B]">{currentPack.translation}</span>
              &rdquo;
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
