import { createPortal } from 'react-dom'
import { Gift, Lightning, X } from '@phosphor-icons/react'
import { triggerHaptic } from '../../utils/haptics'
import { useAppRightSidebar } from '../../hooks/right-sidebar/useAppRightSidebar'
import { RightSidebarStreakSection } from './RightSidebarStreakSection'
import { RightSidebarQuestsSection } from './RightSidebarQuestsSection'
import { RightSidebarNihongoCard } from './RightSidebarNihongoCard'
import { RightSidebarStreakModal } from './RightSidebarStreakModal'
import { RightSidebarChestModal } from './RightSidebarChestModal'

export interface AppRightSidebarProps {
  className?: string
  activeTrack?: string
  isMobileDrawerOpen?: boolean
  onCloseMobileDrawer?: () => void
}

/**
 * AppRightSidebar (SSOT)
 * Pure declarative right-rail gamification sidebar for CodeAbroad.
 * Powered 1:1 by useAppRightSidebar.
 */
export const AppRightSidebar = ({
  className = '',
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
}: AppRightSidebarProps) => {
  const {
    userStreak,
    timeLeft,
    dailyTargetXp,
    todayEarnedXp,
    dailyProgressPercent,
    isChestUnlocked,
    isChestClaimedToday,
    remainingXp,
    weeklyStreakDays,
    calendarActiveDates,
    activeQuests,
    isNihongoReviewed,
    isVocabQuestClaimed,
    isNihongoHighlighted,
    nihongoSectionRef,
    isChestModalOpen,
    setIsChestModalOpen,
    isStreakModalOpen,
    setIsStreakModalOpen,
    isClosingDrawer,
    floatingRewards,
    handleVocabReview,
    handleClaimVocabQuest,
    handleClaimChest,
    handleQuestAction,
    handleCloseMobileDrawer,
  } = useAppRightSidebar({ onCloseMobileDrawer })

  const sidebarContent = (
    <>
      {/* ── 1. 7-DAY STREAK CONSISTENCY TRACKER ── */}
      <RightSidebarStreakSection
        userStreak={userStreak}
        weeklyStreakDays={weeklyStreakDays}
        onOpenStreakModal={() => setIsStreakModalOpen(true)}
      />

      {/* ── SUBTLE SECTION DIVIDER ── */}
      <div className="h-[1px] bg-slate-100" />

      {/* ── 2. MISI & TARGET HARIAN ── */}
      <RightSidebarQuestsSection
        timeLeft={timeLeft}
        dailyTargetXp={dailyTargetXp}
        todayEarnedXp={todayEarnedXp}
        dailyProgressPercent={dailyProgressPercent}
        isChestUnlocked={isChestUnlocked}
        remainingXp={remainingXp}
        activeQuests={activeQuests}
        onOpenChestModal={() => setIsChestModalOpen(true)}
        onClaimVocabQuest={(e) => handleClaimVocabQuest(e)}
        onQuestAction={handleQuestAction}
      />

      {/* ── SUBTLE SECTION DIVIDER ── */}
      <div className="h-[1px] bg-slate-100" />

      {/* ── 3. KOSAKATA KANTOR TOKYO ── */}
      <div
        ref={nihongoSectionRef}
        className={`transition-all rounded-2xl ${
          isNihongoHighlighted ? 'ring-4 ring-blue-400' : ''
        }`}
      >
        <RightSidebarNihongoCard
          isReviewed={isNihongoReviewed}
          isClaimed={isVocabQuestClaimed}
          onReview={handleVocabReview}
          onClaim={(e) => handleClaimVocabQuest(e)}
        />
      </div>
    </>
  )

  return (
    <>
      {/* ── DESKTOP STICKY RIGHT RAIL (XL & UP) ── */}
      <aside
        className={`hidden xl:block w-[354px] shrink-0 border-l border-slate-200/80 bg-white p-4 xl:px-4.5 xl:py-4 pb-8 space-y-3 select-none xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto custom-scrollbar xl:self-start ${className}`}
      >
        {sidebarContent}
      </aside>

      {/* ── MOBILE & TABLET SLIDE-OVER DRAWER (SSOT - PORTAL) ── */}
      {(isMobileDrawerOpen || isClosingDrawer) &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop blur overlay */}
            <div
              className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity ${
                isClosingDrawer ? 'animate-backdrop-out' : 'animate-backdrop-in'
              }`}
              onClick={handleCloseMobileDrawer}
            />

            {/* Slide-over Drawer Panel */}
            <div
              className={`relative w-full max-w-[360px] sm:max-w-[390px] h-full bg-white shadow-2xl flex flex-col z-10 border-l border-slate-200 overflow-hidden ${
                isClosingDrawer ? 'animate-drawer-out' : 'animate-drawer-in'
              }`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200/90 bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-orange-100/80 text-orange-600 flex items-center justify-center font-bold">
                    <Gift weight="fill" className="w-4 h-4 text-orange-500 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-brand font-black text-sm text-slate-900 leading-none">
                      Misi & Hadiah Harian
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Rentetan, target XP & Nihongo kerja
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap')
                    handleCloseMobileDrawer()
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors active:scale-90"
                  aria-label="Tutup Menu Hadiah"
                >
                  <X weight="bold" className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {sidebarContent}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── STREAK ATTENDANCE CALENDAR MODAL ── */}
      <RightSidebarStreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        currentStreak={userStreak}
        activeDates={calendarActiveDates}
      />

      {/* ── FLOATING XP BURST REWARDS ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 pointer-events-none z-[9999]">
            {floatingRewards.map((reward) => (
              <div
                key={reward.id}
                className="absolute transform -translate-x-1/2 -translate-y-full animate-float-up-fade flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 font-brand font-black text-sm shadow-[0_4px_16px_rgba(245,158,11,0.5)] border-2 border-white ring-2 ring-amber-400/50"
                style={{ left: reward.x, top: reward.y }}
              >
                <Lightning weight="fill" className="w-4 h-4 text-amber-950 animate-bounce" />
                <span>+{reward.amount} XP</span>
                <span className="text-xs">⚡</span>
              </div>
            ))}
          </div>,
          document.body
        )}

      {/* ── CELEBRATION MODAL FOR DAILY GOLDEN CHEST ── */}
      <RightSidebarChestModal
        isOpen={isChestModalOpen}
        onClose={() => setIsChestModalOpen(false)}
        dailyTargetXp={dailyTargetXp}
        remainingXp={remainingXp}
        isChestUnlocked={isChestUnlocked}
        isChestClaimedToday={isChestClaimedToday}
        onClaimChest={(e) => handleClaimChest(e)}
      />
    </>
  )
}
