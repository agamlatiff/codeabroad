import type { FC } from 'react'
import { Fire, CalendarCheck } from '@phosphor-icons/react'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { useStreakSection } from "@/shared/hooks/layout/right-sidebar/useStreakSection"
import { StreakModal } from './StreakModal'

/**
 * StreakSection (SSOT)
 * Pure declarative 7-day learning streak tracker in AppRightSidebar.
 * Powered 1:1 by useStreakSection.
 */
export const StreakSection: FC = () => {
  const {
    userStreak,
    streakFreezeCount,
    weeklyStreakDays,
    calendarActiveDates,
    isLoading,
    isStreakModalOpen,
    handleOpenStreakModal,
    handleCloseStreakModal,
  } = useStreakSection()

  return (
    <>
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <Fire weight="fill" className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h4 className="font-brand font-black text-xs text-slate-900 leading-none">
                Streak Harian
              </h4>
              <span className="text-[9px] text-slate-500 font-medium">
                Target Konsistensi 7 Hari
              </span>
            </div>
          </div>

          {/* Flame Pill Badge & Modal Trigger */}
          {isLoading ? (
            <Skeleton variant="pill" className="h-6 w-24" />
          ) : (
            <button
              type="button"
              onClick={handleOpenStreakModal}
              className="bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-brand font-black text-[10px] px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 group/streak"
              title="Buka Kalender Belajar Lengkap"
            >
              <Fire weight="fill" className="w-3 h-3 text-amber-200" />
              <span>{userStreak} Hari</span>
              <span className="bg-white/20 text-[9px] px-1 py-0.2 rounded font-bold group-hover/streak:bg-white/30 flex items-center gap-0.5">
                <CalendarCheck weight="bold" className="w-2.5 h-2.5" />
                <span>Kalender</span>
              </span>
            </button>
          )}
        </div>

        {/* 7 Days Merantalk Flame Tokens Row (Clickable) */}
        {isLoading ? (
          <div className="w-full grid grid-cols-7 gap-1 sm:gap-1.5 bg-orange-50/20 border border-orange-100/70 rounded-2xl p-1.5 sm:p-2">
            {weeklyStreakDays.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-brand font-bold text-slate-400">{item.label}</span>
                <Skeleton className="w-7 h-7 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleOpenStreakModal}
            className="w-full grid grid-cols-7 gap-1 sm:gap-1.5 text-center bg-orange-50/30 hover:bg-orange-50/60 border border-orange-100/80 hover:border-orange-300 rounded-2xl p-1.5 sm:p-2 shadow-2xs cursor-pointer transition-colors"
            title="Klik untuk membuka Kalender Belajar Lengkap"
          >
            {weeklyStreakDays.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span
                  className={`text-[9px] font-brand font-black transition-colors ${
                    item.isCompleted
                      ? 'text-orange-600 font-black'
                      : item.isToday
                        ? 'text-orange-500 font-black underline decoration-orange-400 decoration-2 underline-offset-2'
                        : 'text-slate-500 font-bold'
                  }`}
                >
                  {item.label}
                </span>

                {item.isCompleted ? (
                  <div
                    className="w-7 h-7 rounded-xl bg-gradient-to-b from-amber-400 via-orange-400 to-orange-500 shadow-[0_2px_0_0_#C2410C] flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 group/token cursor-default"
                    title={`${item.label}: Hari Aktif Belajar`}
                  >
                    <Fire
                      weight="fill"
                      className="w-3.5 h-3.5 text-amber-100 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
                    />
                  </div>
                ) : item.isToday ? (
                  <div
                    className="w-7 h-7 rounded-xl bg-orange-50 border-2 border-dashed border-orange-400 flex items-center justify-center text-orange-500 shadow-2xs relative"
                    title="Hari ini: Belajar 1 modul untuk menyalakan api!"
                  >
                    <Fire weight="bold" className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                ) : (
                  <div
                    className="w-7 h-7 rounded-xl bg-slate-100/80 border border-slate-200/90 flex items-center justify-center text-slate-400"
                    title={`${item.label}: Belum Tercapai`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </button>
        )}
      </div>

      {/* ── STREAK ATTENDANCE CALENDAR MODAL ── */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={handleCloseStreakModal}
        currentStreak={userStreak}
        streakFreezeCount={streakFreezeCount}
        activeDates={calendarActiveDates}
      />
    </>
  )
}

