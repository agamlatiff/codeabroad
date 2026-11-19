import { useNavigate } from 'react-router-dom'
import { AppLeftSidebar } from "@/shared/components/layout/left-sidebar/AppLeftSidebar"
import { AppTopBar } from "@/shared/components/layout/top-bar/AppTopBar"
import { PageHeroHeader } from "@/shared/components/ui/PageHeroHeader"
import { TrackSwitcherModal } from "@/shared/components/layout/top-bar/TrackSwitcherModal"
import { ChestRewardModal } from "@/features/gamification/components/ChestRewardModal"
import { MonthlyBadgeModal } from "@/features/gamification/components/MonthlyBadgeModal"
import { CVReviewSubmissionModal } from "@/features/gamification/components/CVReviewSubmissionModal"
import { MockInterviewScheduleModal } from "@/features/gamification/components/MockInterviewScheduleModal"
import { DailyQuestsSection } from "@/features/gamification/components/DailyQuestsSection"
import { MilestoneChallengesSection } from "@/features/gamification/components/MilestoneChallengesSection"
import { AkihabaraShopSection } from "@/features/gamification/components/AkihabaraShopSection"
import { useQuests } from "@/features/gamification/hooks/useQuests"
import type { QuestPageTab } from "@/features/gamification/constants/gamificationCatalog"
import { Button3D } from "@/shared/components/ui/Button3D"
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"
import { triggerHaptic } from "@/shared/utils/haptics"
import {
  MagnifyingGlass,
  Sparkle,
  Clock,
  X,
  Medal,
  CheckCircle,
  ArrowRight,
} from '@phosphor-icons/react'

export type { QuestPageTab }

const EMPTY_PROGRESS_MAP: Record<string, { completed: number; total: number }> = {}

const QUEST_TAB_LABELS: Record<QuestPageTab, string> = {
  daily: 'Misi Harian',
  boss: 'Tantangan',
  shop: 'Pasar Guild',
}

