import { useId } from 'react'
import {
  ArrowRight,
  BookOpen,
  Certificate,
  CheckCircle,
  Headphones,
  Lock,
  Medal,
  Microphone,
  PencilSimple,
  Play,
  Sparkle,
} from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { XpBoltIcon } from '@/shared/components/ui/GamificationIcons'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { AchievementBadgeEmblem } from '@/features/gamification/components/AchievementBadgeEmblem'
import { triggerHaptic } from '@/shared/utils/haptics'
import type {
  AchievementBadgeViewItem,
  BadgeFilterTab,
  LevelExamSummary,
} from '@/features/gamification/constants/gamificationCatalog'

export interface MilestonesAndBadgesSectionProps {
  examSummary: LevelExamSummary | null
  badges: AchievementBadgeViewItem[]
  totalBadgeCount: number
  earnedBadgeCount: number
  badgeFilter: BadgeFilterTab
  onChangeBadgeFilter: (filter: BadgeFilterTab) => void
  isLoading: boolean
  onNavigate: (route: string) => void
  onSwitchToDaily: () => void
  onOpenTrackSwitcher: () => void
}

const EXAM_PILLARS = [
  { key: 'reading', label: 'Reading', Icon: BookOpen },
  { key: 'listening', label: 'Listening', Icon: Headphones },
  { key: 'writing', label: 'Writing', Icon: PencilSimple },
  { key: 'speaking', label: 'Speaking', Icon: Microphone },
] as const

