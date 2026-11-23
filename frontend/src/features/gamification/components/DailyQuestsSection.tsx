import { useMemo } from 'react'
import {
  Lightning,
  Sparkle,
  Check,
  Clock,
  Play,
} from '@phosphor-icons/react'
import { Button3D } from "@/shared/components/ui/Button3D"
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"
import { GemIcon, XpBoltIcon } from "@/shared/components/ui/GamificationIcons"
import { CountdownBadge } from "@/features/gamification/components/CountdownBadge"
import { DailyQuestIconBadge } from "@/features/gamification/components/DailyQuestIconBadge"
import { QuestChestIllustration } from "@/features/gamification/components/QuestChestIllustration"
import {
  DAILY_CHEST_TIERS,
  type DailyChestItem,
  type DailyQuestViewItem,
} from "@/features/gamification/constants/gamificationCatalog"

export interface DailyQuestsSectionProps {
  quests: DailyQuestViewItem[]
  dailyDoneCount: number
  totalDailyTarget: number
  isLoading: boolean
  claimedDailyChests: Record<number, boolean>
  onOpenChest: (chest: DailyChestItem) => void
  onStartQuest: (route: string) => void
  onClaimQuest?: (questId: string) => void
  claimingQuestId?: string | null
  onContinueCurriculum: () => void
}

