import { useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLeftSidebar } from "@/shared/components/layout/left-sidebar/AppLeftSidebar"
import { AppTopBar } from "@/shared/components/layout/top-bar/AppTopBar"
import { TrackSwitcherModal } from "@/shared/components/layout/top-bar/TrackSwitcherModal"
import { ChestRewardModal } from "@/features/gamification/components/ChestRewardModal"
import { MonthlyBadgeModal } from "@/features/gamification/components/MonthlyBadgeModal"
import { MonthlyBadgeEmblem } from "@/features/gamification/components/MonthlyBadgeEmblem"
import { CVReviewSubmissionModal } from "@/features/gamification/components/CVReviewSubmissionModal"
import { MockInterviewScheduleModal } from "@/features/gamification/components/MockInterviewScheduleModal"
import { DailyQuestsSection } from "@/features/gamification/components/DailyQuestsSection"
import { MilestonesAndBadgesSection } from "@/features/gamification/components/MilestonesAndBadgesSection"
import { AkihabaraShopSection } from "@/features/gamification/components/AkihabaraShopSection"
import { useQuests } from "@/features/gamification/hooks/useQuests"
import type { QuestPageTab } from "@/features/gamification/constants/gamificationCatalog"
import { Button3D } from "@/shared/components/ui/Button3D"
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"
import { triggerHaptic } from "@/shared/utils/haptics"
import {
  Sparkle,
  Clock,
  X,
  Medal,
  CheckCircle,
  ArrowRight,
  Lightning,
  Trophy,
  Storefront,
  Snowflake,
  Backpack,
} from '@phosphor-icons/react'

export type { QuestPageTab }

const QUEST_TAB_LABELS: Record<QuestPageTab, string> = {
  daily: 'Misi Harian',
  milestones: 'Ujian & Lencana',
  shop: 'Pasar Guild',
}

