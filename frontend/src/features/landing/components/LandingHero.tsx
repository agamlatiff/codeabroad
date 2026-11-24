import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, CheckCircle, SpeakerHigh } from '@phosphor-icons/react'
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

const HERO_TRUST_ITEMS = [
  'Unit 1 terbuka tanpa akun',
  'Audio penutur asli',
  'Jalur JLPT, IELTS, Goethe, HSK & DELF',
] as const

function findMatchedLanguage(
  languages: Language[],
  packCode: DemoLanguageCode
): Language | undefined {
  return (
    languages.find((l) => l.code.toLowerCase() === packCode) ??
    (packCode === 'en-gb'
      ? languages.find((l) => l.is_active && l.code.toLowerCase().startsWith('en'))
      : undefined)
  )
}

export const LandingHero = () => {
  const [selectedCode, setSelectedCode] = useState<DemoLanguageCode>('ja')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

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

  const selectedPack =
    LANDING_DEMO_PACKS.find((pack) => pack.code === selectedCode) ?? LANDING_DEMO_PACKS[0]
  const matchedLang = findMatchedLanguage(languages, selectedPack.code)
  const isActiveTrack = Boolean(matchedLang?.is_active)
  const targetRoute =
    isActiveTrack && matchedLang?.id ? `/curriculum/${matchedLang.id}` : '/curriculum'
  const leadPhrase = selectedPack.phrases[0]

  const handleSelectLanguage = (code: DemoLanguageCode) => {
    triggerHaptic('tap')
    if (code === selectedCode) return
    audioService.stopSpeech()
    setIsPlayingAudio(false)
    setSelectedCode(code)
  }

  const handleSpeakLeadPhrase = () => {
    if (!leadPhrase) return
    triggerHaptic('tap')
    setIsPlayingAudio(true)
    audioService.speakLanguage(
      leadPhrase.nativeText,
      selectedPack.speechLocale,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    )
  }

  return (
    <section
      id="hero-section"
      className="relative bg-white pt-10 pb-14 sm:pt-16 sm:pb-20 px-4 sm:px-6 overflow-x-clip"
    >
      <div className="max-w-[1140px] mx-auto text-center">
        {/* Centered ClassDojo Display Headline */}
        <h1 className="font-brand font-black text-[#1E293B] text-4xl sm:text-5xl lg:text-[62px] leading-[1.12] tracking-tight max-w-4xl mx-auto">
          Belajar bahasa asing jadi terarah dan menyenangkan.
        </h1>

        <p className="mt-5 text-lg sm:text-2xl font-semibold text-[#475569] leading-[1.35] max-w-2xl mx-auto">
          Dari nol hingga siap sertifikasi global.{' '}
          <span className="underline decoration-[#93C5FD] decoration-[3px] underline-offset-4 text-[#1E293B]">
            Bisa dicoba dulu, gratis.
          </span>
        </p>

        <p className="mt-10 sm:mt-12 font-brand font-bold text-lg sm:text-xl text-[#1E293B]">
          Mulai jelajahi bahasa pilihanmu...
        </p>

        {/* 5 Tactile Selector Cards */}
        <div
          id="bahasa"
          className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 max-w-[920px] mx-auto scroll-mt-24"
        >
          {LANDING_DEMO_PACKS.map((pack) => {
            const isSelected = pack.code === selectedCode
            const packLang = findMatchedLanguage(languages, pack.code)
            const isPackActive = Boolean(packLang?.is_active)

            return (
              <motion.button
                key={pack.code}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectLanguage(pack.code)}
                whileHover={{ y: -4 }}
                whileTap={{ y: 2, scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className={`min-h-[158px] sm:min-h-[168px] rounded-[24px] bg-white border-2 p-4 flex flex-col items-center justify-between text-center cursor-pointer relative transition-colors shadow-[0_6px_0_0_rgba(45,64,150,0.06)] hover:shadow-[0_8px_0_0_rgba(37,99,235,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 ${
                  isSelected
                    ? 'border-transparent'
                    : 'border-[#E2E8F0] hover:border-[#93C5FD]'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="hero-lang-active-ring"
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="pointer-events-none absolute -inset-[2px] rounded-[24px] border-2 border-[#2563EB] bg-blue-50/35"
                  />
                )}

                <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-between gap-2.5">
                  <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center p-2.5 overflow-hidden shrink-0">
                    <LanguageFlagIllustration
                      code={pack.code}
                      compact
                      className="w-9 h-6 object-contain rounded-sm"
                    />
                  </div>

                  <span className="text-base sm:text-[17px] font-brand font-black text-[#1E293B] leading-tight">
                    {pack.label}
                  </span>

                  <div className="w-full flex items-center justify-center gap-1.5 text-[11px] font-mono font-bold text-[#64748B]">
                    <span className="truncate">{pack.examLabel}</span>
                    {isSelected ? (
                      <span
                        aria-hidden="true"
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isPackActive ? 'bg-emerald-500' : 'bg-[#2563EB]'
                        }`}
                      />
                    ) : (
                      <ArrowRight
                        weight="bold"
                        className="w-3 h-3 text-slate-400 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Interactive Selected-Language Quick Bar */}
        {leadPhrase && (
          <div className="mt-6 max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPack.code}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="rounded-[24px] bg-[#FAFAF9] border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSpeakLeadPhrase}
                    aria-label={`Dengarkan ${leadPhrase.phonetic} dalam bahasa ${selectedPack.label}`}
                    className={`inline-flex items-center gap-2 rounded-2xl border-2 px-3.5 py-2.5 shrink-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 ${
                      isPlayingAudio
                        ? 'bg-blue-50 border-[#2563EB] text-[#1D4ED8]'
                        : 'bg-white hover:bg-blue-50/70 border-[#E2E8F0] hover:border-[#93C5FD] text-[#1E293B]'
                    }`}
                  >
                    <SpeakerHigh weight="fill" className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <AudioWaveformBars isPlaying={isPlayingAudio} />
                  </button>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-brand font-black text-base sm:text-lg text-[#1E293B]">
                        {leadPhrase.nativeText}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#2563EB]">
                        {leadPhrase.phonetic}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[#475569]">
                      {leadPhrase.meaning}
                    </p>
                    <p className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1.5 pt-0.5">
                      <span
                        aria-hidden="true"
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isActiveTrack ? 'bg-emerald-500' : 'bg-[#2563EB]'
                        }`}
                      />
                      <span>
                        {isActiveTrack
                          ? 'Unit 1 siap dicoba gratis'
                          : 'Pratinjau & simulasi audio aktif'}
                      </span>
                    </p>
                  </div>
                </div>

                <Link
                  to={targetRoute}
                  className="w-full sm:w-auto justify-center rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-3 text-sm font-brand font-black shadow-[0_4px_0_0_#1D4ED8] active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center gap-2 shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
                >
                  <span>Coba Unit 1 {selectedPack.label}</span>
                  <ArrowRight weight="bold" className="w-4 h-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Verifiable Trust Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#64748B]">
          {HERO_TRUST_ITEMS.map((item) => (
            <div key={item} className="inline-flex items-center gap-1.5">
              <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