export const DailyQuestsSection = ({
  quests,
  dailyDoneCount,
  totalDailyTarget,
  isLoading,
  claimedDailyChests,
  onOpenChest,
  onStartQuest,
  onClaimQuest,
  claimingQuestId,
  onContinueCurriculum,
}: DailyQuestsSectionProps) => {
  const dailyChests: DailyChestItem[] = useMemo(
    () =>
      DAILY_CHEST_TIERS.map((tierConfig) => ({
        ...tierConfig,
        unlocked: dailyDoneCount >= tierConfig.tier,
      })),
    [dailyDoneCount]
  )

  const chestTargetDenominator = totalDailyTarget > 0 ? totalDailyTarget : 3
  const milestoneTrackPercent = Math.min(
    100,
    Math.round((dailyDoneCount / chestTargetDenominator) * 100)
  )
  const nextLockedChest = dailyChests.find((chest) => !chest.unlocked)

  if (quests.length === 0 && !isLoading) {
    return (
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-2xs">
        <div className="flex items-center justify-center mx-auto">
          <KodiCharacter emotion="celebrate" size={108} interactive />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="font-brand font-black text-base sm:text-lg text-slate-900">
            Semua Misi Harian Selesai!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Kerja luar biasa! Kamu telah menuntaskan target harianmu. Misi baru akan diperbarui secara otomatis besok pukul 00:00 WIB.
          </p>
        </div>
        <Button3D
          variant="blue"
          size="md"
          onClick={onContinueCurriculum}
          className="text-xs sm:text-sm px-6 py-3 mx-auto"
        >
          <span className="inline-flex items-center gap-1.5">
            <span>Lanjutkan Belajar di Kurikulum</span>
            <Play weight="fill" className="w-3.5 h-3.5" />
          </span>
        </Button3D>
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xs">
      {/* Header with Unified 3D Icon & Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_3px_0_0_#B45309] text-white flex items-center justify-center shrink-0">
            <Lightning weight="fill" className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-brand font-black text-base sm:text-lg text-[#0F172A]">
                Misi Harian ({dailyDoneCount}/{chestTargetDenominator} Selesai)
              </h2>
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Selesaikan misi harian untuk membuka Peti Emas &amp; menjaga streak harian.
            </p>
          </div>
        </div>

        <CountdownBadge />
      </div>

      {/* Connected 3-Tier Progress Milestone Track */}
      <div className="bg-gradient-to-br from-amber-50/75 via-amber-50/40 to-orange-50/40 border-2 border-amber-200/90 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs font-brand font-black flex-wrap">
          <span className="text-amber-950 flex items-center gap-1.5">
            <Sparkle weight="fill" className="w-4 h-4 text-amber-500" />
            <span>
              Peti Hadiah Harian: {dailyDoneCount} dari {chestTargetDenominator} Misi
            </span>
          </span>
          <span className="text-amber-700 font-bold">
            {nextLockedChest
              ? `${nextLockedChest.tier - dailyDoneCount} misi lagi → ${nextLockedChest.label}`
              : 'Semua Peti Terbuka!'}
          </span>
        </div>

        {/* Continuous Progress Rail Across 3 Chest Tiers */}
        <div className="space-y-1.5">
          <div className="h-2.5 w-full rounded-full bg-white/95 border border-amber-200 p-0.5 shadow-inner overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-all duration-500 shadow-[0_1px_0_0_#D97706]"
              style={{ width: `${milestoneTrackPercent}%` }}
            />
          </div>
        </div>

        {/* Progressive 3-Chest Custom SVG Milestone Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {dailyChests.map((chest) => {
            const isClaimed = !!claimedDailyChests[chest.tier]
            const chestState: 'locked' | 'ready' | 'claimed' = isClaimed
              ? 'claimed'
              : chest.unlocked
                ? 'ready'
                : 'locked'

            return (
              <button
                key={chest.tier}
                type="button"
                onClick={() => onOpenChest(chest)}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer group ${
                  isClaimed
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 border-b-[3px] border-b-emerald-400'
                    : chest.unlocked
                      ? 'bg-gradient-to-br from-amber-100/90 to-yellow-50 border-amber-400 text-amber-950 border-b-[4px] border-b-amber-500 ring-2 ring-amber-300/70 shadow-xs hover:-translate-y-0.5'
                      : 'bg-white border-slate-200/90 text-slate-600 hover:border-amber-300/80 active:translate-y-0.5'
                }`}
              >
                <div className="shrink-0 group-hover:scale-105 transition-transform">
                  <QuestChestIllustration tier={chest.tier} state={chestState} size={46} />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-black uppercase tracking-wide truncate">
                      {chest.label}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded shrink-0 ${
                        isClaimed
                          ? 'bg-emerald-200/70 text-emerald-900'
                          : chest.unlocked
                            ? 'bg-amber-300/70 text-amber-950'
                            : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {chest.tier} Misi
                    </span>
                  </div>

                  {isClaimed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700">
                      <Check weight="bold" className="w-3 h-3" />
                      <span>DIKLAIM</span>
                    </span>
                  ) : chest.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800">
                      <Sparkle weight="fill" className="w-3 h-3 text-amber-600" />
                      <span>SIAP KLAIM</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 text-[11px] font-brand font-black text-slate-600">
                      <span className="inline-flex items-center gap-0.5 text-sky-700">
                        <GemIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>+{chest.gemReward}</span>
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-amber-700">
                        <XpBoltIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>+{chest.xpReward} XP</span>
                      </span>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3 Daily Quests Chunky Cards Feed */}
      <div className="space-y-3.5 pt-0.5">
        {quests.map((questItem) => {
          const isDone = questItem.isCompleted
          const isInProgress = !isDone && questItem.progressPercent > 0

          return (
            <div
              key={questItem.id}
              className={`group border-2 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 shadow-2xs ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200/90 border-b-[3px] border-b-emerald-300'
                  : isInProgress
                    ? 'bg-blue-50/20 border-blue-200/90 border-b-[4px] border-b-blue-300 hover:border-b-[5px] hover:-translate-y-0.5'
                    : 'bg-white border-slate-200/90 border-b-[4px] border-b-slate-300 hover:border-b-[5px] hover:-translate-y-0.5'
              }`}
            >
              {/* Left: Unified 3D Icon & Info */}
              <div className="flex items-center gap-4 min-w-0">
                <DailyQuestIconBadge
                  iconName={questItem.iconName}
                  size="md"
                  isCompleted={isDone}
                  showCompletedCheck
                />

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-black text-[10px] px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${
                        isDone
                          ? 'bg-emerald-100 border-emerald-200 text-emerald-900'
                          : 'bg-blue-50 border-blue-200 text-[#1D4ED8]'
                      }`}
                    >
                      {questItem.chip_label}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                      <Clock weight="bold" className="w-3 h-3 text-slate-400" />
                      <span>~{questItem.estimated_minutes} mnt</span>
                    </span>

                    {isDone && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-flex items-center gap-1">
                        <Check weight="bold" className="w-3 h-3 text-emerald-600" />
                        <span>TERCAPAI</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-sm sm:text-base text-[#0F172A] truncate">
                    {questItem.title}
                  </h3>

                  {/* Progress Line & Vector XP Reward Pill */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="w-28 sm:w-40 h-2 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isDone ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${questItem.progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 font-mono">
                      {questItem.progressText}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-brand font-black text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                      <XpBoltIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>+{questItem.xp_reward} XP</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Tactile Action Button */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {questItem.isClaimed ? (
                  <Button3D
                    variant="ghost"
                    size="sm"
                    disabled
                    className="text-xs px-4 py-2 border-2 border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default"
                  >
                    <span className="inline-flex items-center gap-1">
                      <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SELESAI</span>
                    </span>
                  </Button3D>
                ) : isDone && onClaimQuest ? (
                  <Button3D
                    variant="amber"
                    size="sm"
                    loading={claimingQuestId === questItem.id}
                    onClick={() => onClaimQuest(questItem.id)}
                    className="text-xs px-4 py-2"
                  >
                    <span className="inline-flex items-center gap-1">
                      <span>KLAIM +{questItem.xp_reward} XP</span>
                      <XpBoltIcon className="w-3.5 h-3.5 shrink-0" />
                    </span>
                  </Button3D>
                ) : (
                  <Button3D
                    variant="blue"
                    size="sm"
                    onClick={() => onStartQuest(questItem.route)}
                    className="text-xs px-4 py-2"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span>MULAI</span>
                      <Play weight="fill" className="w-3 h-3" />
                    </span>
                  </Button3D>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
