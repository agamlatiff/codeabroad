import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Trophy,
  CaretDown,
  Clock,
  Sparkle,
  X,
  ArrowUp,
  Medal,
} from '@phosphor-icons/react'
import type { TokyoDivision, WeeklyLeaderboardResponse } from "@/features/leaderboard/types/leaderboard"
import { TOKYO_DIVISIONS } from "@/features/leaderboard/constants/divisions"
import { LeaderboardEntryRow } from "@/features/leaderboard/components/LeaderboardEntryRow"
import { leaderboardService } from "@/features/leaderboard/services/leaderboardService"
import { triggerHaptic } from "@/shared/utils/haptics"
import { soundEngine } from "@/shared/utils/audio"
import { Button3D } from "@/shared/components/ui/Button3D"
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"

export interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
  initialDivision?: TokyoDivision
}

export const LeaderboardModal = ({
  isOpen,
  onClose,
  initialDivision = 'shinjuku',
}: LeaderboardModalProps) => {
  const navigate = useNavigate()
  const [selectedDivision, setSelectedDivision] = useState<TokyoDivision>(initialDivision)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [prevInitialDivision, setPrevInitialDivision] = useState(initialDivision)
  const [leaderboard, setLeaderboard] = useState<WeeklyLeaderboardResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  if (isOpen !== prevIsOpen || initialDivision !== prevInitialDivision) {
    setPrevIsOpen(isOpen)
    setPrevInitialDivision(initialDivision)
    if (isOpen) {
      setSelectedDivision(initialDivision)
    }
  }

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    const fetchStandings = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await leaderboardService.getWeeklyLeaderboard(selectedDivision)
        if (isMounted) {
          setLeaderboard(data)
        }
      } catch {
        if (isMounted) {
          setError('Gagal memuat papan peringkat. Periksa koneksi Anda lalu coba lagi.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchStandings()
    return () => {
      isMounted = false
    }
  }, [isOpen, selectedDivision, reloadKey])

  if (!isOpen) return null

  const handleSelectDivision = (div: TokyoDivision) => {
    triggerHaptic('tap')
    soundEngine.playPop()
    setSelectedDivision(div)
  }

  const currentDivConfig = TOKYO_DIVISIONS.find((d) => d.id === selectedDivision) || TOKYO_DIVISIONS[0]

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-2xl bg-white border-2 border-slate-200/90 rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* ── 1. MODAL HEADER ── */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-brand font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Trophy weight="fill" className="w-3.5 h-3.5 text-amber-600" />
                <span>Tokyo League 2026</span>
              </span>
              <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-brand font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock weight="bold" className="w-3 h-3 text-blue-600" />
                <span>{leaderboard?.days_remaining ?? 5} Hari Tersisa</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-brand font-black text-slate-900 tracking-tight">
              Papan Peringkat Mingguan
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Kumpulkan XP dari pelajaran bahasa &amp; latihan SRS untuk promosi ke divisi berikutnya!
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl border-2 border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* ── 2. 4 TOKYO LEAGUE SELECTOR TABS ── */}
        <div className="px-4 sm:px-5 pt-4 pb-2 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {TOKYO_DIVISIONS.map((div) => {
            const isSelected = selectedDivision === div.id
            return (
              <button
                key={div.id}
                type="button"
                onClick={() => handleSelectDivision(div.id)}
                className={`flex-1 min-w-[130px] p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 shadow-[0_3px_0_0_#2563EB]'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 active:translate-y-0.5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Medal
                    weight="fill"
                    className={`w-4 h-4 shrink-0 drop-shadow-2xs ${div.iconColor}`}
                  />
                  <span className="font-brand font-black text-xs text-slate-900">
                    {div.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {div.xpRange}
                  </span>
                  <span className="text-[9px] font-brand font-bold text-slate-400">
                    {div.levelLabel}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── 3. PROMOTION ZONE RULES BANNER ── */}
        <div className="px-5 py-2.5 bg-slate-50/80 border-b border-slate-200/60 flex items-center justify-between text-[11px] font-brand font-bold">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <ArrowUp weight="bold" className="w-3.5 h-3.5 text-emerald-600" />
            <span>Top 3: Promosi ke Divisi Berikutnya</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-600">
            <CaretDown weight="bold" className="w-3.5 h-3.5 text-rose-500" />
            <span>Bawah: Degradasi Divisi</span>
          </div>
        </div>

        {/* ── 3.5. WEEKLY PRIZE POOL BANNER ── */}
        <div className="mx-4 sm:mx-6 my-2.5 p-3 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border border-amber-300/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-brand font-black text-xs shrink-0 shadow-2xs">
              <Trophy weight="fill" className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-brand font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <span>Hadiah Musim Minggu #{leaderboard?.season_week ?? 42}</span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-md font-mono">
                  {leaderboard?.days_remaining ?? 5} Hari Lagi
                </span>
              </div>
              <div className="text-[10px] text-amber-800 font-medium">
                Selesai Minggu 23:59 JST • Top 3 otomatis dapat bonus Gems Tokyo &amp; promosi divisi!
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold shrink-0 self-end sm:self-auto">
            <span className="bg-amber-100 border border-amber-300 text-amber-900 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
              🥇 +100 💎
            </span>
            <span className="bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
              🥈 +50 💎
            </span>
            <span className="bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
              🥉 +25 💎
            </span>
          </div>
        </div>

        {/* ── 4. LEADERBOARD COMPETITOR LIST ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 bg-[#FAFAF9]">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-brand font-bold text-slate-400">
                Memuat klasemen {currentDivConfig.name}...
              </p>
            </div>
          ) : error ? (
            <div className="py-10 px-4 text-center space-y-3 bg-rose-50/70 rounded-3xl border-2 border-rose-200">
              <p className="text-xs font-brand font-bold text-rose-700">{error}</p>
              <Button3D
                variant="blue"
                size="sm"
                onClick={() => setReloadKey((k) => k + 1)}
                className="text-xs px-4 py-2 mx-auto"
              >
                Coba Lagi
              </Button3D>
            </div>
          ) : !leaderboard?.entries || leaderboard.entries.length === 0 ? (
            <div className="py-10 px-4 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="flex items-center justify-center mx-auto">
                <KodiCharacter emotion="thinking" size={96} />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-brand font-black text-sm sm:text-base text-slate-900">
                  Belum Ada Peserta di {currentDivConfig.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Musim #{leaderboard?.season_week ?? 42} baru saja dimulai! Kumpulkan XP ({currentDivConfig.xpRange}) untuk langsung merebut Peringkat #1 dan hadiah 100 💎!
                </p>
              </div>
              <Button3D
                variant="blue"
                size="sm"
                onClick={() => {
                  triggerHaptic('tap')
                  onClose()
                  navigate('/curriculum')
                }}
                className="text-xs px-5 py-2.5 mx-auto"
              >
                Mulai Belajar Sekarang ▶
              </Button3D>
            </div>
          ) : (
            <>
              {leaderboard.entries.map((entry) => (
                <LeaderboardEntryRow key={entry.user_id + entry.rank} entry={entry} compact />
              ))}
              {leaderboard.user_rank && !leaderboard.entries.some((e) => e.is_current_user) && (
                <div className="pt-2 border-t border-dashed border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-400 px-1">
                    Posisi Anda Saat Ini
                  </span>
                  <LeaderboardEntryRow entry={leaderboard.user_rank} compact />
                </div>
              )}
            </>
          )}
        </div>

        {/* ── 5. KODI CHEERING FOOTER BANNER ── */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <div className="shrink-0 flex items-center justify-center">
            <KodiCharacter emotion="celebrate" size={54} />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-brand font-black text-xs text-slate-900 flex items-center gap-1">
              <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
              <span>Semangat Belajar, Tokyo Aspirant!</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Selesaikan pelajaran bahasa harian dan latihan SRS untuk naik ke puncak Divisi Roppongi Master!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
