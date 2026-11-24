import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChatCircleDots,
  GlobeHemisphereWest,
  GraduationCap,
  SpeakerHigh,
  Waveform,
} from '@phosphor-icons/react'
import { AudioWaveformBars } from '@/features/landing/components/LandingIllustrations'
import {
  LANDING_DEMO_PACKS,
  type DemoLanguageCode,
} from '@/features/landing/data/landingContent'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

interface ShowcasePhraseItem {
  kind: 'phrase'
  id: string
  langCode: DemoLanguageCode
  langLabel: string
  speechLocale: string
  contextTag: string
  nativeText: string
  phonetic: string
  meaning: string
  widthClass: 'w-[250px]' | 'w-[330px]'
}

interface ShowcaseCultureItem {
  kind: 'culture'
  id: string
  badge: string
  title: string
  note: string
  accent: 'blue' | 'amber' | 'emerald'
  widthClass: 'w-[250px]'
}

type ShowcaseItem = ShowcasePhraseItem | ShowcaseCultureItem

const getPhrase = (
  langCode: DemoLanguageCode,
  phraseIndex: number,
  widthClass: 'w-[250px]' | 'w-[330px]'
): ShowcasePhraseItem => {
  const pack = LANDING_DEMO_PACKS.find((item) => item.code === langCode) ?? LANDING_DEMO_PACKS[0]
  const phrase = pack.phrases[phraseIndex] ?? pack.phrases[0]
  return {
    kind: 'phrase',
    id: phrase.id,
    langCode: pack.code,
    langLabel: pack.label,
    speechLocale: pack.speechLocale,
    contextTag: phrase.contextTag,
    nativeText: phrase.nativeText,
    phonetic: phrase.phonetic,
    meaning: phrase.meaning,
    widthClass,
  }
}

const ROW_1_ITEMS: ReadonlyArray<ShowcaseItem> = [
  getPhrase('zh', 0, 'w-[250px]'),
  getPhrase('ja', 0, 'w-[330px]'),
  {
    kind: 'culture',
    id: 'culture-work-etiquette',
    badge: 'Kiat Budaya',
    title: 'Etika Sapaan Kerja',
    note: 'Di Prancis, "Bonjour" wajib membuka percakapan; di Jepang, "Ohayou gozaimasu" jadi standar hormat pagi hari.',
    accent: 'blue',
    widthClass: 'w-[250px]',
  },
  getPhrase('en-gb', 2, 'w-[330px]'),
  getPhrase('de', 0, 'w-[250px]'),
  getPhrase('ja', 2, 'w-[330px]'),
  getPhrase('fr', 0, 'w-[250px]'),
  getPhrase('zh', 2, 'w-[330px]'),
  {
    kind: 'culture',
    id: 'culture-tone-pronunciation',
    badge: 'Kiat Pelafalan',
    title: 'Nada & Pelafalan',
    note: 'Mandarin membedakan arti kata lewat empat nada, sementara bahasa Jepang peka pada panjang-pendek vokal.',
    accent: 'amber',
    widthClass: 'w-[250px]',
  },
  getPhrase('en-gb', 0, 'w-[330px]'),
  getPhrase('de', 2, 'w-[250px]'),
  getPhrase('fr', 2, 'w-[330px]'),
]

const ROW_2_ITEMS: ReadonlyArray<ShowcaseItem> = [
  getPhrase('en-gb', 1, 'w-[330px]'),
  getPhrase('de', 1, 'w-[250px]'),
  getPhrase('ja', 3, 'w-[330px]'),
  getPhrase('zh', 1, 'w-[250px]'),
  getPhrase('fr', 3, 'w-[330px]'),
  {
    kind: 'culture',
    id: 'culture-global-campus',
    badge: 'Kiat Konteks',
    title: 'Siap Kampus Global',
    note: 'Meminta pengulangan secara sopan di kelas atau briefing kerja menjaga komunikasi tetap jelas tanpa canggung.',
    accent: 'emerald',
    widthClass: 'w-[250px]',
  },
  getPhrase('en-gb', 3, 'w-[330px]'),
  getPhrase('ja', 1, 'w-[250px]'),
  getPhrase('de', 3, 'w-[330px]'),
  getPhrase('fr', 1, 'w-[250px]'),
  getPhrase('zh', 3, 'w-[330px]'),
]

