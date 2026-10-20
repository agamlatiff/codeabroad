import { useState, useEffect } from 'react'
import {
  Trophy,
  Crown,
  Flame,
  Star,
  CaretDown,
  Clock,
  Sparkle,
  X,
  ArrowUp,
} from '@phosphor-icons/react'
import type { TokyoDivision, WeeklyLeaderboardResponse } from '../../types/leaderboard'
import { leaderboardService } from '../../services/leaderboardService'
import { triggerHaptic } from '../../utils/haptics'
import { soundEngine } from '../../utils/audio'
import doodleCelebrate from '../../assets/kodi/doodle-celebrate.png'

export interface TokyoLeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
  initialDivision?: TokyoDivision
}

export const TokyoLeaderboardModal = ({
  isOpen,
  onClose,
  initialDivision = 'shinjuku',
}: TokyoLeaderboardModalProps) => {
  const [selectedDivision, setSelectedDivision] = useState<TokyoDivision>(initialDivision)
  const [leaderboard, setLeaderboard] = useState<WeeklyLeaderboardResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // 4 Official Tokyo League Divisions
  const DIVISIONS: { id: TokyoDivision; name: string; tier: string; badgeColor: string; iconColor: string }[] = [
    {
      id: 'shinjuku',
      name: 'Shinjuku',
      tier: 'Bronze',
      badgeColor: 'from-amber-600 to-amber-800 text-amber-100 border-amber-500',
      iconColor: 'text-amber-600',
    },
    {
      id: 'shibuya',
      name: 'Shibuya',
      tier: 'Silver',
      badgeColor: 'from-slate-400 to-slate-600 text-slate-100 border-slate-300',
      iconColor: 'text-slate-500',
    },
    {
      id: 'akihabara',
      name: 'Akihabara',
      tier: 'Gold',
      badgeColor: 'from-amber-400 to-yellow-600 text-amber-950 border-amber-300',
      iconColor: 'text-amber-500',
    },
    {
      id: 'roppongi',
      name: 'Roppongi',
      tier: 'Diamond',
      badgeColor: 'from-cyan-500 to-blue-700 text-cyan-50 border-cyan-300',
      iconColor: 'text-cyan-500',
    },
  ]

  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    const fetchStandings = async () => {
      try {
        setLoading(true)
        const data = await leaderboardService.getWeeklyLeaderboard(selectedDivision)
        if (isMounted) {
          setLeaderboard(data)
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchStandings()
    return () => {
      isMounted = false
    }
  }, [isOpen, selectedDivision])

  if (!isOpen) return null

  const handleSelectDivision = (div: TokyoDivision) => {
    triggerHaptic('tap')
    soundEngine.playPop()
    setSelectedDivision(div)
  }

  const currentDivConfig = DIVISIONS.find((d) => d.id === selectedDivision) || DIVISIONS[0]

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
              Kumpulkan XP dari modul koding & kuis bahasa untuk promosi ke divisi berikutnya!
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

        {/* ── 2. 4 TOKYO LEAGUE DIVISION SELECTOR TABS ── */}
        <div className="px-5 pt-4 pb-2 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {DIVISIONS.map((div) => {
            const isSelected = selectedDivision === div.id
            return (
              <button
                key={div.id}
                type="button"
                onClick={() => handleSelectDivision(div.id)}
                className={`flex-1 min-w-[120px] p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 shadow-[0_3px_0_0_#2563EB]'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 active:translate-y-0.5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Crown
                    weight={isSelected ? 'fill' : 'bold'}
                    className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}
                  />
                  <span className="font-brand font-black text-xs text-slate-900">
                    {div.name}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {div.tier}
                </span>
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
                Selesai Minggu 23:59 JST • Top 3 otomatis dapat bonus Gems Tokyo & promosi divisi!
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
          ) : (
            leaderboard?.entries.map((entry) => {
              const isTop3 = entry.rank <= 3
              const isDemotion = entry.rank > 10
              const isUser = entry.is_current_user

              return (
                <div
                  key={entry.user_id + entry.rank}
                  className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border-2 transition-all ${
                    isUser
                      ? 'bg-blue-50/90 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                      : isTop3
                      ? 'bg-white border-emerald-200/90 shadow-2xs hover:border-emerald-300'
                      : isDemotion
                      ? 'bg-white border-rose-200/80 shadow-2xs'
                      : 'bg-white border-slate-200/80 shadow-2xs'
                  }`}
                >
                  {/* Left: Rank & User Profile */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-brand font-black text-xs shrink-0 ${
                        entry.rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : entry.rank === 2
                          ? 'bg-slate-300 text-slate-900 shadow-xs'
                          : entry.rank === 3
                          ? 'bg-amber-700 text-amber-100 shadow-xs'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {entry.rank === 1 ? (
                        <Crown weight="fill" className="w-4 h-4 text-amber-950" />
                      ) : (
                        `#${entry.rank}`
                      )}
                    </div>

                    {/* Avatar & Name */}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-brand font-black text-xs sm:text-sm truncate ${
                            isUser ? 'text-blue-900' : 'text-slate-900'
                          }`}
                        >
                          {entry.name}
                        </span>
                        {isUser && (
                          <span className="bg-blue-600 text-white text-[9px] font-brand font-black px-1.5 py-0.2 rounded-md shrink-0">
                            ANDA
                          </span>
                        )}
                        {isTop3 && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-brand font-bold px-1.5 py-0.2 rounded-md hidden sm:inline-block shrink-0">
                            Zona Promosi
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono font-bold">
                        <span>Lv. {entry.current_level}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-amber-600">
                          <Flame weight="fill" className="w-3 h-3 text-amber-500" />
                          <span>{entry.streak}d streak</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: XP Score & Reward Badge */}
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 justify-end font-brand font-black text-sm text-slate-900">
                      <Star weight="fill" className="w-3.5 h-3.5 text-amber-400" />
                      <span>{entry.weekly_xp}</span>
                      <span className="text-[10px] font-mono text-slate-400">XP</span>
                    </div>
                    {isTop3 && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                        💎 +{entry.rank === 1 ? '100' : entry.rank === 2 ? '50' : '25'}
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* ── 5. KODI CHEERING FOOTER BANNER ── */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <img
            src={doodleCelebrate}
            alt="Kodi Cheer"
            className="w-12 h-12 object-contain shrink-0 drop-shadow-xs"
          />
          <div className="space-y-0.5">
            <h4 className="font-brand font-black text-xs text-slate-900 flex items-center gap-1">
              <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
              <span>Semangat Belajar, Tokyo Aspirant!</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Selesaikan modul koding harian dan kuis bahasa Jepang untuk naik ke puncak Divisi Roppongi Master!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
