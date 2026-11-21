import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FC,
} from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, Sparkle, X } from '@phosphor-icons/react'
import { Button3D } from './Button3D'
import { KodiCharacter, type KodiEmotion } from './KodiCharacter'
import { triggerHaptic } from '@/shared/utils/haptics'
import { playSound } from '@/shared/utils/sound'

export type SpotlightPlacement = 'auto' | 'right' | 'left' | 'bottom' | 'top'

export interface SpotlightTourStep {
  id: string
  targetSelector: string
  badge: string
  title: string
  description: string
  mascotEmotion?: KodiEmotion
  placement?: SpotlightPlacement
  padding?: number
}

export interface SpotlightTourOverlayProps {
  isOpen: boolean
  steps: SpotlightTourStep[]
  onComplete: () => void
  onSkip: () => void
}

interface SpotlightRect {
  left: number
  top: number
  width: number
  height: number
}

interface CardPosition {
  left: number
  top: number
  width: number
}

const VIEWPORT_MARGIN = 16
const CARD_GAP = 16
const DEFAULT_CARD_HEIGHT = 250

const findVisibleTarget = (selector: string): HTMLElement | null => {
  if (typeof document === 'undefined') return null
  const matches = document.querySelectorAll<HTMLElement>(selector)
  for (const el of matches) {
    const rect = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)
    if (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden'
    ) {
      return el
    }
  }
  return null
}

const filterVisibleSteps = (steps: SpotlightTourStep[]): SpotlightTourStep[] =>
  steps.filter((step) => findVisibleTarget(step.targetSelector) !== null)

const measureTargetBox = (step?: SpotlightTourStep): SpotlightRect | null => {
  if (!step) return null
  const el = findVisibleTarget(step.targetSelector)
  if (!el) return null
  const rect = el.getBoundingClientRect()
  const pad = step.padding ?? 8
  return {
    left: Math.max(4, rect.left - pad),
    top: Math.max(4, rect.top - pad),
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  }
}

const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(val, max))

const computeCardPosition = (
  box: SpotlightRect | null,
  cardHeight: number,
  preferred: SpotlightPlacement = 'auto'
): CardPosition => {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768
  const cardWidth = Math.min(352, vw - VIEWPORT_MARGIN * 2)
  const h = cardHeight > 0 ? cardHeight : DEFAULT_CARD_HEIGHT

  if (!box) {
    return {
      left: clamp((vw - cardWidth) / 2, VIEWPORT_MARGIN, vw - cardWidth - VIEWPORT_MARGIN),
      top: clamp((vh - h) / 2, VIEWPORT_MARGIN, vh - h - VIEWPORT_MARGIN),
      width: cardWidth,
    }
  }

  const spaceRight = vw - (box.left + box.width + CARD_GAP + VIEWPORT_MARGIN)
  const spaceLeft = box.left - (CARD_GAP + VIEWPORT_MARGIN)
  const spaceBottom = vh - (box.top + box.height + CARD_GAP + VIEWPORT_MARGIN)
  const spaceTop = box.top - (CARD_GAP + VIEWPORT_MARGIN)

  const fitsSide = (side: Exclude<SpotlightPlacement, 'auto'>): boolean => {
    if (side === 'right') return spaceRight >= cardWidth
    if (side === 'left') return spaceLeft >= cardWidth
    if (side === 'bottom') return spaceBottom >= h
    return spaceTop >= h
  }

  let chosen: Exclude<SpotlightPlacement, 'auto'>
  if (preferred !== 'auto' && fitsSide(preferred)) {
    chosen = preferred
  } else {
    const order: Array<{ side: Exclude<SpotlightPlacement, 'auto'>; space: number }> = [
      { side: 'right', space: spaceRight >= cardWidth ? spaceRight : -1 },
      { side: 'left', space: spaceLeft >= cardWidth ? spaceLeft : -1 },
      { side: 'bottom', space: spaceBottom },
      { side: 'top', space: spaceTop },
    ]
    order.sort((a, b) => b.space - a.space)
    chosen = order[0].side
  }

  let left: number
  let top: number

  if (chosen === 'right') {
    left = box.left + box.width + CARD_GAP
    top = box.top + box.height / 2 - h / 2
  } else if (chosen === 'left') {
    left = box.left - cardWidth - CARD_GAP
    top = box.top + box.height / 2 - h / 2
  } else if (chosen === 'bottom') {
    left = box.left + box.width / 2 - cardWidth / 2
    top = box.top + box.height + CARD_GAP
  } else {
    left = box.left + box.width / 2 - cardWidth / 2
    top = box.top - h - CARD_GAP
  }

  return {
    left: clamp(left, VIEWPORT_MARGIN, Math.max(VIEWPORT_MARGIN, vw - cardWidth - VIEWPORT_MARGIN)),
    top: clamp(top, VIEWPORT_MARGIN, Math.max(VIEWPORT_MARGIN, vh - h - VIEWPORT_MARGIN)),
    width: cardWidth,
  }
}

