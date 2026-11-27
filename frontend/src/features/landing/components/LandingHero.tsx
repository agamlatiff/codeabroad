import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, CheckCircle, LockSimple, SpeakerHigh } from '@phosphor-icons/react'
import { AudioWaveformBars } from '@/features/landing/components/LandingIllustrations'
import {
  LANDING_DEMO_PACKS,
  type DemoLanguageCode,
} from '@/features/landing/data/landingContent'
import { languageService } from '@/features/curriculum/services/languageService'
import type { Language } from '@/features/curriculum/types/curriculum'
import { LANGUAGES_QUERY_KEY } from '@/shared/constants/queryKeys'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

const HERO_TRUST_ITEMS_JA = [
  'Mulai N5 tanpa login',
  'N4–N3 gratis dengan akun',
  'N2–N1 & bebas lompat unit di Pro',
] as const

const HERO_TRUST_ITEMS_EN = [
  'Mulai A1 tanpa login',
  'A2–B1 gratis dengan akun',
  'B2–C2 & bebas lompat unit di Pro',
] as const

const FALLBACK_LANGUAGE_IDS: Partial<Record<DemoLanguageCode, string>> = {
  ja: 'a7ca68a2-0041-4e5c-a1f1-7b786f319b65',
  'en-us': 'd0e37fce-33c2-4091-afc7-131867f5d20d',
}

function findMatchedLanguage(
  languages: Language[],
  packCode: DemoLanguageCode
): Language | undefined {
  return (
    languages.find((l) => l.code.toLowerCase() === packCode) ??
    (packCode === 'en-us' || packCode === 'en-gb'
      ? languages.find((l) => l.is_active && l.code.toLowerCase().startsWith('en'))
      : undefined)
  )
}

function isPackTrackActive(
  languages: Language[],
  packCode: DemoLanguageCode
): boolean {
  const matched = findMatchedLanguage(languages, packCode)
  if (matched) return Boolean(matched.is_active)
  return packCode === 'ja' || packCode === 'en-us'
}