export const QuestLogPage = () => {
  const navigate = useNavigate()
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    activeTrack,
    isCourseSwitcherOpen,
    setIsCourseSwitcherOpen,
    selectedChestForModal,
    isChestModalOpen,
    setIsChestModalOpen,
    isMonthlyBadgeModalOpen,
    setIsMonthlyBadgeModalOpen,
    isCVModalOpen,
    setIsCVModalOpen,
    isMockModalOpen,
    setIsMockModalOpen,
    isPurchasingItemId,
    toastMessage,
    setToastMessage,
    floatingReward,
    userGems,
    inventory,
    claimedDailyChests,
    shopItems,
    filteredDaily,
    milestoneChallenges,
    dailyDoneCount,
    totalDailyTarget,
    currentMonthYearName,
    daysLeftInMonth,
    monthlyCompletedCount,
    monthlyTargetCount,
    monthlyProgressPercent,
    isMonthlyBadgeClaimed,
    kodiCompanion,
    hasNoResults,
    completedCount,
    totalCount,
    progressPercent,
    isLoading,
    claimingQuestId,
    handleClaimDailyQuest,
    handleSelectTrack,
    handleOpenChest,
    handleConfirmClaimChest,
    handlePurchaseShopItem,
    handleCVSubmitted,
    handleMockScheduled,
  } = useQuests()

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. LEFT NAV RAIL (SSOT) ── */}
      <AppLeftSidebar />

      {/* ── 2. SINGLE-COLUMN CENTERED STAGE ── */}
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-12">
        <main className="flex-1 min-w-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
          {/* ── TOP HUD BAR + BREADCRUMB (SSOT) ── */}
          <AppTopBar
            activeTrack={activeTrack}
            onOpenCourseSwitcher={() => setIsCourseSwitcherOpen(true)}
            completedCount={completedCount}
            totalCount={totalCount}
            progressPercent={progressPercent}
            unitLabel="Misi"
            breadcrumbs={[
              { label: 'Beranda', to: '/curriculum' },
              { label: 'Misi & Toko' },
              { label: QUEST_TAB_LABELS[activeTab] },
            ]}
          />

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
              <span>{toastMessage}</span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                aria-label="Tutup notifikasi"
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
              >
                <X weight="bold" className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Floating Reward Particle Toast */}
          {floatingReward && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
              <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-sm px-4 py-2 rounded-full shadow-lg border-2 border-white ring-4 ring-amber-300/50 flex items-center gap-2">
                <Sparkle weight="fill" className="w-4 h-4 text-amber-900" />
                <span>{floatingReward}</span>
              </div>
            </div>
          )}

          {/* ── 1. UNIFIED CLEAN TACTILE HERO BANNER: KODI MASCOT & MONTHLY CHALLENGE ── */}
          <PageHeroHeader
            theme="amber"
            icon={<Medal weight="fill" className="w-6 h-6" />}
            badges={
              <>
                <span
                  className={`font-brand font-black text-[11px] px-3 py-0.5 rounded-full border uppercase tracking-wider ${kodiCompanion.badgeBg}`}
                >
                  {kodiCompanion.badge}
                </span>
                <span className="text-xs font-bold text-slate-500 inline-flex items-center gap-1">
                  <Clock weight="bold" className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sisa {daysLeftInMonth} Hari di Bulan Ini</span>
                </span>
              </>
            }
            title={`Lencana Emas Bulanan (${currentMonthYearName})`}
            description="Selesaikan 25 misi dan pelajaran bahasa bulan ini untuk membuka pencapaian lencana emas di profil Anda."
            bottomSlot={
              <div className="space-y-2.5 max-w-lg">
                <div className="flex items-center justify-between text-xs font-brand font-black">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Medal weight="fill" className="w-4 h-4 text-amber-500" />
                    <span>
                      {monthlyCompletedCount} / {monthlyTargetCount} Misi Selesai
                    </span>
                  </span>
                  <span className="text-amber-700 font-bold">
                    {monthlyCompletedCount >= monthlyTargetCount
                      ? '🎉 Lencana Terbuka!'
                      : `${monthlyTargetCount - monthlyCompletedCount} misi lagi`}
                  </span>
                </div>
                <div className="h-3 bg-white/95 rounded-full border border-amber-300 p-0.5 shadow-inner overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#D97706]"
                    style={{ width: `${monthlyProgressPercent}%` }}
                  />
                </div>
                <div className="pt-1">
                  <Button3D
                    variant={monthlyCompletedCount >= monthlyTargetCount ? 'amber' : 'white'}
                    size="sm"
                    onClick={() => {
                      triggerHaptic('tap')
                      setIsMonthlyBadgeModalOpen(true)
                    }}
                    className={`text-xs px-4 py-2 ${
                      isMonthlyBadgeClaimed
                        ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300'
                        : 'text-slate-700'
                    }`}
                  >
                    {isMonthlyBadgeClaimed ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600" />
                        <span>LENCANA EMAS AKTIF DI PROFIL</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Medal weight="bold" className="w-4 h-4 text-amber-600" />
                        <span>LIHAT DETAIL LENCANA BULANAN ➔</span>
                      </span>
                    )}
                  </Button3D>
                </div>
              </div>
            }
            rightSlot={
              <div className="flex flex-col items-center sm:items-end justify-center space-y-2">
                <div className="relative bg-white border-2 border-amber-300 rounded-2xl px-4 py-2.5 shadow-2xs text-xs font-brand font-black text-slate-800 leading-snug max-w-xs text-center sm:text-left">
                  <span>{kodiCompanion.speech}</span>
                  <div className="hidden sm:block absolute -bottom-2 right-10 w-3 h-3 bg-white border-b-2 border-r-2 border-amber-300 transform rotate-45" />
                </div>

                <div className="w-24 h-24 sm:w-28 sm:h-28 relative group flex items-center justify-center">
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full filter blur-xl transform group-hover:scale-110 transition-transform" />
                  <div className="relative z-10 drop-shadow-md transform group-hover:scale-105 transition-transform duration-300">
                    <KodiCharacter emotion={kodiCompanion.emotion} size={96} />
                  </div>
                </div>
              </div>
            }
          />

          {/* ── 2. FILTER TABS & SEARCH BAR ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'daily' as QuestPageTab, label: `Misi Harian ⚡ (${filteredDaily.length})` },
                {
                  id: 'boss' as QuestPageTab,
                  label: `Tantangan 🏆 (${milestoneChallenges.length})`,
                },
                { id: 'shop' as QuestPageTab, label: `Pasar Guild 💎` },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap')
                      setActiveTab(tab.id)
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border-b-[4px] ${
                      isActive
                        ? 'bg-[#2563EB] text-white border-b-blue-800 shadow-xs translate-y-0.5'
                        : 'bg-white text-slate-700 border-2 border-slate-200 border-b-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <div className="relative w-full sm:w-56">
                <MagnifyingGlass
                  weight="bold"
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari misi, kuis..."
                  className="w-full bg-white text-xs font-semibold pl-9 pr-7 py-2 rounded-2xl border-2 border-slate-200 focus:border-[#2563EB] focus:outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Hapus pencarian"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    <X weight="bold" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setActiveTab('shop')
                }}
                className="bg-blue-50 hover:bg-blue-100/80 active:translate-y-0.5 border-2 border-blue-200 border-b-[3px] border-b-blue-300 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
                title="Buka Pasar Hadiah Guild"
              >
                <span className="text-sm">💎</span>
                <span className="text-xs font-black text-[#1D4ED8]">{userGems}</span>
              </button>
            </div>
          </div>

          {/* ── EMPTY STATE SEARCH FEEDBACK ── */}
          {hasNoResults && (
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border-2 border-amber-200 text-2xl flex items-center justify-center mx-auto shadow-2xs">
                🔍
              </div>
              <h3 className="font-black text-base text-[#0F172A]">
                Tidak Ada Misi Ditemukan
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Kata kunci &ldquo;{searchQuery}&rdquo; tidak cocok dengan misi harian atau tantangan bahasa.
              </p>
              <Button3D
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="text-xs px-4 py-2"
              >
                Reset Pencarian
              </Button3D>
            </div>
          )}

          {/* ══════ SECTION 1: 3-TIER MILESTONE CHESTS & DAILY QUESTS ══════ */}
          {activeTab === 'daily' && (
            <DailyQuestsSection
              quests={filteredDaily}
              dailyDoneCount={dailyDoneCount}
              totalDailyTarget={totalDailyTarget}
              isLoading={isLoading}
              hasSearchNoResults={hasNoResults}
              claimedDailyChests={claimedDailyChests}
              onOpenChest={handleOpenChest}
              onClaimQuest={handleClaimDailyQuest}
              claimingQuestId={claimingQuestId}
              onStartQuest={(route) => navigate(route)}
              onContinueCurriculum={() => {
                triggerHaptic('tap')
                navigate('/curriculum')
              }}
            />
          )}

          {/* ══════ SECTION 2: MILESTONE CHALLENGES ══════ */}
          {activeTab === 'boss' && (
            <MilestoneChallengesSection
              challenges={milestoneChallenges}
              hasSearchNoResults={hasNoResults}
              onStartChallenge={(route) => navigate(route)}
              onContinueCurriculum={() => {
                triggerHaptic('tap')
                navigate('/curriculum')
              }}
            />
          )}

          {/* ══════ SECTION 3: REWARD SHOP ══════ */}
          {activeTab === 'shop' && (
            <AkihabaraShopSection
              shopItems={shopItems}
              userGems={userGems}
              inventory={inventory}
              isPurchasingItemId={isPurchasingItemId}
              onOpenCVModal={() => {
                triggerHaptic('tap')
                setIsCVModalOpen(true)
              }}
              onOpenMockModal={() => {
                triggerHaptic('tap')
                setIsMockModalOpen(true)
              }}
              onPurchaseItem={(item) => void handlePurchaseShopItem(item)}
            />
          )}

          {/* Quick link banner back to curriculum */}
          <div className="p-4 bg-slate-100/80 border-2 border-slate-200 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Ingin melanjutkan modul kurikulum utama?</span>
            <button
              type="button"
              onClick={() => navigate('/curriculum')}
              className="text-[#2563EB] hover:underline flex items-center gap-1 font-black cursor-pointer"
            >
              <span>Buka Silabus Kurikulum</span>
              <ArrowRight weight="bold" className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>
      </div>

      {/* ── MODALS ── */}
      <TrackSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={(langId) => void handleSelectTrack(langId)}
        trackProgressMap={EMPTY_PROGRESS_MAP}
      />

      {selectedChestForModal && (
        <ChestRewardModal
          isOpen={isChestModalOpen}
          onClose={() => setIsChestModalOpen(false)}
          tier={selectedChestForModal.tier}
          title={selectedChestForModal.label}
          gemReward={selectedChestForModal.gemReward}
          xpReward={selectedChestForModal.xpReward}
          icon={selectedChestForModal.icon}
          isClaimed={!!claimedDailyChests[selectedChestForModal.tier]}
          onClaim={() => void handleConfirmClaimChest()}
        />
      )}

      <MonthlyBadgeModal
        isOpen={isMonthlyBadgeModalOpen}
        onClose={() => setIsMonthlyBadgeModalOpen(false)}
        monthYearName={currentMonthYearName}
        completedCount={monthlyCompletedCount}
        targetCount={monthlyTargetCount}
        isClaimed={isMonthlyBadgeClaimed}
        onClaim={() => setIsMonthlyBadgeModalOpen(false)}
      />

      <CVReviewSubmissionModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        onSubmitted={handleCVSubmitted}
      />

      <MockInterviewScheduleModal
        isOpen={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
        onScheduled={handleMockScheduled}
      />
    </div>
  )
}
