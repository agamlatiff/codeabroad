import { useMemo } from 'react'
import {
  Lightning,
  Sparkle,
  Check,
  CheckCircle,
} from '@phosphor-icons/react'
import { Button3D } from "@/shared/components/ui/Button3D"
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"
import { CountdownBadge } from "@/features/gamification/components/CountdownBadge"
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
  hasSearchNoResults: boolean
  claimedDailyChests: Record<number, boolean>
  onOpenChest: (chest: DailyChestItem) => void
  onStartQuest: (route: string) => void
  onContinueCurriculum: () => void
}

export const DailyQuestsSection = ({
  quests,
  dailyDoneCount,
  totalDailyTarget,
  isLoading,
  hasSearchNoResults,
  claimedDailyChests,
  onOpenChest,
  onStartQuest,
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

  if (quests.length === 0 && !hasSearchNoResults) {
    return (
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-2xs">
        <div className="flex items-center justify-center mx-auto">
          <KodiCharacter emotion="thinking" size={100} />
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
          Lanjutkan Belajar di Kurikulum ▶
        </Button3D>
      </div>
    )
  }

  if (quests.length === 0) {
    return null
  }

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
      {/* Header with Title & Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border-2 border-amber-200 text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
            <Lightning weight="fill" className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-[#0F172A]">
                Misi Harian ({dailyDoneCount}/{totalDailyTarget} Selesai)
              </h3>
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            <p className="text-xs text-slate-500">
              Selesaikan 3 misi harian untuk membuka Peti Emas Harian &amp; menjaga rentetan streak.
            </p>
          </div>
        </div>

        <CountdownBadge />
      </div>

      {/* 3-Tier Milestone Chests Progress Track */}
      <div className="bg-amber-50/40 border border-amber-200/90 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-brand font-black">
          <span className="text-amber-900 flex items-center gap-1.5">
            <Sparkle weight="fill" className="w-4 h-4 text-amber-600" />
            <span>Peti Hadiah Harian: {dailyDoneCount} dari {totalDailyTarget} Misi Tercapai</span>
          </span>
          <span className="text-amber-700 font-bold">
            {dailyDoneCount >= totalDailyTarget
              ? '🎉 Peti Emas Terbuka!'
              : `${totalDailyTarget - dailyDoneCount} misi lagi untuk Peti Emas`}
          </span>
        </div>

        {/* Progressive 3-Chest Milestones Display (Tactile 3D Buttons) */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {dailyChests.map((chest) => {
            const isClaimed = !!claimedDailyChests[chest.tier]
            return (
              <button
                key={chest.tier}
                type="button"
                onClick={() => onOpenChest(chest)}
                className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  isClaimed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 border-b-[3px] border-b-emerald-400 opacity-90'
                    : chest.unlocked
                    ? 'bg-amber-100/90 border-amber-400 text-amber-950 border-b-[4px] border-b-amber-500 shadow-xs scale-[1.02] ring-2 ring-amber-300 animate-pulse'
                    : 'bg-white border-slate-200/80 text-slate-400 hover:border-slate-300 active:translate-y-0.5'
                }`}
              >
                <span className="text-xl shrink-0">{chest.icon}</span>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider block truncate">
                    {chest.label}
                  </span>
                  <span
                    className={`text-xs font-black block truncate ${
                      isClaimed
                        ? 'text-emerald-700'
                        : chest.unlocked
                        ? 'text-amber-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {isClaimed ? (
                      <span className="inline-flex items-center gap-0.5">
                        <Check weight="bold" className="w-2.5 h-2.5 text-emerald-600" />
                        <span>DIKLAIM</span>
                      </span>
                    ) : chest.unlocked ? (
                      'KLAIM ✨'
                    ) : (
                      chest.reward
                    )}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3 Daily Quests Chunky Cards Feed */}
      <div className="space-y-3.5 pt-1">
        {quests.map((questItem, idx) => {
          const isDone = questItem.isCompleted
          const QuestIcon = questItem.icon

          return (
            <div
              key={questItem.id}
              className={`border-2 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 shadow-2xs ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200/90 border-b-[3px] border-b-emerald-300'
                  : 'bg-white border-2 border-slate-200/90 border-b-[4px] border-b-slate-300 hover:border-b-[5px] hover:-translate-y-0.5'
              }`}
            >
              {/* Left: Icon & Info */}
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-13 h-13 rounded-2xl border-2 flex items-center justify-center shrink-0 shadow-2xs ${
                    isDone
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                      : 'bg-blue-50 border-blue-200 text-[#2563EB]'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle weight="fill" className="w-7 h-7 text-emerald-600" />
                  ) : (
                    <QuestIcon weight="bold" className="w-6 h-6" />
                  )}
                </div>

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
                    <span className="text-[11px] font-semibold text-slate-400">
                      • Target #{idx + 1}
                    </span>
                    {isDone && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-flex items-center gap-1">
                        <Check weight="bold" className="w-3 h-3 text-emerald-600" />
                        <span>TERCAPAI</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-black text-sm sm:text-base text-[#0F172A] truncate">
                    {questItem.title}
                  </h4>

                  {/* Progress Line */}
                  <div className="flex items-center gap-3 flex-wrap">
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
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-amber-600">
                      ⚡ +{questItem.xp_reward} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Tactile Action Button */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {isDone ? (
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
                ) : (
                  <Button3D
                    variant="blue"
                    size="sm"
                    onClick={() => onStartQuest(questItem.route)}
                    className="text-xs px-4 py-2"
                  >
                    MULAI ▶
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
