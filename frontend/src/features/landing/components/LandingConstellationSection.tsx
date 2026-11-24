import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import constellationJapanImg from '@/assets/landing/constellation-japan.jpg'
import constellationUkImg from '@/assets/landing/constellation-uk.jpg'
import constellationGermanyImg from '@/assets/landing/constellation-germany.jpg'
import constellationUsImg from '@/assets/landing/constellation-us.jpg'
import constellationChinaImg from '@/assets/landing/constellation-china.jpg'
import constellationFranceImg from '@/assets/landing/constellation-france.jpg'
import { LandingConstellationTrails } from '@/features/landing/components/LandingConstellationTrails'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const
const PARALLAX_SPRING = {
  stiffness: 90,
  damping: 28,
  mass: 0.4,
  restDelta: 0.001,
} as const

interface ConstellationCardItem {
  id: string
  image: string
  alt: string
  aspectClass: string
  cardTiltClass: string
  imgPositionClass?: string
  wrapperClass?: string
  pillText: string
  flagCode: 'ja' | 'en-gb' | 'en-us' | 'de' | 'zh' | 'fr'
  parallaxKey: 'leftOuter' | 'inner' | 'rightOuter'
}

const LEFT_CONSTELLATION_CARDS: ReadonlyArray<ConstellationCardItem> = [
  {
    id: 'constellation-japan',
    image: constellationJapanImg,
    alt: 'Pemandangan Gunung Fuji dan alam Jepang di cahaya pagi',
    aspectClass: 'aspect-[4/3]',
    cardTiltClass: 'lg:w-[72%] lg:-rotate-2',
    pillText: 'Jepang · JLPT',
    flagCode: 'ja',
    parallaxKey: 'leftOuter',
  },
  {
    id: 'constellation-uk',
    image: constellationUkImg,
    alt: 'Pemandangan Big Ben dan Westminster Bridge London',
    aspectClass: 'aspect-[5/4]',
    cardTiltClass: 'lg:w-[64%] lg:ml-6 lg:rotate-2 lg:translate-x-5',
    pillText: 'Inggris UK · IELTS',
    flagCode: 'en-gb',
    parallaxKey: 'inner',
  },
  {
    id: 'constellation-germany',
    image: constellationGermanyImg,
    alt: 'Suasana kota tua Heidelberg Jerman',
    aspectClass: 'aspect-[16/10]',
    cardTiltClass: 'lg:w-[78%] lg:ml-2 lg:-rotate-1',
    imgPositionClass: 'object-[50%_58%]',
    wrapperClass: 'col-span-2 lg:col-span-1',
    pillText: 'Jerman · Goethe',
    flagCode: 'de',
    parallaxKey: 'leftOuter',
  },
]

const RIGHT_CONSTELLATION_CARDS: ReadonlyArray<ConstellationCardItem> = [
  {
    id: 'constellation-us',
    image: constellationUsImg,
    alt: 'Pemandangan kota New York Amerika Serikat',
    aspectClass: 'aspect-[4/3]',
    cardTiltClass: 'lg:w-[72%] lg:ml-auto lg:rotate-2',
    pillText: 'Inggris US · TOEFL',
    flagCode: 'en-us',
    parallaxKey: 'rightOuter',
  },
  {
    id: 'constellation-china',
    image: constellationChinaImg,
    alt: 'Suasana jalanan tradisional Tiongkok yang cerah',
    aspectClass: 'aspect-[5/4]',
    cardTiltClass: 'lg:w-[64%] lg:ml-auto lg:mr-6 lg:-rotate-2 lg:-translate-x-5',
    pillText: 'Mandarin · HSK',
    flagCode: 'zh',
    parallaxKey: 'inner',
  },
  {
    id: 'constellation-france',
    image: constellationFranceImg,
    alt: 'Menara Eiffel Paris di cahaya pagi',
    aspectClass: 'aspect-[16/10]',
    cardTiltClass: 'lg:w-[78%] lg:ml-auto lg:mr-2 lg:rotate-1',
    imgPositionClass: 'object-[50%_64%]',
    wrapperClass: 'col-span-2 lg:col-span-1',
    pillText: 'Prancis · DELF',
    flagCode: 'fr',
    parallaxKey: 'rightOuter',
  },
]

