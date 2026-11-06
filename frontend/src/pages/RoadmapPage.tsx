import { AppLeftSidebar } from '../components/layout/left-sidebar/AppLeftSidebar'
import { AppTopBar } from '../components/layout/top-bar/AppTopBar'
import { AppRightSidebar } from '../components/layout/right-sidebar/AppRightSidebar'
import { useRoadmapPage } from '../hooks/roadmap/useRoadmapPage'
import { RoadmapUnitCard } from '../components/roadmap/RoadmapUnitCard'
import { RoadmapTrackSwitcherModal } from '../components/roadmap/RoadmapTrackSwitcherModal'
import { LeaderboardModal } from '../components/leaderboard/LeaderboardModal'
import { LockSimple } from '@phosphor-icons/react'

export const RoadmapPage = () => {
  const {
    currentTrack,
    units,
    totalPartsCount,
    completedPartsCount,
    overallProgress,
    trackProgressMap,
    isLoading,
    error,
    refetch,
    isTrackSwitcherOpen,
    setIsTrackSwitcherOpen,
    handleCloseTrackSwitcher,
    isLeaderboardOpen,
    setIsLeaderboardOpen,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    isUnitCollapsed,
    toggleUnitCollapse,
    lockedNotification,
    handleLockedNodeClick,
    handleSelectTrack,
    handleStartQuest,
  } = useRoadmapPage()

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. LEFT NAV RAIL (SSOT) ── */}
      <AppLeftSidebar />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8 xl:pb-0">
        {/* ══════ CENTER CONTENT STAGE ══════ */}
        <main className="flex-1 min-w-0 px-3.5 sm:px-8 py-5 sm:py-6 pb-12 space-y-6">
          {/* ── 1. CLEAN CONTEXTUAL TOP BAR (SSOT - AppTopBar) ── */}
          <AppTopBar
            activeTrack={currentTrack}
            onOpenCourseSwitcher={() => setIsTrackSwitcherOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenMobileSidebar={() => setIsMobileDrawerOpen(true)}
            completedCount={completedPartsCount}
            totalCount={totalPartsCount}
            progressPercent={overallProgress}
            unitLabel="Modul"
          />

          {/* ── 2. DIRECT SEQUENTIAL TECHNICAL UNIT CARDS ── */}
          <div className="space-y-6 pt-1">
            {error && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 text-rose-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">⚠️</span>
                  <span className="text-xs font-semibold">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={refetch}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {isLoading && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs font-semibold animate-pulse">
                Memuat silabus kurikulum spesialisasi...
              </div>
            )}

            {units.map((unit) => (
              <RoadmapUnitCard
                key={unit.id}
                unit={unit}
                isCollapsed={isUnitCollapsed(unit)}
                onToggleCollapse={() => toggleUnitCollapse(unit)}
                onLockedClick={handleLockedNodeClick}
                onStartQuest={handleStartQuest}
              />
            ))}
          </div>
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL ══════ */}
        <AppRightSidebar
          activeTrack={currentTrack}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        />
      </div>

      {/* ── 3. DUOLINGO-STYLE COURSE SWITCHER MODAL ── */}
      <RoadmapTrackSwitcherModal
        isOpen={isTrackSwitcherOpen}
        onClose={handleCloseTrackSwitcher}
        currentTrack={currentTrack}
        onSelectTrack={handleSelectTrack}
        trackProgressMap={trackProgressMap}
      />

      {/* ── 4. TOKYO LEADERBOARD MODAL ── */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* ── 6. MICRO-INTERACTION TOAST NOTIFICATION FOR LOCKED NODES ── */}
      {lockedNotification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <LockSimple weight="bold" className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">{lockedNotification}</span>
        </div>
      )}
    </div>
  )
}
