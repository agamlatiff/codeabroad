import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SpeakerHigh, Translate } from '@phosphor-icons/react'
import { AudioWaveformBars } from '@/features/landing/components/LandingIllustrations'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

interface SentenceBlockToken {
  id: string
  word: string
  reading: string
  role: string
  meaning: string
  colorClass: string
}

interface SentenceExamplePack {
  id: 'ja' | 'de'
  label: string
  speechLocale: string
  fullSentence: string
  translation: string
  tokens: ReadonlyArray<SentenceBlockToken>
}

const SENTENCE_EXAMPLES: ReadonlyArray<SentenceExamplePack> = [
  {
    id: 'ja',
    label: 'Jepang',
    speechLocale: 'ja-JP',
    fullSentence: 'わたしは本を読みます',
    translation: 'Saya membaca buku setiap pagi.',
    tokens: [
      {
        id: 'ja-watashi',
        word: 'わたし',
        reading: 'watashi',
        role: 'Topik',
        meaning: 'Saya (pembicara)',
        colorClass: 'bg-sky-50 border-sky-300 text-sky-900',
      },
      {
        id: 'ja-wa',
        word: 'は',
        reading: 'wa',
        role: 'Partikel',
        meaning: 'Penanda topik kalimat',
        colorClass: 'bg-amber-50 border-amber-300 text-amber-900',
      },
      {
        id: 'ja-hon',
        word: '本',
        reading: 'hon',
        role: 'Objek',
        meaning: 'Buku (benda yang dibaca)',
        colorClass: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      },
      {
        id: 'ja-o',
        word: 'を',
        reading: 'o',
        role: 'Partikel',
        meaning: 'Penanda objek kata kerja',
        colorClass: 'bg-amber-50 border-amber-300 text-amber-900',
      },
      {
        id: 'ja-yomimasu',
        word: '読みます',
        reading: 'yomimasu',
        role: 'Kata Kerja',
        meaning: 'Membaca (bentuk sopan)',
        colorClass: 'bg-indigo-50 border-indigo-300 text-indigo-900',
      },
    ],
  },
  {
    id: 'de',
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
        meaning: 'Besok (keterangan waktu)',
        colorClass: 'bg-sky-50 border-sky-300 text-sky-900',
      },
      {
        id: 'de-gehe',
        word: 'gehe',
        reading: '/ˈɡeːə/',
        role: 'Kata Kerja (Posisi-2)',
        meaning: 'Pergi (selalu di posisi kedua)',
        colorClass: 'bg-indigo-50 border-indigo-300 text-indigo-900',
      },
      {
        id: 'de-ich',
        word: 'ich',
        reading: '/ɪç/',
        role: 'Subjek',
        meaning: 'Saya (bergeser setelah kata kerja)',
        colorClass: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      },
      {
        id: 'de-zur',
        word: 'zur Arbeit',
        reading: '/t͡suːɐ̯ ˈaʁbaɪ̯t/',
        role: 'Tujuan',
        meaning: 'Ke tempat kerja',
        colorClass: 'bg-amber-50 border-amber-300 text-amber-900',
      },
    ],
  },
]

/**
 * Animated interactive color-coded sentence breakdown for the Landing feature showcase.
 */
