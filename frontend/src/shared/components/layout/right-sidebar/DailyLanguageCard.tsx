import type { FC } from 'react'
import { Link } from 'react-router-dom'
import {
  Copy,
  Check,
  SpeakerHigh,
  SpeakerLow,
  CaretLeft,
  CaretRight,
  CheckCircle,
  ArrowRight,
  Lightning,
  Sparkle,
  BookOpen,
} from '@phosphor-icons/react'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'
import { useDailyLanguageCard } from '@/shared/hooks/layout/right-sidebar/useDailyLanguageCard'
import { slugifyFlashcardDeckTitle } from '@/features/flashcard/types/flashcard'

export interface DailyLanguageCardProps {
  className?: string
}

/**
 * DailyLanguageCard (SSOT)
 * Interactive daily vocabulary mini-widget in AppRightSidebar:
 * - Official SVG country flag badge matching the active enrolled language.
 * - Toggle between `Belajar` (study card + kana/romaji + meaning) and `Tebak` (0 XP 3-choice quick practice).
 * - Two-speed pronunciation TTS (`Normal` and `0.6x`) plus deep-link to the source flashcard deck.
 */
export const DailyLanguageCard: FC<DailyLanguageCardProps> = ({
  className = '',
}) => {
  const {
    languageMeta,
    isLoading,
    currentVocab,
    activeStepNumber,
    totalVocabsCount,
    reviewedTodayCount,
    cardMode,
    copied,
    playingSpeed,
    selectedQuizChoice,
    handleSetCardMode,
    handlePrevVocab,
    handleNextVocab,
    handleCopy,
    handleSpeak,
    handleSelectQuizChoice,
    handleRetryQuizChoice,
  } = useDailyLanguageCard()

  if (isLoading) {
    return (
      <div id="daily-language-card" className={`space-y-2.5 select-none scroll-mt-20 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 rounded-lg bg-slate-200 animate-pulse" />
            <div className="space-y-1">
              <div className="w-28 h-3 bg-slate-200 rounded animate-pulse" />
              <div className="w-16 h-2 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-16 h-5 bg-slate-100 rounded-full animate-pulse" />
        </div>
        <div className="h-32 bg-rose-50/40 border-2 border-rose-100 rounded-2xl animate-pulse" />
      </div>
    )
  }

  if (!currentVocab) {
    return (
      <div id="daily-language-card" className={`space-y-2 select-none scroll-mt-20 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
            <LanguageFlagIllustration
              code={languageMeta.languageCode}
              compact
              className="w-full h-full object-contain"
            />
          </div>
          <h4 className="font-brand font-black text-xs text-slate-900 leading-none">
            {languageMeta.languageTitle}
          </h4>
        </div>
        <p className="text-xs text-slate-500 font-medium p-3 rounded-xl bg-slate-50 border border-slate-100">
          Kosakata harian akan muncul setelah modul flashcard tersedia.
        </p>
      </div>
    )
  }

  const progressPct =
    totalVocabsCount > 0 ? Math.round((activeStepNumber / totalVocabsCount) * 100) : 0
  const deckParam = slugifyFlashcardDeckTitle(currentVocab.deckTitle) || currentVocab.deckId
  const deckTargetRoute = deckParam
    ? `/flashcards?deck=${encodeURIComponent(deckParam)}`
    : '/flashcards'
  const hasAnsweredQuiz = selectedQuizChoice !== null
  const isQuizCorrect =
    hasAnsweredQuiz &&
    selectedQuizChoice.trim().toLowerCase() === currentVocab.arti.trim().toLowerCase()

  return (
    <div id="daily-language-card" className={`space-y-2.5 select-none scroll-mt-20 ${className}`}>
      {/* ── HEADER WITH OFFICIAL SVG FLAG & DAILY TRAINED PROGRESS ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-6 rounded-lg bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0 p-0.5">
            <LanguageFlagIllustration
              code={currentVocab.languageCode || languageMeta.languageCode}
              compact
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-brand font-black text-xs text-slate-900 leading-tight truncate">
              {languageMeta.languageTitle}
            </h4>
            <span className="text-[9px] text-slate-500 font-bold tracking-wide block truncate">
              {currentVocab.level}
            </span>
          </div>
        </div>

        <span
          className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-brand font-black ${
            reviewedTodayCount > 0
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
          title="Jumlah kosakata harian yang sudah dilatih hari ini"
        >
          <Sparkle weight="fill" className="w-2.5 h-2.5" />
          <span>
            {reviewedTodayCount}/{totalVocabsCount} dilatih
          </span>
        </span>
      </div>

      {/* ── MODE SWITCHER (BELAJAR | TEBAK) & CARD STEPPER ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/80">
          <button
            type="button"
            aria-pressed={cardMode === 'study'}
            onClick={() => handleSetCardMode('study')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-brand font-black transition-all cursor-pointer ${
              cardMode === 'study'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen weight="bold" className="w-3 h-3" />
            <span>Belajar</span>
          </button>
          <button
            type="button"
            aria-pressed={cardMode === 'quiz'}
            onClick={() => handleSetCardMode('quiz')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-brand font-black transition-all cursor-pointer ${
              cardMode === 'quiz'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Lightning weight="fill" className="w-3 h-3" />
            <span>Tebak</span>
          </button>
        </div>

        {totalVocabsCount > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevVocab}
              aria-label="Kosakata sebelumnya"
              title="Kosakata sebelumnya"
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer transition-colors active:scale-95"
            >
              <CaretLeft weight="bold" className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-600 min-w-[34px] text-center">
              {activeStepNumber}/{totalVocabsCount}
            </span>
            <button
              type="button"
              onClick={handleNextVocab}
              aria-label="Kosakata berikutnya"
              title="Kosakata berikutnya"
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer transition-colors active:scale-95"
            >
              <CaretRight weight="bold" className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* ── 3D TACTILE INTERACTIVE VOCAB CARD ── */}
      <div className="bg-white border-2 border-rose-200/80 rounded-2xl overflow-hidden shadow-[0_4px_0_0_#FECDD3] transition-all">
        {/* Top Gradient Strip */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400" />

        {/* Position Micro-Progress Bar */}
        <div className="h-1 w-full bg-rose-50">
          <div
            className="h-full bg-rose-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="p-3 space-y-2.5">
          {/* Top Term Row + 2-Speed Audio + Copy */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentVocab.deckTitle && (
                  <span className="text-[9px] font-brand font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 truncate max-w-[140px]">
                    {currentVocab.deckTitle}
                  </span>
                )}
                {currentVocab.isReviewedToday && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-brand font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle weight="fill" className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Dilatih</span>
                  </span>
                )}
              </div>

              <p className="font-brand font-black text-2xl text-slate-900 tracking-wide leading-tight break-words">
                {currentVocab.kanji}
              </p>
            </div>

            {/* 2-Speed Audio (Normal & 0.6x) + Copy */}
            <div className="flex items-center gap-1 shrink-0 pt-0.5">
              <button
                type="button"
                onClick={() => handleSpeak('normal')}
                className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer active:translate-y-0.5 ${
                  playingSpeed === 'normal'
                    ? 'bg-rose-500 border-rose-600 text-white shadow-[0_2px_0_0_#BE123C]'
                    : 'bg-white border-slate-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 shadow-[0_2px_0_0_#E2E8F0]'
                }`}
                aria-label="Putar audio kecepatan normal"
                title={`Dengarkan normal (${languageMeta.ttsLangCode})`}
              >
                <SpeakerHigh
                  weight="fill"
                  className={`w-3.5 h-3.5 ${playingSpeed === 'normal' ? 'animate-pulse' : ''}`}
                />
              </button>

              <button
                type="button"
                onClick={() => handleSpeak('slow')}
                className={`h-7 px-1.5 rounded-xl border-2 flex items-center gap-0.5 transition-all cursor-pointer active:translate-y-0.5 ${
                  playingSpeed === 'slow'
                    ? 'bg-amber-500 border-amber-600 text-white shadow-[0_2px_0_0_#B45309]'
                    : 'bg-white border-slate-200 hover:border-amber-400 text-slate-700 hover:text-amber-700 shadow-[0_2px_0_0_#E2E8F0]'
                }`}
                aria-label="Putar audio pelan 0.6x"
                title="Dengarkan perlahan (0.6x)"
              >
                <SpeakerLow
                  weight="fill"
                  className={`w-3 h-3 ${playingSpeed === 'slow' ? 'animate-pulse' : ''}`}
                />
                <span className="text-[9px] font-brand font-black">0.6x</span>
              </button>

              <button
                type="button"
                onClick={() => void handleCopy()}
                className="w-7 h-7 rounded-xl bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 shadow-[0_2px_0_0_#E2E8F0] active:translate-y-0.5 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Salin kosakata"
                title="Salin kosakata"
              >
                {copied ? (
                  <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy weight="bold" className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Interactive Study vs Mini-Quiz Area */}
          {cardMode === 'study' ? (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {(currentVocab.kana || currentVocab.romaji) && (
                <span className="bg-rose-50 text-rose-800 border border-rose-200 font-brand font-black text-[10px] px-2 py-0.5 rounded-lg">
                  {[currentVocab.kana, currentVocab.romaji].filter(Boolean).join(' • ')}
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 font-brand font-black text-[10px] px-2 py-0.5 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>{currentVocab.arti}</span>
              </span>
            </div>
          ) : (
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <p className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-500">
                Pilih arti yang tepat:
              </p>

              <div className="grid grid-cols-1 gap-1.5">
                {currentVocab.quizChoices.map((choice) => {
                  const isCorrectOption =
                    choice.trim().toLowerCase() === currentVocab.arti.trim().toLowerCase()
                  const isPicked = selectedQuizChoice === choice

                  let btnClass =
                    'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-800'
                  if (hasAnsweredQuiz) {
                    if (isCorrectOption) {
                      btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-800'
                    } else if (isPicked) {
                      btnClass = 'bg-rose-50 border-rose-400 text-rose-800'
                    } else {
                      btnClass = 'bg-slate-50/70 border-slate-200/70 text-slate-400'
                    }
                  }

                  return (
                    <button
                      key={choice}
                      type="button"
                      disabled={hasAnsweredQuiz}
                      onClick={() => handleSelectQuizChoice(choice)}
                      className={`w-full px-3 py-1.5 rounded-xl border-2 text-left text-[11px] font-brand font-bold transition-all cursor-pointer disabled:cursor-default flex items-center justify-between gap-2 ${btnClass}`}
                    >
                      <span className="truncate">{choice}</span>
                      {hasAnsweredQuiz && isCorrectOption && (
                        <CheckCircle weight="fill" className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              {hasAnsweredQuiz && (
                <div className="space-y-1.5 pt-1">
                  <div
                    className={`rounded-xl px-2.5 py-1.5 border text-[10px] font-semibold flex items-center justify-between gap-2 ${
                      isQuizCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    <div className="min-w-0">
                      {(currentVocab.kana || currentVocab.romaji) && (
                        <span className="font-brand font-black block">
                          {[currentVocab.kana, currentVocab.romaji].filter(Boolean).join(' • ')}
                        </span>
                      )}
                      <span>
                        {isQuizCorrect
                          ? `Tepat! Arti: ${currentVocab.arti}`
                          : `Belum tepat • Arti: ${currentVocab.arti}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!isQuizCorrect && (
                        <button
                          type="button"
                          onClick={handleRetryQuizChoice}
                          className="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 font-brand font-black text-[10px] hover:bg-rose-50 cursor-pointer"
                        >
                          Ulangi
                        </button>
                      )}
                      {totalVocabsCount > 1 && (
                        <button
                          type="button"
                          onClick={handleNextVocab}
                          className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-brand font-black text-[10px] hover:bg-slate-50 cursor-pointer"
                        >
                          Lanjut →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Optional Dialogue Context */}
          {currentVocab.contoh && (
            <div className="flex items-start justify-between gap-2 p-2 bg-slate-50 border border-slate-200/60 rounded-xl">
              <div className="text-[10px] space-y-0.5 min-w-0">
                <p className="font-brand font-bold italic text-slate-800 leading-snug">
                  "{currentVocab.contoh}"
                </p>
                {currentVocab.terjemahan && (
                  <p className="text-slate-500 font-medium leading-snug">
                    "{currentVocab.terjemahan}"
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleSpeak('normal', currentVocab.contoh)}
                className="shrink-0 p-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-400 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer shadow-2xs active:translate-y-0.5"
                title="Dengarkan Contoh Kalimat Percakapan"
                aria-label="Dengarkan Contoh Kalimat Percakapan"
              >
                <SpeakerHigh weight="bold" className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Deep-Link Footer to Flashcard Deck */}
        <Link
          to={deckTargetRoute}
          className="px-3 py-2 bg-slate-50/90 hover:bg-blue-50/80 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px] font-brand font-black text-blue-600 transition-colors group"
        >
          <span className="truncate">
            Latih Dek: {currentVocab.deckTitle || 'Semua Flashcard'}
          </span>
          <ArrowRight weight="bold" className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
