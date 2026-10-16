import { useState, useEffect, useMemo } from 'react'
import {
  CaretDown,
  Fire,
  Star,
  Trophy,
} from '@phosphor-icons/react'
import {
  GolangLogo,
  ReactLogo,
  DockerLogo,
  FundamentalLogo,
  TechNihongoLogo,
} from '../ui/BrandLogos'
import { CAREER_TRACKS } from './CourseSwitcherModal'
import { useAuthStore } from '../../store/authStore'
import { triggerHaptic } from '../../utils/haptics'

export interface GameTopBarProps {
  activeTrack: string
  onOpenCourseSwitcher: () => void
  onOpenLeaderboard: () => void
  completedCount: number
  totalCount: number
  progressPercent: number
  unitLabel?: string
}

export const GameTopBar = ({
  activeTrack,
  onOpenCourseSwitcher,
  onOpenLeaderboard,
  completedCount,
  totalCount,
  progressPercent,
  unitLabel = 'Modul',
}: GameTopBarProps) => {
  const { user } = useAuthStore()

  // Dynamic user gamification stats
  const userXp = typeof user?.xp === 'number' ? user.xp.toLocaleString() : '0'
  const userStreak = typeof user?.streak === 'number' ? user.streak : 0
  const userLevel = typeof user?.current_level === 'number' ? user.current_level : 1

  // XP pulse animation state
  const [isXpPulsing, setIsXpPulsing] = useState(false)

  // Listen for XP gains to trigger micro-bounce animation
  useEffect(() => {
    const handleXp = () => {
      setIsXpPulsing(true)
      setTimeout(() => setIsXpPulsing(false), 1200)
    }
    window.addEventListener('codeabroad_xp_gained', handleXp)
    return () => window.removeEventListener('codeabroad_xp_gained', handleXp)
  }, [])



  // Active track configuration from CAREER_TRACKS
  const currentTrackConfig = useMemo(() => {
    return (
      CAREER_TRACKS.find(
        (t) =>
          t.slug === activeTrack ||
          (activeTrack === 'backend' && t.slug === 'golang') ||
          (activeTrack === 'devops_aws' && t.slug === 'devops') ||
          (activeTrack === 'react' && t.slug === 'frontend')
      ) || CAREER_TRACKS[0]
    )
  }, [activeTrack])

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* ── LEFT: TRACK SWITCHER PILL & LINEAR PROGRESS BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
        {/* Clickable Track Switcher Pill */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tap')
            onOpenCourseSwitcher()
          }}
          className="flex items-center gap-2.5 px-3.5 py-2 bg-white border-2 border-slate-200/90 hover:border-blue-400 rounded-2xl shadow-2xs text-xs font-brand font-black text-slate-800 transition-all cursor-pointer group shrink-0"
          title="Peminatan karier saat ini. Klik untuk beralih jalur belajar."
        >
          <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {currentTrackConfig.iconType === 'fundamental' && <FundamentalLogo className="w-4 h-4" />}
            {currentTrackConfig.iconType === 'golang' && <GolangLogo className="w-5 h-3.5" />}
            {currentTrackConfig.iconType === 'frontend' && <ReactLogo className="w-4 h-4" />}
            {currentTrackConfig.iconType === 'devops' && <DockerLogo className="w-4 h-4" />}
            {currentTrackConfig.iconType === 'nihongo' && <TechNihongoLogo className="w-4 h-4" />}
          </div>
          <span className="text-xs font-brand font-black text-slate-900 leading-tight">
            {currentTrackConfig.title}
          </span>
          <CaretDown weight="bold" className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors ml-0.5" />
        </button>

        {/* Track Linear Progress Bar */}
        <div className="flex items-center gap-2.5 bg-white border-2 border-slate-200/80 rounded-2xl px-3 py-2 shadow-2xs">
          <div className="w-24 sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#1D4ED8]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-600 shrink-0">
            {completedCount}/{totalCount} {unitLabel} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* ── RIGHT: GAME STATUS HUD (CLEAN LIGHT MODE) ── */}
      <div className="bg-white border-2 border-slate-200/80 rounded-2xl px-3.5 py-2 flex items-center gap-3 shadow-2xs self-start sm:self-auto">
        {/* Streak Fire */}
        <div className="flex items-center gap-1.5 font-brand font-black text-xs text-orange-500">
          <Fire weight="fill" className="w-4 h-4 text-orange-500" />
          <span>{userStreak} Hari</span>
        </div>
        <div className="w-[1px] h-3.5 bg-slate-200" />

        {/* XP Star */}
        <div
          className={`flex items-center gap-1.5 font-brand font-black text-xs text-amber-500 rounded-lg px-1.5 py-0.5 transition-all ${
            isXpPulsing ? 'animate-pulse-ring bg-amber-50 scale-105' : ''
          }`}
        >
          <Star weight="fill" className={`w-4 h-4 text-amber-400 ${isXpPulsing ? 'animate-bounce' : ''}`} />
          <span>{userXp} XP</span>
        </div>
        <div className="w-[1px] h-3.5 bg-slate-200" />

        {/* Kodi Companion Level */}
        <div className="flex items-center gap-1.5 font-brand font-black text-xs text-blue-600">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Tingkat {userLevel}</span>
        </div>

        {/* Tokyo League Leaderboard HUD Button */}
        <div className="w-[1px] h-3.5 bg-slate-200" />
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tap')
            onOpenLeaderboard()
          }}
          className="flex items-center gap-1 font-brand font-black text-xs text-amber-700 hover:text-amber-800 transition-colors cursor-pointer group"
          title="Buka Papan Peringkat Liga Tokyo"
        >
          <Trophy weight="fill" className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Liga</span>
        </button>

      </div>
    </div>
  )
}
