import React from 'react'
import { LockSimple } from '@phosphor-icons/react'
import type { OnboardingLanguage } from '@/features/onboarding/types/onboarding'
import {
  JapanFlagIllustration,
  SingaporeFlagIllustration,
  GermanyFlagIllustration,
} from './illustrations/FlagIllustrations'
import { BadgePill } from './BadgePill'
import { triggerHaptic } from '@/shared/utils/haptics'

const FLAG_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ja: JapanFlagIllustration,
  de: GermanyFlagIllustration,
  en: SingaporeFlagIllustration,
  'en-gb': SingaporeFlagIllustration,
  'en-us': SingaporeFlagIllustration,
}

const LANGUAGE_META: Record<string, { countryLabel: string; description: string; examLabel: string }> = {
  ja: {
    countryLabel: 'Jepang • JLPT N5 – N1',
    description: 'Kuasai Kanji, Hiragana, Katakana & percakapan kerja profesional di Tokyo.',
    examLabel: 'Populer 🇯🇵',
  },
  de: {
    countryLabel: 'Jerman • Goethe A1 – C1',
    description: 'Persiapan bahasa Jerman standar industri Eropa untuk studi & karier.',
    examLabel: 'Segera Hadir',
  },
  en: {
    countryLabel: 'Inggris • IELTS / TOEFL',
    description: 'Bahasa komunikasi global & interview internasional di tech hub dunia.',
    examLabel: 'Segera Hadir',
  },
  zh: {
    countryLabel: 'Mandarin • HSK 1 – 6',
    description: 'Penguasaan Hanzi & Pinyin untuk ekosistem bisnis dan teknologi Asia.',
    examLabel: 'Segera Hadir',
  },
  fr: {
    countryLabel: 'Prancis • DELF A1 – C1',
    description: 'Komunikasi profesional dan akademik berbahasa Prancis.',
    examLabel: 'Segera Hadir',
  },
}

interface Step1LanguagePickerProps {
  languages: OnboardingLanguage[]
  selectedLanguageId: string
  onSelectLanguage: (languageId: string) => void
}

export const Step1LanguagePicker = ({
  languages,
  selectedLanguageId,
  onSelectLanguage,
}: Step1LanguagePickerProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-5xl w-full justify-items-center">
      {languages.map((lang) => {
        const code = lang.code?.toLowerCase() || 'ja'
        const isSelected = selectedLanguageId === lang.id
        const isActive = lang.is_active
        const FlagIllustration = FLAG_MAP[code] || JapanFlagIllustration
        const meta = LANGUAGE_META[code] ?? {
          countryLabel: lang.name,
          description: 'Pelajari bahasa ini secara terstruktur dari nol hingga mahir.',
          examLabel: isActive ? 'Tersedia' : 'Segera Hadir',
        }

        return (
          <div
            key={lang.id}
            role="button"
            tabIndex={isActive ? 0 : -1}
            aria-disabled={!isActive}
            aria-pressed={isSelected}
            onClick={() => {
              if (isActive) {
                triggerHaptic('tap')
                onSelectLanguage(lang.id)
              }
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && isActive) {
                e.preventDefault()
                triggerHaptic('tap')
                onSelectLanguage(lang.id)
              }
            }}
            className={`rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200 max-w-[340px] w-full relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 ${
              isActive
                ? isSelected
                  ? 'bg-blue-50/70 border-2 border-[#2563EB] shadow-md -translate-y-0.5 cursor-pointer'
                  : 'bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                : 'bg-slate-50/80 border border-slate-200/70 opacity-65 cursor-not-allowed'
            }`}
          >
            <div className="mb-3">
              {isActive ? (
                <BadgePill variant={isSelected ? 'blue' : 'neutral'} size="sm">
                  {meta.examLabel}
                </BadgePill>
              ) : (
                <BadgePill variant="neutral" size="sm" icon={<LockSimple weight="bold" className="w-3 h-3" />}>
                  Segera Hadir
                </BadgePill>
              )}
            </div>

            <div className="w-24 h-20 mb-4 flex items-center justify-center">
              <FlagIllustration className="w-full h-full object-contain drop-shadow-xs" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900">{lang.name}</h3>
            <p className="text-xs font-bold text-[#2563EB] mt-0.5">{meta.countryLabel}</p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{meta.description}</p>
          </div>
        )
      })}
    </div>
  )
}
