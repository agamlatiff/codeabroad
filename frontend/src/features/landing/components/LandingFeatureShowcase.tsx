import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from '@phosphor-icons/react'
import {
  CurriculumPathIllustration,
  FlashcardStackIllustration,
  ScriptStrokeIllustration,
} from '@/features/landing/components/LandingIllustrations'
import { LandingAnimatedSentenceShowcase } from '@/features/landing/components/LandingAnimatedSentenceShowcase'

interface EditorialFeatureRow {
  id: string
  eyebrow: string
  title: string
  description: string
  href: string
  ctaLabel: string
  visual: ReactNode
}

const EDITORIAL_FEATURE_ROWS: ReadonlyArray<EditorialFeatureRow> = [
  {
    id: 'row-curriculum',
    eyebrow: '01 · Peta Kurikulum',
    title: 'Materi Dipotong Singkat Agar Mudah Mulai Konsisten',
    description:
      'Setiap unit diawali kartu pengantar ringkas sebelum masuk soal latihan, sehingga pemula dari nol tidak langsung kaget saat mulai belajar.',
    href: '/curriculum',
    ctaLabel: 'Lihat Peta Belajar',
    visual: <CurriculumPathIllustration />,
  },
  {
    id: 'row-grammar',
    eyebrow: '02 · Tata Bahasa Visual',
    title: 'Pahami Pola Kalimat Per Blok Kata yang Jelas',
    description:
      'Susunan kalimat dipecah dengan warna penanda peran kata lengkap beserta arti per bagian dan konteks percakapan nyata.',
    href: '/grammar',
    ctaLabel: 'Buka Panduan Tata Bahasa',
    visual: <LandingAnimatedSentenceShowcase />,
  },
  {
    id: 'row-script',
    eyebrow: '03 · Khusus Bahasa Beraksara (Jepang)',
    title: 'Latihan Menulis Hiragana, Katakana & Kanji di Layar',
    description:
      'Untuk bahasa dengan sistem huruf non-Latin seperti Bahasa Jepang, tersedia papan tulis interaktif, panduan urutan goresan, dan suara native.',
    href: '/kana/hiragana',
    ctaLabel: 'Coba Papan Aksara Jepang',
    visual: <ScriptStrokeIllustration />,
  },
  {
    id: 'row-flashcards',
    eyebrow: '04 · Kartu Kosakata',
    title: 'Ulas Kosakata Kapan Saja Lewat Dek Terjadwal',
    description:
      'Balik kartu cepat dengan panduan baca dan suara pelafalan. Saat masuk akun gratis, jadwal ulasan otomatis mengikuti progres ingatmu.',
    href: '/flashcards',
    ctaLabel: 'Buka Dek Flashcard',
    visual: <FlashcardStackIllustration />,
  },
]

export const LandingFeatureShowcase = () => {
  return (
    <section id="fitur" className="py-14 sm:py-20 bg-white border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-14 sm:space-y-18">
        <div className="max-w-2xl space-y-2.5">
          <p className="text-xs font-brand font-black uppercase tracking-widest text-blue-600">
            Isi Pengalaman Belajar
          </p>
          <h2 className="text-2xl sm:text-4xl font-brand font-black text-slate-900 tracking-tight">
            Semua Modul Bisa Kamu Sentuh &amp; Cek Dulu
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Bukan sekadar teori — lihat langsung cara kerja setiap modul di dalam Merantalk sebelum
            membuat akun.
          </p>
        </div>

        <div className="space-y-14 sm:space-y-20">
          {EDITORIAL_FEATURE_ROWS.map((row, index) => {
            const isVisualFirstOnDesktop = index % 2 === 1
            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div
                  className={`lg:col-span-5 space-y-4 ${
                    isVisualFirstOnDesktop ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-blue-600 block">
                    {row.eyebrow}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-brand font-black text-slate-900 leading-snug">
                    {row.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {row.description}
                  </p>
                  <Link
                    to={row.href}
                    className="group inline-flex items-center gap-1.5 text-sm font-brand font-black text-blue-600 hover:text-blue-700 pt-1"
                  >
                    <span>{row.ctaLabel}</span>
                    <ArrowRight
                      weight="bold"
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>

                <div
                  className={`lg:col-span-7 ${
                    isVisualFirstOnDesktop ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  {row.visual}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
