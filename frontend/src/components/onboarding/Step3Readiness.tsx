import type { Country, TargetTimeline, LanguageLevel } from '../../types/onboarding'
import { Check } from 'lucide-react'
import {
  BeginnerIllustration,
  ExperiencedIllustration,
  FlightRoadmapGraphic,
  SprintPaceIllustration,
  IdealPaceIllustration,
  RelaxedPaceIllustration,
  LanguageZeroIllustration,
  LanguageBasicIllustration,
  LanguageFluentIllustration,
  LanguageBusinessIllustration,
} from '../illustrations/onboarding'
import {
  LEVEL_OPTIONS,
  TIMELINE_OPTIONS,
  LANGUAGE_OPTIONS,
} from '../../static/onboarding'
import { getTargetLandingDate } from '../../utils/date'

export type Step3SubStep = 'level' | 'readiness'

const TIMELINE_ILLUSTRATIONS: Record<TargetTimeline, React.ComponentType<{ className?: string }>> = {
  '6_months': SprintPaceIllustration,
  '1_year': IdealPaceIllustration,
  exploring: RelaxedPaceIllustration,
}

const LANGUAGE_ILLUSTRATIONS: Record<LanguageLevel, React.ComponentType<{ className?: string }>> = {
  none: LanguageZeroIllustration,
  basic: LanguageBasicIllustration,
  conversational: LanguageFluentIllustration,
  fluent: LanguageBusinessIllustration,
}

interface Step3ReadinessProps {
  step3SubStep: Step3SubStep
  selectedLevel: 'beginner' | 'intermediate'
  onSelectLevel: (level: 'beginner' | 'intermediate') => void
  selectedCountry: Country | undefined
  selectedTimeline: TargetTimeline
  onSelectTimeline: (timeline: TargetTimeline) => void
  selectedLanguageLevel: LanguageLevel
  onSelectLanguageLevel: (level: LanguageLevel) => void
  isLanding: boolean
}