interface SpotlightTourSessionProps {
  steps: SpotlightTourStep[]
  onComplete: () => void
  onSkip: () => void
}

const SpotlightTourSession: FC<SpotlightTourSessionProps> = ({
  steps,
  onComplete,
  onSkip,
}) => {
  const maskId = useId()
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [visibleSteps] = useState<SpotlightTourStep[]>(() => filterVisibleSteps(steps))
  const [stepIndex, setStepIndex] = useState(0)
  const [spotlightBox, setSpotlightBox] = useState<SpotlightRect | null>(() =>
    measureTargetBox(visibleSteps[0])
  )
  const [cardHeight, setCardHeight] = useState(DEFAULT_CARD_HEIGHT)

  const currentStep = visibleSteps[stepIndex]
  const totalSteps = visibleSteps.length
  const isLastStep = stepIndex >= totalSteps - 1

  const syncMeasurements = useCallback(() => {
    const nextBox = measureTargetBox(currentStep)
    setSpotlightBox(nextBox)
    if (cardRef.current) {
      const measuredHeight = cardRef.current.getBoundingClientRect().height
      if (measuredHeight > 0) {
        setCardHeight(measuredHeight)
      }
    }
  }, [currentStep])

  // Auto-skip cleanly if no tour anchors are currently rendered
  useEffect(() => {
    if (visibleSteps.length > 0) return
    const timer = window.setTimeout(() => {
      onComplete()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [visibleSteps.length, onComplete])

  // Scroll target element into view and observe layout shifts
  useEffect(() => {
    if (!currentStep) return
    const targetEl = findVisibleTarget(currentStep.targetSelector)
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect()
      const isOutOfComfortZone = rect.top < 72 || rect.bottom > window.innerHeight - 96
      if (isOutOfComfortZone) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      }
    }

    const rafId = window.requestAnimationFrame(syncMeasurements)
    const settleTimerA = window.setTimeout(syncMeasurements, 180)
    const settleTimerB = window.setTimeout(syncMeasurements, 380)

    window.addEventListener('resize', syncMeasurements)
    window.addEventListener('scroll', syncMeasurements, true)

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(syncMeasurements)
      if (targetEl) ro.observe(targetEl)
      ro.observe(document.body)
    }

    return () => {
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(settleTimerA)
      window.clearTimeout(settleTimerB)
      window.removeEventListener('resize', syncMeasurements)
      window.removeEventListener('scroll', syncMeasurements, true)
      ro?.disconnect()
    }
  }, [currentStep, syncMeasurements])

  const handleNext = useCallback(() => {
    triggerHaptic('tap')
    if (isLastStep) {
      playSound('quest_complete')
      onComplete()
      return
    }
    playSound('node_tap')
    setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [isLastStep, onComplete, totalSteps])

  const handleBack = useCallback(() => {
    if (stepIndex === 0) return
    triggerHaptic('tap')
    playSound('node_tap')
    setStepIndex((prev) => Math.max(prev - 1, 0))
  }, [stepIndex])

  const handleSkip = useCallback(() => {
    triggerHaptic('tap')
    playSound('modal_close')
    onSkip()
  }, [onSkip])

  // Keyboard navigation: Esc to skip, Right/Enter for next, Left for back
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleSkip()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleBack()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleBack, handleNext, handleSkip])

  if (!currentStep) return null

  const cardPos = computeCardPosition(spotlightBox, cardHeight, currentStep.placement)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panduan Fitur Merantalk"
      className="fixed inset-0 z-[120]"
    >
      {/* ── DARK BACKDROP WITH SVG SPOTLIGHT CUTOUT ── */}
      <svg
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-auto"
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            {spotlightBox && (
              <rect
                x={spotlightBox.left}
                y={spotlightBox.top}
                width={spotlightBox.width}
                height={spotlightBox.height}
                rx={18}
                ry={18}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.72)"
          mask={`url(#${maskId})`}
        />
      </svg>

      {/* ── GLOWING SPOTLIGHT BORDER RING ── */}
      {spotlightBox && (
        <div
          aria-hidden="true"
          className="fixed pointer-events-none rounded-[18px] border-2 border-blue-400 shadow-[0_0_0_6px_rgba(59,130,246,0.22)] transition-all duration-300 ease-out"
          style={{
            left: spotlightBox.left,
            top: spotlightBox.top,
            width: spotlightBox.width,
            height: spotlightBox.height,
          }}
        />
      )}

      {/* ── GAME-LIKE 3D CALLOUT CARD + MERA MASCOT ── */}
      <div
        ref={cardRef}
        className="fixed z-10 bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-[0_20px_45px_-12px_rgba(15,23,42,0.5)] transition-all duration-300 ease-out space-y-3.5"
        style={{
          left: cardPos.left,
          top: cardPos.top,
          width: cardPos.width,
        }}
      >
        {/* Top bar: step badge + skip X */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-brand font-black text-[10px] uppercase tracking-wider">
            <Sparkle weight="fill" className="w-3 h-3 text-blue-600" />
            <span>
              {currentStep.badge} • {stepIndex + 1}/{totalSteps}
            </span>
          </span>
          <button
            type="button"
            onClick={handleSkip}
            aria-label="Lewati panduan"
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X weight="bold" className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mascot + explanation */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 -mt-1">
            <KodiCharacter emotion={currentStep.mascotEmotion ?? 'welcome'} size={56} />
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="font-brand font-black text-sm sm:text-base text-slate-900 leading-snug">
              {currentStep.title}
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {currentStep.description}
            </p>
          </div>
        </div>

        {/* Step progress dots */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5" aria-hidden="true">
          {visibleSteps.map((st, idx) => (
            <span
              key={st.id}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                idx === stepIndex
                  ? 'w-5 bg-blue-600'
                  : idx < stepIndex
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-brand font-bold text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Lewati
          </button>

          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 text-xs font-brand font-bold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white transition-all cursor-pointer active:translate-y-0.5"
              >
                <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            )}
            <Button3D
              type="button"
              variant="blue"
              size="sm"
              onClick={handleNext}
              className="text-xs px-4 py-2"
            >
              <span className="inline-flex items-center gap-1.5">
                <span>{isLastStep ? 'Mulai Belajar!' : 'Lanjut'}</span>
                {!isLastStep && <ArrowRight weight="bold" className="w-3.5 h-3.5" />}
              </span>
            </Button3D>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SpotlightTourOverlay: FC<SpotlightTourOverlayProps> = ({
  isOpen,
  steps,
  onComplete,
  onSkip,
}) => {
  if (!isOpen || typeof document === 'undefined' || steps.length === 0) {
    return null
  }

  return createPortal(
    <SpotlightTourSession steps={steps} onComplete={onComplete} onSkip={onSkip} />,
    document.body
  )
}
