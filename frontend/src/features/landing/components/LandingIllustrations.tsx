import {
  useEffect,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowsClockwise, Check, Gift, SpeakerHigh, Star } from '@phosphor-icons/react'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

/**
 * ClassDojo-inspired crisp white tactile studio framing that lifts illustration
 * cards cleanly above organic pastel blobs.
 */
export const StudioCardFrame = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={`bg-white border-2 border-[#E2E8F0] rounded-[24px] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] ${className}`.trim()}
    >
      {children}
    </div>
  )
}

/**
 * Animated vertical soundwave bars that pulse smoothly while speech audio plays.
 */
export const AudioWaveformBars = ({ isPlaying }: { isPlaying: boolean }) => {
  const barHeights = [8, 15, 11, 16]

  return (
    <span className="inline-flex items-end gap-[3px] h-4" aria-hidden="true">
      {barHeights.map((peakHeight, idx) => (
        <motion.span
          key={idx}
          className={`w-[3px] rounded-full ${isPlaying ? 'bg-blue-600' : 'bg-slate-300'}`}
          initial={{ height: 5 }}
          animate={
            isPlaying
              ? {
                  height: [5, peakHeight, 7, Math.max(6, peakHeight - 3), 5],
                }
              : { height: 5 + (idx % 2) * 3 }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.72,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                  delay: idx * 0.1,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </span>
  )
}

type PreviewNodeId = 'done' | 'active' | 'chest'

interface CurriculumPreviewNode {
  id: PreviewNodeId
  title: string
  subtitle: string
  statusPill: string
  statusPillClass: string
  offsetClass: string
  baseButtonClass: string
}

const CURRICULUM_PREVIEW_NODES: ReadonlyArray<CurriculumPreviewNode> = [
  {
    id: 'done',
    title: 'Sapaan Pagi',
    subtitle: 'Salam sopan dan ungkapan pembuka percakapan harian',
    statusPill: '+20 XP',
    statusPillClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    offsetClass: '-translate-y-1',
    baseButtonClass:
      'w-12 h-12 rounded-full bg-[#10B981] text-white shadow-[0_4px_0_0_#047857]',
  },
  {
    id: 'active',
    title: 'Perkenalan Kerja',
    subtitle: 'Dengarkan audio sapaan dasar & pilih arti tepat',
    statusPill: 'Coba Gratis',
    statusPillClass: 'bg-blue-50 text-[#2563EB] border border-blue-200',
    offsetClass: 'translate-y-1.5',
    baseButtonClass:
      'w-14 h-14 rounded-full bg-[#2563EB] text-white shadow-[0_5px_0_0_#1D4ED8]',
  },
  {
    id: 'chest',
    title: 'Peti Hadiah Unit 1',
    subtitle: 'Buka bonus poin setelah menuntaskan rangkaian pelajaran',
    statusPill: '+15 Gems',
    statusPillClass: 'bg-amber-50 text-amber-800 border border-amber-200',
    offsetClass: '-translate-y-1',
    baseButtonClass:
      'w-12 h-12 rounded-2xl bg-[#F59E0B] text-white shadow-[0_4px_0_0_#B45309]',
  },
]

/**
 * Interactive 3D stepping-stone curriculum stage matching `/curriculum`, with
 * selectable nodes and live-updating lesson popover.
 */
export const CurriculumPathIllustration = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<PreviewNodeId>('active')
  const shouldReduceMotion = useReducedMotion()

  const selectedNode =
    CURRICULUM_PREVIEW_NODES.find((node) => node.id === selectedNodeId) ??
    CURRICULUM_PREVIEW_NODES[1]

  const handleSelectNode = (nodeId: PreviewNodeId) => {
    triggerHaptic('tap')
    setSelectedNodeId(nodeId)
  }

  return (
    <StudioCardFrame className="overflow-hidden">
      {/* Mini Unit Header matching /curriculum */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#0284C7] px-5 py-3.5 text-white flex items-center justify-between gap-2">
        <span className="font-brand font-black text-xs sm:text-sm tracking-wide truncate">
          UNIT 1 · SAPAAN &amp; PERKENALAN
        </span>
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-mono font-bold whitespace-nowrap shrink-0">
          3/4 Pelajaran
        </span>
      </div>

      {/* Interactive 3-Node Stepping-Stone Stage */}
      <div className="bg-[#FAFAF9] p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex-1 flex items-center justify-between px-3 sm:px-5 py-2">
            {/* Dashed Stepping-Stone Connector Track */}
            <div
              aria-hidden="true"
              className="absolute inset-x-9 sm:inset-x-11 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-[#CBD5E1] pointer-events-none"
            />

            {CURRICULUM_PREVIEW_NODES.map((node) => {
              const isSelected = selectedNodeId === node.id
              const ringClass = isSelected
                ? 'ring-2 ring-offset-2 ring-[#2563EB]'
                : node.id === 'active'
                  ? 'ring-4 ring-blue-100'
                  : ''

              return (
                <div
                  key={node.id}
                  className={`relative z-10 flex items-center justify-center ${node.offsetClass}`}
                >
                  {node.id === 'active' && isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute -inset-2 rounded-full bg-blue-100/85 pointer-events-none"
                    />
                  )}
                  <motion.button
                    type="button"
                    onClick={() => handleSelectNode(node.id)}
                    aria-pressed={isSelected}
                    aria-label={`${node.title} (${node.statusPill})`}
                    title={node.title}
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    whileTap={shouldReduceMotion ? undefined : { y: 2 }}
                    transition={{ duration: 0.12 }}
                    className={`relative inline-flex items-center justify-center cursor-pointer transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB] ${node.baseButtonClass} ${ringClass}`}
                  >
                    {node.id === 'done' && <Check weight="bold" className="w-5 h-5" />}
                    {node.id === 'active' && <Star weight="fill" className="w-6 h-6" />}
                    {node.id === 'chest' && <Gift weight="fill" className="w-5 h-5" />}
                  </motion.button>
                </div>
              )
            })}
          </div>

          <KodiCharacter
            emotion="studying"
            size={52}
            interactive={false}
            className="hidden sm:block shrink-0"
          />
        </div>

        {/* Live Interactive Popover Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedNode.id}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="rounded-2xl bg-white border-2 border-blue-200/90 px-4 py-3 shadow-[0_4px_0_0_#DBEAFE] flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="font-brand font-black text-sm text-[#1E293B] leading-snug truncate">
                {selectedNode.title}
              </p>
              <p className="text-xs text-[#64748B] leading-snug mt-0.5">
                {selectedNode.subtitle}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-brand font-black whitespace-nowrap shrink-0 ${selectedNode.statusPillClass}`}
            >
              {selectedNode.statusPill}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </StudioCardFrame>
  )
}

/**
 * Tactile 3D-inspired handwriting writing studio card with looping SVG stroke
 * animation (`pathLength`), native Japanese audio playback, and replay control.
 */
export const ScriptStrokeIllustration = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [replayCount, setReplayCount] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    return () => {
      audioService.stopSpeech()
    }
  }, [])

  const handleSpeakHiragana = () => {
    triggerHaptic('tap')
    setIsSpeaking(true)
    audioService.speakLanguage(
      'あ',
      'ja-JP',
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    )
  }

  const handleReplayStrokes = () => {
    triggerHaptic('tap')
    setReplayCount((prev) => prev + 1)
  }

  return (
    <StudioCardFrame className="overflow-hidden">
      {/* Top Pastel Blush Header Strip */}
      <div className="bg-[#FFF1F2] border-b border-rose-100 px-5 py-3 flex items-center justify-between gap-2">
        <span className="text-xs font-brand font-black text-rose-900">
          Papan Goresan · Hiragana
        </span>
        <div className="flex items-center gap-1.5" aria-label="Urutan 3 goresan">
          {[1, 2, 3].map((step) => (
            <span
              key={step}
              className={`w-6 h-6 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center border ${
                step === 1
                  ? 'bg-[#F34E47] text-white border-[#E11D48] shadow-[0_2px_0_0_#BE123C]'
                  : 'bg-white text-rose-900 border-rose-200 shadow-[0_2px_0_0_#FECDD3]'
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Main Writing Stage */}
      <div className="p-5 sm:p-6 bg-white flex flex-col sm:flex-row items-center gap-5">
        <div className="relative w-36 h-36 rounded-3xl bg-[#FAFAF9] border-2 border-[#E2E8F0] shadow-[0_5px_0_0_#CBD5E1] shrink-0 flex items-center justify-center overflow-hidden">
          {/* Stationery Practice Grid Crosshair */}
          <div
            aria-hidden="true"
            className="absolute inset-0 border-r border-dashed border-slate-200/90 w-1/2 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 border-b border-dashed border-slate-200/90 h-1/2 pointer-events-none"
          />

          <svg
            key={replayCount}
            viewBox="0 0 120 120"
            className="w-24 h-24 relative z-10"
            fill="none"
            role="img"
            aria-label="Urutan goresan huruf Hiragana a"
          >
            {/* Ghost Character Outline */}
            <path
              d="M 28 36 H 90 M 56 22 C 54 48, 52 74, 56 96 M 78 48 C 72 72, 54 90, 34 86 C 24 84, 24 68, 40 60 C 58 51, 86 58, 86 78 C 86 91, 74 98, 60 99"
              stroke="#E2E8F0"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stroke 1 */}
            <motion.path
              d="M 28 36 H 90"
              stroke="#F34E47"
              strokeWidth="7"
              strokeLinecap="round"
              initial={
                shouldReduceMotion
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0.4 }
              }
              animate={
                shouldReduceMotion
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: [0, 1, 1, 0], opacity: [0.4, 1, 1, 0.3] }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 3.6,
                      times: [0, 0.25, 0.85, 1],
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            />

            {/* Stroke 2 */}
            <motion.path
              d="M 56 22 C 54 48, 52 74, 56 96"
              stroke="#F34E47"
              strokeWidth="7"
              strokeLinecap="round"
              initial={
                shouldReduceMotion
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0.4 }
              }
              animate={
                shouldReduceMotion
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: [0, 0, 1, 1, 0], opacity: [0.4, 0.4, 1, 1, 0.3] }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 3.6,
                      times: [0, 0.22, 0.5, 0.85, 1],
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            />

            {/* Stroke 3 */}
            <motion.path
              d="M 78 48 C 72 72, 54 90, 34 86 C 24 84, 24 68, 40 60 C 58 51, 86 58, 86 78 C 86 91, 74 98, 60 99"
              stroke="#F34E47"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={
                shouldReduceMotion
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0.4 }
              }
              animate={
                shouldReduceMotion
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: [0, 0, 1, 1, 0], opacity: [0.4, 0.4, 1, 1, 0.3] }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 3.6,
                      times: [0, 0.48, 0.82, 0.92, 1],
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            />
          </svg>
        </div>

        <div className="space-y-3 min-w-0 flex-1 text-center sm:text-left">
          <div className="space-y-1.5">
            <p className="font-mono text-sm font-bold text-[#1E293B]">
              あ / A — Urutan 1 → 3
            </p>
            <p className="text-xs text-[#475569] leading-relaxed">
              Ikuti garis panduan langsung di kanvas, lengkapi dengan tips mengingat bentuk huruf
              dan audio penutur asli.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={handleSpeakHiragana}
              aria-label="Dengar pelafalan huruf Hiragana a"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-brand font-black transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                isSpeaking
                  ? 'bg-rose-100 border-rose-300 text-rose-900'
                  : 'bg-[#FFF1F2] hover:bg-rose-100 border-[#FECDD3] text-[#BE123C]'
              }`}
            >
              {isSpeaking ? (
                <AudioWaveformBars isPlaying />
              ) : (
                <SpeakerHigh weight="fill" className="w-3.5 h-3.5 text-[#F34E47] shrink-0" />
              )}
              <span>Dengar &lsquo;a&rsquo;</span>
            </button>

            <button
              type="button"
              onClick={handleReplayStrokes}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-xs font-brand font-black text-[#1E293B] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <ArrowsClockwise weight="bold" className="w-3.5 h-3.5 text-[#475569] shrink-0" />
              <span>Ulangi Goresan</span>
            </button>
          </div>
        </div>
      </div>
    </StudioCardFrame>
  )
}

/**
 * Tactile 3D clay-inspired layered vocabulary deck with interactive click-to-flip
 * preview and live German TTS audio playback.
 */
export const FlashcardStackIllustration = () => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    return () => {
      audioService.stopSpeech()
    }
  }, [])

  const handleToggleCard = () => {
    triggerHaptic('tap')
    setIsFlipped((prev) => !prev)
  }

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggleCard()
    }
  }

  const handleSpeakGerman = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    triggerHaptic('tap')
    const phrase = isFlipped ? 'Entschuldigung, wo ist der Bahnhof?' : 'Entschuldigung'
    setIsSpeaking(true)
    audioService.speakLanguage(
      phrase,
      'de-DE',
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    )
  }

  return (
    <StudioCardFrame className="overflow-hidden">
      <div className="bg-gradient-to-b from-[#FEF3C7]/65 to-[#FFFBEB]/40 p-6 sm:p-7 flex items-center justify-center">
        <div className="relative w-full max-w-[320px] min-h-[168px] flex items-center justify-center">
          {/* Back Royal-Blue Clay Card */}
          <div
            aria-hidden="true"
            className="absolute inset-x-3 top-2 bottom-2 rounded-[22px] bg-[#2563EB] border-2 border-[#1D4ED8] shadow-[0_5px_0_0_#1E40AF] -rotate-3 translate-y-2"
          />

          {/* Middle Emerald-Mint Clay Card */}
          <div
            aria-hidden="true"
            className="absolute inset-x-1.5 top-2 bottom-2 rounded-[22px] bg-[#10B981] border-2 border-[#059669] shadow-[0_5px_0_0_#047857] rotate-2 translate-y-1"
          />

          {/* Foreground Interactive Stationery Card */}
          <motion.div
            role="button"
            tabIndex={0}
            onClick={handleToggleCard}
            onKeyDown={handleCardKeyDown}
            aria-pressed={isFlipped}
            aria-label={
              isFlipped
                ? 'Tampilkan istilah bahasa Jerman di sisi depan'
                : 'Balik kartu untuk melihat arti dan contoh kalimat'
            }
            whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="relative z-10 w-full min-h-[152px] text-left bg-white border-2 border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.08)] rounded-[22px] p-4 sm:p-5 flex flex-col justify-between gap-3 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200/80">
                {isFlipped ? 'Arti & Konteks' : 'Kosakata Harian'}
              </span>
              <button
                type="button"
                onClick={handleSpeakGerman}
                aria-label="Dengarkan pelafalan bahasa Jerman"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-brand font-black transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  isSpeaking
                    ? 'bg-blue-50 border-blue-300 text-[#2563EB]'
                    : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-[#1E293B]'
                }`}
              >
                <SpeakerHigh weight="fill" className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <AudioWaveformBars isPlaying={isSpeaking} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!isFlipped ? (
                <motion.div
                  key="front"
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="space-y-1"
                >
                  <p className="font-brand font-black text-xl text-[#1E293B] leading-tight">
                    Entschuldigung
                  </p>
                  <p className="text-xs font-mono font-semibold text-[#64748B]">
                    Permisi / Mohon maaf (Jerman)
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="space-y-1"
                >
                  <p className="font-brand font-black text-base text-[#2563EB] leading-snug">
                    &ldquo;Entschuldigung, wo ist der Bahnhof?&rdquo;
                  </p>
                  <p className="text-xs font-medium text-[#475569]">
                    Permisi, di mana letak stasiun kereta?
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between text-[11px] font-brand font-bold text-[#64748B]">
              <span>Dek Dasar · A1</span>
              <span className="inline-flex items-center gap-1 text-[#2563EB]">
                <ArrowsClockwise weight="bold" className="w-3.5 h-3.5 shrink-0" />
                <span>{isFlipped ? 'Lihat Kata' : 'Balik Kartu'}</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </StudioCardFrame>
  )
}
