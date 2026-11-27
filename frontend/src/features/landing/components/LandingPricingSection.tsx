import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  Compass,
  Crown,
  Sparkle,
  UserCircle,
} from '@phosphor-icons/react'

type BillingCycle = 'monthly' | 'semiannual' | 'annual'

interface BillingOption {
  id: BillingCycle
  label: string
  badge: string
  originalPrice: string
  finalPrice: string
  periodLabel: string
  equivalentLabel: string
}

const BILLING_OPTIONS: readonly BillingOption[] = [
  {
    id: 'monthly',
    label: 'Bulanan',
    badge: 'Hemat 42%',
    originalPrice: 'Rp 85.000',
    finalPrice: 'Rp 49.000',
    periodLabel: '/ bln',
    equivalentLabel: 'Fleksibel, batal kapan saja',
  },
  {
    id: 'semiannual',
    label: '6 Bulan',
    badge: 'Paling Populer',
    originalPrice: 'Rp 510.000',
    finalPrice: 'Rp 239.000',
    periodLabel: '/ 6 bln',
    equivalentLabel: '~Rp 39.800/bln',
  },
  {
    id: 'annual',
    label: 'Tahunan',
    badge: 'Terhemat',
    originalPrice: 'Rp 1.020.000',
    finalPrice: 'Rp 399.000',
    periodLabel: '/ thn',
    equivalentLabel: '~Rp 33.250/bln',
  },
] as const

const GUEST_FEATURES = [
  'Akses materi dasar N5 tanpa perlu akun',
  'Latihan kosakata, tata bahasa & audio penutur asli',
  'Coba langsung Flashcard & kuis interaktif',
] as const

const FREE_ACCOUNT_FEATURES = [
  'Akses penuh kurikulum N5, N4 hingga N3',
  'Progres, XP & streak tersimpan lintas perangkat',
  'Kartu kosakata yang muncul lagi tepat sebelum kamu lupa',
  'Belajar bertahap mengikuti rute unit',
] as const

const PRO_FEATURES = [
  'Akses penuh seluruh level N5 hingga N1',
  'Bebas lompat ke unit atau materi mana saja',
  'Jalur khusus karier, wawancara & beasiswa',
  'Latihan ulang tanpa batas sampai benar-benar hafal',
] as const

