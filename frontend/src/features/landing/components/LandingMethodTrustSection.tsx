import { useId } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ShieldCheck } from '@phosphor-icons/react'
import { MeraTimekeeperFigure } from '@/shared/components/ui/MeraShowcaseFigures'
import {
  LandingStickerIcon,
  type StickerArtKind,
} from '@/features/landing/components/LandingStickerArt'

interface TrustPillar {
  id: string
  stickerKind: StickerArtKind
  badge: string
  title: string
  description: string
  cardClass: string
  iconNestClass: string
  badgeClass: string
}

const TRUST_PILLARS: readonly TrustPillar[] = [
  {
    id: 'pillar-curriculum',
    stickerKind: 'certificate',
    badge: '6 Jalur Resmi',
    title: 'Jalur Terstruktur Resmi',
    description:
      'Mengacu format ujian JLPT N5-N1, IELTS/TOEFL, Goethe A1-C1, HSK, dan DELF.',
    cardClass: 'border-sky-200 shadow-[0_5px_0_0_#BAE6FD]',
    iconNestClass: 'bg-sky-50/90 border-sky-100',
    badgeClass: 'bg-sky-50 border-sky-200 text-sky-800',
  },
  {
    id: 'pillar-guest',
    stickerKind: 'star-target',
    badge: 'Gratis Tanpa Login',
    title: 'Coba Unit 1 Tanpa Daftar',
    description:
      'Peta belajar, audio kalimat, papan aksara, dan dek flashcard bisa langsung dicoba bebas.',
    cardClass: 'border-emerald-200 shadow-[0_5px_0_0_#A7F3D0]',
    iconNestClass: 'bg-emerald-50/90 border-emerald-100',
    badgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  },
  {
    id: 'pillar-adaptive',
    stickerKind: 'clock',
    badge: 'Jadwal SRS',
    title: 'Jadwal Ulasan Adaptif',
    description:
      'Materi yang belum mantap dijadwalkan ulang otomatis saat kamu belajar memakai akun gratis.',
    cardClass: 'border-amber-200 shadow-[0_5px_0_0_#FDE68A]',
    iconNestClass: 'bg-amber-50/90 border-amber-100',
    badgeClass: 'bg-amber-50 border-amber-200 text-amber-800',
  },
]

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const

export const LandingMethodTrustSection = () => {
  const rawId = useId()
  const blobGradId = `${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}-trust-blob`
  const shouldReduceMotion = Boolean(useReducedMotion())

  return (
    <section
      id="metode"
      aria-labelledby="metode-heading"
      className="bg-white py-14 sm:py-24 px-4 sm:px-6 overflow-x-clip scroll-mt-20"
    >
      <div className="max-w-[1120px] mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Copy Column */}
        <div className="lg:col-span-5 text-center lg:text-left space-y-5">
          <div className="flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-brand font-black uppercase tracking-wider text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
              Standar Merantalk
            </span>
          </div>

          <h2
            id="metode-heading"
            className="text-3xl sm:text-[42px] lg:text-[44px] font-brand font-black text-[#1E293B] leading-[1.14] tracking-tight"
          >
            Belajar terukur, tanpa paksaan
          </h2>

          <p className="text-base sm:text-[18px] text-[#475569] leading-[1.55] max-w-xl mx-auto lg:mx-0">
            Merantalk membagi materi sertifikasi bahasa menjadi pelajaran singkat 3-5 menit dengan
            pengantar kosakata yang jelas. Uji Unit 1 secara bebas tanpa login, lalu buat akun
            gratis kapan pun kamu ingin menyimpan progres dan jadwal ulasan.
          </p>

          <div className="pt-1 flex justify-center lg:justify-start">
            <Link
              to="/curriculum"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-[#EFF6FF] border-2 border-blue-200 px-6 py-3 text-sm sm:text-[15px] font-brand font-black text-[#2563EB] shadow-[0_4px_0_0_#DBEAFE] active:translate-y-0.5 active:shadow-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
            >
              <span>Buka Peta Kurikulum</span>
              <ArrowRight weight="bold" className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Right Tactile Trust Showcase Stage */}
        <div className="lg:col-span-7 relative py-4 sm:py-6 px-2 sm:px-5">
          {/* Organic Pastel Blob Backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 sm:inset-x-1 sm:inset-y-1 flex items-center justify-center z-0 select-none"
          >
            <svg
              viewBox="0 0 600 440"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id={blobGradId} x1="8%" y1="6%" x2="92%" y2="94%">
                  <stop offset="0%" stopColor="#ECFDF5" />
                  <stop offset="52%" stopColor="#EFF6FF" />
                  <stop offset="100%" stopColor="#E0F2FE" />
                </linearGradient>
              </defs>
              <path
                d="M 76 74 C 154 16, 314 10, 444 40 C 548 64, 588 144, 574 252 C 560 360, 466 424, 318 424 C 170 424, 52 386, 26 286 C 4 200, 16 120, 76 74 Z"
                fill={`url(#${blobGradId})`}
              />
              <ellipse cx="492" cy="88" rx="68" ry="46" fill="#D1FAE5" fillOpacity="0.48" />
              <ellipse cx="104" cy="368" rx="74" ry="42" fill="#BAE6FD" fillOpacity="0.34" />
            </svg>
          </div>

          {/* Grounded Mera Header Crest */}
          <div className="relative z-10 flex items-end justify-between gap-3 sm:gap-4 px-1 sm:px-2 mb-4">
            <div className="inline-flex items-center gap-2.5 sm:gap-3 rounded-2xl bg-white/95 border-2 border-emerald-200 shadow-[0_4px_0_0_#D1FAE5] px-3 py-2 sm:px-4 sm:py-3 min-w-0">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <ShieldCheck weight="fill" className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-brand font-black text-sm sm:text-[15px] text-[#1E293B] leading-tight">
                  Standar Belajar Transparan
                </p>
                <p className="text-xs font-semibold text-emerald-700 leading-snug mt-0.5">
                  Tanpa trik berlangganan
                </p>
              </div>
            </div>

            <MeraTimekeeperFigure mood="happy" size={112} badgeText="6 Track" className="shrink-0" />
          </div>

          {/* 3 Tactile Color-Coded 3D Pillar Cards */}
          <div className="relative z-10 space-y-3.5">
            {TRUST_PILLARS.map((pillar, index) => (
              <motion.div
                key={pillar.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 0.42, delay: index * 0.09, ease: REVEAL_EASE }
                }
              >
                <div
                  className={`rounded-[24px] bg-white border-2 p-4 sm:p-5 flex items-start sm:items-center gap-4 transition-transform duration-200 motion-safe:hover:-translate-y-0.5 ${pillar.cardClass}`}
                >
                  <div
                    className={`w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-2xl border flex items-center justify-center shrink-0 ${pillar.iconNestClass}`}
                  >
                    <LandingStickerIcon kind={pillar.stickerKind} size={46} />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15px] sm:text-base font-brand font-black text-[#1E293B] leading-snug">
                        {pillar.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-brand font-bold tracking-wide whitespace-nowrap ${pillar.badgeClass}`}
                      >
                        {pillar.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
