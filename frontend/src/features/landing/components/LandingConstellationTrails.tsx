import { useId, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

interface ConstellationTrailSpec {
  id: string
  rowIndex: 0 | 1 | 2
  d: string
  hubX: number
  hubY: number
  endX: number
  endY: number
}

const CONSTELLATION_TRAILS: ReadonlyArray<ConstellationTrailSpec> = [
  {
    id: 'japan',
    rowIndex: 0,
    d: 'M 498 196 C 436 124, 354 106, 250 112',
    hubX: 498,
    hubY: 196,
    endX: 250,
    endY: 112,
  },
  {
    id: 'uk',
    rowIndex: 1,
    d: 'M 418 320 C 372 306, 316 306, 264 318',
    hubX: 418,
    hubY: 320,
    endX: 264,
    endY: 318,
  },
  {
    id: 'germany',
    rowIndex: 2,
    d: 'M 498 444 C 436 516, 360 536, 274 532',
    hubX: 498,
    hubY: 444,
    endX: 274,
    endY: 532,
  },
  {
    id: 'us',
    rowIndex: 0,
    d: 'M 722 196 C 784 124, 866 106, 970 112',
    hubX: 722,
    hubY: 196,
    endX: 970,
    endY: 112,
  },
  {
    id: 'china',
    rowIndex: 1,
    d: 'M 802 320 C 848 306, 904 306, 956 318',
    hubX: 802,
    hubY: 320,
    endX: 956,
    endY: 318,
  },
  {
    id: 'france',
    rowIndex: 2,
    d: 'M 722 444 C 784 516, 860 536, 946 532',
    hubX: 722,
    hubY: 444,
    endX: 946,
    endY: 532,
  },
]

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const

/**
 * Desktop-only radial cubic Bézier SVG trail backdrop connecting the center
 * constellation headline zone to all six surrounding destination cards.
 * Uses a one-shot intersection reveal so SVG masks cost 0% CPU during scroll.
 */
export const LandingConstellationTrails = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const rawId = useId()
  const idPrefix = rawId.replace(/[^a-zA-Z0-9_-]/g, '') || 'trail'
  const shouldReduceMotion = Boolean(useReducedMotion())
  const isInView = useInView(svgRef, { once: true, amount: 0.25 })

  const getMaskId = (trailId: string) => `constellation-mask-${idPrefix}-${trailId}`
  const getGuideGradId = (trailId: string) => `constellation-guide-${idPrefix}-${trailId}`
  const getActiveGradId = (trailId: string) => `constellation-active-${idPrefix}-${trailId}`

  return (
    <svg
      ref={svgRef}
      className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full z-0 overflow-visible"
      viewBox="0 0 1220 640"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {CONSTELLATION_TRAILS.map((trail) => (
          <linearGradient
            key={`guide-grad-${trail.id}`}
            id={getGuideGradId(trail.id)}
            gradientUnits="userSpaceOnUse"
            x1={trail.hubX}
            y1={trail.hubY}
            x2={trail.endX}
            y2={trail.endY}
          >
            <stop offset="0%" stopColor="#CBD5E1" stopOpacity={0} />
            <stop offset="24%" stopColor="#CBD5E1" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0.75} />
          </linearGradient>
        ))}

        {CONSTELLATION_TRAILS.map((trail) => (
          <linearGradient
            key={`active-grad-${trail.id}`}
            id={getActiveGradId(trail.id)}
            gradientUnits="userSpaceOnUse"
            x1={trail.hubX}
            y1={trail.hubY}
            x2={trail.endX}
            y2={trail.endY}
          >
            <stop offset="0%" stopColor="#93C5FD" stopOpacity={0} />
            <stop offset="24%" stopColor="#60A5FA" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={1} />
          </linearGradient>
        ))}

        {CONSTELLATION_TRAILS.map((trail) => (
          <mask
            key={`mask-${trail.id}`}
            id={getMaskId(trail.id)}
            maskUnits="userSpaceOnUse"
            x="-20"
            y="-20"
            width="1260"
            height="680"
          >
            <motion.path
              d={trail.d}
              fill="none"
              stroke="white"
              strokeWidth="16"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
              animate={{ pathLength: shouldReduceMotion || isInView ? 1 : 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.85,
                      delay: trail.rowIndex * 0.14,
                      ease: SMOOTH_EASE,
                    }
              }
            />
          </mask>
        ))}
      </defs>

      {/* Layer 1: Soft gradient-faded slate dashed guide */}
      <g>
        {CONSTELLATION_TRAILS.map((trail) => (
          <path
            key={trail.id}
            d={trail.d}
            fill="none"
            stroke={`url(#${getGuideGradId(trail.id)})`}
            strokeWidth={2}
            strokeDasharray="6 8"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>

      {/* Layer 2: Crisp one-shot drawn blue dashed progress trail */}
      <g>
        {CONSTELLATION_TRAILS.map((trail) => (
          <path
            key={trail.id}
            d={trail.d}
            fill="none"
            stroke={`url(#${getActiveGradId(trail.id)})`}
            strokeWidth={2.5}
            strokeDasharray="6 8"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            mask={`url(#${getMaskId(trail.id)})`}
          />
        ))}
      </g>
    </svg>
  )
}
