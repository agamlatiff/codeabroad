import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  CheckCircle,
  Crown,
  LockOpen,
  ShieldCheck,
  Sparkle,
  X,
} from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { AppTopBar } from '@/shared/components/layout/top-bar/AppTopBar'
import { Button3D } from '@/shared/components/ui/Button3D'
import { useUser } from '@/features/user/hooks/useUser'
import { isUserPro } from '@/shared/utils/levelAccess'
import { triggerHaptic } from '@/shared/utils/haptics'

type BillingCycle = 'monthly' | 'semiannual' | 'annual'

interface ProBillingOption {
  id: BillingCycle
  label: string
  badge: string
  priceDisplay: string
  originalPrice: string
  perMonthNote: string
  summary: string
}

const PRO_BILLING_OPTIONS: ProBillingOption[] = [
  {
    id: 'monthly',
    label: 'Bulanan',
    badge: 'Hemat 42%',
    priceDisplay: 'Rp 49.000',
    originalPrice: 'Rp 85.000',
    perMonthNote: 'per bulan',
    summary: 'Cocok untuk mulai fokus persiapan JLPT N2–N1 dan bebas lompat unit tanpa komitmen panjang.',
  },
  {
    id: 'semiannual',
    label: '6 Bulan',
    badge: 'Paling Populer',
    priceDisplay: 'Rp 239.000',
    originalPrice: 'Rp 510.000',
    perMonthNote: '~Rp 39.800 / bulan',
    summary: 'Ideal untuk 1 siklus ujian JLPT Juli atau Desember dari awal sampai siap tes.',
  },
  {
    id: 'annual',
    label: 'Tahunan',
    badge: 'Terhemat',
    priceDisplay: 'Rp 399.000',
    originalPrice: 'Rp 1.020.000',
    perMonthNote: '~Rp 33.250 / bulan',
    summary: 'Pilihan terbaik untuk menuntaskan N2 hingga N1 serta persiapan kerja/beasiswa.',
  },
]

const COMPARISON_ROWS: Array<{
  feature: string
  guest: string
  free: string
  pro: string
}> = [
  {
    feature: 'Kurikulum Interaktif (4 Pilar)',
    guest: 'JLPT N5 (30 Unit)',
    free: 'JLPT N5, N4, N3 (50 Unit)',
    pro: 'Semua Level N5–N1 (70 Unit)',
  },
  {
    feature: 'Navigasi Unit Kurikulum',
    guest: 'Berurutan dari Unit 1',
    free: 'Berurutan dari Unit 1',
    pro: 'Bebas lompat ke unit mana pun tanpa harus urut',
  },
  {
    feature: 'Panduan Grammar & Slot Builder',
    guest: 'JLPT N5 (16 Materi)',
    free: 'JLPT N5, N4, N3 (36 Materi)',
    pro: 'Semua Level N5–N1 (56 Materi)',
  },
  {
    feature: 'Flashcard & Pengingat SRS',
    guest: 'JLPT N5 (40 Deck)',
    free: 'JLPT N5, N4, N3 (80 Deck)',
    pro: 'Semua Level N5–N1 (120 Deck)',
  },
  {
    feature: 'Aksara Hiragana, Katakana & Kanji',
    guest: 'Penuh',
    free: 'Penuh',
    pro: 'Penuh',
  },
  {
    feature: 'Simpan Progres, Streak & Misi Harian',
    guest: 'Lokal di perangkat',
    free: 'Sinkronisasi akun penuh',
    pro: 'Sinkronisasi akun penuh',
  },
  {
    feature: 'Materi Bisnis, Berita & Ujian N2–N1',
    guest: 'Terkunci',
    free: 'Terkunci',
    pro: 'Terbuka penuh',
  },
]

