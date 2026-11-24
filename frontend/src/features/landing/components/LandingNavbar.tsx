import { Link } from 'react-router-dom'
import { ArrowRight, SignIn, UserPlus } from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { Logo } from '@/shared/components/ui/Logo'
import { useAuthStore } from '@/features/auth/store/authStore'

export const LandingNavbar = () => {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated && Boolean(s.user))

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF9]/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-7">
          <Logo size="sm" variant="blue" linkTo="/" />

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
            <a href="#bahasa" className="hover:text-blue-600 transition-colors">
              Bahasa
            </a>
            <a href="#fitur" className="hover:text-blue-600 transition-colors">
              Fitur
            </a>
            <a href="#coba-kilat" className="hover:text-blue-600 transition-colors">
              Coba Langsung
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {isAuthenticated && user ? (
            <Link to={user.is_onboarded ? '/curriculum' : '/onboarding'}>
              <Button3D
                variant="blue"
                size="sm"
                icon={<ArrowRight weight="bold" className="w-4 h-4" />}
              >
                Lanjut Belajar
              </Button3D>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button3D
                  variant="white"
                  size="sm"
                  icon={<SignIn weight="bold" className="w-4 h-4" />}
                >
                  Masuk
                </Button3D>
              </Link>
              <Link to="/register">
                <Button3D
                  variant="blue"
                  size="sm"
                  icon={<UserPlus weight="bold" className="w-4 h-4" />}
                >
                  <span className="hidden sm:inline">Daftar Gratis</span>
                  <span className="sm:hidden">Daftar</span>
                </Button3D>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
