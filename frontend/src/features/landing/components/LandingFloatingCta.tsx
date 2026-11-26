import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from '@phosphor-icons/react'
import { useAuthStore } from '@/features/auth/store/authStore'

export const LandingFloatingCta = () => {
  const [heroPassed, setHeroPassed] = useState(false)
  const [roadmapVisible, setRoadmapVisible] = useState(false)
  const [bottomVisible, setBottomVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return
    }

    const heroEl = document.getElementById('hero-section')
    const roadmapEl = document.getElementById('rute-belajar')
    const bottomEl = document.getElementById('landing-bottom-cta')

    const heroObserver = new IntersectionObserver(
      ([heroEntry]) => {
        if (!heroEntry) return
        setHeroPassed(!heroEntry.isIntersecting && heroEntry.boundingClientRect.top < 0)
      },
      { threshold: 0 }
    )

    const roadmapObserver = new IntersectionObserver(
      ([roadmapEntry]) => {
        if (!roadmapEntry) return
        setRoadmapVisible(roadmapEntry.isIntersecting)
      },
      { threshold: 0.15 }
    )

    const bottomObserver = new IntersectionObserver(
      ([bottomEntry]) => {
        if (!bottomEntry) return
        setBottomVisible(bottomEntry.isIntersecting || bottomEntry.boundingClientRect.top < 0)
      },
      { threshold: 0 }
    )

    if (heroEl) heroObserver.observe(heroEl)
    if (roadmapEl) roadmapObserver.observe(roadmapEl)
    if (bottomEl) bottomObserver.observe(bottomEl)

    return () => {
      heroObserver.disconnect()
      roadmapObserver.disconnect()
      bottomObserver.disconnect()
    }
  }, [])

  const isLoggedIn = isAuthenticated && Boolean(user)
  const targetPath =
    isLoggedIn && user ? (user.is_onboarded ? '/curriculum' : '/onboarding') : '/curriculum'
  const ctaLabel = isLoggedIn && user ? 'Lanjut Belajar' : 'Coba Unit 1 Gratis'

  return (
    <AnimatePresence>
      {heroPassed && !roadmapVisible && !bottomVisible && (
        <motion.div
          key="landing-floating-cta"
          initial={shouldReduceMotion ? { opacity: 0 } : { y: 80, opacity: 0, scale: 0.94 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { y: 80, opacity: 0, scale: 0.94 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.08 }
              : { type: 'spring', stiffness: 320, damping: 22 }
          }
          className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto max-w-[calc(100vw-2rem)]"
        >
          <Link
            to={targetPath}
            className="max-w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-base font-brand font-black shadow-[0_5px_0_0_#1E40AF,0_14px_28px_-6px_rgba(37,99,235,0.45)] active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
          >
            <span>{ctaLabel}</span>
            <ArrowRight
              weight="bold"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
