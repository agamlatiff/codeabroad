import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { KanaScriptType } from '@/features/curriculum/types/curriculum'
import type { LessonIntroItem } from '@/features/exercise/constants/lessonIntroCards'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'
import { Lightbulb, SpeakerHigh, Translate, X } from '@phosphor-icons/react'

const SLOW_SPEECH_RATE = 0.58

interface LessonStudyCardsDrawerProps {
  isOpen: boolean
  items: LessonIntroItem[]
  kanaLinkScript?: KanaScriptType
  onClose: () => void
}

/**
 * Slide-over study-card reference drawer allowing learners to peek at characters,
 * mnemonics, and 2-speed pronunciation mid-exercise without losing their question position.
 */
export const LessonStudyCardsDrawer = ({
  isOpen,
  items,
  kanaLinkScript,
  onClose,
}: LessonStudyCardsDrawerProps) => {
  const [playingKey, setPlayingKey] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      audioService.stopSpeech()
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        audioService.stopSpeech()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      audioService.stopSpeech()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handlePlay = (key: string, text: string, rate?: number) => {
    triggerHaptic('tap')
    audioService.stopSpeech()
    setPlayingKey(key)
    const clear = () => setPlayingKey((prev) => (prev === key ? null : prev))
    if (typeof rate === 'number') {
      audioService.speakLanguage(text, 'ja-JP', clear, clear, rate)
    } else {
      audioService.speakJapanese(text, clear, clear)
    }
  }

  return (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          audioService.stopSpeech()
          onClose()
        }
      }}
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Kartu Materi Pelajaran"
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l-2 border-slate-200 flex flex-col">
        <header className="px-5 py-4 border-b-2 border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <Translate weight="bold" className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-brand font-extrabold text-slate-900 truncate">
                Intip Kartu Materi
              </h2>
              <p className="text-xs text-slate-500 font-medium truncate">
                Dengarkan ulang &amp; lihat jembatan keledai
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              audioService.stopSpeech()
              onClose()
            }}
            aria-label="Tutup kartu materi"
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500 font-medium">
              Tidak ada daftar kartu materi tambahan untuk sesi ini.
            </p>
          ) : (
            items.map((item, idx) => {
              const normalKey = `drawer-normal-${idx}`
              const slowKey = `drawer-slow-${idx}`
              return (
                <article
                  key={`${item.symbol}-${idx}`}
                  className="p-4 rounded-2xl bg-slate-50/90 border-2 border-slate-200/90 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <span className="text-2xl font-black text-slate-900 block leading-tight break-words">
                        {item.symbol}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-brand font-black text-blue-700">
                        {item.reading}
                      </span>
                      <p className="text-xs font-bold text-slate-700">{item.meaning}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handlePlay(normalKey, item.speakText)}
                        aria-label={`Putar suara ${item.symbol}`}
                        className={`min-h-[36px] px-2.5 rounded-xl border-2 text-[11px] font-brand font-black inline-flex items-center gap-1 transition-colors cursor-pointer ${
                          playingKey === normalKey
                            ? 'bg-blue-600 border-blue-700 text-white'
                            : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        <SpeakerHigh weight="fill" className="w-3.5 h-3.5" />
                        Putar
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handlePlay(slowKey, item.speakText, SLOW_SPEECH_RATE)
                        }
                        aria-label={`Putar pelan ${item.symbol}`}
                        className={`min-h-[36px] px-2 rounded-xl border-2 text-[11px] font-brand font-black transition-colors cursor-pointer ${
                          playingKey === slowKey
                            ? 'bg-blue-600 border-blue-700 text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                        }`}
                      >
                        0.6x
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-amber-50/85 border border-amber-200/80 px-3 py-2 flex items-start gap-2">
                    <Lightbulb
                      weight="fill"
                      className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"
                    />
                    <p className="text-[11px] font-medium text-amber-950 leading-relaxed">
                      {item.mnemonic}
                    </p>
                  </div>
                </article>
              )
            })
          )}
        </div>

        {kanaLinkScript && (
          <footer className="px-5 py-3.5 border-t-2 border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-slate-500">
              Ingin lihat tabel lengkap?
            </span>
            <Link
              to={`/kana/${kanaLinkScript}`}
              className="text-xs font-brand font-black text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Buka Tabel{' '}
              {kanaLinkScript === 'katakana'
                ? 'Katakana'
                : kanaLinkScript === 'kanji'
                  ? 'Kanji'
                  : 'Hiragana'}{' '}
              →
            </Link>
          </footer>
        )}
      </div>
    </div>
  )
}
