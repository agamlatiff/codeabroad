import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'

export const LandingBottomCta = () => {
  return (
    <section
      id="landing-bottom-cta"
      aria-labelledby="landing-bottom-cta-heading"
      className="relative bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#0284C7] text-white overflow-hidden"
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20 sm:pt-14 sm:pb-24 text-center space-y-6 relative z-10">
        <div className="flex justify-center">
          <KodiCharacter emotion="celebrate" size={96} interactive={false} />
        </div>

        <h2
          id="landing-bottom-cta-heading"
          className="text-3xl sm:text-[48px] font-brand font-black tracking-tight leading-[1.12]"
        >
          Siap ucapkan kalimat pertamamu?
        </h2>

        <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
          Langsung buka peta kurikulum untuk mencoba pelajaran Unit 1 gratis tanpa daftar, atau buat
          akun supaya progresmu tersimpan rapi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            to="/curriculum"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-blue-50 text-[#1D4ED8] px-8 py-4 text-base font-brand font-black shadow-[0_5px_0_0_rgba(15,23,42,0.18)] active:translate-y-0.5 active:shadow-none transition-all"
          >
            Coba Unit 1 Gratis
            <ArrowRight weight="bold" className="w-4 h-4" />
          </Link>

          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/12 hover:bg-white/20 border border-white/30 text-white px-7 py-4 text-base font-brand font-bold transition-colors"
          >
            Buat Akun Gratis
          </Link>
        </div>
      </div>
    </section>
  )
}
