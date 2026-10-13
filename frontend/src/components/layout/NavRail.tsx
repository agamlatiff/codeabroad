import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Calendar,
  Plane,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useDashboard } from '../../hooks'
import { UserAvatar } from '../ui/UserAvatar'

export const NavRail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { avatar, actions } = useDashboard()

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Silabus', href: '/courses', icon: BookOpen },
    { label: 'Liga', href: '/dashboard#leaderboard', icon: Trophy },
    { label: 'Misi', href: '/quests', icon: Calendar },
    { label: 'Paspor', href: '/dashboard#passport', icon: Plane },
  ]

  const handleLogout = () => {
    actions.logout()
    navigate('/login')
  }

  return (
    <>
      {/* ── DESKTOP & TABLET LEFT NAV RAIL (76px width — Midnight Departure) ── */}
      <aside className="hidden md:flex flex-col items-center justify-between w-[76px] shrink-0 h-screen sticky top-0 bg-[#101827] border-r border-[#27364D] py-5 z-40 select-none">
        {/* Top Brand Mark */}
        <div className="flex flex-col items-center gap-6">
          <Link
            to="/dashboard"
            className="w-11 h-11 rounded-2xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 text-white flex items-center justify-center font-black text-base shadow-sm transition-all cursor-pointer glow-primary"
            title="CodeAbroad Tokyo Hub"
          >
            CA
          </Link>

          {/* Navigation Icon List */}
          <nav className="flex flex-col items-center gap-2.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                location.pathname === item.href ||
                (item.href === '/courses' && (location.pathname.startsWith('/roadmap') || location.pathname.startsWith('/learn')))

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  title={item.label}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative group ${
                    isActive
                      ? 'bg-[#172236] text-[#38BDF8] border border-[#3B82F6]/60 shadow-[0_0_14px_rgba(59,130,246,0.25)]'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#172236]/70 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {isActive && (
                    <span className="absolute -left-1 w-1 h-5 bg-[#38BDF8] rounded-r-full" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Settings, Logout & Profile Avatar */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            className="w-10 h-10 rounded-xl border border-[#27364D] bg-[#101827] hover:bg-[#172236] flex items-center justify-center text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl border border-[#27364D] bg-[#101827] hover:bg-rose-950/40 hover:border-rose-500/50 hover:text-rose-400 flex items-center justify-center text-[#94A3B8] transition-colors cursor-pointer"
            title="Keluar (Sign Out)"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <div title={user?.name || 'Profil Anda'} className="ring-1 ring-[#27364D] rounded-full">
            <UserAvatar user={user} size="sm" style={avatar.style} />
          </div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAVIGATION BAR (Midnight Departure) ── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#101827]/95 backdrop-blur-md border-t border-[#27364D] px-4 py-2 z-40 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          const isActive =
            location.pathname === item.href ||
            (item.href === '/courses' && (location.pathname.startsWith('/roadmap') || location.pathname.startsWith('/learn')))

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
                isActive ? 'text-[#38BDF8] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
