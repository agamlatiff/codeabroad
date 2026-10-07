import type { Country, CareerPath, OnboardingProfileResponse, TargetTimeline, LanguageLevel } from '../../types/onboarding'
import type { User } from '../../types/auth'
import { ArrowRight, Plane, ShieldCheck, Sparkles } from 'lucide-react'
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
}: Step4BoardingPassProps) => {
  return (
    <div className="max-w-md w-full mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden text-left relative">
        {/* Ticket Top Banner */}
        <div className="bg-gradient-to-r from-[#4F46E5] via-[#4338CA] to-[#312E81] px-6 py-4.5 text-white flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">
              Official Boarding Pass
            </span>
            <h3 className="text-base font-black tracking-tight mt-0.5">
              CodeAbroad Global Journey
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <Plane className="w-4.5 h-4.5 text-white" />
          </div>
        </div>

        {/* Ticket Body Details */}
        <div className="p-5 sm:p-6 space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <span className="text-slate-500">Nama Rekayasa</span>
            <span className="font-bold text-slate-800">
              {completionResult?.name || user?.name || user?.username}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <span className="text-slate-500">Rute Destinasi</span>
            <span className="font-bold text-[#4F46E5] flex items-center gap-1.5">
              Jakarta (CGK) <ArrowRight className="w-3.5 h-3.5" /> {selectedCountry?.name || 'Japan'}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <span className="text-slate-500">Spesialisasi</span>
            <span className="font-bold text-slate-800">
              {selectedCareerPath?.label || 'Backend Engineer'}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <span className="text-slate-500">Teknologi Utama</span>
            <span className="font-bold text-[#4F46E5]">
              {formatTechStack(selectedStackSlug)}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <span className="text-slate-500">Tingkat Awal</span>
            <span className="font-bold text-slate-800">
              {formatExperienceLevelText(selectedLevel)}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <span className="text-slate-500">Target Waktu</span>
            <span className="font-bold text-slate-800">
              {formatTimeline(selectedTimeline)}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <span className="text-slate-500">Bahasa Kerja</span>
            <span className="font-bold text-slate-800">
              {formatLanguageLevel(selectedLanguageLevel)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-[#4F46E5] font-medium text-xs">
              <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
              <span>Paspor aktif &amp; kurikulum siap diakses</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-500" />
              +50 XP
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
