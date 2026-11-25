import { LockSimple } from '@phosphor-icons/react'
import type { OnboardingLanguage } from '@/features/onboarding/types/onboarding'
import { getLanguageCatalogMeta } from '@/shared/constants/languageCatalog'
import { LanguageFlagIllustration } from './illustrations/FlagIllustrations'
import { BadgePill } from './BadgePill'
import { triggerHaptic } from '@/shared/utils/haptics'

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
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 max-w-5xl w-full min-w-0">
      {languages.map((lang) => {
        const code = lang.code?.toLowerCase() || 'ja'
        const isSelected = selectedLanguageId === lang.id
        const isActive = lang.is_active
        const meta = getLanguageCatalogMeta(code, lang.name)
        const examLabel = isActive ? meta.badgeLabel : 'Segera Hadir'

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
            className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 flex flex-col items-center text-center transition-all duration-200 w-full min-w-0 relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 border-2 ${
              isActive
                ? isSelected
                  ? 'bg-blue-50/70 border-[#2563EB] shadow-md -translate-y-0.5 cursor-pointer'
                  : 'bg-white border-slate-200/90 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                : 'bg-slate-50/80 border-slate-200/70 opacity-65 cursor-not-allowed'
            }`}
          >
            <div className="mb-2 sm:mb-3 max-w-full">
              {isActive ? (
                <BadgePill variant={isSelected ? 'blue' : 'neutral'} size="sm">
                  {examLabel}
                </BadgePill>
              ) : (
                <BadgePill variant="neutral" size="sm" icon={<LockSimple weight="bold" className="w-3 h-3" />}>
                  Segera Hadir
                </BadgePill>
              )}
            </div>

            <div className="w-14 h-10 sm:w-24 sm:h-20 mb-2.5 sm:mb-4 flex items-center justify-center shrink-0">
              <LanguageFlagIllustration code={code} className="w-full h-full object-contain drop-shadow-xs" />
            </div>

            <h3 className="text-sm sm:text-lg font-brand font-black text-slate-900 leading-snug break-words">{lang.name}</h3>
            <p className="text-[11px] sm:text-xs font-bold text-[#2563EB] mt-0.5 leading-snug break-words">{meta.countryLabel}</p>
            <p className="hidden sm:block text-xs text-slate-500 mt-2 leading-relaxed">{meta.description}</p>
          </div>
        )
      })}
    </div>
  )
}
