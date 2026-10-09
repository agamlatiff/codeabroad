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
      {/* ── DESKTOP & TABLET LEFT NAV RAIL (76px width) ── */}
      <aside className="hidden md:flex flex-col items-center justify-between w-[76px] shrink-0 h-screen sticky top-0 bg-white border-r-2 border-[#E5E5E5] py-5 z-40">
        {/* Top Brand Mark */}
        <div className="flex flex-col items-center gap-6">
          <Link
            to="/dashboard"
            className="w-11 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 active:translate-y-0.5 text-white flex items-center justify-center font-black text-base shadow-[0_4px_0_0_#1D4ED8] transition-all cursor-pointer"
            title="CodeAbroad Tokyo Hub"
          >
            CA
          </Link>

          {/* Navigation Icon List */}
          <nav className="flex flex-col items-center gap-2">
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
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-2xs'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Settings, Logout & Profile Avatar */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            className="w-10 h-10 rounded-xl border-2 border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl border-2 border-slate-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-colors cursor-pointer"
            title="Keluar (Sign Out)"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <div title={user?.name || 'Profil Anda'}>
            <UserAvatar user={user} size="sm" style={avatar.style} />
          </div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t-2 border-[#E5E5E5] px-4 py-2 z-40 flex items-center justify-around">
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
                isActive ? 'text-blue-600 font-black' : 'text-slate-400'
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
