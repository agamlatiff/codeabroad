import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from '@phosphor-icons/react'
import { MeraTrioSquad } from '@/shared/components/ui/MeraShowcaseFigures'

export const LandingBottomCta = () => {
  const shouldReduceMotion = Boolean(useReducedMotion())

  return (
    <section
      id="landing-bottom-cta"
      aria-labelledby="landing-bottom-cta-heading"
      className="landing-cv-section relative bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#0284C7] text-white overflow-hidden"
    >
      {/* ClassDojo-style Curved White SVG Top Mask */}
      <svg
        viewBox="0 0 1292 55"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block w-full h-8 sm:h-14 text-white fill-current"
      >
        <path d="M0,0 L1292,0 C960,52 332,52 0,0 Z" />
      </svg>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16 sm:pt-14 sm:pb-24 text-center space-y-5 sm:space-y-6 relative z-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
          }
          className="relative flex justify-center pt-1"
        >
          {/* Subtle crisp light backdrop aura behind the white cat trio */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[44%] w-[270px] sm:w-[340px] h-[122px] sm:h-[146px] rounded-full bg-gradient-to-b from-white/30 via-sky-200/25 to-white/10 blur-xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 bottom-1 -translate-x-1/2 w-[240px] sm:w-[308px] h-7 sm:h-8 rounded-full bg-white/25 border border-white/30 shadow-[0_0_28px_rgba(255,255,255,0.28)]"
          />
          <MeraTrioSquad
            activeMood="excited"
            centerBadge="GO"
            className="relative z-10 scale-90 sm:scale-100 origin-bottom"
          />
        </motion.div>

        <h2
          id="landing-bottom-cta-heading"
          className="text-3xl sm:text-[46px] lg:text-[48px] font-brand font-black tracking-tight leading-[1.12]"
        >
          Siap ucapkan kalimat pertamamu?
        </h2>

        <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
          Langsung buka peta kurikulum untuk mencoba pelajaran Unit 1 gratis tanpa daftar, atau buat
          akun supaya progresmu tersimpan rapi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-md sm:max-w-none mx-auto">
          <Link
            to="/curriculum"
            className="w-full sm:w-auto sm:min-w-[216px] inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-blue-50 text-[#1D4ED8] px-8 py-3.5 sm:py-4 text-base font-brand font-black shadow-[0_5px_0_0_rgba(15,23,42,0.18)] active:translate-y-0.5 active:shadow-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D4ED8]"
          >
            <span>Coba Unit 1 Gratis</span>
            <ArrowRight weight="bold" className="w-4 h-4 shrink-0" aria-hidden="true" />
          </Link>

          <Link
            to="/register"
            className="w-full sm:w-auto sm:min-w-[196px] inline-flex items-center justify-center gap-2 rounded-full bg-white/15 hover:bg-white/25 border-2 border-white/35 text-white px-7 py-3.5 sm:py-4 text-base font-brand font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D4ED8]"
          >
            Buat Akun Gratis
          </Link>
        </div>
      </div>
    </section>
  )
}
