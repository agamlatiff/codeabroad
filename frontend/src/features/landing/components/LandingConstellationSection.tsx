import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Clock, SpeakerHigh } from '@phosphor-icons/react'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'

const SENTENCE_SNIPPET_TOKENS = [
  {
    word: 'わたし',
    role: 'Topik',
    chipClass: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    roleClass: 'text-emerald-700',
  },
  {
    word: 'は',
    role: 'Partikel',
    chipClass: 'bg-amber-50 border-amber-200 text-amber-950',
    roleClass: 'text-amber-700',
  },
  {
    word: 'がくせい',
    role: 'Predikat',
    chipClass: 'bg-blue-50 border-blue-200 text-blue-950',
    roleClass: 'text-[#2563EB]',
  },
] as const

export const LandingConstellationSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const yLeftOuter = useTransform(scrollYProgress, [0, 1], [-12, 12])
  const yInner = useTransform(scrollYProgress, [0, 1], [16, -16])
  const yRightOuter = useTransform(scrollYProgress, [0, 1], [-14, 14])

  return (
    <section
      ref={containerRef}
      className="relative bg-white pt-4 pb-16 sm:pt-6 sm:pb-24 px-4 sm:px-6 overflow-x-clip"
    >
      <div className="max-w-[1220px] mx-auto grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Tilted Card Cluster */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3.5">
          {/* Card 1: Greeting audio snippet */}
          <motion.div style={shouldReduceMotion ? undefined : { y: yLeftOuter }}>
            <div className="h-full rounded-[24px] bg-white border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] p-4 lg:-rotate-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-brand font-black text-[#2563EB]">
                  Jepang · Sapaan Pagi
                </span>
                <span className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <SpeakerHigh weight="fill" className="w-3.5 h-3.5 text-[#2563EB]" />
                </span>
              </div>
              <p className="mt-2.5 font-brand font-black text-base sm:text-lg text-[#1E293B] leading-snug">
                おはようございます
              </p>
              <p className="mt-0.5 text-xs font-mono font-semibold text-[#64748B]">
                Ohayou gozaimasu
              </p>
            </div>
          </motion.div>

          {/* Card 2: Visual sentence color-block snippet */}
          <motion.div style={shouldReduceMotion ? undefined : { y: yInner }}>
            <div className="h-full rounded-[24px] bg-white border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] p-4 lg:rotate-2 lg:translate-x-4">
              <p className="text-[11px] font-brand font-bold uppercase tracking-wider text-[#64748B] mb-2">
                Pola Kalimat
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {SENTENCE_SNIPPET_TOKENS.map((token) => (
                  <div
                    key={token.word}
                    className={`rounded-xl border px-2.5 py-1.5 flex flex-col items-start ${token.chipClass}`}
                  >
                    <span className="font-brand font-black text-xs sm:text-sm leading-tight">
                      {token.word}
                    </span>
                    <span className={`text-[10px] font-bold leading-tight ${token.roleClass}`}>
                      {token.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: Focused daily rhythm tile */}
          <motion.div
            style={shouldReduceMotion ? undefined : { y: yLeftOuter }}
            className="col-span-2 lg:col-span-1"
          >
            <div className="rounded-[24px] bg-white border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] p-4 lg:-rotate-1 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                <Clock weight="fill" className="w-5 h-5 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-brand font-bold uppercase tracking-wider text-[#64748B]">
                  Target Harian
                </p>
                <p className="font-brand font-black text-base text-[#1E293B] leading-tight">
                  5–15 Menit / Hari
                </p>
                <p className="text-xs font-medium text-[#475569]">Materi ringkas 3–5 menit</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center Headline Centerpiece */}
        <div className="lg:col-span-4 text-center py-4 lg:py-8 space-y-3">
          <h2 className="text-2xl sm:text-[32px] font-brand font-black text-[#1E293B] leading-[1.2] tracking-tight">
            Menghubungkan kosakata, tata bahasa, dan latihan harian.
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] max-w-sm mx-auto leading-relaxed">
            Semua fondasi belajar tersusun rapi dari langkah pertama tanpa tampilan yang
            membingungkan.
          </p>
        </div>

        {/* Right Tilted Card Cluster */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3.5">
          {/* Card 1: Warm companion card */}
          <motion.div style={shouldReduceMotion ? undefined : { y: yRightOuter }}>
            <div className="h-full rounded-[24px] bg-[#EFF6FF]/60 border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] p-4 lg:rotate-2 flex items-center gap-3">
              <KodiCharacter emotion="happy" size={62} interactive={false} className="shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-brand font-bold uppercase tracking-wider text-[#2563EB]">
                  Teman Belajar
                </p>
                <p className="mt-0.5 font-brand font-black text-sm sm:text-base text-[#1E293B] leading-snug">
                  Belajar konsisten tanpa takut salah
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Script practice card */}
          <motion.div style={shouldReduceMotion ? undefined : { y: yInner }}>
            <div className="h-full rounded-[24px] bg-white border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] p-4 lg:-rotate-2 lg:-translate-x-4 flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl bg-[#FAFAF9] border border-[#E2E8F0] relative flex items-center justify-center shrink-0 overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-1/2 w-px bg-slate-200/80 -translate-x-1/2 pointer-events-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-1/2 h-px bg-slate-200/80 -translate-y-1/2 pointer-events-none"
                />
                <span className="relative z-10 font-brand font-black text-3xl text-[#1E293B] select-none">
                  あ
                </span>
              </div>

              <div className="min-w-0">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-[10px] font-brand font-black uppercase tracking-wider text-emerald-700">
                  Papan Aksara
                </span>
                <p className="mt-1.5 font-mono text-xs sm:text-sm font-bold text-[#1E293B]">
                  Latihan Goresan 1 → 3
                </p>
                <p className="text-[11px] font-medium text-[#64748B]">
                  Hiragana · Katakana · Kanji
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Multi-language track mini-card */}
          <motion.div
            style={shouldReduceMotion ? undefined : { y: yRightOuter }}
            className="col-span-2 lg:col-span-1"
          >
            <div className="rounded-[24px] bg-white border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] p-4 lg:rotate-1">
              <p className="text-[11px] font-brand font-bold uppercase tracking-wider text-[#64748B] mb-2.5">
                Lintas Bahasa Global
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-center gap-2 rounded-xl bg-[#FAFAF9] border border-slate-200/80 px-2.5 py-2 min-w-0">
                  <div className="w-7 h-5 rounded overflow-hidden border border-slate-200 shrink-0">
                    <LanguageFlagIllustration
                      code="de"
                      compact
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-brand font-black text-xs text-[#1E293B] truncate">
                      Guten Morgen
                    </p>
                    <p className="text-[10px] font-mono text-[#64748B] truncate">
                      Jerman · Goethe
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-[#FAFAF9] border border-slate-200/80 px-2.5 py-2 min-w-0">
                  <div className="w-7 h-5 rounded overflow-hidden border border-slate-200 shrink-0">
                    <LanguageFlagIllustration
                      code="fr"
                      compact
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-brand font-black text-xs text-[#1E293B] truncate">
                      Bonjour
                    </p>
                    <p className="text-[10px] font-mono text-[#64748B] truncate">
                      Prancis · DELF
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