export const QuestLogPage = () => {
  const navigate = useNavigate()
  const patternId = `monthly-card-seigaiha-${useId().replace(/:/g, '')}`
  const {
    activeTab,
    setActiveTab,
    shopCategory,
    setShopCategory,
    badgeFilter,
    setBadgeFilter,
    activeTrack,
    trackProgressMap,
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
    isActivatingItemId,
    isClaimingMonthlyBadge,
    xpBoosterActive,
    xpBoosterExpiresAt,
    toastMessage,
    setToastMessage,
    floatingReward,
    userGems,
    inventory,
    claimedDailyChests,
    shopItems,
    filteredShopItems,
    dailyQuests,
    levelExamSummary,
    achievementBadges,
    filteredBadges,
    earnedBadgeCount,
    dailyDoneCount,
    totalDailyTarget,
    dailyProgressPercent,
    currentMonthYearName,
    currentMonthShort,
    daysLeftInMonth,
    monthlyCompletedCount,
    monthlyTargetCount,
    monthlyProgressPercent,
    isMonthlyBadgeClaimed,
    displayedKodiEmotion,
    displayedKodiSpeech,
    handleCycleKodiTip,
    isLoading,
    isMilestonesLoading,
    claimingQuestId,
    handleClaimDailyQuest,
    handleSelectTrack,
    handleOpenChest,
    handleConfirmClaimChest,
    handlePurchaseShopItem,
    handleActivateShopItem,
    handleClaimMonthlyBadge,
    handleCVSubmitted,
    handleMockScheduled,
  } = useQuests()

  const streakFreezeOwned = inventory['streak-freeze'] || 0
  const isMonthlyUnlocked = isMonthlyBadgeClaimed || monthlyCompletedCount >= monthlyTargetCount
  const tabTargetDenominator = totalDailyTarget > 0 ? totalDailyTarget : 3

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. LEFT NAV RAIL (SSOT) ── */}
      <AppLeftSidebar />

      {/* ── 2. TWO-COLUMN GAMIFICATION STAGE (OPSI A) ── */}
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-12">
        <main className="flex-1 min-w-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
          {/* ── TOP HUD BAR + BREADCRUMB (SSOT SYNCED TO DAILY PROGRESS) ── */}
          <AppTopBar
            activeTrack={activeTrack}
            onOpenCourseSwitcher={() => setIsCourseSwitcherOpen(true)}
            completedCount={dailyDoneCount}
            totalCount={totalDailyTarget}
            progressPercent={dailyProgressPercent}
            unitLabel="Misi Hari Ini"
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

          {/* ── DESKTOP 2-COLUMN BOARD: LEFT = QUESTS / SHOP, RIGHT = MONTHLY BADGE + KODI + INVENTORY ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT MAIN COLUMN (Tab Bar + Primary Content Above the Fold) */}
            <div className="lg:col-span-8 space-y-4 min-w-0">
              {/* Clean Phosphor Tab Row + Optional Active Freeze Status Chip */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    {
                      id: 'daily' as QuestPageTab,
                      label: 'Misi Harian',
                      badge: `${dailyDoneCount}/${tabTargetDenominator}`,
                      Icon: Lightning,
                    },
                    {
                      id: 'milestones' as QuestPageTab,
                      label: 'Ujian & Lencana',
                      badge: `${earnedBadgeCount}/${achievementBadges.length || 7}`,
                      Icon: Trophy,
                    },
                    {
                      id: 'shop' as QuestPageTab,
                      label: 'Pasar Guild',
                      badge: `${shopItems.length}`,
                      Icon: Storefront,
                    },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id
                    const TabIcon = tab.Icon
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic('tap')
                          setActiveTab(tab.id)
                        }}
                        className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border-b-[4px] inline-flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#2563EB] text-white border-b-blue-800 shadow-xs translate-y-0.5'
                            : 'bg-white text-slate-700 border-2 border-slate-200 border-b-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <TabIcon weight="fill" className="w-3.5 h-3.5 shrink-0" />
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {streakFreezeOwned > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap')
                      setActiveTab('shop')
                    }}
                    className="hidden sm:inline-flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100/80 border-2 border-sky-200 text-sky-800 rounded-2xl px-3 py-1.5 text-[11px] font-black shadow-2xs transition-colors cursor-pointer shrink-0"
                    title="Streak Freeze aktif melindungi rentetan belajarmu"
                  >
                    <Snowflake weight="fill" className="w-3.5 h-3.5 text-sky-500" />
                    <span>{streakFreezeOwned}x Freeze Siap</span>
                  </button>
                )}
              </div>

              {/* Active Tab Panel */}
              {activeTab === 'daily' && (
                <DailyQuestsSection
                  quests={dailyQuests}
                  dailyDoneCount={dailyDoneCount}
                  totalDailyTarget={totalDailyTarget}
                  isLoading={isLoading}
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

              {activeTab === 'milestones' && (
                <MilestonesAndBadgesSection
                  examSummary={levelExamSummary}
                  badges={filteredBadges}
                  totalBadgeCount={achievementBadges.length}
                  earnedBadgeCount={earnedBadgeCount}
                  badgeFilter={badgeFilter}
                  onChangeBadgeFilter={setBadgeFilter}
                  isLoading={isMilestonesLoading}
                  onNavigate={(route) => navigate(route)}
                  onSwitchToDaily={() => setActiveTab('daily')}
                  onOpenTrackSwitcher={() => setIsCourseSwitcherOpen(true)}
                />
              )}

              {activeTab === 'shop' && (
                <AkihabaraShopSection
                  shopItems={filteredShopItems}
                  shopCategory={shopCategory}
                  onChangeCategory={setShopCategory}
                  userGems={userGems}
                  inventory={inventory}
                  isPurchasingItemId={isPurchasingItemId}
                  xpBoosterActive={xpBoosterActive}
                  xpBoosterExpiresAt={xpBoosterExpiresAt}
                  isActivatingItemId={isActivatingItemId}
                  onActivateItem={(itemId) => void handleActivateShopItem(itemId)}
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
            </div>

            {/* RIGHT STICKY COLUMN (Monthly Badge Collectible Card + Kodi + Quick Inventory) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-6 space-y-4">
              {/* ── 1. COLLECTIBLE MONTHLY BADGE + KODI COMPANION CARD ── */}
              <section className="relative rounded-3xl border-2 border-amber-200/90 bg-gradient-to-br from-amber-50/85 via-white to-orange-50/45 shadow-[0_4px_0_0_#E2E8F0] overflow-hidden">
                {/* Golden Top Accent Strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

                {/* Subtle Japanese Seigaiha / Dot-Grid Pattern */}
                <svg
                  className="absolute inset-0 w-full h-full text-amber-800 opacity-[0.06] pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern id={patternId} width="44" height="22" patternUnits="userSpaceOnUse">
                      <path
                        d="M0 22A11 11 0 0 1 22 22M22 22A11 11 0 0 1 44 22M11 11A11 11 0 0 1 33 11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#${patternId})`} />
                </svg>

                <div className="relative z-10 p-5 space-y-4">
                  {/* Centerpiece Monthly Medallion & Info */}
                  <div className="flex items-center gap-3.5">
                    <div className="shrink-0 drop-shadow-xs">
                      <MonthlyBadgeEmblem
                        monthShort={currentMonthShort}
                        progressPercent={monthlyProgressPercent}
                        isUnlocked={isMonthlyUnlocked}
                        size={82}
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                          Lencana Bulanan
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100/80 border border-amber-200/90 text-[10px] font-brand font-black text-amber-800 whitespace-nowrap">
                          <Clock weight="bold" className="w-3 h-3 text-amber-600" />
                          <span>Sisa {daysLeftInMonth} Hari</span>
                        </span>
                      </div>
                      <h2 className="font-brand font-black text-base text-slate-900 leading-snug">
                        Lencana Emas ({currentMonthYearName})
                      </h2>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        Tuntaskan 25 misi &amp; pelajaran bulan ini untuk membuka lencana profil.
                      </p>
                    </div>
                  </div>

                  {/* Monthly Progress Bar & Detail Button */}
                  <div className="space-y-2.5 bg-white/80 border border-amber-200/80 rounded-2xl p-3.5">
                    <div className="flex items-center justify-between text-xs font-brand font-black">
                      <span className="text-slate-700 inline-flex items-center gap-1.5">
                        <Medal weight="fill" className="w-4 h-4 text-amber-500" />
                        <span>
                          {monthlyCompletedCount} / {monthlyTargetCount} Misi
                        </span>
                      </span>
                      <span className="text-amber-700 font-bold">
                        {monthlyCompletedCount >= monthlyTargetCount
                          ? 'Terbuka!'
                          : `${monthlyTargetCount - monthlyCompletedCount} lagi`}
                      </span>
                    </div>

                    <div className="h-2.5 bg-amber-100/70 rounded-full border border-amber-200 p-0.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${monthlyProgressPercent}%` }}
                      />
                    </div>

                    <Button3D
                      variant={isMonthlyUnlocked ? 'amber' : 'white'}
                      size="sm"
                      fullWidth
                      onClick={() => {
                        triggerHaptic('tap')
                        setIsMonthlyBadgeModalOpen(true)
                      }}
                      className={`text-xs py-2 ${
                        isMonthlyBadgeClaimed
                          ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300'
                          : 'text-slate-700'
                      }`}
                    >
                      {isMonthlyBadgeClaimed ? (
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600" />
                          <span>LENCANA AKTIF DI PROFIL</span>
                        </span>
                      ) : isMonthlyUnlocked ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Sparkle weight="fill" className="w-4 h-4 text-amber-800" />
                          <span>KLAIM LENCANA (+150 XP)</span>
                          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <Medal weight="bold" className="w-4 h-4 text-amber-600" />
                          <span>LIHAT DETAIL LENCANA</span>
                          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </Button3D>
                  </div>

                  {/* Interactive Kodi Companion Block */}
                  <div className="pt-3 border-t border-amber-200/70 flex flex-col items-center space-y-2.5">
                    <div className="relative w-full bg-white border-2 border-amber-200/90 rounded-2xl px-3.5 py-2.5 text-xs font-brand font-bold text-slate-700 leading-snug text-center shadow-2xs">
                      <span>{displayedKodiSpeech}</span>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-amber-200/90 transform rotate-45" />
                    </div>

                    <button
                      type="button"
                      onClick={handleCycleKodiTip}
                      title="Klik Mera untuk tips belajar"
                      className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-amber-300/25 rounded-full blur-xl group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 drop-shadow-sm transform group-hover:scale-105 active:scale-95 transition-transform">
                          <KodiCharacter emotion={displayedKodiEmotion} size={86} interactive />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800/80 group-hover:text-amber-900 transition-colors">
                        Klik Mera untuk tips belajar
                      </span>
                    </button>
                  </div>
                </div>
              </section>

              {/* ── 2. COMPACT TAS ITEM AKTIF CARD ── */}
              <section className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-brand font-black text-sm text-slate-900 inline-flex items-center gap-2">
                    <Backpack weight="fill" className="w-4 h-4 text-blue-600" />
                    <span>Tas Item Aktif</span>
                  </h3>
                  {activeTab !== 'shop' && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap')
                        setActiveTab('shop')
                      }}
                      className="text-[11px] font-black text-[#2563EB] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Pasar Guild</span>
                      <ArrowRight weight="bold" className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {shopItems.map((item) => {
                    const ItemIcon = item.icon
                    const ownedCount = inventory[item.id] || 0
                    const canTriggerAction =
                      ownedCount > 0 &&
                      (item.id === 'cv-review' ||
                        item.id === 'mock-interview' ||
                        item.id === 'xp-booster')

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic('tap')
                          if (ownedCount > 0 && item.id === 'cv-review') {
                            setIsCVModalOpen(true)
                          } else if (ownedCount > 0 && item.id === 'mock-interview') {
                            setIsMockModalOpen(true)
                          } else if (ownedCount > 0 && item.id === 'xp-booster') {
                            void handleActivateShopItem('xp-booster')
                          } else {
                            setActiveTab('shop')
                          }
                        }}
                        className={`p-2.5 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          ownedCount > 0
                            ? 'bg-blue-50/40 border-blue-200/90 hover:border-blue-300'
                            : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}
                        >
                          <ItemIcon weight="fill" className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-black text-slate-800 block truncate leading-tight">
                            {item.title}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold block ${
                              item.id === 'xp-booster' && xpBoosterActive
                                ? 'text-purple-700'
                                : canTriggerAction
                                  ? 'text-emerald-700'
                                  : ownedCount > 0
                                    ? 'text-blue-700'
                                    : 'text-slate-400'
                            }`}
                          >
                            {item.id === 'xp-booster' && xpBoosterActive
                              ? ownedCount > 0
                                ? `2x XP Aktif · +${ownedCount}x`
                                : '2x XP Aktif'
                              : canTriggerAction
                                ? `${ownedCount}x · ${item.id === 'xp-booster' ? 'Aktifkan' : 'Pakai'}`
                                : ownedCount > 0
                                  ? `${ownedCount}x Dimiliki`
                                  : '0 Dimiliki'}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>

      {/* ── MODALS ── */}
      <TrackSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={(langId) => void handleSelectTrack(langId)}
        trackProgressMap={trackProgressMap}
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
        monthShort={currentMonthShort}
        completedCount={monthlyCompletedCount}
        targetCount={monthlyTargetCount}
        isClaimed={isMonthlyBadgeClaimed}
        isClaiming={isClaimingMonthlyBadge}
        onClaim={() => void handleClaimMonthlyBadge()}
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
