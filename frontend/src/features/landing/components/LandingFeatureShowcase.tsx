import { Fragment, useId, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
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

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const
const SCROLL_SPRING = {
  stiffness: 75,
  damping: 24,
  mass: 0.4,
  restDelta: 0.001,
} as const
const PARALLAX_SPRING = {
  stiffness: 90,
  damping: 28,
  mass: 0.4,
  restDelta: 0.001,
} as const

const CONNECTOR_COLORS = [
  { from: '#38BDF8', to: '#34D399' },
  { from: '#34D399', to: '#FB7185' },
  { from: '#FB7185', to: '#FBBF24' },
] as const

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
    blobColor: '#E7F5FE',
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
    blobColor: '#EBF9EA',
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
    title: 'Kuasai aksara, tanda baca, dan pelafalan',
    description:
      'Latih urutan goresan Hiragana, Katakana, Kanji, dan Hanzi Mandarin hingga aksen khusus Prancis serta Jerman lengkap dengan audio penutur asli.',
    href: '/kana/hiragana',
    ctaLabel: 'Coba Papan Latihan Aksara',
    blobColor: '#FDECEE',
    blobPath:
      'M 58 104 C 102 26, 232 20, 342 32 C 454 44, 534 94, 532 192 C 530 290, 448 352, 322 356 C 196 360, 74 328, 34 252 C 4 194, 24 164, 58 104 Z',
    pillLabel: 'Aksara & Audio Native',
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
    blobColor: '#FEF7DE',
    blobPath:
      'M 82 54 C 176 16, 320 18, 428 54 C 520 84, 544 176, 522 258 C 500 340, 388 362, 260 354 C 132 346, 34 316, 26 226 C 18 140, 26 78, 82 54 Z',
    pillLabel: 'Ulasan Terjadwal Otomatis',
    pillAccentColor: '#FF9C28',
    pillPositionClass: '-bottom-4 right-4 sm:right-6',
    tiltClass: 'md:rotate-1',
    renderVisual: () => <FlashcardStackIllustration />,
  },
]

interface InterRowConnectorProps {
  direction: 'right-to-left' | 'left-to-right'
  fromColor: string
  toColor: string
}

/**
 * Dedicated desktop S-curve dashed bridge rendered strictly in the vertical gap
 * between alternating storytelling rows so trails never overlap paragraph text.
 */
const InterRowConnector = ({ direction, fromColor, toColor }: InterRowConnectorProps) => {
  const connectorRef = useRef<HTMLDivElement>(null)
  const rawId = useId()
  const idPrefix = rawId.replace(/[^a-zA-Z0-9_-]/g, '') || 'connector'
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: connectorRef,
    offset: ['start 88%', 'end 44%'],
  })
  const smoothDraw = useSpring(scrollYProgress, SCROLL_SPRING)

  const isRtl = direction === 'right-to-left'
  const d = isRtl
    ? 'M 720 6 C 720 74, 280 66, 280 134'
    : 'M 280 6 C 280 74, 720 66, 720 134'
  const x1 = isRtl ? 720 : 280
  const y1 = 6
  const x2 = isRtl ? 280 : 720
  const y2 = 134

  const guideGradId = `feature-guide-${idPrefix}`
  const activeGradId = `feature-active-${idPrefix}`
  const maskId = `feature-mask-${idPrefix}`

  return (
    <div
      ref={connectorRef}
      aria-hidden="true"
      className="hidden lg:block relative w-full h-28 xl:h-32 pointer-events-none select-none z-0"
    >
      <svg
        viewBox="0 0 1000 140"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient
            id={guideGradId}
            gradientUnits="userSpaceOnUse"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          >
            <stop offset="0%" stopColor="#CBD5E1" stopOpacity={0} />
            <stop offset="14%" stopColor="#CBD5E1" stopOpacity={0.65} />
            <stop offset="86%" stopColor="#CBD5E1" stopOpacity={0.65} />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0} />
          </linearGradient>

          <linearGradient
            id={activeGradId}
            gradientUnits="userSpaceOnUse"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          >
            <stop offset="0%" stopColor={fromColor} stopOpacity={0} />
            <stop offset="14%" stopColor={fromColor} stopOpacity={0.95} />
            <stop offset="86%" stopColor={toColor} stopOpacity={0.95} />
            <stop offset="100%" stopColor={toColor} stopOpacity={0} />
          </linearGradient>

          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="-20"
            y="-20"
            width="1040"
            height="180"
          >
            <motion.path
              d={d}
              fill="none"
              stroke="white"
              strokeWidth="16"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={shouldReduceMotion ? undefined : { pathLength: smoothDraw }}
              initial={shouldReduceMotion ? { pathLength: 1 } : undefined}
            />
          </mask>
        </defs>

        {/* Layer 1: Subtle gradient-faded slate guide */}
        <path
          d={d}
          fill="none"
          stroke={`url(#${guideGradId})`}
          strokeWidth={2}
          strokeDasharray="7 9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Layer 2: Soft accent halo */}
        <path
          d={d}
          fill="none"
          stroke={`url(#${activeGradId})`}
          strokeWidth={6}
          strokeDasharray="7 9"
          strokeLinecap="round"
          opacity={0.14}
          vectorEffect="non-scaling-stroke"
          mask={`url(#${maskId})`}
        />

        {/* Layer 3: Crisp scroll-drawn active colored trail */}
        <path
          d={d}
          fill="none"
          stroke={`url(#${activeGradId})`}
          strokeWidth={2.5}
          strokeDasharray="7 9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  )
}