interface ConstellationPhotoCardProps {
  card: ConstellationCardItem
  index: number
  shouldReduceMotion: boolean
  yMotion: MotionValue<number> | undefined
}

const ConstellationPhotoCard = ({
  card,
  index,
  shouldReduceMotion,
  yMotion,
}: ConstellationPhotoCardProps) => {
  return (
    <motion.div
      style={yMotion ? { y: yMotion } : undefined}
      className={card.wrapperClass}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={
          shouldReduceMotion
            ? undefined
            : { y: -5, transition: { type: 'spring', stiffness: 260, damping: 22 } }
        }
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.55, delay: index * 0.07, ease: SMOOTH_EASE }}
      >
        <div
          className={`group relative overflow-hidden rounded-[22px] sm:rounded-[26px] border-[3px] border-white ring-1 ring-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.08)] motion-safe:transition-shadow duration-500 motion-safe:hover:shadow-[0_14px_28px_-8px_rgba(37,99,235,0.16),0_6px_0_0_rgba(45,64,150,0.08)] bg-slate-100 ${card.aspectClass} ${card.cardTiltClass}`}
        >
          <img
            src={card.image}
            alt={card.alt}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover ${card.imgPositionClass ?? 'object-center'} motion-safe:transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.05]`}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/35 via-slate-950/10 to-transparent"
          />

          <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10 inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/90 px-2 sm:px-3 py-0.5 sm:py-1 shadow-xs text-[10px] sm:text-xs font-brand font-black text-[#1E293B] max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-1.5rem)] truncate">
            <span
              aria-hidden="true"
              className="w-4 h-2.5 sm:w-5 sm:h-3.5 rounded-[2px] sm:rounded-[3px] overflow-hidden shrink-0 inline-flex items-center justify-center"
            >
              <LanguageFlagIllustration
                code={card.flagCode}
                compact
                className="w-full h-full object-contain shrink-0"
              />
            </span>
            <span className="truncate">{card.pillText}</span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export const LandingConstellationSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = Boolean(useReducedMotion())

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const smoothParallax = useSpring(scrollYProgress, PARALLAX_SPRING)
  const yLeftOuter = useTransform(smoothParallax, [0, 1], [-12, 12])
  const yInner = useTransform(smoothParallax, [0, 1], [16, -16])
  const yRightOuter = useTransform(smoothParallax, [0, 1], [-14, 14])

  const parallaxByKey: Record<ConstellationCardItem['parallaxKey'], MotionValue<number>> = {
    leftOuter: yLeftOuter,
    inner: yInner,
    rightOuter: yRightOuter,
  }

  return (
    <section
      ref={containerRef}
      className="relative bg-white pt-4 pb-12 sm:pt-6 sm:pb-24 px-4 sm:px-6 overflow-x-clip"
    >
      <div className="max-w-[1220px] mx-auto relative">
        <LandingConstellationTrails scrollYProgress={scrollYProgress} />
        <div className="relative z-10 grid lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
          {/* Left Editorial Photo Cluster */}
          <div className="order-2 lg:order-1 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 items-center">
            {LEFT_CONSTELLATION_CARDS.map((card, index) => (
              <ConstellationPhotoCard
                key={card.id}
                card={card}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
                yMotion={shouldReduceMotion ? undefined : parallaxByKey[card.parallaxKey]}
              />
            ))}
          </div>

          {/* Center Headline Centerpiece */}
          <motion.div
            className="order-1 lg:order-2 lg:col-span-4 text-center px-3 sm:px-4 py-2 lg:py-8 space-y-3"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: SMOOTH_EASE }}
          >
            <h2 className="text-2xl sm:text-[32px] font-brand font-black text-[#1E293B] leading-[1.2] tracking-tight">
              Menghubungkan kosakata, tata bahasa, dan latihan harian.
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] max-w-sm mx-auto leading-relaxed">
              Semua fondasi belajar tersusun rapi dari langkah pertama tanpa tampilan yang
              membingungkan.
            </p>
          </motion.div>

          {/* Right Editorial Photo Cluster */}
          <div className="order-3 lg:order-3 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 items-center">
            {RIGHT_CONSTELLATION_CARDS.map((card, index) => (
              <ConstellationPhotoCard
                key={card.id}
                card={card}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
                yMotion={shouldReduceMotion ? undefined : parallaxByKey[card.parallaxKey]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
