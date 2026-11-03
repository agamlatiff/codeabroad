import {
  LockSimple,
  CaretDown,
  Sparkle,
  BookOpen,
  CaretUp,
  CheckFat,
  Trophy,
} from '@phosphor-icons/react'
import { RoadmapPartItem } from './RoadmapPartItem'
import type { SequentialCurriculumUnit } from '../../data/curriculumData'

export interface RoadmapUnitCardProps {
  unit: SequentialCurriculumUnit
  isCollapsed: boolean
  onToggleCollapse: () => void
  onOpenGuidebook: () => void
  onLockedClick: (title: string) => void
  onStartQuest: (route: string) => void
}

export const RoadmapUnitCard = ({
  unit,
  isCollapsed,
  onToggleCollapse,
  onOpenGuidebook,
  onLockedClick,
  onStartQuest,
}: RoadmapUnitCardProps) => {
  const isUnitCompleted = unit.isCompleted
  const isUnitActive = unit.isActive
  const unitPercent = unit.progressPercent ?? 0
  const completedCount = unit.completedCount ?? 0
  const theme = unit.theme || {
    gradientBg: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800',
    border3D: 'border-b-[5px] border-blue-900',
    tagBg: 'bg-blue-500/30 border border-blue-300/30 text-white',
    tagText: 'text-white',
    accentGlow: 'from-blue-500/20',
    btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white',
  }

  return (
    <div
      className={`bg-white rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-2xs ${
        isUnitCompleted
          ? 'border-emerald-300 ring-4 ring-emerald-500/10'
          : isUnitActive
            ? 'border-blue-500 ring-4 ring-blue-500/15'
            : 'border-slate-200/90'
      }`}
    >
      {/* ── DUOLINGO 3D UNIT BANNER HEADER ── */}
      <div
        className={`p-4 sm:p-6 transition-all ${
          isUnitCompleted
            ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white border-b-[5px] border-emerald-900'
            : isUnitActive
              ? `${theme.gradientBg} text-white ${theme.border3D}`
              : 'bg-slate-100 text-slate-800 border-b-[4px] border-slate-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-mono font-bold text-[10px] px-2.5 py-1 rounded-lg ${
                  isUnitCompleted
                    ? 'bg-emerald-500/30 border border-emerald-300/30 text-white'
                    : isUnitActive
                      ? theme.tagBg
                      : 'bg-slate-200 border border-slate-300 text-slate-700'
                }`}
              >
                {unit.tag}
              </span>

              {isUnitCompleted ? (
                <span className="bg-white/20 text-white font-brand font-black text-[10px] px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-white/25">
                  <CheckFat weight="fill" className="w-3 h-3 text-emerald-200" />
                  <span>LULUS SEMUA SESI</span>
                </span>
              ) : isUnitActive ? (
                <span className="bg-white/20 text-white font-brand font-black text-[10px] px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-white/25">
                  <Sparkle weight="fill" className="w-3 h-3 text-amber-300" />
                  <span>SEDANG AKTIF</span>
                </span>
              ) : (
                <span className="bg-slate-200/90 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 border border-slate-300">
                  <LockSimple weight="bold" className="w-3 h-3" />
                  <span>TERKUNCI</span>
                </span>
              )}
            </div>

            <h3
              className={`font-brand font-black text-lg sm:text-xl tracking-tight leading-snug ${
                isUnitCompleted || isUnitActive ? 'text-white' : 'text-slate-900'
              }`}
            >
              {unit.title}
            </h3>
            <p
              className={`text-xs leading-relaxed max-w-2xl font-medium ${
                isUnitCompleted || isUnitActive ? 'text-white/80' : 'text-slate-600'
              }`}
            >
              {unit.description}
            </p>
          </div>

          {/* Action Buttons Row: Guidebook & Collapse toggle */}
          <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0">
            <button
              type="button"
              onClick={onOpenGuidebook}
              className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-brand font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-2xs ${
                isUnitCompleted || isUnitActive
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 active:translate-y-0.5'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 active:translate-y-0.5'
              }`}
              title="Buka ringkasan teori, sintaks kode, dan kosakata unit"
            >
              <BookOpen weight="bold" className="w-4 h-4 shrink-0" />
              <span>Buku Panduan Unit</span>
            </button>

            <button
              type="button"
              onClick={onToggleCollapse}
              className={`p-2 rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-2xs ${
                isUnitCompleted || isUnitActive
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 active:scale-95'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 active:scale-95'
              }`}
              title={isCollapsed ? 'Buka Sesi Unit' : 'Lipat Sesi Unit'}
            >
              {isCollapsed ? (
                <CaretDown weight="bold" className="w-4 h-4" />
              ) : (
                <CaretUp weight="bold" className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 3D Segmented Progress Bar */}
        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <div
              className={`h-2.5 sm:h-3 rounded-full overflow-hidden p-0.5 border ${
                isUnitCompleted || isUnitActive
                  ? 'bg-black/25 border-white/20'
                  : 'bg-slate-200 border-slate-300'
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-500 shadow-xs ${
                  isUnitCompleted
                    ? 'bg-emerald-300'
                    : isUnitActive
                      ? 'bg-white'
                      : 'bg-slate-400'
                }`}
                style={{ width: `${unitPercent}%` }}
              />
            </div>
          </div>
          <span
            className={`text-xs font-brand font-black shrink-0 whitespace-nowrap ${
              isUnitCompleted || isUnitActive ? 'text-white' : 'text-slate-600'
            }`}
          >
            {completedCount}/{unit.parts.length} Sesi ({unitPercent}%)
          </span>
        </div>
      </div>

      {/* ── SEQUENTIAL PART BREAKDOWN (COLLAPSIBLE) ── */}
      {!isCollapsed && (
        <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-3 bg-white">
          {unit.parts.map((part) => (
            <RoadmapPartItem
              key={part.id}
              part={part}
              onLockedClick={onLockedClick}
              onStartQuest={onStartQuest}
            />
          ))}
        </div>
      )}

      {/* Unit Milestone Trophy Badge */}
      {isUnitCompleted && (
        <div className="p-3.5 sm:p-4 bg-emerald-50/80 border-t-2 border-emerald-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Trophy weight="fill" className="w-4 h-4 text-amber-200" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-brand font-black text-emerald-950 truncate">
                Unit 0{unit.unitNumber} Lulus 100%!
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                Seluruh sesi Unit 0{unit.unitNumber} tuntas (+{unit.totalXp} XP total terkumpul).
              </span>
            </div>
          </div>
          <span className="bg-emerald-600 text-white font-brand font-black text-[10px] px-2.5 py-1 rounded-xl shadow-xs">
            TERVERIFIKASI ✓
          </span>
        </div>
      )}
    </div>
  )
}