export const MilestonesAndBadgesSection = ({
  examSummary,
  badges,
  totalBadgeCount,
  earnedBadgeCount,
  badgeFilter,
  onChangeBadgeFilter,
  isLoading,
  onNavigate,
  onSwitchToDaily,
  onOpenTrackSwitcher,
}: MilestonesAndBadgesSectionProps) => {
  const examPatternId = `exam-card-seigaiha-${useId().replace(/:/g, '')}`

  const handleBadgeAction = (badge: AchievementBadgeViewItem) => {
    triggerHaptic('tap')
    if (badge.actionType === 'switch_tab_daily') {
      onSwitchToDaily()
    } else if (badge.actionType === 'open_track_switcher') {
      onOpenTrackSwitcher()
    } else if (badge.actionRoute) {
      onNavigate(badge.actionRoute)
    }
  }

  const lockedBadgeCount = Math.max(0, totalBadgeCount - earnedBadgeCount)
  const filterOptions: ReadonlyArray<{ id: BadgeFilterTab; label: string }> = [
    { id: 'all', label: `Semua (${totalBadgeCount})` },
    { id: 'earned', label: `Diraih (${earnedBadgeCount})` },
    { id: 'locked', label: `Belum (${lockedBadgeCount})` },
  ]

  return (
    <div className="space-y-5">
      {/* ── BLOK ATAS: KARTU HERO UJIAN KESIAPAN LEVEL ── */}
      {isLoading && !examSummary ? (
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 space-y-4 animate-pulse">
          <div className="h-5 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-full max-w-md bg-slate-100 rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="h-12 bg-slate-100 rounded-xl" />
            ))}
          </div>
          <div className="h-10 w-full bg-slate-100 rounded-2xl" />
        </div>
      ) : examSummary ? (
        <section className="relative bg-white border-2 border-slate-200/90 border-b-[4px] border-b-slate-300 rounded-3xl overflow-hidden shadow-2xs">
          {/* Status Accent Strip */}
          <div
            className={`h-1.5 w-full ${
              examSummary.status === 'passed'
                ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500'
                : examSummary.status === 'ready'
                  ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500'
            }`}
          />

          {/* Subtle Seigaiha Background Watermark */}
          <svg
            className="absolute inset-0 w-full h-full text-indigo-900 opacity-[0.035] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id={examPatternId} width="48" height="24" patternUnits="userSpaceOnUse">
                <path
                  d="M0 24A12 12 0 0 1 24 24M24 24A12 12 0 0 1 48 24M12 12A12 12 0 0 1 36 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${examPatternId})`} />
          </svg>

          <div className="relative z-10 p-5 sm:p-6 space-y-4">
            {/* Top Meta & Status Badges */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div
                  className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center shrink-0 ${
                    examSummary.status === 'passed'
                      ? 'bg-gradient-to-b from-emerald-400 to-teal-600 shadow-[0_3px_0_0_#0F766E]'
                      : examSummary.status === 'ready'
                        ? 'bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_3px_0_0_#B45309]'
                        : 'bg-gradient-to-b from-indigo-500 to-blue-600 shadow-[0_3px_0_0_#1E40AF]'
                  }`}
                >
                  <Certificate weight="fill" className="w-6 h-6" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800">
                      Ujian Kesiapan Level
                    </span>

                    {examSummary.status === 'passed' ? (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 inline-flex items-center gap-1">
                        <CheckCircle weight="fill" className="w-3 h-3 text-emerald-600" />
                        <span>
                          LULUS • {examSummary.passedResult?.attempt?.score_percent ?? 100}%
                        </span>
                      </span>
                    ) : examSummary.status === 'ready' ? (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 inline-flex items-center gap-1">
                        <Sparkle weight="fill" className="w-3 h-3 text-amber-600" />
                        <span>SIAP DIUJI</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 inline-flex items-center gap-1">
                        <Lock weight="bold" className="w-3 h-3 text-slate-500" />
                        <span>
                          TERKUNCI • {examSummary.completedLessons}/{examSummary.totalLessons}{' '}
                          PELAJARAN
                        </span>
                      </span>
                    )}
                  </div>

                  <h2 className="font-brand font-black text-base sm:text-lg text-slate-900 leading-snug">
                    Ujian Kesiapan {examSummary.examName} ({examSummary.levelCode})
                  </h2>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {examSummary.status === 'passed'
                      ? `Selamat! Ujian kesiapan ${examSummary.languageName} tingkat ${examSummary.levelCode} sudah lulus.`
                      : examSummary.status === 'ready'
                        ? `Semua ${examSummary.totalLessons} pelajaran tuntas! Raih minimal ${examSummary.passingScorePercent}% untuk naik tingkat & membuka Lencana Kelulusan.`
                        : `Tuntaskan ${examSummary.totalLessons - examSummary.completedLessons} pelajaran lagi di ${examSummary.languageName} ${examSummary.levelCode} untuk membuka ujian kelulusan level (min. ${examSummary.passingScorePercent}%).`}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-brand font-black text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl shrink-0">
                <XpBoltIcon className="w-3.5 h-3.5 shrink-0" />
                <span>+250 XP (Skor ≥ {examSummary.passingScorePercent}%)</span>
              </span>
            </div>

            {/* 4-Pillar Exam Blueprint / Passed Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EXAM_PILLARS.map(({ key, label, Icon }) => {
                const attempt = examSummary.passedResult?.attempt
                const pillarScore =
                  key === 'reading'
                    ? attempt?.reading_score
                    : key === 'listening'
                      ? attempt?.listening_score
                      : key === 'writing'
                        ? attempt?.writing_score
                        : attempt?.speaking_score

                return (
                  <div
                    key={key}
                    className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
                      examSummary.status === 'passed'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50/80 border-slate-200/80 text-slate-700'
                    }`}
                  >
                    <Icon
                      weight="bold"
                      className={`w-4 h-4 shrink-0 ${
                        examSummary.status === 'passed' ? 'text-emerald-600' : 'text-indigo-500'
                      }`}
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] font-black block leading-tight">{label}</span>
                      <span className="text-[10px] font-semibold text-slate-500 block">
                        {examSummary.status === 'passed' && typeof pillarScore === 'number'
                          ? `Skor ${pillarScore}%`
                          : 'Bagian Ujian'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Progress Bar & Smart Contextual Action Button */}
            <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
              {examSummary.status === 'passed' ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 pt-2 sm:pt-0">
                  <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {examSummary.passedResult?.certificate?.certificate_id
                      ? `Sertifikat #${examSummary.passedResult.certificate.certificate_id}`
                      : `Sertifikat Kesiapan ${examSummary.levelCode} Terbit`}
                  </span>
                </div>
              ) : (
                <div className="flex-1 space-y-1.5 min-w-0 pt-2 sm:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-600">
                      Syarat Buka Ujian: {examSummary.completedLessons} / {examSummary.totalLessons}{' '}
                      Pelajaran
                    </span>
                    <span className="font-mono text-indigo-700">{examSummary.progressPercent}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full border border-slate-200 p-0.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        examSummary.status === 'ready'
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}
                      style={{ width: `${examSummary.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="shrink-0 self-end sm:self-center">
                {examSummary.status === 'passed' ? (
                  <Button3D
                    variant="emerald"
                    size="sm"
                    onClick={() => {
                      triggerHaptic('tap')
                      onNavigate(examSummary.examRoute)
                    }}
                    className="text-xs px-4 py-2"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Certificate weight="fill" className="w-4 h-4" />
                      <span>LIHAT SERTIFIKAT</span>
                    </span>
                  </Button3D>
                ) : examSummary.status === 'ready' ? (
                  <Button3D
                    variant="amber"
                    size="sm"
                    onClick={() => {
                      triggerHaptic('tap')
                      onNavigate(examSummary.examRoute)
                    }}
                    className="text-xs px-4 py-2"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span>MULAI UJIAN KESIAPAN</span>
                      <ArrowRight weight="bold" className="w-3.5 h-3.5" />
                    </span>
                  </Button3D>
                ) : (
                  <Button3D
                    variant="blue"
                    size="sm"
                    onClick={() => {
                      triggerHaptic('tap')
                      onNavigate(examSummary.nextLessonRoute)
                    }}
                    className="text-xs px-4 py-2"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Play weight="fill" className="w-3 h-3" />
                      <span>
                        {examSummary.nextLessonTitle
                          ? `Lanjut: ${examSummary.nextLessonTitle}`
                          : 'Lanjutkan Kurikulum'}
                      </span>
                    </span>
                  </Button3D>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── BLOK BAWAH: KOLEKSI LENCANA PENCAPAIAN NYATA (2 KOLOM) ── */}
      <section className="space-y-3.5">
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_3px_0_0_#B45309] text-white flex items-center justify-center shrink-0">
              <Medal weight="fill" className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-brand font-black text-base sm:text-lg text-slate-900">
                  Koleksi Lencana
                </h2>
                <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                  {earnedBadgeCount}/{totalBadgeCount} Diraih
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Terbuka otomatis saat mencapai target belajar, streak harian, &amp; latihan ulang rutin.
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
            {filterOptions.map((option) => {
              const isSelected = badgeFilter === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap')
                    onChangeBadgeFilter(option.id)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB] text-white border-[#1D4ED8] shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Badge Collectible Grid */}
        {badges.length === 0 ? (
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 text-center space-y-3 shadow-2xs">
            <div className="flex justify-center">
              <KodiCharacter
                emotion={badgeFilter === 'locked' && totalBadgeCount > 0 ? 'celebrate' : 'curious'}
                size={92}
                interactive
              />
            </div>
            <h3 className="font-brand font-black text-sm sm:text-base text-slate-900">
              {badgeFilter === 'earned'
                ? 'Belum Ada Lencana yang Diraih'
                : badgeFilter === 'locked' && totalBadgeCount > 0
                  ? 'Semua Lencana Sudah Dikoleksi!'
                  : 'Memuat Daftar Lencana...'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {badgeFilter === 'earned'
                ? 'Selesaikan pelajaran pertamamu, jaga streak harian, atau ulas kartu flashcard untuk membuka lencana pertamamu.'
                : badgeFilter === 'locked' && totalBadgeCount > 0
                  ? 'Luar biasa! Seluruh lencana pencapaian yang tersedia sudah terpasang di koleksimu.'
                  : 'Sedang mengambil katalog lencana pencapaian dari server.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {badges.map((badge) => (
              <article
                key={badge.id}
                className={`rounded-3xl border-2 p-4 flex flex-col justify-between gap-3.5 transition-all shadow-2xs ${
                  badge.isEarned
                    ? 'bg-gradient-to-br from-amber-50/45 via-white to-emerald-50/35 border-emerald-200/90 border-b-[4px] border-b-emerald-300'
                    : 'bg-white border-slate-200/90 border-b-[4px] border-b-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <AchievementBadgeEmblem
                    icon={badge.icon}
                    category={badge.category}
                    isEarned={badge.isEarned}
                    size={56}
                    className="shrink-0"
                  />

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-brand font-black text-sm text-slate-900 leading-snug">
                        {badge.title}
                      </h3>
                      {badge.xpReward > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-brand font-black px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 shrink-0">
                          <XpBoltIcon className="w-3 h-3 shrink-0" />
                          <span>+{badge.xpReward} XP</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Earned Timestamp or Real Progress & Shortcut Action */}
                <div className="pt-2.5 border-t border-slate-100 space-y-2">
                  {badge.isEarned ? (
                    <div className="flex items-center justify-between text-[11px] font-black text-emerald-700">
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Diraih{badge.awardedAt ? ` • ${badge.awardedAt}` : ''}</span>
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600">
                        TERBUKA
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600 font-mono">{badge.progressLabel}</span>
                        <span className="text-blue-700 font-mono">{badge.progressPercent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${badge.progressPercent}%` }}
                        />
                      </div>
                      {badge.actionLabel && (
                        <div className="pt-0.5 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleBadgeAction(badge)}
                            className="text-[11px] font-black text-[#2563EB] hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>{badge.actionLabel}</span>
                            <ArrowRight weight="bold" className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
