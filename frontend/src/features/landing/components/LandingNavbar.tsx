import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, List, SignIn, UserPlus, X } from '@phosphor-icons/react'
import { Logo } from '@/shared/components/ui/Logo'
import { useAuthStore } from '@/features/auth/store/authStore'

const NAV_LINKS = [
  { href: '#bahasa', label: 'Bahasa' },
  { href: '#fitur', label: 'Fitur' },
  { href: '#rute-belajar', label: 'Rute Belajar' },
  { href: '#metode', label: 'Metode' },
] as const

export const LandingNavbar = () => {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated && Boolean(s.user))
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const shouldReduceMotion = Boolean(useReducedMotion())

  const headerRef = useRef<HTMLElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  const continuePath = user?.is_onboarded ? '/curriculum' : '/onboarding'

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        toggleButtonRef.current?.focus()
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    mediaQuery.addEventListener('change', handleBreakpointChange)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
      mediaQuery.removeEventListener('change', handleBreakpointChange)
    }
  }, [isMobileMenuOpen])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-sm border-b border-black/10 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-2 sm:gap-4">
        <div className="shrink-0">
          <Logo size="sm" variant="blue" linkTo="/" />
        </div>

        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7 text-[15px] font-semibold text-[#1E293B]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="landing-link-sweep pb-0.5 hover:text-[#2563EB] focus-visible:text-[#2563EB] focus-visible:outline-none"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {isAuthenticated && user ? (
              <Link
                to={continuePath}
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
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile & Small Tablet Primary CTA + Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && user ? (
              <Link
                to={continuePath}
                onClick={closeMobileMenu}
                className="rounded-[12px] px-3 py-2 text-xs font-brand font-black text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] transition-all inline-flex items-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
              >
                Lanjut
              </Link>
            ) : (
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="rounded-[12px] px-3 py-2 text-xs font-brand font-black text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] transition-all inline-flex items-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
              >
                Daftar
              </Link>
            )}

            <button
              ref={toggleButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="landing-mobile-nav"
              aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-[#1E293B] hover:bg-slate-50 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X weight="bold" className="w-5 h-5" aria-hidden="true" />
              ) : (
                <List weight="bold" className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="landing-mobile-nav"
            key="landing-mobile-nav"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
            }
            className="md:hidden absolute top-full inset-x-0 border-t border-slate-200/80 bg-white/98 backdrop-blur-md shadow-[0_14px_28px_-10px_rgba(15,23,42,0.12)] px-4 pt-3 pb-5"
          >
            <nav aria-label="Navigasi seluler" className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block py-2.5 px-3 rounded-xl text-sm font-brand font-bold text-[#1E293B] hover:bg-slate-50 hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-3 pt-3 border-t border-slate-200/80">
              {isAuthenticated && user ? (
                <Link
                  to={continuePath}
                  onClick={closeMobileMenu}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-brand font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
                >
                  Lanjut Belajar
                  <ArrowRight weight="bold" className="w-4 h-4" aria-hidden="true" />
                </Link>
              ) : (
                <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2.5">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-[14px] px-4 py-2.5 text-sm font-semibold text-[#1E293B] border border-black/15 hover:bg-black/[0.04] active:scale-[0.98] transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
                  >
                    <SignIn weight="bold" className="w-4 h-4" aria-hidden="true" />
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-[14px] px-4 py-2.5 text-sm font-brand font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
                  >
                    <UserPlus weight="bold" className="w-4 h-4" aria-hidden="true" />
                    Daftar Gratis
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
