import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretRight, X } from '@phosphor-icons/react'

export const LandingHelloBar = () => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div
      role="region"
      aria-label="Pengumuman"
      className="min-h-[41px] w-full bg-[#FAFAFA] border-b border-black/10 text-xs sm:text-sm text-[#475569] px-3 sm:px-4 py-2 relative z-40 flex items-center"
    >
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-center relative min-w-0">
        <p className="min-w-0 flex-1 pr-8 sm:px-9 text-center leading-snug text-xs sm:text-sm">
          <span className="sm:hidden">Mulai N5 / A1 tanpa login · Gratis dengan akun.</span>
          <span className="hidden sm:inline">
            Belajar bahasa untuk karier, beasiswa &amp; merantau — mulai N5 / A1 tanpa login, dasar hingga menengah gratis dengan akun.
          </span>
          <Link
            to="/curriculum"
            className="ml-1.5 font-brand font-bold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-0.5 whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 transition-colors"
          >
            <span>Coba Gratis</span>
            <CaretRight weight="bold" className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </Link>
        </p>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Tutup pengumuman"
          className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-full text-[#64748B] hover:text-[#1E293B] hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 transition-colors cursor-pointer"
        >
          <X weight="bold" className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
