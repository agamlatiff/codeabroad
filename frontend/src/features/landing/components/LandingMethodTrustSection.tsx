import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowRight,
  ArrowsClockwise,
  Compass,
  LockOpen,
  ShieldCheck,
} from '@phosphor-icons/react'

const TRUST_PILLARS = [
  {
    id: 'pillar-curriculum',
    icon: Compass,
    iconColor: 'text-[#2563EB] bg-[#EFF6FF]',
    title: 'Jalur Terstruktur Resmi',
    description:
      'Mengacu format ujian JLPT N5–N1, IELTS/TOEFL, Goethe A1–C1, HSK, dan DELF.',
  },
  {
    id: 'pillar-guest',
    icon: LockOpen,
    iconColor: 'text-emerald-600 bg-emerald-50',
    title: 'Coba Unit 1 Tanpa Daftar',
    description:
      'Peta belajar, audio kalimat, papan aksara, dan dek flashcard bisa langsung dicoba bebas.',
  },
  {
    id: 'pillar-adaptive',
    icon: ArrowsClockwise,
    iconColor: 'text-amber-600 bg-amber-50',
    title: 'Jadwal Ulasan Adaptif',
    description:
      'Materi yang belum mantap dijadwalkan ulang otomatis saat kamu belajar memakai akun gratis.',
  },
] as const

export const LandingMethodTrustSection = () => {
  return (
    <section id="metode" className="bg-white py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-[1040px] mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Copy Column */}
        <div className="lg:col-span-6 space-y-5">
          <h2 className="text-3xl sm:text-[44px] font-brand font-black text-[#1E293B] leading-[1.14] tracking-tight">
            Belajar terukur, tanpa paksaan
          </h2>
          <p className="text-base sm:text-[18px] text-[#475569] leading-[1.5]">
            Merantalk membagi materi sertifikasi bahasa menjadi pelajaran singkat 3–5 menit dengan
            pengantar kosakata yang jelas. Uji Unit 1 secara bebas tanpa login, lalu buat akun
            gratis kapan pun kamu ingin menyimpan progres dan jadwal ulasan.
          </p>
          <div className="pt-1">
            <Link
              to="/curriculum"
              className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-[#EFF6FF] border border-blue-200 px-5 py-2.5 text-sm font-brand font-bold text-[#2563EB] transition-colors shadow-[0_3px_0_0_rgba(37,99,235,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
            >
              <span>Buka Peta Kurikulum</span>
              <ArrowRight weight="bold" className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Right Trust Standard Card */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="rounded-[28px] bg-white border-2 border-[#E2E8F0] shadow-[0_8px_0_0_rgba(45,64,150,0.06)] p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center gap-3.5">
              <ShieldCheck
                weight="fill"
                className="w-11 h-11 text-emerald-500 shrink-0"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-brand font-black text-lg sm:text-xl text-[#1E293B] leading-tight">
                  Standar Belajar Merantalk
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#64748B]">
                  Transparan dari hari pertama
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {TRUST_PILLARS.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={pillar.id}
                    className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 flex items-start gap-3.5"
                  >
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${pillar.iconColor}`}
                    >
                      <Icon weight="fill" className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <div className="space-y-0.5">
                      <h4 className="text-sm sm:text-base font-brand font-black text-[#1E293B]">
                        {pillar.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
