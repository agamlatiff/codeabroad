import { MotionConfig } from 'motion/react'
import { LandingHelloBar } from '@/features/landing/components/LandingHelloBar'
import { LandingNavbar } from '@/features/landing/components/LandingNavbar'
import { LandingHero } from '@/features/landing/components/LandingHero'
import { LandingConstellationSection } from '@/features/landing/components/LandingConstellationSection'
import { LandingFeatureShowcase } from '@/features/landing/components/LandingFeatureShowcase'
import { LandingGoalRoadmapSection } from '@/features/landing/components/LandingGoalRoadmapSection'
import { LandingPhraseShowcaseBand } from '@/features/landing/components/LandingPhraseShowcaseBand'
import { LandingMethodTrustSection } from '@/features/landing/components/LandingMethodTrustSection'
import { LandingBottomCta } from '@/features/landing/components/LandingBottomCta'
import { LandingFooter } from '@/features/landing/components/LandingFooter'
import { LandingFloatingCta } from '@/features/landing/components/LandingFloatingCta'

export const LandingPage = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white text-[#1E293B] font-sans selection:bg-blue-600/20">
        <LandingHelloBar />
        <LandingNavbar />
        <main>
          <LandingHero />
          <LandingConstellationSection />
          <LandingFeatureShowcase />
          <LandingGoalRoadmapSection />
          <LandingPhraseShowcaseBand />
          <LandingMethodTrustSection />
          <LandingBottomCta />
        </main>
        <LandingFooter />
        <LandingFloatingCta />
      </div>
    </MotionConfig>
  )
}
