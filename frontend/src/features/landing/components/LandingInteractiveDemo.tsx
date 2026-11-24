import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight,
  CheckCircle,
  SpeakerHigh,
  UserPlus,
  XCircle,
} from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { AudioWaveformBars } from '@/features/landing/components/LandingIllustrations'
import {
  LANDING_DEMO_PACKS,
  type DemoLanguageCode,
} from '@/features/landing/data/landingContent'
import { languageService } from '@/features/curriculum/services/languageService'
import { LANGUAGES_QUERY_KEY } from '@/shared/constants/queryKeys'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'
import { audioService } from '@/shared/services/audioService'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'

export const LandingInteractiveDemo = () => {
  const [selectedLangCode, setSelectedLangCode] = useState<DemoLanguageCode>('ja')
  const [activePhraseId, setActivePhraseId] = useState<string | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [isQuizFinished, setIsQuizFinished] = useState(false)

  const { data: languages = [] } = useQuery({
    queryKey: LANGUAGES_QUERY_KEY,
    queryFn: ({ signal }) => languageService.listLanguages({ signal }),
    staleTime: 1000 * 60 * 10,
    retry: false,
  })

  useEffect(() => {
    return () => {
      audioService.stopSpeech()
    }
  }, [])

  const currentPack =
    LANDING_DEMO_PACKS.find((pack) => pack.code === selectedLangCode) ?? LANDING_DEMO_PACKS[0]
  const matchedLanguage =
    languages.find((lang) => lang.code.toLowerCase() === currentPack.code) ??
    (currentPack.code === 'en-gb'
      ? languages.find((lang) => lang.is_active && lang.code.toLowerCase().startsWith('en'))
      : undefined)
  const isPackTrackActive = Boolean(matchedLanguage?.is_active)

  const currentQuestion = currentPack.questions[questionIndex]
  const isAnswered = selectedOptionId !== null
  const isCorrectSelection =
    isAnswered && selectedOptionId === currentQuestion?.correctOptionId

  const handleSelectDemoLanguage = (code: DemoLanguageCode) => {
    if (code === selectedLangCode) return
    triggerHaptic('tap')
    audioService.stopSpeech()
    setSelectedLangCode(code)
    setActivePhraseId(null)
    setQuestionIndex(0)
    setSelectedOptionId(null)
    setCorrectCount(0)
    setIsQuizFinished(false)
  }

  const handleSpeakPhrase = (phraseId: string, text: string) => {
    triggerHaptic('tap')
    setActivePhraseId(phraseId)
    audioService.speakLanguage(
      text,
      currentPack.speechLocale,
      () => setActivePhraseId(null),
      () => setActivePhraseId(null)
    )
  }

  const handleSelectQuizOption = (optionId: string) => {
    if (isAnswered || !currentQuestion) return
    setSelectedOptionId(optionId)
    if (optionId === currentQuestion.correctOptionId) {
      triggerHaptic('success')
      audioEngine.playSuccess()
      setCorrectCount((prev) => prev + 1)
    } else {
      triggerHaptic('error')
      audioEngine.playError()
    }
  }

  const handleNextQuestion = () => {
    triggerHaptic('tap')
    if (questionIndex + 1 < currentPack.questions.length) {
      setQuestionIndex((prev) => prev + 1)
      setSelectedOptionId(null)
      return
    }
    setIsQuizFinished(true)
  }

  const handleRestartDemo = () => {
    triggerHaptic('tap')
    setQuestionIndex(0)
    setSelectedOptionId(null)
    setCorrectCount(0)
    setIsQuizFinished(false)
  }

  return (
    <section id="coba-kilat" className="bg-white py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-[1080px] mx-auto rounded-[32px] bg-[#EBF2FF] border-2 border-[#DBEAFE] p-5 sm:p-9 lg:p-10 space-y-7">
        {/* Banner Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center space-y-3">
          <KodiCharacter emotion="studying" size={68} interactive={false} />
          <span className="inline-flex items-center rounded-full bg-white/90 border border-blue-200/90 px-3.5 py-1 text-[11px] font-brand font-black uppercase tracking-wider text-[#2563EB]">
            Simulasi Interaktif Tanpa Login
          </span>
          <h2 className="text-2xl sm:text-[38px] font-brand font-black text-[#1E293B] leading-[1.16] tracking-tight">
            Dengar Pelafalan &amp; Coba Kuis Singkat
          </h2>
          <p className="text-sm sm:text-base text-[#475569] max-w-xl">
            Pilih bahasa di bawah, ketuk kartu untuk mendengar suara aslinya, lalu jawab 2
            pertanyaan singkat.
          </p>
        </div>

        {/* 5-Language Tab Switcher */}
        <div
          className="flex flex-wrap items-center justify-center gap-2.5"
          role="tablist"
          aria-label="Pilih bahasa untuk simulasi"
        >
          {LANDING_DEMO_PACKS.map((pack) => {
            const isSelected = pack.code === currentPack.code
            return (
              <button
                key={pack.code}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectDemoLanguage(pack.code)}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-[16px] border text-xs sm:text-sm font-brand font-black transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-[#2563EB] text-white'
                    : 'border-blue-200/80 bg-white/95 hover:bg-white text-[#1E293B] shadow-[0_2px_0_0_rgba(45,64,150,0.06)]'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="demo-active-lang-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-[16px] bg-[#2563EB] shadow-[0_3px_0_0_#1D4ED8]"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 w-6 h-4 rounded-sm overflow-hidden bg-white border border-slate-200/80 shrink-0 flex items-center justify-center">
                  <LanguageFlagIllustration
                    code={pack.code}
                    compact
                    className="w-full h-full object-contain"
                  />
                </span>
                <span className="relative z-10 transition-colors">{pack.label}</span>
              </button>
            )
          })}
        </div>

        {/* Inner 2-Column Stage */}
        <div className="grid lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Clickable Audio Phrase Cards */}
          <div className="lg:col-span-6 rounded-[24px] bg-white border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-brand font-black text-[#1E293B]">
                  1. Ketuk untuk Dengar Pelafalan ({currentPack.label})
                </h3>
                <p className="text-xs text-[#64748B]">{currentPack.phraseSubtitle}</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#EFF6FF] border border-blue-200/80 px-2.5 py-1 rounded-xl shrink-0">
                {currentPack.examLabel}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {currentPack.phrases.map((card) => {
                const isPlaying = activePhraseId === card.id
                return (
                  <button
                    key={card.id}
                    type="button"
                    aria-pressed={isPlaying}
                    onClick={() => handleSpeakPhrase(card.id, card.nativeText)}
                    className={`text-left rounded-2xl border-2 p-4 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-1 ${
                      isPlaying
                        ? 'border-[#2563EB] bg-[#EFF6FF]/80 shadow-[0_4px_0_0_#93C5FD]'
                        : 'border-[#E2E8F0] bg-[#FAFAF9] hover:bg-white hover:border-blue-300 shadow-[0_3px_0_0_#E2E8F0] active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-brand font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-white border border-slate-200/80 text-[#475569]">
                        {card.contextTag}
                      </span>
                      {isPlaying ? (
                        <AudioWaveformBars isPlaying />
                      ) : (
                        <SpeakerHigh weight="fill" className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-base sm:text-lg font-brand font-black text-[#1E293B] leading-snug">
                      {card.nativeText}
                    </p>
                    <p className="text-xs font-mono font-semibold text-[#2563EB] mt-0.5">
                      {card.phonetic}
                    </p>
                    <p className="text-xs text-[#475569] mt-1.5">{card.meaning}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: 2-Question Instant Micro-Quiz */}
          <div className="lg:col-span-6 rounded-[24px] bg-white border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
            <AnimatePresence mode="wait">
              {isQuizFinished ? (
                <motion.div
                  key={`finished-${currentPack.code}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="my-auto py-4 text-center space-y-4"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center">
                    <CheckCircle weight="fill" className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-brand font-black text-[#1E293B]">
                      Kuis {currentPack.label} Selesai ({correctCount}/
                      {currentPack.questions.length} Benar)
                    </h3>
                    {isPackTrackActive ? (
                      <p className="text-sm text-[#475569] max-w-md mx-auto">
                        Di Peta Belajar kamu sudah bisa mencoba seluruh pelajaran{' '}
                        <strong>Unit 1 Bahasa {currentPack.label}</strong> secara penuh tanpa login.
                      </p>
                    ) : (
                      <p className="text-sm text-[#475569] max-w-md mx-auto">
                        Kurikulum lengkap <strong>Bahasa {currentPack.label}</strong> sedang kami
                        siapkan. Sambil menunggu, kamu sudah bisa mencoba{' '}
                        <strong>Unit 1 jalur yang aktif</strong> atau membuat akun gratis.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
                    <Link
                      to={
                        isPackTrackActive && matchedLanguage?.id
                          ? `/curriculum/${matchedLanguage.id}`
                          : '/curriculum'
                      }
                    >
                      <Button3D
                        variant="blue"
                        size="md"
                        icon={<ArrowRight weight="bold" className="w-4 h-4" />}
                      >
                        {isPackTrackActive
                          ? `Buka Unit 1 Bahasa ${currentPack.label}`
                          : 'Coba Jalur Aktif'}
                      </Button3D>
                    </Link>
                    <Link to="/register">
                      <Button3D
                        variant="white"
                        size="md"
                        icon={<UserPlus weight="bold" className="w-4 h-4 text-[#2563EB]" />}
                      >
                        Daftar Gratis
                      </Button3D>
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={handleRestartDemo}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Ulangi kuis
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${currentPack.code}-${currentQuestion.id}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-brand font-black text-[#1E293B]">
                        2. Kuis Singkat ({questionIndex + 1}/{currentPack.questions.length})
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5">
                      <p className="text-sm font-bold text-[#1E293B]">{currentQuestion.prompt}</p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-lg border border-blue-200/80">
                          {currentQuestion.sampleText}
                        </span>
                        <span className="text-[#64748B]">{currentQuestion.hint}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = selectedOptionId === opt.id
                        const isCorrectOption = opt.id === currentQuestion.correctOptionId

                        let styleClass =
                          'border-[#E2E8F0] bg-white hover:border-blue-300 text-[#1E293B] shadow-[0_3px_0_0_#E2E8F0]'
                        if (isAnswered) {
                          if (isCorrectOption) {
                            styleClass =
                              'border-emerald-400 bg-emerald-50 text-emerald-900 shadow-[0_3px_0_0_#6EE7B7]'
                          } else if (isSelected) {
                            styleClass =
                              'border-rose-400 bg-rose-50 text-rose-900 shadow-[0_3px_0_0_#FDA4AF]'
                          } else {
                            styleClass = 'border-slate-200 bg-slate-50/70 text-slate-400 opacity-75'
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectQuizOption(opt.id)}
                            className={`rounded-2xl border-2 px-3.5 py-3 text-left transition-all cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-1 ${styleClass}`}
                          >
                            <div className="font-brand font-black text-sm sm:text-base leading-tight">
                              {opt.label}
                            </div>
                            {opt.sub && (
                              <div className="text-[11px] font-medium opacity-80 mt-0.5">
                                {opt.sub}
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {isAnswered ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 rounded-2xl border-2 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCorrectSelection
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-start gap-2 text-xs leading-relaxed">
                        {isCorrectSelection ? (
                          <CheckCircle
                            weight="fill"
                            className="w-5 h-5 text-emerald-600 shrink-0"
                          />
                        ) : (
                          <XCircle weight="fill" className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                        <span>{currentQuestion.explanation}</span>
                      </div>
                      <Button3D
                        type="button"
                        variant={isCorrectSelection ? 'emerald' : 'blue'}
                        size="sm"
                        onClick={handleNextQuestion}
                        className="shrink-0"
                      >
                        {questionIndex + 1 < currentPack.questions.length
                          ? 'Soal Berikutnya'
                          : 'Lihat Hasil'}
                      </Button3D>
                    </motion.div>
                  ) : (
                    <p className="mt-4 text-xs text-slate-400 text-center">
                      Pilih salah satu jawaban di atas untuk melihat umpan balik langsung.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
