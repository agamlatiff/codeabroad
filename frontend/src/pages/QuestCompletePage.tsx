import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button3D } from '../components/ui/Button3D'
import { triggerHaptic } from '../utils/haptics'
import { audioEngine } from '../utils/audio'
import doodleCelebrate from '../assets/kodi/doodle-celebrate.png'
import {
  Fire,
  Star,
  CheckCircle,
  Lightning,
  ArrowRight,
  ArrowCounterClockwise,
} from '@phosphor-icons/react'
import type { SubmitQuestResponse, Quest } from '../types/quest'

export const QuestCompletePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()

  const state = location.state as {
    submitResult?: SubmitQuestResponse
    quest?: Quest
  } | undefined

  const submitResult = state?.submitResult
  const quest = state?.quest

  const xpEarned = submitResult?.xp_awarded ?? quest?.xp_reward ?? 50
  const streakDays = submitResult?.streak ?? user?.streak ?? 1
  const userXp = user?.xp ? user.xp.toLocaleString() : (submitResult?.current_xp ? submitResult.current_xp.toLocaleString() : '150')
  const unlockedVocab = submitResult?.unlocked_vocab || quest?.nihongo_notes
  const readinessScore = Math.round(submitResult?.current_readiness_score ?? 70)
  const readinessIncrease = submitResult?.readiness_increase ?? 2.0

  useEffect(() => {
    audioEngine.playFanfare()
  }, [])

  const handleNextQuest = () => {
    triggerHaptic('success')
    if (submitResult?.next_quest?.id) {
      navigate(`/learn/${submitResult.next_quest.id}`)
    } else {
      navigate('/dashboard')
    }
  }

  const handleReviewCode = () => {
    triggerHaptic('tap')
    navigate(`/learn/${quest?.id || id || 'part-1-variabel-dan-tipe-data'}`)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans selection:bg-blue-500/20 flex flex-col justify-between">
      {/* ── TOP NAV ── */}
      <header className="h-16 shrink-0 bg-white border-b-2 border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap')
              navigate('/courses')
            }}
            className="bg-slate-100 hover:bg-slate-200 active:translate-y-0.5 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            ← Silabus
          </button>
          <span className="bg-blue-50 text-[#2563EB] font-mono font-black text-xs px-2 py-0.5 rounded">
            {quest?.chip_label || 'MODUL IT'}
          </span>
          <span className="text-xs sm:text-sm font-black text-[#0F172A] truncate max-w-[200px] sm:max-w-md">
            {quest?.title || 'Sesi Koding Selesai'}
          </span>
        </div>

        <span className="hidden sm:inline-block bg-emerald-50 text-emerald-700 font-black text-xs px-3 py-1 rounded-full border border-emerald-200">
          ✓ LULUS (100% PASS)
        </span>

        <div className="flex items-center gap-2.5">
          <span className="bg-orange-50 text-orange-700 font-black text-xs px-2.5 py-1 rounded-xl border border-orange-200 flex items-center gap-1">
            <Fire weight="fill" className="w-3.5 h-3.5 text-orange-500" />
            <span>{streakDays} HARI</span>
          </span>
          <span className="bg-amber-50 text-amber-700 font-black text-xs px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1">
            <Star weight="fill" className="w-3.5 h-3.5 text-amber-500" />
            <span>{userXp} XP</span>
          </span>
        </div>
      </header>

      {/* ── CENTER CELEBRATION STAGE ── */}
      <main className="flex-1 max-w-xl mx-auto w-full my-auto py-8 px-4 text-center space-y-5">
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          {/* 1. Mascot / Trophy */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-28 h-8 bg-amber-200/50 rounded-[50%] absolute -bottom-1 z-0 blur-[2px]" />
            <img
              src={doodleCelebrate}
              alt="Kodi Celebrate"
              className="w-28 h-28 object-contain relative z-10 select-none drop-shadow-sm animate-bounce"
            />
          </div>

          <div className="space-y-1.5">
            <span className="bg-sky-50 text-[#0284C7] font-black text-xs px-3.5 py-1 rounded-full border border-sky-200 inline-block">
              YATTA! KERJA BAGUS! 🎉
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {quest?.title ? `${quest.title} Selesai!` : 'Materi Berhasil Diselesaikan! 🚀'}
            </h1>
            <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
              {quest?.description || 'Logika dan kriteria penerimaan tervalidasi. Kode siap digunakan di service produksi Tokyo.'}
            </p>
          </div>

          {/* 2. Reward Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center space-y-0.5">
              <Lightning weight="fill" className="w-4 h-4 text-[#2563EB]" />
              <span className="font-mono font-black text-sm sm:text-base text-[#2563EB]">
                +{xpEarned} XP
              </span>
              <span className="text-[10px] font-bold text-blue-800">XP Diperoleh</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center space-y-0.5">
              <span className="text-sm">💎</span>
              <span className="font-mono font-black text-sm sm:text-base text-emerald-700">
                +{submitResult?.gems_awarded ?? 10}
              </span>
              <span className="text-[10px] font-bold text-emerald-800">Gems Tokyo</span>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col items-center justify-center space-y-0.5">
              <CheckCircle weight="fill" className="w-4 h-4 text-sky-600" />
              <span className="font-mono font-black text-sm sm:text-base text-sky-700">
                100%
              </span>
              <span className="text-[10px] font-bold text-sky-800">Semua Tes Lolos</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center space-y-0.5">
              <Fire weight="fill" className="w-4 h-4 text-amber-600" />
              <span className="font-mono font-black text-sm sm:text-base text-amber-700">
                {streakDays} HARI
              </span>
              <span className="text-[10px] font-bold text-amber-900">Streak Aktif</span>
            </div>
          </div>

          {/* 3. Tokyo Track Readiness */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-black text-[#0F172A]">
                <span>✈️</span>
                <span>RUTE KARIER: CGK ➔ NRT (TOKYO TRACK)</span>
              </div>
              <span className="bg-blue-50 text-[#2563EB] font-black text-[10px] px-2 py-0.5 rounded-md border border-blue-200">
                +{readinessIncrease.toFixed(1)}% KESIAPAN
              </span>
            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-[#2563EB] rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, readinessScore)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-bold text-[#0F172A]">Tingkat Kesiapan Kerja: {readinessScore}%</span>
              <span>Target Job Ready: 85%</span>
            </div>
          </div>

          {/* 3.5. Tokyo League Leaderboard Boost */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border border-amber-200 text-left flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-brand font-black text-xs shrink-0 shadow-2xs">
                🏆
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-brand font-black text-xs text-amber-950">
                    Tokyo League: +{xpEarned} XP
                  </span>
                  <span className="bg-amber-200/80 text-amber-900 font-mono font-bold text-[9px] px-1.5 py-0.2 rounded">
                    Weekly Rank
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 font-medium truncate">
                  XP otomatis dihitung ke klasemen liga mingguan Anda untuk promosi divisi!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                navigate('/leaderboard')
              }}
              className="text-[11px] font-brand font-black text-blue-600 hover:text-blue-700 underline shrink-0 cursor-pointer"
            >
              Lihat Klasemen →
            </button>
          </div>

          {/* 4. Nihongo Passport Note */}
          {unlockedVocab && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-left flex items-start gap-3">
              <span className="bg-[#0284C7] text-white font-black text-[10px] px-2 py-0.5 rounded shrink-0">
                IT NIHONGO
              </span>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-[#0369A1]">
                  Kosakata Paspor: {unlockedVocab.term} ({unlockedVocab.reading}) • {unlockedVocab.meaning}
                </p>
                <p className="text-[11px] text-[#0284C7] leading-relaxed">
                  {unlockedVocab.example || 'Tersimpan di Lemari Paspor. Digunakan saat review arsitektur bersama tim lead Tokyo.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── BOTTOM TACTILE ACTION BAR ── */}
      <footer className="h-20 shrink-0 bg-white border-t-2 border-slate-200 px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Semua kriteria penerimaan tervalidasi. Siap melanjutkan ke modul berikutnya!</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReviewCode}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowCounterClockwise weight="bold" className="w-3.5 h-3.5" />
            <span>Review Kode</span>
          </button>
          <Button3D
            variant="blue"
            size="md"
            onClick={handleNextQuest}
            className="text-xs sm:text-sm px-6 py-2.5 shadow-[0_4px_0_0_#1D4ED8]"
          >
            <span className="flex items-center gap-1.5">
              <span>{submitResult?.next_quest ? 'LANJUTKAN KE MODUL BERIKUTNYA' : 'KEMBALI KE KURIKULUM'}</span>
              <ArrowRight weight="bold" className="w-4 h-4" />
            </span>
          </Button3D>
        </div>
      </footer>
    </div>
  )
}
