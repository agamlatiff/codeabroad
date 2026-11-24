import { useId, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import {
  ArrowRight,
  Cards,
  Compass,
  PencilSimple,
  Translate,
  type Icon,
} from '@phosphor-icons/react'
import {
  CurriculumPathIllustration,
  FlashcardStackIllustration,
  ScriptStrokeIllustration,
} from '@/features/landing/components/LandingIllustrations'
import { LandingAnimatedSentenceShowcase } from '@/features/landing/components/LandingAnimatedSentenceShowcase'

const TRAIL_PATH =
  'M 270 160 C 270 360, 730 340, 730 560 C 730 780, 270 760, 270 980 C 270 1200, 730 1180, 730 1400'

interface FeatureStoryRow {
  id: string
  badgeColorClass: string
  IconComponent: Icon
  title: string
  description: string
  href: string
  ctaLabel: string
  blobColor: string
  blobPath: string
  pillLabel: string
  pillAccentColor: string
  pillPositionClass: string
  tiltClass: string
  renderVisual: () => ReactNode
}

const FEATURE_STORY_ROWS: ReadonlyArray<FeatureStoryRow> = [
  {
    id: 'row-curriculum',
    badgeColorClass: 'bg-[#00B2F7]',
    IconComponent: Compass,
    title: 'Peta belajar bertahap dari nol',
    description:
      'Setiap unit diawali kartu pengantar ringkas sebelum masuk soal latihan, sehingga pemula tidak langsung kaget saat mulai belajar.',
    href: '/curriculum',
    ctaLabel: 'Lihat Peta Belajar',
    blobColor: '#E0F2FE',
    blobPath:
      'M 68 88 C 118 22, 265 14, 385 36 C 492 56, 540 128, 526 218 C 512 308, 434 362, 310 356 C 186 350, 56 330, 32 248 C 12 180, 26 144, 68 88 Z',
    pillLabel: 'Unit 1 Gratis Tanpa Login',
    pillAccentColor: '#00B2F7',
    pillPositionClass: '-bottom-4 right-4 sm:right-6',
    tiltClass: 'md:-rotate-1',
    renderVisual: () => <CurriculumPathIllustration />,
  },
  {
    id: 'row-grammar',
    badgeColorClass: 'bg-[#10B981]',
    IconComponent: Translate,
    title: 'Pahami pola kalimat per blok kata',
    description:
      'Susunan kalimat dipecah dengan warna penanda peran kata lengkap beserta cara baca, arti per bagian, dan contoh situasi nyata.',
    href: '/grammar',
    ctaLabel: 'Buka Panduan Tata Bahasa',
    blobColor: '#DCFCE7',
    blobPath:
      'M 96 48 C 194 12, 344 26, 444 68 C 534 106, 546 196, 512 274 C 478 352, 356 364, 238 352 C 122 340, 26 306, 24 214 C 22 126, 36 70, 96 48 Z',
    pillLabel: 'Breakdown Per Kata',
    pillAccentColor: '#10B981',
    pillPositionClass: '-bottom-4 left-4 sm:left-6',
    tiltClass: 'md:rotate-1',
    renderVisual: () => <LandingAnimatedSentenceShowcase />,
  },
  {
    id: 'row-script',
    badgeColorClass: 'bg-[#F34E47]',
    IconComponent: PencilSimple,
    title: 'Latihan menulis aksara Jepang di layar',
    description:
      'Khusus jalur Bahasa Jepang, tersedia papan tulis Hiragana, Katakana, dan Kanji lengkap dengan urutan goresan dan suara native.',
    href: '/kana/hiragana',
    ctaLabel: 'Coba Papan Aksara Jepang',
    blobColor: '#FFE4E6',
    blobPath:
      'M 58 104 C 102 26, 232 20, 342 32 C 454 44, 534 94, 532 192 C 530 290, 448 352, 322 356 C 196 360, 74 328, 34 252 C 4 194, 24 164, 58 104 Z',
    pillLabel: 'Kanvas & Audio Native',
    pillAccentColor: '#F34E47',
    pillPositionClass: '-top-3.5 right-4 sm:right-6',
    tiltClass: 'md:-rotate-1',
    renderVisual: () => <ScriptStrokeIllustration />,
  },
  {
    id: 'row-flashcards',
    badgeColorClass: 'bg-[#FF9C28]',
    IconComponent: Cards,
    title: 'Ulas kosakata lewat dek kartu harian',
    description:
      'Balik kartu cepat dengan panduan baca dan audio pelafalan. Saat masuk akun gratis, jadwal ulasan otomatis mengikuti progres ingatmu.',
    href: '/flashcards',
    ctaLabel: 'Buka Dek Flashcard',
    blobColor: '#FEF3C7',
    blobPath:
      'M 82 54 C 176 16, 320 18, 428 54 C 520 84, 544 176, 522 258 C 500 340, 388 362, 260 354 C 132 346, 34 316, 26 226 C 18 140, 26 78, 82 54 Z',
    pillLabel: 'Ulasan Terjadwal Otomatis',
    pillAccentColor: '#FF9C28',
    pillPositionClass: '-bottom-4 right-4 sm:right-6',
    tiltClass: 'md:rotate-1',
    renderVisual: () => <FlashcardStackIllustration />,
  },
]

interface FeatureVisualStageProps {
  blobColor: string
  blobPath: string
  pillLabel: string
  pillAccentColor: string
  pillPositionClass: string
  tiltClass: string
  children: ReactNode
}

/**
 * Three-layer scroll-driven parallax stage: organic pastel blob, crisp studio card,
 * and floating stationery pill tag.
 */
const FeatureVisualStage = ({
  blobColor,
  blobPath,
  pillLabel,
  pillAccentColor,
  pillPositionClass,
  tiltClass,
  children,
}: FeatureVisualStageProps) => {
  const stageRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start'],
  })

  const blobY = useTransform(scrollYProgress, [0, 1], [-8, 8])
  const cardY = useTransform(scrollYProgress, [0, 1], [14, -14])
  const pillY = useTransform(scrollYProgress, [0, 1], [18, -18])

  return (
    <div
      ref={stageRef}
      className="relative max-w-[560px] mx-auto lg:max-w-none pt-6 pb-5 sm:pt-7 sm:pb-6 px-1.5 sm:px-5"
    >
      {/* Layer 1: Organic Curved Pastel Blob */}
      <motion.div
        aria-hidden="true"
        style={{ y: shouldReduceMotion ? 0 : blobY }}
        className="pointer-events-none absolute -inset-x-2 -inset-y-2 sm:-inset-x-5 sm:-inset-y-5 flex items-center justify-center z-0"
      >
        <svg
          viewBox="0 0 560 380"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full select-none"
        >
          <path d={blobPath} fill={blobColor} />
        </svg>
      </motion.div>

      {/* Layer 2: Foreground Studio UI Card */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : cardY }}
        className="relative z-10"
      >
        <div
          className={`motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out ${
            shouldReduceMotion
              ? ''
              : `${tiltClass} md:hover:rotate-0 md:focus-within:rotate-0`
          }`}
        >
          {children}
        </div>
      </motion.div>

      {/* Layer 3: Floating Micro-Pill Tag */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : pillY }}
        className={`pointer-events-none select-none absolute z-20 ${pillPositionClass}`}
      >
        <span className="inline-flex items-center gap-2 bg-white border-2 border-[#E2E8F0] rounded-full px-3.5 py-1.5 shadow-[0_4px_0_0_rgba(45,64,150,0.08)] text-xs font-brand font-black text-[#1E293B] whitespace-nowrap">
          <span
            aria-hidden="true"
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: pillAccentColor }}
          />
          <span>{pillLabel}</span>
        </span>
      </motion.div>
    </div>
  )
}

