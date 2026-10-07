import type { Country, CareerPath, OnboardingProfileResponse, TargetTimeline, LanguageLevel } from '../../types/onboarding'
import type { User } from '../../types/auth'
import { Plane, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react'
import { DoodleHanko } from '../illustrations/doodles'
import { Button3D, MetricTile, BadgePill } from '../ui'
import doodleCelebrate from '../../assets/kodi/doodle-celebrate.png'
import {
  formatTechStack,
  formatExperienceLevelText,
  formatTimeline,
  formatLanguageLevel,
} from '../../utils/formatters'

interface Step4BoardingPassProps {
  completionResult: OnboardingProfileResponse | null
  user: User | null
  selectedCountry: Country | undefined
  selectedCareerPath: CareerPath | undefined
  selectedStackSlug: string
  selectedLevel: 'beginner' | 'intermediate'
  selectedTimeline: TargetTimeline
  selectedLanguageLevel: LanguageLevel
  onContinue?: () => void
  onBack?: () => void
}

// Fallback helper to prevent unicode question marks encoding bug
const getCountryFlag = (countryCode?: string, rawEmoji?: string): string => {
  if (rawEmoji && !rawEmoji.includes('?') && !rawEmoji.includes('\uFFFD')) {
    return rawEmoji
  }
  switch (countryCode?.toUpperCase()) {
    case 'JP': return '🇯🇵'
    case 'DE': return '🇩🇪'
    case 'SG': return '🇸🇬'
    case 'UK':
    case 'GB': return '🇬🇧'
    case 'US': return '🇺🇸'
    case 'AU': return '🇦🇺'
    case 'CA': return '🇨🇦'
    default: return '🇯🇵'
  }
}

// Map country code to main international tech hub airport
const getAirportInfo = (countryCode?: string) => {
  switch (countryCode?.toUpperCase()) {
    case 'JP': return { code: 'HND', city: 'Tokyo', country: 'Jepang' }
    case 'DE': return { code: 'BER', city: 'Berlin', country: 'Jerman' }
    case 'SG': return { code: 'SIN', city: 'Singapore', country: 'Singapura' }
    case 'UK':
    case 'GB': return { code: 'LHR', city: 'London', country: 'Inggris' }
    default: return { code: 'HND', city: 'Tokyo', country: 'Jepang' }
  }
}

export const Step4BoardingPass = ({
  completionResult,
  user,
  selectedCountry,
  selectedCareerPath,
  selectedStackSlug,
  selectedLevel,
  selectedTimeline,
  selectedLanguageLevel,
  onContinue,
  onBack,
}: Step4BoardingPassProps) => {
  const airport = getAirportInfo(selectedCountry?.code)
  const countryFlag = getCountryFlag(selectedCountry?.code, selectedCountry?.flag_emoji)
  const passengerName = (completionResult?.name || user?.name || user?.username || 'DEVELOPER').toUpperCase()

  return (
    <div className="max-w-xl w-full mx-auto flex flex-col items-center relative py-2 sm:py-4">
      {/* ── TOP HERO: KODI CELEBRATION STAGE (LIGHT THEME) ── */}
      <div className="relative z-10 flex flex-col items-center text-center mb-5 sm:mb-6">
        <div className="relative mb-2">
          {/* Subtle glow aura behind Kodi */}
          <div className="absolute inset-0 bg-blue-500/15 rounded-full blur-xl transform scale-110" />
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center relative z-10 drop-shadow-[0_8px_16px_rgba(37,99,235,0.2)]">
            <img
              src={doodleCelebrate}
              alt="Kodi Celebrate"
              className="w-full h-full object-contain select-none hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Celebratory Speech Pill */}
        <div className="mb-2">
          <BadgePill variant="blue" size="sm" icon={<Sparkles className="w-3.5 h-3.5 text-blue-500" />}>
            Yatta! Siap Lepas Landas
          </BadgePill>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Selamat, {passengerName}-san! 🎌
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-sm mt-1 leading-relaxed">
          Tiket dan paspor karier globalmu telah resmi diterbitkan. Kursimu menuju panggung internasional telah siap!
        </p>
      </div>

      {/* ── HERO ARTIFACT: PREMIUM LIGHT BOARDING PASS TICKET ── */}
      <div className="w-full bg-white border border-slate-200/90 hover:border-blue-300 rounded-3xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 relative z-10 text-left">
        
        {/* 1. TOP ROUTE & FLIGHT HEADER (ELECTRIC BLUE GRADIENT BANNER) */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-5 sm:p-6 text-white">
          {/* Micro Meta Bar */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/15 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white shadow-xs backdrop-blur-xs">
                <Plane className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono font-bold tracking-widest text-blue-100 text-[10px] uppercase">
                CODEABROAD AIRWAYS • 搭乗券
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-blue-200 font-bold">FLIGHT</span>
              <span className="px-2 py-0.5 rounded bg-white/15 text-white border border-white/20 font-mono font-bold text-[11px]">
                CA-2026
              </span>
            </div>
          </div>

          {/* Route Display: CGK ✈️ HND */}
          <div className="pt-4 flex items-center justify-between">
            {/* Origin */}
            <div className="text-left">
              <span className="text-[10px] font-mono text-blue-200 block font-bold tracking-wider">ORIGIN</span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">CGK</span>
              <span className="text-xs text-blue-100 block font-medium">Jakarta, ID</span>
            </div>

            {/* Flight Path Graphic */}
            <div className="flex-1 px-3 sm:px-4 flex flex-col items-center">
              <span className="text-[9px] font-mono text-blue-200 font-bold uppercase tracking-wider mb-1">
                NON-STOP • DEV CLASS
              </span>
              <div className="w-full max-w-[130px] flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-white/40" />
                <Plane className="w-4 h-4 text-white shrink-0 transform rotate-90" />
                <div className="flex-1 border-t-2 border-dashed border-white/40" />
                <div className="w-2 h-2 rounded-full bg-cyan-300 shrink-0" />
              </div>
              <span className="text-[10px] text-cyan-200 font-mono font-bold mt-1">
                SPONSOR TRACK
              </span>
            </div>

            {/* Destination */}
            <div className="text-right">
              <span className="text-[10px] font-mono text-blue-200 block font-bold tracking-wider">DESTINATION</span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
                {airport.code}
              </span>
              <span className="text-xs text-blue-100 block font-medium flex items-center justify-end gap-1">
                <span>{countryFlag}</span>
                <span>{airport.city}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. PERFORATED NOTCH DIVIDER (SEAMLESS WITH PAGE BACKGROUND #FAFAF9) */}
        <div className="relative flex items-center justify-between bg-white py-0.5">
          {/* Left Notch */}
          <div className="w-5 h-7 bg-[#FAFAF9] rounded-r-full border border-l-0 border-slate-200 -ml-[1px] z-10 shrink-0" />
          {/* Dashed Tear Line */}
          <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2" />
          {/* Right Notch */}
          <div className="w-5 h-7 bg-[#FAFAF9] rounded-l-full border border-r-0 border-slate-200 -mr-[1px] z-10 shrink-0" />
        </div>

        {/* 3. 2x2 METRIC GRID (LIGHT SURFACE TACTILE TILES) */}
        <div className="p-5 sm:p-6 bg-white">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <MetricTile
              label="JALUR KARIER"
              value={selectedCareerPath?.label || 'Backend Engineer'}
              surface="light"
              variant="default"
            />
            <MetricTile
              label="CORE STACK"
              value={formatTechStack(selectedStackSlug, { withEmoji: true })}
              surface="light"
              variant="blue"
            />
            <MetricTile
              label="STARTING LEVEL"
              value={formatExperienceLevelText(selectedLevel)}
              surface="light"
              variant="default"
            />
            <MetricTile
              label="TARGET WAKTU"
              value={formatTimeline(selectedTimeline)}
              surface="light"
              variant="blue"
              subtitle={formatLanguageLevel(selectedLanguageLevel)}
            />
          </div>
        </div>

        {/* 4. TICKET STUB FOOTER (BARCODE & OFFICIAL STAMP) */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Official Hanko Stamp with Physical Impact Animation */}
            <div className="shrink-0 animate-stamp-slam">
              <DoodleHanko text="合格" className="w-11 h-11" />
            </div>

            <div className="space-y-1">
              <div className="font-mono text-[9px] tracking-[0.22em] text-slate-400 font-bold select-none">
                ||||| | |||| ||| |||||| | |||||
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>PASPOR RESMI TERVERIFIKASI</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <BadgePill variant="xp" icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}>
              +50 XP
            </BadgePill>
          </div>
        </div>

      </div>

      {/* ── DUOLINGO-STYLE TACTILE 3D BUTTON (ELECTRIC BLUE) & SECONDARY BACK ── */}
      <div className="w-full mt-6 relative z-10 flex flex-col items-center gap-2.5">
        {onContinue && (
          <Button3D
            variant="blue"
            size="lg"
            fullWidth
            onClick={onContinue}
            icon={<ArrowRight className="w-5 h-5 ml-1" />}
          >
            Masuk ke Dashboard Sekarang
          </Button3D>
        )}

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5 font-bold py-1 select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Ubah Preferensi &amp; Pilihan Jalur</span>
          </button>
        )}

        <span className="text-[11px] text-slate-400 font-medium mt-1">
          Kodi siap mendampingimu menggapai offer kerja impian 🎌
        </span>
      </div>
    </div>
  )
}
