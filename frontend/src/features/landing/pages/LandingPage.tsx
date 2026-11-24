import { MotionConfig } from 'motion/react'
import { LandingNavbar } from '@/features/landing/components/LandingNavbar'
import { LandingHero } from '@/features/landing/components/LandingHero'
import { LandingGreetingMarquee } from '@/features/landing/components/LandingGreetingMarquee'
import { LandingLanguageTracksSection } from '@/features/landing/components/LandingLanguageTracksSection'
import { LandingFeatureShowcase } from '@/features/landing/components/LandingFeatureShowcase'
import { LandingInteractiveDemo } from '@/features/landing/components/LandingInteractiveDemo'
import { LandingFooter } from '@/features/landing/components/LandingFooter'

/**
 * Public Landing Page (/) designed with Tactile Learning Studio aesthetics:
 * product-as-hero 3D card deck, subtle multi-language marquee, editorial split
 * feature previews with SVG motion graphics, and friction-free Guest Trial entry.
 */
export const LandingPage = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans selection:bg-blue-600/20">
        <LandingNavbar />
        <main>
          <LandingHero />
          <LandingGreetingMarquee />
          <LandingLanguageTracksSection />
          <LandingFeatureShowcase />
          <LandingInteractiveDemo />
        </main>
        <LandingFooter />
      </div>
    </MotionConfig>
  )
}
