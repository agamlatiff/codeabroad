import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from '@phosphor-icons/react'
import { useAuthStore } from '@/features/auth/store/authStore'

export const LandingFloatingCta = () => {
  const [heroPassed, setHeroPassed] = useState(false)
  const [bottomVisible, setBottomVisible] = useState(false)

  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return
    }

    const heroEl = document.getElementById('hero-section')
    const bottomEl = document.getElementById('landing-bottom-cta')

    const heroObserver = new IntersectionObserver(
      ([heroEntry]) => {
        if (!heroEntry) return
        setHeroPassed(!heroEntry.isIntersecting && heroEntry.boundingClientRect.top < 0)
      },
      { threshold: 0 }
    )

    const bottomObserver = new IntersectionObserver(
      ([bottomEntry]) => {
        if (!bottomEntry) return
        setBottomVisible(bottomEntry.isIntersecting)
      },
      { threshold: 0 }
    )

    if (heroEl) heroObserver.observe(heroEl)
    if (bottomEl) bottomObserver.observe(bottomEl)

    return () => {
      heroObserver.disconnect()
      bottomObserver.disconnect()
    }
  }, [])

  const isLoggedIn = isAuthenticated && Boolean(user)
  const targetPath =
    isLoggedIn && user ? (user.is_onboarded ? '/curriculum' : '/onboarding') : '/curriculum'
  const ctaLabel = isLoggedIn && user ? 'Lanjut Belajar' : 'Coba Unit 1 Gratis'

  return (
    <AnimatePresence>
      {heroPassed && !bottomVisible && (
        <motion.div
          key="landing-floating-cta"
          initial={{ y: 80, opacity: 0, scale: 0.94 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
        >
          <Link
            to={targetPath}
            className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3.5 text-sm sm:text-base font-brand font-black shadow-[0_5px_0_0_#1E40AF,0_14px_28px_-6px_rgba(37,99,235,0.45)] active:translate-y-0.5 transition-all whitespace-nowrap"
          >
            <span>{ctaLabel}</span>
            <ArrowRight weight="bold" className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
