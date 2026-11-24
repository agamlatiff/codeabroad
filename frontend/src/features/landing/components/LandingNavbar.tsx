import { Link } from 'react-router-dom'
import { ArrowRight, SignIn, UserPlus } from '@phosphor-icons/react'
import { Logo } from '@/shared/components/ui/Logo'
import { useAuthStore } from '@/features/auth/store/authStore'

export const LandingNavbar = () => {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated && Boolean(s.user))

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-sm border-b border-black/10 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-4">
        <Logo size="sm" variant="blue" linkTo="/" />

        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7 text-[15px] font-semibold text-[#1E293B]"
        >
          <a
            href="#bahasa"
            className="landing-link-sweep pb-0.5 hover:text-[#2563EB] focus-visible:text-[#2563EB] focus-visible:outline-none"
          >
            Bahasa
          </a>
          <a
            href="#fitur"
            className="landing-link-sweep pb-0.5 hover:text-[#2563EB] focus-visible:text-[#2563EB] focus-visible:outline-none"
          >
            Fitur
          </a>
          <a
            href="#coba-kilat"
            className="landing-link-sweep pb-0.5 hover:text-[#2563EB] focus-visible:text-[#2563EB] focus-visible:outline-none"
          >
            Coba Live
          </a>
          <a
            href="#metode"
            className="landing-link-sweep pb-0.5 hover:text-[#2563EB] focus-visible:text-[#2563EB] focus-visible:outline-none"
          >
            Metode
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {isAuthenticated && user ? (
            <Link
              to={user.is_onboarded ? '/curriculum' : '/onboarding'}
              className="inline-flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-brand font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
            >
              Lanjut Belajar
              <ArrowRight weight="bold" className="w-4 h-4" aria-hidden="true" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-[14px] px-4 py-2.5 text-sm font-semibold text-[#1E293B] border border-black/15 hover:bg-black/[0.04] active:scale-[0.98] transition-all inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
              >
                <SignIn weight="bold" className="w-4 h-4" aria-hidden="true" />
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-[14px] px-4 py-2.5 text-sm font-brand font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] transition-all inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
              >
                <UserPlus weight="bold" className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Daftar Gratis</span>
                <span className="sm:hidden">Daftar</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
