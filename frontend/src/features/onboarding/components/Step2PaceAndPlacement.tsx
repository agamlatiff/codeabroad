import { Clock, Lightning, Compass, CheckCircle } from '@phosphor-icons/react'
import type { DailyGoalMinutes, InitialPlacementType } from '@/features/onboarding/store/onboardingStore'
import { BadgePill } from './BadgePill'
import { triggerHaptic } from '@/shared/utils/haptics'

const DAILY_GOAL_OPTIONS: Array<{
  minutes: DailyGoalMinutes
  title: string
  subtitle: string
  badge?: string
}> = [
  { minutes: 5, title: '5 Menit / Hari', subtitle: 'Santai & konsisten setiap hari' },
  { minutes: 15, title: '15 Menit / Hari', subtitle: 'Ritme ideal anti-burnout', badge: 'Rekomendasi' },
  { minutes: 30, title: '30 Menit / Hari', subtitle: 'Progres cepat menuju target sertifikasi' },
  { minutes: 45, title: '45 Menit / Hari', subtitle: 'Akselerasi intensif' },
]

const PLACEMENT_OPTIONS: Array<{
  type: InitialPlacementType
  title: string
  badge: string
  description: string
  icon: typeof Compass
}> = [
  {
    type: 'zero_beginner',
    title: 'Mulai dari Nol',
    badge: 'Pemula',
    description: 'Langsung mulai dari Unit 1 Lesson 1 untuk pengenalan aksara dan kalimat dasar.',
    icon: Compass,
  },
  {
    type: 'placement_test',
    title: 'Tes Penempatan Singkat',
    badge: 'Sudah Punya Dasar',
    description: 'Kerjakan soal diagnostik singkat. Jika skor ≥ 80%, materi awal otomatis dilewati!',
    icon: Lightning,
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
                className={`rounded-2xl p-4 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-blue-50/80 border-2 border-[#2563EB] shadow-sm'
                    : 'bg-white border border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-extrabold text-slate-900">{opt.title}</span>
                  {isSelected && <CheckCircle weight="fill" className="w-4 h-4 text-[#2563EB] shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{opt.subtitle}</p>
                {opt.badge && (
                  <div className="pt-0.5">
                    <BadgePill variant="blue" size="sm">
                      {opt.badge}
                    </BadgePill>
                  </div>
                )}
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
            const Icon = opt.icon
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
                className={`rounded-3xl p-5 text-left transition-all cursor-pointer flex items-start gap-4 ${
                  isSelected
                    ? 'bg-blue-50/80 border-2 border-[#2563EB] shadow-md'
                    : 'bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon weight="bold" className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-extrabold text-slate-900">{opt.title}</h3>
                    <BadgePill variant={isSelected ? 'blue' : 'neutral'} size="sm">
                      {opt.badge}
                    </BadgePill>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{opt.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
