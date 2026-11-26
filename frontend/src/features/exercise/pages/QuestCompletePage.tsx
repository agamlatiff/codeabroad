import { useEffect, useState, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import {
  CheckCircle,
  Lightning,
  Target,
  Fire,
  Star,
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
import { AchievementBadgeEmblem } from '@/features/gamification/components/AchievementBadgeEmblem'
import { useLessonCompletePage } from '@/features/exercise/hooks/useLessonCompletePage'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'
import { computeXpLevelProgress } from '@/shared/utils/progression'

function getAccuracyPredicate(accuracyPercent: number): string {
  if (accuracyPercent >= 95) return 'Sempurna!'
  if (accuracyPercent >= 80) return 'Hebat!'
  return 'Bagus!'
}

function getCelebrationHeadline(accuracyPercent: number): string {
  if (accuracyPercent >= 95) return 'Luar Biasa!'
  if (accuracyPercent >= 80) return 'Kerja Hebat!'
  return 'Selesai dengan Baik!'
}

/**
 * Compact active-audio equalizer bars shown only while a vocabulary card is speaking.
 */
const MiniAudioBars: FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const heights = [0.55, 1, 0.7]
  return (
    <span aria-hidden="true" className="inline-flex items-end gap-0.5 h-3.5 shrink-0">
      {heights.map((scale, idx) =>
        reducedMotion ? (
          <span
            key={idx}
            className="w-0.5 h-3 rounded-full bg-[#2563EB]"
            style={{ transform: `scaleY(${scale})`, transformOrigin: 'bottom' }}
          />
        ) : (
          <motion.span
            key={idx}
            className="w-0.5 h-3 rounded-full bg-[#2563EB]"
            style={{ transformOrigin: 'bottom' }}
            animate={{ scaleY: [0.35, scale, 0.45] }}
            transition={{
              duration: 0.48,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: idx * 0.12,
              ease: 'easeInOut',
            }}
          />
        )
      )}
    </span>
  )
}

interface ActionButtonsProps {
  compact?: boolean
  unlockedNextLessonId: string | null
  onNextLesson: () => void
  onReplayLesson: () => void
  onBackToCurriculum: () => void
}

const LessonCompleteActionButtons: FC<ActionButtonsProps> = ({
  compact = false,
  unlockedNextLessonId,
  onNextLesson,
  onReplayLesson,
  onBackToCurriculum,
}) => {
  const primarySize = compact ? 'md' : 'lg'
  const secondarySize = compact ? 'sm' : 'md'
  const replayLabel = compact && unlockedNextLessonId ? 'ULANGI' : 'ULANGI PELAJARAN'

  return (
    <div className={compact ? 'space-y-2' : 'space-y-2.5'}>
      {unlockedNextLessonId ? (
        <Button3D
          variant="emerald"
          size={primarySize}
          fullWidth
          icon={<ArrowRight weight="bold" className={compact ? 'w-4 h-4' : 'w-5 h-5'} />}
          onClick={onNextLesson}
        >
          LANJUT PELAJARAN BERIKUTNYA
        </Button3D>
      ) : (
        <Button3D
          variant="emerald"
          size={primarySize}
          fullWidth
          icon={<MapTrifold weight="bold" className={compact ? 'w-4 h-4' : 'w-5 h-5'} />}
          onClick={onBackToCurriculum}
        >
          KEMBALI KE PETA KURIKULUM
        </Button3D>
      )}

      {unlockedNextLessonId ? (
        <div className={compact ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-2.5'}>
          <Button3D
            variant="white"
            size={secondarySize}
            fullWidth
            icon={<ArrowCounterClockwise weight="bold" className="w-4 h-4" />}
            onClick={onReplayLesson}
          >
            {replayLabel}
          </Button3D>
          <Button3D
            variant="white"
            size={secondarySize}
            fullWidth
            icon={<MapTrifold weight="bold" className="w-4 h-4" />}
            onClick={onBackToCurriculum}
          >
            PETA KURIKULUM
          </Button3D>
        </div>
      ) : (
        <Button3D
          variant="white"
          size={secondarySize}
          fullWidth
          icon={<ArrowCounterClockwise weight="bold" className="w-4 h-4" />}
          onClick={onReplayLesson}
        >
          ULANGI PELAJARAN
        </Button3D>
      )}
    </div>
  )
}

/**
 * Celebration Studio screen shown right after completing a lesson session.
 * Balances a desktop 2-column showcase with a mobile/tablet sticky bottom action dock.
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

  const navigate = useNavigate()
  const shouldReduceMotion = Boolean(useReducedMotion())
  const [playingItemKey, setPlayingItemKey] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      audioService.stopSpeech()
    }
  }, [])

  const handlePlayItem = (key: string, speakText: string) => {
    triggerHaptic('tap')
    if (playingItemKey === key) {
      audioService.stopSpeech()
      setPlayingItemKey(null)
      return
    }
    audioService.stopSpeech()
    setPlayingItemKey(key)
    audioService.speakLanguage(
      speakText,
      speechLocale,
      () => setPlayingItemKey((curr) => (curr === key ? null : curr)),
      () => setPlayingItemKey((curr) => (curr === key ? null : curr))
    )
  }

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Menyiapkan ringkasan hasil pelajaran"
        className="min-h-screen min-h-dvh bg-[#FAFAF9] flex items-center justify-center p-4 sm:p-6"
      >
        <div className="w-full max-w-[1040px] rounded-[28px] sm:rounded-[34px] bg-white border-2 border-slate-200/90 shadow-[0_10px_0_0_rgba(37,99,235,0.07)] grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          <div className="lg:col-span-5 bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFF] to-[#FFFBEB]/70 p-6 sm:p-8 flex flex-col items-center justify-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1 text-xs font-brand font-extrabold text-[#2563EB]">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-blue-300 border-t-[#2563EB] animate-spin" />
              Menyiapkan Ringkasan Hasil...
            </span>
            <div className="w-28 h-28 rounded-full bg-blue-100/80 animate-pulse" />
            <div className="h-6 w-48 rounded-xl bg-blue-100/80 animate-pulse" />
            <div className="grid grid-cols-3 gap-2.5 w-full pt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl border-2 border-blue-100 bg-white/85 animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-5">
            <div className="h-24 rounded-2xl bg-slate-100/90 border-2 border-slate-200/80 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl bg-slate-50 border-2 border-slate-200/80 animate-pulse"
                />
              ))}
            </div>
            <div className="h-13 w-full rounded-2xl bg-emerald-100/70 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const xpProgress = computeXpLevelProgress(totalXp, currentLevel)
  const predicate = getAccuracyPredicate(accuracyPercent)
  const headline = getCelebrationHeadline(accuracyPercent)
  const targetProgressWidth = `${Math.max(5, xpProgress.progressPercent)}%`

  const statCards = [
    {
      id: 'xp',
      value: `+${xpEarned} XP`,
      label: 'Sesi Ini',
      delay: 0.05,
      cardClass: 'border-amber-200 bg-amber-50/85 shadow-[0_4px_0_0_#FDE68A]',
      iconBgClass: 'bg-amber-100 border-amber-200 text-amber-600',
      valueClass: 'text-amber-900',
      labelClass: 'text-amber-700/85',
      Icon: Lightning,
    },
    {
      id: 'accuracy',
      value: `${accuracyPercent}%`,
      label: 'Akurasi',
      delay: 0.12,
      cardClass: 'border-emerald-200 bg-emerald-50/85 shadow-[0_4px_0_0_#A7F3D0]',
      iconBgClass: 'bg-emerald-100 border-emerald-200 text-emerald-600',
      valueClass: 'text-emerald-900',
      labelClass: 'text-emerald-700/85',
      Icon: Target,
    },
    {
      id: 'streak',
      value: `${streakDays} Hari`,
      label: 'Streak',
      delay: 0.19,
      cardClass: 'border-orange-200 bg-orange-50/85 shadow-[0_4px_0_0_#FED7AA]',
      iconBgClass: 'bg-orange-100 border-orange-200 text-orange-600',
      valueClass: 'text-orange-900',
      labelClass: 'text-orange-700/85',
      Icon: Fire,
    },
  ]

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen min-h-dvh w-full max-w-full overflow-x-clip bg-gradient-to-b from-[#F4F8FF] via-[#FAFAF9] to-[#F8FAFC] text-slate-900 font-sans flex flex-col lg:items-center lg:justify-center selection:bg-blue-600/20">
        <div className="w-full max-w-[1040px] mx-auto px-4 pt-4 pb-44 sm:px-6 sm:pt-6 sm:pb-40 lg:py-8 flex-1 lg:flex-none flex items-center">
          <div className="w-full min-w-0 bg-white border-2 border-slate-200/90 rounded-[28px] sm:rounded-[34px] shadow-[0_10px_0_0_rgba(37,99,235,0.07)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* ── LEFT COLUMN: HERO CELEBRATION SPOTLIGHT & REWARD STATS ── */}
            <div className="lg:col-span-5 relative overflow-hidden bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFF] to-[#FFFBEB]/70 p-5 sm:p-7 lg:p-8 flex flex-col items-center justify-between text-center border-b-2 lg:border-b-0 lg:border-r-2 border-slate-200/80 gap-5">
              {/* Static Vector Sunburst, Four-Point Stars & Celebration Ribbons */}
              <svg
                aria-hidden="true"
                viewBox="0 0 400 320"
                className="pointer-events-none select-none absolute inset-x-0 top-0 w-full h-64 opacity-85"
              >
                <circle cx="200" cy="112" r="96" fill="#DBEAFE" fillOpacity="0.45" />
                <circle cx="200" cy="112" r="68" fill="#FEF3C7" fillOpacity="0.48" />
                {/* 4-point celebration stars */}
                <path
                  d="M78 52 L81.5 60.5 L90 64 L81.5 67.5 L78 76 L74.5 67.5 L66 64 L74.5 60.5 Z"
                  fill="#F59E0B"
                />
                <path
                  d="M324 58 L327 65 L334 68 L327 71 L324 78 L321 71 L314 68 L321 65 Z"
                  fill="#3B82F6"
                />
                <path
                  d="M310 148 L312.5 153.5 L318 156 L312.5 158.5 L310 164 L307.5 158.5 L302 156 L307.5 153.5 Z"
                  fill="#10B981"
                />
                {/* Crisp geometric celebration ribbons */}
                <path
                  d="M54 132 C62 120, 74 126, 78 138"
                  stroke="#FB7185"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M336 106 C346 96, 358 102, 360 114"
                  stroke="#F59E0B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="96" cy="166" r="4" fill="#3B82F6" fillOpacity="0.7" />
                <circle cx="292" cy="40" r="3.5" fill="#10B981" fillOpacity="0.75" />
              </svg>

              {/* Status Pills + Enlarged Mera + Celebration Headline */}
              <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                <div className="flex items-center justify-center flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-brand font-black text-[11px] uppercase tracking-wider shadow-2xs">
                    <CheckCircle weight="fill" className="w-3.5 h-3.5" />
                    <span>Pelajaran Selesai</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-blue-200 text-[#2563EB] font-brand font-black text-[11px] shadow-2xs">
                    <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                    <span>Akurasi {predicate}</span>
                  </span>
                </div>

                {/* Open-Stage Atmospheric Spotlight Around Mera */}
                <div className="relative mt-1 flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.92)_0%,rgba(219,234,254,0.35)_65%,transparent_100%)] blur-xs"
                  />
                  <KodiCharacter emotion="celebrate" size={124} interactive className="relative z-10" />
                </div>

                <div className="space-y-1 max-w-sm">
                  <h1 className="text-2xl sm:text-[32px] font-brand font-black text-[#1E293B] tracking-tight leading-tight">
                    {headline}
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 leading-snug break-words">
                    {lessonTitle}
                  </p>
                </div>
              </div>

              {/* 3 Tactile Session Reward Cards (One-Shot Stagger Entrance) */}
              <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-2.5 w-full">
                {statCards.map((stat) => {
                  const Icon = stat.Icon
                  return (
                    <motion.div
                      key={stat.id}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.35, delay: stat.delay, ease: 'easeOut' }
                      }
                      className={`min-w-0 rounded-2xl border-2 px-2 py-2.5 sm:px-3 sm:py-3 space-y-1 flex flex-col items-center justify-center ${stat.cardClass}`}
                    >
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shrink-0 ${stat.iconBgClass}`}
                      >
                        <Icon weight="fill" className="w-4 h-4" />
                      </span>
                      <p
                        className={`text-sm sm:text-lg font-brand font-black leading-tight truncate max-w-full ${stat.valueClass}`}
                      >
                        {stat.value}
                      </p>
                      <p className={`text-[10px] sm:text-[11px] font-bold ${stat.labelClass}`}>
                        {stat.label}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* ── RIGHT COLUMN: XP PROGRESS, COLLECTIBLE BADGES, AUDIO RECAP & DESKTOP CTAS ── */}
            <div className="lg:col-span-7 min-w-0 p-5 sm:p-7 lg:p-8 flex flex-col justify-between gap-5 bg-white">
              <div className="space-y-4 sm:space-y-5">
                {/* Visual XP Level Progress Bar (Auth) OR Save Progress Conversion Card (Guest Trial) */}
                {isGuestTrial ? (
                  <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-sky-50/70 to-white p-4 sm:p-5 text-left space-y-3 shadow-[0_4px_0_0_#DBEAFE]">
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

                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <Button3D
                        variant="blue"
                        size="md"
                        fullWidth
                        onClick={() => navigate('/register?from=trial')}
                        icon={<UserPlus weight="bold" className="w-4 h-4" />}
                        className="flex-1"
                      >
                        DAFTAR GRATIS &amp; KLAIM +{guestPendingTotalXp || xpEarned} XP
                      </Button3D>
                      <Button3D
                        variant="white"
                        size="md"
                        onClick={() => navigate('/login?from=trial')}
                        className="w-full sm:w-auto"
                      >
                        MASUK AKUN
                      </Button3D>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F8FAFC] border-2 border-slate-200/90 rounded-2xl p-4 text-left space-y-2.5 shadow-[0_3px_0_0_#E2E8F0]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 font-brand font-black text-sm text-slate-900">
                        <Star weight="fill" className="w-4 h-4 text-blue-600" />
                        <span>Level {xpProgress.level}</span>
                      </div>
                      <span className="text-xs font-brand font-bold text-slate-600 tabular-nums">
                        {xpProgress.xpInLevel} / {xpProgress.xpForNextLevel} XP • Total{' '}
                        {totalXp.toLocaleString()} XP
                      </span>
                    </div>

                    <div className="h-3.5 w-full rounded-full bg-slate-200/80 overflow-hidden border border-slate-200">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 gloss-shine"
                        initial={shouldReduceMotion ? false : { width: '0%' }}
                        animate={{ width: targetProgressWidth }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.65, ease: 'easeOut' }
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>
                        Butuh <strong className="text-slate-700">{xpProgress.xpRemaining} XP</strong> lagi ke
                        Level {xpProgress.level + 1}
                      </span>
                      <span className="font-mono font-bold text-slate-600">
                        {xpProgress.progressPercent}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Newly Unlocked Collectible Badges (Smart Adaptive Grid) */}
                {awardedBadges.length > 0 && (
                  <div className="space-y-2 text-left">
                    <p className="text-[11px] font-brand font-black uppercase tracking-wider text-slate-500 px-0.5">
                      Lencana Baru Terbuka
                    </p>
                    <div
                      className={`grid gap-2.5 ${
                        awardedBadges.length === 1
                          ? 'grid-cols-1'
                          : 'grid-cols-1 sm:grid-cols-2'
                      }`}
                    >
                      {awardedBadges.map((badge) => (
                        <div
                          key={badge.id}
                          className="min-w-0 bg-gradient-to-r from-[#EFF6FF] via-white to-[#FFFBEB]/80 border-2 border-blue-200/90 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-[0_4px_0_0_#DBEAFE]"
                        >
                          <AchievementBadgeEmblem
                            icon={badge.icon}
                            category={badge.category}
                            isEarned
                            size={48}
                            className="shrink-0"
                          />
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-brand font-black text-sm text-slate-900 truncate">
                                {badge.title}
                              </p>
                              {badge.xp_reward > 0 && (
                                <span className="shrink-0 text-[10px] font-brand font-black px-2 py-0.5 rounded-md bg-amber-100 border border-amber-200 text-amber-800">
                                  +{badge.xp_reward} XP
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                              {badge.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Learned Characters & Vocabulary Recap */}
                {learnedItems.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
                      <p className="text-[11px] font-brand font-black uppercase tracking-wider text-slate-500">
                        Aksara &amp; Kosakata yang Dikuasai ({learnedItems.length})
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenFlashcards}
                        className="inline-flex items-center gap-1 text-[11px] font-brand font-black text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        <Cards weight="bold" className="w-3.5 h-3.5" />
                        <span>Ulas di Flashcard →</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {learnedItems.map((item, idx) => {
                        const itemKey = `${item.symbol}-${idx}`
                        const isPlaying = playingItemKey === itemKey
                        return (
                          <button
                            key={itemKey}
                            type="button"
                            aria-pressed={isPlaying}
                            onClick={() => handlePlayItem(itemKey, item.speakText)}
                            aria-label={`Dengarkan ${item.symbol} (${item.reading})`}
                            className={`group min-w-0 rounded-2xl border-2 p-2.5 sm:p-3 text-left flex items-start justify-between gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 ${
                              isPlaying
                                ? 'border-[#2563EB] bg-[#EFF6FF] shadow-[0_3px_0_0_#93C5FD]'
                                : 'border-slate-200/90 bg-slate-50/75 hover:bg-blue-50/50 hover:border-blue-200'
                            }`}
                          >
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <p className="text-lg sm:text-xl font-brand font-black text-slate-900 truncate leading-tight">
                                {item.symbol}
                              </p>
                              <p className="text-[11px] font-mono font-bold text-blue-700 truncate">
                                {item.reading}
                              </p>
                              <p className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-snug">
                                {item.meaning}
                              </p>
                            </div>
                            <span
                              aria-hidden="true"
                              className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                isPlaying
                                  ? 'bg-white border-blue-200 text-[#2563EB]'
                                  : 'bg-white border-slate-200/90 text-blue-500 group-hover:border-blue-200'
                              }`}
                            >
                              {isPlaying ? (
                                <MiniAudioBars reducedMotion={shouldReduceMotion} />
                              ) : (
                                <SpeakerHigh weight="fill" className="w-3.5 h-3.5" />
                              )}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Inline Action Bar (always visible without scrolling on lg+) */}
              <div className="hidden lg:block pt-3 border-t border-slate-100">
                <LessonCompleteActionButtons
                  unlockedNextLessonId={unlockedNextLessonId}
                  onNextLesson={handleNextLesson}
                  onReplayLesson={handleReplayLesson}
                  onBackToCurriculum={handleBackToCurriculum}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Sticky Bottom Action Dock */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-slate-200/90 px-4 py-3 shadow-[0_-8px_24px_-8px_rgba(15,23,42,0.12)]">
          <div className="max-w-xl mx-auto">
            <LessonCompleteActionButtons
              compact
              unlockedNextLessonId={unlockedNextLessonId}
              onNextLesson={handleNextLesson}
              onReplayLesson={handleReplayLesson}
              onBackToCurriculum={handleBackToCurriculum}
            />
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
