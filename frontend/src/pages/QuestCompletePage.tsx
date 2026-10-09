import { useLocation, useNavigate } from 'react-router-dom'
import type { SubmitQuestResponse, Quest } from '../types/quest'

export const QuestCompletePage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as {
    submitResult?: SubmitQuestResponse
    quest?: Quest
  } | undefined

  const submitResult = state?.submitResult
  const quest = state?.quest

  const xpEarned = submitResult?.xp_awarded ?? quest?.xp_reward ?? 50
  const streakDays = submitResult?.streak ?? 5

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-500/20 flex flex-col justify-between">
      {/* ── TOP NAV (MATCHING SCREEN 11) ── */}
      <header className="h-16 shrink-0 bg-white border-b-2 border-[#E2E8F0] px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="bg-[#F1F5F9] hover:bg-slate-200 active:translate-y-0.5 text-[#0F172A] font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            ← Silabus
          </button>
          <span className="bg-[#EFF6FF] text-[#2563EB] font-black text-xs px-2 py-0.5 rounded">
            GIN // 04
          </span>
          <span className="text-xs sm:text-sm font-black text-[#0F172A]">
            Station 3 • Bab 2: REST Handler & Auth Middleware
          </span>
        </div>

        <span className="hidden sm:inline-block bg-[#F0F9FF] text-[#0284C7] font-black text-xs px-3.5 py-1 rounded-full">
          ✓ BAB 2 LULUS (100% PASS)
        </span>

        <div className="flex items-center gap-3">
          <span className="bg-[#FFFBEB] text-[#D97706] font-black text-xs px-2.5 py-1 rounded-xl">
            🔥 5 HARI
          </span>
          <span className="bg-[#EFF6FF] text-[#2563EB] font-black text-xs px-2.5 py-1 rounded-xl">
            ⚡ 1,450 XP
          </span>
        </div>
      </header>

      {/* ── CENTER CELEBRATION STAGE ── */}
      <main className="flex-1 max-w-xl mx-auto w-full my-auto py-8 px-4 text-center space-y-5">
        <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-5">
          {/* 1. Icon & Headlines */}
          <div className="w-20 h-20 rounded-3xl bg-[#EFF6FF] border-2 border-blue-200 text-blue-600 flex items-center justify-center mx-auto text-4xl shadow-xs">
            🎉
          </div>

          <div className="space-y-1">
            <span className="bg-[#F0F9FF] text-[#0284C7] font-black text-xs px-3 py-1 rounded-full inline-block">
              YATTA! KERJA BAGUS!
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight pt-1">
              Bab 2 Berhasil Diselesaikan! 🚀
            </h1>
            <p className="text-xs text-[#64748B] font-medium max-w-md mx-auto">
              Logika JWT Middleware tervalidasi dan siap digunakan di service produksi Tokyo.
            </p>
          </div>

          {/* 2. 3 Reward Pills */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-[#EFF6FF] border border-blue-200 flex flex-col items-center justify-center space-y-0.5">
              <span className="text-sm">⚡</span>
              <span className="font-mono font-black text-sm sm:text-base text-[#2563EB]">
                +{xpEarned} XP
              </span>
              <span className="text-[10px] font-bold text-[#1E40AF]">XP Diperoleh</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F0F9FF] border border-sky-200 flex flex-col items-center justify-center space-y-0.5">
              <span className="text-sm">🎯</span>
              <span className="font-mono font-black text-sm sm:text-base text-[#0284C7]">
                100%
              </span>
              <span className="text-[10px] font-bold text-[#0369A1]">2/2 Tes Lolos</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-amber-200 flex flex-col items-center justify-center space-y-0.5">
              <span className="text-sm">🔥</span>
              <span className="font-mono font-black text-sm sm:text-base text-[#D97706]">
                {streakDays} HARI
              </span>
              <span className="text-[10px] font-bold text-[#B45309]">Streak Aktif</span>
            </div>
          </div>

          {/* 3. Tokyo Track Readiness */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-black text-[#0F172A]">
                <span>✈️</span>
                <span>RUTE KARIER: CGK ➔ NRT (TOKYO TRACK)</span>
              </div>
              <span className="bg-[#EFF6FF] text-[#2563EB] font-black text-[10px] px-2 py-0.5 rounded-md">
                +2.0% KESIAPAN
              </span>
            </div>

            <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="w-[70%] h-full bg-[#2563EB] rounded-full transition-all duration-700" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#64748B]">
              <span className="font-bold text-[#0F172A]">Tingkat Kesiapan Kerja: 68% ➔ 70%</span>
              <span>Target Job Ready: 85%</span>
            </div>
          </div>

          {/* 4. Nihongo Passport Note */}
          <div className="p-3 rounded-2xl bg-[#F0F9FF] border border-sky-200 text-left flex items-start gap-3">
            <span className="bg-[#0284C7] text-white font-black text-[10px] px-2 py-0.5 rounded shrink-0">
              JLPT N3
            </span>
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-[#0369A1]">
                Kosakata Paspor: 認可 (Nin-ka • Authorization)
              </p>
              <p className="text-[11px] text-[#0284C7] leading-relaxed">
                Tersimpan di Lemari Paspor. Digunakan saat review arsitektur bersama tim lead Tokyo.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── BOTTOM TACTILE ACTION BAR (SCREEN 11) ── */}
      <footer className="h-20 shrink-0 bg-white border-t-2 border-[#E2E8F0] px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <span>Semua hasil tes tervalidasi. Siap melanjutkan ke Station 3 • Bab 3!</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/learn/station-3-jwt-middleware')}
            className="bg-[#F1F5F9] hover:bg-slate-200 text-[#64748B] font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Review Kode Solusi
          </button>
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-[0_4px_0_0_#1D4ED8] transition-all cursor-pointer"
          >
            LANJUTKAN KE BAB 3: GORM & DATABASE ▶
          </button>
        </div>
      </footer>
    </div>
  )
}
