import { useState, useEffect, useMemo } from 'react'
import {
  CaretDown,
  Fire,
  Star,
  Trophy,
  Flask,
  Gift,
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
  onOpenMobileSidebar?: () => void
  completedCount: number
  totalCount: number
  progressPercent: number
  unitLabel?: string
}

export const GameTopBar = ({
  activeTrack,
  onOpenCourseSwitcher,
  onOpenLeaderboard,
  onOpenMobileSidebar,
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
  const userGems = typeof user?.gems === 'number' ? user.gems : 0

  // XP pulse animation state
  const [isXpPulsing, setIsXpPulsing] = useState(false)

  // Active XP Booster timer state & Streak Freeze inventory count
  const [boosterTimeLeft, setBoosterTimeLeft] = useState<string | null>(null)
  const [streakFreezeCount, setStreakFreezeCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('codeabroad_user_inventory')
      return stored ? JSON.parse(stored)['streak-freeze'] || 0 : 0
    } catch {
      return 0
    }
  })

  // Listen for XP gains to trigger micro-bounce animation
  useEffect(() => {
    const handleXp = () => {
      setIsXpPulsing(true)
      setTimeout(() => setIsXpPulsing(false), 1200)
    }
    window.addEventListener('codeabroad_xp_gained', handleXp)
    return () => window.removeEventListener('codeabroad_xp_gained', handleXp)
  }, [])

  // Check and countdown XP Booster timer & inventory sync
  useEffect(() => {
    const checkBooster = () => {
      try {
        const expires = localStorage.getItem('codeabroad_xp_booster_expires_at')
        if (!expires) {
          setBoosterTimeLeft(null)
          return
        }
        const diff = parseInt(expires, 10) - Date.now()
        if (diff <= 0) {
          localStorage.removeItem('codeabroad_xp_booster_expires_at')
          setBoosterTimeLeft(null)
        } else {
          const m = Math.floor(diff / 60000)
          const s = Math.floor((diff % 60000) / 1000)
          setBoosterTimeLeft(`${m}:${s.toString().padStart(2, '0')}`)
        }
      } catch {
        setBoosterTimeLeft(null)
      }
    }

    const checkInventory = () => {
      try {
        const stored = localStorage.getItem('codeabroad_user_inventory')
        setStreakFreezeCount(stored ? JSON.parse(stored)['streak-freeze'] || 0 : 0)
      } catch {
        // ignore
      }
    }

    checkBooster()
    checkInventory()

    const interval = setInterval(checkBooster, 1000)
    window.addEventListener('codeabroad_booster_activated', checkBooster)
    window.addEventListener('codeabroad_inventory_updated', checkInventory)

    return () => {
      clearInterval(interval)
      window.removeEventListener('codeabroad_booster_activated', checkBooster)
      window.removeEventListener('codeabroad_inventory_updated', checkInventory)
    }
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

  // Compact track title for small viewports (Mobile < sm)
  const shortTrackTitle = useMemo(() => {
    const t = currentTrackConfig.title
    if (t.includes('Backend')) return 'Backend Go'
    if (t.includes('Frontend')) return 'Frontend React'
    if (t.includes('DevOps')) return 'DevOps AWS'
    if (t.includes('Fundamental')) return 'Fundamental'
    if (t.includes('Nihongo')) return 'Tech Nihongo'
    return t
  }, [currentTrackConfig.title])

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
              <span className="sm:hidden">{shortTrackTitle}</span>
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
            {/* Active XP Booster Potion Chip */}
            {boosterTimeLeft && (
              <div
                className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl bg-purple-50 border border-purple-300 text-purple-700 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs animate-pulse ring-2 ring-purple-200"
                title="XP Booster Aktif: 2x XP untuk setiap latihan & kuis!"
              >
                <Flask weight="fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 animate-bounce shrink-0" />
                <span>2x ({boosterTimeLeft})</span>
              </div>
            )}

            {/* Streak Fire Chip with Freeze Protection Badge */}
            <div
              className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-orange-50/90 border border-orange-200/80 text-orange-600 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs"
              title={`Rentetan Belajar: ${userStreak} Hari${streakFreezeCount > 0 ? ` • ${streakFreezeCount}x Perlindungan Streak Freeze Aktif ❄️` : ''}`}
            >
              <Fire weight="fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 animate-pulse shrink-0" />
              <span>{userStreak}</span>
              <span className="hidden sm:inline">&nbsp;Hari</span>
              {streakFreezeCount > 0 && (
                <span className="text-[9px] sm:text-[10px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded font-mono font-bold flex items-center">
                  ❄️{streakFreezeCount}
                </span>
              )}
            </div>

            {/* Gems Diamond Chip */}
            <div
              className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-cyan-50/90 border border-cyan-200/80 text-cyan-700 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs"
              title={`Saldo Permata Tokyo: ${userGems} Gems`}
            >
              <span className="text-xs sm:text-sm shrink-0">💎</span>
              <span>{userGems}</span>
            </div>

            {/* XP Star Chip (Hidden on mobile < sm to keep top bar clean and spacious) */}
            <div
              className={`hidden sm:flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-600 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs transition-all ${
                isXpPulsing ? 'animate-pulse-ring bg-amber-100 scale-105' : ''
              }`}
              title={`Total Pengalaman Koding: ${userXp} XP`}
            >
              <Star weight="fill" className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0 ${isXpPulsing ? 'animate-bounce' : ''}`} />
              <span>{userXp}</span>
              <span className="hidden sm:inline">&nbsp;XP</span>
            </div>

            {/* Kodi Companion Level Chip (Hidden on mobile < sm to keep top bar 100% overlap-free) */}
            <div
              className="hidden sm:flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-blue-50/90 border border-blue-200/80 text-blue-600 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs"
              title={`Level Kodi: Tingkat ${userLevel}`}
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
              <span className="hidden md:inline">Tingkat </span>
              <span className="md:hidden">Lv.</span>
              <span>{userLevel}</span>
            </div>

            {/* Tokyo League Leaderboard Tactile Button (Hidden on mobile < md because bottom nav already has Peringkat tab) */}
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
          </div>

          {/* ── SEPARATE STANDALONE 3D TACTILE GIFT BUTTON (PROMINENT ICON & CLEAR AFFORDANCE) ── */}
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
              {/* Active notification indicator dot */}
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
