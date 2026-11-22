import { useRef, useState, type FC, type PointerEvent } from 'react'
import { Check, Eraser, Eye, EyeSlash, PencilSimple } from '@phosphor-icons/react'
import type { KanaScriptType } from '@/features/curriculum/types/curriculum'
import {
  getKanaStrokeGuide,
  getStrokeArrowGlyph,
} from '@/features/curriculum/constants/kanaStrokeGuides'
import { Button3D } from '@/shared/components/ui/Button3D'

export interface KanaTracingPadProps {
  character: string
  script?: KanaScriptType
  isMastered?: boolean
  isSaving?: boolean
  onMarkPracticed?: () => void
}

/**
 * Interactive HTML5 pointer/touch tracing canvas for practicing Kana stroke shapes.
 * Parent keys this component by `character` so drawing resets cleanly on character switch.
 */
export const KanaTracingPad: FC<KanaTracingPadProps> = ({
  character,
  script,
  isMastered = false,
  isSaving = false,
  onMarkPracticed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawingRef = useRef(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const strokeGuide = getKanaStrokeGuide(character, script)

  const getCanvasPoint = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const pt = getCanvasPoint(e)
    if (!canvas || !ctx || !pt) return

    canvas.setPointerCapture(e.pointerId)
    isDrawingRef.current = true
    setHasDrawn(true)

    ctx.strokeStyle = '#1E40AF'
    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(pt.x, pt.y)
    ctx.lineTo(pt.x + 0.01, pt.y + 0.01)
    ctx.stroke()
  }

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    const ctx = canvasRef.current?.getContext('2d')
    const pt = getCanvasPoint(e)
    if (!ctx || !pt) return

    ctx.lineTo(pt.x, pt.y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false
    canvasRef.current?.getContext('2d')?.closePath()
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  const isYoonPair = Array.from(character.trim()).length >= 2

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-brand font-black uppercase tracking-wider text-slate-500">
            <PencilSimple weight="bold" className="w-3.5 h-3.5 text-blue-600" />
            Kanvas Coba Tulis
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-brand font-black text-blue-700 tabular-nums">
            {strokeGuide.strokes} Goresan
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
          >
            {showGuide ? <EyeSlash weight="bold" className="w-3.5 h-3.5" /> : <Eye weight="bold" className="w-3.5 h-3.5" />}
            {showGuide ? 'Sembunyi Urutan' : 'Panduan Urutan'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Eraser weight="bold" className="w-3.5 h-3.5" />
            Hapus
          </button>
        </div>
      </div>

      <div className="relative mx-auto w-[210px] h-[210px] rounded-2xl border-2 border-dashed border-slate-300 bg-[#FAFAF9] overflow-hidden shadow-inner">
        {/* Crosshair center guide lines */}
        <div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-slate-200 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-slate-200 pointer-events-none"
          aria-hidden="true"
        />

        {/* Faint watermark guide character */}
        <span
          className={`absolute inset-0 flex items-center justify-center font-sans font-bold text-slate-200/80 select-none pointer-events-none leading-none ${
            isYoonPair ? 'text-[88px] tracking-tighter' : 'text-[132px]'
          }`}
          aria-hidden="true"
        >
          {character}
        </span>

        {/* Stroke-order numbered starting points */}
        {showGuide && (
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            {strokeGuide.points.map((pt, idx) => (
              <span
                key={`${character}-pt-${idx}`}
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-600/85 text-white text-[9px] font-brand font-black shadow-2xs leading-none"
              >
                <span>{idx + 1}</span>
                <span>{getStrokeArrowGlyph(pt.dir)}</span>
              </span>
            ))}
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={210}
          height={210}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerLeave={stopDrawing}
          className="relative z-10 w-full h-full touch-none cursor-crosshair"
        />
      </div>

      {showGuide && (
        <p className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 leading-relaxed">
          <span className="font-brand font-extrabold text-blue-700">Urutan Goresan: </span>
          {strokeGuide.tips}
        </p>
      )}

      {onMarkPracticed && (
        <Button3D
          variant={isMastered ? 'emerald' : 'blue'}
          size="sm"
          fullWidth
          disabled={isSaving}
          icon={<Check weight="bold" className="w-4 h-4" />}
          onClick={onMarkPracticed}
          className="text-xs"
        >
          {isSaving
            ? 'Menyimpan...'
            : hasDrawn
              ? 'Simpan Latihan Tulis'
              : 'Tandai Sudah Dilatih'}
        </Button3D>
      )}
    </div>
  )
}
