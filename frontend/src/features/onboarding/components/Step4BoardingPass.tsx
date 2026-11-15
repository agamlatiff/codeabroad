import { CheckCircle2, Plane, Sparkles } from 'lucide-react'
import { Button3D } from '@/shared/components/ui/Button3D'
import {
  JapanFlagIllustration,
  SingaporeFlagIllustration,
  GermanyFlagIllustration,
} from './illustrations/FlagIllustrations'
import type {
  OnboardingLanguage,
  OnboardingProfileResponse,
} from '../types/onboarding'
import type {
  DailyGoalMinutes,
  InitialPlacementType,
} from '../store/onboardingStore'
import type { User } from '@/features/user/types/user'

interface Step4BoardingPassProps {
  completionResult: OnboardingProfileResponse | null
  user: User | null
  selectedLanguage: OnboardingLanguage | undefined
  dailyGoalMinutes: DailyGoalMinutes
  initialPlacementType: InitialPlacementType
  onContinue?: () => void
}

const LANGUAGE_AIRPORT_MAP: Record<string, { code: string; city: string }> = {
  ja: { code: 'HND', city: 'Tokyo' },
  de: { code: 'BER', city: 'Berlin' },
  'en-gb': { code: 'LHR', city: 'London' },
  'en-us': { code: 'SFO', city: 'San Francisco' },
  zh: { code: 'PEK', city: 'Beijing' },
  fr: { code: 'CDG', city: 'Paris' },
}

function getAirportInfo(languageCode?: string): { code: string; city: string } {
  if (!languageCode) return { code: 'HND', city: 'Tokyo' }
  const normalized = languageCode.toLowerCase()
  return LANGUAGE_AIRPORT_MAP[normalized] ?? { code: 'INTL', city: 'Global' }
}

interface MetricTileProps {
  label: string
  value: string
  sublabel?: string
}

function MetricTile({ label, value, sublabel }: MetricTileProps) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
      {sublabel && <p className="mt-0.5 text-xs text-slate-500">{sublabel}</p>}
    </div>
  )
}

export function Step4BoardingPass({
  completionResult,
  user,
  selectedLanguage,
  dailyGoalMinutes,
  initialPlacementType,
  onContinue,
}: Step4BoardingPassProps) {
  const languageCode =
    completionResult?.language_code || selectedLanguage?.code || 'ja'
  const languageName =
    completionResult?.language_name || selectedLanguage?.name || 'Bahasa Tujuan'
  const destination = getAirportInfo(languageCode)

  const assignedLevel =
    completionResult?.assigned_level_name ||
    completionResult?.assigned_level_code ||
    'Level Awal'
  const resolvedDailyGoal =
    completionResult?.daily_goal_minutes ?? dailyGoalMinutes
  const resolvedPlacementType =
    completionResult?.initial_placement_type ?? initialPlacementType

  const placementValue =
    resolvedPlacementType === 'placement_test' &&
    completionResult?.placement_score_percent != null
      ? `Skor ${Math.round(completionResult.placement_score_percent)}%`
      : 'Mulai dari Nol'

  const placementSublabel =
    resolvedPlacementType === 'placement_test'
      ? 'Placement Test'
      : 'Zero Beginner'

  const FlagIcon =
    languageCode.toLowerCase() === 'de'
      ? GermanyFlagIllustration
      : languageCode.toLowerCase().startsWith('en')
        ? SingaporeFlagIllustration
        : JapanFlagIllustration

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        {/* Boarding Pass Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-6 py-6 text-white sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                <FlagIcon className="h-6 w-6 rounded-sm" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300">
                  CodeAbroad Boarding Pass
                </p>
                <h3 className="text-lg font-bold tracking-tight">
                  {user?.name || user?.username || 'Language Explorer'}
                </h3>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>+50 XP</span>
            </div>
          </div>

          {/* Route Visualization */}
          <div className="mt-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-3xl font-black tracking-tight sm:text-4xl">CGK</p>
              <p className="mt-0.5 text-xs text-slate-300">Jakarta</p>
            </div>

            <div className="flex flex-1 items-center gap-2 px-2">
              <div className="h-px flex-1 border-t border-dashed border-slate-500/70" />
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/25 text-indigo-200 ring-1 ring-indigo-400/30">
                <Plane className="h-4 w-4" />
              </div>
              <div className="h-px flex-1 border-t border-dashed border-slate-500/70" />
            </div>

            <div className="text-right">
              <p className="text-3xl font-black tracking-tight sm:text-4xl">
                {destination.code}
              </p>
              <p className="mt-0.5 text-xs text-slate-300">{destination.city}</p>
            </div>
          </div>
        </div>

        {/* Perforation Divider */}
        <div className="relative flex items-center justify-between bg-white px-4 py-1">
          <div className="-ml-7 h-6 w-6 rounded-full border border-slate-200 bg-slate-50" />
          <div className="mx-2 flex-1 border-t-2 border-dashed border-slate-200" />
          <div className="-mr-7 h-6 w-6 rounded-full border border-slate-200 bg-slate-50" />
        </div>

        {/* Boarding Pass Body */}
        <div className="space-y-5 px-6 pb-7 pt-3 sm:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MetricTile label="Bahasa Tujuan" value={languageName} />
            <MetricTile label="Level Awal" value={assignedLevel} />
            <MetricTile
              label="Komitmen Harian"
              value={`${resolvedDailyGoal} Menit/Hari`}
            />
            <MetricTile
              label="Penempatan"
              value={placementValue}
              sublabel={placementSublabel}
            />
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>
              Rute belajar dan target harianmu sudah aktif. Siap mulai sesi pertamamu!
            </span>
          </div>

          {onContinue && (
            <Button3D
              type="button"
              onClick={onContinue}
              variant="blue"
              className="w-full py-3.5 text-base font-semibold"
            >
              Mulai Belajar di Kurikulum
            </Button3D>
          )}
        </div>
      </div>
    </div>
  )
}