const FAQ_ITEMS = [
  {
    q: 'Apakah saya harus bayar untuk belajar dari nol?',
    a: 'Tidak. Level N5 bisa langsung dicoba tanpa login. Begitu kamu daftar akun gratis, level N4 dan N3 langsung terbuka penuh di Kurikulum, Grammar, dan Flashcard.',
  },
  {
    q: 'Apa bedanya paket Bulanan, 6 Bulan, dan Tahunan?',
    a: 'Semua periode membuka fitur Pro yang sama: akses penuh JLPT N5–N1 dan bebas lompat ke unit mana pun. Bulanan Rp 49.000 (hemat 42%), 6 Bulan Rp 239.000 (~Rp 39.800/bln), dan Tahunan Rp 399.000 (~Rp 33.250/bln).',
  },
  {
    q: 'Metode pembayaran apa saja yang didukung?',
    a: 'Saat aktivasi pembayaran dibuka penuh, kamu bisa bayar lewat QRIS, Virtual Account (BCA, Mandiri, BRI, BNI), serta e-wallet lokal (GoPay, OVO, DANA, ShopeePay).',
  },
]

export const PricingPage = () => {
  const navigate = useNavigate()
  const { data: userData } = useUser()
  const isAuthenticated = Boolean(userData.isAuthenticated && userData.user)
  const isPro = isUserPro(userData.user)

  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('semiannual')
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false)

  const activePlan =
    PRO_BILLING_OPTIONS.find((item) => item.id === selectedCycle) ?? PRO_BILLING_OPTIONS[1]

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      <AppLeftSidebar />

      <main className="flex-1 min-w-0 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 pb-24 md:pb-14 space-y-8">
        <AppTopBar
          breadcrumbs={[
            { label: 'Beranda', to: '/curriculum' },
            { label: 'Paket & Harga' },
          ]}
        />

        {/* Hero Positioning Header */}
        <header className="text-center max-w-3xl mx-auto space-y-3.5 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-950 text-xs font-brand font-black">
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="whitespace-nowrap">Merantalk Pro • Mulai Rp 33rb/bln</span>
          </div>

          <h1 className="font-brand font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            Belajar Bahasa Jepang Sampai Siap Kerja, Beasiswa, dan Merantau
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Mulai dari <strong>N5 tanpa login</strong>, lanjutkan <strong>N4–N3 gratis</strong>{' '}
            dengan akun, dan buka <strong>N2–N1 serta akses lompat unit bebas</strong> saat kamu
            siap mengejar karier profesional dan tunjangan JLPT.
          </p>
        </header>

        {/* Billing Cycle Selector for Pro */}
        <div className="flex justify-center">
          <div
            role="group"
            aria-label="Pilih periode langganan Pro"
            className="inline-grid grid-cols-3 gap-1.5 p-1.5 max-w-full rounded-2xl bg-white border-2 border-slate-200/90 shadow-[0_3px_0_0_#E2E8F0]"
          >
            {PRO_BILLING_OPTIONS.map((option) => {
              const isSelected = selectedCycle === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    triggerHaptic('tap')
                    setSelectedCycle(option.id)
                  }}
                  className={`px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-brand font-black whitespace-nowrap transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-[0_3px_0_0_#1D4ED8]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 3-Tier Cards */}
        <section
          aria-label="Pilihan paket Merantalk"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
        >
          {/* Tier 1: Guest */}
          <div className="min-w-0 bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-6 shadow-[0_4px_0_0_#E2E8F0]">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-brand font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                  Tanpa Login
                </span>
                <span className="text-xs font-brand font-bold text-emerald-700 whitespace-nowrap shrink-0">
                  JLPT N5
                </span>
              </div>

              <div>
                <h2 className="font-brand font-black text-xl text-slate-900">Tamu (Coba Dulu)</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Langsung rasakan metode Merantalk dari nol tanpa perlu daftar.
                </p>
              </div>

              <div className="pt-1">
                <p className="font-brand font-black text-3xl text-slate-900">Rp 0</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Akses langsung tanpa akun
                </p>
              </div>

              <ul className="space-y-2.5 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700 font-medium">
                {[
                  'Kurikulum N5 lengkap (30 Unit)',
                  '16 Panduan Grammar N5 + Slot Builder',
                  '40 Deck Flashcard N5 (603 kartu)',
                  'Papan Aksara Hiragana & Katakana',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check weight="bold" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button3D
              variant="white"
              size="sm"
              fullWidth
              onClick={() => {
                triggerHaptic('tap')
                navigate('/curriculum?level=N5')
              }}
            >
              Mulai Belajar N5
            </Button3D>
          </div>

          {/* Tier 2: Free Account */}
          <div className="min-w-0 bg-white border-2 border-blue-200/90 rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-6 shadow-[0_4px_0_0_#DBEAFE]">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-brand font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                  Akun Gratis
                </span>
                <span className="text-xs font-brand font-bold text-blue-700 whitespace-nowrap shrink-0">
                  JLPT N5–N3
                </span>
              </div>

              <div>
                <h2 className="font-brand font-black text-xl text-slate-900">Free Tier</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Cukup untuk persiapan kerja Tokutei Ginou (SSW) &amp; percakapan menengah.
                </p>
              </div>

              <div className="pt-1">
                <p className="font-brand font-black text-3xl text-slate-900">Rp 0</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Gratis selamanya setelah daftar
                </p>
              </div>

              <ul className="space-y-2.5 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700 font-medium">
                {[
                  'Semua materi JLPT N5',
                  'Buka penuh Kurikulum N4 & N3 (20 Unit · 600 Soal)',
                  '20 Panduan Grammar N4–N3 + Kuis',
                  '40 Deck Flashcard N4–N3 (608 kartu)',
                  'Simpan progres, XP, Streak & Misi Harian',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check weight="bold" className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {isAuthenticated ? (
              <Button3D
                variant="white"
                size="sm"
                fullWidth
                icon={<LockOpen weight="bold" className="w-4 h-4 text-blue-600" />}
                onClick={() => {
                  triggerHaptic('tap')
                  navigate('/curriculum?level=N4')
                }}
              >
                {isPro ? 'Termasuk di Paket Pro' : 'Paket Aktif Saat Ini — Buka N4'}
              </Button3D>
            ) : (
              <Button3D
                variant="blue"
                size="sm"
                fullWidth
                onClick={() => {
                  triggerHaptic('tap')
                  navigate('/register')
                }}
              >
                Daftar Gratis Sekarang
              </Button3D>
            )}
          </div>

          {/* Tier 3: Merantalk Pro */}
          <div className="min-w-0 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 border-2 border-blue-700 shadow-[0_6px_0_0_#1D4ED8] text-white rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-6 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-300 text-amber-950 text-[11px] font-brand font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                  <Crown weight="fill" className="w-3.5 h-3.5 text-amber-900 shrink-0" />
                  <span>{activePlan.badge}</span>
                </span>
                <span className="text-xs font-brand font-black text-amber-200 whitespace-nowrap shrink-0">
                  JLPT N5–N1
                </span>
              </div>

              <div>
                <h2 className="font-brand font-black text-xl text-white">Merantalk Pro</h2>
                <p className="text-xs text-blue-100 mt-1">{activePlan.summary}</p>
              </div>

              <div className="pt-1">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <p className="font-brand font-black text-3xl text-white">
                    {activePlan.priceDisplay}
                  </p>
                  <span className="text-sm font-bold text-blue-200/80 line-through">
                    {activePlan.originalPrice}
                  </span>
                </div>
                <p className="text-xs font-bold text-amber-200 mt-1">
                  {activePlan.perMonthNote}
                </p>
              </div>

              <ul className="space-y-2.5 pt-2 border-t border-white/20 text-xs sm:text-sm text-white/95 font-medium">
                {[
                  'Semua fitur akun Free (N5–N3)',
                  'Bebas lompat ke unit mana pun tanpa harus urut',
                  'Buka penuh Kurikulum N2 & N1 (20 Unit · 600 Soal)',
                  '20 Panduan Grammar bisnis, berita & akademik N2–N1',
                  '40 Deck Flashcard N2–N1 (608 kartu) + SRS',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle
                      weight="fill"
                      className="w-4 h-4 text-amber-300 shrink-0 mt-0.5"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {isPro ? (
              <Button3D
                variant="white"
                size="sm"
                fullWidth
                icon={<ArrowRight weight="bold" className="w-4 h-4 text-blue-700" />}
                onClick={() => {
                  triggerHaptic('tap')
                  navigate('/curriculum?level=N2')
                }}
                className="text-blue-700 font-brand font-black"
              >
                Pro Aktif — Buka JLPT N2
              </Button3D>
            ) : (
              <Button3D
                variant="white"
                size="md"
                fullWidth
                icon={<ArrowRight weight="bold" className="w-4 h-4 text-blue-700" />}
                onClick={() => {
                  triggerHaptic('tap')
                  setIsReserveModalOpen(true)
                }}
                className="text-blue-700 font-brand font-black"
              >
                Pilih Paket {activePlan.label}
              </Button3D>
            )}
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="min-w-0 bg-white border-2 border-slate-200/90 rounded-3xl overflow-hidden shadow-[0_4px_0_0_#E2E8F0]">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <h2 className="font-brand font-black text-base sm:text-lg text-slate-900">
              Perbandingan Akses Lengkap
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-brand font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5 sm:px-6">Fitur</th>
                  <th className="py-3.5 px-4">Tamu</th>
                  <th className="py-3.5 px-4 text-blue-700">Free Tier</th>
                  <th className="py-3.5 px-4 text-blue-700 bg-blue-50/60">Merantalk Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-5 sm:px-6 font-bold text-slate-800">{row.feature}</td>
                    <td className="py-3.5 px-4 text-slate-600">{row.guest}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{row.free}</td>
                    <td className="py-3.5 px-4 font-black text-blue-700 bg-blue-50/40">
                      {row.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-3">
          <h2 className="font-brand font-black text-lg sm:text-xl text-slate-900">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FAQ_ITEMS.map((faq) => (
              <div
                key={faq.q}
                className="min-w-0 bg-white border-2 border-slate-200/90 rounded-2xl p-5 space-y-2 shadow-[0_4px_0_0_#E2E8F0]"
              >
                <h3 className="font-brand font-black text-sm text-slate-900 leading-snug">
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Pro Checkout Preview Modal */}
      {isReserveModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pro-reserve-title"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Tutup dialog"
            onClick={() => setIsReserveModalOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] cursor-pointer"
          />
          <div className="relative z-10 w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-amber-950 bg-amber-300 px-3 py-1 rounded-xl text-xs font-brand font-black whitespace-nowrap">
                <ShieldCheck weight="fill" className="w-4 h-4 text-amber-900 shrink-0" />
                <span>Merantalk Pro • {activePlan.label}</span>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setIsReserveModalOpen(false)}
                className="w-8 h-8 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X weight="bold" className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h3
                id="pro-reserve-title"
                className="font-brand font-black text-xl text-slate-900 leading-tight"
              >
                {isAuthenticated
                  ? 'Pembayaran Otomatis Segera Dibuka'
                  : 'Daftar Akun Gratis Dulu untuk Mengaktifkan Pro'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isAuthenticated ? (
                  <>
                    Kamu memilih paket <strong>{activePlan.label}</strong> ({activePlan.priceDisplay}
                    ). Integrasi pembayaran otomatis (QRIS, Virtual Account &amp; E-Wallet) sedang
                    tahap akhir aktivasi. Sambil menunggu, kamu bisa langsung menyelesaikan materi{' '}
                    <strong>JLPT N5, N4, dan N3</strong> gratis penuh!
                  </>
                ) : (
                  <>
                    Buat akun Merantalk gratis dulu untuk melanjutkan aktivasi paket{' '}
                    <strong>{activePlan.label}</strong> ({activePlan.priceDisplay}) sekaligus
                    langsung membuka akses penuh <strong>JLPT N4 &amp; N3</strong> hari ini.
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              {isAuthenticated ? (
                <Button3D
                  variant="blue"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    setIsReserveModalOpen(false)
                    navigate('/curriculum?level=N4')
                  }}
                >
                  Lanjut Belajar N4–N3 Gratis
                </Button3D>
              ) : (
                <Button3D
                  variant="blue"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    setIsReserveModalOpen(false)
                    navigate('/register')
                  }}
                >
                  Daftar Akun Gratis
                </Button3D>
              )}
              <Button3D
                variant="white"
                size="sm"
                fullWidth
                onClick={() => setIsReserveModalOpen(false)}
              >
                Tutup
              </Button3D>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
