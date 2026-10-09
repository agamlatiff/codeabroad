import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SubmitQuestResponse, Quest } from '../../types/quest'

export interface QuestCompleteModalProps {
  isOpen: boolean
  quest: Quest | null
  submitResult: SubmitQuestResponse | null
  onClose: () => void
}

export const QuestCompleteModal: FC<QuestCompleteModalProps> = ({
  isOpen,
  quest,
  submitResult,
  onClose,
}) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const xpEarned = submitResult?.xp_awarded ?? quest?.xp_reward ?? 50
  const streakDays = submitResult?.streak ?? 5

  const handleNextBab = () => {
    onClose()
    navigate('/courses')
  }

  const handleReviewCode = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] shadow-2xl p-6 sm:p-8 max-w-xl w-full text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* ── 1. CELEBRATION ICON & HEADLINE ── */}
        <div className="w-20 h-20 rounded-3xl bg-[#EFF6FF] border-2 border-blue-200 text-blue-600 flex items-center justify-center mx-auto text-4xl shadow-xs">
          🎉
        </div>

        <div className="space-y-1">
          <span className="bg-[#F0F9FF] text-[#0284C7] font-black text-xs px-3 py-1 rounded-full inline-block">
            YATTA! KERJA BAGUS!
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight pt-1">
            Bab 2 Berhasil Diselesaikan! 🚀
          </h2>
          <p className="text-xs text-[#64748B] font-medium max-w-md mx-auto">
            Logika JWT Middleware tervalidasi dan siap digunakan di service produksi Tokyo.
          </p>
        </div>

        {/* ── 2. 3 REWARD PILLS (MATCHING SCREEN 11 PEN) ── */}
        <div className="grid grid-cols-3 gap-3">
          {/* XP Pill */}
          <div className="p-3 rounded-2xl bg-[#EFF6FF] border border-blue-200 flex flex-col items-center justify-center space-y-0.5">
            <span className="text-sm">⚡</span>
            <span className="font-mono font-black text-sm sm:text-base text-[#2563EB]">
              +{xpEarned} XP
            </span>
            <span className="text-[10px] font-bold text-[#1E40AF]">XP Diperoleh</span>
          </div>

          {/* Tests Passed Pill */}
          <div className="p-3 rounded-2xl bg-[#F0F9FF] border border-sky-200 flex flex-col items-center justify-center space-y-0.5">
            <span className="text-sm">🎯</span>
            <span className="font-mono font-black text-sm sm:text-base text-[#0284C7]">
              100%
            </span>
            <span className="text-[10px] font-bold text-[#0369A1]">2/2 Tes Lolos</span>
          </div>

          {/* Streak Pill */}
          <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-amber-200 flex flex-col items-center justify-center space-y-0.5">
            <span className="text-sm">🔥</span>
            <span className="font-mono font-black text-sm sm:text-base text-[#D97706]">
              {streakDays} HARI
            </span>
            <span className="text-[10px] font-bold text-[#B45309]">Streak Aktif</span>
          </div>
        </div>

        {/* ── 3. CAREER PROGRESS ROAD TO TOKYO ── */}
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

        {/* ── 4. NIHONGO VOCABULARY PASSPORT ── */}
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

        {/* ── 5. BOTTOM ACTIONS ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReviewCode}
            className="w-full sm:w-auto bg-[#F1F5F9] hover:bg-slate-200 text-[#64748B] font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Review Kode Solusi
          </button>
          <button
            type="button"
            onClick={handleNextBab}
            className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-[0_4px_0_0_#1D4ED8] transition-all cursor-pointer"
          >
            LANJUTKAN KE BAB 3: GORM & DATABASE ▶
          </button>
        </div>
      </div>
    </div>
  )
}