export const Step3Readiness = ({
  step3SubStep,
  selectedLevel,
  onSelectLevel,
  selectedCountry,
  selectedTimeline,
  onSelectTimeline,
  selectedLanguageLevel,
  onSelectLanguageLevel,
  isLanding,
}: Step3ReadinessProps) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* ── SUB-STEP 3A: CODING EXPERIENCE LEVEL (2 HERO CARDS) ── */}
      {step3SubStep === 'level' && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 justify-items-center">
          {(['beginner', 'intermediate'] as const).map((lvlKey) => {
            const config = LEVEL_OPTIONS[lvlKey]
            const isSelected = selectedLevel === lvlKey
            const LevelIllustration = lvlKey === 'beginner' ? BeginnerIllustration : ExperiencedIllustration

            return (
              <div
                key={lvlKey}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => onSelectLevel(lvlKey)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectLevel(lvlKey)
                  }
                }}
                className={`cursor-pointer rounded-3xl p-6 sm:p-7 flex flex-col text-center transition-all duration-200 max-w-[390px] w-full relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
                  isSelected
                    ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10'
                    : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="w-full h-40 sm:h-44 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mb-4 overflow-hidden relative">
                  <LevelIllustration />
                  <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badgeColor}`}>
                    {config.badge}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                  {config.title}
                </h2>
                <p className={`text-xs font-semibold mb-2 ${lvlKey === 'beginner' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                  {config.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-4">
                  {config.description}
                </p>

                {/* Sub-track preview chips */}
                <div className="mt-auto pt-3 border-t border-slate-100/90 flex flex-wrap gap-1.5 justify-center">
                  {config.chips.map((chip) => (
                    <span key={chip} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-3 text-xs font-semibold">
                  {isSelected ? (
                    <span className="text-[#4F46E5] flex items-center justify-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5" /> Pilihan Terpilih
                    </span>
                  ) : (
                    <span className="text-slate-400">Klik untuk memilih</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── SUB-STEP 3B: GRAND PANORAMIC JOURNEY THEATER ── */}
      {step3SubStep === 'readiness' && (
        <div className="w-full max-w-4xl flex flex-col items-center">
          {/* Grand Panoramic Canvas Card */}
          <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm text-left relative overflow-hidden">
            {/* Header route ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3 mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                  Rute Persiapan Karier Internasional
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Jakarta (CGK) → {selectedCountry?.name || 'Tokyo'} ({selectedCountry?.code === 'DE' ? 'BER' : selectedCountry?.code === 'SG' ? 'SIN' : 'NRT'})
                </h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold self-start sm:self-auto shadow-2xs">
                <span>
                  {isLanding
                    ? `Pesawat Mendarat di ${selectedCountry?.code === 'DE' ? 'Berlin' : selectedCountry?.code === 'SG' ? 'Changi' : 'Narita'}...`
                    : selectedTimeline === '6_months'
                    ? `Target Landing: ${getTargetLandingDate(6)} (Sprint 6 Bulan)`
                    : selectedTimeline === '1_year'
                    ? `Target Landing: ${getTargetLandingDate(12)} (Ideal 1 Tahun)`
                    : 'Target Landing: Fleksibel (Self-Paced)'}
                </span>
              </div>
            </div>

            {/* SVG Visual Scenic Trajectory Map */}
            <div className="w-full py-1">
              <FlightRoadmapGraphic
                countryCode={selectedCountry?.code}
                isLanding={isLanding}
              />
            </div>

            {/* Clean Studio Two-Column Layout */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {/* Column 1: Learning Pace Target */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    Target Ritme Belajar
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/80">
                    {selectedTimeline === '6_months' ? 'Sprint 6 Bulan' : selectedTimeline === '1_year' ? 'Ideal 1 Tahun' : 'Santai & Fleksibel'}
                  </span>
                </div>

                {/* 3 Landscape Interactive Cards */}
                <div className="space-y-2.5">
                  {TIMELINE_OPTIONS.map((item) => {
                    const isSelected = selectedTimeline === item.id
                    const PaceIllustration = TIMELINE_ILLUSTRATIONS[item.id]

                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onClick={() => onSelectTimeline(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onSelectTimeline(item.id)
                          }
                        }}
                        className={`p-2.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
                          isSelected
                            ? 'bg-indigo-50/70 border-2 border-[#4F46E5] ring-2 ring-indigo-500/10 shadow-xs'
                            : 'bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-2xs'
                        }`}
                      >
                        <div className="w-16 h-13 sm:w-18 sm:h-14 rounded-xl bg-gradient-to-b from-slate-50 to-indigo-50/30 flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden p-1">
                          <PaceIllustration />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5 mb-0.5">
                            <span className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                              {item.title}
                            </span>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full border shrink-0 ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-tight">
                            {item.description}
                          </p>
                        </div>
                        <div className="shrink-0 pl-1">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-2xs'
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Column 2: Language Readiness Target */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    Kesiapan Bahasa {selectedCountry?.code === 'JP' ? 'Jepang' : 'Kerja'}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/80">
                    {selectedLanguageLevel === 'none'
                      ? 'Mulai dari Nol'
                      : selectedLanguageLevel === 'basic'
                      ? 'Percakapan Dasar'
                      : selectedLanguageLevel === 'conversational'
                      ? 'Siap Interview (N3)'
                      : 'Mahir & Bisnis (N2/N1)'}
                  </span>
                </div>

                {/* 4 Landscape Interactive Cards */}
                <div className="space-y-2.5">
                  {LANGUAGE_OPTIONS.map((item) => {
                    const isSelected = selectedLanguageLevel === item.id
                    const LangIllustration = LANGUAGE_ILLUSTRATIONS[item.id]

                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onClick={() => onSelectLanguageLevel(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onSelectLanguageLevel(item.id)
                          }
                        }}
                        className={`p-2.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
                          isSelected
                            ? 'bg-indigo-50/70 border-2 border-[#4F46E5] ring-2 ring-indigo-500/10 shadow-xs'
                            : 'bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-2xs'
                        }`}
                      >
                        <div className="w-16 h-13 sm:w-18 sm:h-14 rounded-xl bg-gradient-to-b from-slate-50 to-indigo-50/30 flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden p-1">
                          <LangIllustration />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5 mb-0.5">
                            <span className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                              {item.title}
                            </span>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full border shrink-0 ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-tight">
                            {item.description}
                          </p>
                        </div>
                        <div className="shrink-0 pl-1">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-2xs'
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
