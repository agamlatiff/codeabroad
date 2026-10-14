import type { FC } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import type { SubmitQuestResponse, Quest } from '../../types/quest'
import { useAuthStore } from '../../store/authStore'
import { Button3D } from '../ui/Button3D'
import { DoodleHanko } from '../illustrations/doodles'
import doodleCelebrate from '../../assets/kodi/doodle-celebrate.png'

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
  const { user } = useAuthStore()

  if (!isOpen) return null

  const xpEarned = submitResult?.xp_awarded ?? quest?.xp_reward ?? 50
  const streakDays = submitResult?.streak ?? user?.streak ?? 1
  const readinessIncrease = submitResult?.readiness_increase ?? 2.0
  const currentReadiness = submitResult?.current_readiness_score
    ? Math.round(submitResult.current_readiness_score)
    : 70
  const prevReadiness = Math.max(0, currentReadiness - Math.round(readinessIncrease))

  const activeVocab = submitResult?.unlocked_vocab || quest?.nihongo_notes

  const handleNextQuest = () => {
    onClose()
    if (submitResult?.next_quest?.id) {
      navigate(`/learn/${submitResult.next_quest.id}`)
    } else {
      navigate('/dashboard')
    }
  }

  const handleReviewCode = () => {
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-6 sm:p-8 max-w-xl w-full text-center space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Hanko Stamp watermark at top-right */}
        <div className="absolute top-4 right-4 -rotate-12 pointer-events-none opacity-90">
          <DoodleHanko text="合格" className="w-14 h-14 drop-shadow-sm" />
        </div>

        {/* ── 1. CELEBRATION KODI MASCOT & HEADLINE ── */}
        <div className="relative flex flex-col items-center justify-center pt-2">
          {/* Subtle Stepped Glass Base */}
          <div className="w-28 h-8 bg-blue-200/50 rounded-[50%] absolute bottom-0 z-0 blur-[1px]" />
          <img
            src={doodleCelebrate}
            alt="Kodi Celebrating"
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain relative z-10 select-none drop-shadow-md animate-bounce"
          />
        </div>

        <div className="space-y-1">
          <span className="bg-[#EFF6FF] text-[#2563EB] font-black text-xs px-3.5 py-1 rounded-full inline-block border border-blue-200">
            🎉 YATTA! KERJA BAGUS!
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight pt-1">
            {quest?.title ? `${quest.title} Selesai! 🚀` : 'Misi Koding Berhasil Diselesaikan! 🚀'}
          </h2>
          <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
            {quest?.chip_label ? `Modul [${quest.chip_label}]` : 'Modul'} tervalidasi dan berhasil memenuhi standar industri Tokyo.
          </p>
        </div>

        {/* ── 2. 3 REWARD PILLS ── */}
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
            <span className="text-[10px] font-bold text-[#0369A1]">Kriteria Lolos</span>
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
              <span>RUTE KARIER: CGK ➔ HND (TOKYO TRACK)</span>
            </div>
            <span className="bg-[#EFF6FF] text-[#2563EB] font-black text-[10px] px-2 py-0.5 rounded-md">
              +{readinessIncrease.toFixed(1)}% KESIAPAN
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, currentReadiness)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-bold text-[#0F172A]">
              Tingkat Kesiapan Kerja: {prevReadiness}% ➔ {currentReadiness}%
            </span>
            <span>Target Sponsor Visa: 85%</span>
          </div>
        </div>

        {/* ── 4. NIHONGO VOCABULARY PASSPORT ── */}
        {activeVocab && (
          <div className="p-3 rounded-2xl bg-[#F0F9FF] border border-sky-200 text-left flex items-start gap-3">
            <span className="bg-[#0284C7] text-white font-black text-[10px] px-2 py-0.5 rounded shrink-0">
              JLPT N3
            </span>
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-[#0369A1]">
                Kosakata Paspor: {activeVocab.term} {activeVocab.reading ? `(${activeVocab.reading})` : ''} • {activeVocab.meaning}
              </p>
              {activeVocab.example && (
                <p className="text-[11px] text-[#0284C7] leading-relaxed">
                  {activeVocab.example}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── 5. BOTTOM ACTIONS ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReviewCode}
            className="w-full sm:w-auto bg-[#F1F5F9] hover:bg-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Review Kode Solusi
          </button>
          <Button3D
            variant="blue"
            size="md"
            onClick={handleNextQuest}
            className="w-full sm:w-auto text-xs px-6 py-3"
          >
            <span>
              {submitResult?.next_quest
                ? `LANJUTKAN KE MISI BERIKUTNYA (${submitResult.next_quest.chip_label}) ▶`
                : 'KEMBALI KE PUSAT DASHBOARD ▶'}
            </span>
          </Button3D>
        </div>
      </div>
    </div>,
    document.body
  )
}
