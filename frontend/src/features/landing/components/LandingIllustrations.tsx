import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { CheckCircle, SpeakerHigh } from '@phosphor-icons/react'

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

/**
 * Editorial vector illustration showing a multi-language milestone path with animated line drawing.
 */
export const CurriculumPathIllustration = () => {
  return (
    <StudioCardFrame className="relative p-5 sm:p-6 overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-[11px] font-brand font-black uppercase tracking-wider text-slate-500">
          Alur Belajar Terstruktur
        </span>
        <div className="flex items-center gap-1.5">
          {['N5', 'A1', 'IELTS'].map((badge) => (
            <span
              key={badge}
              className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono font-bold text-slate-700"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="relative h-44 flex items-center justify-center">
        <svg viewBox="0 0 360 140" className="w-full h-full max-w-[360px]" fill="none">
          {/* Base Dotted Track */}
          <path
            d="M 42 104 C 105 104, 115 36, 180 36 C 245 36, 255 104, 318 42"
            stroke="#E2E8F0"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="6 8"
          />

          {/* Animated Progress Path */}
          <motion.path
            d="M 42 104 C 105 104, 115 36, 180 36 C 245 36, 255 104, 318 42"
            stroke="#2563EB"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0.15 }}
            whileInView={{ pathLength: 0.72 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />

          {/* Node 1: Completed */}
          <g transform="translate(42, 104)">
            <circle r="18" fill="#10B981" />
            <circle r="12" fill="#ECFDF5" />
            <path
              d="M -5 0 L -1.5 3.5 L 5 -3.5"
              stroke="#059669"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Node 2: Active */}
          <g transform="translate(180, 36)">
            <circle r="20" fill="#2563EB" />
            <circle r="13" fill="#EFF6FF" />
            <circle r="5" fill="#2563EB" />
          </g>

          {/* Node 3: Target Milestone */}
          <g transform="translate(318, 42)">
            <circle r="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
            <path d="M -5 4 L 0 -5 L 5 4 Z" fill="#F59E0B" />
          </g>
        </svg>

        {/* Bottom Labels */}
        <div className="absolute inset-x-1 sm:inset-x-2 bottom-0 flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold text-slate-600">
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle weight="fill" className="w-3.5 h-3.5 shrink-0" />
            Unit 1: Dasar
          </span>
          <span className="text-blue-700">Unit 2: Percakapan</span>
          <span className="text-slate-400">Ujian Level</span>
        </div>
      </div>
    </StudioCardFrame>
  )
}

/**
 * Stationery canvas showing looping SVG handwriting stroke animation (`pathLength`).
 */
export const ScriptStrokeIllustration = () => {
  return (
    <StudioCardFrame className="p-5 sm:p-6 flex items-center justify-between gap-4 sm:gap-5">
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-[#FAFAF9] border-2 border-[#E2E8F0] shrink-0 flex items-center justify-center overflow-hidden">
        {/* Stationery Practice Grid Crosshair */}
        <div
          aria-hidden="true"
          className="absolute inset-0 border-r border-dashed border-slate-200/90 w-1/2 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 border-b border-dashed border-slate-200/90 h-1/2 pointer-events-none"
        />

        <svg viewBox="0 0 120 120" className="w-22 h-22 sm:w-24 sm:h-24 relative z-10" fill="none">
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
            initial={{ pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0.4, 1, 1, 0.3] }}
            transition={{ duration: 3.6, times: [0, 0.25, 0.85, 1], repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Stroke 2 */}
          <motion.path
            d="M 56 22 C 54 48, 52 74, 56 96"
            stroke="#F34E47"
            strokeWidth="7"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: [0, 0, 1, 1, 0], opacity: [0.4, 0.4, 1, 1, 0.3] }}
            transition={{ duration: 3.6, times: [0, 0.22, 0.5, 0.85, 1], repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Stroke 3 */}
          <motion.path
            d="M 78 48 C 72 72, 54 90, 34 86 C 24 84, 24 68, 40 60 C 58 51, 86 58, 86 78 C 86 91, 74 98, 60 99"
            stroke="#F34E47"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: [0, 0, 1, 1, 0], opacity: [0.4, 0.4, 1, 1, 0.3] }}
            transition={{ duration: 3.6, times: [0, 0.48, 0.82, 0.92, 1], repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      <div className="space-y-2.5 min-w-0 flex-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] font-brand font-black text-[11px]">
          <SpeakerHigh weight="fill" className="w-3.5 h-3.5 text-[#F34E47]" />
          <span>Kanvas Latihan &amp; Suara</span>
        </div>
        <p className="font-mono text-sm font-bold text-slate-800">あ / A — Urutan 1 → 3</p>
        <p className="text-xs text-slate-600 leading-relaxed">
          Ikuti garis panduan langsung di kanvas, lengkapi dengan tips mengingat bentuk huruf dan
          audio penutur asli.
        </p>
      </div>
    </StudioCardFrame>
  )
}

/**
 * Tactile stacked vocabulary cards illustration with calm spring tilt hover.
 */
export const FlashcardStackIllustration = () => {
  return (
    <StudioCardFrame className="p-6 sm:p-7 flex items-center justify-center min-h-[208px]">
      <div className="relative w-full max-w-[300px] h-36 flex items-center justify-center">
        {/* Back Layer Card */}
        <motion.div
          initial={{ rotate: -6, y: 6 }}
          whileHover={{ rotate: -9, x: -8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="absolute inset-x-4 top-3 h-28 rounded-2xl bg-sky-50 border border-sky-200/90"
        />

        {/* Middle Layer Card */}
        <motion.div
          initial={{ rotate: 4, y: 3 }}
          whileHover={{ rotate: 7, x: 8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="absolute inset-x-2 top-2 h-28 rounded-2xl bg-amber-50 border border-amber-200/90"
        />

        {/* Front Card */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="relative w-full h-30 rounded-2xl bg-white border-2 border-[#E2E8F0] shadow-[0_5px_0_0_#E2E8F0] p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-brand font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/70">
              Kosakata Harian
            </span>
            <AudioWaveformBars isPlaying />
          </div>
          <div>
            <p className="font-brand font-black text-lg text-slate-900 leading-tight">
              Entschuldigung
            </p>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Permisi / Mohon maaf (Jerman)
            </p>
          </div>
        </motion.div>
      </div>
    </StudioCardFrame>
  )
}
