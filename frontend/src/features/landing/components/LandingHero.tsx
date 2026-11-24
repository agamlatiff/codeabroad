import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { CheckCircle, Compass, UserPlus } from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { LandingHeroCardDeck } from '@/features/landing/components/LandingHeroCardDeck'

const HERO_HIGHLIGHTS = [
  'Bisa langsung dicoba tanpa akun',
  'Materi singkat & terarah per unit',
  'Audio penutur asli lintas bahasa',
] as const

export const LandingHero = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-14 sm:pt-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Editorial Copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="lg:col-span-6 space-y-6 text-center lg:text-left"
        >
          <p className="text-xs font-brand font-black uppercase tracking-widest text-blue-600">
            Belajar Bahasa Asing untuk Studi &amp; Karier Global
          </p>

          <h1 className="text-3xl sm:text-5xl font-brand font-black text-slate-900 leading-[1.12] tracking-tight">
            Kuasai Bahasa Asing dari Nol sampai{' '}
            <span className="text-blue-600">Siap Sertifikasi</span>, Coba Dulu Sebelum Daftar.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Dari jalur JLPT, IELTS, TOEFL, Goethe, HSK, hingga DELF — buka peta kurikulum, dengar
            kosakata harian, dan coba latihan Unit 1 tanpa perlu login terlebih dahulu.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-1">
            <Link to="/curriculum" className="w-full sm:w-auto">
              <Button3D
                variant="blue"
                size="lg"
                fullWidth
                icon={<Compass weight="fill" className="w-5 h-5" />}
              >
                Coba Unit 1 Sekarang
              </Button3D>
            </Link>

            <Link to="/register" className="w-full sm:w-auto">
              <Button3D
                variant="white"
                size="lg"
                fullWidth
                icon={<UserPlus weight="bold" className="w-5 h-5 text-blue-600" />}
              >
                Buat Akun Gratis
              </Button3D>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 pt-1">
            {HERO_HIGHLIGHTS.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600"
              >
                <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Calm Mascot Companion Note */}
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white border border-slate-200/90 px-3.5 py-2.5 text-left max-w-md mx-auto lg:mx-0">
            <KodiCharacter emotion="happy" size={44} interactive={false} className="shrink-0" />
            <p className="text-xs text-slate-600 leading-snug">
              Sentuh kartu kosakata di sebelah kanan untuk membalik arti dan mendengar pengucapan aslinya.
            </p>
          </div>
        </motion.div>

        {/* Right Product-as-Hero Interactive 3D Card Deck */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="lg:col-span-6"
        >
          <LandingHeroCardDeck />
        </motion.div>
      </div>
    </section>
  )
}
