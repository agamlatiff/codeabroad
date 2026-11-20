import { ArrowRight, Check, Crown, Play, Trophy } from '@phosphor-icons/react'
import { Button3D } from "@/shared/components/ui/Button3D"
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"
import { GemIcon, XpBoltIcon } from "@/shared/components/ui/GamificationIcons"
import type { MilestoneChallengeViewItem } from "@/features/gamification/constants/gamificationCatalog"

export interface MilestoneChallengesSectionProps {
  challenges: MilestoneChallengeViewItem[]
  onStartChallenge: (route: string) => void
  onContinueCurriculum: () => void
}

export const MilestoneChallengesSection = ({
  challenges,
  onStartChallenge,
  onContinueCurriculum,
}: MilestoneChallengesSectionProps) => {
  if (challenges.length === 0) {
    return (
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-2xs">
        <div className="flex items-center justify-center mx-auto">
          <KodiCharacter emotion="curious" size={108} interactive />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="font-brand font-black text-base sm:text-lg text-slate-900">
            Tantangan Capstone Belum Terbuka
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Tantangan evaluasi tingkat lanjut memerlukan penguasaan modul dasar &amp; menengah. Selesaikan pelajaran kurikulum bahasa terlebih dahulu!
          </p>
        </div>
        <Button3D
          variant="blue"
          size="md"
          onClick={onContinueCurriculum}
          className="text-xs sm:text-sm px-6 py-3 mx-auto"
        >
          <span className="inline-flex items-center gap-1.5">
            <span>Tingkatkan Level di Kurikulum</span>
            <Play weight="fill" className="w-3.5 h-3.5" />
          </span>
        </Button3D>
      </div>
    )
  }

  const totalXpBounty = challenges.reduce((sum, item) => sum + item.xp_reward, 0)
  const totalGemBounty = challenges.reduce((sum, item) => sum + item.gem_reward, 0)

  return (
    <div className="space-y-4">
      {/* Console Header Bar */}
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-violet-500 to-indigo-600 shadow-[0_3px_0_0_#3730A3] text-white flex items-center justify-center shrink-0">
            <Trophy weight="fill" className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-brand font-black text-base sm:text-lg text-slate-900 flex items-center gap-2 flex-wrap">
              <span>Tantangan Penguasaan Bahasa</span>
              <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md border border-purple-200">
                MILESTONE TEST
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Uji kemampuan membaca, menyimak, dan percakapan bisnis standar sertifikasi global.
            </p>
          </div>
        </div>

        {/* Total Bounty Vector Badge */}
        <div className="flex items-center gap-2 text-xs font-brand font-black bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-2xl text-amber-900 shrink-0 self-start sm:self-auto shadow-2xs">
          <span className="text-amber-700">Bounty:</span>
          <span className="inline-flex items-center gap-1 text-amber-700">
            <XpBoltIcon className="w-3.5 h-3.5 shrink-0" />
            <span>+{totalXpBounty} XP</span>
          </span>
          <span className="text-amber-300">•</span>
          <span className="inline-flex items-center gap-1 text-sky-700">
            <GemIcon className="w-3.5 h-3.5 shrink-0" />
            <span>+{totalGemBounty} Gems</span>
          </span>
        </div>
      </div>

      {/* Elevated Challenge Cards with Gradient Top Accent Strip */}
      <div className="space-y-3.5">
        {challenges.map((challenge, idx) => {
          const ChallengeIcon = challenge.iconComponent
          const topStripClass =
            idx === 0
              ? 'bg-gradient-to-r from-orange-400 via-rose-500 to-amber-500'
              : 'bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500'

          return (
            <div
              key={challenge.id}
              className="relative bg-white border-2 border-slate-200/90 border-b-[4px] border-b-slate-300 rounded-3xl overflow-hidden shadow-2xs hover:border-slate-300 transition-all group"
            >
              {/* Top Gradient Accent Strip */}
              <div className={`h-1.5 w-full ${topStripClass}`} />

              {/* Subtle Geometric Dot Watermark */}
              <svg
                className="absolute right-0 top-0 w-44 h-44 text-slate-900 opacity-[0.04] pointer-events-none"
                viewBox="0 0 120 120"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="96" cy="24" r="2.5" />
                <circle cx="110" cy="24" r="2.5" />
                <circle cx="82" cy="38" r="2.5" />
                <circle cx="96" cy="38" r="2.5" />
                <circle cx="110" cy="38" r="2.5" />
                <circle cx="96" cy="52" r="2.5" />
                <circle cx="110" cy="52" r="2.5" />
              </svg>

              <div className="relative z-10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                {/* Left: Unified 3D Icon & Info */}
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  <div
                    className={`w-13 h-13 rounded-2xl ${challenge.iconBg} text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <ChallengeIcon weight="fill" className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black font-mono px-2.5 py-0.5 rounded-md border border-amber-400 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 text-amber-950 uppercase tracking-wider inline-flex items-center gap-1 shadow-2xs">
                        <Crown weight="fill" className="w-3 h-3 text-amber-700" />
                        <span>S-Rank Capstone</span>
                      </span>
                      {challenge.isCompleted && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                          <Check weight="bold" className="w-3 h-3 text-emerald-600" />
                          <span>LULUS KUALIFIKASI</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      {challenge.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
                      {challenge.subtitle}
                    </p>

                    <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                      {challenge.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Vector Bounty & Tactile CTA */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Bounty
                    </div>
                    <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-0.5 font-brand font-black text-xs">
                      <span className="inline-flex items-center gap-1 text-amber-700">
                        <XpBoltIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>+{challenge.xp_reward} XP</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-sky-700">
                        <GemIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>+{challenge.gem_reward} Gems</span>
                      </span>
                    </div>
                  </div>

                  <Button3D
                    variant={challenge.isCompleted ? 'ghost' : idx === 0 ? 'amber' : 'blue'}
                    size="sm"
                    onClick={() => onStartChallenge(challenge.route)}
                    className={`text-xs px-4 py-2 ${
                      challenge.isCompleted
                        ? 'border border-emerald-300 bg-emerald-50 text-emerald-700'
                        : ''
                    }`}
                  >
                    {challenge.isCompleted ? (
                      <span className="inline-flex items-center gap-1">
                        <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600" />
                        <span>LIHAT HASIL</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <span>MULAI SAYEMBARA</span>
                        <ArrowRight weight="bold" className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </Button3D>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