const CULTURE_ACCENT_STYLES: Record<
  ShowcaseCultureItem['accent'],
  { pill: string; iconBg: string }
> = {
  blue: {
    pill: 'bg-[#EFF6FF] border-blue-200/80 text-[#2563EB]',
    iconBg: 'bg-[#EFF6FF] text-[#2563EB]',
  },
  amber: {
    pill: 'bg-amber-50 border-amber-200/80 text-amber-700',
    iconBg: 'bg-amber-50 text-amber-600',
  },
  emerald: {
    pill: 'bg-emerald-50 border-emerald-200/80 text-emerald-700',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
}

const CultureCardIcon = ({ accent }: { accent: ShowcaseCultureItem['accent'] }) => {
  if (accent === 'amber') {
    return <Waveform weight="fill" className="w-4 h-4" aria-hidden="true" />
  }
  if (accent === 'emerald') {
    return <GraduationCap weight="fill" className="w-4 h-4" aria-hidden="true" />
  }
  return <GlobeHemisphereWest weight="fill" className="w-4 h-4" aria-hidden="true" />
}

export const LandingPhraseShowcaseBand = () => {
  const [activePhraseId, setActivePhraseId] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      audioService.stopSpeech()
    }
  }, [])

  const handleSpeak = (phraseId: string, text: string, speechLocale: string) => {
    triggerHaptic('tap')
    setActivePhraseId(phraseId)
    audioService.speakLanguage(
      text,
      speechLocale,
      () => setActivePhraseId(null),
      () => setActivePhraseId(null)
    )
  }

  const renderShowcaseCard = (item: ShowcaseItem, copyIndex: number, itemIndex: number) => {
    const isDuplicate = copyIndex === 1
    const cardKey = `${item.id}-${copyIndex}-${itemIndex}`

    if (item.kind === 'culture') {
      const style = CULTURE_ACCENT_STYLES[item.accent]
      return (
        <article
          key={cardKey}
          aria-hidden={isDuplicate || undefined}
          className={`${item.widthClass} rounded-[28px] bg-white border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] p-5 flex flex-col justify-between gap-3 shrink-0 transition-transform hover:-translate-y-1`}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-brand font-black ${style.pill}`}
            >
              {item.badge}
            </span>
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${style.iconBg}`}
            >
              <CultureCardIcon accent={item.accent} />
            </span>
          </div>

          <h3 className="font-brand font-black text-lg sm:text-xl text-[#1E293B] leading-snug">
            {item.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{item.note}</p>
        </article>
      )
    }

    const isPlaying = activePhraseId === item.id

    return (
      <article
        key={cardKey}
        aria-hidden={isDuplicate || undefined}
        onClick={() => handleSpeak(item.id, item.nativeText, item.speechLocale)}
        className={`${item.widthClass} rounded-[28px] bg-white border-2 p-5 flex flex-col justify-between gap-3 shrink-0 transition-all hover:-translate-y-1 cursor-pointer ${
          isPlaying
            ? 'border-[#2563EB] shadow-[0_6px_0_0_rgba(37,99,235,0.18)]'
            : 'border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] hover:border-blue-300'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-4 rounded-sm overflow-hidden bg-white border border-slate-200/80 shrink-0 flex items-center justify-center">
              <LanguageFlagIllustration
                code={item.langCode}
                compact
                className="w-6 h-4 rounded-sm object-contain"
              />
            </span>
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <span className="text-xs font-brand font-black text-[#1E293B] shrink-0">
                {item.langLabel}
              </span>
              <span className="text-[11px] text-slate-300" aria-hidden="true">
                •
              </span>
              <span className="text-[11px] font-semibold text-[#64748B] truncate">
                {item.contextTag}
              </span>
            </div>
          </div>

          <button
            type="button"
            tabIndex={isDuplicate ? -1 : 0}
            aria-pressed={isPlaying}
            aria-label={`Putar pengucapan ${item.nativeText} (${item.langLabel})`}
            onClick={(event) => {
              event.stopPropagation()
              handleSpeak(item.id, item.nativeText, item.speechLocale)
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 ${
              isPlaying
                ? 'bg-[#EFF6FF] text-[#2563EB]'
                : 'bg-[#F8FAFC] hover:bg-[#EFF6FF] text-slate-500 hover:text-[#2563EB]'
            }`}
          >
            {isPlaying ? (
              <AudioWaveformBars isPlaying />
            ) : (
              <SpeakerHigh weight="fill" className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <div>
          <p className="font-brand font-black text-lg sm:text-xl text-[#1E293B] leading-snug">
            {item.nativeText}
          </p>
          <p className="font-mono text-xs font-semibold text-[#2563EB] mt-1">{item.phonetic}</p>
        </div>

        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{item.meaning}</p>
      </article>
    )
  }

  return (
    <section
      className="relative bg-white overflow-hidden"
      aria-label="Etalase ungkapan praktis lintas lima bahasa"
    >
      {/* Top Curved SVG Seam */}
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block w-full h-9 sm:h-16 text-[#F4F7FF] fill-current -mb-px"
      >
        <path d="M0,72 C360,0 1080,0 1440,72 L1440,72 L0,72 Z" />
      </svg>

      {/* Main Band */}
      <div className="bg-[#F4F7FF] py-10 sm:py-16 space-y-10">
        <div className="px-4 sm:px-6 text-center max-w-2xl mx-auto space-y-3">
          <ChatCircleDots
            weight="fill"
            className="w-9 h-9 mx-auto text-[#93C5FD]"
            aria-hidden="true"
          />
          <h2 className="text-3xl sm:text-[46px] font-brand font-black text-[#1E293B] leading-[1.12] tracking-tight">
            Dari sapaan pertama sampai percakapan kerja
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Ketuk kartu mana saja untuk mendengar langsung pengucapan aslinya lintas lima bahasa
            target.
          </p>
        </div>

        {/* Dual-Row Counter-Scrolling Marquee */}
        <div className="max-w-[1920px] mx-auto relative overflow-hidden space-y-5 landing-marquee-track py-2">
          <div
            aria-hidden="true"
            className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F4F7FF] to-transparent z-10"
          />
          <div
            aria-hidden="true"
            className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F4F7FF] to-transparent z-10"
          />

          {/* Row 1: Forward */}
          <div className="flex w-max items-stretch gap-4 sm:gap-5 animate-landing-marquee-forward">
            {[0, 1].map((copyIndex) =>
              ROW_1_ITEMS.map((item, itemIndex) => renderShowcaseCard(item, copyIndex, itemIndex))
            )}
          </div>

          {/* Row 2: Reverse */}
          <div className="flex w-max items-stretch gap-4 sm:gap-5 animate-landing-marquee-reverse">
            {[0, 1].map((copyIndex) =>
              ROW_2_ITEMS.map((item, itemIndex) => renderShowcaseCard(item, copyIndex, itemIndex))
            )}
          </div>
        </div>

        {/* Centered Pill CTA */}
        <div className="text-center pt-2 px-4">
          <Link
            to="/flashcards"
            className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3.5 text-sm sm:text-base font-brand font-black shadow-[0_4px_0_0_#1D4ED8] active:translate-y-0.5 active:shadow-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
          >
            <span>Jelajahi Semua Kartu Kosakata</span>
            <ArrowRight weight="bold" className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Bottom Curved SVG Seam */}
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block w-full h-9 sm:h-16 bg-white text-[#F4F7FF] fill-current -mt-px"
      >
        <path d="M0,0 C360,72 1080,72 1440,0 L1440,0 L0,0 Z" />
      </svg>
    </section>
  )
}
