import { Clock, Lightning, CheckCircle } from '@phosphor-icons/react'
import type { DailyGoalMinutes, InitialPlacementType } from '@/features/onboarding/store/onboardingStore'
import { BadgePill } from './BadgePill'
import {
  DailyPaceIllustration,
  PlacementPathIllustration,
} from './illustrations/PaceAndPlacementIllustrations'
import { triggerHaptic } from '@/shared/utils/haptics'

const DAILY_GOAL_OPTIONS: Array<{
  minutes: DailyGoalMinutes
  title: string
  subtitle: string
  paceEstimate: string
  intensityBars: number
  badge?: string
}> = [
  {
    minutes: 5,
    title: '5 Menit / Hari',
    subtitle: 'Santai & konsisten setiap hari',
    paceEstimate: '~1 materi/hari',
    intensityBars: 1,
  },
  {
    minutes: 15,
    title: '15 Menit / Hari',
    subtitle: 'Ritme ideal anti-burnout',
    paceEstimate: '~2 materi/hari',
    intensityBars: 2,
    badge: 'Rekomendasi',
  },
  {
    minutes: 30,
    title: '30 Menit / Hari',
    subtitle: 'Progres cepat menuju sertifikasi',
    paceEstimate: '~3-4 materi/hari',
    intensityBars: 3,
  },
  {
    minutes: 45,
    title: '45 Menit / Hari',
    subtitle: 'Akselerasi intensif',
    paceEstimate: '~5+ materi/hari',
    intensityBars: 4,
  },
]

const PLACEMENT_OPTIONS: Array<{
  type: InitialPlacementType
  title: string
  badge: string
  description: string
  highlight: string
}> = [
  {
    type: 'zero_beginner',
    title: 'Mulai dari Nol',
    badge: 'Pemula',
    description: 'Langsung mulai dari Unit 1 Lesson 1 untuk pengenalan aksara dan kalimat dasar.',
    highlight: 'Rute bertahap • Langsung masuk kurikulum',
  },
  {
    type: 'placement_test',
    title: 'Tes Penempatan Singkat',
    badge: 'Sudah Punya Dasar',
    description: 'Kerjakan soal diagnostik singkat. Jika skor ≥ 80%, materi awal otomatis dilewati!',
    highlight: 'Soal diagnostik • ~2 menit',
  },
]

interface Step2PaceAndPlacementProps {
  dailyGoalMinutes: DailyGoalMinutes
  onSelectDailyGoal: (minutes: DailyGoalMinutes) => void
  initialPlacementType: InitialPlacementType
  onSelectPlacementType: (type: InitialPlacementType) => void
}

export const Step2PaceAndPlacement = ({
  dailyGoalMinutes,
  onSelectDailyGoal,
  initialPlacementType,
  onSelectPlacementType,
}: Step2PaceAndPlacementProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 1. Komitmen Belajar Harian */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
          <Clock weight="bold" className="w-4 h-4 text-[#2563EB]" />
          <span>1. Komitmen Belajar Harian</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DAILY_GOAL_OPTIONS.map((opt) => {
            const isSelected = dailyGoalMinutes === opt.minutes
            return (
              <button
                key={opt.minutes}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  triggerHaptic('tap')
                  onSelectDailyGoal(opt.minutes)
                }}
                className={`rounded-2xl p-4 text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-blue-50/80 border-2 border-[#2563EB] shadow-sm -translate-y-0.5'
                    : 'bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <DailyPaceIllustration minutes={opt.minutes} active={isSelected} />
                  <div className="flex items-center gap-1">
                    {opt.badge && (
                      <BadgePill variant="blue" size="sm">
                        {opt.badge}
                      </BadgePill>
                    )}
                    {isSelected && (
                      <CheckCircle weight="fill" className="w-4 h-4 text-[#2563EB] shrink-0" />
                    )}
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-extrabold text-slate-900">{opt.title}</span>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{opt.subtitle}</p>
                </div>

                <div className="space-y-1 pt-0.5">
                  <div className="flex gap-1" aria-hidden="true">
                    {[1, 2, 3, 4].map((bar) => (
                      <span
                        key={bar}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          bar <= opt.intensityBars
                            ? isSelected
                              ? 'bg-[#2563EB]'
                              : 'bg-slate-400'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="block text-[11px] font-semibold text-slate-500">
                    {opt.paceEstimate}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* 2. Jalur Penempatan Awal */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
          <Lightning weight="bold" className="w-4 h-4 text-[#2563EB]" />
          <span>2. Jalur Penempatan Awal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLACEMENT_OPTIONS.map((opt) => {
            const isSelected = initialPlacementType === opt.type
            return (
              <button
                key={opt.type}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  triggerHaptic('tap')
                  onSelectPlacementType(opt.type)
                }}
                className={`rounded-3xl p-4 sm:p-5 text-left transition-all cursor-pointer flex flex-col gap-3.5 ${
                  isSelected
                    ? 'bg-blue-50/80 border-2 border-[#2563EB] shadow-md -translate-y-0.5'
                    : 'bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <PlacementPathIllustration type={opt.type} active={isSelected} />
                  <div className="flex items-center gap-1">
                    <BadgePill variant={isSelected ? 'blue' : 'neutral'} size="sm">
                      {opt.badge}
                    </BadgePill>
                    {isSelected && (
                      <CheckCircle weight="fill" className="w-4 h-4 text-[#2563EB] shrink-0" />
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 mb-1">{opt.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{opt.description}</p>
                  </div>

                  <span
                    className={`text-[11px] font-semibold ${
                      isSelected ? 'text-[#2563EB]' : 'text-slate-400'
                    }`}
                  >
                    {opt.highlight}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