export const LandingAnimatedSentenceShowcase = () => {
  const [packId, setPackId] = useState<'ja' | 'de'>('ja')
  const [selectedTokenId, setSelectedTokenId] = useState<string>(SENTENCE_EXAMPLES[0].tokens[0].id)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechRequestIdRef = useRef(0)

  useEffect(() => {
    return () => {
      speechRequestIdRef.current += 1
      audioService.stopSpeech()
    }
  }, [])

  const currentPack =
    SENTENCE_EXAMPLES.find((pack) => pack.id === packId) ?? SENTENCE_EXAMPLES[0]
  const activeToken =
    currentPack.tokens.find((t) => t.id === selectedTokenId) ?? currentPack.tokens[0]

  const handleSelectLanguage = (nextId: 'ja' | 'de') => {
    if (nextId === packId) return
    triggerHaptic('tap')
    speechRequestIdRef.current += 1
    audioService.stopSpeech()
    setIsSpeaking(false)
    const nextPack = SENTENCE_EXAMPLES.find((pack) => pack.id === nextId) ?? SENTENCE_EXAMPLES[0]
    setPackId(nextId)
    setSelectedTokenId(nextPack.tokens[0].id)
  }

  const handleSpeakSentence = () => {
    triggerHaptic('tap')
    const requestId = ++speechRequestIdRef.current
    setIsSpeaking(true)
    audioService.speakLanguage(
      currentPack.fullSentence,
      currentPack.speechLocale,
      () => {
        if (speechRequestIdRef.current === requestId) {
          setIsSpeaking(false)
        }
      },
      () => {
        if (speechRequestIdRef.current === requestId) {
          setIsSpeaking(false)
        }
      }
    )
  }

  return (
    <div className="rounded-[26px] bg-white border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] overflow-hidden">
      {/* Top Studio Header Band */}
      <div className="bg-[#F0FDF4]/85 border-b border-emerald-100 px-5 py-3.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-[#10B981] text-white shadow-[0_3px_0_0_#047857] flex items-center justify-center shrink-0">
            <Translate weight="fill" className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-brand font-black uppercase tracking-wider text-emerald-700">
              Tata Bahasa Visual
            </p>
            <p className="text-xs sm:text-sm font-bold text-[#1E293B]">
              Klik kata untuk lihat fungsinya
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSpeakSentence}
            aria-pressed={isSpeaking}
            aria-label={`Dengarkan kalimat bahasa ${currentPack.label}: ${currentPack.fullSentence}`}
            className={`inline-flex items-center gap-2 h-[34px] rounded-xl border px-3 text-xs font-brand font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35 ${
              isSpeaking
                ? 'bg-blue-50 border-[#2563EB] text-[#1D4ED8]'
                : 'bg-white hover:bg-blue-50/70 border-emerald-200/80 hover:border-[#93C5FD] text-[#1E293B]'
            }`}
          >
            <SpeakerHigh
              weight="fill"
              className="w-4 h-4 text-[#2563EB] shrink-0"
              aria-hidden="true"
            />
            <AudioWaveformBars isPlaying={isSpeaking} />
            <span>Dengar</span>
          </button>

          <div className="inline-flex rounded-xl bg-white border border-emerald-200/80 p-0.5 shadow-2xs">
            {SENTENCE_EXAMPLES.map((pack) => (
              <button
                key={pack.id}
                type="button"
                aria-pressed={packId === pack.id}
                onClick={() => handleSelectLanguage(pack.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-brand font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35 ${
                  packId === pack.id
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pack.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Sentence Body */}
      <div className="p-5 sm:p-6 space-y-4 bg-white">
        {/* Animated Word Blocks */}
        <div className="flex flex-wrap items-center gap-2">
          {currentPack.tokens.map((token, idx) => {
            const isSelected = token.id === activeToken.id
            return (
              <motion.button
                key={token.id}
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setSelectedTokenId(token.id)
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.25 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-2xl border-2 px-3 py-2 text-left transition-shadow cursor-pointer ${
                  token.colorClass
                } ${isSelected ? 'ring-2 ring-blue-500/35 shadow-sm' : 'opacity-85 hover:opacity-100'}`}
              >
                <span className="block font-brand font-black text-sm leading-tight">
                  {token.word}
                </span>
                <span className="block text-[10px] font-mono opacity-80 mt-0.5">
                  {token.role}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Interactive Token Explanation Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeToken.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl bg-[#FAFAF9] border border-slate-200/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div>
              <p className="text-xs font-bold text-slate-900">
                {activeToken.word}{' '}
                <span className="font-mono font-normal text-blue-600">({activeToken.reading})</span>{' '}
                — {activeToken.role}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">{activeToken.meaning}</p>
            </div>
            <span className="text-[11px] font-medium text-slate-400 shrink-0">
              Arti: &ldquo;{currentPack.translation}&rdquo;
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