interface FeatureVisualStageProps {
  blobColor: string
  blobPath: string
  pillLabel: string
  pillAccentColor: string
  pillPositionClass: string
  tiltClass?: string
  children: ReactNode
}

/**
 * Three-layer scroll-driven parallax stage: generous organic pastel blob,
 * grounded open character stage, and floating stationery pill tag.
 */
const FeatureVisualStage = ({
  blobColor,
  blobPath,
  pillLabel,
  pillAccentColor,
  pillPositionClass,
  children,
}: FeatureVisualStageProps) => {
  const stageRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start'],
  })

  const smoothScroll = useSpring(scrollYProgress, PARALLAX_SPRING)
  const blobY = useTransform(smoothScroll, [0, 1], [-8, 8])
  const cardY = useTransform(smoothScroll, [0, 1], [14, -14])
  const pillY = useTransform(smoothScroll, [0, 1], [18, -18])

  return (
    <div
      ref={stageRef}
      className="relative max-w-[560px] mx-auto lg:max-w-none min-h-[320px] sm:min-h-[360px] flex items-center justify-center pt-4 pb-4 sm:pt-5 sm:pb-5 px-2 sm:px-5"
    >
      {/* Layer 1: Organic Curved Pastel Blob */}
      <motion.div
        aria-hidden="true"
        style={{ y: shouldReduceMotion ? 0 : blobY }}
        className="pointer-events-none absolute inset-x-2 inset-y-3 sm:inset-x-5 sm:inset-y-4 flex items-center justify-center z-0"
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

      {/* Layer 2: Foreground Open Stage */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : cardY }}
        className="relative z-10 w-full"
      >
        {children}
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
  const shouldReduceMotion = Boolean(useReducedMotion())

  return (
    <section id="fitur" className="relative bg-white py-16 sm:py-24 overflow-x-clip">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
        {/* Compact Section Intro */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-20 space-y-3"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: SMOOTH_EASE }}
        >
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
        </motion.div>

        {/* Alternating Storytelling Rows + Inter-Row S-Curve Connectors */}
        <div className="relative z-10 flex flex-col gap-16 sm:gap-24 lg:gap-0">
          {FEATURE_STORY_ROWS.map((row, index) => {
            const isVisualFirstOnDesktop = index % 2 === 1
            const { IconComponent } = row
            const connectorColors = CONNECTOR_COLORS[index]

            return (
              <Fragment key={row.id}>
                <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Text Column */}
                  <motion.div
                    className={`lg:col-span-5 ${
                      isVisualFirstOnDesktop ? 'lg:order-2' : 'lg:order-1'
                    }`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.58, ease: SMOOTH_EASE }}
                  >
                    <div className="max-w-[380px] mx-auto lg:mx-0 space-y-4">
                      <motion.div
                        aria-hidden="true"
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.07, rotate: -4 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                        className={`w-14 h-14 rounded-full ${row.badgeColorClass} flex items-center justify-center shadow-[0_4px_0_0_rgba(15,23,42,0.08)]`}
                      >
                        <IconComponent weight="fill" className="w-7 h-7 text-white" />
                      </motion.div>
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
                  </motion.div>

                  {/* Visual Stage Column */}
                  <motion.div
                    className={`lg:col-span-7 ${
                      isVisualFirstOnDesktop ? 'lg:order-1' : 'lg:order-2'
                    }`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.65, delay: 0.08, ease: SMOOTH_EASE }}
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
                  </motion.div>
                </div>

                {index < FEATURE_STORY_ROWS.length - 1 && connectorColors && (
                  <InterRowConnector
                    direction={index % 2 === 0 ? 'right-to-left' : 'left-to-right'}
                    fromColor={connectorColors.from}
                    toColor={connectorColors.to}
                  />
                )}
              </Fragment>
            )
          })}
        </div>
      </div>
    </section>
  )
}