export const LandingHero = () => {
  const [selectedCode, setSelectedCode] = useState<DemoLanguageCode>('ja')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const speechRequestIdRef = useRef(0)
  const shouldReduceMotion = useReducedMotion()

  const { data: languages = [] } = useQuery({
    queryKey: LANGUAGES_QUERY_KEY,
    queryFn: ({ signal }) => languageService.listLanguages({ signal }),
    staleTime: 1000 * 60 * 10,
    retry: false,
  })

  useEffect(() => {
    return () => {
      speechRequestIdRef.current += 1
      audioService.stopSpeech()
    }
  }, [])

  const selectedPack =
    LANDING_DEMO_PACKS.find((pack) => pack.code === selectedCode) ?? LANDING_DEMO_PACKS[0]
  const matchedLang = findMatchedLanguage(languages, selectedPack.code)
  const isActiveTrack = isPackTrackActive(languages, selectedPack.code)
  const resolvedLangId = matchedLang?.id ?? FALLBACK_LANGUAGE_IDS[selectedPack.code]
  const targetRoute =
    isActiveTrack && resolvedLangId
      ? selectedPack.code === 'ja'
        ? '/curriculum'
        : `/curriculum/${resolvedLangId}`
      : '/curriculum'
  const leadPhrase = selectedPack.phrases[0]
  const isEnglishSelected = selectedPack.code === 'en-us'
  const heroSubheadlineCta = isEnglishSelected
    ? 'Mulai A1 tanpa login, gratis.'
    : 'Mulai N5 tanpa login, gratis.'
  const heroTrustItems = isEnglishSelected ? HERO_TRUST_ITEMS_EN : HERO_TRUST_ITEMS_JA

  const handleSelectLanguage = (code: DemoLanguageCode) => {
    triggerHaptic('tap')
    if (code === selectedCode) return
    speechRequestIdRef.current += 1
    audioService.stopSpeech()
    setIsPlayingAudio(false)
    setSelectedCode(code)
  }

  const handleSpeakLeadPhrase = () => {
    if (!leadPhrase) return
    triggerHaptic('tap')
    const requestId = ++speechRequestIdRef.current
    setIsPlayingAudio(true)
    audioService.speakLanguage(
      leadPhrase.nativeText,
      selectedPack.speechLocale,
      () => {
        if (speechRequestIdRef.current === requestId) {
          setIsPlayingAudio(false)
        }
      },
      () => {
        if (speechRequestIdRef.current === requestId) {
          setIsPlayingAudio(false)
        }
      }
    )
  }

  return (
    <section
      id="hero-section"
      className="relative bg-white pt-8 pb-12 sm:pt-14 sm:pb-20 px-4 sm:px-6 overflow-x-clip"
    >
      <div className="max-w-[1140px] mx-auto text-center">
        {/* Centered Merantalk Display Headline */}
        <h1 className="font-brand font-black text-[#1E293B] text-[30px] sm:text-5xl lg:text-[62px] leading-[1.12] tracking-tight max-w-4xl mx-auto">
          Belajar bahasa asing untuk karier, beasiswa, dan merantau.
        </h1>

        <p className="mt-4 sm:mt-5 text-base sm:text-2xl font-semibold text-[#475569] leading-[1.38] max-w-2xl mx-auto">
          Jalur terstruktur dari nol hingga siap kerja &amp; kuliah di luar negeri.{' '}
          <span className="underline decoration-[#93C5FD] decoration-[3px] underline-offset-4 text-[#1E293B]">
            {heroSubheadlineCta}
          </span>
        </p>

        <p className="mt-7 sm:mt-11 font-brand font-bold text-base sm:text-xl text-[#1E293B]">
          Mulai jelajahi bahasa pilihanmu...
        </p>

        {/* 5 Tactile Selector Cards */}
        <div
          id="bahasa"
          className="mt-4 sm:mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-[920px] mx-auto scroll-mt-24"
        >
          {LANDING_DEMO_PACKS.map((pack, idx) => {
            const isSelected = pack.code === selectedCode
            const isPackActive = isPackTrackActive(languages, pack.code)
            const isLastCard = idx === LANDING_DEMO_PACKS.length - 1

            return (
              <motion.button
                key={pack.code}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectLanguage(pack.code)}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                whileTap={shouldReduceMotion ? undefined : { y: 2, scale: 0.985 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.01 }
                    : { type: 'spring', stiffness: 420, damping: 24 }
                }
                className={`min-h-[124px] sm:min-h-[168px] rounded-[20px] sm:rounded-[24px] border-2 p-3 sm:p-4 flex flex-col items-center justify-between text-center cursor-pointer relative transition-colors shadow-[0_6px_0_0_rgba(45,64,150,0.06)] hover:shadow-[0_8px_0_0_rgba(37,99,235,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 ${
                  isLastCard ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  isSelected
                    ? 'bg-white border-transparent'
                    : isPackActive
                      ? 'bg-white border-[#E2E8F0] hover:border-[#93C5FD]'
                      : 'bg-slate-50/75 border-[#E2E8F0] hover:border-slate-300 opacity-85'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId={shouldReduceMotion ? undefined : 'hero-lang-active-ring'}
                    aria-hidden="true"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.01 }
                        : { type: 'spring', stiffness: 380, damping: 30 }
                    }
                    className={`pointer-events-none absolute -inset-[2px] rounded-[20px] sm:rounded-[24px] border-2 ${
                      isPackActive
                        ? 'border-[#2563EB] bg-blue-50/35'
                        : 'border-slate-400 bg-slate-100/45'
                    }`}
                  />
                )}

                <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-between gap-2 sm:gap-2.5">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center p-2 sm:p-2.5 overflow-hidden shrink-0">
                    <LanguageFlagIllustration
                      code={pack.code}
                      compact
                      className="w-7 h-5 sm:w-9 sm:h-6 object-contain rounded-sm"
                    />
                  </div>

                  <span className="text-sm sm:text-[17px] font-brand font-black text-[#1E293B] leading-tight">
                    {pack.label}
                  </span>

                  <div className="w-full flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold text-[#64748B]">
                    {isPackActive ? (
                      <>
                        <span className="truncate">{pack.examLabel}</span>
                        {isSelected ? (
                          <span
                            aria-hidden="true"
                            className="w-2 h-2 rounded-full shrink-0 bg-emerald-500"
                          />
                        ) : (
                          <ArrowRight
                            weight="bold"
                            className="w-3 h-3 text-slate-400 shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200/90 px-2 py-0.5 font-brand text-[10px] font-bold text-slate-500">
                        <LockSimple weight="bold" className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                        <span>Segera Hadir</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Hero Action & Audio Dock */}
        <div className="mt-7 sm:mt-8 flex flex-col items-center gap-3.5 max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPack.code}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: shouldReduceMotion ? 0.08 : 0.18 }}
              className="w-full flex flex-col items-center gap-3.5"
            >
              {isActiveTrack ? (
                <Link
                  to={targetRoute}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 min-[360px]:px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-brand font-black shadow-[0_5px_0_0_#1D4ED8] active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
                >
                  <span>Coba Unit 1 {selectedPack.label} Gratis</span>
                  <ArrowRight weight="bold" className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>
              ) : (
                <div className="w-full flex flex-col items-center gap-2">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 border-2 border-slate-200 text-slate-500 px-5 min-[360px]:px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-brand font-black cursor-not-allowed whitespace-nowrap"
                  >
                    <LockSimple weight="bold" className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Kurikulum {selectedPack.label} Segera Hadir</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectLanguage('en-us')}
                    className="text-xs sm:text-sm font-brand font-bold text-[#2563EB] hover:text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Saat ini baru Bahasa Jepang &amp; Inggris (US) yang aktif — klik untuk mulai gratis
                  </button>
                </div>
              )}

              {leadPhrase && (
                <button
                  type="button"
                  onClick={handleSpeakLeadPhrase}
                  aria-pressed={isPlayingAudio}
                  aria-label={`Dengarkan ${leadPhrase.phonetic} (${leadPhrase.meaning}) dalam bahasa ${selectedPack.label}`}
                  className={`max-w-full inline-flex items-center gap-2.5 rounded-full border-2 px-4 py-2 sm:px-5 sm:py-2.5 shadow-[0_4px_0_0_rgba(45,64,150,0.06)] active:translate-y-0.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 ${
                    isPlayingAudio
                      ? 'border-[#2563EB] bg-blue-50/70'
                      : 'bg-white border-[#E2E8F0] hover:border-[#93C5FD]'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 shrink-0">
                    <SpeakerHigh
                      weight="fill"
                      className="w-4 h-4 text-[#2563EB] shrink-0"
                      aria-hidden="true"
                    />
                    <AudioWaveformBars isPlaying={isPlayingAudio} />
                  </span>

                  <span aria-hidden="true" className="w-px h-4 bg-slate-200 shrink-0" />

                  <span className="min-w-0 font-brand font-black text-xs sm:text-sm text-[#1E293B] truncate">
                    {leadPhrase.nativeText}
                  </span>

                  <span aria-hidden="true" className="text-slate-300 font-bold shrink-0">
                    ·
                  </span>

                  <span className="min-w-0 text-xs text-[#64748B] font-medium truncate max-w-[160px] sm:max-w-xs">
                    {leadPhrase.meaning}
                  </span>
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Verifiable Trust Strip */}
        <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#64748B]">
          {heroTrustItems.map((item) => (
            <div key={item} className="inline-flex items-center gap-1.5">
              <CheckCircle
                weight="fill"
                className="w-4 h-4 text-emerald-500 shrink-0"
                aria-hidden="true"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
