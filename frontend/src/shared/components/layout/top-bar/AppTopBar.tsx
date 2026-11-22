import { useState, useRef, useEffect, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CaretDown,
  Fire,
  Star,
  Gift,
  Translate,
  GearSix,
  SignOut,
  Lightning,
} from '@phosphor-icons/react'
import { LanguageFlagIllustration } from "@/features/onboarding/components/illustrations/FlagIllustrations"
import { UserAvatar } from "@/shared/components/layout/left-sidebar/UserAvatar"
import { SettingsModal } from "@/shared/components/layout/left-sidebar/SettingsModal"
import { useLogout } from "@/features/auth/hooks/useLogout"
import {
  gamificationService,
  GAMIFICATION_STATUS_QUERY_KEY,
} from "@/features/gamification/services/gamificationService"
import { getProfileQueryKey } from "@/shared/constants/queryKeys"
import { saveAvatarStyle, type AvatarStyle } from "@/shared/utils/avatar"
import { AppBreadcrumb, type BreadcrumbItem } from "@/shared/components/ui/AppBreadcrumb"
import { GemIcon } from "@/shared/components/ui/GamificationIcons"
import { useAppTopBar } from "@/shared/hooks/layout/top-bar/useAppTopBar"
import { triggerHaptic } from "@/shared/utils/haptics"
import { computeXpLevelProgress } from "@/shared/utils/progression"

export interface AppTopBarProps {
  activeTrack?: string
  onOpenCourseSwitcher?: () => void
  onOpenMobileSidebar?: () => void
  completedCount?: number
  totalCount?: number
  progressPercent?: number
  unitLabel?: string
  breadcrumbs?: BreadcrumbItem[]
  breadcrumbRightSlot?: ReactNode
}

export const AppTopBar = ({
  activeTrack = '',
  onOpenCourseSwitcher,
  onOpenMobileSidebar,
  completedCount = 0,
  totalCount = 0,
  progressPercent = 0,
  unitLabel = 'Modul',
  breadcrumbs,
  breadcrumbRightSlot,
}: AppTopBarProps) => {
  const {
    activeUser,
    avatarStyle: initialAvatarStyle,
    rawXp,
    userXp,
    userStreak,
    userLevel,
    userGems,
    currentTrackConfig,
    canSwitchLanguage,
  } = useAppTopBar(activeTrack)

  const [showXpPopover, setShowXpPopover] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>(initialAvatarStyle)
  const xpPopoverRef = useRef<HTMLDivElement>(null)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const logout = useLogout()
  const xpProgress = computeXpLevelProgress(rawXp, userLevel)

  const gamificationStatusQuery = useQuery({
    queryKey: [...GAMIFICATION_STATUS_QUERY_KEY, activeUser?.id ?? 'anonymous'],
    queryFn: ({ signal }) => gamificationService.getStatus({ signal }),
    enabled: Boolean(activeUser),
    staleTime: 60_000,
    retry: false,
  })
  const isXpBoosterActive = Boolean(gamificationStatusQuery.data?.xp_booster_active)

  useEffect(() => {
    if (!showXpPopover && !showAccountMenu) return
    const handleOutside = (e: MouseEvent) => {
      if (xpPopoverRef.current && !xpPopoverRef.current.contains(e.target as Node)) {
        setShowXpPopover(false)
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowXpPopover(false)
        setShowAccountMenu(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    window.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      window.removeEventListener('keydown', handleKey)
    }
  }, [showXpPopover, showAccountMenu])

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
        {/* Left: Track Switcher Pill (interactive only when 2+ languages & handler passed) & Optional Progress (XL) */}
        <div className="flex items-center gap-2.5 min-w-0 shrink">
          {canSwitchLanguage && onOpenCourseSwitcher ? (
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
          {totalCount > 0 && (
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
          )}
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
              <GemIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
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

            {/* Active 2x XP Booster Live Pill */}
            {isXpBoosterActive && (
              <div
                className="flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl bg-purple-100 border border-purple-300 text-purple-800 font-brand font-black text-[10px] sm:text-[11px] shrink-0 whitespace-nowrap shadow-2xs"
                title="2x XP Booster sedang aktif"
              >
                <Lightning weight="fill" className="w-3 h-3 text-purple-600 animate-pulse shrink-0" />
                <span>2x XP</span>
              </div>
            )}
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

          {/* Mobile (< md) Account Menu Button: Settings & Logout */}
          {activeUser && (
            <div className="relative md:hidden" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setShowAccountMenu((prev) => !prev)
                }}
                aria-expanded={showAccountMenu}
                aria-label="Menu Akun & Pengaturan"
                title="Pengaturan Akun & Keluar"
                className="relative flex items-center justify-center p-1 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-blue-400 shadow-[0_2px_0_0_#CBD5E1] active:shadow-none active:translate-y-0.5 transition-all cursor-pointer"
              >
                <UserAvatar
                  user={activeUser}
                  size="sm"
                  style={avatarStyle}
                  className="ring-2 ring-slate-100 shrink-0"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-800 text-white border border-white flex items-center justify-center shadow-2xs"
                >
                  <GearSix weight="fill" className="w-2.5 h-2.5" />
                </span>
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 top-full pt-2 z-50">
                  <div className="w-52 rounded-2xl bg-white border-2 border-slate-200/90 shadow-xl p-1.5 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-brand font-black text-slate-900 truncate">
                        {activeUser.name || activeUser.username || 'Pembelajar'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {activeUser.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap')
                        setShowAccountMenu(false)
                        setIsSettingsOpen(true)
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-brand font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <GearSix weight="bold" className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Pengaturan Akun</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap')
                        setShowAccountMenu(false)
                        void logout()
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-brand font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <SignOut weight="bold" className="w-4 h-4 shrink-0" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Read-only User Identity Chip (Desktop md+) */}
          {activeUser && (
            <div
              className="hidden md:flex items-center gap-2.5 p-1 pr-3.5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-2xs select-none"
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

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={activeUser}
        avatarStyle={avatarStyle}
        onAvatarStyleChange={(style) => {
          saveAvatarStyle(style)
          setAvatarStyle(style)
        }}
        onProfileUpdated={() => {
          void queryClient.invalidateQueries({ queryKey: getProfileQueryKey(activeUser?.id) })
        }}
        onLogout={() => {
          setIsSettingsOpen(false)
          void logout()
        }}
      />

      {/* ── ROW 2: LINEAR PROGRESS SUB-BAR (MOBILE & TABLET VIEWPORTS ONLY) ── */}
      {totalCount > 0 && (
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
      )}

      {/* ── INTEGRATED BREADCRUMB TRAIL ── */}
      {(breadcrumbs && breadcrumbs.length > 0) || breadcrumbRightSlot ? (
        <AppBreadcrumb
          items={breadcrumbs ?? []}
          rightSlot={breadcrumbRightSlot}
          className="pt-0.5"
        />
      ) : null}
    </div>
  )
}

