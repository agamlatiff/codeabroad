import { useLessonCompletePage } from '@/features/exercise/hooks/useLessonCompletePage'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import {
  ArrowCounterClockwise,
  ArrowRight,
  CheckCircle,
  Fire,
  Lightning,
  Medal,
  Star,
} from '@phosphor-icons/react'

/**
 * Lesson completion celebration screen (/learn/:id/complete).
 */
export const QuestCompletePage = () => {
  const {
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

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg rounded-3xl bg-white border-2 border-slate-200 shadow-lg p-6 sm:p-8 space-y-6 text-center">
        {/* Celebration Mascot & Header */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <KodiCharacter emotion="celebrate" size="lg" interactive={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <CheckCircle weight="fill" className="w-4 h-4" />
            Pelajaran Selesai
          </div>
          <h1 className="text-2xl sm:text-3xl font-brand font-extrabold text-slate-900">
            Luar Biasa!
          </h1>
          <p className="text-sm font-semibold text-slate-500">{lessonTitle}</p>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-1">
            <Lightning
              weight="fill"
              className="w-6 h-6 text-amber-500 mx-auto"
            />
            <p className="text-lg font-brand font-black text-amber-800">
              +{xpEarned} XP
            </p>
            <p className="text-[11px] font-bold text-amber-700">Sesi Ini</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-1">
            <CheckCircle
              weight="fill"
              className="w-6 h-6 text-emerald-600 mx-auto"
            />
            <p className="text-lg font-brand font-black text-emerald-800">
              {accuracyPercent}%
            </p>
            <p className="text-[11px] font-bold text-emerald-700">Akurasi</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-orange-50 border-2 border-orange-200 space-y-1">
            <Fire weight="fill" className="w-6 h-6 text-orange-500 mx-auto" />
            <p className="text-lg font-brand font-black text-orange-800">
              {streakDays} Hari
            </p>
            <p className="text-[11px] font-bold text-orange-700">Streak</p>
          </div>
        </div>

        {/* Updated Cumulative Level & XP Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <Star weight="fill" className="w-5 h-5 text-blue-600" />
            <span>Level {currentLevel}</span>
          </div>
          <span className="font-mono font-extrabold text-slate-900">
            Total {totalXp.toLocaleString()} XP
          </span>
        </div>

        {/* Newly Unlocked Badges */}
        {awardedBadges.length > 0 && (
          <div className="space-y-2 text-left">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Lencana Baru Terbuka
            </p>
            <div className="space-y-2">
              {awardedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3"
                >
                  <Medal
                    weight="fill"
                    className="w-7 h-7 text-blue-600 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-slate-900 truncate">
                      {badge.title}
                    </p>
                    <p className="text-xs text-slate-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action CTAs */}
        <div className="space-y-3 pt-2">
          <Button3D
            type="button"
            variant="emerald"
            size="lg"
            fullWidth
            onClick={handleNextLesson}
            icon={<ArrowRight weight="bold" className="w-5 h-5" />}
          >
            {unlockedNextLessonId
              ? 'Lanjut Pelajaran Berikutnya'
              : 'Kembali ke Kurikulum'}
          </Button3D>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button3D
              type="button"
              variant="white"
              size="md"
              fullWidth
              onClick={handleReplayLesson}
              icon={<ArrowCounterClockwise weight="bold" className="w-4 h-4" />}
            >
              Ulangi Latihan
            </Button3D>

            {unlockedNextLessonId && (
              <Button3D
                type="button"
                variant="white"
                size="md"
                fullWidth
                onClick={handleBackToCurriculum}
              >
                Lihat Kurikulum
              </Button3D>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
