import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpenText,
  Cards,
  SquaresFour,
  Translate,
} from '@phosphor-icons/react'
import { LANDING_FEATURES, type LandingFeatureItem } from '@/features/landing/data/landingContent'

const ICON_BY_FEATURE_ID = {
  'feat-curriculum': SquaresFour,
  'feat-kana': Translate,
  'feat-flashcards': Cards,
  'feat-grammar': BookOpenText,
} as const

const ACCENT_STYLES: Record<
  LandingFeatureItem['accent'],
  { badge: string; iconBox: string; link: string }
> = {
  blue: {
    badge: 'bg-blue-50 border-blue-200 text-blue-700',
    iconBox: 'bg-blue-600 text-white shadow-[0_4px_0_0_#1D4ED8]',
    link: 'text-blue-600 group-hover:text-blue-700',
  },
  emerald: {
    badge: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    iconBox: 'bg-emerald-600 text-white shadow-[0_4px_0_0_#047857]',
    link: 'text-emerald-600 group-hover:text-emerald-700',
  },
  sky: {
    badge: 'bg-sky-50 border-sky-200 text-sky-700',
    iconBox: 'bg-sky-600 text-white shadow-[0_4px_0_0_#0369A1]',
    link: 'text-sky-600 group-hover:text-sky-700',
  },
  amber: {
    badge: 'bg-amber-50 border-amber-200 text-amber-700',
    iconBox: 'bg-amber-500 text-white shadow-[0_4px_0_0_#B45309]',
    link: 'text-amber-600 group-hover:text-amber-700',
  },
}

export const LandingFeatureShowcase = () => {
  return (
    <section id="fitur" className="py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-4xl font-brand font-black text-slate-900 tracking-tight">
            Semua Modul Utama Bisa Kamu Cek Dulu
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Klik kartu di bawah untuk langsung masuk ke aplikasi dalam{' '}
            <strong>Mode Coba Tanpa Login</strong> dan lihat isinya sebelum membuat akun.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {LANDING_FEATURES.map((feat) => {
            const Icon =
              ICON_BY_FEATURE_ID[feat.id as keyof typeof ICON_BY_FEATURE_ID] ?? SquaresFour
            const styles = ACCENT_STYLES[feat.accent]

            return (
              <Link
                key={feat.id}
                to={feat.href}
                className="group bg-white border-2 border-slate-200/95 hover:border-blue-300 rounded-3xl p-6 shadow-[0_6px_0_0_#E2E8F0] hover:shadow-[0_8px_0_0_#CBD5E1] hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${styles.iconBox}`}
                    >
                      <Icon weight="duotone" className="w-6 h-6" />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full border text-[11px] font-brand font-black uppercase tracking-wider ${styles.badge}`}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-brand font-black text-slate-900">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 text-sm font-brand font-black ${styles.link}`}
                >
                  <span>{feat.ctaLabel}</span>
                  <ArrowRight
                    weight="bold"
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
