import { useState, useRef, useEffect } from 'react'
import {
  CaretDown,
  Fire,
  Star,
  Gift,
  Translate,
} from '@phosphor-icons/react'
import { LanguageFlagIllustration } from "@/features/onboarding/components/illustrations/FlagIllustrations"
import { UserAvatar } from "@/shared/components/layout/left-sidebar/UserAvatar"
import { useAppTopBar } from "@/shared/hooks/layout/top-bar/useAppTopBar"
import { triggerHaptic } from "@/shared/utils/haptics"
import { computeXpLevelProgress } from "@/shared/utils/progression"

export interface AppTopBarProps {
  activeTrack: string
  onOpenCourseSwitcher: () => void
  onOpenMobileSidebar?: () => void
  completedCount: number
  totalCount: number
  progressPercent: number
  unitLabel?: string
}

export const AppTopBar = ({
  activeTrack,
  onOpenCourseSwitcher,
  onOpenMobileSidebar,
  completedCount,
  totalCount,
  progressPercent,
  unitLabel = 'Modul',
}: AppTopBarProps) => {
  const {
    activeUser,
    avatarStyle,
    rawXp,
    userXp,
    userStreak,
    userLevel,
    userGems,
    currentTrackConfig,
    canSwitchLanguage,
  } = useAppTopBar(activeTrack)

  const [showXpPopover, setShowXpPopover] = useState(false)
  const xpPopoverRef = useRef<HTMLDivElement>(null)
  const xpProgress = computeXpLevelProgress(rawXp, userLevel)

  useEffect(() => {
    if (!showXpPopover) return
    const handleOutside = (e: MouseEvent) => {
      if (xpPopoverRef.current && !xpPopoverRef.current.contains(e.target as Node)) {
        setShowXpPopover(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowXpPopover(false)
    }
    document.addEventListener('mousedown', handleOutside)
    window.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      window.removeEventListener('keydown', handleKey)
    }
  }, [showXpPopover])

  const trackLabelContent = (
    <>
      <div className="w-6 h-4 rounded-sm overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
        {currentTrackConfig.languageCode ? (
          <LanguageFlagIllustration code={currentTrackConfig.languageCode} compact className="w-full h-full object-contain" />
        ) : (
          <Translate weight="bold" className="w-3.5 h-3.5 text-blue-600" />
        )}
      </div>
      <span className="text-[11px] sm:text-xs font-brand font-black text-slate-900 leading-tight truncate">
        <span className="sm:hidden">{currentTrackConfig.shortTitle}</span>
        <span className="hidden sm:inline">{currentTrackConfig.title}</span>
      </span>
    </>
  )

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      {/* ── TOP / MAIN ROW: TRACK SWITCHER (LEFT) & GAME HUD CHIPS (RIGHT) ── */}
      <div className="flex items-center justify-between gap-2 min-w-0 w-full">
        {/* Left: Track Switcher Pill (interactive only when 2+ languages) & Inline Progress (XL) */}
        <div className="flex items-center gap-2.5 min-w-0 shrink">
          {canSwitchLanguage ? (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                onOpenCourseSwitcher()
              }}
              className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 bg-white border-2 border-slate-200/90 hover:border-blue-400 rounded-2xl shadow-[0_2px_0_0_#CBD5E1] active:shadow-none active:translate-y-0.5 text-xs font-brand font-black text-slate-800 transition-all cursor-pointer group shrink min-w-0"
              title="Bahasa dan jalur belajar saat ini. Klik untuk beralih."
            >
              {trackLabelContent}
              <CaretDown weight="bold" className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-600 transition-colors shrink-0 ml-0.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 bg-white border-2 border-slate-200/90 rounded-2xl shadow-2xs text-xs font-brand font-black text-slate-800 shrink min-w-0">
              {trackLabelContent}
            </div>
          )}

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

            {/* Unified XP & Level Chip + Hover/Click Progress Popover */}
            <div
              className="relative"
              ref={xpPopoverRef}
              onMouseEnter={() => setShowXpPopover(true)}
              onMouseLeave={() => setShowXpPopover(false)}
            >
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setShowXpPopover((prev) => !prev)
                }}
                aria-expanded={showXpPopover}
                className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-amber-50/90 hover:bg-amber-100/80 border border-amber-200/80 text-amber-700 font-brand font-black text-[11px] sm:text-xs shrink-0 whitespace-nowrap shadow-2xs transition-colors cursor-pointer"
                title={`Total ${userXp} XP • Lv. ${userLevel} (${xpProgress.xpInLevel}/${xpProgress.xpForNextLevel} XP)`}
              >
                <Star weight="fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
                <span>{userXp} XP</span>
                <span className="hidden sm:inline text-amber-400">·</span>
                <span className="hidden sm:inline text-blue-600">Lv. {userLevel}</span>
              </button>

              {showXpPopover && (
                <div className="absolute right-0 top-full pt-2 z-50">
                  <div className="w-64 rounded-2xl bg-white border-2 border-slate-200/90 shadow-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-brand font-black text-slate-900">
                      Level {xpProgress.level}
                    </span>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {xpProgress.totalXp.toLocaleString()} Total XP
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="h-2.5 w-full rounded-full bg-slate-100 border border-slate-200/70 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                        style={{ width: `${xpProgress.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>{xpProgress.xpInLevel} / {xpProgress.xpForNextLevel} XP</span>
                      <span>{xpProgress.progressPercent}%</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    Butuh <span className="font-bold text-slate-700">{xpProgress.xpRemaining} XP</span> lagi untuk naik ke Lv. {xpProgress.level + 1}.
                  </p>
                  </div>
                </div>
              )}
            </div>
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

          {/* Read-only User Identity Chip */}
          {activeUser && (
            <div
              className="hidden sm:flex items-center gap-2.5 p-1 pr-3.5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-2xs select-none"
              title={activeUser.name || activeUser.username || 'Pembelajar'}
            >
              <UserAvatar
                user={activeUser}
                size="md"
                style={avatarStyle}
                className="ring-2 ring-slate-100 shrink-0"
              />
              <span className="text-xs sm:text-[13px] font-brand font-black text-slate-700 max-w-[130px] truncate">
                {activeUser.name || activeUser.username || 'Pembelajar'}
              </span>
            </div>
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

