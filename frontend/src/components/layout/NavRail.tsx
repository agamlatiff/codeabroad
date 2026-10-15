import { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  SquaresFour,
  Books,
  Target,
  Trophy,
  Briefcase,
  GearSix,
  SignOut,
  Sparkle,
} from '@phosphor-icons/react'
import { useAuthStore } from '../../store/authStore'
import { useDashboard } from '../../hooks'
import { UserAvatar } from '../ui/UserAvatar'
import { triggerHaptic } from '../../utils/haptics'
import { AccountSettingsModal } from './AccountSettingsModal'

export const NavRail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { avatar, actions } = useDashboard()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const navItems = [
    {
      label: 'Belajar',
      tooltip: 'Belajar • Dashboard Utama',
      href: '/dashboard',
      icon: SquaresFour,
    },
    {
      label: 'Silabus',
      tooltip: 'Silabus • Kurikulum & Modul',
      href: '/courses',
      icon: Books,
    },
    {
      label: 'Misi',
      tooltip: 'Misi • Hadiah Harian & XP',
      href: '/quests',
      icon: Target,
      hasBadge: true,
    },
    {
      label: 'Peringkat',
      tooltip: 'Peringkat • Liga Tokyo',
      href: '/leaderboard',
      icon: Trophy,
    },
    {
      label: 'Karir',
      tooltip: 'Karir • Portofolio Tokyo IT',
      href: '/career',
      icon: Briefcase,
    },
  ]

  const handleLogout = () => {
    triggerHaptic('tap')
    actions.logout()
    navigate('/login')
  }

  return (
    <>
      {/* ── DESKTOP & TABLET LEFT NAV RAIL (76px width — Duolingo 3D Tactile) ── */}
      <aside className="hidden md:flex flex-col items-center justify-between w-[76px] shrink-0 h-screen sticky top-0 bg-white border-r-2 border-slate-200/90 py-5 z-40 select-none">
        {/* Top Brand Mark */}
        <div className="flex flex-col items-center gap-6">
          <Link
            to="/dashboard"
            onClick={() => triggerHaptic('tap')}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border-2 border-slate-200/90 shadow-[0_3px_0_0_#CBD5E1] active:shadow-none active:translate-y-0.5 flex items-center justify-center transition-all cursor-pointer relative group"
            title="CodeAbroad Hub"
          >
            <img
              src="/favicon.svg"
              alt="CodeAbroad Kodi"
              className="w-9 h-9 object-contain drop-shadow-xs transition-transform group-hover:scale-110"
            />

            {/* Brand Tooltip */}
            <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/95 text-white text-[11px] font-brand font-black rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 flex items-center gap-1.5 border border-slate-700/60 backdrop-blur-xs translate-x-1 group-hover:translate-x-0">
              <Sparkle weight="fill" className="w-3 h-3 text-amber-400" />
              <span>CodeAbroad Platform</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
            </div>
          </Link>

          {/* Navigation Icon List */}
          <nav className="flex flex-col items-center gap-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                location.pathname === item.href ||
                (item.href === '/career' && location.pathname.startsWith('/career')) ||
                (item.href === '/courses' &&
                  (location.pathname.startsWith('/roadmap') ||
                    location.pathname.startsWith('/learn')))

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => triggerHaptic('tap')}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative group ${
                    isActive
                      ? 'bg-gradient-to-b from-blue-50 via-blue-100/70 to-blue-100/90 text-blue-600 border-2 border-blue-400 shadow-[0_3px_0_0_#93C5FD] scale-105'
                      : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 border-2 border-transparent hover:border-slate-200/70 hover:scale-105 active:scale-95'
                  }`}
                >
                  <Icon
                    weight={isActive ? 'duotone' : 'bold'}
                    className={`w-6 h-6 transition-transform ${
                      isActive ? 'scale-105 text-blue-600' : 'group-hover:scale-110'
                    }`}
                  />

                  {/* Active 3D Left Indicator Pill */}
                  {isActive && (
                    <span className="absolute -left-2.5 w-1.5 h-6 bg-blue-600 rounded-r-full shadow-xs" />
                  )}

                  {/* Notification Dot for Active Quests */}
                  {item.hasBadge && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border-2 border-white shadow-2xs" />
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

        {/* Bottom Settings, Logout & Profile Avatar */}
        <div className="flex flex-col items-center gap-3">
          {/* Subtle Divider */}
          <div className="w-8 h-[2px] bg-slate-200/80 rounded-full my-0.5" />

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap')
              setIsSettingsOpen(true)
            }}
            className="w-10 h-10 rounded-2xl border-2 border-slate-200/90 bg-white hover:bg-slate-100/80 hover:border-slate-300 text-slate-500 hover:text-slate-800 shadow-[0_2px_0_0_#CBD5E1] active:shadow-none active:translate-y-0.5 flex items-center justify-center transition-all cursor-pointer group relative"
            title="Pengaturan"
          >
            <GearSix weight="bold" className="w-4.5 h-4.5 transition-transform group-hover:rotate-45" />

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
          >
            <SignOut weight="bold" className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />

            {/* Tooltip */}
            <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-rose-950/95 text-white text-[11px] font-brand font-black rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 border border-rose-800/60 backdrop-blur-xs translate-x-1 group-hover:translate-x-0">
              <span>Keluar Akun</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-rose-950" />
            </div>
          </button>

          {/* User Profile Avatar with Online Dot */}
          <div
            onClick={() => {
              triggerHaptic('tap')
              setIsSettingsOpen(true)
            }}
            className="relative group cursor-pointer mt-1"
          >
            <div className="ring-2 ring-slate-200 hover:ring-blue-400 rounded-full transition-all hover:scale-105">
              <UserAvatar user={user} size="sm" style={avatar.style} />
            </div>
            {/* Online Active Indicator Dot */}
            <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5 shadow-2xs" />

            {/* Tooltip */}
            <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/95 text-white text-[11px] font-brand font-black rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 border border-slate-700/60 backdrop-blur-xs translate-x-1 group-hover:translate-x-0">
              <span>Profil & Pengaturan: {user?.name || 'Software Engineer'}</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
            </div>
          </div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAVIGATION BAR (Clean Light Mode) ── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-200/90 px-4 py-2 z-40 flex items-center justify-around shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            location.pathname === item.href ||
            (item.href === '/career' && location.pathname.startsWith('/career')) ||
            (item.href === '/courses' &&
              (location.pathname.startsWith('/roadmap') ||
                location.pathname.startsWith('/learn')))

          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => triggerHaptic('tap')}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all relative ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon weight={isActive ? 'duotone' : 'bold'} className="w-5 h-5" />
              <span className="text-[10px] font-brand">{item.label}</span>
              {item.hasBadge && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>

      {/* ── DUOLINGO 3D ACCOUNT SETTINGS MODAL ── */}
      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        avatarStyle={avatar.style}
        onAvatarStyleChange={avatar.setStyle}
        onProfileUpdated={actions.refetchProfile}
      />
    </>
  )
}

