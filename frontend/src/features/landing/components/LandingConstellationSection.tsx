import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { Clock } from '@phosphor-icons/react'
import constellationJapanImg from '@/assets/landing/constellation-japan.jpg'
import constellationUkImg from '@/assets/landing/constellation-uk.jpg'
import constellationGermanyImg from '@/assets/landing/constellation-germany.jpg'
import constellationDailyImg from '@/assets/landing/constellation-daily.jpg'
import constellationChinaImg from '@/assets/landing/constellation-china.jpg'
import constellationFranceImg from '@/assets/landing/constellation-france.jpg'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'

interface ConstellationCardItem {
  id: string
  image: string
  alt: string
  aspectClass: string
  cardTiltClass: string
  wrapperClass?: string
  pillText: string
  flagCode?: 'ja' | 'en-gb' | 'de' | 'zh' | 'fr'
  parallaxKey: 'leftOuter' | 'inner' | 'rightOuter'
}

const LEFT_CONSTELLATION_CARDS: ReadonlyArray<ConstellationCardItem> = [
  {
    id: 'constellation-japan',
    image: constellationJapanImg,
    alt: 'Suasana jalanan dan Gunung Fuji di Jepang',
    aspectClass: 'aspect-[4/3]',
    cardTiltClass: 'lg:w-[72%] lg:-rotate-2',
    pillText: 'Jepang · JLPT',
    flagCode: 'ja',
    parallaxKey: 'leftOuter',
  },
  {
    id: 'constellation-uk',
    image: constellationUkImg,
    alt: 'Pemandangan kota London Inggris',
    aspectClass: 'aspect-[5/4]',
    cardTiltClass: 'lg:w-[64%] lg:ml-6 lg:rotate-2 lg:translate-x-5',
    pillText: 'Inggris · IELTS',
    flagCode: 'en-gb',
    parallaxKey: 'inner',
  },
  {
    id: 'constellation-germany',
    image: constellationGermanyImg,
    alt: 'Suasana arsitektur kota di Jerman',
    aspectClass: 'aspect-[16/10]',
    cardTiltClass: 'lg:w-[78%] lg:ml-2 lg:-rotate-1',
    wrapperClass: 'col-span-2 lg:col-span-1',
    pillText: 'Jerman · Goethe',
    flagCode: 'de',
    parallaxKey: 'leftOuter',
  },
]

const RIGHT_CONSTELLATION_CARDS: ReadonlyArray<ConstellationCardItem> = [
  {
    id: 'constellation-daily',
    image: constellationDailyImg,
    alt: 'Pelajar belajar santai dengan laptop di kafe',
    aspectClass: 'aspect-[4/3]',
    cardTiltClass: 'lg:w-[72%] lg:ml-auto lg:rotate-2',
    pillText: '5–15 mnt / hari',
    parallaxKey: 'rightOuter',
  },
  {
    id: 'constellation-china',
    image: constellationChinaImg,
    alt: 'Suasana jalanan kota modern Mandarin',
    aspectClass: 'aspect-[5/4]',
    cardTiltClass: 'lg:w-[64%] lg:ml-auto lg:mr-6 lg:-rotate-2 lg:-translate-x-5',
    pillText: 'Mandarin · HSK',
    flagCode: 'zh',
    parallaxKey: 'inner',
  },
  {
    id: 'constellation-france',
    image: constellationFranceImg,
    alt: 'Suasana kafe pagi di Paris Prancis',
    aspectClass: 'aspect-[16/10]',
    cardTiltClass: 'lg:w-[78%] lg:ml-auto lg:mr-2 lg:rotate-1',
    wrapperClass: 'col-span-2 lg:col-span-1',
    pillText: 'Prancis · DELF',
    flagCode: 'fr',
    parallaxKey: 'rightOuter',
  },
]

interface ConstellationPhotoCardProps {
  card: ConstellationCardItem
  yMotion: MotionValue<number> | undefined
}

const ConstellationPhotoCard = ({
  card,
  yMotion,
}: ConstellationPhotoCardProps) => {
  return (
    <motion.div
      style={yMotion ? { y: yMotion } : undefined}
      className={card.wrapperClass}
    >
      <div
        className={`group relative overflow-hidden rounded-[26px] border-[3px] border-white ring-1 ring-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.08)] bg-slate-100 ${card.aspectClass} ${card.cardTiltClass}`}
      >
        <img
          src={card.image}
          alt={card.alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center motion-safe:transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/35 via-slate-950/10 to-transparent"
        />

        <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/90 px-3 py-1 shadow-xs text-xs font-brand font-black text-[#1E293B]">
          {card.flagCode ? (
            <span
              aria-hidden="true"
              className="w-5 h-3.5 rounded-[3px] overflow-hidden shrink-0 inline-flex items-center justify-center"
            >
              <LanguageFlagIllustration
                code={card.flagCode}
                compact
                className="w-5 h-3.5 rounded-[3px] object-contain shrink-0"
              />
            </span>
          ) : (
            <Clock
              weight="fill"
              aria-hidden="true"
              className="w-3.5 h-3.5 text-amber-500 shrink-0"
            />
          )}
          <span>{card.pillText}</span>
        </span>
      </div>
    </motion.div>
  )
}

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

  const parallaxByKey: Record<ConstellationCardItem['parallaxKey'], MotionValue<number>> = {
    leftOuter: yLeftOuter,
    inner: yInner,
    rightOuter: yRightOuter,
  }

  return (
    <section
      ref={containerRef}
      className="relative bg-white pt-4 pb-16 sm:pt-6 sm:pb-24 px-4 sm:px-6 overflow-x-clip"
    >
      <div className="max-w-[1220px] mx-auto grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Editorial Photo Cluster */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3.5 sm:gap-4 items-center">
          {LEFT_CONSTELLATION_CARDS.map((card) => (
            <ConstellationPhotoCard
              key={card.id}
              card={card}
              yMotion={shouldReduceMotion ? undefined : parallaxByKey[card.parallaxKey]}
            />
          ))}
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

        {/* Right Editorial Photo Cluster */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3.5 sm:gap-4 items-center">
          {RIGHT_CONSTELLATION_CARDS.map((card) => (
            <ConstellationPhotoCard
              key={card.id}
              card={card}
              yMotion={shouldReduceMotion ? undefined : parallaxByKey[card.parallaxKey]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
