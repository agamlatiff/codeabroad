import { LandingNavbar } from '@/features/landing/components/LandingNavbar'
import { LandingHero } from '@/features/landing/components/LandingHero'
import { LandingLanguageTracksSection } from '@/features/landing/components/LandingLanguageTracksSection'
import { LandingInteractiveDemo } from '@/features/landing/components/LandingInteractiveDemo'
import { LandingFeatureShowcase } from '@/features/landing/components/LandingFeatureShowcase'
import { LandingGuestVsAccountSection } from '@/features/landing/components/LandingGuestVsAccountSection'
import { LandingFooter } from '@/features/landing/components/LandingFooter'

/**
 * Public Landing Page (/) presenting Merantalk's global multi-language tracks,
 * an interactive mini trial right on the page, and direct friction-free entry into
 * Guest Preview Mode or free account registration.
 */
export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans selection:bg-blue-600/20">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingLanguageTracksSection />
        <LandingInteractiveDemo />
        <LandingFeatureShowcase />
        <LandingGuestVsAccountSection />
      </main>
      <LandingFooter />
    </div>
  )
}
