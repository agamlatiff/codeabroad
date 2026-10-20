import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import {
  Trophy,
  Crown,
  Flame,
  Star,
  Clock,
  Sparkle,
  ArrowUp,
  CaretDown,
} from '@phosphor-icons/react'
import type { TokyoDivision, WeeklyLeaderboardResponse } from '../types/leaderboard'
import { leaderboardService } from '../services/leaderboardService'
import { triggerHaptic } from '../utils/haptics'
import { soundEngine } from '../utils/audio'
import { Button3D } from '../components/ui/Button3D'
import doodleCelebrate from '../assets/kodi/doodle-celebrate.png'
import doodleProud from '../assets/kodi/doodle-proud.png'
import doodleThinking from '../assets/kodi/doodle-thinking.png'

export const LeaderboardPage = () => {
  const navigate = useNavigate()
  const [selectedDivision, setSelectedDivision] = useState<TokyoDivision>('shinjuku')
  const [leaderboard, setLeaderboard] = useState<WeeklyLeaderboardResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // 4 Official Tokyo League Divisions
  const DIVISIONS: { id: TokyoDivision; name: string; tier: string; badgeColor: string; description: string }[] = [
    {
      id: 'shinjuku',
      name: 'Divisi Shinjuku',
      tier: 'Bronze League',
      badgeColor: 'border-amber-500 bg-amber-50 text-amber-900',
      description: 'Zona pemula bagi engineer baru yang memulai jalur kurikulum Tokyo.',
    },
    {
      id: 'shibuya',
      name: 'Divisi Shibuya',
      tier: 'Silver League',
      badgeColor: 'border-slate-400 bg-slate-50 text-slate-800',
      description: 'Kompetisi aktif bagi engineer yang menguasai sintaks dasar & REST API.',
    },
    {
      id: 'akihabara',
      name: 'Divisi Akihabara',
      tier: 'Gold League',
      badgeColor: 'border-amber-400 bg-amber-50/60 text-amber-900',
      description: 'Engineer tingkat lanjut dengan penguasaan concurrency & cloud Docker.',
    },
    {
      id: 'roppongi',
      name: 'Divisi Roppongi',
      tier: 'Diamond Master',
      badgeColor: 'border-cyan-500 bg-cyan-50/70 text-cyan-950',
      description: 'Puncak liga global Tokyo: siap interview dan sponsor visa kerja Jepang.',
    },
  ]

  useEffect(() => {
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
  }, [selectedDivision])

  const handleSelectDivision = (div: TokyoDivision) => {
    triggerHaptic('tap')
    soundEngine.playPop()
    setSelectedDivision(div)
  }

  const currentDivConfig = DIVISIONS.find((d) => d.id === selectedDivision) || DIVISIONS[0]

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. COMPACT NAV RAIL ── */}
      <NavRail />

      {/* ── 2. MAIN LEADERBOARD CANVAS ── */}
      <div className="flex-1 min-w-0 pb-20 md:pb-12">
        <main className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-6">
          {/* ── TOP CONTEXTUAL HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="space-y-1.5">
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
              <h1 className="text-xl sm:text-2xl font-brand font-black text-slate-900 tracking-tight">
                Papan Peringkat Liga Tokyo (Weekly Leagues)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
                Bersaing setiap minggu bersama kandidat engineer global lainnya. Capai Top 3 di akhir pekan untuk promosi ke divisi yang lebih bergengsi!
              </p>
            </div>

            {/* Kodi Mascot Visual */}
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3">
              <img
                src={doodleProud}
                alt="Kodi League Mascot"
                className="w-14 h-14 object-contain"
              />
              <div className="space-y-0.5">
                <span className="text-[10px] font-brand font-black text-blue-800 uppercase block">
                  Liga Musim #{leaderboard?.season_week ?? 42}
                </span>
                <span className="text-xs font-brand font-black text-slate-900">
                  {currentDivConfig.tier}
                </span>
              </div>
            </div>
          </div>

          {/* ── 4 TOKYO LEAGUE DIVISION SELECTOR TABS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DIVISIONS.map((div) => {
              const isSelected = selectedDivision === div.id
              return (
                <button
                  key={div.id}
                  type="button"
                  onClick={() => handleSelectDivision(div.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 shadow-[0_3px_0_0_#2563EB]'
                      : 'bg-white border-slate-200 hover:border-slate-300 active:translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-brand font-black text-xs text-slate-900">
                      {div.name}
                    </span>
                    <Crown
                      weight={isSelected ? 'fill' : 'bold'}
                      className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md inline-block w-fit ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {div.tier}
                  </span>
                </button>
              )
            })}
          </div>

          {/* ── DIVISION RULES & PROMOTION / DEMOTION LEGEND ── */}
          <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-brand font-bold shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <ArrowUp weight="bold" className="w-4 h-4 text-emerald-600" />
              <span>Peringkat 1 – 3: Promosi ke Divisi Berikutnya</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
              <span>Peringkat 4 – 10: Bertahan di Divisi Saat Ini</span>
            </div>
            <div className="flex items-center gap-2 text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <CaretDown weight="bold" className="w-4 h-4 text-rose-500" />
              <span>Peringkat 11+: Degradasi ke Divisi Bawah</span>
            </div>
          </div>

          {/* ── WEEKLY SEASON PRIZE POOL BANNER ── */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border-2 border-amber-300/80 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-brand font-black text-base shrink-0 shadow-xs">
                <Trophy weight="fill" className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-brand font-black text-amber-950 uppercase tracking-wider">
                    Pool Hadiah Musim #{leaderboard?.season_week ?? 42}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                    {leaderboard?.days_remaining ?? 5} Hari Tersisa
                  </span>
                </div>
                <p className="text-xs text-amber-800 font-medium">
                  Raih Top 3 di akhir pekan untuk memenangkan Gems Tokyo dan tiket promosi otomatis ke divisi berikutnya!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0 self-end sm:self-auto">
              <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl shadow-2xs">
                <span>🥇</span>
                <span>+100 💎</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-xl shadow-2xs">
                <span>🥈</span>
                <span>+50 💎</span>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl shadow-2xs">
                <span>🥉</span>
                <span>+25 💎</span>
              </div>
            </div>
          </div>

          {/* ── LEADERBOARD TABLE ROWS ── */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 sm:p-6 space-y-2.5 shadow-xs">
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-brand font-bold text-slate-400">
                  Memuat klasemen {currentDivConfig.name}...
                </p>
              </div>
            ) : !leaderboard?.entries || leaderboard.entries.length === 0 ? (
              <div className="py-16 px-6 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <img
                  src={doodleThinking}
                  alt="Klasemen Belum Dimulai"
                  className="w-28 h-28 object-contain mx-auto drop-shadow-xs"
                />
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="font-brand font-black text-base sm:text-lg text-slate-900">
                    Klasemen Divisi Belum Dimulai
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                    Jadilah yang pertama masuk ke klasemen {currentDivConfig.name} minggu ini! Kumpulkan XP dari kurikulum dan kuis IT Jepang untuk langsung mengamankan posisi Zona Promosi!
                  </p>
                </div>
                <Button3D
                  variant="blue"
                  size="md"
                  onClick={() => {
                    triggerHaptic('tap')
                    navigate('/courses')
                  }}
                  className="text-xs sm:text-sm px-6 py-3 mx-auto"
                >
                  Buka Kurikulum &amp; Raih XP ▶
                </Button3D>
              </div>
            ) : (
              leaderboard.entries.map((entry) => {
                const isTop3 = entry.rank <= 3
                const isDemotion = entry.rank > 10
                const isUser = entry.is_current_user

                return (
                  <div
                    key={entry.user_id + entry.rank}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                      isUser
                        ? 'bg-blue-50/90 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                        : isTop3
                        ? 'bg-white border-emerald-200/90 shadow-2xs hover:border-emerald-300'
                        : isDemotion
                        ? 'bg-white border-rose-200/80 shadow-2xs'
                        : 'bg-white border-slate-200/80 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    {/* Left: Rank & User Profile */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Rank Badge */}
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-brand font-black text-xs sm:text-sm shrink-0 ${
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
                          <Crown weight="fill" className="w-5 h-5 text-amber-950" />
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
                            <span className="bg-blue-600 text-white text-[9px] font-brand font-black px-2 py-0.5 rounded-md shrink-0">
                              ANDA
                            </span>
                          )}
                          {isTop3 && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-brand font-bold px-2 py-0.5 rounded-md hidden sm:inline-block shrink-0">
                              Zona Promosi 🏆
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono font-bold">
                          <span>Lv. {entry.current_level}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-600">
                            <Flame weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                            <span>{entry.streak} hari streak</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: XP Score & Reward Badge */}
                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 justify-end font-brand font-black text-sm sm:text-base text-slate-900">
                        <Star weight="fill" className="w-4 h-4 text-amber-400" />
                        <span>{entry.weekly_xp}</span>
                        <span className="text-[10px] font-mono text-slate-400">XP</span>
                      </div>
                      {isTop3 && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                          💎 +{entry.rank === 1 ? '100' : entry.rank === 2 ? '50' : '25'} Gems
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* ── KODI CHEERING FOOTER ── */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 flex items-center gap-4 shadow-xs">
            <img
              src={doodleCelebrate}
              alt="Kodi Cheer"
              className="w-16 h-16 object-contain shrink-0 drop-shadow-xs"
            />
            <div className="space-y-1">
              <h4 className="font-brand font-black text-xs text-slate-900 flex items-center gap-1">
                <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                <span>Tips Liga Mingguan dari Kodi!</span>
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Peringkat diperbarui secara otomatis setiap kali Anda menyelesaikan quest koding dan kuis kosakata IT Jepang. Konsistensi harian 15 menit sudah cukup untuk mengamankan posisi promosi ke Divisi Roppongi Master!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
