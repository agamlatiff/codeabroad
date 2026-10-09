import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Logo } from '../ui/Logo'
import { UserAvatar } from '../ui/UserAvatar'
import { useAuthStore } from '../../store/authStore'
import { useDashboard } from '../../hooks'
import {
  Flame,
  Sparkles,
  LogOut,
  Map,
  Compass,
  CheckCircle2,
} from 'lucide-react'

export const AppNavbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { clock, avatar, actions } = useDashboard()

  const navLinks = [
    { label: 'Beranda', href: '/dashboard', icon: Compass },
    { label: 'Silabus Roadmap', href: '/courses', icon: Map },
    { label: 'Daftar Misi', href: '/quests', icon: CheckCircle2 },
  ]

  const handleLogout = () => {
    actions.logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-[#E5E5E5] px-4 sm:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Platform Title */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Logo variant="slate" size="sm" linkTo="/dashboard" />
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono font-bold text-slate-600">
              <span>コード海外</span>
              <span className="text-slate-300">•</span>
              <span>Tokyo Hub</span>
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon
              const isActive =
                location.pathname === item.href ||
                (item.href === '/courses' && location.pathname.startsWith('/roadmap'))

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Center: Live Dual Timezone Clock (Tokyo & Jakarta) */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-50 border-2 border-[#E5E5E5] px-3.5 py-1.5 rounded-2xl shadow-2xs text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span>🇯🇵</span>
            <span className="text-slate-400 font-normal">Tokyo:</span>
            <span className="font-mono text-slate-900 font-black">{clock.tokyoTime} JST</span>
          </div>
          <span className="text-slate-300 font-light">|</span>
          <div className="flex items-center gap-1.5">
            <span>🇮🇩</span>
            <span className="text-slate-400 font-normal">Jakarta:</span>
            <span className="font-mono text-slate-700 font-bold">{clock.jakartaTime} WIB</span>
          </div>
        </div>

        {/* Right: Gamified Stats + Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 border-2 border-orange-200 border-b-4 border-b-orange-300 shadow-2xs font-black text-xs text-orange-950">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{user?.streak ?? 1} Hari</span>
          </div>

          {/* XP Pill (Amber Gold Duolingo) */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border-2 border-amber-200 border-b-4 border-b-amber-300 shadow-2xs font-black text-xs text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>{user?.xp ?? 50} XP</span>
          </div>

          {/* Profile Dropdown / Sign Out */}
          <div className="flex items-center gap-2 pl-1">
            <UserAvatar user={user} size="sm" style={avatar.style} showBadge badgeColor="streak" />
            <button
              type="button"
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl border-2 border-[#E5E5E5] hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-colors cursor-pointer"
              title="Keluar (Sign Out)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Subnav Bar */}
      <div className="flex md:hidden items-center justify-around gap-1 pt-2 mt-2 border-t border-slate-100">
        {navLinks.map((item) => {
          const Icon = item.icon
          const isActive =
            location.pathname === item.href ||
            (item.href === '/courses' && location.pathname.startsWith('/roadmap'))

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </header>
  )
}
