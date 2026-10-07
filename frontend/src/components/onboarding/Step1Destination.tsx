import React from 'react'
import type { Country } from '../../types/onboarding'
import { Lock } from 'lucide-react'
import {
  JapanFlagIllustration,
  SingaporeFlagIllustration,
  GermanyFlagIllustration,
} from '../illustrations/onboarding'
import { COUNTRY_DESCRIPTIONS } from '../../static/onboarding'
import { BadgePill } from '../ui'
import { triggerHaptic } from '../../utils/haptics'

// Static flag component lookup map placed outside to avoid re-allocations on render
const FLAG_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  JP: JapanFlagIllustration,
  SG: SingaporeFlagIllustration,
  DE: GermanyFlagIllustration,
}

interface Step1DestinationProps {
  countries: Country[]
  selectedCountryId: string
  onSelectCountry: (countryId: string) => void
}

export const Step1Destination = ({
  countries,
  selectedCountryId,
  onSelectCountry,
}: Step1DestinationProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-7 max-w-5xl w-full justify-items-center">
      {countries.map((country) => {
        const isSelected = selectedCountryId === country.id
        const isActive = country.is_active
        const FlagIllustration = FLAG_MAP[country.code?.toUpperCase()] || JapanFlagIllustration

        return (
          <div
            key={country.id}
            role="button"
            tabIndex={isActive ? 0 : -1}
            aria-disabled={!isActive}
            aria-pressed={isSelected}
            onClick={() => {
              if (isActive) {
                triggerHaptic('tap')
                onSelectCountry(country.id)
              }
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && isActive) {
                e.preventDefault()
                triggerHaptic('tap')
                onSelectCountry(country.id)
              }
            }}
            className={`rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200 max-w-[340px] sm:max-w-[350px] w-full relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 ${
              isActive
                ? isSelected
                  ? 'bg-blue-50/60 border-2 border-blue-600 shadow-md shadow-blue-500/15 ring-4 ring-blue-500/10 cursor-pointer -translate-y-1'
                  : 'bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-sm cursor-pointer hover:-translate-y-0.5'
                : 'bg-slate-50/70 border border-dashed border-slate-300/80 opacity-60 cursor-not-allowed select-none'
            }`}
          >
            {/* Top Flag Frame */}
            <div
              className={`w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative ${
                isActive ? 'bg-[#F8FAFC]' : 'bg-slate-100/70'
              }`}
            >
              <FlagIllustration />

              {/* Status Badge */}
              <div className="absolute top-2.5 right-2.5">
                <BadgePill
                  variant={isActive ? (isSelected ? 'blue' : 'neutral') : 'neutral'}
                  size="sm"
                  className={!isActive ? 'opacity-80' : ''}
                >
                  {!isActive && <Lock className="w-2.5 h-2.5 stroke-[2.5]" />}
                  {isActive ? 'Jalur Aktif' : 'Coming Soon'}
                </BadgePill>
              </div>
            </div>

            {/* Title & Description */}
            <h2 className={`text-lg sm:text-xl font-bold mb-1.5 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
              {country.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              {COUNTRY_DESCRIPTIONS[country.code?.toUpperCase()] ||
                'Peluang karier global bagi software engineer Indonesia.'}
            </p>
          </div>
        )
      })}
    </div>
  )
}
