import { useNavigate } from 'react-router-dom'
import { Plane, CheckCircle2, ExternalLink } from 'lucide-react'
import { DoodleHanko } from '../illustrations/doodles'
import { ProgressBar3D } from '../ui/ProgressBar3D'
import type { User } from '../../types/auth'

export interface TokyoPassportWidgetProps {
  user: User | null
  className?: string
  readinessScore?: number
}

export const TokyoPassportWidget = ({
  user,
  className = '',
  readinessScore = 75,
}: TokyoPassportWidgetProps) => {
  const navigate = useNavigate()
  const passengerName = (user?.name || user?.username || 'DEVELOPER INDONESIA').toUpperCase()

  return (
    <div className={`rounded-3xl border-2 border-slate-200/90 bg-white p-5 space-y-4 shadow-sm relative overflow-hidden ${className}`}>
      {/* ── PASSPORT WATERMARK EMBLEM ── */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full border-8 border-slate-100/60 pointer-events-none -z-0" />

      {/* ── 1. PASSPORT HEADER & OFFICIAL HANKO STAMP ── */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#0284C7] tracking-wider uppercase font-mono">
            <span>🇯🇵</span>
            <span>PASPOR KARIER TOKYO</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            DOC NO: CA-JP2026 // HND GATEWAY
          </p>
        </div>

        {/* Traditional Red Ink Hanko Stamp with tilted angle */}
        <div className="relative shrink-0 -rotate-12 transition-transform hover:scale-105 duration-200" title="Stempel Kelulusan Resmi Tokyo">
          <DoodleHanko text="合格" className="w-12 h-12 drop-shadow-sm" />
        </div>
      </div>

      {/* ── 2. FLIGHT ROUTE & PASSENGER IDENTIFIER ── */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-sky-50/60 border border-blue-100/80 space-y-2.5 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase">
              PEMEGANG PASPOR
            </span>
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate max-w-[180px] block">
              {passengerName}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase">
              RUTE TECH FLIGHT
            </span>
            <div className="flex items-center gap-1 font-black text-xs sm:text-sm text-[#0284C7] font-mono">
              <span>CGK</span>
              <Plane className="w-3 h-3 text-[#2563EB]" />
              <span>HND</span>
            </div>
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-800 flex items-center gap-1">
              <span>Kesiapan Kerja di Jepang</span>
            </span>
            <span className="font-black text-xs text-[#2563EB] font-mono">
              {readinessScore}% SIAP
            </span>
          </div>
          <ProgressBar3D value={readinessScore} max={100} variant="cyan" size="sm" />
        </div>
      </div>

      {/* ── 3. VISA CHECKLIST MILESTONES ── */}
      <div className="space-y-2 text-xs relative z-10">
        <div className="flex items-center gap-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-[11px]">Sintaks Go & Strict Typing (Lulus ✓)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-[11px]">JLPT N3 Business Vocab (Terverifikasi)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 text-[10px] text-slate-400 font-bold">
            3
          </span>
          <span className="text-[11px] font-medium">1 modul lagi untuk sponsor visa kerja.</span>
        </div>
      </div>

      {/* ── 4. BARCODE STRIP (AIRLINE TICKET AESTHETIC) ── */}
      <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-0.5 opacity-60">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-slate-800 rounded-xs"
              style={{ width: i % 3 === 0 ? '2px' : i % 2 === 0 ? '3px' : '1px' }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="text-[10px] font-black text-[#2563EB] hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Detail Paspor</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