export const LandingFeatureShowcase = () => {
  const trailRef = useRef<HTMLDivElement>(null)
  const trailMaskId = useId().replace(/:/g, '')
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress: trailProgress } = useScroll({
    target: trailRef,
    offset: ['start 72%', 'end 62%'],
  })

  return (
    <section id="fitur" className="relative bg-white py-16 sm:py-24 overflow-x-clip">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
        {/* Compact Section Intro */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20 space-y-3">
          <p className="text-xs font-brand font-black uppercase tracking-widest text-[#2563EB]">
            Modul Pembelajaran
          </p>
          <h2 className="text-3xl sm:text-[42px] font-brand font-black text-[#1E293B] leading-[1.16] tracking-tight">
            Semua alat bantu belajar yang kamu butuhkan
          </h2>
          <p className="text-base sm:text-[18px] text-[#475569] leading-[1.45]">
            Sentuh dan lihat alur modul Merantalk secara langsung—dari peta kurikulum bertahap
            hingga kartu ulasan harian.
          </p>
        </div>

        {/* Alternating Storytelling Rows + Scroll-Driven Dashed SVG Connector Trail */}
        <div ref={trailRef} className="relative">
          <svg
            viewBox="0 0 1000 1600"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none hidden lg:block absolute inset-0 w-full h-full z-0"
          >
            <defs>
              <mask
                id={trailMaskId}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="1000"
                height="1600"
              >
                <motion.path
                  d={TRAIL_PATH}
                  fill="none"
                  stroke="white"
                  strokeWidth="14"
                  strokeLinecap="round"
                  style={{ pathLength: shouldReduceMotion ? 1 : trailProgress }}
                />
              </mask>
            </defs>

            {/* Layer 1 Guide */}
            <path
              d={TRAIL_PATH}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="3"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
            {/* Layer 2 Scroll Progress */}
            <path
              d={TRAIL_PATH}
              fill="none"
              stroke="#60A5FA"
              strokeWidth="3.5"
              strokeDasharray="8 8"
              strokeLinecap="round"
              mask={`url(#${trailMaskId})`}
            />
          </svg>

          <div className="relative z-10 space-y-16 sm:space-y-28">
            {FEATURE_STORY_ROWS.map((row, index) => {
              const isVisualFirstOnDesktop = index % 2 === 1
              const { IconComponent } = row

              return (
                <div
                  key={row.id}
                  className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  {/* Text Column */}
                  <div
                    className={`lg:col-span-5 ${
                      isVisualFirstOnDesktop ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div className="max-w-[380px] mx-auto lg:mx-0 space-y-4">
                      <div
                        aria-hidden="true"
                        className={`w-14 h-14 rounded-full ${row.badgeColorClass} flex items-center justify-center shadow-[0_4px_0_0_rgba(15,23,42,0.08)]`}
                      >
                        <IconComponent weight="fill" className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl sm:text-[36px] font-brand font-black text-[#1E293B] leading-[1.16]">
                        {row.title}
                      </h3>
                      <p className="text-base sm:text-[18px] text-[#475569] leading-[1.48]">
                        {row.description}
                      </p>
                      <Link
                        to={row.href}
                        className="group landing-link-sweep inline-flex items-center gap-2 text-[15px] font-brand font-black text-[#2563EB]"
                      >
                        <span>{row.ctaLabel}</span>
                        <ArrowRight
                          weight="bold"
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform motion-reduce:transition-none"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* Visual Stage Column */}
                  <div
                    className={`lg:col-span-7 ${
                      isVisualFirstOnDesktop ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <FeatureVisualStage
                      blobColor={row.blobColor}
                      blobPath={row.blobPath}
                      pillLabel={row.pillLabel}
                      pillAccentColor={row.pillAccentColor}
                      pillPositionClass={row.pillPositionClass}
                      tiltClass={row.tiltClass}
                    >
                      {row.renderVisual()}
                    </FeatureVisualStage>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