export const LandingPricingSection = () => {
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('semiannual')

  const activePlan =
    BILLING_OPTIONS.find((option) => option.id === selectedCycle) ?? BILLING_OPTIONS[1]

  return (
    <section
      id="pricing"
      aria-labelledby="landing-pricing-heading"
      className="bg-[#FAFAF9] border-y border-slate-200/80 py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20"
    >
      <div className="max-w-[1140px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300/80 px-3.5 py-1 text-xs font-brand font-bold text-amber-900">
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
            <span>Transparan &amp; Tanpa Biaya Tersembunyi</span>
          </div>

          <h2
            id="landing-pricing-heading"
            className="mt-4 font-brand font-black text-[#1E293B] text-2xl sm:text-4xl lg:text-[42px] leading-[1.15] tracking-tight"
          >
            Mulai gratis, naik kelas saat siap merantau.
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-lg font-medium text-[#475569] leading-relaxed">
            Coba N5 tanpa login, lanjut N4–N3 gratis dengan akun, atau buka N2–N1 &amp; kebebasan
            lompat unit dengan Merantalk Pro.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <div
            role="group"
            aria-label="Pilih siklus langganan Merantalk Pro"
            className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 rounded-2xl bg-white border-2 border-slate-200/90 p-1.5 shadow-[0_4px_0_0_#E2E8F0] max-w-full"
          >
            {BILLING_OPTIONS.map((option) => {
              const isActive = option.id === selectedCycle

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCycle(option.id)}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-brand font-bold transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-[0_3px_0_0_#1D4ED8]'
                      : 'text-[#475569] hover:text-[#1E293B] hover:bg-slate-50'
                  }`}
                >
                  <span>{option.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-bold whitespace-nowrap leading-none ${
                      isActive
                        ? 'bg-amber-300 text-amber-950'
                        : 'bg-amber-50 text-amber-800 border border-amber-200/90'
                    }`}
                  >
                    {option.badge}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {/* Card 1: Tamu */}
          <div className="flex flex-col rounded-[24px] bg-white border-2 border-slate-200/90 shadow-[0_4px_0_0_#E2E8F0] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 text-[#475569] shrink-0">
                  <Compass weight="duotone" className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-brand font-black text-lg text-[#1E293B] leading-tight">
                    Tamu
                  </h3>
                  <p className="text-xs font-semibold text-[#64748B]">Level N5 · Tanpa Login</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-[#475569] whitespace-nowrap">
                N5
              </span>
            </div>

            <div className="mt-6 pb-6 border-b border-slate-100">
              <div className="flex items-baseline gap-1.5">
                <span className="font-brand font-black text-3xl sm:text-4xl text-[#1E293B] tracking-tight">
                  Rp 0
                </span>
                <span className="text-sm font-semibold text-[#64748B]">/ selamanya</span>
              </div>
              <p className="mt-2 text-xs sm:text-sm font-medium text-[#64748B]">
                Langsung coba belajar N5 tanpa daftar atau kartu kredit.
              </p>
            </div>

            <ul className="mt-6 space-y-3 flex-1">
              {GUEST_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm font-medium text-[#334155]">
                  <CheckCircle
                    weight="fill"
                    className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/curriculum"
              className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 text-[#1E293B] px-5 py-3 text-sm font-brand font-bold shadow-[0_4px_0_0_#E2E8F0] active:translate-y-0.5 active:shadow-none transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
            >
              <span>Coba N5 Gratis</span>
              <ArrowRight weight="bold" className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>

          {/* Card 2: Akun Gratis */}
          <div className="flex flex-col rounded-[24px] bg-white border-2 border-slate-200/90 shadow-[0_4px_0_0_#E2E8F0] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] shrink-0">
                  <UserCircle weight="duotone" className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-brand font-black text-lg text-[#1E293B] leading-tight">
                    Akun Gratis
                  </h3>
                  <p className="text-xs font-semibold text-[#64748B]">Level N5–N3 · Gratis</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-1 text-[11px] font-bold text-[#2563EB] whitespace-nowrap">
                N5–N3
              </span>
            </div>

            <div className="mt-6 pb-6 border-b border-slate-100">
              <div className="flex items-baseline gap-1.5">
                <span className="font-brand font-black text-3xl sm:text-4xl text-[#1E293B] tracking-tight">
                  Rp 0
                </span>
                <span className="text-sm font-semibold text-[#64748B]">/ dengan akun</span>
              </div>
              <p className="mt-2 text-xs sm:text-sm font-medium text-[#64748B]">
                Fondasi kuat untuk persiapan magang, kerja dasar &amp; JLPT N3.
              </p>
            </div>

            <ul className="mt-6 space-y-3 flex-1">
              {FREE_ACCOUNT_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm font-medium text-[#334155]">
                  <CheckCircle
                    weight="fill"
                    className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#93C5FD] bg-blue-50/70 hover:bg-blue-50 text-[#1D4ED8] px-5 py-3 text-sm font-brand font-bold shadow-[0_4px_0_0_#BFDBFE] active:translate-y-0.5 active:shadow-none transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
            >
              <span>Daftar Akun Gratis</span>
              <ArrowRight weight="bold" className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>

          {/* Card 3: Merantalk Pro */}
          <div className="relative flex flex-col rounded-[24px] bg-white border-2 border-[#2563EB] shadow-[0_6px_0_0_#1D4ED8] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#2563EB] text-white shrink-0">
                  <Crown weight="fill" className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-brand font-black text-lg text-[#1E293B] leading-tight">
                    Merantalk Pro
                  </h3>
                  <p className="text-xs font-semibold text-[#2563EB]">N5–N1 + Bebas Lompat Unit</p>
                </div>
              </div>
              <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-1 text-[11px] font-brand font-bold text-amber-900 whitespace-nowrap">
                {activePlan.badge}
              </span>
            </div>

            <div className="mt-6 pb-6 border-b border-blue-100/90">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#94A3B8] line-through">
                  {activePlan.originalPrice}
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 rounded-md px-1.5 py-0.5 whitespace-nowrap">
                  Harga Promo
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-brand font-black text-3xl sm:text-4xl text-[#1E293B] tracking-tight">
                  {activePlan.finalPrice}
                </span>
                <span className="text-sm font-semibold text-[#64748B]">
                  {activePlan.periodLabel}
                </span>
              </div>
              <p className="mt-1.5 text-xs sm:text-sm font-semibold text-[#2563EB]">
                {activePlan.equivalentLabel}
              </p>
            </div>

            <ul className="mt-6 space-y-3 flex-1">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm font-semibold text-[#1E293B]">
                  <CheckCircle
                    weight="fill"
                    className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/pricing"
              className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-3.5 text-sm font-brand font-black shadow-[0_4px_0_0_#1D4ED8] active:translate-y-0.5 active:shadow-none transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
            >
              <span>Mulai Merantalk Pro</span>
              <ArrowRight weight="bold" className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
