import { Link } from 'react-router-dom'
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
  SpeakerHigh,
  Cards,
  Sparkle,
  UserPlus,
} from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { useLessonCompletePage } from '@/features/exercise/hooks/useLessonCompletePage'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'
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
    isGuestTrial,
    guestPendingTotalXp,
    lessonTitle,
    xpEarned,
    totalXp,
    streakDays,
    currentLevel,
    accuracyPercent,
    unlockedNextLessonId,
    awardedBadges,
    learnedItems,
    speechLocale,
    handleNextLesson,
    handleReplayLesson,
    handleBackToCurriculum,
    handleOpenFlashcards,
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
        {/* Hero Mascot */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center">
            <KodiCharacter emotion="celebrate" size={92} />
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

        {/* Visual XP Level Progress Bar (Auth) OR Save Progress Conversion Card (Guest Trial) */}
        {isGuestTrial ? (
          <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-sky-50/70 to-white p-4 sm:p-5 text-left space-y-3 shadow-[0_4px_0_0_#DBEAFE]">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-brand font-black text-[10px] uppercase tracking-wider">
                  <Sparkle weight="fill" className="w-3 h-3 text-blue-600" />
                  <span>Mode Coba Selesai</span>
                </span>
                <h2 className="text-base sm:text-lg font-brand font-black text-slate-900">
                  Simpan +{guestPendingTotalXp || xpEarned} XP ke Akunmu!
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Latihan pertamamu masih tersimpan sementara di perangkat ini. Daftar gratis dalam 10 detik untuk menyimpan progres, menyalakan Streak, dan membuka seluruh unit lanjutan.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link to="/register?from=trial" className="flex-1">
                <Button3D
                  variant="blue"
                  size="md"
                  fullWidth
                  icon={<UserPlus weight="bold" className="w-4 h-4" />}
                >
                  DAFTAR GRATIS &amp; KLAIM +{guestPendingTotalXp || xpEarned} XP
                </Button3D>
              </Link>
              <Link to="/login?from=trial" className="sm:w-auto">
                <Button3D variant="white" size="md" fullWidth>
                  MASUK AKUN
                </Button3D>
              </Link>
            </div>
          </div>
        ) : (
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
        )}

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

        {/* Learned Characters & Vocabulary Recap */}
        {learnedItems.length > 0 && (
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between gap-2 px-0.5">
              <p className="text-[11px] font-brand font-black uppercase tracking-wider text-slate-500">
                Aksara &amp; Kosakata yang Dikuasai ({learnedItems.length})
              </p>
              <button
                type="button"
                onClick={handleOpenFlashcards}
                className="inline-flex items-center gap-1 text-[11px] font-brand font-black text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                <Cards weight="bold" className="w-3.5 h-3.5" />
                Ulas di Flashcard →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {learnedItems.map((item, idx) => (
                <button
                  key={`${item.symbol}-${idx}`}
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap')
                    audioService.stopSpeech()
                    audioService.speakLanguage(item.speakText, speechLocale)
                  }}
                  aria-label={`Dengarkan ${item.symbol} (${item.reading})`}
                  className="rounded-2xl border-2 border-slate-200/90 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-200 px-3 py-2 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-base font-black text-slate-900 truncate leading-tight">
                      {item.symbol}
                    </p>
                    <p className="text-[10px] font-mono font-bold text-blue-700 truncate">
                      {item.reading}
                    </p>
                    <p className="text-[10px] font-medium text-slate-500 truncate">
                      {item.meaning}
                    </p>
                  </div>
                  <SpeakerHigh
                    weight="fill"
                    className="w-4 h-4 text-blue-500 shrink-0"
                  />
                </button>
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

          {unlockedNextLessonId ? (
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
          ) : (
            <Button3D
              variant="white"
              size="md"
              fullWidth
              icon={<ArrowCounterClockwise weight="bold" className="w-4 h-4" />}
              onClick={handleReplayLesson}
            >
              ULANGI PELAJARAN
            </Button3D>
          )}
        </div>
      </div>
    </div>
  )
}
