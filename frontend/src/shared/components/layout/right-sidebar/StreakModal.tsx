import { createPortal } from 'react-dom'
import type { FC } from 'react'
import {
  Fire,
  Trophy,
  CalendarCheck,
  Snowflake,
  CaretLeft,
  CaretRight,
  X,
  Sparkle,
} from '@phosphor-icons/react'
import { Button3D } from "@/shared/components/ui/Button3D"
import { triggerHaptic } from "@/shared/utils/haptics"
import { useStreakModal } from "@/shared/hooks/layout/right-sidebar/useStreakModal"

export interface StreakModalProps {
  isOpen: boolean
  onClose: () => void
  currentStreak: number
  activeDates?: string[]
}

/**
 * StreakModal (SSOT)
 * Pure declarative streak attendance calendar modal for AppRightSidebar.
 * Powered 1:1 by useStreakModal.
 */
export const StreakModal: FC<StreakModalProps> = ({
  isOpen,
  onClose,
  currentStreak,
  activeDates = [],
}) => {
  const {
    monthLabel,
    isCurrentMonth,
    dayLabels,
    startOffset,
    daysList,
    activeDaysInMonth,
    longestStreak,
    handlePrevMonth,
    handleNextMonth,
    handleResetToToday,
  } = useStreakModal({ currentStreak, activeDates })

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-2 border-orange-200/90 rounded-3xl p-4 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl animate-pop relative max-h-[92vh] overflow-y-auto">
        {/* ── TOP HEADER ── */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_2.5px_0_0_#C2410C] flex items-center justify-center text-white shrink-0">
              <Fire weight="fill" className="w-5 h-5 text-amber-100 animate-pulse" />
            </div>
            <div>
              <h3 className="font-brand font-black text-base sm:text-lg text-slate-900 leading-tight">
                Kalender Rentetan Belajar
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Rekam Jejak Presensi & Konsistensi Harian
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap')
              onClose()
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer transition-colors shadow-2xs"
            title="Tutup Kalender"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* ── STATS CARDS GRID (DUOLINGO 3D TACTILE TILES) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Stat 1: Current Streak */}
          <div className="p-2.5 rounded-2xl bg-orange-50/70 border border-orange-200 text-center space-y-0.5 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-orange-600">
              <Fire weight="fill" className="w-4 h-4" />
              <span className="font-brand font-black text-base sm:text-lg leading-tight">
                {currentStreak}
              </span>
            </div>
            <p className="text-[9px] font-bold text-orange-800 uppercase tracking-wider">
              Hari Aktif
            </p>
          </div>

          {/* Stat 2: Longest Streak */}
          <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-0.5 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-amber-600">
              <Trophy weight="fill" className="w-4 h-4" />
              <span className="font-brand font-black text-base sm:text-lg leading-tight">
                {longestStreak}
              </span>
            </div>
            <p className="text-[9px] font-bold text-amber-800 uppercase tracking-wider">
              Rekor Terlama
            </p>
          </div>

          {/* Stat 3: Month Attendance */}
          <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center space-y-0.5 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <CalendarCheck weight="fill" className="w-4 h-4" />
              <span className="font-brand font-black text-base sm:text-lg leading-tight">
                {activeDaysInMonth}
              </span>
            </div>
            <p className="text-[9px] font-bold text-blue-800 uppercase tracking-wider">
              Hari Bulan Ini
            </p>
          </div>

          {/* Stat 4: Streak Freeze Shield */}
          <div className="p-2.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-center space-y-0.5 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-cyan-600">
              <Snowflake
                weight="fill"
                className="w-4 h-4 text-cyan-500 animate-spin"
                style={{ animationDuration: '8s' }}
              />
              <span className="font-brand font-black text-base sm:text-lg leading-tight">
                1 Aktif
              </span>
            </div>
            <p className="text-[9px] font-bold text-cyan-800 uppercase tracking-wider">
              Streak Freeze
            </p>
          </div>
        </div>

        {/* ── MONTH SWITCHER CONTROLLER ── */}
        <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-7 h-7 rounded-xl bg-white border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-95"
            title="Bulan Sebelumnya"
          >
            <CaretLeft weight="bold" className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-brand font-black text-sm text-slate-900">
              {monthLabel}
            </span>
            {isCurrentMonth ? (
              <span className="text-[9px] font-brand font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                Bulan Ini
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResetToToday}
                className="text-[9px] font-brand font-black text-orange-600 bg-orange-100 hover:bg-orange-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                title="Kembali ke bulan saat ini"
              >
                ↩ Ke Bulan Ini
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-xl bg-white border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-95"
            title="Bulan Berikutnya"
          >
            <CaretRight weight="bold" className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── CALENDAR GRID ── */}
        <div className="space-y-1.5 p-3 bg-white border border-slate-200/90 rounded-2xl shadow-inner">
          <div className="grid grid-cols-7 gap-1 text-center pb-1">
            {dayLabels.map((lbl, idx) => (
              <span
                key={lbl}
                className={`text-[10px] font-brand font-black ${
                  idx >= 5 ? 'text-rose-500' : 'text-slate-400'
                }`}
              >
                {lbl}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
            {Array.from({ length: startOffset }).map((_, idx) => (
              <div key={`offset-${idx}`} className="h-9 sm:h-10 rounded-xl" />
            ))}

            {daysList.map((item) => (
              <div
                key={item.dateStr}
                className="h-9 sm:h-10 flex flex-col items-center justify-center relative group"
              >
                {item.isActive ? (
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-b from-amber-400 via-orange-400 to-orange-500 shadow-[0_2.5px_0_0_#C2410C] flex flex-col items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 cursor-default ${
                      item.isToday ? 'ring-2 ring-orange-400 ring-offset-1 animate-pulse' : ''
                    }`}
                    title={`${item.dateStr}: Presensi Hadir Aktif 🔥`}
                  >
                    <Fire
                      weight="fill"
                      className="w-3.5 h-3.5 text-amber-100 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
                    />
                    <span className="font-brand font-black text-[9px] leading-none mt-0.5">
                      {item.dayNumber}
                    </span>
                  </div>
                ) : item.isToday ? (
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-50 border-2 border-dashed border-orange-400 flex flex-col items-center justify-center text-orange-600 shadow-2xs"
                    title="Hari Ini: Belajar untuk menyalakan api!"
                  >
                    <Fire weight="bold" className="w-3 h-3 text-orange-500" />
                    <span className="font-brand font-black text-[9px] leading-none mt-0.5">
                      {item.dayNumber}
                    </span>
                  </div>
                ) : item.isPast ? (
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400"
                    title={`${item.dateStr}: Tidak Hadir`}
                  >
                    <span className="text-[11px] font-brand font-medium">
                      {item.dayNumber}
                    </span>
                  </div>
                ) : (
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-slate-300"
                    title={`${item.dateStr}: Mendatang`}
                  >
                    <span className="text-[11px] font-brand font-medium">
                      {item.dayNumber}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── MOTIVATIONAL DUOLINGO TIP BANNER ── */}
        <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkle weight="fill" className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-[11px] text-amber-950 font-medium leading-relaxed">
            <strong className="font-bold">Tips Konsistensi Kodi:</strong> Selesaikan 1 koding part atau sapaan kosakata setiap hari untuk menjaga api tetap berkobar menuju karier Tokyo!
          </p>
        </div>

        {/* ── FOOTER ACTION ── */}
        <Button3D
          variant="amber"
          size="md"
          fullWidth
          onClick={() => {
            triggerHaptic('tap')
            onClose()
          }}
          className="py-2.5 font-black text-xs shadow-[0_3px_0_0_#B45309]"
        >
          <Fire weight="fill" className="w-4 h-4 text-amber-950" />
          <span>TUTUP & LANJUTKAN BELAJAR 🔥</span>
        </Button3D>
      </div>
    </div>,
    document.body
  )
}

