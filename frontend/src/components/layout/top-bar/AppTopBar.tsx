import {
  CaretDown,
  Fire,
  Star,
  Trophy,
  Gift,
  SpeakerHigh,
  SpeakerLow,
  SpeakerSimpleSlash,
} from '@phosphor-icons/react'
import {
  GolangLogo,
  ReactLogo,
  DockerLogo,
  FundamentalLogo,
  TechNihongoLogo,
} from '../../ui/BrandLogos'
import { useAppTopBar } from '../../../hooks/layout/top-bar/useAppTopBar'
import { triggerHaptic } from '../../../utils/haptics'
import { useAudioStore } from '../../../store/audioStore'

export interface AppTopBarProps {
  activeTrack: string
  onOpenCourseSwitcher: () => void
  onOpenLeaderboard: () => void
  onOpenMobileSidebar?: () => void
  completedCount: number
  totalCount: number
  progressPercent: number
  unitLabel?: string
}

export const AppTopBar = ({
  activeTrack,
  onOpenCourseSwitcher,
  onOpenLeaderboard,
  onOpenMobileSidebar,
  completedCount,
  totalCount,
  progressPercent,
  unitLabel = 'Modul',
}: AppTopBarProps) => {
  const {
    userXp,
    userStreak,
    userLevel,
    userGems,
    currentTrackConfig,
  } = useAppTopBar(activeTrack)

  const audioMode = useAudioStore((s) => s.audioMode)
  const cycleAudioMode = useAudioStore((s) => s.cycleAudioMode)

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      {/* ── TOP / MAIN ROW: TRACK SWITCHER (LEFT) & GAME HUD CHIPS (RIGHT) ── */}
      <div className="flex items-center justify-between gap-2 min-w-0 w-full">
        {/* Left: Clickable Track Switcher Pill & Inline Progress (XL) */}
        <div className="flex items-center gap-2.5 min-w-0 shrink">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap')
              onOpenCourseSwitcher()
            }}
            className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 bg-white border-2 border-slate-200/90 hover:border-blue-400 rounded-2xl shadow-[0_2px_0_0_#CBD5E1] active:shadow-none active:translate-y-0.5 text-xs font-brand font-black text-slate-800 transition-all cursor-pointer group shrink min-w-0"
            title="Peminatan karier saat ini. Klik untuk beralih jalur belajar."
          >
            <div className="w-5 h-5 rounded-md bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {currentTrackConfig.iconType === 'fundamental' && <FundamentalLogo className="w-3.5 h-3.5" />}
              {currentTrackConfig.iconType === 'golang' && <GolangLogo className="w-4 h-3" />}
              {currentTrackConfig.iconType === 'frontend' && <ReactLogo className="w-3.5 h-3.5" />}
              {currentTrackConfig.iconType === 'devops' && <DockerLogo className="w-3.5 h-3.5" />}
              {currentTrackConfig.iconType === 'nihongo' && <TechNihongoLogo className="w-3.5 h-3.5" />}
            </div>
            <span className="text-[11px] sm:text-xs font-brand font-black text-slate-900 leading-tight truncate">
              <span className="sm:hidden">{currentTrackConfig.shortTitle}</span>
              <span className="hidden sm:inline">{currentTrackConfig.title}</span>
            </span>
            <CaretDown weight="bold" className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-600 transition-colors shrink-0 ml-0.5" />
          </button>

          {/* Track Linear Progress Bar (Inline on Desktop XL Only) */}
          <div className="hidden xl:flex items-center gap-2 bg-white border-2 border-slate-200/80 rounded-2xl px-3 py-1.5 shadow-2xs shrink-0 whitespace-nowrap">
            <div className="w-24 2xl:w-28 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5 shrink-0">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#1D4ED8]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-600 shrink-0 whitespace-nowrap">
              {completedCount}/{totalCount} {unitLabel} ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* ── RIGHT: GAME STATUS HUD + SEPARATE TACTILE GIFT BUTTON ── */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* HUD Micro-Chips Container */}
          <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-1 sm:p-1.5 flex items-center gap-1 sm:gap-1.5 shadow-2xs shrink-0">
            {/* Streak Fire Chip */}
            <div
              className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-orange-50/90 border border-orange-200/80 text-orange-600 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs"
              title={`Rentetan Belajar: ${userStreak} Hari`}
            >
              <Fire weight="fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 animate-pulse shrink-0" />
              <span>{userStreak}</span>
              <span className="hidden sm:inline">&nbsp;Hari</span>
            </div>

            {/* Gems Diamond Chip */}
            <div
              className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-cyan-50/90 border border-cyan-200/80 text-cyan-700 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs"
              title={`Saldo Permata Tokyo: ${userGems} Gems`}
            >
              <span className="text-xs sm:text-sm shrink-0">💎</span>
              <span>{userGems}</span>
            </div>

            {/* XP Star Chip */}
            <div
              className="hidden sm:flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-600 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs transition-all"
              title={`Total Pengalaman Koding: ${userXp} XP`}
            >
              <Star weight="fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
              <span>{userXp}</span>
              <span className="hidden sm:inline">&nbsp;XP</span>
            </div>

            {/* Kodi Companion Level Chip */}
            <div
              className="hidden sm:flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-blue-50/90 border border-blue-200/80 text-blue-600 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs"
              title={`Level Kodi: Tingkat ${userLevel}`}
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
              <span className="hidden md:inline">Tingkat </span>
              <span className="md:hidden">Lv.</span>
              <span>{userLevel}</span>
            </div>

            {/* Tokyo League Leaderboard Tactile Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                onOpenLeaderboard()
              }}
              className="hidden md:flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300 border-b-2 border-b-amber-400 active:translate-y-0.5 text-amber-900 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs transition-all cursor-pointer group"
              title="Buka Papan Peringkat Liga Tokyo"
            >
              <Trophy weight="fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden md:inline">Liga</span>
            </button>

            {/* Audio Mode Tactile 3D Cycler */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                cycleAudioMode()
              }}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl border border-b-2 active:translate-y-0.5 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs transition-all cursor-pointer ${
                audioMode === 'all'
                  ? 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300 border-b-emerald-400 text-emerald-800'
                  : audioMode === 'sfx_only'
                  ? 'bg-blue-50 hover:bg-blue-100/80 border-blue-300 border-b-blue-400 text-blue-800'
                  : 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 border-b-slate-400 text-slate-500'
              }`}
              title={`Mode Suara: ${
                audioMode === 'all'
                  ? 'Musik & Efek Suara Aktif (Klik untuk ganti ke SFX saja)'
                  : audioMode === 'sfx_only'
                  ? 'Efek Suara Saja (Klik untuk senyap)'
                  : 'Semua Suara Dibisukan (Klik untuk aktifkan)'
              }`}
              aria-label="Pengaturan Mode Suara"
            >
              {audioMode === 'all' && (
                <>
                  <SpeakerHigh weight="fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-pulse" />
                  <span className="hidden lg:inline text-[11px]">BGM & SFX</span>
                </>
              )}
              {audioMode === 'sfx_only' && (
                <>
                  <SpeakerLow weight="bold" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="hidden lg:inline text-[11px]">SFX Saja</span>
                </>
              )}
              {audioMode === 'muted' && (
                <>
                  <SpeakerSimpleSlash weight="bold" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                  <span className="hidden lg:inline text-[11px]">Hening</span>
                </>
              )}
            </button>
          </div>

          {/* ── SEPARATE STANDALONE 3D TACTILE GIFT BUTTON ── */}
          {onOpenMobileSidebar && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                onOpenMobileSidebar()
              }}
              className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-[0_3px_0_0_#B45309] active:shadow-none active:translate-y-0.5 border-2 border-amber-300/90 flex items-center justify-center shrink-0 transition-all cursor-pointer relative group"
              title="Buka Misi Harian, Rentetan, & Peti Hadiah"
              aria-label="Buka Menu Misi & Peti Hadiah"
            >
              <Gift weight="fill" className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white drop-shadow-xs transition-transform group-hover:scale-110 animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white shadow-2xs" />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ── ROW 2: LINEAR PROGRESS SUB-BAR (MOBILE & TABLET VIEWPORTS ONLY) ── */}
      <div className="xl:hidden flex items-center justify-between gap-3 bg-white/95 border border-slate-200/90 rounded-2xl px-3.5 py-1.5 shadow-2xs">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#1D4ED8]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-600 shrink-0 whitespace-nowrap">
          {completedCount}/{totalCount} {unitLabel} ({progressPercent}%)
        </span>
      </div>
    </div>
  )
}

