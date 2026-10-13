import { useState } from 'react'
import {
  Translate,
  Copy,
  Check,
  SpeakerHigh,
  ArrowsClockwise,
} from '@phosphor-icons/react'
import { triggerHaptic } from '../../utils/haptics'

export interface TechNihongoCardProps {
  className?: string
}

/**
 * Curated progressive Tokyo vocabularies:
 * Level 1: Everyday Sapaan & Aisatsu Kantor (Paling Penting!)
 * Level 2: Jikoshoukai (Perkenalan Diri)
 * Level 3: Asakai (Morning Standup)
 * Level 4: Fuguai / Jissou (Bug & Feature PR)
 */
const VOCAB_PROGRESSION = [
  {
    level: 'LEVEL 1 • SAPAAN HARIAN',
    romaji: 'Aisatsu',
    kanji: '挨拶',
    kana: 'あいさつ',
    arti: 'Sapaan Pagi & Etika Kantor',
    contoh: 'Minasan, ohayou gozaimasu! Kyou mo yoroshiku onegaishimasu.',
    terjemahan: 'Selamat pagi semuanya! Mohon kerja samanya hari ini juga.',
  },
  {
    level: 'LEVEL 1 • PERKENALAN DIRI',
    romaji: 'Jikoshoukai',
    kanji: '自己紹介',
    kana: 'じこしょうかい',
    arti: 'Perkenalan Diri Developer',
    contoh: 'Hajimemashite, Indonesia kara kimashita agam to moushimasu.',
    terjemahan: 'Salam kenal, saya Agam dari Indonesia. Senang berkenalan dengan Anda.',
  },
  {
    level: 'LEVEL 2 • MORNING STANDUP',
    romaji: 'Asakai',
    kanji: '朝会',
    kana: 'あさかい',
    arti: 'Standup Harian IT',
    contoh: 'Kinou wa Gin API wo jissou shimashita. Kyou wa unit test wo kakimasu.',
    terjemahan: 'Kemarin saya implementasi Gin API. Hari ini saya tulis unit test.',
  },
  {
    level: 'LEVEL 3 • CODE REVIEW',
    romaji: 'Fuguai',
    kanji: '不具合',
    kana: 'ふぐあい',
    arti: 'Bug / Isu Teknis',
    contoh: 'Login endpoint de fuguai ga hassei shimashita node, shuusei chuu desu.',
    terjemahan: 'Terjadi bug pada endpoint login, saat ini sedang dalam perbaikan.',
  },
  {
    level: 'LEVEL 3 • IMPLEMENTASI FITUR',
    romaji: 'Jissou',
    kanji: '実装',
    kana: 'じっそう',
    arti: 'Implementasi Fitur',
    contoh: 'Kinou no PR wa mou jissou shimashita.',
    terjemahan: 'PR kemarin sudah selesai saya implementasikan.',
  },
]

export const TechNihongoCard = ({ className = '' }: TechNihongoCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const currentVocab = VOCAB_PROGRESSION[currentIndex]

  const handleNextVocab = () => {
    triggerHaptic('tap')
    setCurrentIndex((prev) => (prev + 1) % VOCAB_PROGRESSION.length)
  }

  const handleCopy = () => {
    triggerHaptic('tap')
    navigator.clipboard.writeText(
      `${currentVocab.kanji} (${currentVocab.romaji}) - ${currentVocab.arti}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSpeak = () => {
    triggerHaptic('tap')
    setIsPlayingAudio(true)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(currentVocab.kana)
      utterance.lang = 'ja-JP'
      utterance.rate = 0.85
      utterance.onend = () => setIsPlayingAudio(false)
      utterance.onerror = () => setIsPlayingAudio(false)
      window.speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => setIsPlayingAudio(false), 800)
    }
  }

  return (
    <div className={`space-y-2.5 select-none ${className}`}>
      {/* ── CARD HEADER ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <Translate weight="bold" className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <h4 className="font-brand font-black text-xs text-slate-900 leading-none">
              Bahasa Jepang Tokyo
            </h4>
            <span className="text-[9px] text-slate-400 font-medium">
              {currentVocab.level}
            </span>
          </div>
        </div>

        {/* Rotate to Next Vocab Pill */}
        <button
          type="button"
          onClick={handleNextVocab}
          className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-brand font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95"
          title="Lihat kosakata berikutnya"
        >
          <ArrowsClockwise weight="bold" className="w-2.5 h-2.5 text-slate-500" />
          <span>GANTI ({currentIndex + 1}/{VOCAB_PROGRESSION.length})</span>
        </button>
      </div>

      {/* ── VOCABULARY PILL ROW (CLEAN SEAMLESS ROW) ── */}
      <div className="flex items-center justify-between gap-2 p-2.5 bg-rose-50/50 border border-rose-200/70 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span className="font-brand font-black text-2xl text-slate-900 tracking-wider">
            {currentVocab.kanji}
          </span>
          <span className="bg-white text-rose-800 border border-rose-200 font-brand font-black text-[10px] px-2 py-0.5 rounded-lg shadow-2xs">
            {currentVocab.kana} • {currentVocab.romaji}
          </span>
          <span className="inline-flex items-center gap-1 bg-white text-blue-700 border border-blue-200 font-brand font-black text-[10px] px-2 py-0.5 rounded-md shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span>{currentVocab.arti}</span>
          </span>
        </div>

        {/* Audio Pronunciation & Copy Button */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleSpeak}
            className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:translate-y-0.5 ${
              isPlayingAudio
                ? 'bg-rose-500 border-rose-600 text-white scale-105'
                : 'bg-white border-slate-200 hover:border-rose-400 text-slate-700 hover:text-rose-600'
            }`}
            title="Dengarkan Pengucapan Asli (ja-JP)"
          >
            <SpeakerHigh
              weight="fill"
              className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`}
            />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="w-7 h-7 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 shadow-2xs active:translate-y-0.5 flex items-center justify-center transition-all cursor-pointer"
            title="Salin Kosakata"
          >
            {copied ? (
              <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600 stroke-[2]" />
            ) : (
              <Copy weight="bold" className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ── CONVERSATION DIALOGUE (NATURAL SUBTLE TYPOGRAPHY) ── */}
      <div className="text-[10px] space-y-0.5 px-0.5">
        <p className="font-brand font-bold italic text-slate-800 leading-snug">
          "{currentVocab.contoh}"
        </p>
        <p className="text-slate-500 font-medium leading-snug">
          "{currentVocab.terjemahan}"
        </p>
      </div>
    </div>
  )
}
