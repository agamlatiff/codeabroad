import { useNavigate } from 'react-router-dom'
import { Airplane, CheckCircle, ArrowSquareOut } from '@phosphor-icons/react'
import { DoodleHanko } from '../illustrations/doodles'
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
    <div
      className={`rounded-3xl border border-[#27364D] bg-[#101827] p-5 space-y-4 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* ── PASSPORT WATERMARK EMBLEM ── */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full border-8 border-slate-800/30 pointer-events-none -z-0" />

      {/* ── 1. PASSPORT HEADER & OFFICIAL HANKO STAMP ── */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#38BDF8] tracking-wider uppercase font-mono">
            <span>🇯🇵</span>
            <span>PASPOR KARIER TOKYO</span>
          </div>
          <p className="text-[10px] text-[#64748B] font-mono">
            DOC NO: CA-JP2026 // HND GATEWAY
          </p>
        </div>

        {/* Traditional Red Ink Hanko Stamp with tilted angle */}
        <div
          className="relative shrink-0 -rotate-12 transition-transform hover:scale-105 duration-200"
          title="Stempel Kelulusan Resmi Tokyo"
        >
          <DoodleHanko text="合格" className="w-12 h-12 drop-shadow-md" />
        </div>
      </div>

      {/* ── 2. FLIGHT ROUTE & PASSENGER IDENTIFIER INSET ── */}
      <div className="p-3.5 rounded-2xl bg-[#172236] border border-[#27364D] space-y-2.5 relative z-10 shadow-inner">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-[#94A3B8] font-bold block uppercase">
              PEMEGANG PASPOR
            </span>
            <span className="font-extrabold text-xs sm:text-sm text-[#F1F5F9] truncate max-w-[170px] block">
              {passengerName}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono text-[#94A3B8] font-bold block uppercase">
              RUTE TECH FLIGHT
            </span>
            <div className="flex items-center gap-1 font-black text-xs sm:text-sm text-[#38BDF8] font-mono">
              <span>CGK</span>
              <Airplane weight="bold" className="w-3 h-3 text-[#3B82F6]" />
              <span>HND</span>
            </div>
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#F1F5F9] flex items-center gap-1">
              <span>Kesiapan Kerja di Jepang</span>
            </span>
            <span className="font-mono font-bold text-xs text-[#38BDF8]">
              {readinessScore}% SIAP
            </span>
          </div>
          <div className="w-full h-2 bg-[#080D18] rounded-full overflow-hidden border border-[#27364D]">
            <div
              className="h-full bg-[#38BDF8] rounded-full transition-all duration-500"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── 3. VISA CHECKLIST MILESTONES ── */}
      <div className="space-y-2 text-xs relative z-10">
        <div className="flex items-center gap-2 text-[#F1F5F9]">
          <CheckCircle weight="fill" className="w-4 h-4 text-[#10B981] shrink-0" />
          <span className="font-medium text-[11px]">Sintaks Go & Strict Typing (Lulus ✓)</span>
        </div>
        <div className="flex items-center gap-2 text-[#F1F5F9]">
          <CheckCircle weight="fill" className="w-4 h-4 text-[#10B981] shrink-0" />
          <span className="font-medium text-[11px]">JLPT N3 Business Vocab (Terverifikasi)</span>
        </div>
        <div className="flex items-center gap-2 text-[#94A3B8]">
          <span className="w-4 h-4 rounded-full border border-[#27364D] bg-[#172236] flex items-center justify-center shrink-0 text-[10px] text-[#64748B] font-mono font-bold">
            3
          </span>
          <span className="text-[11px] font-medium">1 modul lagi untuk sponsor visa kerja.</span>
        </div>
      </div>

      {/* ── 4. BARCODE STRIP (AIRLINE TICKET AESTHETIC) ── */}
      <div className="pt-2 border-t border-dashed border-[#27364D] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-0.5 opacity-40">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-[#F1F5F9] rounded-xs"
              style={{ width: i % 3 === 0 ? '2px' : i % 2 === 0 ? '3px' : '1px' }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="text-[10px] font-mono font-bold text-[#38BDF8] hover:text-sky-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Detail Paspor</span>
          <ArrowSquareOut weight="bold" className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
