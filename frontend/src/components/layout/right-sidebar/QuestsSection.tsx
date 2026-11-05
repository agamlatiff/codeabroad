import type { FC } from 'react'
import {
  Target,
  Clock,
  CheckCircle,
  Code,
  Translate,
  Lightning,
  Gift,
} from '@phosphor-icons/react'
import { Button3D } from '../../ui/Button3D'
import { useQuestsSection } from '../../../hooks/layout/right-sidebar/useQuestsSection'
import { ChestModal } from './ChestModal'

export interface QuestsSectionProps {
  isNihongoReviewed: boolean
  onClaimVocabQuest: (e?: React.MouseEvent) => void
  onClaimChestReward: (e?: React.MouseEvent) => void
  onFocusNihongoCard: () => void
}

/**
 * QuestsSection (SSOT)
 * Pure declarative section for Daily Quests & Golden Chest Progress Track in AppRightSidebar.
 * Powered 1:1 by useQuestsSection.
 */
export const QuestsSection: FC<QuestsSectionProps> = ({
  isNihongoReviewed,
  onClaimVocabQuest,
  onClaimChestReward,
  onFocusNihongoCard,
}) => {
  const {
    timeLeft,
    dailyTargetXp,
    todayEarnedXp,
    dailyProgressPercent,
    isChestUnlocked,
    isChestClaimedToday,
    remainingXp,
    activeQuests,
    isChestModalOpen,
    handleOpenChestModal,
    handleCloseChestModal,
    handleConfirmClaimChest,
    handleQuestAction,
  } = useQuestsSection({
    isNihongoReviewed,
    onFocusNihongoCard,
    onClaimChestReward,
  })

  return (
    <>
      <div id="daily-quests-section" className="space-y-2 scroll-mt-20">
        {/* Header with Title & Timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Target weight="bold" className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-brand font-black text-xs text-slate-900 leading-none">
                Misi & Target Harian
              </h4>
              <span className="text-[9px] text-slate-400 font-medium">
                Raih {dailyTargetXp} XP untuk Buka Peti
              </span>
            </div>
          </div>
          <span className="bg-slate-50 text-slate-600 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs border border-slate-200/60">
            <Clock weight="bold" className="w-3 h-3 text-slate-500" />
            <span>{timeLeft}</span>
          </span>
        </div>

        {/* Duolingo Integrated Progress Track with Golden Chest at End */}
        <div className="p-2 bg-amber-50/30 border border-amber-100/90 rounded-xl space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-brand font-black text-slate-800 flex items-center gap-1">
              <Lightning weight="fill" className="w-3 h-3 text-amber-500" />
              <span>
                {todayEarnedXp} / {dailyTargetXp} XP Hari Ini
              </span>
            </span>
            <span className="font-brand font-black text-amber-700 text-[10px] flex items-center gap-1">
              <span>🎁 +20 💎</span>
              <span className="text-slate-400 font-medium">
                ({isChestUnlocked ? 'Tercapai! 🎉' : `${remainingXp} XP lagi`})
              </span>
            </span>
          </div>

          {/* Progress Bar Track with Golden Chest Anchor at End */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2.5 bg-white rounded-full border border-slate-200/90 p-0.5 shadow-inner overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#D97706] relative"
                style={{ width: `${dailyProgressPercent}%` }}
              >
                <div className="absolute inset-x-0 top-0 h-[45%] bg-white/35 rounded-full" />
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenChestModal}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs transition-transform cursor-pointer ${
                isChestUnlocked
                  ? 'bg-amber-400 border-amber-500 text-amber-950 animate-bounce shadow-[0_2px_0_0_#B45309] hover:scale-110 active:scale-95'
                  : 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200'
              }`}
              title={
                isChestUnlocked
                  ? 'Klik untuk membuka Peti Emas Hadiah 50 XP! (+20 💎)'
                  : `Peti Emas Hadiah 50 XP (+20 💎) - ${remainingXp} XP lagi`
              }
            >
              <Gift weight={isChestUnlocked ? 'fill' : 'bold'} className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Actionable Quests */}
        <div className="space-y-1.5">
          {activeQuests.map((quest) => {
            const isDone = quest.status === 'completed'

            return (
              <div
                key={quest.id}
                className="p-2 sm:p-2.5 bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {quest.isLanguage ? (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-rose-400 to-pink-500 shadow-[0_2px_0_0_#9F1239] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Translate weight="bold" className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-blue-500 to-indigo-600 shadow-[0_2px_0_0_#1E3A8A] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Code weight="bold" className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p
                      className="font-brand font-black text-[11px] text-slate-900 leading-tight line-clamp-2"
                      title={quest.title}
                    >
                      {quest.title}
                    </p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[9px] font-brand font-black px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow-2xs">
                        <Lightning weight="fill" className="w-2.5 h-2.5 text-amber-500" />
                        <span>+{quest.xpReward} XP</span>
                      </span>
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider bg-slate-100 border border-slate-200/60 px-1 py-0.2 rounded">
                        {quest.chipLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {isDone ? (
                  <span className="bg-emerald-50 border border-emerald-300 text-emerald-700 font-brand font-black text-[9px] px-2 py-1 rounded-lg flex items-center gap-0.5 shrink-0 shadow-2xs">
                    <CheckCircle weight="fill" className="w-3 h-3 text-emerald-600" />
                    <span>SELESAI</span>
                  </span>
                ) : quest.status === 'ready_to_claim' ? (
                  <Button3D
                    variant="amber"
                    size="sm"
                    onClick={(e) => onClaimVocabQuest(e)}
                    className="text-[10px] font-black tracking-wide px-2.5 py-1 shrink-0 shadow-[0_2px_0_0_#B45309]"
                  >
                    KLAIM ⚡
                  </Button3D>
                ) : (
                  <Button3D
                    variant="blue"
                    size="sm"
                    onClick={() => handleQuestAction(quest)}
                    className="text-[10px] font-black tracking-wide px-2.5 py-1 shrink-0 shadow-[0_2px_0_0_#1D4ED8]"
                  >
                    MULAI ▶
                  </Button3D>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── CELEBRATION MODAL FOR DAILY GOLDEN CHEST ── */}
      <ChestModal
        isOpen={isChestModalOpen}
        onClose={handleCloseChestModal}
        dailyTargetXp={dailyTargetXp}
        remainingXp={remainingXp}
        isChestUnlocked={isChestUnlocked}
        isChestClaimedToday={isChestClaimedToday}
        onClaimChest={(e) => handleConfirmClaimChest(e)}
      />
    </>
  )
}

