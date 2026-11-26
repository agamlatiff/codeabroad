import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  GearSix,
  LockSimple,
  SignIn,
  SignOut,
  Sparkle,
} from '@phosphor-icons/react'
import { triggerHaptic } from "@/shared/utils/haptics"
import { useAppLeftSidebar } from "@/shared/hooks/layout/left-sidebar/useAppLeftSidebar"
import { GuestLoginPromptModal } from '@/features/auth/components/GuestLoginPromptModal'
import { SettingsModal } from './SettingsModal'

/**
 * AppLeftSidebar (SSOT)
 * Pure declarative left navigation rail (desktop) and bottom bar (mobile) for Merantalk.
 * Powered 1:1 by useAppLeftSidebar.
 */
export const AppLeftSidebar = () => {
  const {
    user,
    navItems,
    isSettingsOpen,
    handleOpenSettings,
    handleCloseSettings,
    handleProfileUpdated,
    handleLogout,
  } = useAppLeftSidebar()

  const [isGuestQuestsModalOpen, setIsGuestQuestsModalOpen] = useState(false)

  const handleNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    requiresAuth?: boolean
  ) => {
    triggerHaptic('tap')
    if (!user && requiresAuth) {
      e.preventDefault()
      setIsGuestQuestsModalOpen(true)
    }
  }

  return (
    <>
      {/* ── DESKTOP & TABLET LEFT NAV RAIL (76px width — Duolingo 3D Tactile) ── */}
      <aside className="hidden md:flex flex-col items-center justify-between w-[76px] shrink-0 h-screen sticky top-0 bg-white border-r-2 border-slate-200/90 py-5 z-40 select-none">
        {/* Top Brand Mark */}
        <div className="flex flex-col items-center gap-6">
          <Link
            to="/"
            onClick={() => triggerHaptic('tap')}
            className="w-11 h-11 rounded-2xl flex items-center justify-center active:scale-95 transition-transform cursor-pointer relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
            title="Kembali ke Beranda Merantalk"
          >
            <img
              src="/favicon.svg"
              alt="Merantalk Mera"
              className="w-10 h-10 object-contain transition-transform group-hover:scale-105 group-hover:-rotate-3"
            />

            {/* Brand Tooltip */}
            <div aria-hidden="true" className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/95 text-white text-[11px] font-brand font-black rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 flex items-center gap-1.5 border border-slate-700/60 backdrop-blur-xs translate-x-1 group-hover:translate-x-0">
              <Sparkle weight="fill" className="w-3 h-3 text-amber-400" />
              <span>Merantalk Platform</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
            </div>
          </Link>

          {/* Navigation Icon List */}
          <nav aria-label="Navigasi utama" className="flex flex-col items-center gap-3">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  data-tour={item.tourId}
                  aria-label={item.label}
                  onClick={(e) => handleNavClick(e, item.requiresAuth)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors cursor-pointer relative group ${
                    item.isActive
                      ? 'bg-gradient-to-b from-blue-50 via-blue-100/70 to-blue-100/90 text-blue-600 border-2 border-blue-400 shadow-[0_3px_0_0_#93C5FD]'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 border-2 border-transparent hover:border-slate-200/70'
                  }`}
                >
                  <Icon
                    weight={item.isActive ? 'duotone' : 'bold'}
                    className={`w-6 h-6 transition-colors ${
                      item.isActive ? 'text-blue-600' : ''
                    }`}
                  />

                  {/* Active 3D Left Indicator Pill */}
                  {item.isActive && (
                    <span className="absolute -left-2.5 w-1.5 h-6 bg-blue-600 rounded-r-full shadow-xs" />
                  )}

                  {/* Notification Dot for Active Quests or Guest Lock Indicator */}
                  {item.hasBadge && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 right-1.5 inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border-2 border-white shadow-2xs"
                    />
                  )}
                  {!user && item.requiresAuth && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-slate-800 text-white border border-white flex items-center justify-center shadow-2xs">
                      <LockSimple weight="fill" className="w-2.5 h-2.5" />
                    </span>
                  )}

                  {/* Floating Discord-style Tooltip */}
                  <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/95 text-white text-[11px] font-brand font-black rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 flex items-center gap-1.5 border border-slate-700/60 backdrop-blur-xs translate-x-1 group-hover:translate-x-0">
                    <span>{item.tooltip}</span>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Settings, Logout & Profile Avatar (or Guest Login/Register CTA) */}
        <div className="flex flex-col items-center gap-3">
          {/* Subtle Divider */}
          <div className="w-8 h-[2px] bg-slate-200/80 rounded-full my-0.5" />

          {user ? (
            <>
              {/* Settings Button */}
              <button
                type="button"
                onClick={handleOpenSettings}
                className="w-10 h-10 rounded-2xl border-2 border-slate-200/90 bg-white hover:bg-slate-100/80 hover:border-slate-300 text-slate-500 hover:text-slate-800 shadow-[0_2px_0_0_#CBD5E1] active:shadow-none active:translate-y-0.5 flex items-center justify-center transition-all cursor-pointer group relative"
                title="Pengaturan"
                aria-label="Pengaturan Akun"
              >
                <GearSix weight="bold" className="w-4.5 h-4.5 transition-colors" />

                {/* Tooltip */}
                <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/95 text-white text-[11px] font-brand font-black rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 border border-slate-700/60 backdrop-blur-xs translate-x-1 group-hover:translate-x-0">
                  <span>Pengaturan Akun</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
                </div>
              </button>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-10 h-10 rounded-2xl border-2 border-slate-200/90 bg-white hover:bg-rose-50 hover:border-rose-300 text-slate-500 hover:text-rose-600 shadow-[0_2px_0_0_#CBD5E1] active:shadow-none active:translate-y-0.5 flex items-center justify-center transition-all cursor-pointer group relative"
                title="Keluar"
                aria-label="Keluar Akun"
              >
                <SignOut weight="bold" className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />

                {/* Tooltip */}
                <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-rose-950/95 text-white text-[11px] font-brand font-black rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 border border-rose-800/60 backdrop-blur-xs translate-x-1 group-hover:translate-x-0">
                  <span>Keluar Akun</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-rose-950" />
                </div>
              </button>
            </>
          ) : (
            <Link
              to="/login?from=guest"
              onClick={() => triggerHaptic('tap')}
              className="w-10 h-10 rounded-2xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white shadow-[0_2px_0_0_#93C5FD] active:shadow-none active:translate-y-0.5 flex items-center justify-center transition-all cursor-pointer group relative"
              title="Masuk atau Daftar Gratis"
              aria-label="Masuk atau Daftar Gratis"
            >
              <SignIn weight="bold" className="w-4.5 h-4.5" />

              <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/95 text-white text-[11px] font-brand font-black rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 border border-slate-700/60 backdrop-blur-xs translate-x-1 group-hover:translate-x-0">
                <span>Masuk / Daftar Gratis</span>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
              </div>
            </Link>
          )}
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAVIGATION BAR (Clean Light Mode) ── */}
      <nav
        aria-label="Navigasi seluler"
        className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-200/90 px-4 py-2 z-40 flex items-center justify-around shadow-sm"
      >
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              to={item.href}
              data-tour={item.tourId}
              aria-label={item.label}
              onClick={(e) => handleNavClick(e, item.requiresAuth)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all relative ${
                item.isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon weight={item.isActive ? 'duotone' : 'bold'} className="w-5 h-5" />
              <span className="text-[10px] font-brand">{item.label}</span>
              {item.hasBadge && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-amber-500 rounded-full" />
              )}
              {!user && item.requiresAuth && (
                <span className="absolute top-1 right-1.5 w-2.5 h-2.5 rounded-full bg-slate-700 border border-white" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── DUOLINGO 3D ACCOUNT SETTINGS MODAL ── */}
      {user && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={handleCloseSettings}
          user={user}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {!user && (
        <GuestLoginPromptModal
          isOpen={isGuestQuestsModalOpen}
          onClose={() => setIsGuestQuestsModalOpen(false)}
          reason="quests"
        />
      )}
    </>
  )
}

