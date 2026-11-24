import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
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
  translation: string
  tokens: ReadonlyArray<SentenceBlockToken>
}

const SENTENCE_EXAMPLES: ReadonlyArray<SentenceExamplePack> = [
  {
    id: 'ja',
    label: 'Jepang',
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

  const currentPack =
    SENTENCE_EXAMPLES.find((pack) => pack.id === packId) ?? SENTENCE_EXAMPLES[0]
  const activeToken =
    currentPack.tokens.find((t) => t.id === selectedTokenId) ?? currentPack.tokens[0]

  const handleSelectLanguage = (nextId: 'ja' | 'de') => {
    if (nextId === packId) return
    triggerHaptic('tap')
    const nextPack = SENTENCE_EXAMPLES.find((pack) => pack.id === nextId) ?? SENTENCE_EXAMPLES[0]
    setPackId(nextId)
    setSelectedTokenId(nextPack.tokens[0].id)
  }

  return (
    <div className="bg-[#FAFAF9] border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] font-brand font-black uppercase tracking-wider text-slate-500">
          Klik kata untuk lihat fungsinya
        </span>
        <div className="inline-flex rounded-xl bg-white border border-slate-200 p-0.5">
          {SENTENCE_EXAMPLES.map((pack) => (
            <button
              key={pack.id}
              type="button"
              onClick={() => handleSelectLanguage(pack.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-brand font-bold transition-colors cursor-pointer ${
                packId === pack.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {pack.label}
            </button>
          ))}
        </div>
      </div>

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
          className="rounded-2xl bg-white border border-slate-200/90 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
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
  )
}
