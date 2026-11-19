import {
  CheckCircle,
  Lightning,
  Target,
  Fire,
  Star,
  Medal,
  ArrowRight,
  ArrowCounterClockwise,
  MapTrifold,
} from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { useLessonCompletePage } from '@/features/exercise/hooks/useLessonCompletePage'
import { computeXpLevelProgress } from '@/shared/utils/progression'

function getAccuracyPredicate(accuracyPercent: number): string {
  if (accuracyPercent >= 95) return 'Sempurna!'
  if (accuracyPercent >= 80) return 'Hebat!'
  return 'Bagus!'
}

/**
 * Celebration screen shown right after completing a lesson session.
 * Sized to fit comfortably inside a single desktop/laptop viewport without clipping CTAs.
 */
export const QuestCompletePage = () => {
  const {
    isLoading,
    lessonTitle,
    xpEarned,
    totalXp,
    streakDays,
    currentLevel,
    accuracyPercent,
    unlockedNextLessonId,
    awardedBadges,
    handleNextLesson,
    handleReplayLesson,
    handleBackToCurriculum,
  } = useLessonCompletePage()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const xpProgress = computeXpLevelProgress(totalXp, currentLevel)
  const predicate = getAccuracyPredicate(accuracyPercent)

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex items-center justify-center p-4 sm:p-6 selection:bg-blue-600/20">
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-7 max-w-2xl w-full text-center space-y-4 sm:space-y-5 shadow-[0_6px_0_0_#E2E8F0] animate-pop">
        {/* Hero Mascot + Soft Celebration Halo */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-amber-200/55 via-sky-200/50 to-emerald-200/55 blur-md"
            />
            <div className="relative">
              <KodiCharacter emotion="celebrate" size={92} />
            </div>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-brand font-black text-[11px] uppercase tracking-wider">
              <CheckCircle weight="fill" className="w-3.5 h-3.5" />
              <span>Pelajaran Selesai</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-brand font-black text-[11px]">
              <span>Akurasi {predicate}</span>
            </span>
          </div>

          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl font-brand font-black text-slate-900 tracking-tight">
              Luar Biasa!
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-600">{lessonTitle}</p>
          </div>
        </div>

        {/* 3D Tactile Session Stat Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/75 px-3 py-3 shadow-[0_3px_0_0_#FDE68A] space-y-0.5">
            <div className="flex justify-center text-amber-500">
              <Lightning weight="fill" className="w-5 h-5" />
            </div>
            <p className="text-base sm:text-lg font-brand font-black text-amber-800">
              +{xpEarned} XP
            </p>
            <p className="text-[11px] font-bold text-amber-700/80">Sesi Ini</p>
          </div>

          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/75 px-3 py-3 shadow-[0_3px_0_0_#A7F3D0] space-y-0.5">
            <div className="flex justify-center text-emerald-600">
              <Target weight="fill" className="w-5 h-5" />
            </div>
            <p className="text-base sm:text-lg font-brand font-black text-emerald-800">
              {accuracyPercent}%
            </p>
            <p className="text-[11px] font-bold text-emerald-700/80">Akurasi</p>
          </div>

          <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/75 px-3 py-3 shadow-[0_3px_0_0_#FED7AA] space-y-0.5">
            <div className="flex justify-center text-orange-500">
              <Fire weight="fill" className="w-5 h-5" />
            </div>
            <p className="text-base sm:text-lg font-brand font-black text-orange-800">
              {streakDays} Hari
            </p>
            <p className="text-[11px] font-bold text-orange-700/80">Streak</p>
          </div>
        </div>

        {/* Visual XP Level Progress Bar */}
        <div className="bg-slate-50/90 border-2 border-slate-200/90 rounded-2xl p-3.5 sm:p-4 text-left space-y-2 shadow-[0_3px_0_0_#E2E8F0]">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 font-brand font-black text-sm text-slate-900">
              <Star weight="fill" className="w-4 h-4 text-blue-600" />
              <span>Level {xpProgress.level}</span>
            </div>
            <span className="text-xs font-brand font-bold text-slate-600">
              {xpProgress.xpInLevel} / {xpProgress.xpForNextLevel} XP • Total{' '}
              {totalXp.toLocaleString()} XP
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-slate-200/80 overflow-hidden border border-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${Math.max(4, xpProgress.progressPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>
              Butuh <strong className="text-slate-700">{xpProgress.xpRemaining} XP</strong> lagi ke
              Level {xpProgress.level + 1}
            </span>
            <span>{xpProgress.progressPercent}%</span>
          </div>
        </div>

        {/* Newly Unlocked Badges (3D Tactile Card) */}
        {awardedBadges.length > 0 && (
          <div className="space-y-2 text-left">
            <p className="text-[11px] font-brand font-black uppercase tracking-wider text-slate-500 px-0.5">
              Lencana Baru Terbuka
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {awardedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-blue-50/75 border-2 border-blue-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-[0_3px_0_0_#BFDBFE]"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                    <Medal weight="fill" className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <p className="font-brand font-black text-xs sm:text-sm text-slate-900 truncate">
                        {badge.title}
                      </p>
                      {badge.xp_reward > 0 && (
                        <span className="shrink-0 text-[10px] font-brand font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          +{badge.xp_reward} XP
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action CTAs — Compact Layout Fitting Single Viewport */}
        <div className="space-y-2.5 pt-1">
          {unlockedNextLessonId ? (
            <Button3D
              variant="emerald"
              size="lg"
              fullWidth
              icon={<ArrowRight weight="bold" className="w-5 h-5" />}
              onClick={handleNextLesson}
            >
              LANJUT PELAJARAN BERIKUTNYA
            </Button3D>
          ) : (
            <Button3D
              variant="emerald"
              size="lg"
              fullWidth
              icon={<MapTrifold weight="bold" className="w-5 h-5" />}
              onClick={handleBackToCurriculum}
            >
              KEMBALI KE PETA KURIKULUM
            </Button3D>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Button3D
              variant="white"
              size="md"
              fullWidth
              icon={<ArrowCounterClockwise weight="bold" className="w-4 h-4" />}
              onClick={handleReplayLesson}
            >
              ULANGI PELAJARAN
            </Button3D>
            <Button3D
              variant="white"
              size="md"
              fullWidth
              icon={<MapTrifold weight="bold" className="w-4 h-4" />}
              onClick={handleBackToCurriculum}
            >
              PETA KURIKULUM
            </Button3D>
          </div>
        </div>
      </div>
    </div>
  )
}
