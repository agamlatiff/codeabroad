import { Link } from 'react-router-dom'
import {
  Cards,
  CheckCircle,
  Compass,
  Fire,
  Lightning,
  PlayCircle,
  Sparkle,
  SquaresFour,
  UserPlus,
} from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'
import { GLOBAL_LANGUAGE_CATALOG } from '@/shared/constants/languageCatalog'
import { HERO_TRUST_BADGES } from '@/features/landing/data/landingContent'

export const LandingHero = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-14 sm:pt-14 sm:pb-20">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-24 h-80 bg-gradient-to-b from-blue-50/80 via-sky-50/40 to-transparent pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Copy & Conversion CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-700 font-brand font-black text-xs uppercase tracking-wider shadow-[0_2px_0_0_#BFDBFE]">
            <Sparkle weight="fill" className="w-4 h-4 text-blue-500" />
            <span>Platform Multi-Bahasa Siap Kerja &amp; Studi ke Luar Negeri</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-brand font-black text-slate-900 leading-[1.12] tracking-tight">
            Kuasai Bahasa Asing dari{' '}
            <span className="text-blue-600 relative inline-block">
              Nol sampai Siap Sertifikasi
            </span>
            , Coba Dulu Sebelum Daftar!
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
            Dari jalur <strong>JLPT, IELTS, TOEFL, Goethe, HSK, hingga DELF</strong> — jelajahi
            Peta Kurikulum, Flashcard kosakata, Grammar visual, hingga latihan interaktif Unit 1{' '}
            <strong>tanpa wajib login</strong>. Suka dengan pengalamannya? Buat akun gratis dalam 10
            detik untuk menyimpan progres, XP, dan Streak harianmu.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-1">
            <Link to="/curriculum" className="w-full sm:w-auto">
              <Button3D
                variant="blue"
                size="lg"
                fullWidth
                icon={<Compass weight="fill" className="w-5 h-5" />}
              >
                Coba Langsung Tanpa Login
              </Button3D>
            </Link>

            <Link to="/register" className="w-full sm:w-auto">
              <Button3D
                variant="emerald"
                size="lg"
                fullWidth
                icon={<UserPlus weight="bold" className="w-5 h-5" />}
              >
                Daftar Gratis &amp; Simpan XP
              </Button3D>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2.5 pt-2">
            {HERO_TRUST_BADGES.map((badge) => (
              <div
                key={badge}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600"
              >
                <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Interactive Tactile Preview Card */}
        <div className="lg:col-span-5">
          <div className="relative bg-white border-2 border-slate-200/95 rounded-3xl p-6 sm:p-7 shadow-[0_10px_0_0_#E2E8F0]">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-brand font-black uppercase tracking-wider text-slate-600">
                  Belajar Multi-Bahasa
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-brand font-black text-[11px] flex items-center gap-1">
                <Lightning weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                Unit 1 Terbuka
              </span>
            </div>

            <div className="py-5 flex flex-col items-center text-center gap-4">
              {/* 6-Flag Strip Showcase */}
              <div
                className="flex items-center justify-center gap-2 flex-wrap"
                aria-label="Jalur bahasa Jepang, Inggris UK, Inggris US, Jerman, Mandarin, Prancis"
              >
                {GLOBAL_LANGUAGE_CATALOG.map((lang) => (
                  <div
                    key={lang.code}
                    title={lang.countryLabel}
                    className="w-10 h-7 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shadow-2xs"
                  >
                    <LanguageFlagIllustration
                      code={lang.code}
                      compact
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>

              <KodiCharacter
                emotion="welcome"
                size={104}
                showSpeechBubble
                speechText="Yukk! Pilih jalur bahasamu & coba Unit 1 gratis tanpa akun!"
              />

              <div className="w-full grid grid-cols-2 gap-3 text-left">
                <Link
                  to="/curriculum"
                  className="group rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 p-3.5 hover:border-emerald-400 transition-all shadow-[0_3px_0_0_#A7F3D0]"
                >
                  <div className="flex items-center justify-between">
                    <SquaresFour weight="duotone" className="w-6 h-6 text-emerald-700" />
                    <PlayCircle
                      weight="fill"
                      className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <p className="mt-2 text-xs font-brand font-black text-slate-900">Peta Kurikulum</p>
                  <p className="text-[11px] text-slate-600">Pelajaran singkat &amp; latihan lengkap</p>
                </Link>

                <Link
                  to="/flashcards"
                  className="group rounded-2xl border-2 border-sky-200 bg-sky-50/70 p-3.5 hover:border-sky-400 transition-all shadow-[0_3px_0_0_#BAE6FD]"
                >
                  <div className="flex items-center justify-between">
                    <Cards weight="duotone" className="w-6 h-6 text-sky-700" />
                    <Fire
                      weight="fill"
                      className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <p className="mt-2 text-xs font-brand font-black text-slate-900">Dek Flashcard</p>
                  <p className="text-[11px] text-slate-600">Balik kartu, audio &amp; jadwal ulang</p>
                </Link>
              </div>
            </div>

            <a
              href="#coba-kilat"
              className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 text-xs font-brand font-black uppercase tracking-wider transition-colors"
            >
              <PlayCircle weight="fill" className="w-4 h-4 text-sky-400" />
              <span>Coba Latihan Singkat di Bawah Ini</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
